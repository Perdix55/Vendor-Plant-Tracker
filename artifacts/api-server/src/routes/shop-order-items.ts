import { Router } from "express";
import { db } from "@workspace/db";
import { shopOrderItemsTable, salesOrdersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireStaffOrCustomer } from "../middleware/customerAuth";

const router = Router();

async function canAccessSalesOrder(req: import("express").Request, orderId: number): Promise<boolean> {
  if (req.session?.userId) return true;
  if (!req.session?.customerId) return false;
  const [order] = await db.select().from(salesOrdersTable).where(eq(salesOrdersTable.id, orderId));
  return !!order && order.customerId === req.session.customerId;
}

// GET /sales-orders/:orderId/shop-items
router.get("/sales-orders/:orderId/shop-items", async (req, res) => {
  const orderId = Number(req.params.orderId);
  if (isNaN(orderId)) return res.status(400).json({ error: "Invalid order id" });
  try {
    const items = await db
      .select()
      .from(shopOrderItemsTable)
      .where(eq(shopOrderItemsTable.salesOrderId, orderId));
    res.json(items);
  } catch (err) {
    req.log.error({ err }, "Failed to list shop order items");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /sales-orders/:orderId/shop-items
router.post("/sales-orders/:orderId/shop-items", requireStaffOrCustomer, async (req, res) => {
  const orderId = Number(req.params.orderId);
  if (isNaN(orderId)) return res.status(400).json({ error: "Invalid order id" });
  if (!(await canAccessSalesOrder(req, orderId))) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const { shopListingId, productName, price, quantity } = req.body as {
    shopListingId: number;
    productName: string;
    price?: string;
    quantity: number;
  };
  if (!shopListingId || !productName || !quantity) {
    return res.status(400).json({ error: "shopListingId, productName, quantity required" });
  }
  try {
    const [item] = await db
      .insert(shopOrderItemsTable)
      .values({ salesOrderId: orderId, shopListingId, productName, price: price ?? null, quantity })
      .returning();
    res.status(201).json(item);
  } catch (err) {
    req.log.error({ err }, "Failed to add shop order item");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /sales-orders/:orderId/shop-items/:itemId
router.put("/sales-orders/:orderId/shop-items/:itemId", requireStaffOrCustomer, async (req, res) => {
  const orderId = Number(req.params.orderId);
  const itemId = Number(req.params.itemId);
  if (isNaN(orderId) || isNaN(itemId)) return res.status(400).json({ error: "Invalid id" });
  if (!(await canAccessSalesOrder(req, orderId))) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const { quantity } = req.body as { quantity: number };
  if (quantity == null) return res.status(400).json({ error: "quantity required" });
  try {
    const [item] = await db
      .update(shopOrderItemsTable)
      .set({ quantity })
      .where(and(eq(shopOrderItemsTable.id, itemId), eq(shopOrderItemsTable.salesOrderId, orderId)))
      .returning();
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    req.log.error({ err }, "Failed to update shop order item");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /sales-orders/:orderId/shop-items/:itemId
router.delete("/sales-orders/:orderId/shop-items/:itemId", requireStaffOrCustomer, async (req, res) => {
  const orderId = Number(req.params.orderId);
  const itemId = Number(req.params.itemId);
  if (isNaN(orderId) || isNaN(itemId)) return res.status(400).json({ error: "Invalid id" });
  if (!(await canAccessSalesOrder(req, orderId))) {
    return res.status(403).json({ error: "Forbidden" });
  }
  try {
    await db
      .delete(shopOrderItemsTable)
      .where(and(eq(shopOrderItemsTable.id, itemId), eq(shopOrderItemsTable.salesOrderId, orderId)));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete shop order item");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
