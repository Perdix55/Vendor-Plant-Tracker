import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const shopListingsTable = pgTable("shop_listings", {
  id: serial("id").primaryKey(),
  productName: text("product_name").notNull(),
  status: text("status").notNull().default("available"),
  price: text("price"),
  category: text("category"),
  importedAt: timestamp("imported_at").defaultNow().notNull(),
});

export const insertShopListingSchema = createInsertSchema(shopListingsTable).omit({ id: true, importedAt: true });
export type InsertShopListing = z.infer<typeof insertShopListingSchema>;
export type ShopListing = typeof shopListingsTable.$inferSelect;
