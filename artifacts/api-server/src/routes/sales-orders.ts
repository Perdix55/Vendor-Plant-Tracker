import { Router } from "express";
import { db } from "@workspace/db";
import {
  salesOrdersTable,
  salesOrderItemsTable,
  shopOrderItemsTable,
  inventoryItemsTable,
  productsTable,
  vendorsTable,
  shopListingsTable,
  customersTable,
} from "@workspace/db";
import { eq, ilike, desc, sql, or, and, ne, count } from "drizzle-orm";
import { inventoryTransactionsTable } from "@workspace/db";
import { requireStaffOrCustomer } from "../middleware/customerAuth";

const router = Router();

// GET /inventory/lookup?q=<barcode value>
router.get("/inventory/lookup", async (req, res) => {
  const q = (req.query.q as string | undefined)?.trim();
  if (!q) return res.status(400).json({ error: "Missing query parameter: q" });

  try {
    const [{ total }] = await db.select({ total: count() }).from(shopListingsTable);
    const hasListings = total > 0;

    const nameFilter = /^\d+$/.test(q)
      ? or(
          eq(inventoryItemsTable.productId, parseInt(q, 10)),
          ilike(productsTable.name, `%${q}%`)
        )
      : ilike(productsTable.name, `%${q}%`);

    const shopFilter = hasListings
      ? sql`EXISTS (
          SELECT 1 FROM shop_listings sl
          WHERE LOWER(${productsTable.name}) = LOWER(sl.product_name)
            AND sl.status != 'out_of_stock'
        )`
      : undefined;

    const whereClause = shopFilter ? and(nameFilter, shopFilter) : nameFilter;

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
      .where(whereClause);

    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to lookup inventory by barcode");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /sales-orders
router.get("/sales-orders", requireStaffOrCustomer, async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const customerId = req.session?.customerId;

    const conditions = [
      status ? eq(salesOrdersTable.status, status) : undefined,
      customerId ? eq(salesOrdersTable.customerId, customerId) : undefined,
    ].filter((c): c is NonNullable<typeof c> => c !== undefined);

    const rows = await db
      .select({
        id: salesOrdersTable.id,
        customerName: salesOrdersTable.customerName,
        customerId: salesOrdersTable.customerId,
        status: salesOrdersTable.status,
        notes: salesOrdersTable.notes,
        neededBy: salesOrdersTable.neededBy,
        createdAt: salesOrdersTable.createdAt,
        updatedAt: salesOrdersTable.updatedAt,
      })
      .from(salesOrdersTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(salesOrdersTable.createdAt));

    // Count items per order from both tables
    const [legacyItems, shopItems] = await Promise.all([
      db.select({ salesOrderId: salesOrderItemsTable.salesOrderId }).from(salesOrderItemsTable),
      db.select({ salesOrderId: shopOrderItemsTable.salesOrderId }).from(shopOrderItemsTable),
    ]);

    const countMap: Record<number, number> = {};
    for (const r of [...legacyItems, ...shopItems]) {
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
router.post("/sales-orders", requireStaffOrCustomer, async (req, res) => {
  try {
    const { customerName, customerId: bodyCustomerId, notes, neededBy } = req.body as {
      customerName: string;
      customerId?: number | null;
      notes?: string;
      neededBy?: string | null;
    };

    let finalCustomerName = customerName?.trim();
    let customerId: number | null = null;

    if (req.session?.customerId) {
      const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, req.session.customerId));
      if (!customer) return res.status(401).json({ error: "Unauthorized" });
      customerId = customer.id;
      finalCustomerName = customer.name;
    } else if (bodyCustomerId) {
      const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, bodyCustomerId));
      if (!customer) return res.status(400).json({ error: "Customer not found" });
      customerId = customer.id;
      finalCustomerName = customerName?.trim() || customer.name;
    }

    if (!finalCustomerName) {
      return res.status(400).json({ error: "customerName is required" });
    }

    const [order] = await db
      .insert(salesOrdersTable)
      .values({ customerName: finalCustomerName, customerId, notes, neededBy: neededBy ?? null })
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

  const [legacyItems, shopItems] = await Promise.all([
    db.select().from(salesOrderItemsTable)
      .where(eq(salesOrderItemsTable.salesOrderId, id))
      .orderBy(salesOrderItemsTable.createdAt),
    db.select().from(shopOrderItemsTable)
      .where(eq(shopOrderItemsTable.salesOrderId, id))
      .orderBy(shopOrderItemsTable.createdAt),
  ]);

  const normalizedLegacy = legacyItems.map((i) => ({
    id: i.id,
    salesOrderId: i.salesOrderId,
    productName: i.productName,
    vendorName: i.vendorName ?? null,
    packSize: i.packSize ?? null,
    price: i.price ?? null,
    quantity: i.quantity,
    inventoryItemId: i.inventoryItemId ?? null,
    createdAt: i.createdAt,
    _source: "legacy" as const,
  }));

  const normalizedShop = shopItems.map((i) => ({
    id: i.id,
    salesOrderId: i.salesOrderId,
    productName: i.productName,
    vendorName: null,
    packSize: null,
    price: i.price ?? null,
    quantity: i.quantity,
    inventoryItemId: null,
    shopListingId: i.shopListingId ?? null,
    createdAt: i.createdAt,
    _source: "shop" as const,
  }));

  const items = [...normalizedLegacy, ...normalizedShop].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return { ...order, items };
}

// GET /sales-orders/:id
router.get("/sales-orders/:salesOrderId", requireStaffOrCustomer, async (req, res) => {
  const id = parseInt(String(req.params.salesOrderId), 10);
  try {
    const order = await getSalesOrderWithItems(id);
    if (!order) return res.status(404).json({ error: "Sales order not found" });
    if (req.session?.customerId && order.customerId !== req.session.customerId) {
      return res.status(403).json({ error: "Forbidden" });
    }
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
    const { customerName, customerId, status, notes, neededBy } = req.body as {
      customerName?: string;
      customerId?: number | null;
      status?: string;
      notes?: string;
      neededBy?: string | null;
    };

    // Fetch current order to detect status transition
    const [current] = await db
      .select({ status: salesOrdersTable.status })
      .from(salesOrdersTable)
      .where(eq(salesOrdersTable.id, id));

    if (!current) return res.status(404).json({ error: "Sales order not found" });

    if (customerId) {
      const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, customerId));
      if (!customer) return res.status(400).json({ error: "Customer not found" });
    }

    await db
      .update(salesOrdersTable)
      .set({
        ...(customerName !== undefined ? { customerName } : {}),
        ...(customerId !== undefined ? { customerId } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(neededBy !== undefined ? { neededBy: neededBy ?? null } : {}),
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

    const [legacyItem] = await db
      .update(salesOrderItemsTable)
      .set({ quantity })
      .where(eq(salesOrderItemsTable.id, itemId))
      .returning();

    if (legacyItem) return res.json(legacyItem);

    const [shopItem] = await db
      .update(shopOrderItemsTable)
      .set({ quantity })
      .where(eq(shopOrderItemsTable.id, itemId))
      .returning();

    if (!shopItem) return res.status(404).json({ error: "Item not found" });
    res.json(shopItem);
  } catch (err) {
    req.log.error({ err }, "Failed to update sales order item");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /sales-orders/:id/items/:itemId
router.delete("/sales-orders/:salesOrderId/items/:itemId", async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  try {
    const [legacyItem] = await db
      .delete(salesOrderItemsTable)
      .where(eq(salesOrderItemsTable.id, itemId))
      .returning();

    if (!legacyItem) {
      await db.delete(shopOrderItemsTable).where(eq(shopOrderItemsTable.id, itemId));
    }

    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete sales order item");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
