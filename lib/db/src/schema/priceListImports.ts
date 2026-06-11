import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { vendorsTable } from "./vendors";

export const priceListImportsTable = pgTable("price_list_imports", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id")
    .notNull()
    .references(() => vendorsTable.id, { onDelete: "cascade" }),
  triggeredBy: text("triggered_by").notNull(), // "manual" | "webhook"
  sourceUrl: text("source_url"),
  emailFrom: text("email_from"),
  emailSubject: text("email_subject"),
  productsUpdated: integer("products_updated").default(0).notNull(),
  productsAdded: integer("products_added").default(0).notNull(),
  status: text("status").notNull(), // "success" | "error"
  errorMessage: text("error_message"),
  rawPreview: text("raw_preview"), // JSON snippet of first few parsed items
  importedAt: timestamp("imported_at").defaultNow().notNull(),
});

export type PriceListImport = typeof priceListImportsTable.$inferSelect;
