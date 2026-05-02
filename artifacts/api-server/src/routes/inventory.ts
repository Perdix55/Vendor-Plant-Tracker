import { Router } from "express";
import { db } from "@workspace/db";
import {
  inventoryItemsTable,
  inventoryTransactionsTable,
  productsTable,
  vendorsTable,
} from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";

const router = Router();

function mapInventoryItem(row: any) {
  return {
    id: row.id,
    productId: row.productId,
    vendorId: row.vendorId,
    productName: row.productName,
    packSize: row.packSize ?? null,
    vendorName: row.vendorName,
    quantityOnHand: row.quantityOnHand,
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : row.updatedAt,
  };
}

function mapTransaction(row: any) {
  return {
    id: row.id,
    productId: row.productId,
    vendorId: row.vendorId,
    productName: row.productName,
    vendorName: row.vendorName,
    orderId: row.orderId ?? null,
    type: row.type,
    quantity: row.quantity,
    notes: row.notes ?? null,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
  };
}

// GET /inventory
router.get("/inventory", async (req, res) => {
  try {
    const rows = await db
      .select({
        id: inventoryItemsTable.id,
        productId: inventoryItemsTable.productId,
        vendorId: inventoryItemsTable.vendorId,
        productName: productsTable.name,
        packSize: productsTable.packSize,
        vendorName: vendorsTable.name,
        quantityOnHand: inventoryItemsTable.quantityOnHand,
        updatedAt: inventoryItemsTable.updatedAt,
      })
      .from(inventoryItemsTable)
      .innerJoin(productsTable, eq(productsTable.id, inventoryItemsTable.productId))
      .innerJoin(vendorsTable, eq(vendorsTable.id, inventoryItemsTable.vendorId))
      .orderBy(vendorsTable.name, productsTable.name);

    res.json(rows.map(mapInventoryItem));
  } catch (err) {
    req.log.error({ err }, "Failed to list inventory");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /inventory/adjust
router.post("/inventory/adjust", async (req, res) => {
  try {
    const { productId, vendorId, quantity, type, notes } = req.body;
    if (!productId || !vendorId || quantity === undefined || !type) {
      return res.status(400).json({ error: "productId, vendorId, quantity, and type are required" });
    }

    const delta = type === "sale" || type === "write_off" ? -Math.abs(quantity) : quantity;

    await db.insert(inventoryTransactionsTable).values({
      productId,
      vendorId,
      type,
      quantity: delta,
      notes: notes ?? null,
      orderId: null,
    });

    const existing = await db
      .select()
      .from(inventoryItemsTable)
      .where(and(eq(inventoryItemsTable.productId, productId), eq(inventoryItemsTable.vendorId, vendorId)));

    if (existing.length > 0) {
      await db
        .update(inventoryItemsTable)
        .set({ quantityOnHand: Math.max(0, existing[0].quantityOnHand + delta), updatedAt: new Date() })
        .where(eq(inventoryItemsTable.id, existing[0].id));
    } else {
      await db.insert(inventoryItemsTable).values({
        productId,
        vendorId,
        quantityOnHand: Math.max(0, delta),
      });
    }

    const updated = await db
      .select({
        id: inventoryItemsTable.id,
        productId: inventoryItemsTable.productId,
        vendorId: inventoryItemsTable.vendorId,
        productName: productsTable.name,
        packSize: productsTable.packSize,
        vendorName: vendorsTable.name,
        quantityOnHand: inventoryItemsTable.quantityOnHand,
        updatedAt: inventoryItemsTable.updatedAt,
      })
      .from(inventoryItemsTable)
      .innerJoin(productsTable, eq(productsTable.id, inventoryItemsTable.productId))
      .innerJoin(vendorsTable, eq(vendorsTable.id, inventoryItemsTable.vendorId))
      .where(and(eq(inventoryItemsTable.productId, productId), eq(inventoryItemsTable.vendorId, vendorId)));

    res.json(mapInventoryItem(updated[0]));
  } catch (err) {
    req.log.error({ err }, "Failed to adjust inventory");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /inventory/transactions
router.get("/inventory/transactions", async (req, res) => {
  try {
    const productIdFilter = req.query.productId ? parseInt(req.query.productId as string) : null;
    const limitVal = req.query.limit ? parseInt(req.query.limit as string) : 100;

    const rows = await db
      .select({
        id: inventoryTransactionsTable.id,
        productId: inventoryTransactionsTable.productId,
        vendorId: inventoryTransactionsTable.vendorId,
        productName: productsTable.name,
        vendorName: vendorsTable.name,
        orderId: inventoryTransactionsTable.orderId,
        type: inventoryTransactionsTable.type,
        quantity: inventoryTransactionsTable.quantity,
        notes: inventoryTransactionsTable.notes,
        createdAt: inventoryTransactionsTable.createdAt,
      })
      .from(inventoryTransactionsTable)
      .innerJoin(productsTable, eq(productsTable.id, inventoryTransactionsTable.productId))
      .innerJoin(vendorsTable, eq(vendorsTable.id, inventoryTransactionsTable.vendorId))
      .where(productIdFilter ? eq(inventoryTransactionsTable.productId, productIdFilter) : undefined)
      .orderBy(desc(inventoryTransactionsTable.createdAt))
      .limit(limitVal);

    res.json(rows.map(mapTransaction));
  } catch (err) {
    req.log.error({ err }, "Failed to list transactions");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
