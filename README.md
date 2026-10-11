# Malinga Portfolio — React

A responsive React + Vite portfolio using JSX, HTML, and CSS. Includes project and lab pages, blog articles, a planned PSudo IT Solution business page, sample badges, a protected admin dashboard with D1 storage, an animated cybersecurity background, and a shared reticle cursor.

## Run locally

Requires Node.js 22.12+ (or Node.js 20.19+).

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. Use `npm run build` to create `dist/`, `npm run preview` to check the build locally, and `npm test` for content, route, and React rendering checks.

## Structure

- `src/pages/`: React page components.
- `src/components/`: shared navigation, cursor, background, content cards, and inquiry form.
- `src/styles/`: CSS with business styles scoped to its page.
- `src/lib.js`: content validation, search, and URL resolution.
- `data/seed.json`: initial projects, labs, badges and blog posts (imported once through admin).
- `worker/`: authenticated API and public content endpoint.
- `db/` and `drizzle/`: database schema and generated migrations.
- `public/image/`: portfolio assets.
- `tests/`: data, routing, and component-rendering checks.

Existing `.html` links remain supported. The build emits HTML entrypoints for every original page, including `business/index.html`, so refreshing a direct link works on static hosts.

## Hosting

For Cloudflare Workers Builds, use production branch `main`, build command `npm run build`, deploy command `npx wrangler deploy`, and the repository root as the project root. The committed `wrangler.jsonc` deploys `dist` as static assets to Worker `myportfolio`, enables SPA fallback, and preserves existing `.html` URLs. The Worker backend serves `/api/*`; native static assets serve the public portfolio. Complete [ADMIN_SETUP.md](ADMIN_SETUP.md) to connect your D1 database and admin sign-in.

Do not add `/* /index.html 200` to `_redirects`: Workers rejects that catch-all rule as an infinite loop. SPA fallback is configured through `assets.not_found_handling` instead. After a failed deployment, retry against the latest `main` commit.

For Cloudflare Pages or Vercel, set the build command to `npm run build` and output directory to `dist`. Use the repository root as the project root. The private ChatGPT review copy is deployed separately and does not update automatically from GitHub commits.

See [PUBLISHING.md](PUBLISHING.md) for the content workflow and current limits.
