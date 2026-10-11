# Admin dashboard setup

The public portfolio is `/index.html`. The admin dashboard is `/admin.html`; `/editor.html` also opens the protected dashboard. Visitors search published projects, labs, badges and blog posts at `/search.html` without signing in.

Admin changes save to D1 immediately. A draft is returned only by the authenticated admin API, never by `/api/content`. Delete permanently removes the entry. Concurrent edits are rejected so one browser cannot silently overwrite another browser's changes.

## Cloudflare: one-time setup

This repository contains the backend, dashboard, database schema and generated migrations. Your own Cloudflare account still needs a D1 database binding and an admin password secret. No password or Cloudflare token is committed.

1. Pull the latest `main` and sign in to your Cloudflare account locally:

   ```sh
   npm ci
   npx wrangler login
   npx wrangler d1 create portfolio-content
   ```

2. Copy the real database ID from that command into the `d1_databases` field of `wrangler.jsonc`. Preserve the existing configuration and add:

   ```json
   "d1_databases": [{
     "binding": "DB",
     "database_name": "portfolio-content",
     "database_id": "PASTE-YOUR-REAL-DATABASE-ID",
     "migrations_dir": "drizzle"
   }]
   ```

   This example ID is a placeholder, not a database that has been created for you. Commit your real binding configuration so Workers Builds preserves it. The database ID is configuration, not a password.

3. Apply the migration:

   ```sh
   npx wrangler d1 migrations apply portfolio-content --remote
   ```

4. Set a unique admin password using the hidden Wrangler prompt. Use a password manager to generate a strong password of at least 16 characters. Do not put it into `VITE_` variables, GitHub files, or frontend code:

   ```sh
   npx wrangler secret put ADMIN_PASSWORD
   ```

   The username is `admin`. To change it, add `ADMIN_USERNAME` as a Worker runtime variable. Leave `AUTH_MODE` unset on your Cloudflare Worker; password authentication is the default.

5. Build and deploy:

   ```sh
   npm run build
   npx wrangler deploy
   ```

   Workers Builds settings: production branch `main`, build `npm run build`, deploy `npx wrangler deploy`. The `ASSETS` binding serves the portfolio; `/api/*` goes to the backend first. Keep the Worker name `myportfolio` unless you deliberately change your existing Worker.

6. Open your live site's `/admin.html`, sign in, and click **Import existing portfolio** once. This copies the initial projects, labs, badges and three blog posts from `data/seed.json` into D1. After importing, use **New entry**, **Save private draft**, **Save & publish**, **Preview**, or **Delete entry**. Published changes appear on the live site immediately; visitors already viewing a page see changes on refresh.

Before database setup, the public API serves the existing published seed portfolio and admin writes are disabled. After initialization, the database is authoritative; deleting seed entries does not restore them on the next deploy. The generated migration is schema-only; importing initial content is a separate authenticated action.

## Private review copy

The ChatGPT preview has its own D1 database, separate from your Cloudflare account. It uses ChatGPT sign-in restricted to the Site owner. Content saved in that preview does not automatically copy to your live Cloudflare database. Use each dashboard on the intended host.

## Local backend checks

`npm test` exercises the real Worker handler against SQLite: unauthorized access, origin and CSRF validation, rate limits, login expiry/logout, draft privacy, all four CRUD flows, stale revisions and deletion persistence. It also checks public routes and React rendering.

For local full-app development, configure the D1 binding, run `npx wrangler d1 migrations apply portfolio-content --local`, set `ADMIN_PASSWORD` in an ignored `.dev.vars` file, then `npm run build` and `npx wrangler dev`. Use the origin printed by Wrangler so same-origin write checks work. `npm run dev` is the Vite UI-only server; it does not provide the database API.

## Maintenance

Generate future schema migrations with `npm run db:generate`; never edit an applied migration. Apply new migrations before deploying the backend that depends on them. Backup/export from the authenticated dashboard contains drafts, so store it privately. Rotating `ADMIN_PASSWORD` also requires clearing existing sessions if immediate sign-out is desired; sessions otherwise expire after eight hours.
