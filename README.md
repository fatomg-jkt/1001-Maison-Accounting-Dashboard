# 1001-Maison-Accounting-Dashboard
Financial Dashboard for 1001 &amp; Maison Group including Profit &amp; Loss, Balance Sheet, Cashflow, Budgeting and Financial Analytics.

## Financial report access

Neraca and Laba Rugi use an eight-hour, HttpOnly server session. Configure
`SESSION_SECRET`, `ACCESS_ADMIN_EMAIL`, `ACCESS_ADMIN_PASSWORD`, and
`BLOB_READ_WRITE_TOKEN` in Vercel. The initial administrator is created from the
admin credentials on first use; subsequent users are stored server-side in the
private Vercel Blob `financial-access-users.json`.
