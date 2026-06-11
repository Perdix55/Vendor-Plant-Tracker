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

/**
 * Import prices from an already-downloaded PDF buffer (e.g. a file upload).
 * Behaves identically to runPriceImport but skips the HTTP fetch step.
 */
export async function runPriceImportFromBuffer(opts: {
  vendorId: number;
  buffer: Buffer;
  filename?: string;
  triggeredBy: "manual";
  addNewProducts?: boolean;
}): Promise<ImportResult> {
  const { vendorId, buffer, filename = "upload.pdf", triggeredBy, addNewProducts = true } = opts;
  const result: ImportResult = { items: [], productsUpdated: 0, productsAdded: 0, unmatched: [] };

  try {
    // Validate PDF magic bytes (%PDF)
    if (buffer.length < 4 || buffer[0] !== 0x25 || buffer[1] !== 0x50 || buffer[2] !== 0x44 || buffer[3] !== 0x46) {
      throw new Error("Uploaded file does not appear to be a PDF (missing %PDF header).");
    }

    const text = await extractPdfText(buffer);
    const items = parsePriceListText(text);
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
      sourceUrl: `upload:${filename}`,
      emailFrom: null,
      emailSubject: null,
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
      sourceUrl: `upload:${filename}`,
      emailFrom: null,
      emailSubject: null,
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
  // Convert Google Drive share/view URLs to direct download URLs
  const fetchUrl = toGoogleDriveDownloadUrl(url) ?? url;

  const response = await fetch(fetchUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/pdf,*/*;q=0.8",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch price list (HTTP ${response.status}): ${fetchUrl}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const finalUrl = response.url ?? fetchUrl;
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return { buffer, contentType, finalUrl };
}

/**
 * Convert a Google Drive share URL to a direct binary download URL.
 * Handles:
 *   https://drive.google.com/file/d/{id}/view  →  usercontent download URL
 *   https://drive.google.com/open?id={id}      →  usercontent download URL
 * Returns null if the URL is not a recognisable Google Drive share link.
 */
function toGoogleDriveDownloadUrl(url: string): string | null {
  // /file/d/{id}/view or /file/d/{id}/edit
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (fileMatch) {
    return `https://drive.usercontent.google.com/download?id=${fileMatch[1]}&export=download`;
  }
  // ?id={id} form
  const idMatch = url.match(/drive\.google\.com\/.*[?&]id=([^&]+)/);
  if (idMatch) {
    return `https://drive.usercontent.google.com/download?id=${idMatch[1]}&export=download`;
  }
  return null;
}

function isPdf(contentType: string, url: string): boolean {
  if (contentType.includes("application/pdf")) return true;
  if (url.toLowerCase().endsWith(".pdf")) return true;
  // Google Drive usercontent downloads return application/octet-stream but are PDFs
  if (url.includes("drive.usercontent.google.com")) return true;
  return false;
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
 * Normalise spaced-out prices produced by some PDF renderers.
 * e.g. "$ 7. 50" → "$7.50",  "$ 1 2. 50" → "$12.50",  "$ 4 3 . 0 0" → "$43.00"
 */
function normalizeSpacedPrices(text: string): string {
  return text.replace(
    /\$\s*(\d(?:\s*\d)*)\s*\.\s*(\d(?:\s*\d)*)/g,
    (_, dollars, cents) => `$${dollars.replace(/\s/g, "")}.${cents.replace(/\s/g, "")}`,
  );
}

/**
 * Parse text extracted from a PDF price list.
 *
 * Handles two formats:
 *  • Andersen Farms: `Plant Name [**] [NEW]   quantity   $price   notes`
 *  • Castleton Gardens (and similar hierarchical PDFs):
 *      Genus section header → Pot size sub-header → Variety name   Specs   $price   Notes
 *    Prices may be rendered with internal spaces ("$ 7. 50") which are normalised first.
 *    Genus is tracked as state and prepended to variety names.
 */
export function parsePriceListText(rawText: string): ParsedItem[] {
  // Normalise spaced prices before splitting (handles Castleton Gardens-style PDFs)
  const text = normalizeSpacedPrices(rawText);

  const items: ParsedItem[] = [];
  const seen = new Set<string>();
  let currentGenus = "";

  // Split around price markers; capturing group yields alternating [text, price, text, price, …]
  const parts = text.split(/(\$\d{1,4}(?:\.\d{1,2})?)/);

  for (let i = 1; i < parts.length; i += 2) {
    const priceStr = parts[i];
    const segBefore = parts[i - 1] ?? "";

    const price = parseFloat(priceStr.replace("$", ""));
    if (isNaN(price) || price < 1.0 || price > 500) continue;

    // Update genus context from this segment (hierarchical PDFs only)
    const detectedGenus = detectGenusInSegment(segBefore);
    if (detectedGenus) currentGenus = detectedGenus;

    const variety = extractNameFromPdfSegment(segBefore);
    if (!variety) continue;

    // Prepend genus when present and not already part of the variety name
    const fullName =
      currentGenus && !variety.toLowerCase().startsWith(currentGenus.toLowerCase())
        ? `${currentGenus} ${variety}`
        : variety;

    const key = fullName.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      items.push({ name: fullName, cost: price, rawLine: `${fullName} ${priceStr}` });
    }
  }

  return items;
}

/**
 * Detect a genus section header inside a PDF text segment.
 * A genus header is a properly-capitalised word or two-word phrase that appears
 * immediately before a pot-size token (e.g. "Aglaonema" before "6\""), AND there
 * must be at least one more non-stop chunk AFTER the pot-size (i.e. the variety name).
 *
 * This guards against false positives like a variety name ("Romeo") that happens to
 * be followed by its own height spec ("12\"") — those have nothing after the size.
 */
function detectGenusInSegment(segment: string): string | null {
  const chunks = segment
    .split(/\s{2,}|\n/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  for (let i = 0; i < chunks.length - 2; i++) {
    if (isGenusCandidate(chunks[i]) && isPotSizeToken(chunks[i + 1])) {
      // Confirm there is at least one valid variety name chunk after the pot-size
      const afterPotSize = chunks.slice(i + 2);
      const hasVariety = afterPotSize.some((c) => !isHardStop(c) && !isTailSkip(c) && c.length > 1);
      if (hasVariety) return chunks[i];
    }
  }
  return null;
}

/** Proper-case single or two-word string with no digits (e.g. "Aglaonema", "Dracaena Cane"). */
function isGenusCandidate(s: string): boolean {
  return /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)?$/.test(s) && s.length >= 4 && s.length <= 25;
}

/**
 * Common nursery container sizes used as section sub-headers (≤ 17 in).
 * Accepts both ASCII " (U+0022) and the curly/smart right double-quote U+201D that pdfjs
 * often produces when extracting text from PDFs with typographic quote glyphs.
 */
function isPotSizeToken(s: string): boolean {
  // Strip any trailing quote character (ASCII or Unicode curly/prime variants)
  const stripped = s.replace(/["\u201c\u201d\u2033\u2032\u0060']+$/, "");
  if (!/^\d{1,2}$/.test(stripped)) return false;
  return parseInt(stripped, 10) <= 17;
}

/**
 * Extract the plant name from the text segment immediately preceding a price.
 *
 * Strategy: walk backward through 2+-space-delimited chunks in two phases:
 *  1. "tail-skip"  — skip size specs, notes, N/A (without starting the name yet)
 *  2. "accumulate" — collect valid name chunks; stop at the first hard-stop token
 *                    (digit-starting tokens, all-caps labels, etc.)
 *
 * This correctly handles:
 *  • "Red   Valentine   N/A"  → "Red Valentine"
 *  • "Maria   "Emerald Beauty"   12"" → 'Maria "Emerald Beauty"'
 *  • "NEW CROP  Cordyline  10"  Bolero (4ppp)  N/A"  → "Bolero (4ppp)"
 */
function extractNameFromPdfSegment(segment: string): string | null {
  // Clean up stray ** and trailing NEW before chunking
  let s = segment.trimEnd();
  s = s.replace(/\s*\*{0,2}\s*NEW\s*$/i, "").trimEnd();
  s = s.replace(/\s*\*+\s*$/, "").trimEnd();
  if (!s) return null;

  const chunks = s
    .split(/\s{2,}|\n/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const nameChunks: string[] = [];
  let phase: "tail-skip" | "accumulate" = "tail-skip";

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i];

    if (phase === "tail-skip") {
      // Skip tail noise (size specs, N/A, notes, digit-starting size specs) before finding any name
      if (isTailSkip(chunk)) continue;
      if (/^\d/.test(chunk)) continue; // digit-starting in tail = size spec, keep looking
      if (isHardStop(chunk)) break; // all-caps header before any name → give up
      // First valid chunk: start accumulating
      const cleaned = chunk.replace(/\s*\*{0,2}\s*NEW\s*$/i, "").replace(/\*+/g, "").trim();
      if (!cleaned) continue;
      nameChunks.unshift(cleaned);
      phase = "accumulate";
    } else {
      // Accumulate: we already have at least one name chunk
      if (isHardStop(chunk)) break; // digit-starting or all-caps → stop
      if (isTailSkip(chunk)) continue; // notes / separators in the middle → skip without stopping
      const cleaned = chunk.replace(/\s*\*{0,2}\s*NEW\s*$/i, "").replace(/\*+/g, "").trim();
      if (cleaned) nameChunks.unshift(cleaned);
      // Safety: don't accumulate more than 4 chunks (guards against pulling in header garbage)
      if (nameChunks.length >= 4) break;
    }
  }

  const name = nameChunks.join(" ").trim();
  if (!name) return null;
  return isValidPlantName(name) ? name : null;
}

/**
 * Chunks that are pure "tail noise" to skip over before (or around) the variety name.
 * These do NOT cause us to stop accumulating — we skip and keep looking.
 */
function isTailSkip(chunk: string): boolean {
  // N/A placeholder
  if (/^n\/a$/i.test(chunk)) return true;
  // Dash-only separator
  if (/^-+$/.test(chunk)) return true;
  // Explicit notes tokens
  if (/^(NEW\s*CROP|NEW\s*ITEM|LIMITED|ON\s*SALE|SALE|B[-\s]GRADE|NEW)$/i.test(chunk)) return true;
  return false;
}

/**
 * Chunks that mark a hard stop — we should not accumulate past these.
 * Used both as tail-skip terminators (before name is found) and as accumulation stoppers.
 */
function isHardStop(chunk: string): boolean {
  // Starts with an ASCII digit → size spec or quantity
  if (/^\d/.test(chunk)) return true;
  // Starts with Unicode fraction/measurement characters (½, ¼, ¾, ″ etc.)
  if (/^[\u00bc-\u00be\u2150-\u215f\u2189\u2033\u2032]/.test(chunk)) return true;
  // All-caps with no lowercase → section header, label
  if (/^[A-Z\s\-/'*,.0-9]+$/.test(chunk) && !/[a-z]/.test(chunk) && chunk.length > 2) return true;
  return false;
}

function isValidPlantName(name: string): boolean {
  if (!name || name.length < 2) return false;
  // Starts with a digit → size note or quantity
  if (/^\d/.test(name)) return false;
  // Starts with Unicode fraction → measurement
  if (/^[\u00bc-\u00be\u2150-\u215f]/.test(name)) return false;
  // Starts with a dash/en-dash → size range or separator
  if (/^[-–—]/.test(name)) return false;
  // All-caps with no lowercase → header or label
  if (/^[A-Z][A-Z\s\-/'*,.]+$/.test(name) && !/[a-z]/.test(name)) return false;
  // Skippable labels and service items
  if (
    /^(Plant\s+Name|Price|Notes|Specs|Size|Item|OFFICE|PACKAGING|BOXES|SLEEVE|CARE\s+TAGS|COVER\s+POTS|LABELS|Phytosanitary|Certificate|Box)/i.test(
      name,
    )
  )
    return false;
  // Contact / URL content
  if (name.includes("@") || name.includes("www.") || name.startsWith("http")) return false;
  // Pot size section headers
  if (/\d+["']?\s*(?:POT\s+)?SIZE/i.test(name) || /(?:POT\s+)?SIZE\s+\d/i.test(name)) return false;
  // N/A placeholder
  if (/^n\/a$/i.test(name)) return false;
  // Dimension-like strings (e.g. "X 48\"/60\"")
  if (/\d["\u201d]\/\d/.test(name)) return false;
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

/** Extract a price list URL from email HTML or plain text.
 *  Supports Mailchimp campaign links and Google Drive share links. */
export function extractPriceListUrl(html: string, text: string): string | null {
  const sources = [html, text];

  // All patterns ordered by specificity; capturing group not used — just match the full URL
  const patterns = [
    // Google Drive share/view links
    /https?:\/\/drive\.google\.com\/file\/d\/[^\s"'<>]+/gi,
    /https?:\/\/drive\.google\.com\/open\?[^\s"'<>]+/gi,
    // Mailchimp / list-manage direct PDF
    /https?:\/\/[^\s"'<>]*mcusercontent\.com\/[^\s"'<>]*\.pdf[^\s"'<>]*/gi,
    // Mailchimp campaign archive / hosted links
    /https?:\/\/[^\s"'<>]*list-manage\.com\/[^\s"'<>]*/gi,
    /https?:\/\/[^\s"'<>]*mailchimp\.com\/[^\s"'<>]*/gi,
    /https?:\/\/[^\s"'<>]*mailchi\.mp\/[^\s"'<>]*/gi,
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
