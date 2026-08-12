# 1001 Maison Accounting Dashboard

Financial Dashboard for 1001 & Maison Group including Profit & Loss, Balance Sheet, Cashflow, Budgeting and Financial Analytics.

## Vercel routing

The dashboard is a client-side SPA. `vercel.json` preserves `/api/*` for Vercel Functions and rewrites all other paths to `index.html`, so routes such as `/login` can be opened directly or refreshed without returning a Vercel 404.

## Authentication and roles

Every dashboard route is protected by a server-validated session. Anonymous visitors are redirected to `/login`, while authenticated users keep access across refreshes through a signed, HttpOnly, SameSite=Lax cookie (eight hours, or 30 days when **Ingat saya** is selected). User records and bcrypt password hashes are kept in the private Vercel Blob `financial-access-users.json`; passwords and hashes are never sent back to the browser.

Configure these Vercel environment variables before deploying:

- `SESSION_SECRET`: a long random signing secret.
- `BLOB_READ_WRITE_TOKEN`: the private Blob store token.
- `INITIAL_ADMIN_PASSWORD_HASH` (optional): a server-only bcrypt hash used to override the built-in initial-account hash.

The initial administrator is seeded server-side as `hannabeforeafter@gmail.com`. Set `SESSION_SECRET` to a strong random value and provision `BLOB_READ_WRITE_TOKEN` in every Vercel environment. Never prefix either server variable with `VITE_`.

Role policy:

- **Super Admin** has full dashboard, data, master-data, and account-management access.
- **Accounting** has dashboard, reports, analysis, master-data, import/update/export access, but no user-management access.
- **Management** has read/filter/export/print access and cannot open master data, account settings, uploads, or data-update controls.
