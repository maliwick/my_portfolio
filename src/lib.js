export const groups = ["projects", "labs", "badges"];
export const draftKey = "malinga-content-drafts-v1";
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
    throw new Error("The file must contain projects, labs, and badges arrays.");
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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const r = await fetch("/data/content.json", {
      cache: "no-cache",
      signal: controller.signal,
    });
    if (!r.ok) throw new Error("Content could not be loaded.");
    return validateContent(await r.json());
  } catch (error) {
    if (controller.signal.aborted)
      throw new Error("Content loading timed out. Please retry.");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
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
    "/editor": "editor",
    "/editor.html": "editor",
    "/business": "business",
    "/business/index.html": "business",
    "/blog": "blog",
    "/blog.html": "blog",
    "/blog-zero-trust.html": "zero-trust",
    "/blog-password-security.html": "password-security",
    "/blog-ransomware.html": "ransomware",
    "/work.html": "detail",
  };
  return {
    page: aliases[path] || "not-found",
    params: new URLSearchParams(search),
  };
}
