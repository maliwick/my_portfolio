# Malinga Portfolio

Responsive React + Vite portfolio with shared navigation, animated cybersecurity background and cursor, loading screens, searchable content and PSudo IT Solution.

## Pages and content

| Section | React page | Content folder | Public URL |
| --- | --- | --- | --- |
| Labs | `src/pages/Labs/index.jsx` | `src/pages/Labs/content/` | `/labs/` |
| Badges | `src/pages/Badges/index.jsx` | `src/pages/Badges/content/` | `/badges/` |
| Projects | `src/pages/Projects/index.jsx` | `src/pages/Projects/content/` | `/projects/` |
| Blogs | `src/pages/Blogs/index.jsx` | `src/pages/Blogs/content/` | `/blogs/` |

Each entry is an individual JSON file named after its ID. Cards, search results, homepage links and detail pages link automatically. For example, `src/pages/Projects/content/roam-ride.json` publishes at `/projects/roam-ride/`. Shared layouts live in `src/components/`. Existing `.html` links remain supported.

See [PUBLISHING.md](PUBLISHING.md) for adding and editing content. All files in these folders are public; keep unfinished drafts elsewhere. Sample badges and sample labs remain clearly labeled.

## Run and build

```sh
npm ci
npm run dev
npm test
npm run build
```

Cloudflare Workers Builds: branch `main`, build command `npm run build`, deploy command `npx wrangler deploy`. The committed `wrangler.jsonc` serves `dist` as static assets with SPA fallback for Worker `myportfolio`. No admin dashboard, authentication backend, database binding or password configuration is required.
