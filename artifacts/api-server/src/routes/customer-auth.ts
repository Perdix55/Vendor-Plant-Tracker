import { Router } from "express";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { db, customersTable } from "@workspace/db";
import { settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sendEmail, buildSmtpConfig } from "../lib/email";

const router = Router();

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function safeCustomerColumns() {
  return {
    id: customersTable.id,
    customerNumber: customersTable.customerNumber,
    name: customersTable.name,
    email: customersTable.email,
  };
}

async function sendResetEmail(req: import("express").Request, toEmail: string, customerName: string, token: string) {
  const domain = process.env.REPLIT_DOMAINS?.split(",")[0]?.trim() ?? "localhost:80";
  const protocol = domain.startsWith("localhost") ? "http" : "https";
  const resetUrl = `${protocol}://${domain}/customer-reset/${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Password Reset Requested</h2>
      <p>Hi ${customerName},</p>
      <p>We received a request to reset the password for your Vickery Wholesale Greenhouse account. Click the link below to choose a new password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#16a34a;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
  `;

  const settingsRows = await db.select().from(settingsTable);
  const settingsMap: Record<string, string | null> = {};
  for (const row of settingsRows) settingsMap[row.key] = row.value ?? null;
  const fromAddress = settingsMap.fromEmail?.trim() || "sales@vickerygreenhouse.com";
  const fromName = settingsMap.smtpFromName?.trim() || "Vickery Wholesale Greenhouse";
  const smtp = buildSmtpConfig(settingsMap);

  await sendEmail(
    { to: toEmail, subject: "Reset your Vickery Wholesale Greenhouse password", html, fromAddress, fromName },
    smtp,
    req.log
  );
}

// GET /customer-auth/me
router.get("/customer-auth/me", async (req, res) => {
  if (!req.session?.customerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const rows = await db
    .select(safeCustomerColumns())
    .from(customersTable)
    .where(eq(customersTable.id, req.session.customerId))
    .limit(1);
  if (!rows.length) {
    req.session.destroy(() => {});
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json(rows[0]);
});

// POST /customer-auth/login
router.post("/customer-auth/login", async (req, res) => {
  try {
    const { customerNumber, password } = req.body as { customerNumber?: number; password?: string };
    if (!customerNumber || !password) {
      return res.status(400).json({ error: "customerNumber and password are required" });
    }
    const rows = await db.select().from(customersTable).where(eq(customersTable.customerNumber, customerNumber)).limit(1);
    if (!rows.length) {
      return res.status(401).json({ error: "Invalid customer number or password" });
    }
    const customer = rows[0];
    if (!customer.passwordHash) {
      return res.status(401).json({ error: "No password set yet for this account", needsSetup: true });
    }
    const valid = await bcrypt.compare(password, customer.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid customer number or password" });
    }
    req.session.customerId = customer.id;
    res.json({ id: customer.id, customerNumber: customer.customerNumber, name: customer.name, email: customer.email });
  } catch (err) {
    req.log.error({ err }, "Failed to log in customer");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /customer-auth/set-password
router.post("/customer-auth/set-password", async (req, res) => {
  try {
    const { customerNumber, password, email } = req.body as { customerNumber?: number; password?: string; email?: string | null };
    if (!customerNumber || !password) {
      return res.status(400).json({ error: "customerNumber and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const rows = await db.select().from(customersTable).where(eq(customersTable.customerNumber, customerNumber)).limit(1);
    if (!rows.length) {
      return res.status(404).json({ error: "Customer number not found" });
    }
    const customer = rows[0];
    if (customer.passwordHash) {
      return res.status(400).json({ error: "A password has already been set for this account. Use login or forgot password instead." });
    }
    const finalEmail = customer.email ?? email?.trim();
    if (!finalEmail) {
      return res.status(400).json({ error: "An email address is required to set up your account", needsEmail: true });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [updated] = await db
      .update(customersTable)
      .set({ passwordHash, email: finalEmail })
      .where(eq(customersTable.id, customer.id))
      .returning();
    req.session.customerId = updated.id;
    res.json({ id: updated.id, customerNumber: updated.customerNumber, name: updated.name, email: updated.email });
  } catch (err) {
    req.log.error({ err }, "Failed to set customer password");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /customer-auth/forgot-password
router.post("/customer-auth/forgot-password", async (req, res) => {
  try {
    const { customerNumber, email } = req.body as { customerNumber?: number; email?: string | null };
    if (!customerNumber) {
      return res.status(400).json({ error: "customerNumber is required" });
    }
    const rows = await db.select().from(customersTable).where(eq(customersTable.customerNumber, customerNumber)).limit(1);
    if (!rows.length) {
      return res.status(404).json({ error: "Customer number not found" });
    }
    const customer = rows[0];

    const finalEmail = customer.email ?? email?.trim();
    if (!finalEmail) {
      return res.json({ ok: false, needsEmail: true, message: "We don't have an email on file for this account. Please provide one." });
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await db
      .update(customersTable)
      .set({ resetToken: token, resetTokenExpiresAt: expiresAt, email: finalEmail })
      .where(eq(customersTable.id, customer.id));

    await sendResetEmail(req, finalEmail, customer.name, token);

    res.json({ ok: true, needsEmail: false, message: `Password reset email sent to ${finalEmail}` });
  } catch (err) {
    req.log.error({ err }, "Failed to process forgot password request");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /customer-auth/reset-password
router.post("/customer-auth/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body as { token?: string; password?: string };
    if (!token || !password) {
      return res.status(400).json({ error: "token and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const rows = await db.select().from(customersTable).where(eq(customersTable.resetToken, token)).limit(1);
    if (!rows.length) {
      return res.status(400).json({ error: "Invalid or expired reset link" });
    }
    const customer = rows[0];
    if (!customer.resetTokenExpiresAt || customer.resetTokenExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ error: "This reset link has expired. Please request a new one." });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [updated] = await db
      .update(customersTable)
      .set({ passwordHash, resetToken: null, resetTokenExpiresAt: null })
      .where(eq(customersTable.id, customer.id))
      .returning();
    req.session.customerId = updated.id;
    res.json({ id: updated.id, customerNumber: updated.customerNumber, name: updated.name, email: updated.email });
  } catch (err) {
    req.log.error({ err }, "Failed to reset customer password");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /customer-auth/logout
router.post("/customer-auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

export default router;
