import { handleAPI } from "./index.js";
import assets from "../.build/assets.js";
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return handleAPI(request, env);
    if (url.pathname === "/data/content.json")
      return Response.json({ error: "Use /api/content." }, { status: 404 });
    if (!["GET", "HEAD"].includes(request.method))
      return new Response("Method not allowed", { status: 405 });
    const asset =
      assets[url.pathname] ||
      assets[url.pathname.replace(/\/$/, "") + "/index.html"] ||
      assets[url.pathname + ".html"] ||
      (request.headers.get("Sec-Fetch-Mode") === "navigate" ||
      !url.pathname.split("/").pop().includes(".")
        ? assets["/index.html"]
        : null);
    if (!asset) return new Response("Not found", { status: 404 });
    const bytes = Uint8Array.from(atob(asset.data), (c) => c.charCodeAt(0));
    return new Response(request.method === "HEAD" ? null : bytes, {
      headers: {
        "Content-Type": asset.type,
        "Cache-Control": url.pathname.startsWith("/assets/")
          ? "public, max-age=31536000, immutable"
          : "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  },
};
