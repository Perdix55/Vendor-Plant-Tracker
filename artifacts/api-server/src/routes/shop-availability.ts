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

  const listings: { productName: string; status: "available" | "limited" | "out_of_stock" }[] = [];

  for (const row of rows) {
    const name = String(row[0] ?? "").trim();
    if (!name) continue;
    const nameLower = name.toLowerCase();
    if (nameLower === "name" || nameLower === "product" || nameLower === "item") continue;

    const colC = String(row[2] ?? "").trim();
    const colG = String(row[6] ?? "").trim();

    let status: "available" | "limited" | "out_of_stock" = "out_of_stock";
    if (colC === "*" || colG === "*") {
      status = "limited";
    } else {
      const cStatus = parseAvailability(colC);
      const gStatus = parseAvailability(colG);
      if (cStatus === "available" || gStatus === "available") {
        status = "available";
      }
    }

    listings.push({ productName: name, status });
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
