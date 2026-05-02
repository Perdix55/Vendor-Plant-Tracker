# Vickery Wholesale Greenhouse — Purchase Order System

## Overview

Full-stack purchase order system for Vickery Wholesale Greenhouse 2026. Buyers use this internal tool to place weekly purchase orders with 13 vendors, track order status, and record vendor confirmations per line item.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + TanStack Query + wouter + shadcn/ui + Tailwind CSS
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild

## Architecture

```
artifacts/
  api-server/     — Express 5 REST API (port 8080, proxied at /api)
  po-system/      — React + Vite frontend (port 22387, proxied at /)
lib/
  api-spec/       — OpenAPI 3.1 spec + Orval codegen config
  api-client-react/ — Generated TanStack Query hooks
  api-zod/        — Generated Zod schemas
  db/             — Drizzle schema + migrations
```

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Database

PostgreSQL via `DATABASE_URL`. Tables:
- `vendors` — 13 vendors (Plants in Design, Quality Foliage, Railroad, T&T Botanicals, Vine & Culture, The Jungle, Kirkland Nurseries, K and M Nursery, Live Trends, Living Colors, Mercer, Mt. Plymouth, Tropical Earth)
- `products` — ~422 products across all vendors
- `orders` — purchase orders with status (draft → sent → confirmed/partial)
- `order_items` — line items per order with availability confirmation

## Order Workflow

1. Buyer creates a **draft** order: picks vendor + ship date, enters quantities from vendor's product catalog
2. Buyer marks order as **sent** when submitted to vendor
3. Vendor responds; buyer enters confirmation per line item (available / unavailable / partial + confirmed qty)
4. Order status updates to **confirmed** or **partial** automatically

## API Routes

- `GET /api/vendors` — list all vendors
- `GET /api/vendors/:id` — vendor detail
- `GET /api/vendors/:id/products` — vendor's product catalog
- `GET/POST /api/orders` — list / create orders
- `GET/PUT/DELETE /api/orders/:id` — order CRUD
- `GET /api/orders/:id/items` — list order items
- `POST /api/orders/:id/items` — add item
- `PUT /api/orders/:id/items/:itemId` — update item
- `DELETE /api/orders/:id/items/:itemId` — delete item
- `POST /api/orders/:id/confirm` — bulk confirm all items
- `GET /api/summary/dashboard` — stats overview
- `GET /api/summary/recent-orders` — recent orders
- `GET /api/summary/vendor-activity` — per-vendor order totals

## Frontend Pages

- `/` — Dashboard with stats, recent orders, vendor activity
- `/vendors` — Vendor grid with product counts
- `/vendors/:id` — Vendor detail + searchable product catalog
- `/orders` — Orders list with search + status filter
- `/orders/new` — New order form: pick vendor → see catalog → enter quantities
- `/orders/:id` — Order detail, mark as sent, enter vendor confirmations
