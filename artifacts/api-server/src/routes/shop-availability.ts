import { Router } from "express";
import multer from "multer";
import * as XLSX from "xlsx";
import { db } from "@workspace/db";
import { shopListingsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

type Availability = "available" | "limited" | "out_of_stock";

type Listing = { productName: string; status: Availability; price: string | null };

function resolveStatus(val: string): Availability {
  const v = val.trim();
  if (v === "*") return "limited";
  const vl = v.toLowerCase();
  if (v === "✓" || v === "✔" || vl === "true" || vl === "yes" || v === "1") return "available";
  if (v === "" || vl === "false" || vl === "no" || v === "0") return "out_of_stock";
  // Non-standard string (e.g. "can", "gallon") means it's listed → available
  return "available";
}

const LEGEND_KEYWORDS = ["legend", "availability legend", "key:", "key :", "✓ =", "✔ =", "* =", "checkmark", "= available", "= limited"];
const SKIP_PATTERNS = [/@/, /^[\d\s\-().\/]{7,}$/, /^www\./i, /^http/i, /^fax/i, /^phone/i, /^tel/i, /^email/i, /^address/i];
const LABEL_SKIP = new Set(["name", "product", "item", "description", "size", "weekly availability"]);

function shouldSkipName(n: string): boolean {
  if (!n) return true;
  const nl = n.toLowerCase().trim();
  if (LEGEND_KEYWORDS.some((kw) => nl.includes(kw))) return true;
  if (LABEL_SKIP.has(nl)) return true;
  if (SKIP_PATTERNS.some((re) => re.test(n))) return true;
  return false;
}

function parseSheet(rows: unknown[][]): Listing[] {
  const listings: Listing[] = [];
  let hitLegend = false;

  for (const row of rows) {
    if (hitLegend) break;

    // Left section: A (0), B (1), C (2)
    const nameA = String(row[0] ?? "").trim();
    if (nameA) {
      const nl = nameA.toLowerCase();
      if (LEGEND_KEYWORDS.some((kw) => nl.includes(kw))) { hitLegend = true; break; }
      const colB = String(row[1] ?? "").trim();
      const colC = String(row[2] ?? "").trim();
      // Skip all-caps category headers (no price AND no status)
      const isHeader = nameA === nameA.toUpperCase() && nameA !== nameA.toLowerCase() && !colC && !colB;
      if (!shouldSkipName(nameA) && !isHeader) {
        listings.push({ productName: nameA, status: resolveStatus(colC), price: colB || null });
      }
    }

    // Right section: E (4), F (5), G (6)
    const nameE = String(row[4] ?? "").trim();
    if (nameE) {
      const nl = nameE.toLowerCase();
      if (LEGEND_KEYWORDS.some((kw) => nl.includes(kw))) { hitLegend = true; break; }
      const colF = String(row[5] ?? "").trim();
      const colG = String(row[6] ?? "").trim();
      const isHeader = nameE === nameE.toUpperCase() && nameE !== nameE.toLowerCase() && !colG && !colF;
      if (!shouldSkipName(nameE) && !isHeader) {
        listings.push({ productName: nameE, status: resolveStatus(colG), price: colF || null });
      }
    }
  }
  return listings;
}

function parseWorkbook(wb: XLSX.WorkBook): Listing[] {
  const listings: Listing[] = [];
  for (const name of wb.SheetNames) {
    if (name.toLowerCase().includes("master")) continue;
    const ws = wb.Sheets[name];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }) as unknown[][];
    listings.push(...parseSheet(rows));
  }
  return listings;
}

function extractSheetId(url: string): string | null {
  const m = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  return m?.[1] ?? null;
}

