import { Router } from "express";
import { db } from "@workspace/db";
import { vendorsTable, productsTable } from "@workspace/db";
import { eq, sql, count } from "drizzle-orm";

const router = Router();

// GET /vendors
router.get("/vendors", async (req, res) => {
  try {
    const vendors = await db
      .select({
        id: vendorsTable.id,
        name: vendorsTable.name,
        notes: vendorsTable.notes,
        createdAt: vendorsTable.createdAt,
        productCount: count(productsTable.id),
      })
      .from(vendorsTable)
      .leftJoin(productsTable, eq(productsTable.vendorId, vendorsTable.id))
      .groupBy(vendorsTable.id)
      .orderBy(vendorsTable.name);

    res.json(vendors.map((v) => ({ ...v, createdAt: v.createdAt.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "Failed to list vendors");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /vendors/:vendorId
router.get("/vendors/:vendorId", async (req, res) => {
  try {
    const vendorId = parseInt(req.params.vendorId, 10);
    const rows = await db
      .select({
        id: vendorsTable.id,
        name: vendorsTable.name,
        notes: vendorsTable.notes,
        createdAt: vendorsTable.createdAt,
        productCount: count(productsTable.id),
      })
      .from(vendorsTable)
      .leftJoin(productsTable, eq(productsTable.vendorId, vendorsTable.id))
      .where(eq(vendorsTable.id, vendorId))
      .groupBy(vendorsTable.id);

    if (!rows.length) return res.status(404).json({ error: "Vendor not found" });
    const v = rows[0];
    res.json({ ...v, createdAt: v.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to get vendor");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /vendors/:vendorId/products
router.get("/vendors/:vendorId/products", async (req, res) => {
  try {
    const vendorId = parseInt(req.params.vendorId, 10);
    const products = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.vendorId, vendorId))
      .orderBy(productsTable.name);

    res.json(
      products.map((p) => ({
        id: p.id,
        vendorId: p.vendorId,
        name: p.name,
        packSize: p.packSize,
        isActive: p.isActive,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list vendor products");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
