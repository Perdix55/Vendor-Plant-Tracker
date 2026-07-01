import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const customersTable = pgTable("customers", {
  id: serial("id").primaryKey(),
  customerNumber: integer("customer_number"),
  name: text("name").notNull(),
  billTo: text("bill_to"),
  email: text("email"),
  primaryContact: text("primary_contact"),
  phone: text("phone"),
  shipTo: text("ship_to"),
  passwordHash: text("password_hash"),
  resetToken: text("reset_token"),
  resetTokenExpiresAt: timestamp("reset_token_expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCustomerSchema = createInsertSchema(customersTable).omit({ id: true, createdAt: true });
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customersTable.$inferSelect;
export type SafeCustomer = Omit<Customer, "passwordHash" | "resetToken" | "resetTokenExpiresAt">;
