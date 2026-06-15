import { load } from "cheerio";
import * as XLSX from "xlsx";
import { db, productsTable, priceListImportsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export type ParsedItem = {
  name: string;
  cost: number;
  size?: string;
  rawLine?: string;
};

/** A product entry discovered from a no-price availability list (no cost column). */
export type CatalogItem = {
  name: string;
};

export type PriceChange = {
  name: string;
  oldCost: number;
  newCost: number;
};

export type ImportResult = {
  items: ParsedItem[];
  productsUpdated: number;
  productsAdded: number;
  unmatched: ParsedItem[];
  priceChanges: PriceChange[];
  /** True when the source had no prices — products were added to catalog only, costs untouched. */
  noPrices?: boolean;
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

  const result: ImportResult = { items: [], productsUpdated: 0, productsAdded: 0, unmatched: [], priceChanges: [] };

  try {
    const { buffer, contentType, finalUrl } = await fetchUrlBinary(url);

    if (isPdf(contentType, finalUrl)) {
      await applyPdfResult(buffer, vendorId, addNewProducts, result);
    } else if (isHtml(contentType)) {
      const html = buffer.toString("utf-8");
      const items = parseHtmlForPrices(html);
      result.items = items;
      if (items.length > 0) {
        const dbResult = await upsertProductPrices(vendorId, items, addNewProducts);
        result.productsUpdated = dbResult.updated;
        result.productsAdded = dbResult.added;
        result.unmatched = dbResult.unmatched;
        result.priceChanges = dbResult.priceChanges;
      }
    } else {
      throw new Error(
        `Unsupported content type: ${contentType}. Expected HTML or PDF. URL resolved to: ${finalUrl}`,
      );
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
      rawPreview: JSON.stringify(result.items.slice(0, 10)),
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
 * K and M Nursery FOB price list format:
 *   Col 0: flag ("NEW" / "LIMITED" / empty)
 *   Col 1: product name
 *   Col 2: "photo" or empty
 *   Col 3: "$X.XX" price  OR  "F.O.B." (section header marker) OR empty
 *   Col 4: UPC barcode
 *
 * No column-header row — section titles appear as rows where col 3 = "F.O.B."
 * Detection: any of the first 5 rows contain the text "F.O.B."
 */
function isKandMFormat(rows: string[][]): boolean {
  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    if (rows[i].some((cell) => String(cell).includes("F.O.B."))) return true;
  }
  return false;
}

function parseKandMRows(rows: string[][]): ParsedItem[] {
  const PRICE_RE = /^\$[\d,]+\.?\d*$/;
  const items: ParsedItem[] = [];
  for (const row of rows) {
    const name = String(row[1] ?? "").trim();
    const priceCell = String(row[3] ?? "").trim();
    if (name && PRICE_RE.test(priceCell)) {
      const price = parseFloat(priceCell.replace(/[$,]/g, ""));
      if (price > 0) {
        items.push({ name, cost: price, rawLine: `${name} ${priceCell}` });
      }
    }
  }
  return items;
}

/**
 * Palm Acres format — three-panel side-by-side layout.
 *
 * Sheet: "INDEPENDENT HOUSE DELIVERED"
 * Header row (index 7): Order | Item# | Code | Cost | Description  (repeated at cols 11 and 21)
 * Data starts at row index 8.
 *
 * Panel column offsets (0-based):
 *   Panel 1: Item# col 2, Cost col 4, Name col 5
 *   Panel 2: Item# col 12, Cost col 14, Name col 15
 *   Panel 3: Item# col 22, Cost col 24, Name col 25
 *
 * Product rows: Item# is a number, Cost is a number, Name is non-empty.
 * Section header rows (category labels): Item# is empty, Name contains category text — skipped.
 */
function isPalmAcresFormat(sheetName: string, rows: string[][]): boolean {
  if (sheetName.toUpperCase().includes("INDEPENDENT HOUSE DELIVERED")) return true;
  // Fallback: header row 7 has "Item#" at col 2 and "Cost" at col 4
  const hdr = rows[7] ?? [];
  return (
    String(hdr[2] ?? "").trim().toLowerCase() === "item#" &&
    String(hdr[4] ?? "").trim().toLowerCase() === "cost" &&
    String(hdr[5] ?? "").trim().toLowerCase() === "description"
  );
}

function parsePalmAcresRows(rows: string[][]): ParsedItem[] {
  // [itemColIdx, costColIdx, nameColIdx] for each of the 3 panels
  const PANELS: [number, number, number][] = [
    [2, 4, 5],
    [12, 14, 15],
    [22, 24, 25],
  ];

  const items: ParsedItem[] = [];
  const seen = new Set<string>();

  for (let ri = 8; ri < rows.length; ri++) {
    const row = rows[ri];
    for (const [itemCol, costCol, nameCol] of PANELS) {
      const rawItem = String(row[itemCol] ?? "").trim();
      const rawCost = String(row[costCol] ?? "").replace(/[$,]/g, "").trim();
      const name = String(row[nameCol] ?? "").trim();

      if (!rawItem || !name) continue;
      const itemNum = parseFloat(rawItem);
      const cost = parseFloat(rawCost);
      if (isNaN(itemNum) || isNaN(cost) || cost <= 0) continue;

      const key = name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        items.push({ name, cost, rawLine: `${name} $${cost}` });
      }
    }
  }

  return items;
}

/**
 * Parse an Excel (.xlsx / .xls) or CSV buffer into ParsedItems.
 *
 * Format detection order:
 *  1. Palm Acres — three-panel layout (sheet "INDEPENDENT HOUSE DELIVERED"),
 *     Item# at cols 2/12/22, Cost at cols 4/14/24, Name at cols 5/15/25.
 *  2. K and M Nursery FOB format — col 1 = name, col 3 = "$X.XX", no header row,
 *     identified by "F.O.B." text appearing in the first few rows.
 *  3. Generic header-based format — scans the first 20 rows for a row containing
 *     recognisable name and price column headers, then extracts those columns.
 */
export function parseExcelBuffer(buffer: Buffer): ParsedItem[] {
  const wb = XLSX.read(buffer, { type: "buffer", cellDates: false });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) return [];
  const ws = wb.Sheets[sheetName];

  const rows: string[][] = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: "",
    raw: false,
  }) as string[][];

  if (rows.length < 1) return [];

  // --- Palm Acres three-panel format ---
  if (isPalmAcresFormat(sheetName, rows)) {
    return parsePalmAcresRows(rows);
  }

  // --- K and M Nursery FOB format ---
  if (isKandMFormat(rows)) {
    return parseKandMRows(rows);
  }

  // --- Generic header-based format ---
  const NAME_HINTS = ["product", "name", "item", "description", "variety", "plant"];
  const PRICE_HINTS = ["price", "cost", "rate", "each", "unit price", "retail", "wholesale", "ea"];

  const pickCol = (headers: string[], hints: string[]) =>
    headers.findIndex((h) => hints.some((hint) => h.toLowerCase().includes(hint)));

  let headerRowIdx = -1;
  let nameCol = -1;
  let priceCol = -1;

  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const cells = rows[i].map((c) => String(c ?? "").trim());
    const ni = pickCol(cells, NAME_HINTS);
    const pi = pickCol(cells, PRICE_HINTS);
    if (ni >= 0 && pi >= 0) {
      headerRowIdx = i;
      nameCol = ni;
      priceCol = pi;
      break;
    }
  }

  // Fall back: treat row 0 as header, col 0 = name, col 1 = price
  if (headerRowIdx < 0) {
    const cells = rows[0].map((c) => String(c ?? "").trim());
    nameCol = 0;
    priceCol = cells.findIndex((c) => /price|cost|rate|each/i.test(c));
    if (priceCol < 0) priceCol = 1;
    headerRowIdx = 0;
  }

  const items: ParsedItem[] = [];
  const seen = new Set<string>();

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    const rawName = String(row[nameCol] ?? "").trim();
    const rawPrice = String(row[priceCol] ?? "").trim();
    if (!rawName) continue;
    const priceStr = rawPrice.replace(/[$,\s]/g, "");
    const price = parseFloat(priceStr);
    if (!isNaN(price) && price > 0) {
      const key = rawName.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        items.push({ name: rawName, cost: price, rawLine: `${rawName} $${price}` });
      }
    }
  }

  return items;
}

