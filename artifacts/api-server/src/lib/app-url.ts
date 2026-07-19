/**
 * Public origin for links in emails (order confirmations, password resets, etc.).
 * Works on Render, Replit, and local dev without platform-specific env vars.
 */
export function getPublicAppOrigin(): string {
  const raw =
    process.env.APP_URL?.trim() ||
    process.env.RENDER_EXTERNAL_URL?.trim() ||
    process.env.REPLIT_DOMAINS?.split(",")[0]?.trim();

  if (!raw) {
    return "http://localhost:8080";
  }

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw.replace(/\/$/, "");
  }

  const protocol = raw.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${raw}`;
}
