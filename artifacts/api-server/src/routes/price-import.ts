import { Router } from "express";
import { db, vendorsTable, priceListImportsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { runPriceImport, extractPriceListUrl } from "../services/price-import";

const router = Router();

/** Manually import a price list from a URL for a given vendor */
router.post("/vendors/:id/price-import", async (req, res) => {
  const vendorId = parseInt(req.params.id, 10);
  if (isNaN(vendorId)) {
    res.status(400).json({ error: "Invalid vendor ID" });
    return;
  }
  const { url, addNewProducts } = req.body as { url?: string; addNewProducts?: boolean };
  if (!url) {
    res.status(400).json({ error: "url is required" });
    return;
  }
  try {
    const result = await runPriceImport({
      vendorId,
      url,
      triggeredBy: "manual",
      addNewProducts: addNewProducts !== false,
    });
    res.json({
      ok: true,
      productsUpdated: result.productsUpdated,
      productsAdded: result.productsAdded,
      itemsFound: result.items.length,
      unmatched: result.unmatched.length,
      preview: result.items.slice(0, 10),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Import failed";
    req.log.error({ err, vendorId, url }, "Price import failed");
    res.status(500).json({ error: message });
  }
});

/** Get import history for a vendor */
router.get("/vendors/:id/price-imports", async (req, res) => {
  const vendorId = parseInt(req.params.id, 10);
  if (isNaN(vendorId)) {
    res.status(400).json({ error: "Invalid vendor ID" });
    return;
  }
  try {
    const rows = await db
      .select()
      .from(priceListImportsTable)
      .where(eq(priceListImportsTable.vendorId, vendorId))
      .orderBy(desc(priceListImportsTable.importedAt))
      .limit(20);
    res.json(rows.map((r) => ({ ...r, importedAt: r.importedAt.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "Failed to get price import history");
    res.status(500).json({ error: "Failed to load history" });
  }
});

/** Save/update the vendor's price list email address */
router.put("/vendors/:id/price-list-email", async (req, res) => {
  const vendorId = parseInt(req.params.id, 10);
  const { priceListEmail } = req.body as { priceListEmail?: string };
  try {
    await db
      .update(vendorsTable)
      .set({ priceListEmail: priceListEmail?.trim() || null })
      .where(eq(vendorsTable.id, vendorId));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to update price list email");
    res.status(500).json({ error: "Failed to update" });
  }
});

/**
 * Inbound email webhook.
 * Accepts JSON { from, subject, html, text } — compatible with Zapier.
 * Also accepts Mailgun-style form fields (body-html, body-plain).
 *
 * Flow:
 *  1. Find vendor by priceListEmail matching the `from` address
 *  2. Extract a Mailchimp/list-manage.com URL from the email body
 *  3. Run the price import
 */
router.post("/webhooks/price-list", async (req, res) => {
  const body = req.body as {
    from?: string;
    From?: string;
    subject?: string;
    Subject?: string;
    html?: string;
    text?: string;
    "body-html"?: string;
    "body-plain"?: string;
  };

  const fromEmail = (body.from ?? body.From ?? "").toLowerCase().trim();
  const subject = body.subject ?? body.Subject ?? "";
  const html = body.html ?? body["body-html"] ?? "";
  const text = body.text ?? body["body-plain"] ?? "";

  if (!fromEmail) {
    res.status(400).json({ error: "Missing from address" });
    return;
  }

  // Find vendor by price list email
  const vendors = await db.select().from(vendorsTable);
  const vendor = vendors.find(
    (v) => v.priceListEmail && v.priceListEmail.toLowerCase().trim() === fromEmail,
  );

  if (!vendor) {
    // Not a known vendor — still return 200 so the caller doesn't retry
    req.log.warn({ fromEmail }, "Webhook: no vendor matched price list email");
    res.json({ ok: true, message: "No matching vendor found for sender" });
    return;
  }

  const url = extractPriceListUrl(html, text);
  if (!url) {
    req.log.warn({ fromEmail, vendorId: vendor.id }, "Webhook: no price list URL found in email");
    // Log a failed import
    await db.insert(priceListImportsTable).values({
      vendorId: vendor.id,
      triggeredBy: "webhook",
      emailFrom: fromEmail,
      emailSubject: subject,
      productsUpdated: 0,
      productsAdded: 0,
      status: "error",
      errorMessage: "No Mailchimp/price list URL found in email body",
    });
    res.json({ ok: true, message: "No price list URL found in email" });
    return;
  }

  try {
    const result = await runPriceImport({
      vendorId: vendor.id,
      url,
      triggeredBy: "webhook",
      emailFrom: fromEmail,
      emailSubject: subject,
    });
    req.log.info(
      { vendorId: vendor.id, updated: result.productsUpdated, added: result.productsAdded },
      "Webhook price import complete",
    );
    res.json({ ok: true, productsUpdated: result.productsUpdated, productsAdded: result.productsAdded });
  } catch (err) {
    req.log.error({ err }, "Webhook price import failed");
    res.status(500).json({ error: "Import failed" });
  }
});

export default router;