const EXCEL_EXTS = [".xlsx", ".xls", ".csv"];
function isExcelFilename(filename: string) {
  return EXCEL_EXTS.some((ext) => filename.toLowerCase().endsWith(ext));
}

/**
 * Import prices from an already-downloaded PDF or Excel buffer (e.g. a file upload).
 * Behaves identically to runPriceImport but skips the HTTP fetch step.
 */
export async function runPriceImportFromBuffer(opts: {
  vendorId: number;
  buffer: Buffer;
  filename?: string;
  triggeredBy: "manual";
  addNewProducts?: boolean;
}): Promise<ImportResult> {
  const { vendorId, buffer, filename = "upload", triggeredBy, addNewProducts = true } = opts;
  const result: ImportResult = { items: [], productsUpdated: 0, productsAdded: 0, unmatched: [], priceChanges: [] };

  try {
    // Route to Excel parser if the filename indicates a spreadsheet
    if (isExcelFilename(filename)) {
      const items = parseExcelBuffer(buffer);
      result.items = items;
      if (items.length > 0) {
        const dbResult = await upsertProductPrices(vendorId, items, addNewProducts);
        result.productsUpdated = dbResult.updated;
        result.productsAdded = dbResult.added;
        result.unmatched = dbResult.unmatched;
        result.priceChanges = dbResult.priceChanges;
      }
    } else {
      // Validate PDF magic bytes (%PDF)
      if (buffer.length < 4 || buffer[0] !== 0x25 || buffer[1] !== 0x50 || buffer[2] !== 0x44 || buffer[3] !== 0x46) {
        throw new Error("Uploaded file does not appear to be a PDF (missing %PDF header).");
      }
      await applyPdfResult(buffer, vendorId, addNewProducts, result);
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
      rawPreview: JSON.stringify(result.items.slice(0, 10)),
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

/**
 * Living Colors Nursery PDF format.
 *
 * Column layout (x positions):
 *   SIZE     x≈17–30   — pot size token (e.g. 5")
 *   VARIETY  x≈34–165  — genus + species/variety; may float to a separate y-line above the data row
 *   PACK     x≈185–198
 *   COLOR    x≈221–275
 *   DESCRIPTION x≈295–400
 *   BOX TYPE x≈482–486
 *   STATUS   x≈508–519
 *   PRICE    x≈555–585 — "$N.NN" (sometimes split across 3 tokens: "$", digits, ".NN")
 *
 * Skip: "Regular price" annotation rows, section headers (no price token), box-charge rows.
 * Floating names: some products have their name token on the y-line immediately above the data row.
 */
function isLivingColorsFormat(items: PdfItem[]): boolean {
  const allText = items.map((i) => i.str).join(" ");
  return allText.includes("Living Colors Nursery");
}

function parseLivingColorsPdf(items: PdfItem[]): ParsedItem[] {
  const PRICE_X_MIN = 550;
  const PRICE_X_MAX = 590;
  const NAME_X_MIN = 30;
  const NAME_X_MAX = 168;

  // Group tokens by y-band (within ±4px) then sort each line by x
  const lineMap = new Map<number, PdfItem[]>();
  for (const item of items) {
    const yKey = Math.round(item.y / 4) * 4;
    if (!lineMap.has(yKey)) lineMap.set(yKey, []);
    lineMap.get(yKey)!.push(item);
  }
  for (const line of lineMap.values()) line.sort((a, b) => a.x - b.x);

  const sortedYs = [...lineMap.keys()].sort((a, b) => b - a); // top-of-page first

  const parsedItems: ParsedItem[] = [];
  const seen = new Set<string>();

  for (let yi = 0; yi < sortedYs.length; yi++) {
    const y = sortedYs[yi];
    const line = lineMap.get(y)!;

    // Skip "Regular price" annotation lines
    const lineText = line.map((t) => t.str).join(" ");
    if (/regular price/i.test(lineText)) continue;

    // Collect price tokens at far-right column
    const priceToks = line.filter((t) => t.x >= PRICE_X_MIN && t.x <= PRICE_X_MAX);
    if (priceToks.length === 0) continue;

    const priceStr = priceToks.map((t) => t.str).join("").replace(/[$,\s]/g, "");
    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) continue;

    // Collect name tokens (x≈34–165), skipping flags
    const FLAG_RE = /^(SALE!!!|LIMITED|NEW|BLOOMS|OPEN|READY|MEDIUM|\(P\)|SL|TL)$/i;
    let nameToks = line.filter((t) => t.x >= NAME_X_MIN && t.x <= NAME_X_MAX && !FLAG_RE.test(t.str));

    // If no name found on this line, look at the immediately preceding y-line
    // (Living Colors sometimes places the variety name on its own line above the data row)
    if (nameToks.length === 0 && yi > 0) {
      const prevY = sortedYs[yi - 1];
      if (prevY - y < 20) {
        const prevLine = lineMap.get(prevY)!;
        const prevPriceToks = prevLine.filter((t) => t.x >= PRICE_X_MIN && t.x <= PRICE_X_MAX);
        if (prevPriceToks.length === 0) {
          nameToks = prevLine.filter((t) => t.x >= NAME_X_MIN && t.x <= NAME_X_MAX && !FLAG_RE.test(t.str));
        }
      }
    }

    if (nameToks.length === 0) continue;

    const varietyName = nameToks.map((t) => t.str).join(" ").trim();
    if (!varietyName) continue;

    // Prepend pot size (x < NAME_X_MIN on the same line)
    const sizeToks = line.filter((t) => t.x < NAME_X_MIN);
    const size = sizeToks.map((t) => t.str).join("").replace(/\s+/g, "").trim();
    const fullName = size ? `${size} ${varietyName}` : varietyName;

    const key = fullName.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      parsedItems.push({ name: fullName, cost: price, rawLine: `${fullName} $${price}` });
    }
  }

  return parsedItems;
}

/**
 * Sunlet Nursery format — three-panel price list with two price tiers (W / WB).
 *
 * Single-page PDF.  Identified by "Availability for ship week" in the token stream.
 *
 * Layout: 3 side-by-side panels.  Each panel has its own size header (e.g. "2 inch",
 * "6 inch", "8 inch") that can change independently mid-page.  Panels:
 *
 *   Panel 0 (left):   Item# x∈[22,55],  Name x∈[55,155],  W-price x∈[155,185]
 *   Panel 1 (middle): Item# x∈[205,238], Name x∈[238,345], W-price x∈[345,370]
 *   Panel 2 (right):  Item# x∈[396,430], Name x∈[430,548], W-price x∈[548,580]
 *
 * A row can mix header cells (size update for one panel) and product data
 * (other panels).  Size tokens match /^\d+ inch$/i.
 *
 * Product name = "{size} {product name}" (e.g. "2 inch Adenium").
 * The W (wholesale) price is used as cost; WB price is ignored.
 */
function isSunletFormat(items: PdfItem[]): boolean {
  return items.some((i) => i.str.includes("Availability for ship week"));
}

function parseSunletPdf(items: PdfItem[]): ParsedItem[] {
  const PANELS = [
    { itemMin: 22, itemMax: 55, nameMin: 55, nameMax: 155, priceMin: 155, priceMax: 185, sizeMin: 55, sizeMax: 200 },
    { itemMin: 205, itemMax: 238, nameMin: 238, nameMax: 345, priceMin: 345, priceMax: 370, sizeMin: 238, sizeMax: 398 },
    { itemMin: 396, itemMax: 430, nameMin: 430, nameMax: 548, priceMin: 548, priceMax: 580, sizeMin: 430, sizeMax: 600 },
  ];
  const SIZE_RE = /^\d+ inch$/i;

  // Group tokens by (page, y-band)
  const lineMap = new Map<string, PdfItem[]>();
  for (const item of items) {
    const key = `${item.page}_${Math.round(item.y / 4) * 4}`;
    if (!lineMap.has(key)) lineMap.set(key, []);
    lineMap.get(key)!.push(item);
  }
  for (const line of lineMap.values()) line.sort((a, b) => a.x - b.x);

  // Process rows top-to-bottom (PDF y increases upward, so sort y descending)
  const sortedKeys = [...lineMap.keys()].sort((a, b) => {
    const ya = parseInt(a.split("_")[1]);
    const yb = parseInt(b.split("_")[1]);
    return yb - ya;
  });

  const activeSize: [string, string, string] = ["", "", ""];
  const results: ParsedItem[] = [];
  const seen = new Set<string>();

  for (const key of sortedKeys) {
    const line = lineMap.get(key)!;

    for (let pi = 0; pi < PANELS.length; pi++) {
      const pan = PANELS[pi];
      const panelToks = line.filter((t) => t.x >= pan.itemMin && t.x < pan.priceMax + 10);

      // Size header token → update active size for this panel, skip as data
      const sizeTok = panelToks.find(
        (t) => t.x >= pan.sizeMin && t.x < pan.sizeMax && SIZE_RE.test(t.str),
      );
      if (sizeTok) {
        activeSize[pi] = sizeTok.str;
        continue;
      }

      // Item# must be a pure integer in the item x-range
      const itemTok = panelToks.find(
        (t) => t.x >= pan.itemMin && t.x < pan.itemMax && /^\d+$/.test(t.str),
      );
      if (!itemTok) continue;

      // Name: all tokens in name x-range
      const nameToks = panelToks.filter((t) => t.x >= pan.nameMin && t.x < pan.nameMax);
      if (!nameToks.length) continue;

      // W (wholesale) price — first token in price x-range
      const priceTok = panelToks.find((t) => t.x >= pan.priceMin && t.x < pan.priceMax);
      if (!priceTok) continue;
      const price = parseFloat(priceTok.str.replace(/[,$]/g, ""));
      if (isNaN(price) || price <= 0) continue;

      const namePart = nameToks.map((t) => t.str).join(" ").trim();
      const fullName = activeSize[pi] ? `${activeSize[pi]} ${namePart}` : namePart;

      const k = fullName.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        results.push({ name: fullName, cost: price, rawLine: `${fullName} $${price}` });
      }
    }
  }

  return results;
}

