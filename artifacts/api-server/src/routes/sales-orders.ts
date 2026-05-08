import { Router } from "express";
import { db } from "@workspace/db";
import {
  salesOrdersTable,
  salesOrderItemsTable,
  inventoryItemsTable,
  productsTable,
  vendorsTable,
} from "@workspace/db";
import { eq, ilike, desc, sql, or } from "drizzle-orm";
import { inventoryTransactionsTable } from "@workspace/db";

const router = Router();

// GET /inventory/lookup?q=<barcode value>
router.get("/inventory/lookup", async (req, res) => {
  const q = (req.query.q as string | undefined)?.trim();
  if (!q) return res.status(400).json({ error: "Missing query parameter: q" });

  try {
    const rows = await db
      .select({
        id: inventoryItemsTable.id,
        productId: inventoryItemsTable.productId,
        vendorId: inventoryItemsTable.vendorId,
        productName: productsTable.name,
        vendorName: vendorsTable.name,
        packSize: productsTable.packSize,
        quantityOnHand: inventoryItemsTable.quantityOnHand,
        updatedAt: inventoryItemsTable.updatedAt,
      })
      .from(inventoryItemsTable)
      .innerJoin(productsTable, eq(productsTable.id, inventoryItemsTable.productId))
      .innerJoin(vendorsTable, eq(vendorsTable.id, inventoryItemsTable.vendorId))
      .where(
        /^\d+$/.test(q)
          ? or(
              eq(inventoryItemsTable.productId, parseInt(q, 10)),
              ilike(productsTable.name, `%${q}%`)
            )
          : ilike(productsTable.name, `%${q}%`)
      );

    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to lookup inventory by barcode");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /sales-orders
router.get("/sales-orders", async (req, res) => {
  try {
    const status = req.query.status as string | undefined;

    const rows = await db
      .select({
        id: salesOrdersTable.id,
        customerName: salesOrdersTable.customerName,
        status: salesOrdersTable.status,
        notes: salesOrdersTable.notes,
        createdAt: salesOrdersTable.createdAt,
        updatedAt: salesOrdersTable.updatedAt,
      })
      .from(salesOrdersTable)
      .where(status ? eq(salesOrdersTable.status, status) : undefined)
      .orderBy(desc(salesOrdersTable.createdAt));

    // Count items per order
    const itemCounts = await db
      .select({
        salesOrderId: salesOrderItemsTable.salesOrderId,
      })
      .from(salesOrderItemsTable);

    const countMap: Record<number, number> = {};
    for (const r of itemCounts) {
      countMap[r.salesOrderId] = (countMap[r.salesOrderId] ?? 0) + 1;
    }

    const result = rows.map((r) => ({ ...r, itemCount: countMap[r.id] ?? 0 }));
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to list sales orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /sales-orders
router.post("/sales-orders", async (req, res) => {
  try {
    const { customerName, notes } = req.body as { customerName: string; notes?: string };
    if (!customerName?.trim()) {
      return res.status(400).json({ error: "customerName is required" });
    }

    const [order] = await db
      .insert(salesOrdersTable)
      .values({ customerName: customerName.trim(), notes })
      .returning();

    res.status(201).json({ ...order, items: [] });
  } catch (err) {
    req.log.error({ err }, "Failed to create sales order");
    res.status(500).json({ error: "Internal server error" });
  }
});

async function getSalesOrderWithItems(id: number) {
  const [order] = await db
    .select()
    .from(salesOrdersTable)
    .where(eq(salesOrdersTable.id, id));

  if (!order) return null;

  const items = await db
    .select()
    .from(salesOrderItemsTable)
    .where(eq(salesOrderItemsTable.salesOrderId, id))
    .orderBy(salesOrderItemsTable.createdAt);

  return { ...order, items };
}

// GET /sales-orders/:id
router.get("/sales-orders/:salesOrderId", async (req, res) => {
  const id = parseInt(req.params.salesOrderId, 10);
  try {
    const order = await getSalesOrderWithItems(id);
    if (!order) return res.status(404).json({ error: "Sales order not found" });
    res.json(order);
  } catch (err) {
    req.log.error({ err }, "Failed to get sales order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /sales-orders/:id
router.put("/sales-orders/:salesOrderId", async (req, res) => {
  const id = parseInt(req.params.salesOrderId, 10);
  try {
    const { customerName, status, notes } = req.body as {
      customerName?: string;
      status?: string;
      notes?: string;
    };

    // Fetch current order to detect status transition
    const [current] = await db
      .select({ status: salesOrdersTable.status })
      .from(salesOrdersTable)
      .where(eq(salesOrdersTable.id, id));

    if (!current) return res.status(404).json({ error: "Sales order not found" });

    await db
      .update(salesOrdersTable)
      .set({
        ...(customerName !== undefined ? { customerName } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
        updatedAt: new Date(),
      })
      .where(eq(salesOrdersTable.id, id));

    // Deduct inventory when transitioning to "completed" (only once)
    if (status === "completed" && current.status !== "completed") {
      const items = await db
        .select()
        .from(salesOrderItemsTable)
        .where(eq(salesOrderItemsTable.salesOrderId, id));

      for (const item of items) {
        // Decrement quantity on hand (floor at 0)
        await db
          .update(inventoryItemsTable)
          .set({
            quantityOnHand: sql`GREATEST(0, ${inventoryItemsTable.quantityOnHand} - ${item.quantity})`,
            updatedAt: new Date(),
          })
          .where(eq(inventoryItemsTable.id, item.inventoryItemId));

        // Record the transaction
        await db.insert(inventoryTransactionsTable).values({
          productId: item.productId,
          vendorId: item.vendorId,
          orderId: null,
          type: "sale",
          quantity: -item.quantity,
          notes: `Sales order #${id} — ${item.productName}`,
        });
      }

      req.log.info({ salesOrderId: id, itemCount: items.length }, "Inventory deducted for completed sales order");
    }

    const order = await getSalesOrderWithItems(id);
    if (!order) return res.status(404).json({ error: "Sales order not found" });
    res.json(order);
  } catch (err) {
    req.log.error({ err }, "Failed to update sales order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /sales-orders/:id
router.delete("/sales-orders/:salesOrderId", async (req, res) => {
  const id = parseInt(req.params.salesOrderId, 10);
  try {
    await db.delete(salesOrdersTable).where(eq(salesOrdersTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete sales order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /sales-orders/:id/items
router.post("/sales-orders/:salesOrderId/items", async (req, res) => {
  const salesOrderId = parseInt(req.params.salesOrderId, 10);
  try {
    const { inventoryItemId, quantity = 1 } = req.body as {
      inventoryItemId: number;
      quantity?: number;
    };

    // Look up inventory item to get product/vendor info
    const [inv] = await db
      .select({
        id: inventoryItemsTable.id,
        productId: inventoryItemsTable.productId,
        vendorId: inventoryItemsTable.vendorId,
        productName: productsTable.name,
        vendorName: vendorsTable.name,
        packSize: productsTable.packSize,
        quantityOnHand: inventoryItemsTable.quantityOnHand,
      })
      .from(inventoryItemsTable)
      .innerJoin(productsTable, eq(productsTable.id, inventoryItemsTable.productId))
      .innerJoin(vendorsTable, eq(vendorsTable.id, inventoryItemsTable.vendorId))
      .where(eq(inventoryItemsTable.id, inventoryItemId));

    if (!inv) return res.status(404).json({ error: "Inventory item not found" });

    const [item] = await db
      .insert(salesOrderItemsTable)
      .values({
        salesOrderId,
        inventoryItemId,
        productId: inv.productId,
        vendorId: inv.vendorId,
        productName: inv.productName,
        vendorName: inv.vendorName,
        packSize: inv.packSize ?? null,
        quantity,
      })
      .returning();

    res.status(201).json(item);
  } catch (err) {
    req.log.error({ err }, "Failed to add sales order item");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /sales-orders/:id/items/:itemId
router.put("/sales-orders/:salesOrderId/items/:itemId", async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  try {
    const { quantity } = req.body as { quantity: number };

    const [item] = await db
      .update(salesOrderItemsTable)
      .set({ quantity })
      .where(eq(salesOrderItemsTable.id, itemId))
      .returning();

    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    req.log.error({ err }, "Failed to update sales order item");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /sales-orders/:id/items/:itemId
router.delete("/sales-orders/:salesOrderId/items/:itemId", async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  try {
    await db.delete(salesOrderItemsTable).where(eq(salesOrderItemsTable.id, itemId));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete sales order item");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
