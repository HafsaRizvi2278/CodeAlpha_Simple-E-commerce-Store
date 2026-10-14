# ShopNest — Full-stack E-commerce Store

CodeAlpha Simple E-commerce Store implementation using the supplied ShopNest Figma Make frontend. The teal storefront design is retained and its main workflows are connected to an Express API and persistent SQLite database.

## Requirements

- **Node.js 24 or newer** (required for built-in `node:sqlite`).
- npm, included with Node.js.
- Internet during dependency installation and for external product photos/fonts.

SQLite runs inside the Node server: no MongoDB, Python, or separate database installation is needed.

## Quick start (Windows PowerShell)

Extract the ZIP, open the `ShopNest` folder in VS Code, and open its terminal:

```powershell
npm ci
Copy-Item .env.example .env
```

Open `.env` and replace `ADMIN_PASSWORD` with your own password of at least 12 characters. Leave `APP_ORIGIN=http://localhost:5173` for development.

```powershell
npm run dev
```

Open **http://localhost:5173**. Vite serves the frontend and forwards `/api` requests to Express on port 3001. Both processes stop with Ctrl+C. Port 5173 must be free.

On macOS/Linux use `cp .env.example .env` instead of `Copy-Item`.

## Accounts

- Register a customer account using the UI (password: at least 8 characters).
- Admin email defaults to **admin@shopnest.com**; use the password you set in `.env`.
- The server creates the first admin at startup only when `ADMIN_PASSWORD` is set. Changing that environment variable later does not change an existing admin's password.
- Sessions use HttpOnly cookies and last up to 7 days. Logout invalidates the session on the server.
- Registration always creates a customer; admin access is checked by the server.

Use sample information for demonstration. `.env`, database files, and installed packages are excluded from this ZIP.

## Included features

- Database-backed product catalog, search/filter/sort, product details, and stock availability.
- Guest cart saved in the current browser; account carts stored in the database. Signing in merges the guest cart into the account cart, capped at available stock.
- Persistent registration/login/logout and profile/address editing.
- Authenticated checkout with the shipping information entered in the form.
- Order creation with server-calculated totals, transactional stock deduction, and cart clearing.
- Customer order history and product snapshots so old orders survive catalog edits/deletion.
- Admin product add/edit/soft-delete, order management, and live dashboard totals.
- Admin status transitions: Confirmed → Shipped → Delivered, or Confirmed → Cancelled. Cancellation restores stock exactly once. The API also supports Processing → Confirmed/Cancelled.

## Database

The server creates `server/data/shopnest.sqlite` on first startup and seeds the catalog from `server/products.json`. Products, users, session tokens, account carts, and orders are stored there. Catalog seeding runs once per database.

Restarting the server preserves all data. Keep this file (and use SQLite's backup facilities for a live database); no database is included in the ZIP. `DB_PATH` can select another SQLite file.

This implementation targets a single Node server with a local persistent disk. Deployments with ephemeral disks or multiple app instances need an appropriate persistent database setup.

## Build and run from Express

```sh
npm run build
```

Change `.env` to `APP_ORIGIN=http://localhost:3001`, then:

```sh
npm start
```

Open **http://localhost:3001**. Express serves both the API and compiled frontend. A compiled `dist/` is included, but rebuild after source edits. `npm run preview` serves only the frontend and is not the full-stack start command.

For HTTPS hosting, set `NODE_ENV=production` and set `APP_ORIGIN` to the exact public origin. Production cookies require HTTPS. Keep server files and the database private; only `dist/` is public.

## Checks

```sh
npm run typecheck
npm test
npm run build
```

The integration test uses a temporary database and checks account registration, duplicate email handling, login/logout, session persistence, profile updates, account carts, input validation, origin checks, admin authorization, order ownership, server-calculated totals, stock changes, concurrent purchases, cancellation/restocking, product CRUD, historical snapshots, and persistence after reopening the database.

## Payment and other scope

Payments are explicitly simulated; no card details or funds are collected. Pay on delivery records the payment choice only. The demonstration uses USD prices, free shipping at a $75 subtotal (otherwise $5), and an illustrative 8% tax. The server is authoritative for final totals.

Email delivery, real payment gateways, password recovery, return processing, and a persistent wishlist are not implemented. Wishlist hearts remain temporary UI selections. Some original promotional copy and ratings are sample content. Navigation uses React state; refreshing opens Home while restoring the account and cart. External photo availability depends on their provider.

## Troubleshooting

- `node:sqlite` unavailable: install Node.js 24+ and confirm `node --version`.
- `tsc` not recognized: run `npm ci` in the folder containing `package.json`.
- “Untrusted request origin”: make `APP_ORIGIN` match the URL in your address bar exactly and restart. Development uses port 5173; Express-only mode uses port 3001.
- Admin login fails: confirm your `.env` was present before first admin creation and use that original password. Customers cannot obtain admin access by choosing an admin-looking email.
- Stock error at checkout: availability changed; review quantities in the cart before retrying.
- Connection failed: run `npm run dev` for development or `npm start` for the compiled application; do not open `index.html` directly.

## Structure

```text
src/                  React pages, components, types, API client
server/app.mjs        Express routes, authentication, validation, database operations
server/index.mjs      Server entry point
server/products.json  Initial catalog seed
server/tests.mjs      HTTP/database integration tests
.env.example          Local configuration template
package-lock.json     Reproducible npm dependencies
vite.config.ts        React/Tailwind setup and development API proxy
```

See `API.md` for endpoints and `VALIDATION.md` for verification results.
