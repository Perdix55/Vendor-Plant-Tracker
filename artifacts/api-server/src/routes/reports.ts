import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { pool } from "@workspace/db";

const router = Router();

const DB_SCHEMA = `
Database schema for Vickery Wholesale Greenhouse purchase order system:

TABLE vendors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  shipping_days TEXT,
  source_location TEXT,
  price_list_email TEXT
)

TABLE products (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER REFERENCES vendors(id),
  name TEXT NOT NULL,
  pack_size TEXT,
  cost NUMERIC,        -- unit cost in dollars
  is_active BOOLEAN,
  is_new BOOLEAN,
  created_at TIMESTAMPTZ
)

TABLE orders (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER REFERENCES vendors(id),
  week_date TEXT,      -- ISO date string for the order week
  ship_date TEXT,      -- planned ship date
  arrive_date TEXT,    -- planned arrival date
  status TEXT,         -- 'draft' | 'sent' | 'confirmed' | 'partial'
  notes TEXT,
  created_at TIMESTAMPTZ
)

TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  quantity_confirmed INTEGER,
  confirmation_status TEXT,  -- 'available' | 'unavailable' | 'partial'
  quantity_received INTEGER,
  notes TEXT
)

TABLE inventory_items (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  vendor_id INTEGER REFERENCES vendors(id),
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ
)

TABLE inventory_transactions (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  vendor_id INTEGER REFERENCES vendors(id),
  order_id INTEGER REFERENCES orders(id),
  quantity INTEGER NOT NULL,
  type TEXT,           -- 'receive' | 'sale' | 'adjustment' | 'write_off'
  notes TEXT,
  created_at TIMESTAMPTZ
)

Useful joins:
- products JOIN vendors ON products.vendor_id = vendors.id
- order_items JOIN orders ON order_items.order_id = orders.id
- order_items JOIN products ON order_items.product_id = products.id
- inventory_items JOIN products ON inventory_items.product_id = products.id
- inventory_items JOIN vendors ON inventory_items.vendor_id = vendors.id
`.trim();

const SYSTEM_PROMPT = `
You are a PostgreSQL expert for a wholesale greenhouse purchase order system.
Given the user's report request, respond ONLY with a valid JSON object (no markdown, no code fences):

{
  "sql": "<a single read-only SELECT query>",
  "title": "<short report title, ≤60 chars>",
  "description": "<one sentence explaining what this report shows>"
}

Rules:
- ONLY SELECT statements. Never use INSERT, UPDATE, DELETE, DROP, CREATE, ALTER, TRUNCATE, or any DDL/DML.
- Use table and column names exactly as defined in the schema (snake_case).
- Use meaningful column aliases with AS for clarity (e.g. vendor_name, total_ordered).
- Limit results to at most 200 rows unless the user explicitly requests more.
- Use COALESCE, NULLIF, and CAST where appropriate to avoid null surprises.
- Prefer JOINs over subqueries where possible.
- For monetary totals, use ROUND(value::numeric, 2).
- For date comparisons, use NOW() and INTERVAL expressions.
- If the request is ambiguous, make a reasonable best-guess query.
`.trim();

router.post("/reports/generate", async (req, res) => {
  const { prompt } = req.body as { prompt?: string };
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "prompt is required" });
  }

  let sql: string;
  let title: string;
  let description: string;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      max_completion_tokens: 2048,
      messages: [
        { role: "system", content: `${SYSTEM_PROMPT}\n\nSchema:\n${DB_SCHEMA}` },
        { role: "user", content: prompt.trim() },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    let parsed: { sql?: string; title?: string; description?: string };
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("AI did not return valid JSON");
      parsed = JSON.parse(match[0]);
    }

    sql = (parsed.sql ?? "").trim();
    title = (parsed.title ?? "Report").trim();
    description = (parsed.description ?? "").trim();
  } catch (err) {
    req.log.error({ err }, "AI SQL generation failed");
    return res.status(500).json({ error: "Failed to generate query from AI. Please try rephrasing your request." });
  }

  if (!sql.toUpperCase().trimStart().startsWith("SELECT")) {
    return res.status(400).json({ error: "AI generated a non-SELECT query. Please rephrase your request." });
  }

  const forbidden = /\b(INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|GRANT|REVOKE|EXEC|EXECUTE|CALL)\b/i;
  if (forbidden.test(sql)) {
    return res.status(400).json({ error: "Query contains forbidden statements." });
  }

  let columns: string[];
  let rows: unknown[][];

  try {
    const result = await pool.query(sql);
    columns = result.fields.map((f) => f.name);
    rows = result.rows.map((row) => columns.map((col) => row[col] ?? null));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    req.log.error({ err, sql }, "Report query execution failed");
    return res.status(422).json({ error: `Query failed: ${message}`, sql });
  }

  res.json({ title, description, sql, columns, rows });
});

export default router;
