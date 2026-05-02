import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, vendorsTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

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

// GET /vendor-confirm/:token — public, no auth required
router.get("/vendor-confirm/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const rows = await db
      .select({
        id: ordersTable.id,
        vendorId: ordersTable.vendorId,
        vendorName: vendorsTable.name,
        vendorEmail: vendorsTable.email,
        weekDate: ordersTable.weekDate,
        shipDate: ordersTable.shipDate,
        arriveDate: ordersTable.arriveDate,
        status: ordersTable.status,
        notes: ordersTable.notes,
        emailSentAt: ordersTable.emailSentAt,
        createdAt: ordersTable.createdAt,
        updatedAt: ordersTable.updatedAt,
      })
      .from(ordersTable)
      .innerJoin(vendorsTable, eq(vendorsTable.id, ordersTable.vendorId))
      .where(eq(ordersTable.confirmToken, token));

    if (!rows.length) return res.status(404).json({ error: "Order not found or invalid token" });

    const order = rows[0];
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
      .where(eq(orderItemsTable.orderId, order.id));

    res.json({
      ...order,
      emailSentAt: order.emailSentAt ? order.emailSentAt.toISOString() : null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: items.map(mapItem),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get order by token");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /vendor-confirm/:token/confirm — public, no auth required
router.post("/vendor-confirm/:token/confirm", async (req, res) => {
  try {
    const { token } = req.params;
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "items array required" });
    }

    const rows = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.confirmToken, token));

    if (!rows.length) return res.status(404).json({ error: "Order not found or invalid token" });

    const order = rows[0];
    const orderId = order.id;

    for (const item of items) {
      const updateData: any = { availability: item.availability };
      if (item.quantityConfirmed !== undefined) updateData.quantityConfirmed = item.quantityConfirmed;
      if (item.notes !== undefined) updateData.notes = item.notes;
      await db.update(orderItemsTable).set(updateData).where(eq(orderItemsTable.id, item.itemId));
    }

    // Determine new order status
    const allItems = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, orderId));
    const hasUnavailable = allItems.some((i) => i.availability === "unavailable" || i.availability === "partial");
    const allAvailable = allItems.every((i) => i.availability === "available");

    let newStatus = "sent";
    if (allAvailable) newStatus = "confirmed";
    else if (hasUnavailable) newStatus = "partial";

    await db.update(ordersTable).set({ status: newStatus, updatedAt: new Date() }).where(eq(ordersTable.id, orderId));

    const updatedRows = await db
      .select({
        id: ordersTable.id,
        vendorId: ordersTable.vendorId,
        vendorName: vendorsTable.name,
        vendorEmail: vendorsTable.email,
        weekDate: ordersTable.weekDate,
        shipDate: ordersTable.shipDate,
        arriveDate: ordersTable.arriveDate,
        status: ordersTable.status,
        notes: ordersTable.notes,
        emailSentAt: ordersTable.emailSentAt,
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

    const o = updatedRows[0];
    res.json({
      ...o,
      emailSentAt: o.emailSentAt ? o.emailSentAt.toISOString() : null,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      items: fullItems.map(mapItem),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to confirm order by token");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
