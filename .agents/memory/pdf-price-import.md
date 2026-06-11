---
name: PDF price import
description: How the price-list import service fetches and parses vendor price list PDFs
---

## Key decisions

- **pdfjs-dist** is used for PDF text extraction (not pdf-parse v2, which has no simple function API in v2.4.5).
- pdfjs-dist is imported via `await import("pdfjs-dist/legacy/build/pdf.mjs")` and marked external in esbuild.
- Text items from `page.getTextContent().items` are joined with `" "` (single space); pdfjs returns empty-string padding items which produce multi-space separation between columns.

## Andersen Farms (vendor 14)
- Mailchimp tracking URL redirects 302 to `mcusercontent.com/.../*.pdf`
- Format: flat rows — `Plant Name [**] [NEW]   qty   $price   size/notes`
- Section headers: `4" POT SIZE`, `6" POT SIZE` etc. — filtered by `isValidPlantName`
- Packaging/surcharge rows have prices like $0.20 — filtered by `price < 1.0`
- priceListEmail: `Barb@Andersenfarms.com`

## Castleton Gardens (vendor 15)
- Sends Google Drive share link: `https://drive.google.com/file/d/{id}/view`
- Service converts to: `https://drive.usercontent.google.com/download?id={id}&export=download`
- `isPdf()` must also accept `drive.usercontent.google.com` URLs (they return `application/octet-stream`, not `application/pdf`)
- **Prices are spaced-out by pdfjs**: `$ 7. 50` or `$ 4 3 . 0 0` — `normalizeSpacedPrices()` runs before splitting
- **Pot-size tokens use U+201D** (right curly quote), not ASCII `"` — `isPotSizeToken()` must strip Unicode quotes before matching `/^\d{1,2}$/`
- Format: hierarchical — `{Genus}` section header → `{pot size}` sub-header → variety row
- Genus detection: look for `isGenusCandidate(chunk[i]) && isPotSizeToken(chunk[i+1])` AND at least one valid variety name AFTER the pot-size (prevents variety names followed by their own height spec — e.g. "Romeo 12\"" — from being false-positives)
- Name extraction: two-phase backward scan — tail-skip phase (skip size specs, N/A, notes, AND digit-starting chunks) → accumulate phase (stop at digit or all-caps hard-stop)
- priceListEmail: `castletongardensinc@gmail.com`

## Forwarded emails (Gmail via Zapier)
- Zapier forwards from user's Gmail (`jjpartridge@gmail.com`), not the vendor's address
- `extractOriginalSender(html, text)` parses the "Forwarded message … From:" block
- Primary regex: `/Forwarded message[\s\S]{0,200}?From:\s+[^<\n]*<([^\s>@]+@[^\s>]+)>/i`
- Works for both non-Gmail vendors (Andersen Farms) and Gmail-based vendors (Castleton Gardens)
- Fallback scans `mailto:` links in HTML — may miss Gmail-based senders (primary pattern handles those correctly in practice)

## Parser approach (parsePriceListText)
Split full text on `(\$\d{1,4}(?:\.\d{1,2})?)` (capturing), then for each price at odd index:
1. Normalise spaced prices (Castleton Gardens style) before splitting
2. Detect genus from segment (genus candidate before pot-size, with variety after)
3. Two-phase backward scan of 2+-space-delimited chunks for the variety name
4. Prepend currentGenus to variety if not already included
5. Deduplicate by lowercased name (first/smallest pot-size price wins)

**Why:** The PDF columns are visually separated; pdfjs preserves multi-space gaps. Two-phase scan handles both tail size-specs (skip) and pre-variety pot-size headers (stop) correctly.

## Font rendering quirks
- pdfjs may split words: "Juliette" → "Julie t te", "Single" → "S ingle" — stored as-is; future imports from same PDF will produce same strings and match correctly
