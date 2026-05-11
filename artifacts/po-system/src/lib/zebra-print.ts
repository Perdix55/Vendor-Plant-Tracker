/**
 * Zebra Browser Print integration.
 *
 * Zebra Browser Print is a desktop app the user installs locally.
 * It exposes a REST API on localhost that accepts ZPL and routes it
 * to attached Zebra printers.
 *
 * Ports:
 *   https://localhost:9101  — used when this page is served over HTTPS
 *   http://localhost:9100   — fallback for HTTP contexts
 *
 * Docs: https://www.zebra.com/us/en/software/printer-software/browser-print.html
 */
import JsBarcode from "jsbarcode";

const CANDIDATES = [
  "https://localhost:9101",
  "http://localhost:9100",
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

/** Probe each candidate URL; return the first that responds, or "cert_blocked" if SSL trust is needed. */
async function findBrowserPrint(): Promise<string | "cert_blocked" | null> {
  let certBlocked = false;
  for (const base of CANDIDATES) {
    try {
      const r = await fetch(`${base}/available`, {
        signal: AbortSignal.timeout(2500),
      });
      if (r.ok) return base;
    } catch (e) {
      // On HTTPS pages, browsers block https://localhost:9191 with a TypeError
      // if the self-signed cert hasn't been trusted yet. Detect that case so
      // we can show a targeted "trust the cert" instruction instead of the
      // generic "not installed" message.
      if (base.startsWith("https") && e instanceof TypeError) {
        certBlocked = true;
      }
    }
  }
  return certBlocked ? "cert_blocked" : null;
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
  | { ok: false; reason: "not_installed" | "no_printer" | "send_failed" | "cert_error"; message: string };

/**
 * Render labels as HTML in a popup window and trigger the browser's
 * native print dialog. Works with any printer selected in the OS —
 * no Browser Print or cert setup required.
 *
 * Uses JsBarcode to generate a CODE128 SVG barcode inline.
 */
export function printLabelNative(opts: {
  productName: string;
  productId: number;
  vendorName: string;
  packSize?: string | null;
  qty: number;
}): void {
  const { productName, productId, vendorName, packSize, qty } = opts;
  const barcodeValue = String(productId).padStart(8, "0");
  const vendorLine =
    packSize && packSize !== "N/A"
      ? `${vendorName}  |  Pack: ${packSize}`
      : vendorName;

  // Render barcode to SVG using JsBarcode.
  // The barcode will be rotated 90° CW on the label.
  // height=72 becomes the visual *width* after rotation (fits in right column of label).
  const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  JsBarcode(svgEl, barcodeValue, {
    format: "CODE128",
    width: 1.4,
    height: 72,
    displayValue: true,
    fontSize: 9,
    margin: 2,
    background: "#ffffff",
    lineColor: "#000000",
  });

  // Capture rendered dimensions so the rotation wrapper can be sized exactly.
  const bcW = parseFloat(svgEl.getAttribute("width") ?? "120");
  const bcH = parseFloat(svgEl.getAttribute("height") ?? "84");
  // After rotate(90deg): visual width = bcH, visual height = bcW
  const wrapW = Math.ceil(bcH);
  const wrapH = Math.ceil(bcW);
  // Offset to keep image centred inside the wrapper after CSS rotation
  const imgLeft = Math.round((bcH - bcW) / 2);
  const imgTop  = Math.round((bcW - bcH) / 2);

  const svgData = new XMLSerializer().serializeToString(svgEl);
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;

  const safeName = productName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeVendor = vendorLine.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Label block HTML uses inline styles for the rotation wrapper so the exact
  // pixel dimensions calculated above can be injected without a template step.
  const labelHtml = Array.from(
    { length: qty },
    (_, i) => `
    <div class="label${i > 0 ? " break" : ""}">
      <div class="text-area">
        <div class="name">${safeName}</div>
        <div class="vendor">${safeVendor}</div>
      </div>
      <div class="barcode-col" style="width:${wrapW}px;height:${wrapH}px;position:relative;overflow:hidden;flex-shrink:0;">
        <img src="${svgUrl}" alt="${barcodeValue}"
          style="position:absolute;width:${bcW}px;height:${bcH}px;left:${imgLeft}px;top:${imgTop}px;transform:rotate(90deg);transform-origin:center center;" />
      </div>
    </div>`
  ).join("\n");

  const win = window.open("", "_blank", "width=500,height=400,menubar=no,toolbar=no");
  if (!win) {
    alert("Pop-up blocked — please allow pop-ups for this site and try again.");
    return;
  }

  win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Print Labels</title>
<style>
  @page { size: 2.25in 1.25in; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 2.25in; background: #fff; }
  .label {
    width: 2.25in;
    height: 1.25in;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 3px 4px 5px;
    overflow: hidden;
  }
  .label.break { page-break-before: always; }
  .text-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    padding-right: 4px;
  }
  .name {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 9pt;
    font-weight: bold;
    line-height: 1.2;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .vendor {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 7pt;
    margin-top: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
</head>
<body>
${labelHtml}
<script>
  window.onload = function() {
    window.focus();
    window.print();
    setTimeout(function() { window.close(); }, 1500);
  };
<\/script>
</body>
</html>`);
  win.document.close();
}

/**
 * High-level helper: discover Browser Print, find the default printer,
 * and send a ZPL string.
 *
 * Returns a discriminated union so callers can show targeted errors.
 */
export async function printZpl(zpl: string): Promise<PrintResult> {
  const base = await findBrowserPrint();
  if (base === "cert_blocked") {
    return {
      ok: false,
      reason: "cert_error",
      message:
        "Browser Print's certificate must be permanently trusted in your system. " +
        "Clicking 'Proceed anyway' in a tab is not enough — it must be added to your " +
        "Trusted Root Certification Authorities (Windows: certmgr.msc, Mac: Keychain Access). " +
        "See the instructions in the print error for the exact steps.",
    };
  }
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
