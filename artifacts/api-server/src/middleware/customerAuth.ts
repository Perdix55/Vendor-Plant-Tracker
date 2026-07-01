import type { RequestHandler, Request } from "express";
import { db, customersTable } from "@workspace/db";
import type { SafeCustomer } from "@workspace/db";
import { eq } from "drizzle-orm";

export type CustomerAuthRequest = Request & { customer: SafeCustomer };

function safeCustomerColumns() {
  return {
    id: customersTable.id,
    customerNumber: customersTable.customerNumber,
    name: customersTable.name,
    billTo: customersTable.billTo,
    email: customersTable.email,
    primaryContact: customersTable.primaryContact,
    phone: customersTable.phone,
    shipTo: customersTable.shipTo,
    createdAt: customersTable.createdAt,
  };
}

export const requireCustomerAuth: RequestHandler = async (req, res, next) => {
  if (!req.session?.customerId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const rows = await db
    .select(safeCustomerColumns())
    .from(customersTable)
    .where(eq(customersTable.id, req.session.customerId))
    .limit(1);

  if (!rows.length) {
    req.session.destroy(() => {});
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as CustomerAuthRequest).customer = rows[0] as unknown as SafeCustomer;
  next();
};

// Allows either a logged-in staff user OR a logged-in customer to proceed.
export const requireStaffOrCustomer: RequestHandler = (req, res, next) => {
  if (req.session?.userId || req.session?.customerId) {
    next();
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
};
