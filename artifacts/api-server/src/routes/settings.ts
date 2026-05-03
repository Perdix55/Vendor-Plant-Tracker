import { Router } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// GET /settings
router.get("/settings", async (req, res) => {
  try {
    const rows = await db.select().from(settingsTable);
    const result: Record<string, string | null> = { fromEmail: null };
    for (const row of rows) {
      result[row.key] = row.value ?? null;
    }
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to get settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /settings
router.put("/settings", async (req, res) => {
  try {
    const { fromEmail } = req.body as { fromEmail?: string | null };

    if (fromEmail !== undefined) {
      await db
        .insert(settingsTable)
        .values({ key: "fromEmail", value: fromEmail ?? null })
        .onConflictDoUpdate({ target: settingsTable.key, set: { value: fromEmail ?? null, updatedAt: new Date() } });
    }

    const rows = await db.select().from(settingsTable);
    const result: Record<string, string | null> = { fromEmail: null };
    for (const row of rows) {
      result[row.key] = row.value ?? null;
    }
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to update settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
