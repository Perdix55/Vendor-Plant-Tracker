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
- `orders` — purchase orders with status (draft → sent → confirmed/partial), includes shipDate + arriveDate
- `order_items` — line items per order with availability confirmation
- `inventory_items` — one row per (product, vendor), tracks quantityOnHand
- `inventory_transactions` — ledger of receives/sales/adjustments (type: receive | sale | adjustment | write_off)

## Order Workflow

1. Buyer creates a **draft** order: picks vendor + ship date, enters quantities from vendor's product catalog
2. Buyer marks order as **sent** when submitted to vendor
3. Vendor responds; buyer enters confirmation per line item (available / unavailable / partial + confirmed qty)
4. Order status updates to **confirmed** or **partial** automatically
5. When truck arrives, buyer clicks **Receive Shipment** → enters actual received quantities → inventory updated

## API Routes

- `GET /api/vendors` — list all vendors
- `GET /api/vendors/:id` — vendor detail
- `GET /api/vendors/:id/products` — vendor's product catalog
- `POST /api/vendors/import` — bulk import vendor + products from spreadsheet
- `GET/POST /api/orders` — list / create orders
- `GET/PUT/DELETE /api/orders/:id` — order CRUD
- `GET /api/orders/:id/items` — list order items
- `POST /api/orders/:id/items` — add item
- `PUT /api/orders/:id/items/:itemId` — update item
- `DELETE /api/orders/:id/items/:itemId` — delete item
- `POST /api/orders/:id/confirm` — bulk confirm all items (vendor confirmation)
- `POST /api/orders/:id/receive` — receive shipment → writes inventory_transactions + updates inventory_items
- `GET /api/inventory` — list all inventory (joined with product + vendor names)
- `POST /api/inventory/adjust` — manual adjustment (sale / write-off / correction)
- `GET /api/inventory/transactions` — transaction history (optional ?productId filter)
- `GET /api/summary/dashboard` — stats overview
- `GET /api/summary/recent-orders` — recent orders
- `GET /api/summary/vendor-activity` — per-vendor order totals

## Frontend Pages

- `/` — Dashboard with stats, recent orders, vendor activity
- `/vendors` — Vendor grid with product counts
- `/vendors/:id` — Vendor detail + searchable product catalog
- `/orders` — Orders list with Ship Date, Arrive Date columns, search + status filter
- `/orders/new` — New order form: pick vendor → see catalog → enter quantities
- `/orders/:id` — Order detail, mark as sent, enter vendor confirmations, Receive Shipment button
- `/orders/:id/receive` — Receive shipment form: enter per-item received quantities → adds to inventory
- `/inventory` — Inventory dashboard: stock levels, summary cards, adjust dialog, history modal
- `/admin` — Admin: manage vendor emails, shipping days, add/edit products