/**
 * Mercer Botanicals format — availability-only list (no prices).
 *
 * 2-page PDF with columns: POT SIZE | SPECIES | VARIETY | QTY AVAIL | NOTES
 * Identified by "MERCER BOTANICALS" appearing in the token stream.
 *
 * Column x positions (0-based):
 *   POT SIZE : x < 65   (e.g. "8"", "4"", "8" HB")
 *   SPECIES  : x ∈ [65, 165)   (full species descriptor, possibly multiple tokens)
 *   VARIETY  : x ∈ [165, 320)  (not used in product name — comma-separated lists)
 *   QTY AVAIL: x ∈ [320, 345]  (positive integer)
 *   NOTES    : x > 345
 *
 * Product name = "{POT SIZE} {SPECIES}" (title-cased).
 * Since no prices are present, results feed into upsertProductCatalog (noPrices path).
 */
function isMercerFormat(items: PdfItem[]): boolean {
  return items.some((i) => i.str.includes("MERCER BOTANICALS"));
}

function parseMercerPdf(items: PdfItem[]): ParsedItem[] {
  const SIZE_MAX_X = 65;
  const SPECIES_MIN_X = 65;
  const SPECIES_MAX_X = 165;
  const QTY_MIN_X = 320;
  const QTY_MAX_X = 345;

  // Group tokens by (page, y-band) — ±4px tolerance handles column jitter
  const lineMap = new Map<string, PdfItem[]>();
  for (const item of items) {
    const key = `${item.page}_${Math.round(item.y / 4) * 4}`;
    if (!lineMap.has(key)) lineMap.set(key, []);
    lineMap.get(key)!.push(item);
  }
  for (const line of lineMap.values()) line.sort((a, b) => a.x - b.x);

  const toTitleCase = (s: string) =>
    s.replace(/\b\w+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

  const results: ParsedItem[] = [];
  const seen = new Set<string>();

  for (const line of lineMap.values()) {
    const sizeToks = line.filter((t) => t.x < SIZE_MAX_X);
    const speciesToks = line.filter((t) => t.x >= SPECIES_MIN_X && t.x < SPECIES_MAX_X);
    const qtyToks = line.filter((t) => t.x >= QTY_MIN_X && t.x <= QTY_MAX_X);

    if (!sizeToks.length || !speciesToks.length || !qtyToks.length) continue;

    // QTY must be a positive integer (headers like "AVAIL", notes like "9/15"" will fail)
    const qty = parseInt(qtyToks[0].str.trim(), 10);
    if (isNaN(qty) || qty <= 0) continue;

    const size = sizeToks.map((t) => t.str).join("").trim();
    const species = toTitleCase(speciesToks.map((t) => t.str).join(" ").trim());
    const name = `${size} ${species}`;
    if (name.length < 4) continue;

    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      results.push({ name, cost: 0, rawLine: name });
    }
  }

  return results;
}

