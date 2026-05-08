/**
 * Zebra Browser Print integration.
 *
 * Zebra Browser Print is a desktop app the user installs locally.
 * It exposes a REST API on localhost that accepts ZPL and routes it
 * to attached Zebra printers.
 *
 * Ports:
 *   https://localhost:9191  — used when this page is served over HTTPS
 *   http://localhost:9090   — fallback for HTTP contexts
 *
 * Docs: https://www.zebra.com/us/en/software/printer-software/browser-print.html
 */

const CANDIDATES = [
  "https://localhost:9191",
  "http://localhost:9090",
];

type ZebraDevice = {
  uid: string;
  connection: string;
  deviceType: string;
  version?: number;
  provider?: string;
  manufacturer?: string;
  name?: string;
};

/** Probe each candidate URL; return the first that responds. */
async function findBrowserPrint(): Promise<string | null> {
  for (const base of CANDIDATES) {
    try {
      const r = await fetch(`${base}/available`, {
        signal: AbortSignal.timeout(2500),
      });
      if (r.ok) return base;
    } catch {
      // next candidate
    }
  }
  return null;
}

/** Fetch the default printer device object from Browser Print. */
async function getDefaultPrinter(base: string): Promise<ZebraDevice | null> {
  const r = await fetch(`${base}/default?type=printer`, {
    signal: AbortSignal.timeout(3000),
  });
  if (!r.ok) return null;
  const device = (await r.json()) as ZebraDevice;
  return device?.uid ? device : null;
}

/** Send raw ZPL to a device via Browser Print. */
async function sendZpl(base: string, device: ZebraDevice, zpl: string): Promise<void> {
  const r = await fetch(`${base}/write`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ device, data: zpl }),
    signal: AbortSignal.timeout(5000),
  });
  if (!r.ok) throw new Error(`Browser Print write failed: ${r.status} ${r.statusText}`);
}

/**
 * Escape characters that ZPL interprets as control sequences.
 * Within a ^FD...^FS field, ^ and ~ are command prefixes.
 */
function escapeZpl(text: string): string {
  return text.replace(/\^/g, "").replace(/~/g, "");
}

/**
 * Build a ZPL label for a single plant/product.
 *
 * Label size: 2.25" × 1.25" at 203 DPI  (456 × 254 dots)
 * Barcode:    CODE128, encodes the zero-padded productId
 *
 * @param productName  Full product name
 * @param productId    Numeric product ID (becomes the barcode value)
 * @param vendorName   Vendor name shown below the product name
 * @param packSize     Pack size string, or null/undefined to omit
 * @param qty          Number of copies (uses ZPL ^PQ)
 */
export function buildPlantLabel(opts: {
  productName: string;
  productId: number;
  vendorName: string;
  packSize?: string | null;
  qty: number;
}): string {
  const { productName, productId, vendorName, packSize, qty } = opts;
  const barcodeValue = String(productId).padStart(8, "0");
  const nameLine = escapeZpl(productName);
  const vendorLine = escapeZpl(
    packSize && packSize !== "N/A"
      ? `${vendorName}  |  Pack: ${packSize}`
      : vendorName
  );

  // Layout on 456 × 254 dot canvas:
  //   y= 12  Product name  (up to 2 lines, 24-pt, centred)
  //   y= 72  Vendor + pack  (18-pt, centred, 1 line)
  //   y= 98  CODE128 barcode (80 dots tall) with human-readable below
  //   PQ     print qty copies

  return [
    "^XA",
    "^PW456^LL254^MMT^PON",
    // Product name – up to 2 centred lines
    `^FO10,12^A0N,24,24^FB436,2,0,C^FD${nameLine}^FS`,
    // Vendor / pack size
    `^FO10,72^A0N,18,18^FB436,1,0,C^FD${vendorLine}^FS`,
    // Barcode centred horizontally (BY module=2, ratio=3, height=80)
    `^FO115,98^BY2,3,80^BCN,80,Y,N,N^FD${barcodeValue}^FS`,
    // Print quantity
    `^PQ${qty},0,1,Y`,
    "^XZ",
  ].join("\n");
}

export type PrintResult =
  | { ok: true }
  | { ok: false; reason: "not_installed" | "no_printer" | "send_failed"; message: string };

/**
 * High-level helper: discover Browser Print, find the default printer,
 * and send a ZPL string.
 *
 * Returns a discriminated union so callers can show targeted errors.
 */
export async function printZpl(zpl: string): Promise<PrintResult> {
  const base = await findBrowserPrint();
  if (!base) {
    return {
      ok: false,
      reason: "not_installed",
      message:
        "Zebra Browser Print is not running on this computer. " +
        "Download and install it from zebra.com/browserprint, then try again.",
    };
  }

  const device = await getDefaultPrinter(base);
  if (!device) {
    return {
      ok: false,
      reason: "no_printer",
      message:
        "No default Zebra printer found. Open Zebra Browser Print and set a default printer.",
    };
  }

  try {
    await sendZpl(base, device, zpl);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: "send_failed",
      message: err instanceof Error ? err.message : "Failed to send label to printer.",
    };
  }
}
