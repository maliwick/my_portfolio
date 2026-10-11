# Add or update portfolio content

1. Open the relevant folder under `src/pages/`: `Labs/content/`, `Badges/content/`, `Projects/content/` or `Blogs/content/`.
2. Copy an existing JSON entry and give it a unique ID. Name the file `<id>.json`, using letters, numbers, hyphens or underscores.
3. Edit the title, summary, body, tags and supporting URL. Keep `status` as `published`. Use `sample: true` for demonstration content, and `sample: false` only for your actual work or earned credentials. Badge entries also support `issuer`; blog entries support `author`; `date` uses `YYYY-MM-DD`.
4. Run `npm test` and `npm run build`, then commit to `main`. Cloudflare rebuilds the portfolio from these files.

```json
{
  "id": "my-lab",
  "title": "My Lab Practical",
  "summary": "What I investigated and learned.",
  "body": "Objective\nMy authorized lab objective.\n\nMethod\nMy steps and evidence.\n\nLessons\nWhat I learned.",
  "tags": ["Networking", "Security"],
  "date": "2026-10-11",
  "url": "",
  "status": "published",
  "sample": false
}
```

The build automatically creates the category page and each detail page. `Labs/content/my-lab.json` appears at `/labs/my-lab/`. Homepage cards, badge carousel, category pages and portfolio search all use the same folder content. Remove a file to remove that entry; edit it to update it.

All content files are public source and are shipped in the website. Store unfinished drafts outside these folders. Plain text bodies are escaped safely and preserve paragraph breaks. Supporting links must use HTTP or HTTPS.

The shared menu remains Home, Badges, Skills, Experience, About, Projects, Labs, Blog, PSudo IT, Contact. Every page uses the responsive shared menu and animated page loader. Existing project, lab, badge and blog `.html` URLs still work.
