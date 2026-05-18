import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, requireAdmin, type AuthRequest } from "../middleware/auth";

const router = Router();

const safeSelect = {
  id: usersTable.id,
  email: usersTable.email,
  name: usersTable.name,
  isAdmin: usersTable.isAdmin,
  canOrders: usersTable.canOrders,
  canInventory: usersTable.canInventory,
  canVendors: usersTable.canVendors,
  canSalesOrders: usersTable.canSalesOrders,
  createdAt: usersTable.createdAt,
};

function formatUser(u: { createdAt: Date; [key: string]: unknown }) {
  return { ...u, createdAt: u.createdAt.toISOString() };
}

router.use("/users", requireAuth, requireAdmin);

router.get("/users", async (req, res) => {
  try {
    const rows = await db.select(safeSelect).from(usersTable).orderBy(usersTable.email);
    res.json(rows.map(formatUser));
  } catch (err) {
    req.log.error({ err }, "Failed to list users");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users", async (req, res) => {
  try {
    const { email, password, name, isAdmin, canOrders, canInventory, canVendors, canSalesOrders } = req.body as {
      email?: string;
      password?: string;
      name?: string;
      isAdmin?: boolean;
      canOrders?: boolean;
      canInventory?: boolean;
      canVendors?: boolean;
      canSalesOrders?: boolean;
    };
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const rows = await db
      .insert(usersTable)
      .values({
        email: email.toLowerCase().trim(),
        name: name?.trim() || null,
        passwordHash,
        isAdmin: isAdmin ?? false,
        canOrders: canOrders ?? true,
        canInventory: canInventory ?? true,
        canVendors: canVendors ?? true,
        canSalesOrders: canSalesOrders ?? true,
      })
      .returning();
    const { passwordHash: _, ...safe } = rows[0];
    res.status(201).json(formatUser({ ...safe }));
  } catch (err) {
    req.log.error({ err }, "Failed to create user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, password, isAdmin, canOrders, canInventory, canVendors, canSalesOrders } = req.body as {
      name?: string;
      password?: string;
      isAdmin?: boolean;
      canOrders?: boolean;
      canInventory?: boolean;
      canVendors?: boolean;
      canSalesOrders?: boolean;
    };
    const updateData: Partial<typeof usersTable.$inferInsert> = {};
    if (name !== undefined) updateData.name = name?.trim() || null;
    if (password) updateData.passwordHash = await bcrypt.hash(password, 10);
    if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
    if (canOrders !== undefined) updateData.canOrders = canOrders;
    if (canInventory !== undefined) updateData.canInventory = canInventory;
    if (canVendors !== undefined) updateData.canVendors = canVendors;
    if (canSalesOrders !== undefined) updateData.canSalesOrders = canSalesOrders;

    await db.update(usersTable).set(updateData).where(eq(usersTable.id, id));
    const rows = await db.select(safeSelect).from(usersTable).where(eq(usersTable.id, id)).limit(1);
    if (!rows.length) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(formatUser(rows[0]));
  } catch (err) {
    req.log.error({ err }, "Failed to update user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (id === (req as unknown as AuthRequest).user?.id) {
      res.status(400).json({ error: "Cannot delete your own account" });
      return;
    }
    await db.delete(usersTable).where(eq(usersTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete user");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
