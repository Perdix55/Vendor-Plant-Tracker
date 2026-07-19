#!/usr/bin/env bash
# Render production build — keep in sync with render.yaml buildCommand.
set -euo pipefail

corepack prepare pnpm@10.4.1 --activate
pnpm install --frozen-lockfile
pnpm --filter @workspace/po-system run build
pnpm --filter @workspace/api-server run build