/**
 * Auto-detects PDF format and populates `result`.
 * Priority order:
 *  1. Mercer Botanicals — availability-only list with SIZE|SPECIES|VARIETY|QTY columns, no prices
 *  2. Living Colors Nursery — column-format with SIZE|VARIETY|...|PRICE layout, identified by "Living Colors Nursery"
 *  3. Capri Farms — combined "$N.NN" at x≈210–245 with dedicated pot-size column at x≈175–200
 *  4. Sturon Nursery format — two-column genus+variety with combined "$N.NN" price tokens
 *  5. Column-format (Northland Floral style) — split "$" + number, position-based parser
 *  6. Text-based price parser (Castleton Gardens, Andersen Farms style)
 *  7. Availability-list parser (Plants in Design style — no prices)
 */

/**
 * The Good Earth Nursery format — weekly availability PDF with prices.
 *
 * 3 pages, two-column layout (left / right panel per page).
 * Each product row: UNITS | PRODUCT NAME | $ | PRICE | QTY | NOTES
 *
 * Left panel x-zones:
 *   Units  : x ∈ [33, 57)
 *   Name   : x ∈ [57, 210)
 *   $      : x ∈ [205, 222)
 *   Price  : x ∈ [218, 260)
 *
 * Right panel x-zones:
 *   Units  : x ∈ [305, 340)
 *   Name   : x ∈ [333, 480)
 *   $      : x ∈ [480, 495)
 *   Price  : x ∈ [492, 540)
 *
 * Section headers appear as wide tokens matching /^\d+"|^\d+\s+gal(lon)?/i in the name
 * x-range; they provide the pot size prepended to each product name.
 *
 * The $ token is used as the primary anchor. For each $ found in a price column,
 * all tokens within ±10px in y are collected; name tokens containing "$" are
 * excluded (they are pricing notes, not names). BTF prices (non-numeric) are skipped.
 *
 * Identified by "The Good Earth Nursery" appearing in the token stream.
 */
function isGoodEarthFormat(items: PdfItem[]): boolean {
  return items.some((i) => i.str.includes("The Good Earth Nursery"));
}

