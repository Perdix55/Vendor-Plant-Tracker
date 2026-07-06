import { Router } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";

const router = Router();

const SETTING_KEYS = ["fromEmail", "smtpHost", "smtpPort", "smtpUser", "smtpPass", "smtpSecure", "smtpFromName"] as const;

function emptySettings(): Record<string, string | null> {
  return Object.fromEntries(SETTING_KEYS.map((k) => [k, null]));
}

// GET /settings
router.get("/settings", async (req, res) => {
  try {
    const rows = await db.select().from(settingsTable);
    const result = emptySettings();
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
    const body = req.body as Partial<Record<typeof SETTING_KEYS[number], string | null>>;

    for (const key of SETTING_KEYS) {
      if (key in body) {
        const value = body[key] ?? null;
        await db
          .insert(settingsTable)
          .values({ key, value })
          .onConflictDoUpdate({ target: settingsTable.key, set: { value, updatedAt: new Date() } });
      }
    }

    const rows = await db.select().from(settingsTable);
    const result = emptySettings();
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
