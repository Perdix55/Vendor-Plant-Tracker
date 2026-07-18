import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

const CLEANUP_TOKEN = "amr-dedup-2026";

// POST /cleanup/amr-dedup — one-time, token-protected
router.post("/cleanup/amr-dedup", async (req, res) => {
  const { token } = req.body as { token?: string };
  if (token !== CLEANUP_TOKEN) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const dupes = await db.execute(sql`
      SELECT array_agg(id ORDER BY id DESC) as ids
      FROM ${productsTable}
      WHERE vendor_id = 14
      GROUP BY name, pack_size
      HAVING COUNT(*) > 1
    `);

    const toDelete: number[] = [];
    for (const row of dupes.rows as { ids: number[] }[]) {
      const ids = row.ids;
      toDelete.push(...ids.slice(0, ids.length - 1));
    }

    if (toDelete.length === 0) {
      res.json({ deleted: 0, message: "No duplicates found." });
      return;
    }

    const deleted = await db.execute(sql`
      DELETE FROM ${productsTable}
      WHERE id = ANY(ARRAY[${sql.raw(toDelete.join(","))}]::int[])
      RETURNING id
    `);

    res.json({ deleted: deleted.rows.length, ids: toDelete });
  } catch (err) {
    req.log.error({ err }, "Cleanup failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