function parseGoodEarthPdf(items: PdfItem[]): ParsedItem[] {
  const SIZE_HEADER_RE = /^(\d+"|(\d+\s+gal(?:lon)?))/i;

  // Index all items by page for windowed lookups
  const byPage = new Map<number, PdfItem[]>();
  for (const tok of items) {
    if (!byPage.has(tok.page)) byPage.set(tok.page, []);
    byPage.get(tok.page)!.push(tok);
  }

  function extractSize(s: string): string {
    const m = s.match(SIZE_HEADER_RE);
    return m ? m[0].trim() : "";
  }

  // Pass 1: collect all section headers, keyed by panel
  // Left section headers  : x ∈ [57, 226) in name range
  // Right section headers : x ∈ [330, 575) in name range
  const leftHeaders: { page: number; y: number; size: string }[] = [];
  const rightHeaders: { page: number; y: number; size: string }[] = [];

  for (const tok of items) {
    if (!SIZE_HEADER_RE.test(tok.str)) continue;
    const size = extractSize(tok.str);
    if (!size) continue;
    if (tok.x >= 57 && tok.x < 226) {
      leftHeaders.push({ page: tok.page, y: tok.y, size });
    } else if (tok.x >= 330 && tok.x < 575) {
      rightHeaders.push({ page: tok.page, y: tok.y, size });
    }
  }

  // Find the nearest section header AT OR ABOVE the given (page, y)
  // "above" = same page, higher y value (PDF y increases upward)
  function nearestSection(
    headers: { page: number; y: number; size: string }[],
    page: number,
    y: number,
  ): string {
    const candidates = headers.filter((h) => h.page === page && h.y >= y);
    if (!candidates.length) return "";
    // Sort ascending by y — the one with the smallest y ≥ product y is closest above
    candidates.sort((a, b) => a.y - b.y);
    return candidates[0].size;
  }

  // Pass 2: for each $ in a price column, extract the product
  const Y_WINDOW = 10;
  const results: ParsedItem[] = [];
  const seen = new Set<string>();

  const leftDollars = items.filter(
    (t) => t.str === "$" && t.x >= 205 && t.x < 222,
  );
  const rightDollars = items.filter(
    (t) => t.str === "$" && t.x >= 480 && t.x < 495,
  );

  function extractProduct(
    dollarTok: PdfItem,
    panel: "left" | "right",
  ): ParsedItem | null {
    const { page, y: dy } = dollarTok;
    const isLeft = panel === "left";
    const pageToks = byPage.get(page) ?? [];

    // Tokens within ±Y_WINDOW px of the $ anchor
    const window = pageToks.filter((t) => Math.abs(t.y - dy) <= Y_WINDOW);

    // Units token (we just need its presence to confirm a real product row)
    const hasUnits = window.some(
      isLeft
        ? (t) => t.x >= 33 && t.x < 57
        : (t) => t.x >= 305 && t.x < 340,
    );
    if (!hasUnits) return null;

    // Name tokens: collect all in name x-range, skip tokens containing "$"
    const nameToks = window
      .filter(
        isLeft
          ? (t) => t.x >= 57 && t.x < 210
          : (t) => t.x >= 333 && t.x < 480,
      )
      .filter((t) => !t.str.includes("$"))
      // Exclude section header tokens (they have size pattern)
      .filter((t) => !SIZE_HEADER_RE.test(t.str))
      // Sort top-to-bottom (higher y = higher on page), then left-to-right
      .sort((a, b) => b.y - a.y || a.x - b.x);

    const rawName = nameToks.map((t) => t.str).join(" ").trim();
    if (!rawName) return null;

    // Price token in price column
    const priceTok = window.find(
      isLeft
        ? (t) => t.x >= 218 && t.x < 260
        : (t) => t.x >= 492 && t.x < 540,
    );
    if (!priceTok) return null;
    const cost = parseFloat(priceTok.str.replace(/[,$+]/g, ""));
    if (isNaN(cost) || cost <= 0) return null;

    const sectionHeaders = isLeft ? leftHeaders : rightHeaders;
    const size = nearestSection(sectionHeaders, page, dy);

    // Title-case the raw name
    const titleName = rawName
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const fullName = size ? `${size} ${titleName}` : titleName;

    const k = fullName.toLowerCase();
    if (seen.has(k)) return null;
    seen.add(k);

    return { name: fullName, cost, rawLine: `${fullName} $${cost}` };
  }

  for (const d of leftDollars) {
    const p = extractProduct(d, "left");
    if (p) results.push(p);
  }
  for (const d of rightDollars) {
    const p = extractProduct(d, "right");
    if (p) results.push(p);
  }

  return results;
}

async function applyPdfResult(
  buffer: Buffer,
  vendorId: number,
  addNew: boolean,
  result: ImportResult,
): Promise<void> {
  const pdfItems = await extractPdfItems(buffer);

  // 1. Good Earth Nursery: two-column weekly availability with prices, identified by "The Good Earth Nursery"
  if (isGoodEarthFormat(pdfItems)) {
    const priceItems = parseGoodEarthPdf(pdfItems);
    if (priceItems.length > 0) {
      result.items = priceItems;
      const dbResult = await upsertProductPrices(vendorId, priceItems, addNew);
      result.productsUpdated = dbResult.updated;
      result.productsAdded = dbResult.added;
      result.unmatched = dbResult.unmatched;
      result.priceChanges = dbResult.priceChanges;
      return;
    }
  }

  // 2. Sunlet Nursery: three-panel W/WB price list, identified by "Availability for ship week"
  if (isSunletFormat(pdfItems)) {
    const priceItems = parseSunletPdf(pdfItems);
    if (priceItems.length > 0) {
      result.items = priceItems;
      const dbResult = await upsertProductPrices(vendorId, priceItems, addNew);
      result.productsUpdated = dbResult.updated;
      result.productsAdded = dbResult.added;
      result.unmatched = dbResult.unmatched;
      result.priceChanges = dbResult.priceChanges;
      return;
    }
  }

  // 2. Mercer Botanicals: availability-only list — SIZE|SPECIES|VARIETY|QTY, no prices
  if (isMercerFormat(pdfItems)) {
    const catalogItems = parseMercerPdf(pdfItems);
    if (catalogItems.length > 0) {
      result.noPrices = true;
      result.items = catalogItems;
      const dbResult = await upsertProductCatalog(vendorId, catalogItems, addNew);
      result.productsAdded = dbResult.added;
      return;
    }
  }

  // 2. Living Colors Nursery: SIZE|VARIETY|...|PRICE column format, price at x≈555–585
  if (isLivingColorsFormat(pdfItems)) {
    const priceItems = parseLivingColorsPdf(pdfItems);
    if (priceItems.length > 0) {
      result.items = priceItems;
      const dbResult = await upsertProductPrices(vendorId, priceItems, addNew);
      result.productsUpdated = dbResult.updated;
      result.productsAdded = dbResult.added;
      result.unmatched = dbResult.unmatched;
      result.priceChanges = dbResult.priceChanges;
      return;
    }
  }

  // 2. Capri Farms: combined "$N.NN" at x≈210–245 with dedicated pot-size column at x≈175–200
  if (isCapriFormat(pdfItems)) {
    const priceItems = parseCapriPdf(pdfItems);
    if (priceItems.length > 0) {
      result.items = priceItems;
      const dbResult = await upsertProductPrices(vendorId, priceItems, addNew);
      result.productsUpdated = dbResult.updated;
      result.productsAdded = dbResult.added;
      result.unmatched = dbResult.unmatched;
      result.priceChanges = dbResult.priceChanges;
      return;
    }
  }

  // 2. Sturon Nursery: combined "$N.NN" price tokens, two-column genus+variety layout
  if (isSturonFormat(pdfItems)) {
    const priceItems = parseSturonPdf(pdfItems);
    if (priceItems.length > 0) {
      result.items = priceItems;
      const dbResult = await upsertProductPrices(vendorId, priceItems, addNew);
      result.productsUpdated = dbResult.updated;
      result.productsAdded = dbResult.added;
      result.unmatched = dbResult.unmatched;
      result.priceChanges = dbResult.priceChanges;
      return;
    }
  }

  // 2. Column-format (Northland Floral, Carter Road Tropical): split "$" + number
  if (isColumnFormat(pdfItems)) {
    const priceItems = parseColumnPdf(pdfItems);
    if (priceItems.length > 0) {
      result.items = priceItems;
      const dbResult = await upsertProductPrices(vendorId, priceItems, addNew);
      result.productsUpdated = dbResult.updated;
      result.productsAdded = dbResult.added;
      result.unmatched = dbResult.unmatched;
      result.priceChanges = dbResult.priceChanges;
      return;
    }
  }

  // 2 & 3. Fall back to text-based parsers
  const text = await extractPdfText(buffer);
  const priceItems = parsePriceListText(text);
  if (priceItems.length > 0) {
    result.items = priceItems;
    const dbResult = await upsertProductPrices(vendorId, priceItems, addNew);
    result.productsUpdated = dbResult.updated;
    result.productsAdded = dbResult.added;
    result.unmatched = dbResult.unmatched;
    result.priceChanges = dbResult.priceChanges;
  } else {
    // No prices found — try availability list format (Plants in Design style)
    const catalogItems = parseAvailabilityText(text);
    if (catalogItems.length > 0) {
      result.noPrices = true;
      const dbResult = await upsertProductCatalog(vendorId, catalogItems, addNew);
      result.productsAdded = dbResult.added;
      // Represent catalog items as ParsedItem with cost=0 for history/preview
      result.items = catalogItems.map((c) => ({ name: c.name, cost: 0 }));
    }
  }
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

/** A single text item from a PDF page, with x/y position. */
interface PdfItem {
  str: string;
  x: number;
  y: number;
  page: number;
}

/**
 * Extract all text items from a PDF with their (x, y) page coordinates.
 * Used for column-format PDFs where position matters more than reading order.
 */
async function extractPdfItems(buffer: Buffer): Promise<PdfItem[]> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await (pdfjs as typeof pdfjs).getDocument({ data: new Uint8Array(buffer) }).promise;
  const items: PdfItem[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    for (const item of tc.items as Array<{ str?: string; transform?: number[] }>) {
      const s = item.str?.trim();
      if (!s || !item.transform) continue;
      items.push({
        str: s,
        x: Math.round(item.transform[4]),
        y: Math.round(item.transform[5]),
        page: i,
      });
    }
  }
  return items;
}

/**
 * Detect a structured column-format PDF where the $ sign is a standalone text item
 * (separate from the price number), such as Northland Floral and Carter Road Tropical.
 * Returns true when 3+ standalone "$" items cluster around a common x position.
 */
function isColumnFormat(items: PdfItem[]): boolean {
  const dollarItems = items.filter((i) => i.str === "$");
  if (dollarItems.length < 3) return false;
  // Bucket by 20px and find the largest cluster
  const xBuckets = new Map<number, number>();
  for (const item of dollarItems) {
    const bucket = Math.round(item.x / 20) * 20;
    xBuckets.set(bucket, (xBuckets.get(bucket) ?? 0) + 1);
  }
  return Math.max(...xBuckets.values()) >= 3;
}

/**
 * Find the dominant x position of standalone "$" items in a column-format PDF.
 * Uses 20px bucketing then returns the exact median x within that bucket.
 */
function detectDollarColumnX(items: PdfItem[]): number {
  const dollarItems = items.filter((i) => i.str === "$");
  const xBuckets = new Map<number, number[]>();
  for (const item of dollarItems) {
    const bucket = Math.round(item.x / 20) * 20;
    if (!xBuckets.has(bucket)) xBuckets.set(bucket, []);
    xBuckets.get(bucket)!.push(item.x);
  }
  let bestBucket = 0;
  let bestCount = 0;
  for (const [bucket, xs] of xBuckets) {
    if (xs.length > bestCount) {
      bestCount = xs.length;
      bestBucket = bucket;
    }
  }
  const xs = xBuckets.get(bestBucket) ?? [];
  return xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : bestBucket;
}

/**
 * Parse a column-format price PDF using x/y position grouping.
 * Works for any vendor that renders the $ sign as a standalone text item
 * separate from the numeric price (Northland Floral, Carter Road Tropical, etc.).
 *
 * Column positions are derived automatically from the dominant $ column:
 *   left margin (x < ~90)     : pot size (e.g. "8"", "10"") — prepended to product name
 *   name column (x ≥ ~90)     : product name + form type (e.g. "Ficus BENJAMINA BRAID")
 *   $ column   (auto-detected): price currency indicator
 *   price column ($ + 15–50px): numeric price value
 *
 * Items in the "spec" column between name and $ (pack quantities, form codes) are
 * included in the name when they fall within nameMaxX, helping distinguish variants
 * like "Ficus BENJAMINA BRAID" from "Ficus BENJAMINA STANDARD".
 */
function parseColumnPdf(items: PdfItem[]): ParsedItem[] {
  const dollarX = detectDollarColumnX(items);

  // Derive column boundaries relative to the $ position
  const nameMinX = 90; // pot sizes are left of this; item codes too (but filtered separately)
  const nameMaxX = dollarX - 40; // includes form type (HB, BRAID, 3PPP) but not pack qty column
  const priceMinX = dollarX + 15;
  const priceMaxX = dollarX + 55;

  // Group items by (page, rounded_y). Rows are typically 11–12px apart;
  // rounding to 4px gives ±2px tolerance handling the ±1px jitter between columns.
  const rowMap = new Map<string, PdfItem[]>();
  for (const item of items) {
    const yKey = Math.round(item.y / 4) * 4;
    const key = `${item.page}:${yKey}`;
    if (!rowMap.has(key)) rowMap.set(key, []);
    rowMap.get(key)!.push(item);
  }

  const result: ParsedItem[] = [];
  const seen = new Set<string>();

  for (const [, rowItems] of rowMap) {
    rowItems.sort((a, b) => a.x - b.x);

    // Every product row has a standalone $ near the detected column
    if (!rowItems.some((i) => i.str === "$" && Math.abs(i.x - dollarX) <= 15)) continue;

    // And a decimal/integer price to the right of the $ column
    const priceItem = rowItems.find(
      (i) => /^\d{1,4}(?:\.\d{1,2})?$/.test(i.str) && i.x >= priceMinX && i.x <= priceMaxX,
    );
    if (!priceItem) continue;

    const price = parseFloat(priceItem.str);
    if (isNaN(price) || price < 0.5 || price > 1500) continue;

    // Pot size: items in the left margin matching "8"", "10"", "4.5"", etc.
    const potItems = rowItems.filter(
      (i) => i.x < nameMinX && /^\d+(?:\.\d+)?"$/.test(i.str),
    );

    // Product name + form: items in the name column (between left margin and $ column)
    const nameItems = rowItems.filter((i) => i.x >= nameMinX && i.x <= nameMaxX);
    if (!nameItems.length) continue;

    const potPart = potItems.map((i) => i.str).join(" ").trim();
    const namePart = nameItems
      .map((i) => i.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    const rawName = potPart ? `${potPart} ${namePart}` : namePart;

    // Remove duplicate tokens (spec column sometimes repeats a word already in the plant name)
    const tokens = rawName.split(/\s+/);
    const seenTokens = new Set<string>();
    const name = tokens
      .filter((t) => {
        const k = t.toLowerCase();
        if (seenTokens.has(k)) return false;
        seenTokens.add(k);
        return true;
      })
      .join(" ");

    if (!name || !isValidPlantName(name)) continue;

    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ name, cost: price, rawLine: `${name} $${price.toFixed(2)}` });
    }
  }

  return result;
}

