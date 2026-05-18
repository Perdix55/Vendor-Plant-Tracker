import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  canOrders: boolean("can_orders").default(true).notNull(),
  canInventory: boolean("can_inventory").default(true).notNull(),
  canVendors: boolean("can_vendors").default(true).notNull(),
  canSalesOrders: boolean("can_sales_orders").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DbUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
