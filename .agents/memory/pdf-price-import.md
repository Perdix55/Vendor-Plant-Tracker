---
name: PDF price import
description: How the price-list import service fetches and parses vendor price list PDFs
---

## Key decisions

- **pdfjs-dist** is used for PDF text extraction (not pdf-parse v2, which has no simple function API in v2.4.5).
- pdfjs-dist is imported via `await import("pdfjs-dist/legacy/build/pdf.mjs")` and marked external in esbuild.
- Text items from `page.getTextContent().items` are joined with `" "` (single space); pdfjs returns empty-string padding items which produce multi-space separation between columns.

## Andersen Farms PDF format
- Mailchimp tracking URL (`us.list-manage.com/...`) redirects 302 to `mcusercontent.com/.../Availability_List_Week_25_June_15_22nd.02.pdf`
- PDF structure: `Plant Name [**] [NEW]   qty   $price   size/notes`
- Section headers: `4" POT SIZE`, `6" POT SIZE`, `10" POT SIZE`, `POT SIZE 12"`
- Packaging section at end has prices like $0.20 — filtered by `price < 1.0`

## Parser approach
Split full text on `(\$\d{1,4}(?:\.\d{1,2})?)` (capturing), then for each price at odd index:
1. Take the segment before the price (`parts[i-1]`)
2. Strip trailing quantity: `s.replace(/\s+[\d,]+\s*$/, "")`
3. Strip trailing NEW (with optional **): `s.replace(/\s*\*{0,2}\s*NEW\s*$/i, "")`
4. Strip trailing asterisks
5. Split by `\s{2,}|\n` to get last chunk → plant name
6. Validate: no digit start, no all-caps, no URLs, no pot-size headers

**Why:** The PDF columns are visually separated; pdfjs preserves multi-space gaps via empty string items. Stripping qty+NEW before splitting is more robust than token-based walking.
