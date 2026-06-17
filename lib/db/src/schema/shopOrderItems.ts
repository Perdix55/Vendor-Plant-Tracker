import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { salesOrdersTable } from "./salesOrders";

export const shopOrderItemsTable = pgTable("shop_order_items", {
  id: serial("id").primaryKey(),
  salesOrderId: integer("sales_order_id").notNull().references(() => salesOrdersTable.id, { onDelete: "cascade" }),
  shopListingId: integer("shop_listing_id").notNull(),
  productName: text("product_name").notNull(),
  price: text("price"),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ShopOrderItem = typeof shopOrderItemsTable.$inferSelect;
