import { Router } from "express";
import { db } from "@workspace/db";
import { customersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function mapCustomer(c: typeof customersTable.$inferSelect) {
  return { ...c, createdAt: c.createdAt.toISOString() };
}

// GET /customers
router.get("/customers", async (req, res) => {
  try {
    const customers = await db.select().from(customersTable).orderBy(customersTable.name);
    res.json(customers.map(mapCustomer));
  } catch (err) {
    req.log.error({ err }, "Failed to list customers");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /customers
router.post("/customers", async (req, res) => {
  try {
    const { customerNumber, name, billTo, email, primaryContact, phone, shipTo } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "name is required" });
    }
    const inserted = await db
      .insert(customersTable)
      .values({
        customerNumber: customerNumber ?? null,
        name: name.trim(),
        billTo: billTo ?? null,
        email: email ?? null,
        primaryContact: primaryContact ?? null,
        phone: phone ?? null,
        shipTo: shipTo ?? null,
      })
      .returning();
    res.status(201).json(mapCustomer(inserted[0]));
  } catch (err) {
    req.log.error({ err }, "Failed to create customer");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /customers/import
router.post("/customers/import", async (req, res) => {
  try {
    const { customers } = req.body;
    if (!Array.isArray(customers)) {
      return res.status(400).json({ error: "customers array is required" });
    }
    const valid = customers.filter((c: any) => c.name && typeof c.name === "string" && c.name.trim());
    if (valid.length > 0) {
      await db.insert(customersTable).values(
        valid.map((c: any) => ({
          customerNumber: c.customerNumber ?? null,
          name: c.name.trim(),
          billTo: c.billTo ?? null,
          email: c.email ?? null,
          primaryContact: c.primaryContact ?? null,
          phone: c.phone ?? null,
          shipTo: c.shipTo ?? null,
        }))
      );
    }
    res.status(201).json({ customersCreated: valid.length });
  } catch (err) {
    req.log.error({ err }, "Failed to import customers");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /customers/:customerId
router.get("/customers/:customerId", async (req, res) => {
  try {
    const customerId = parseInt(req.params.customerId, 10);
    const rows = await db.select().from(customersTable).where(eq(customersTable.id, customerId));
    if (!rows.length) return res.status(404).json({ error: "Customer not found" });
    res.json(mapCustomer(rows[0]));
  } catch (err) {
    req.log.error({ err }, "Failed to get customer");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /customers/:customerId
router.patch("/customers/:customerId", async (req, res) => {
  try {
    const customerId = parseInt(req.params.customerId, 10);
    const { customerNumber, name, billTo, email, primaryContact, phone, shipTo } = req.body;

    const updateData: Partial<typeof customersTable.$inferInsert> = {};
    if (customerNumber !== undefined) updateData.customerNumber = customerNumber;
    if (name !== undefined) updateData.name = typeof name === "string" ? name.trim() : name;
    if (billTo !== undefined) updateData.billTo = billTo;
    if (email !== undefined) updateData.email = email;
    if (primaryContact !== undefined) updateData.primaryContact = primaryContact;
    if (phone !== undefined) updateData.phone = phone;
    if (shipTo !== undefined) updateData.shipTo = shipTo;

    await db.update(customersTable).set(updateData).where(eq(customersTable.id, customerId));

    const rows = await db.select().from(customersTable).where(eq(customersTable.id, customerId));
    if (!rows.length) return res.status(404).json({ error: "Customer not found" });
    res.json(mapCustomer(rows[0]));
  } catch (err) {
    req.log.error({ err }, "Failed to update customer");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /customers/:customerId
router.delete("/customers/:customerId", async (req, res) => {
  try {
    const customerId = parseInt(req.params.customerId, 10);
    await db.delete(customersTable).where(eq(customersTable.id, customerId));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete customer");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