/**
 * Detect Capri Farms PDF format.
 * Each product row has a pot-size token at x ≈ 175–200 (e.g. "6\"", "10\"") and a combined
 * "$N.NN" price token at x ≈ 210–245.  Names appear at x < 170 (sometimes duplicated as
 * visual-layer fragments at x ≈ 26+).
 */
function isCapriFormat(items: PdfItem[]): boolean {
  const potItems = items.filter(
    (i) => /^\d+(?:\.\d+)?"$/.test(i.str) && i.x >= 175 && i.x <= 200,
  );
  const priceItems = items.filter(
    (i) => /^\$\d{1,4}(?:\.\d{1,2})?$/.test(i.str) && i.x >= 210 && i.x <= 245,
  );
  return potItems.length >= 5 && priceItems.length >= 5;
}

/**
 * Parse a Capri Farms PDF price list.
 *
 * Column layout:
 *   x <  170  Plant name  — complete name at x ≈ 20–21; visual fragments repeat at x ≈ 26+
 *   x ≈ 175–200  Pot size   — e.g. "6\"", "10\"", "4\""
 *   x ≈ 210–245  Price      — combined "$N.NN" token
 *   x ≈ 292+     Notes/description (ignored)
 *
 * Name de-duplication: PDF renders the full name at x ≈ 20 AND fragment pieces at x ≈ 26+.
 * Strategy: start with the leftmost name item; append additional items only when their text
 * is not already contained in the accumulated name (fragment detection).
 *
 * Floating-label fix: when the assembled name is a single short word and the row immediately
 * above (≤ 16 px) has name-zone items but no price/pot, those items are the variety label
 * (e.g. "Cleopatra" printed on its own line above the price row).
 *
 * Product name: "{potSize} {assembledName}"  e.g. "6\" Aglaonema Cleopatra"
 */
