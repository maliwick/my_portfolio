import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
export const pageAliases = [
  "projects.html",
  "search.html",
  "badges.html",
  "labs.html",
  "work.html",
  "blog.html",
  "blog-zero-trust.html",
  "blog-password-security.html",
  "blog-ransomware.html",
  "business/index.html",
  ...Object.entries({ labs: "Labs", badges: "Badges", projects: "Projects", blogs: "Blogs" }).flatMap(([url,folder]) => [
    `${url}/index.html`,
    ...fs.readdirSync(`src/pages/${folder}/content`).filter(name => name.endsWith(".json")).map(name => {
      const entry = JSON.parse(fs.readFileSync(`src/pages/${folder}/content/${name}`, "utf8"));
      if (!/^[a-zA-Z0-9_-]+$/.test(entry.id) || name !== entry.id + ".json") throw new Error("Entry ID must match its filename: " + name);
      if (entry.status !== "published") throw new Error("Keep unpublished drafts outside the website source: " + name);
      return `${url}/${entry.id}/index.html`;
    })
  ]),
];
export default defineConfig({
  plugins: [
    react(),
    {
      name: "existing-page-urls",
      closeBundle() {
        const html = fs.readFileSync("dist/index.html", "utf8");
        for (const alias of pageAliases) {
          const target = path.join("dist", alias);
          fs.mkdirSync(path.dirname(target), { recursive: true });
          fs.writeFileSync(target, html);
        }
      },
    },
  ],
  build: { outDir: "dist", emptyOutDir: true },
});
