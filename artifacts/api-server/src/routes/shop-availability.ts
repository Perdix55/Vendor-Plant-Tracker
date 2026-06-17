import { Router } from "express";
import multer from "multer";
import * as XLSX from "xlsx";
import { db } from "@workspace/db";
import { shopListingsTable } from "@workspace/db";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

function parseAvailability(val: string): "available" | "limited" | "out_of_stock" {
  const v = val.trim();
  if (v === "*") return "limited";
  if (
    v === "✓" ||
    v === "✔" ||
    v === "TRUE" ||
    v.toLowerCase() === "true" ||
    v.toLowerCase() === "yes" ||
    v === "1"
  )
    return "available";
  return "out_of_stock";
}

// POST /shop-availability/import  (multipart: field "file")
router.post("/shop-availability/import", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded. Please select a CSV or Excel file." });
  }

  let rows: unknown[][];
  try {
    const wb = XLSX.read(req.file.buffer, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }) as unknown[][];
  } catch (err) {
    req.log.error({ err }, "Failed to parse uploaded file");
    return res.status(400).json({ error: "Could not read the file. Make sure it is a valid CSV or Excel file." });
  }

  const listings: { productName: string; status: "available" | "limited" | "out_of_stock"; price: string | null }[] = [];

  const LEGEND_KEYWORDS = ["legend", "availability legend", "key:", "key :", "✓ =", "✔ =", "* =", "checkmark", "= available", "= limited"];
  // Matches phone numbers including slash-separated numbers like 214-824-4440/800-408-0323
  const SKIP_PATTERNS = [/@/, /^[\d\s\-().\/]{7,}$/, /^www\./i, /^http/i, /^fax/i, /^phone/i, /^tel/i, /^email/i, /^address/i];
  const LABEL_SKIP = new Set(["name", "product", "item"]);

  function shouldSkipName(n: string): boolean {
    if (!n) return true;
    const nl = n.toLowerCase();
    if (LEGEND_KEYWORDS.some((kw) => nl.includes(kw))) return true;
    if (LABEL_SKIP.has(nl)) return true;
    if (SKIP_PATTERNS.some((re) => re.test(n))) return true;
    return false;
  }

  function resolveStatus(avail: string): "available" | "limited" | "out_of_stock" {
    if (avail === "*") return "limited";
    return parseAvailability(avail);
  }

  let hitLegend = false;

  for (const row of rows) {
    if (hitLegend) break;

    // --- Left section: columns A (0), B (1), C (2) ---
    const nameA = String(row[0] ?? "").trim();
    if (nameA) {
      const nl = nameA.toLowerCase();
      if (LEGEND_KEYWORDS.some((kw) => nl.includes(kw))) { hitLegend = true; break; }

      const colB = String(row[1] ?? "").trim();
      const colC = String(row[2] ?? "").trim();

      if (
        !shouldSkipName(nameA) &&
        !(nameA === nameA.toUpperCase() && nameA !== nameA.toLowerCase() && !colC)
      ) {
        listings.push({ productName: nameA, status: resolveStatus(colC), price: colB || null });
      }
    }

    // --- Right section: columns E (4), F (5), G (6) ---
    const nameE = String(row[4] ?? "").trim();
    if (nameE) {
      const nl = nameE.toLowerCase();
      if (LEGEND_KEYWORDS.some((kw) => nl.includes(kw))) { hitLegend = true; break; }

      const colF = String(row[5] ?? "").trim();
      const colG = String(row[6] ?? "").trim();

      if (
        !shouldSkipName(nameE) &&
        !(nameE === nameE.toUpperCase() && nameE !== nameE.toLowerCase() && !colG)
      ) {
        listings.push({ productName: nameE, status: resolveStatus(colG), price: colF || null });
      }
    }
  }

  if (listings.length === 0) {
    return res.status(400).json({ error: "No product rows found. Make sure column A has product names." });
  }

  await db.delete(shopListingsTable);
  await db.insert(shopListingsTable).values(listings);

  const available = listings.filter((l) => l.status === "available").length;
  const limited = listings.filter((l) => l.status === "limited").length;
  const outOfStock = listings.filter((l) => l.status === "out_of_stock").length;

  req.log.info({ total: listings.length, available, limited, outOfStock }, "Shop availability imported");
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

export default router;
