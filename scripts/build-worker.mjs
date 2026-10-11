import fs from "node:fs";
import path from "node:path";
import { build } from "vite";
// The Sites deployment is one Worker module; embed this project's built static assets.
// Cloudflare Workers Builds uses the native ASSETS binding instead.
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};
const assets = {};
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || (dir === "dist" && entry.name === "server")) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else {
      const relative = path.relative("dist", file).split(path.sep).join("/");
      assets["/" + relative] = {
        data: fs.readFileSync(file).toString("base64"),
        type: types[path.extname(file)] || "application/octet-stream",
      };
    }
  }
}
walk("dist");
fs.mkdirSync(".build", { recursive: true });
fs.writeFileSync(
  ".build/assets.js",
  "export default " + JSON.stringify(assets) + ";\n",
);
await build({
  configFile: false,
  plugins: [],
  build: {
    ssr: "worker/sites.js",
    outDir: "dist/server",
    emptyOutDir: true,
    minify: true,
    rollupOptions: { output: { entryFileNames: "index.js", format: "es" } },
  },
});
if (fs.existsSync(".openai/hosting.json")) {
  fs.mkdirSync("dist/.openai", { recursive: true });
  fs.copyFileSync(".openai/hosting.json", "dist/.openai/hosting.json");
}
