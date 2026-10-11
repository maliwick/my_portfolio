import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
export const pageAliases = [
  "projects.html",
  "labs.html",
  "work.html",
  "editor.html",
  "blog.html",
  "blog-zero-trust.html",
  "blog-password-security.html",
  "blog-ransomware.html",
  "business/index.html",
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
