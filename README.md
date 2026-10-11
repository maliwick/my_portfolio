# Malinga Portfolio — React

A responsive React + Vite portfolio using JSX, HTML, and CSS. Includes project and lab pages, blog articles, a planned PSudo IT Solution business page, sample badges, a browser content editor, an animated cybersecurity background, and a shared reticle cursor.

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
- `public/data/content.json`: public projects, labs, and badges.
- `public/image/`: portfolio assets.
- `tests/`: data, routing, and component-rendering checks.

Existing `.html` links remain supported. The build emits HTML entrypoints for every original page, including `business/index.html`, so refreshing a direct link works on static hosts. `public/_redirects` also enables Cloudflare Pages SPA fallback.

## Hosting

For Cloudflare Pages or Vercel, set the build command to `npm run build` and output directory to `dist`. Use the repository root as the project root. The private ChatGPT review copy is deployed separately and does not update automatically from GitHub commits.

See [PUBLISHING.md](PUBLISHING.md) for the content workflow and current limits.
