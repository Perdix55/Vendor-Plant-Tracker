import nodemailer from "nodemailer";
import { ReplitConnectors } from "@replit/connectors-sdk";

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  fromAddress: string;
  fromName?: string;
  logoUrl?: string | null;
};

export function wrapEmailHtml(content: string, logoUrl?: string | null): string {
  const logoHtml = logoUrl
    ? `<div style="text-align:right;padding:16px 24px 0;"><img src="${logoUrl}" alt="Logo" style="max-height:60px;max-width:200px;object-fit:contain;" /></div>`
    : "";
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">${logoHtml}<div style="padding:24px;">${content}</div></div>`;
}

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
};

type Logger = {
  error: (obj: Record<string, unknown>, msg: string) => void;
};

export async function sendEmail(
  payload: EmailPayload,
  smtp: SmtpConfig | null,
  log: Logger
): Promise<void> {
  const { to, subject, fromAddress, fromName = "Vickery Wholesale Greenhouse", logoUrl } = payload;
  const html = wrapEmailHtml(payload.html, logoUrl);
  const fromHeader = `${fromName} <${fromAddress}>`;

  if (smtp) {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
    });
    await transporter.sendMail({ from: fromHeader, to, subject, html });
    return;
  }

  const emailB64 = Buffer.from(
    `From: ${fromHeader}\r\n` +
    `To: ${to}\r\n` +
    `Subject: ${subject}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: text/html; charset=UTF-8\r\n` +
    `\r\n` +
    html
  ).toString("base64url");

  const connectors = new ReplitConnectors();
  const response = await connectors.proxy("google-mail", "/gmail/v1/users/me/messages/send", {
    method: "POST",
    body: JSON.stringify({ raw: emailB64 }),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errText = await response.text();
    log.error({ status: response.status, errText }, "Gmail send failed");
    throw new Error("Failed to send email via Gmail");
  }
}

export function buildSmtpConfig(settings: Record<string, string | null>): SmtpConfig | null {
  const host = settings.smtpHost?.trim();
  const user = settings.smtpUser?.trim();
  const pass = settings.smtpPass?.trim();
  if (!host || !user || !pass) return null;
  return {
    host,
    port: parseInt(settings.smtpPort ?? "587", 10),
    secure: settings.smtpSecure === "true",
    user,
    pass,
  };
}
