export const groups = ["projects", "labs", "badges", "blog"];
export function safeUrl(value) {
  try {
    const u = new URL(value);
    return ["https:", "http:"].includes(u.protocol) ? u.href : null;
  } catch {
    return null;
  }
}
export function validateContent(data) {
  if (!data || groups.some((k) => !Array.isArray(data[k])))
    throw new Error(
      "The file must contain projects, labs, badges, and blog arrays.",
    );
  for (const k of groups) {
    const ids = new Set();
    for (const v of data[k]) {
      if (
        !v ||
        typeof v.id !== "string" ||
        !v.id ||
        ids.has(v.id) ||
        typeof v.title !== "string" ||
        !v.title.trim() ||
        typeof v.summary !== "string" ||
        !Array.isArray(v.tags) ||
        v.tags.some((t) => typeof t !== "string") ||
        !["draft", "published"].includes(v.status) ||
        typeof v.sample !== "boolean"
      )
        throw new Error("Invalid or duplicate entry in " + k + ".");
      ids.add(v.id);
      for (const f of ["body", "issuer", "date", "url"])
        if (v[f] !== undefined && typeof v[f] !== "string")
          throw new Error("Invalid " + f + " field.");
      if (v.url && !safeUrl(v.url))
        throw new Error("Use an http or https link.");
    }
  }
  return data;
}
export async function loadContent() {
  const { default: content } = await import("./content.js");
  return validateContent(content);
}
export const categoryUrl = (kind) => "/" + (kind === "blog" ? "blogs" : kind) + "/";
export const entryUrl = (kind, id) => categoryUrl(kind) + encodeURIComponent(id) + "/";
export function publicItems(items, query = "") {
  const q = query.toLowerCase();
  return items.filter(
    (v) =>
      v.status === "published" &&
      (v.title + " " + v.summary + " " + v.tags.join(" "))
        .toLowerCase()
        .includes(q),
  );
}
export function resolveRoute(pathname, search = "") {
  const path = pathname.replace(/\/$/, "") || "/";
  const aliases = {
    "/": "home",
    "/index.html": "home",
    "/projects": "projects",
    "/projects.html": "projects",
    "/labs": "labs",
    "/labs.html": "labs",
    "/search": "search",
    "/search.html": "search",
    "/badges": "badges",
    "/badges.html": "badges",
    "/business": "business",
    "/business/index.html": "business",
    "/blog": "blog",
    "/blog.html": "blog",
    "/blog-zero-trust.html": "zero-trust",
    "/blog-password-security.html": "password-security",
    "/blog-ransomware.html": "ransomware",
    "/work.html": "detail",
    "/work": "detail",
    "/blog-zero-trust": "zero-trust",
    "/blog-password-security": "password-security",
    "/blog-ransomware": "ransomware",
  };
  const nested = path.match(/^\/(labs|badges|projects|blogs)(?:\/(.*))?$/);
  if (nested) {
    const kind = nested[1] === "blogs" ? "blog" : nested[1];
    const slug = (nested[2] || "").replace(/\/index\.html$/, "");
    if (!slug || slug === "index.html") return { page: kind, params: new URLSearchParams(search) };
    if (/^[a-zA-Z0-9_-]+$/.test(slug)) return { page: "detail", params: new URLSearchParams({type:kind,id:slug}) };
  }
  return {
    page: aliases[path] || "not-found",
    params: new URLSearchParams(search),
  };
}
