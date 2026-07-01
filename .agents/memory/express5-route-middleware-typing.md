---
name: Express 5 route param typing breaks with generic middleware
description: Adding an untyped RequestHandler as route middleware before a path-parameterized handler can make req.params fields resolve to string | string[] instead of string.
---

When you add a generic `RequestHandler` (e.g. an auth guard with default generics) as middleware before a handler on a path like `/foo/:id`, TypeScript may fail to narrow `req.params.id` to `string` and instead type it as `string | string[]`, breaking calls like `parseInt(req.params.id, 10)`.

**Why:** TS unifies parameter types across all handlers passed to `router.get(path, mw1, mw2, ...)`; an untyped middleware's default generics can win out over the path-inferred params type.

**How to apply:** If adding auth/guard middleware to an existing path-parameterized route causes a new `string | string[]` argument-type error on `req.params`, wrap the access in `String(req.params.x)` rather than fighting the generics — it's a quick, safe fix.