function parseCapriPdf(items: PdfItem[]): ParsedItem[] {
  // Group by (page, rounded_y) with 4 px tolerance
  const rowMap = new Map<string, PdfItem[]>();
  for (const item of items) {
    const yKey = Math.round(item.y / 4) * 4;
    const key = `${item.page}:${yKey}`;
    if (!rowMap.has(key)) rowMap.set(key, []);
    rowMap.get(key)!.push(item);
  }

  // Sort: page asc, y desc (higher y = higher on page in PDF coords)
  const sortedRows = [...rowMap.values()].sort((a, b) => {
    const pa = a[0].page, pb = b[0].page;
    if (pa !== pb) return pa - pb;
    return b[0].y - a[0].y;
  });

  // Build a quick y-keyed lookup for floating-label look-ahead
  const rowByKey = new Map<string, PdfItem[]>();
  for (const row of sortedRows) {
    const key = `${row[0].page}:${Math.round(row[0].y / 4) * 4}`;
    rowByKey.set(key, row);
  }

  // First pass: collect the primary name texts that appear on price rows (x ≈ 20–22).
  // These are genus/section names; we must not use them as floating variety labels.
  const priceRowPrimaryNames = new Set<string>();
  for (const row of sortedRows) {
    const hasPot = row.some((i) => /^\d+(?:\.\d+)?"$/.test(i.str) && i.x >= 175 && i.x <= 200);
    const hasPrice = row.some((i) => /^\$\d/.test(i.str) && i.x >= 210 && i.x <= 245);
    if (hasPot && hasPrice) {
      for (const ni of row.filter((i) => i.x <= 22)) {
        const t = ni.str.trim();
        if (t) priceRowPrimaryNames.add(t.toLowerCase());
      }
    }
  }

  const result: ParsedItem[] = [];
  const seen = new Set<string>();

  for (const row of sortedRows) {
    row.sort((a, b) => a.x - b.x);

    const potItem = row.find((i) => /^\d+(?:\.\d+)?"$/.test(i.str) && i.x >= 175 && i.x <= 200);
    const priceItem = row.find(
      (i) => /^\$\d{1,4}(?:\.\d{1,2})?$/.test(i.str) && i.x >= 210 && i.x <= 245,
    );

    if (!potItem || !priceItem) continue;

    const price = parseFloat(priceItem.str.replace("$", ""));
    if (isNaN(price) || price < 1.0 || price > 1000) continue;

    // Collect name-zone items (x < 170) and deduplicate visual fragments
    const nameItems = row.filter((i) => i.x < 170).sort((a, b) => a.x - b.x);
    let assembledName = "";
    for (const ni of nameItems) {
      const t = ni.str.trim();
      if (!t) continue;
      if (!assembledName) {
        assembledName = t;
      } else {
        // Skip if the text (case-insensitive) is already in the accumulated name
        if (assembledName.toLowerCase().includes(t.toLowerCase())) continue;
        // Skip if every word in t already appears in the name (fragment check)
        const words = t.split(/\s+/).filter(Boolean);
        if (words.length > 0 && words.every((w) => assembledName.toLowerCase().includes(w.toLowerCase()))) continue;
        assembledName = `${assembledName} ${t}`;
      }
    }

    // Floating-label fix: when the assembled name is short (≤ 2 words, no parens), look at
    // the row immediately above for a variety label printed on its own line.
    // Guard: skip labels that are section/genus names (already appear as primary price-row
    // names) or that look like notes (> 3 words).
    if (assembledName && assembledName.split(/\s+/).length <= 2 && !assembledName.includes("(")) {
      const rowY = Math.round(row[0].y / 4) * 4;
      for (let delta = 4; delta <= 16; delta += 4) {
        const aboveKey = `${row[0].page}:${rowY + delta}`;
        const aboveRow = rowByKey.get(aboveKey);
        if (!aboveRow) continue;
        const hasPrice = aboveRow.some((i) => /^\$\d/.test(i.str) && i.x >= 210 && i.x <= 245);
        const hasPot = aboveRow.some((i) => /^\d+(?:\.\d+)?"$/.test(i.str) && i.x >= 175 && i.x <= 200);
        if (hasPrice || hasPot) break; // another price row above — stop
        const labelItems = aboveRow.filter((i) => i.x >= 20 && i.x <= 80);
        if (labelItems.length > 0) {
          const label = labelItems
            .map((i) => i.str.trim())
            .filter(Boolean)
            .join(" ");
          // Skip if it's a section/genus name that already has its own price rows
          if (priceRowPrimaryNames.has(label.toLowerCase())) break;
          // Skip if the label is too long to be a variety name (it's a note)
          if (label.split(/\s+/).length > 3) break;
          if (label && !assembledName.toLowerCase().includes(label.toLowerCase())) {
            assembledName = `${assembledName} ${label}`;
          }
          break;
        }
      }
    }

    if (!assembledName || assembledName.length < 3) continue;

    // Skip obvious header / meta rows
    if (/^(Plant|Pot|Price|Description|Customer|Notes|Green|Bold|Yellow|\$50)/i.test(assembledName))
      continue;

    const name = `${potItem.str} ${assembledName}`.replace(/\s+/g, " ").trim();

    if (!name || name.length < 3) continue;

    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ name, cost: price, rawLine: `${name} ${priceItem.str}` });
    }
  }

  return result;
}

/**
 * Detect Sturon Nursery PDF format.
 * Sturon renders prices as combined "$N.NN" tokens (not split "$ " + "N.NN" like Northland).
 * We confirm by counting combined-price tokens clustered at x ≈ 390–430.
 */
function isSturonFormat(items: PdfItem[]): boolean {
  const priceItems = items.filter(
    (i) => /^\$\d{1,4}(?:\.\d{1,2})?$/.test(i.str) && i.x >= 390 && i.x <= 430,
  );
  return priceItems.length >= 5;
}

/**
 * Parse a Sturon Nursery PDF price list.
 *
 * Column layout:
 *   x ≈ 10–90   DESCRIPTION — genus/family (sticky, carries forward when absent on a row)
 *   x ≈ 100–280 VARIETY     — specific variety name
 *   x ≈ 290–390 SPECS       — size/availability (ignored)
 *   x ≈ 390–430 PRICE       — combined "$N.NN" token
 *   x ≈ 440+    COMMENTS    — ignored
 *
 * Pot-size section headers set a prefix applied to every product name:
 *   "4.5 INCH" → "4.5\""    "6 INCH" → "6\""    "HANGING BASKET(S)" → "HB"
 *
 * Final product name: "{potSize} {genus} {variety}"  e.g. "6\" DRACAENA JANET CRAIG COMPACTA"
 */
