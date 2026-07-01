---
name: E2E testing with password-based auth
description: How to get runTest() past a login screen without disrupting the real user's credentials
---

When an app requires email/password login (bcrypt-hashed `password_hash` in a `users` table) and you don't know
the real user's password, don't reset or overwrite their password to test — that's destructive and they may not
know it changed.

Instead: insert a disposable admin user directly via SQL with a known bcrypt hash (generate the hash using the
API server's own `bcryptjs` install, e.g. `node -e "require('bcryptjs').hash(...)"` from inside the relevant
artifact's directory so the module resolves), run the `runTest()` e2e flow against it, then delete the row
afterward.

**Why:** Preserves the real account's credentials/access untouched while still allowing full authenticated e2e
coverage of gated features.

**How to apply:** Any time a feature to be tested lives behind a login you don't have credentials for. Always
clean up (delete) the temp user row once testing completes.
