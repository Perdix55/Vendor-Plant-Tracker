import { Router } from "express";
import { db } from "@workspace/db";
import {
  ordersTable,
  orderItemsTable,
  vendorsTable,
  productsTable,
} from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";

const router = Router();

function mapOrder(order: any, items: any[]) {
  return {
    id: order.id,
    vendorId: order.vendorId,
    vendorName: order.vendorName,
    weekDate: order.weekDate,
    shipDate: order.shipDate ?? null,
    arriveDate: order.arriveDate ?? null,
    status: order.status,
    notes: order.notes ?? null,
    items: items.map(mapItem),
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
    updatedAt: order.updatedAt instanceof Date ? order.updatedAt.toISOString() : order.updatedAt,
  };
}

function mapItem(item: any) {
  return {
    id: item.id,
    orderId: item.orderId,
    productId: item.productId,
    productName: item.productName ?? item.name ?? "",
    packSize: item.packSize ?? null,
    quantityOrdered: item.quantityOrdered,
    quantityConfirmed: item.quantityConfirmed ?? null,
    availability: item.availability ?? null,
    notes: item.notes ?? null,
  };
}

// GET /orders
router.get("/orders", async (req, res) => {
  try {
    const { vendorId, status, weekDate } = req.query as Record<string, string | undefined>;

    const conditions = [];
    if (vendorId) conditions.push(eq(ordersTable.vendorId, parseInt(vendorId, 10)));
    if (status) conditions.push(eq(ordersTable.status, status));
    if (weekDate) conditions.push(eq(ordersTable.weekDate, weekDate));

    const orders = await db
      .select({
        id: ordersTable.id,
        vendorId: ordersTable.vendorId,
        vendorName: vendorsTable.name,
        weekDate: ordersTable.weekDate,
        shipDate: ordersTable.shipDate,
        arriveDate: ordersTable.arriveDate,
        status: ordersTable.status,
        notes: ordersTable.notes,
        createdAt: ordersTable.createdAt,
      })
      .from(ordersTable)
      .innerJoin(vendorsTable, eq(vendorsTable.id, ordersTable.vendorId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(ordersTable.createdAt));

    // Get item counts per order
    const orderIds = orders.map((o) => o.id);
    let itemCounts: Record<number, { total: number; confirmed: number; totalQty: number }> = {};

    if (orderIds.length > 0) {
      const items = await db
        .select()
        .from(orderItemsTable)
        .where(
          sql`${orderItemsTable.orderId} = ANY(ARRAY[${sql.join(orderIds.map((id) => sql`${id}`), sql`, `)}]::int[])`
        );
      for (const item of items) {
        if (!itemCounts[item.orderId]) itemCounts[item.orderId] = { total: 0, confirmed: 0, totalQty: 0 };
        itemCounts[item.orderId].total++;
        itemCounts[item.orderId].totalQty += item.quantityOrdered;
        if (item.availability === "available" || item.availability === "partial") {
          itemCounts[item.orderId].confirmed++;
        }
      }
    }

    res.json(
      orders.map((o) => ({
        id: o.id,
        vendorId: o.vendorId,
        vendorName: o.vendorName,
        weekDate: o.weekDate,
        shipDate: o.shipDate ?? null,
        arriveDate: o.arriveDate ?? null,
        status: o.status,
        notes: o.notes ?? null,
        totalItems: itemCounts[o.id]?.total ?? 0,
        confirmedItems: itemCounts[o.id]?.confirmed ?? 0,
        totalQuantity: itemCounts[o.id]?.totalQty ?? 0,
        createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : o.createdAt,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /orders
router.post("/orders", async (req, res) => {
  try {
    const { vendorId, weekDate, shipDate, arriveDate, notes, items } = req.body;

    if (!vendorId || !weekDate || !Array.isArray(items)) {
      return res.status(400).json({ error: "vendorId, weekDate, and items are required" });
    }

    const [order] = await db
      .insert(ordersTable)
      .values({ vendorId, weekDate, shipDate, arriveDate, notes, status: "draft" })
      .returning();

    if (items.length > 0) {
      await db.insert(orderItemsTable).values(
        items.map((item: any) => ({
          orderId: order.id,
          productId: item.productId,
          quantityOrdered: item.quantityOrdered,
        }))
      );
    }

    const fullItems = await db
      .select({
        id: orderItemsTable.id,
        orderId: orderItemsTable.orderId,
        productId: orderItemsTable.productId,
        productName: productsTable.name,
        packSize: productsTable.packSize,
        quantityOrdered: orderItemsTable.quantityOrdered,
        quantityConfirmed: orderItemsTable.quantityConfirmed,
        availability: orderItemsTable.availability,
        notes: orderItemsTable.notes,
      })
      .from(orderItemsTable)
      .innerJoin(productsTable, eq(productsTable.id, orderItemsTable.productId))
      .where(eq(orderItemsTable.orderId, order.id));

    const [vendor] = await db.select().from(vendorsTable).where(eq(vendorsTable.id, vendorId));

    res.status(201).json(
      mapOrder({ ...order, vendorName: vendor?.name ?? "" }, fullItems)
    );
  } catch (err) {
    req.log.error({ err }, "Failed to create order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /orders/:orderId
router.get("/orders/:orderId", async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);

    const rows = await db
      .select({
        id: ordersTable.id,
        vendorId: ordersTable.vendorId,
        vendorName: vendorsTable.name,
        weekDate: ordersTable.weekDate,
        shipDate: ordersTable.shipDate,
        arriveDate: ordersTable.arriveDate,
        status: ordersTable.status,
        notes: ordersTable.notes,
        createdAt: ordersTable.createdAt,
        updatedAt: ordersTable.updatedAt,
      })
      .from(ordersTable)
      .innerJoin(vendorsTable, eq(vendorsTable.id, ordersTable.vendorId))
      .where(eq(ordersTable.id, orderId));

    if (!rows.length) return res.status(404).json({ error: "Order not found" });

    const items = await db
      .select({
        id: orderItemsTable.id,
        orderId: orderItemsTable.orderId,
        productId: orderItemsTable.productId,
        productName: productsTable.name,
        packSize: productsTable.packSize,
        quantityOrdered: orderItemsTable.quantityOrdered,
        quantityConfirmed: orderItemsTable.quantityConfirmed,
        availability: orderItemsTable.availability,
        notes: orderItemsTable.notes,
      })
      .from(orderItemsTable)
      .innerJoin(productsTable, eq(productsTable.id, orderItemsTable.productId))
      .where(eq(orderItemsTable.orderId, orderId));

    res.json(mapOrder(rows[0], items));
  } catch (err) {
    req.log.error({ err }, "Failed to get order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /orders/:orderId
router.patch("/orders/:orderId", async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const { status, notes, shipDate, arriveDate } = req.body;

    const updateData: any = { updatedAt: new Date() };
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (shipDate !== undefined) updateData.shipDate = shipDate;
    if (arriveDate !== undefined) updateData.arriveDate = arriveDate;

    await db.update(ordersTable).set(updateData).where(eq(ordersTable.id, orderId));

    const rows = await db
      .select({
        id: ordersTable.id,
        vendorId: ordersTable.vendorId,
        vendorName: vendorsTable.name,
        weekDate: ordersTable.weekDate,
        shipDate: ordersTable.shipDate,
        arriveDate: ordersTable.arriveDate,
        status: ordersTable.status,
        notes: ordersTable.notes,
        createdAt: ordersTable.createdAt,
        updatedAt: ordersTable.updatedAt,
      })
      .from(ordersTable)
      .innerJoin(vendorsTable, eq(vendorsTable.id, ordersTable.vendorId))
      .where(eq(ordersTable.id, orderId));

    if (!rows.length) return res.status(404).json({ error: "Order not found" });

    const items = await db
      .select({
        id: orderItemsTable.id,
        orderId: orderItemsTable.orderId,
        productId: orderItemsTable.productId,
        productName: productsTable.name,
        packSize: productsTable.packSize,
        quantityOrdered: orderItemsTable.quantityOrdered,
        quantityConfirmed: orderItemsTable.quantityConfirmed,
        availability: orderItemsTable.availability,
        notes: orderItemsTable.notes,
      })
      .from(orderItemsTable)
      .innerJoin(productsTable, eq(productsTable.id, orderItemsTable.productId))
      .where(eq(orderItemsTable.orderId, orderId));

    res.json(mapOrder(rows[0], items));
  } catch (err) {
    req.log.error({ err }, "Failed to update order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /orders/:orderId
router.delete("/orders/:orderId", async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    await db.delete(ordersTable).where(eq(ordersTable.id, orderId));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /orders/:orderId/items
router.get("/orders/:orderId/items", async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const items = await db
      .select({
        id: orderItemsTable.id,
        orderId: orderItemsTable.orderId,
        productId: orderItemsTable.productId,
        productName: productsTable.name,
        packSize: productsTable.packSize,
        quantityOrdered: orderItemsTable.quantityOrdered,
        quantityConfirmed: orderItemsTable.quantityConfirmed,
        availability: orderItemsTable.availability,
        notes: orderItemsTable.notes,
      })
      .from(orderItemsTable)
      .innerJoin(productsTable, eq(productsTable.id, orderItemsTable.productId))
      .where(eq(orderItemsTable.orderId, orderId));

    res.json(items.map(mapItem));
  } catch (err) {
    req.log.error({ err }, "Failed to list order items");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /orders/:orderId/items
router.post("/orders/:orderId/items", async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const { productId, quantityOrdered } = req.body;

    const [item] = await db
      .insert(orderItemsTable)
      .values({ orderId, productId, quantityOrdered })
      .returning();

    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId));

    res.status(201).json(mapItem({ ...item, productName: product?.name ?? "", packSize: product?.packSize }));
  } catch (err) {
    req.log.error({ err }, "Failed to add order item");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /orders/:orderId/items/:itemId
router.patch("/orders/:orderId/items/:itemId", async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId, 10);
    const { quantityOrdered, quantityConfirmed, availability, notes } = req.body;

    const updateData: any = {};
    if (quantityOrdered !== undefined) updateData.quantityOrdered = quantityOrdered;
    if (quantityConfirmed !== undefined) updateData.quantityConfirmed = quantityConfirmed;
    if (availability !== undefined) updateData.availability = availability;
    if (notes !== undefined) updateData.notes = notes;

    await db.update(orderItemsTable).set(updateData).where(eq(orderItemsTable.id, itemId));

    const rows = await db
      .select({
        id: orderItemsTable.id,
        orderId: orderItemsTable.orderId,
        productId: orderItemsTable.productId,
        productName: productsTable.name,
        packSize: productsTable.packSize,
        quantityOrdered: orderItemsTable.quantityOrdered,
        quantityConfirmed: orderItemsTable.quantityConfirmed,
        availability: orderItemsTable.availability,
        notes: orderItemsTable.notes,
      })
      .from(orderItemsTable)
      .innerJoin(productsTable, eq(productsTable.id, orderItemsTable.productId))
      .where(eq(orderItemsTable.id, itemId));

    if (!rows.length) return res.status(404).json({ error: "Item not found" });
    res.json(mapItem(rows[0]));
  } catch (err) {
    req.log.error({ err }, "Failed to update order item");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /orders/:orderId/items/:itemId
router.delete("/orders/:orderId/items/:itemId", async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId, 10);
    await db.delete(orderItemsTable).where(eq(orderItemsTable.id, itemId));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete order item");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /orders/:orderId/confirm
router.post("/orders/:orderId/confirm", async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "items array required" });
    }

    for (const item of items) {
      const updateData: any = { availability: item.availability };
      if (item.quantityConfirmed !== undefined) updateData.quantityConfirmed = item.quantityConfirmed;
      if (item.notes !== undefined) updateData.notes = item.notes;
      await db.update(orderItemsTable).set(updateData).where(eq(orderItemsTable.id, item.itemId));
    }

    // Determine new order status
    const allItems = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, orderId));
    const hasUnavailable = allItems.some((i) => i.availability === "unavailable");
    const allAvailable = allItems.every((i) => i.availability === "available");
    const anyConfirmed = allItems.some((i) => i.availability !== null && i.availability !== "pending");

    let newStatus = "sent";
    if (allAvailable) newStatus = "confirmed";
    else if (hasUnavailable && anyConfirmed) newStatus = "partial";

    await db.update(ordersTable).set({ status: newStatus, updatedAt: new Date() }).where(eq(ordersTable.id, orderId));

    const rows = await db
      .select({
        id: ordersTable.id,
        vendorId: ordersTable.vendorId,
        vendorName: vendorsTable.name,
        weekDate: ordersTable.weekDate,
        shipDate: ordersTable.shipDate,
        arriveDate: ordersTable.arriveDate,
        status: ordersTable.status,
        notes: ordersTable.notes,
        createdAt: ordersTable.createdAt,
        updatedAt: ordersTable.updatedAt,
      })
      .from(ordersTable)
      .innerJoin(vendorsTable, eq(vendorsTable.id, ordersTable.vendorId))
      .where(eq(ordersTable.id, orderId));

    const fullItems = await db
      .select({
        id: orderItemsTable.id,
        orderId: orderItemsTable.orderId,
        productId: orderItemsTable.productId,
        productName: productsTable.name,
        packSize: productsTable.packSize,
        quantityOrdered: orderItemsTable.quantityOrdered,
        quantityConfirmed: orderItemsTable.quantityConfirmed,
        availability: orderItemsTable.availability,
        notes: orderItemsTable.notes,
      })
      .from(orderItemsTable)
      .innerJoin(productsTable, eq(productsTable.id, orderItemsTable.productId))
      .where(eq(orderItemsTable.orderId, orderId));

    res.json(mapOrder(rows[0], fullItems));
  } catch (err) {
    req.log.error({ err }, "Failed to confirm order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
