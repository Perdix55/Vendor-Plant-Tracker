import { Router } from "express";
import { db } from "@workspace/db";
import { vendorsTable, productsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router = Router();

const NEW_PRODUCT_DAYS = 30;

function isNewProduct(createdAt: Date): boolean {
  const diffMs = Date.now() - createdAt.getTime();
  return diffMs < NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000;
}

function mapProduct(p: typeof productsTable.$inferSelect) {
  return {
    id: p.id,
    vendorId: p.vendorId,
    name: p.name,
    packSize: p.packSize,
    cost: p.cost ?? null,
    isActive: p.isActive,
    isNew: isNewProduct(p.createdAt),
    createdAt: p.createdAt.toISOString(),
  };
}

async function fetchVendorWithCount(vendorId: number) {
  const rows = await db
    .select({
      id: vendorsTable.id,
      name: vendorsTable.name,
      email: vendorsTable.email,
      notes: vendorsTable.notes,
      shippingDays: vendorsTable.shippingDays,
      sourceLocation: vendorsTable.sourceLocation,
      priceListEmail: vendorsTable.priceListEmail,
      createdAt: vendorsTable.createdAt,
      productCount: count(productsTable.id),
    })
    .from(vendorsTable)
    .leftJoin(productsTable, eq(productsTable.vendorId, vendorsTable.id))
    .where(eq(vendorsTable.id, vendorId))
    .groupBy(vendorsTable.id);
  if (!rows.length) return null;
  const v = rows[0];
  return { ...v, createdAt: v.createdAt.toISOString() };
}

// GET /vendors
router.get("/vendors", async (req, res) => {
  try {
    const vendors = await db
      .select({
        id: vendorsTable.id,
        name: vendorsTable.name,
        email: vendorsTable.email,
        notes: vendorsTable.notes,
        shippingDays: vendorsTable.shippingDays,
        sourceLocation: vendorsTable.sourceLocation,
        priceListEmail: vendorsTable.priceListEmail,
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

// POST /vendors
router.post("/vendors", async (req, res) => {
  try {
    const { name, email, notes, shippingDays, sourceLocation } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "name is required" });
    }
    const inserted = await db
      .insert(vendorsTable)
      .values({ name: name.trim(), email: email ?? null, notes: notes ?? null, shippingDays: shippingDays ?? null, sourceLocation: sourceLocation ?? "Florida" })
      .returning();

    const v = inserted[0];
    res.status(201).json({ ...v, createdAt: v.createdAt.toISOString(), productCount: 0 });
  } catch (err) {
    req.log.error({ err }, "Failed to create vendor");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /vendors/:vendorId
router.get("/vendors/:vendorId", async (req, res) => {
  try {
    const vendorId = parseInt(req.params.vendorId, 10);
    const v = await fetchVendorWithCount(vendorId);
    if (!v) return res.status(404).json({ error: "Vendor not found" });
    res.json(v);
  } catch (err) {
    req.log.error({ err }, "Failed to get vendor");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /vendors/:vendorId
router.patch("/vendors/:vendorId", async (req, res) => {
  try {
    const vendorId = parseInt(req.params.vendorId, 10);
    const { email, notes, shippingDays, sourceLocation, priceListEmail } = req.body;

    const updateData: Partial<typeof vendorsTable.$inferInsert> = {};
    if (email !== undefined) updateData.email = email;
    if (notes !== undefined) updateData.notes = notes;
    if (shippingDays !== undefined) updateData.shippingDays = shippingDays;
    if (sourceLocation !== undefined) updateData.sourceLocation = sourceLocation;
    if (priceListEmail !== undefined) updateData.priceListEmail = priceListEmail;

    await db.update(vendorsTable).set(updateData).where(eq(vendorsTable.id, vendorId));

    const v = await fetchVendorWithCount(vendorId);
    if (!v) return res.status(404).json({ error: "Vendor not found" });
    res.json(v);
  } catch (err) {
    req.log.error({ err }, "Failed to update vendor");
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

    res.json(products.map(mapProduct));
  } catch (err) {
    req.log.error({ err }, "Failed to list vendor products");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /vendors/:vendorId/products
router.post("/vendors/:vendorId/products", async (req, res) => {
  try {
    const vendorId = parseInt(req.params.vendorId, 10);
    const { name, packSize, cost } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "name is required" });
    }

    const costValue = cost != null && cost !== "" ? String(cost) : null;

    const inserted = await db
      .insert(productsTable)
      .values({ vendorId, name: name.trim(), packSize: packSize?.trim() ?? null, cost: costValue, isActive: true })
      .returning();

    res.status(201).json(mapProduct(inserted[0]));
  } catch (err) {
    req.log.error({ err }, "Failed to create product");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /vendors/:vendorId/products/:productId
router.delete("/vendors/:vendorId/products/:productId", async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    await db.delete(productsTable).where(eq(productsTable.id, productId));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete product");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /vendors/:vendorId/products/:productId
router.patch("/vendors/:vendorId/products/:productId", async (req, res) => {
  try {
    const vendorId = parseInt(req.params.vendorId, 10);
    const productId = parseInt(req.params.productId, 10);
    const { name, packSize, isActive, cost } = req.body;

    const updateData: Partial<typeof productsTable.$inferInsert> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (packSize !== undefined) updateData.packSize = packSize?.trim() ?? null;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (cost !== undefined) updateData.cost = cost != null && cost !== "" ? String(cost) : null;

    await db
      .update(productsTable)
      .set(updateData)
      .where(eq(productsTable.id, productId));

    const rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, productId));

    if (!rows.length) return res.status(404).json({ error: "Product not found" });
    res.json(mapProduct(rows[0]));
  } catch (err) {
    req.log.error({ err }, "Failed to update product");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /vendors/import
router.post("/vendors/import", async (req, res) => {
  try {
    const { name, email, shippingDays, sourceLocation, products } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "name is required" });
    }
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "products array is required" });
    }

    const inserted = await db
      .insert(vendorsTable)
      .values({ name: name.trim(), email: email ?? null, shippingDays: shippingDays ?? null, sourceLocation: sourceLocation ?? "Florida" })
      .returning();
    const vendor = inserted[0];

    if (products.length > 0) {
      await db.insert(productsTable).values(
        products
          .filter((p: any) => p.name && typeof p.name === "string" && p.name.trim())
          .map((p: any) => ({
            vendorId: vendor.id,
            name: p.name.trim(),
            packSize: p.packSize?.trim() || null,
          }))
      );
    }

    const v = await fetchVendorWithCount(vendor.id);
    res.status(201).json({ vendor: v, productsCreated: products.length });
  } catch (err) {
    req.log.error({ err }, "Failed to import vendor");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
