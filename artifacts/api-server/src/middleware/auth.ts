import type { RequestHandler, Request } from "express";
import { db, usersTable } from "@workspace/db";
import type { DbUser } from "@workspace/db";
import { eq } from "drizzle-orm";

export type SafeUser = Omit<DbUser, "passwordHash">;
export type AuthRequest = Request & { user: SafeUser };

export const requireAuth: RequestHandler = async (req, res, next) => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const rows = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      isAdmin: usersTable.isAdmin,
      canOrders: usersTable.canOrders,
      canInventory: usersTable.canInventory,
      canVendors: usersTable.canVendors,
      canSalesOrders: usersTable.canSalesOrders,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .where(eq(usersTable.id, req.session.userId))
    .limit(1);

  if (!rows.length) {
    req.session.destroy(() => {});
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as AuthRequest).user = rows[0];
  next();
};

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (!(req as AuthRequest).user?.isAdmin) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
};
