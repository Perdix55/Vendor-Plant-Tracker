---
name: esbuild externals
description: Which packages must be in the api-server build.mjs external array and why
---

## Rules
- **pdfjs-dist** and **pdfjs-dist/***: Must be external. 9.7 MB library; also has complex internal imports that confuse esbuild.
- **pdf-parse**: Must be external. pdf-parse v2 ESM build (`dist/pdf-parse/esm/index.js`) has no default export — esbuild errors with "No matching export for import default". CJS version exists but we use pdfjs-dist directly instead.
- **connect-pg-simple**: Already external (pre-existing requirement).

**Why:** These packages use dynamic module loading internally or have ESM/CJS mismatches that esbuild can't handle when bundling.
