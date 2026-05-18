import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router = Router();

function safeUser(u: typeof usersTable.$inferSelect) {
  const { passwordHash: _, ...safe } = u;
  return { ...safe, createdAt: safe.createdAt.toISOString() };
}

router.get("/auth/me", async (req, res) => {
  if (!req.session?.userId) {
    const [{ total }] = await db.select({ total: count() }).from(usersTable);
    res.status(401).json({ error: "Unauthorized", needsSetup: total === 0 });
    return;
  }
  const rows = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId)).limit(1);
  if (!rows.length) {
    req.session.destroy(() => {});
    const [{ total }] = await db.select({ total: count() }).from(usersTable);
    res.status(401).json({ error: "Unauthorized", needsSetup: total === 0 });
    return;
  }
  res.json(safeUser(rows[0]));
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  const rows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase().trim()))
    .limit(1);
  if (!rows.length) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const valid = await bcrypt.compare(password, rows[0].passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  req.session.userId = rows[0].id;
  res.json(safeUser(rows[0]));
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.post("/auth/setup", async (req, res) => {
  const [{ total }] = await db.select({ total: count() }).from(usersTable);
  if (total > 0) {
    res.status(403).json({ error: "Setup already complete" });
    return;
  }
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string };
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
      isAdmin: true,
      canOrders: true,
      canInventory: true,
      canVendors: true,
      canSalesOrders: true,
    })
    .returning();
  req.session.userId = rows[0].id;
  res.status(201).json(safeUser(rows[0]));
});

export default router;