function parseSturonPdf(items: PdfItem[]): ParsedItem[] {
  // Group items by (page, rounded_y) with ±2px tolerance
  const rowMap = new Map<string, PdfItem[]>();
  for (const item of items) {
    const yKey = Math.round(item.y / 4) * 4;
    const key = `${item.page}:${yKey}`;
    if (!rowMap.has(key)) rowMap.set(key, []);
    rowMap.get(key)!.push(item);
  }

  // Sort: page ascending, then y descending (PDF y=0 is bottom; higher y = higher on page)
  const sortedRows = [...rowMap.values()].sort((a, b) => {
    const pa = a[0].page, pb = b[0].page;
    if (pa !== pb) return pa - pb;
    return b[0].y - a[0].y;
  });

  const result: ParsedItem[] = [];
  const seen = new Set<string>();
  let currentGenus = "";
  let currentPotSize = "";

  for (const row of sortedRows) {
    row.sort((a, b) => a.x - b.x);

    const descItem = row.find((i) => i.x >= 10 && i.x <= 90);
    const varItem = row.find((i) => i.x >= 100 && i.x <= 280);
    const priceItem = row.find(
      (i) => /^\$\d{1,4}(?:\.\d{1,2})?$/.test(i.str) && i.x >= 390 && i.x <= 430,
    );

    // Process section header in the description column
    if (descItem) {
      const ds = descItem.str;

      // Pot size: "4.5 INCH", "6 INCH", "8 INCH (CONT.)", etc.
      const potMatch = ds.match(/^(\d+(?:\.\d+)?)\s+INCH/i);
      if (potMatch) {
        currentPotSize = `${potMatch[1]}"`;
        currentGenus = "";
        if (!priceItem) continue;
      }

      // Hanging basket section header
      if (/^HANGING\s+BASKETS?/i.test(ds)) {
        currentPotSize = "HB";
        currentGenus = "";
        if (!priceItem) continue;
      }

      // Column header row
      if (/^DESCRIPTION$/i.test(ds)) continue;
    }

    if (!priceItem) continue;

    const price = parseFloat(priceItem.str.replace("$", ""));
    if (isNaN(price) || price < 1.0 || price > 500) continue;

    // Update sticky genus from description column
    if (descItem) {
      const ds = descItem.str;
      if (
        !/^(\d+(?:\.\d+)?)\s+INCH/i.test(ds) &&
        !/^HANGING\s+BASKETS?/i.test(ds) &&
        !/^(DESCRIPTION|SPECS|PRICE|COMMENTS)$/i.test(ds) &&
        /^[A-Z]/.test(ds) &&
        ds.length >= 3
      ) {
        currentGenus = ds;
      }
    }

    if (!varItem) continue;
    const variety = varItem.str.trim();
    if (!variety || variety.length < 3) continue;
    if (/^(SPECS|PRICE|COMMENTS)$/i.test(variety)) continue;

    // Build name: potSize + genus + variety
    const parts: string[] = [];
    if (currentPotSize) parts.push(currentPotSize);
    if (currentGenus) parts.push(currentGenus);
    parts.push(variety);
    const name = parts
      .join(" ")
      .replace(/\*+/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!name || name.length < 3) continue;

    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ name, cost: price, rawLine: `${name} ${priceItem.str}` });
    }
  }

  return result;
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
    fullText += pageText + "  \n";
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
  // Allow pot-size-prefixed names like "8" Cactus - RIC RAC" or "2.5" Kalanchoe..."
  // but reject bare digit strings (size specs, quantities, pack counts)
  if (/^\d/.test(name) && !/^\d+(?:\.\d+)?"/.test(name)) return false;
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

/**
 * Parses the "Plants in Design" availability-list format:
 *   Name | Stage (LTD/MED-GOOD/SOLD OUT/…) | Pack qty | Notes
 * There are no dollar prices — this builds a product catalog only.
 */
function parseAvailabilityText(text: string): CatalogItem[] {
  // Split on 2+ spaces + availability stage + 2+ spaces + number
  // Also split on "   -   " (discontinued entries like "Aglaonema Etta Rose   -")
  const STAGE_SPLIT_RE =
    /\s{2,}(?:LTD|MEDIUM|MED-GOOD|SOLD\s+OUT|GOOD|LOW\s*\/\s*MED)\s{2,}\d+|\s{2,}-\s+/g;

  // Chunks that are NOT part of a product name
  const COLOR_LABEL_RE =
    /^(?:WHITE|YELLOW(?:\s+ORANGE|\s+RED\s+CONE)?|RED(?:\/WHITE|\s+ORANGE)?|ORANGE|GREEN|PURPLE|BURGUNDY|PINK|Blue|Purple|Pink|Red|Green)\s*$/i;
  const POT_SIZE_HEADER_RE = /^\d+(?:\.\d+)?"\s+POT\s+SIZE/i;
  const META_RE =
    /^(?:NEW\s+ITEM|Email|Sales@|Updated|COLOR(?!\w)|Plant\s+Name|STAGE(?!\w)|PK(?!\w)|BOXES|PACKAGING|\d{5,}|20\d{2}|Office:|Fax:)/i;

  const parts = text.split(STAGE_SPLIT_RE);
  const seen = new Set<string>();
  const items: CatalogItem[] = [];

  for (let i = 0; i < parts.length - 1; i++) {
    const segment = parts[i];
    const chunks = segment
      .split(/\s{2,}/)
      .map((c) => c.trim())
      .filter(Boolean);

    // Filter meta/header/color chunks — these are never part of a product name
    const nameChunks = chunks.filter(
      (c) =>
        !COLOR_LABEL_RE.test(c) &&
        !POT_SIZE_HEADER_RE.test(c) &&
        !META_RE.test(c) &&
        c !== "-",
    );

    if (nameChunks.length === 0) continue;

    // Find the last chunk that begins with a pot-size indicator (e.g. "6"" or "10"")
    // That chunk is the start of the product name; join it with all subsequent chunks.
    let sizeIdx = -1;
    for (let j = nameChunks.length - 1; j >= 0; j--) {
      if (/^\d+(?:\.\d+)?"/.test(nameChunks[j])) {
        sizeIdx = j;
        break;
      }
    }

    let name: string;
    if (sizeIdx >= 0) {
      // Join from the size-prefix chunk to end, collapse internal whitespace
      name = nameChunks
        .slice(sizeIdx)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    } else {
      // No pot-size prefix (e.g. "Aglaonema Etta Rose") — take the last chunk
      const last = nameChunks[nameChunks.length - 1];
      if (!last || last.length < 3 || /^[a-z]/.test(last) || /https?:|@/.test(last)) continue;
      name = last.trim();
    }

    // Final sanity checks
    if (!name || name.length < 3 || name.length > 120) continue;
    if (/https?:|@|\*{2,}/.test(name)) continue;

    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      items.push({ name });
    }
  }

  return items;
}

async function upsertProductPrices(
  vendorId: number,
  items: ParsedItem[],
  addNew: boolean,
): Promise<{ updated: number; added: number; unmatched: ParsedItem[]; priceChanges: PriceChange[] }> {
  const existing = await db
    .select({ id: productsTable.id, name: productsTable.name, cost: productsTable.cost })
    .from(productsTable)
    .where(eq(productsTable.vendorId, vendorId));

  let updated = 0;
  let added = 0;
  const unmatched: ParsedItem[] = [];
  const priceChanges: PriceChange[] = [];

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
      const oldCost = match.cost != null ? parseFloat(match.cost) : null;
      const newCost = item.cost;
      // Only write and count as updated if the price actually changed
      if (oldCost == null || Math.abs(oldCost - newCost) >= 0.005) {
        await db.update(productsTable).set({ cost: String(newCost) }).where(eq(productsTable.id, match.id));
        updated++;
        if (oldCost != null) {
          priceChanges.push({ name: match.name, oldCost, newCost });
        }
      }
    } else if (addNew) {
      const [inserted] = await db
        .insert(productsTable)
        .values({ vendorId, name: item.name, cost: String(item.cost) })
        .returning({ id: productsTable.id, name: productsTable.name, cost: productsTable.cost });
      existing.push(inserted);
      added++;
    } else {
      unmatched.push(item);
    }
  }

  return { updated, added, unmatched, priceChanges };
}

/**
 * Upsert products from a no-price catalog import.
 * Existing products are left untouched (costs preserved).
 * New products are inserted with cost = NULL.
 */
async function upsertProductCatalog(
  vendorId: number,
  items: CatalogItem[],
  addNew: boolean,
): Promise<{ added: number; existing: number }> {
  const existing = await db
    .select({ id: productsTable.id, name: productsTable.name })
    .from(productsTable)
    .where(eq(productsTable.vendorId, vendorId));

  let added = 0;
  let existingCount = 0;

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
      existingCount++;
    } else if (addNew) {
      const [inserted] = await db
        .insert(productsTable)
        .values({ vendorId, name: item.name })
        .returning({ id: productsTable.id, name: productsTable.name });
      existing.push(inserted);
      added++;
    }
  }

  return { added, existing: existingCount };
}
