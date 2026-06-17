import { Router } from "express";
import { db } from "@workspace/db";
import { shopListingsTable } from "@workspace/db";

const router = Router();

function sheetsUrlToCsvUrl(url: string): string {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) throw new Error("Invalid Google Sheets URL");
  const id = match[1];
  const gidMatch = url.match(/[?&#]gid=(\d+)/);
  const gid = gidMatch ? gidMatch[1] : "0";
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
}

function parseAvailability(val: string): "available" | "limited" | "out_of_stock" {
  const v = val.trim();
  if (v === "*") return "limited";
  if (
    v === "✓" ||
    v === "✔" ||
    v === "TRUE" ||
    v.toLowerCase() === "true" ||
    v.toLowerCase() === "yes" ||
    v === "1" ||
    v === "v" ||
    v === "x" ||
    v === "X"
  )
    return "available";
  if (v.length > 0 && v !== "FALSE" && v.toLowerCase() !== "false" && v !== "0")
    return "available";
  return "out_of_stock";
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let inQuote = false;
  let field = "";
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuote) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuote = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuote = true;
      } else if (ch === ",") {
        row.push(field);
        field = "";
      } else if (ch === "\n" || (ch === "\r" && next === "\n")) {
        if (ch === "\r") i++;
        row.push(field);
        field = "";
        rows.push(row);
        row = [];
      } else if (ch === "\r") {
        row.push(field);
        field = "";
        rows.push(row);
        row = [];
      } else {
        field += ch;
      }
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// POST /shop-availability/import
router.post("/shop-availability/import", async (req, res) => {
  const { url } = req.body as { url?: string };
  if (!url?.trim()) {
    return res.status(400).json({ error: "url is required" });
  }

  let csvUrl: string;
  try {
    csvUrl = sheetsUrlToCsvUrl(url.trim());
  } catch {
    return res.status(400).json({ error: "Invalid Google Sheets URL. Make sure to copy the full URL from your browser." });
  }

  let csvText: string;
  try {
    const resp = await fetch(csvUrl, { redirect: "follow" });
    if (!resp.ok) {
      return res.status(400).json({
        error: `Could not fetch the sheet (HTTP ${resp.status}). Make sure the sheet is set to "Anyone with the link can view".`,
      });
    }
    csvText = await resp.text();
    if (csvText.includes("<!DOCTYPE html") || csvText.includes("<html")) {
      return res.status(400).json({
        error: `Google returned a sign-in page instead of CSV data. Make sure the sheet is set to "Anyone with the link can view".`,
      });
    }
  } catch (err) {
    req.log.error({ err }, "Failed to fetch Google Sheet");
    return res.status(500).json({ error: "Failed to fetch the sheet. Check the URL and try again." });
  }

  const rows = parseCsv(csvText);

  const listings: { productName: string; status: "available" | "limited" | "out_of_stock" }[] = [];

  for (const row of rows) {
    const name = (row[0] ?? "").trim();
    if (!name || name.toLowerCase() === "name" || name.toLowerCase() === "product") continue;

    const colC = row[2] ?? "";
    const colG = row[6] ?? "";

    let status: "available" | "limited" | "out_of_stock" = "out_of_stock";
    if (colC.trim() === "*" || colG.trim() === "*") {
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
    return res.status(400).json({ error: "No product rows found in the sheet. Check that column A has product names." });
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
