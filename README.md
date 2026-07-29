# 1001 Maison Accounting Dashboard

Financial Dashboard for 1001 & Maison Group including Profit & Loss, Balance Sheet, Cashflow, Budgeting and Financial Analytics.

## Vercel routing

The dashboard is a client-side SPA. `vercel.json` preserves `/api/*` for Vercel Functions and rewrites all other paths to `index.html`, so routes such as `/login` can be opened directly or refreshed without returning a Vercel 404.

## Authentication and roles

Every dashboard route is protected by an eight-hour, signed, HttpOnly session cookie. User records and bcrypt password hashes are kept in the private Vercel Blob `financial-access-users.json`; passwords are never sent back to the browser.

Configure these Vercel environment variables before deploying:

- `SESSION_SECRET`: a long random signing secret.
- `BLOB_READ_WRITE_TOKEN`: the private Blob store token.
- `SUPER_ADMIN_PASSWORD`: `Admin1001#Maison26` for the requested test account.
- `ACCOUNTING_PASSWORD`: `Accounting1001#26` for the requested test account.
- `MANAGEMENT_PASSWORD`: `ManagementMaison#26` for the requested test account.

The corresponding server-defined emails are `superadmin@1001maison.test`, `accounting@1001maison.test`, and `management@1001maison.test`. Do not prefix the password variables with `VITE_`: they must remain server-only. Override the testing values with strong, unique secrets before production use.

Role policy:

- **Super Admin** has full dashboard, data, master-data, and account-management access.
- **Accounting** has dashboard, reports, analysis, master-data, import/update/export access, but no user-management access.
- **Management** has read/filter/export/print access and cannot open master data, account settings, uploads, or data-update controls.
