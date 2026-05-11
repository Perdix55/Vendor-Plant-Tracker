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
  // height=62 becomes the visual *width* of the right column after 90° CW rotation (~0.65" on a 1" tall label).
  // width=1 keeps the total bar span ≈95px ≈ 0.99" which fills the 1" label height.
  const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  JsBarcode(svgEl, barcodeValue, {
    format: "CODE128",
    width: 1,
    height: 62,
    displayValue: true,
    fontSize: 8,
    margin: 2,
    background: "#ffffff",
    lineColor: "#000000",
  });

  const bcW = parseFloat(svgEl.getAttribute("width")  ?? "100");
  const bcH = parseFloat(svgEl.getAttribute("height") ?? "70");

  // Pre-rotate the SVG 90° CW at the SVG level using a matrix transform.
  // Resulting image size: width=bcH, height=bcW — so flexbox sees the correct portrait dimensions.
  // matrix(0,1,-1,0, bcH,0) maps (x,y) → (−y+bcH, x): a 90° CW rotation about the origin, shifted right by bcH.
  const rotSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  rotSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  rotSvg.setAttribute("width",   String(bcH));
  rotSvg.setAttribute("height",  String(bcW));
  rotSvg.setAttribute("viewBox", `0 0 ${bcH} ${bcW}`);
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `matrix(0,1,-1,0,${bcH},0)`);
  Array.from(svgEl.childNodes).forEach(n => g.appendChild(n.cloneNode(true)));
  rotSvg.appendChild(g);

  const svgData = new XMLSerializer().serializeToString(rotSvg);
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;

  const safeName = productName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeVendor = vendorLine.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // The pre-rotated SVG has intrinsic size bcH × bcW (portrait).
  // Flexbox can size it naturally — no absolute positioning needed.
  const labelHtml = Array.from(
    { length: qty },
    (_, i) => `
    <div class="label${i > 0 ? " break" : ""}">
      <div class="text-area">
        <div class="name">${safeName}</div>
        <div class="vendor">${safeVendor}</div>
      </div>
      <img src="${svgUrl}" class="barcode" alt="${barcodeValue}" />
    </div>`
  ).join("\n");

  const win = window.open("", "_blank", "width=420,height=300,menubar=no,toolbar=no");
  if (!win) {
    alert("Pop-up blocked — please allow pop-ups for this site and try again.");
    return;
  }

  win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Print Labels — ${safeName}</title>
<style>
  @page { size: 2.25in 1.25in; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 2.25in; background: #fff; font-family: Arial, Helvetica, sans-serif; }
  .label {
    width: 2.25in;
    height: 1.25in;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 3px 2px 3px 4px;
    overflow: hidden;
    background: #fff;
  }
  .label.break { page-break-before: always; }
  .text-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    padding-right: 3px;
    min-width: 0;
  }
  .name {
    font-size: 8.5pt;
    font-weight: bold;
    line-height: 1.2;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .vendor {
    font-size: 6.5pt;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333;
  }
  .barcode {
    height: 0.92in;
    width: auto;
    flex-shrink: 0;
    display: block;
  }
  @media screen {
    body { background: #e5e5e5; padding: 12px; }
    .label { border: 1px solid #999; border-radius: 2px; margin-bottom: 10px; background: #fff; }
    .instructions {
      font-family: Arial, sans-serif;
      font-size: 12px;
      color: #444;
      background: #fffbe6;
      border: 1px solid #f0c36d;
      border-radius: 4px;
      padding: 8px 12px;
      margin-bottom: 12px;
      line-height: 1.5;
    }
    .print-btn {
      display: block;
      margin: 0 0 12px;
      padding: 8px 20px;
      background: #1d4ed8;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    }
  }
  @media print {
    .instructions, .print-btn { display: none; }
  }
</style>
</head>
<body>
<div class="instructions">
  <strong>Before printing:</strong> in the print dialog select your <strong>GK420d</strong> printer,
  then under paper size choose <strong>2.25 × 1.25 inch</strong> label stock.
  Disable headers &amp; footers if shown.
</div>
<button class="print-btn" onclick="window.print()">Print ${qty} label${qty !== 1 ? "s" : ""}</button>
${labelHtml}
<script>
  window.onload = function() {
    var imgs = document.querySelectorAll('img');
    var loaded = 0;
    function tryPrint() {
      loaded++;
      if (loaded >= imgs.length) { window.focus(); window.print(); }
    }
    if (imgs.length === 0) { window.focus(); window.print(); }
    else { imgs.forEach(function(img) { if (img.complete) tryPrint(); else { img.onload = tryPrint; img.onerror = tryPrint; } }); }
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