// POST /shop-availability/import  (multipart: field "file")
router.post("/shop-availability/import", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded. Please select a CSV or Excel file." });
  }

  let listings: Listing[];
  try {
    const wb = XLSX.read(req.file.buffer, { type: "buffer" });
    listings = parseWorkbook(wb);
  } catch (err) {
    req.log.error({ err }, "Failed to parse uploaded file");
    return res.status(400).json({ error: "Could not read the file. Make sure it is a valid CSV or Excel file." });
  }

  if (listings.length === 0) {
    return res.status(400).json({ error: "No product rows found. Make sure column A has product names." });
  }

  await db.delete(shopListingsTable);
  await db.insert(shopListingsTable).values(listings);

  const available = listings.filter((l) => l.status === "available").length;
  const limited = listings.filter((l) => l.status === "limited").length;
  const outOfStock = listings.filter((l) => l.status === "out_of_stock").length;

  req.log.info({ total: listings.length, available, limited, outOfStock }, "Shop availability imported from file");
  res.json({ imported: listings.length, available, limited, outOfStock, listings });
});

// POST /shop-availability/import-from-sheets  (JSON: { url: string })
router.post("/shop-availability/import-from-sheets", async (req, res) => {
  const { url } = req.body as { url?: string };
  if (!url?.trim()) {
    return res.status(400).json({ error: "Please provide a Google Sheets URL." });
  }

  const sheetId = extractSheetId(url);
  if (!sheetId) {
    return res.status(400).json({ error: "Could not find a spreadsheet ID in that URL. Make sure it's a Google Sheets link." });
  }

  const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
  let buffer: Buffer;
  try {
    const resp = await fetch(exportUrl);
    if (!resp.ok) {
      return res.status(400).json({ error: `Could not download the spreadsheet (HTTP ${resp.status}). Make sure the sheet is shared publicly ("Anyone with the link can view").` });
    }
    buffer = Buffer.from(await resp.arrayBuffer());
  } catch (err) {
    req.log.error({ err }, "Failed to fetch Google Sheet");
    return res.status(502).json({ error: "Network error while fetching the spreadsheet. Check the URL and try again." });
  }

  let listings: Listing[];
  try {
    const wb = XLSX.read(buffer, { type: "buffer" });
    listings = parseWorkbook(wb);
  } catch (err) {
    req.log.error({ err }, "Failed to parse Google Sheet XLSX");
    return res.status(400).json({ error: "Could not parse the downloaded spreadsheet." });
  }

  if (listings.length === 0) {
    return res.status(400).json({ error: "No product rows found in the spreadsheet." });
  }

  await db.delete(shopListingsTable);
  await db.insert(shopListingsTable).values(listings);

  const available = listings.filter((l) => l.status === "available").length;
  const limited = listings.filter((l) => l.status === "limited").length;
  const outOfStock = listings.filter((l) => l.status === "out_of_stock").length;

  req.log.info({ sheetId, total: listings.length, available, limited, outOfStock }, "Shop availability imported from Google Sheets");
  res.json({ imported: listings.length, available, limited, outOfStock, listings });
});

// GET /shop-availability
router.get("/shop-availability", async (req, res) => {
  try {
    const rows = await db.select().from(shopListingsTable).orderBy(shopListingsTable.productName);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch shop availability");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /shop-availability/catalog
router.get("/shop-availability/catalog", async (req, res) => {
  try {
    const rows = await db.execute(sql`
      SELECT DISTINCT ON (sl.id)
        sl.id            AS "shopListingId",
        sl.product_name  AS "productName",
        sl.price         AS "price",
        sl.status        AS "status",
        ii.id            AS "inventoryItemId",
        v.name           AS "vendorName",
        p.pack_size      AS "packSize",
        ii.quantity_on_hand AS "quantityOnHand"
      FROM shop_listings sl
      LEFT JOIN products p  ON LOWER(p.name) = LOWER(sl.product_name)
      LEFT JOIN inventory_items ii ON ii.product_id = p.id
      LEFT JOIN vendors v   ON v.id = ii.vendor_id
      WHERE sl.status != 'out_of_stock'
      ORDER BY sl.id, ii.quantity_on_hand DESC NULLS LAST
    `);
    res.json(rows.rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch shop catalog");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
