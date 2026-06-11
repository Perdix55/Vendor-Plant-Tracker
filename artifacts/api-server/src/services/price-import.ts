import { load } from "cheerio";
import { db, productsTable, priceListImportsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export type ParsedItem = {
  name: string;
  cost: number;
  size?: string;
  rawLine?: string;
};

export type ImportResult = {
  items: ParsedItem[];
  productsUpdated: number;
  productsAdded: number;
  unmatched: ParsedItem[];
};

export async function runPriceImport(opts: {
  vendorId: number;
  url: string;
  triggeredBy: "manual" | "webhook";
  emailFrom?: string;
  emailSubject?: string;
  addNewProducts?: boolean;
}): Promise<ImportResult> {
  const { vendorId, url, triggeredBy, emailFrom, emailSubject, addNewProducts = true } = opts;

  let result: ImportResult = { items: [], productsUpdated: 0, productsAdded: 0, unmatched: [] };

  try {
    const { buffer, contentType, finalUrl } = await fetchUrlBinary(url);
    let items: ParsedItem[];

    if (isPdf(contentType, finalUrl)) {
      const text = await extractPdfText(buffer);
      items = parsePriceListText(text);
    } else if (isHtml(contentType)) {
      const html = buffer.toString("utf-8");
      items = parseHtmlForPrices(html);
    } else {
      throw new Error(
        `Unsupported content type: ${contentType}. Expected HTML or PDF. URL resolved to: ${finalUrl}`,
      );
    }

    result.items = items;

    if (items.length > 0) {
      const dbResult = await upsertProductPrices(vendorId, items, addNewProducts);
      result.productsUpdated = dbResult.updated;
      result.productsAdded = dbResult.added;
      result.unmatched = dbResult.unmatched;
    }

    await db.insert(priceListImportsTable).values({
      vendorId,
      triggeredBy,
      sourceUrl: url,
      emailFrom: emailFrom ?? null,
      emailSubject: emailSubject ?? null,
      productsUpdated: result.productsUpdated,
      productsAdded: result.productsAdded,
      status: "success",
      rawPreview: JSON.stringify(items.slice(0, 10)),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await db.insert(priceListImportsTable).values({
      vendorId,
      triggeredBy,
      sourceUrl: url,
      emailFrom: emailFrom ?? null,
      emailSubject: emailSubject ?? null,
      productsUpdated: 0,
      productsAdded: 0,
      status: "error",
      errorMessage: message,
    });
    throw err;
  }

  return result;
}

async function fetchUrlBinary(url: string): Promise<{ buffer: Buffer; contentType: string; finalUrl: string }> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/pdf,*/*;q=0.8",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch price list (HTTP ${response.status}): ${url}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const finalUrl = response.url ?? url;
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return { buffer, contentType, finalUrl };
}

function isPdf(contentType: string, url: string): boolean {
  return contentType.includes("application/pdf") || url.toLowerCase().endsWith(".pdf");
}

function isHtml(contentType: string): boolean {
  return contentType.includes("text/html") || contentType.includes("application/xhtml");
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  // Use pdfjs-dist (external, resolved at runtime from node_modules)
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await (pdfjs as typeof pdfjs).getDocument({ data: new Uint8Array(buffer) }).promise;

  let fullText = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = (textContent.items as Array<{ str?: string }>)
      .map((item) => item.str ?? "")
      .join(" ");
    fullText += pageText + "\n";
  }
  return fullText;
}

/**
 * Parse text extracted from a PDF price list.
 * Handles the Andersen Farms format:
 *   `Plant Name [**] [NEW]   quantity   $price   size/notes`
 * and common nursery text-based price lists.
 */
export function parsePriceListText(text: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  const seen = new Set<string>();

  // Split around price markers (e.g. "$4.25", "$12.50")
  // With capturing group, parts alternate: [before, price, between, price, ...]
  const parts = text.split(/(\$\d{1,4}(?:\.\d{1,2})?)/);

  for (let i = 1; i < parts.length; i += 2) {
    const priceStr = parts[i];
    const segBefore = i >= 1 ? parts[i - 1] : "";

    const price = parseFloat(priceStr.replace("$", ""));
    if (isNaN(price) || price < 1.0 || price > 500) continue; // skip packaging / surcharges

    const name = extractNameFromPdfSegment(segBefore);
    if (!name) continue;

    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      items.push({ name, cost: price, rawLine: `${name} ${priceStr}` });
    }
  }

  return items;
}

/** Extract the plant name from the text segment immediately preceding a price. */
function extractNameFromPdfSegment(segment: string): string | null {
  // Step 1: strip trailing quantity (digits with optional comma separators, or a single dash)
  let s = segment.trimEnd();
  s = s.replace(/\s+[\d,]+\s*$/, "").trimEnd();
  s = s.replace(/\s+-\s*$/, "").trimEnd();

  // Step 2: strip trailing NEW (with optional surrounding ** markers)
  s = s.replace(/\s*\*{0,2}\s*NEW\s*$/i, "").trimEnd();

  // Step 3: strip trailing asterisks
  s = s.replace(/\s*\*+\s*$/, "").trimEnd();

  if (!s) return null;

  // Step 4: get the last meaningful chunk — try 2+-space split first, then newline split
  const chunks = s.split(/\s{2,}|\n/).map((c) => c.trim()).filter((c) => c.length > 0);
  let name = chunks.length > 0 ? chunks[chunks.length - 1] : s.trim();

  // Step 5: clean up any residual ** and NEW that may be within the name token
  name = name.replace(/\s*\*{0,2}\s*NEW\s*$/i, "").replace(/\*+/g, "").trim();

  return isValidPlantName(name) ? name : null;
}

function isValidPlantName(name: string): boolean {
  if (!name || name.length < 2) return false;
  // Starts with a digit → size note or quantity
  if (/^\d/.test(name)) return false;
  // All-caps with no lowercase → header or label
  if (/^[A-Z][A-Z\s\-/'*,.]+$/.test(name) && !/[a-z]/.test(name)) return false;
  // Skippable labels
  if (/^(Plant\s+Name|Price|Notes|Specs|Size|Item|OFFICE|PACKAGING|BOXES|SLEEVE|CARE\s+TAGS|COVER\s+POTS|LABELS)/i.test(name)) return false;
  // Contact / URL content
  if (name.includes("@") || name.includes("www.") || name.startsWith("http")) return false;
  // Pot size section headers
  if (/\d+["']?\s*(?:POT\s+)?SIZE/i.test(name) || /(?:POT\s+)?SIZE\s+\d/i.test(name)) return false;
  return true;
}

/** Parse HTML newsletters for price data (table rows and text fallback) */
export function parseHtmlForPrices(html: string): ParsedItem[] {
  const $ = load(html);
  const items: ParsedItem[] = [];
  const seen = new Set<string>();

  const addItem = (name: string, cost: number, size?: string, rawLine?: string) => {
    const cleaned = name.replace(/\*+$/, "").trim();
    const key = cleaned.toLowerCase();
    if (!seen.has(key) && cleaned.length > 1 && cost >= 1 && cost < 1000) {
      seen.add(key);
      items.push({ name: cleaned, cost, size, rawLine });
    }
  };

  // Strategy 1: table rows with at least 2 cells
  $("table tr").each((_, row) => {
    const cells = $(row)
      .find("td, th")
      .map((_, c) => $(c).text().replace(/\s+/g, " ").trim())
      .get();
    if (cells.length < 2) return;

    const price = extractDollarPrice(cells[cells.length - 1]);
    if (price !== null && cells[0] && !isHeaderToken(cells[0])) {
      const size = cells.length >= 3 ? cells[1] : undefined;
      addItem(cells[0], price, size, cells.join(" | "));
    }
  });

  // Strategy 2: fall back to full-text parsing
  if (items.length === 0) {
    const text = $("body").text();
    parsePriceListText(text).forEach((i) => addItem(i.name, i.cost, i.size, i.rawLine));
  }

  return items;
}

function extractDollarPrice(text: string): number | null {
  const m = text.match(/\$\s*(\d{1,4}(?:\.\d{1,2})?)/);
  if (m) {
    const v = parseFloat(m[1]);
    if (!isNaN(v) && v >= 1 && v < 1000) return v;
  }
  return null;
}

function isHeaderToken(text: string): boolean {
  return /^(item|name|product|plant|description|size|price|cost|unit|each|qty|quantity|total|avail)/i.test(
    text.toLowerCase(),
  );
}

/** Extract a Mailchimp / list-manage.com archive or PDF link from email HTML or plain text */
export function extractPriceListUrl(html: string, text: string): string | null {
  const sources = [html, text];
  const patterns = [
    /https?:\/\/[^\s"'<>]*list-manage\.com\/[^\s"'<>]*/gi,
    /https?:\/\/[^\s"'<>]*mailchimp\.com\/[^\s"'<>]*/gi,
    /https?:\/\/[^\s"'<>]*mailchi\.mp\/[^\s"'<>]*/gi,
    /https?:\/\/[^\s"'<>]*mcusercontent\.com\/[^\s"'<>]*\.pdf[^\s"'<>]*/gi,
  ];

  for (const src of sources) {
    for (const pattern of patterns) {
      const matches = src.match(pattern);
      if (matches) {
        const goodLink = matches.find(
          (m) => !m.includes("unsubscribe") && !m.includes("profile") && !m.includes("optout"),
        );
        const url = (goodLink ?? matches[0]).split('"')[0].split("'")[0].split(">")[0];
        return url;
      }
    }
  }
  return null;
}

async function upsertProductPrices(
  vendorId: number,
  items: ParsedItem[],
  addNew: boolean,
): Promise<{ updated: number; added: number; unmatched: ParsedItem[] }> {
  const existing = await db
    .select({ id: productsTable.id, name: productsTable.name })
    .from(productsTable)
    .where(eq(productsTable.vendorId, vendorId));

  let updated = 0;
  let added = 0;
  const unmatched: ParsedItem[] = [];

  for (const item of items) {
    const nameLower = item.name.toLowerCase();

    // Exact match (case-insensitive)
    let match = existing.find((p) => p.name.toLowerCase() === nameLower);

    // Fuzzy: one name contains the other (minimum 4 chars)
    if (!match && nameLower.length >= 4) {
      match = existing.find((p) => {
        const pl = p.name.toLowerCase();
        return pl.includes(nameLower) || nameLower.includes(pl);
      });
    }

    if (match) {
      await db.update(productsTable).set({ cost: String(item.cost) }).where(eq(productsTable.id, match.id));
      updated++;
    } else if (addNew) {
      const [inserted] = await db
        .insert(productsTable)
        .values({ vendorId, name: item.name, cost: String(item.cost) })
        .returning({ id: productsTable.id, name: productsTable.name });
      existing.push(inserted);
      added++;
    } else {
      unmatched.push(item);
    }
  }

  return { updated, added, unmatched };
}
