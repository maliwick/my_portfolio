import seed from "../data/seed.json" with { type: "json" };
const KINDS = ["projects", "labs", "badges", "blog"];
const encoder = new TextEncoder();
const cookieName = "__Host-portfolio-admin";
const json = (data, status = 200, headers = {}) =>
  Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
const fail = (message, status = 400) => {
  const e = new Error(message);
  e.status = status;
  throw e;
};
const random = () =>
  [...crypto.getRandomValues(new Uint8Array(32))]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
const hash = async (value) =>
  [
    ...new Uint8Array(
      await crypto.subtle.digest("SHA-256", encoder.encode(value)),
    ),
  ]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
function requireDB(env) {
  if (!env.DB)
    fail("Connect the portfolio D1 database to enable admin saves.", 503);
}
function sameOrigin(request) {
  if (request.headers.get("Origin") !== new URL(request.url).origin)
    fail("This request must come from the portfolio.", 403);
  if (!request.headers.get("Content-Type")?.startsWith("application/json"))
    fail("Send JSON content.", 415);
}
async function body(request) {
  const text = await request.text();
  if (text.length > 100000) fail("Entry is too large.", 413);
  try {
    const value = JSON.parse(text);
    if (!value || typeof value !== "object" || Array.isArray(value))
      fail("Send a JSON object.");
    return value;
  } catch {
    fail("Invalid JSON.");
  }
}
function authMode(env) {
  return env.AUTH_MODE === "chatgpt" ? "chatgpt" : "password";
}
function configured(env) {
  return (
    !!env.DB &&
    (authMode(env) === "chatgpt"
      ? !!env.ADMIN_EMAIL
      : typeof env.ADMIN_PASSWORD === "string" &&
        env.ADMIN_PASSWORD.length >= 16)
  );
}
async function identity(request, env) {
  if (!configured(env)) return null;
  if (authMode(env) === "chatgpt") {
    const email = request.headers.get("oai-authenticated-user-email");
    return email?.toLowerCase() === env.ADMIN_EMAIL.toLowerCase() &&
      request.headers.get("oai-authenticated-user-id")
      ? { csrf: "site-auth", username: email }
      : null;
  }
  const token = request.headers
    .get("Cookie")
    ?.split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(cookieName + "="))
    ?.slice(cookieName.length + 1);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const session = await env.DB.prepare(
    "SELECT csrf, expires_at FROM admin_sessions WHERE token_hash = ?",
  )
    .bind(await hash(token))
    .first();
  return session && session.expires_at > Date.now()
    ? { csrf: session.csrf, username: env.ADMIN_USERNAME || "admin" }
    : null;
}
async function authorized(request, env, write = false) {
  requireDB(env);
  if (!configured(env)) fail("Admin sign-in has not been configured.", 503);
  const user = await identity(request, env);
  if (!user) fail("Sign in as the admin to continue.", 401);
  if (write) {
    sameOrigin(request);
    if (request.headers.get("X-CSRF-Token") !== user.csrf)
      fail("Your session changed. Reload and try again.", 403);
  }
  return user;
}
function field(value, name, max, required = false) {
  if (
    typeof value !== "string" ||
    value.length > max ||
    (required && !value.trim())
  )
    fail("Invalid " + name + ".");
  return value.trim();
}
export function validateEntry(input, id) {
  if (!input || typeof input !== "object") fail("Invalid entry.");
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id))
    fail("Use a short ID with letters, numbers, hyphens or underscores.");
  const entry = {
    id,
    title: field(input.title, "title", 160, true),
    summary: field(input.summary, "summary", 600, true),
    body: field(input.body ?? "", "write-up", 50000),
    issuer: field(input.issuer ?? "", "issuer", 160),
    author: field(input.author ?? "", "author", 160),
    date: field(input.date ?? "", "date", 10),
    url: field(input.url ?? "", "link", 2048),
    status: input.status,
    sample: input.sample,
    tags: input.tags,
  };
  if (
    !["draft", "published"].includes(entry.status) ||
    typeof entry.sample !== "boolean"
  )
    fail("Invalid visibility or sample flag.");
  if (
    !Array.isArray(entry.tags) ||
    entry.tags.length > 20 ||
    entry.tags.some((v) => typeof v !== "string" || v.length > 60)
  )
    fail("Use up to 20 short tags.");
  entry.tags = [...new Set(entry.tags.map((v) => v.trim()).filter(Boolean))];
  if (entry.date && !/^\d{4}-\d{2}-\d{2}$/.test(entry.date))
    fail("Use a YYYY-MM-DD date.");
  if (entry.url) {
    try {
      const url = new URL(entry.url);
      if (
        !["http:", "https:"].includes(url.protocol) ||
        url.username ||
        url.password
      )
        fail("Use an http or https link.");
    } catch {
      fail("Use an http or https link.");
    }
  }
  return entry;
}
async function initialized(env) {
  return !!(await env.DB.prepare(
    "SELECT value FROM portfolio_settings WHERE key = 'initialized'",
  ).first());
}
async function content(env, admin = false) {
  if (!env.DB || !(await initialized(env)))
    return admin
      ? { entries: [], initialized: false }
      : Object.fromEntries(
          KINDS.map((k) => [
            k,
            (seed[k] || []).filter((v) => v.status === "published"),
          ]),
        );
  const rows = await env.DB.prepare(
    "SELECT kind, payload, revision, updated_at FROM portfolio_entries" +
      (admin ? "" : " WHERE status = 'published'") +
      " ORDER BY updated_at DESC, id",
  ).all();
  const entries = rows.results.map((r) => ({
    ...JSON.parse(r.payload),
    kind: r.kind,
    revision: r.revision,
    updatedAt: r.updated_at,
  }));
  return admin
    ? { entries, initialized: true }
    : Object.fromEntries(
        KINDS.map((k) => [k, entries.filter((v) => v.kind === k)]),
      );
}
async function audit(db, action, kind, id) {
  return db
    .prepare(
      "INSERT INTO admin_audit (action, kind, entry_id, created_at) VALUES (?, ?, ?, ?)",
    )
    .bind(action, kind, id, Date.now());
}
export async function handleAPI(request, env) {
  const url = new URL(request.url),
    path = url.pathname,
    method = request.method;
  try {
    if (path === "/api/content" && method === "GET")
      return json(await content(env));
    if (path === "/api/admin/session" && method === "GET") {
      const user = await identity(request, env);
      return json({
        configured: configured(env),
        authMode: authMode(env),
        authenticated: !!user,
        ...(user ? { username: user.username, csrf: user.csrf } : {}),
      });
    }
    if (path === "/api/admin/login" && method === "POST") {
      requireDB(env);
      if (authMode(env) !== "password") fail("Use the site sign-in link.", 400);
      if (!configured(env))
        fail("Set the admin password secret before signing in.", 503);
      sameOrigin(request);
      const input = await body(request),
        ip = request.headers.get("CF-Connecting-IP") || "local",
        key = await hash(ip),
        now = Date.now();
      const attempt = await env.DB.prepare(
        "INSERT INTO admin_login_attempts (key, attempts, started_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET attempts = CASE WHEN started_at < ? THEN 1 ELSE attempts + 1 END, started_at = CASE WHEN started_at < ? THEN ? ELSE started_at END RETURNING attempts",
      )
        .bind(key, now, now - 900000, now - 900000, now)
        .first();
      if (attempt.attempts > 5)
        fail("Too many sign-in attempts. Try again in 15 minutes.", 429);
      if (
        typeof input.password !== "string" ||
        input.password.length > 256 ||
        input.username !== (env.ADMIN_USERNAME || "admin")
      )
        fail("Invalid username or password.", 401);
      const hmac = await crypto.subtle.importKey(
        "raw",
        encoder.encode(env.ADMIN_PASSWORD),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"],
      );
      const expected = await crypto.subtle.sign(
        "HMAC",
        hmac,
        encoder.encode(env.ADMIN_PASSWORD),
      );
      if (
        !(await crypto.subtle.verify(
          "HMAC",
          hmac,
          expected,
          encoder.encode(input.password),
        ))
      )
        fail("Invalid username or password.", 401);
      const token = random(),
        csrf = random();
      await env.DB.batch([
        env.DB.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?").bind(
          now,
        ),
        env.DB.prepare(
          "INSERT INTO admin_sessions (token_hash, csrf, expires_at) VALUES (?, ?, ?)",
        ).bind(await hash(token), csrf, now + 28800000),
        env.DB.prepare(
          "DELETE FROM admin_login_attempts WHERE key = ? OR started_at < ?",
        ).bind(key, now - 900000),
      ]);
      return json(
        { authenticated: true, csrf, username: input.username },
        200,
        {
          "Set-Cookie": `${cookieName}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=28800`,
        },
      );
    }
    if (path === "/api/admin/logout" && method === "POST") {
      await authorized(request, env, true);
      if (authMode(env) === "password") {
        const token = request.headers
          .get("Cookie")
          .split(";")
          .map((v) => v.trim())
          .find((v) => v.startsWith(cookieName + "="))
          .slice(cookieName.length + 1);
        await env.DB.prepare("DELETE FROM admin_sessions WHERE token_hash = ?")
          .bind(await hash(token))
          .run();
      }
      return json({ ok: true }, 200, {
        "Set-Cookie": `${cookieName}=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0`,
      });
    }
    if (path === "/api/admin/entries" && method === "GET") {
      await authorized(request, env);
      return json(await content(env, true));
    }
    if (path === "/api/admin/audit" && method === "GET") {
      await authorized(request, env);
      return json({
        events: (
          await env.DB.prepare(
            "SELECT action, kind, entry_id, created_at FROM admin_audit ORDER BY id DESC LIMIT 30",
          ).all()
        ).results,
      });
    }
    if (path === "/api/admin/bootstrap" && method === "POST") {
      await authorized(request, env, true);
      if (await initialized(env))
        fail("Existing content has already been imported.", 409);
      const now = Date.now(),
        statements = [];
      for (const kind of KINDS)
        for (const entry of seed[kind] || []) {
          const v = validateEntry(entry, entry.id);
          statements.push(
            env.DB.prepare(
              "INSERT OR IGNORE INTO portfolio_entries (kind, id, payload, status, revision, updated_at) VALUES (?, ?, ?, ?, 1, ?)",
            ).bind(kind, v.id, JSON.stringify(v), v.status, now),
          );
        }
      statements.push(
        env.DB.prepare(
          "INSERT INTO portfolio_settings (key, value) VALUES ('initialized','1')",
        ),
        await audit(env.DB, "import", "all", "seed"),
      );
      await env.DB.batch(statements);
      return json({ ok: true });
    }
    const match = path.match(
      /^\/api\/admin\/entries\/(projects|labs|badges|blog)(?:\/([a-zA-Z0-9_-]{1,80}))?$/,
    );
    if (match && ["POST", "PUT", "DELETE"].includes(method)) {
      await authorized(request, env, true);
      if (!(await initialized(env)))
        fail("Import the existing portfolio before adding entries.", 409);
      const kind = match[1],
        input = await body(request),
        id = match[2] || input.id || crypto.randomUUID();
      if ((method === "POST" && match[2]) || (method !== "POST" && !match[2]))
        fail("Invalid entry URL.", 400);
      if (
        method !== "POST" &&
        (!Number.isInteger(input.revision) || input.revision < 1)
      )
        fail("Reload the entry before changing it.", 409);
      const now = Date.now();
      let statement;
      if (method === "DELETE")
        statement = env.DB.prepare(
          "DELETE FROM portfolio_entries WHERE kind = ? AND id = ? AND revision = ?",
        ).bind(kind, id, input.revision);
      else {
        const v = validateEntry(input, id);
        statement =
          method === "POST"
            ? env.DB.prepare(
                "INSERT OR IGNORE INTO portfolio_entries (kind,id,payload,status,revision,updated_at) VALUES (?,?,?,?,1,?)",
              ).bind(kind, id, JSON.stringify(v), v.status, now)
            : env.DB.prepare(
                "UPDATE portfolio_entries SET payload = ?, status = ?, revision = revision + 1, updated_at = ? WHERE kind = ? AND id = ? AND revision = ?",
              ).bind(
                JSON.stringify(v),
                v.status,
                now,
                kind,
                id,
                input.revision,
              );
      }
      const results = await env.DB.batch([
        statement,
        env.DB.prepare(
          "INSERT INTO admin_audit (action, kind, entry_id, created_at) SELECT ?, ?, ?, ? WHERE changes() > 0",
        ).bind(
          method === "DELETE"
            ? "delete"
            : method === "POST"
              ? "create"
              : "update",
          kind,
          id,
          now,
        ),
      ]);
      const result = results[0];
      if (!result.meta.changes)
        fail(
          "This entry changed in another session or its ID already exists. Reload before trying again.",
          409,
        );
      return json({
        ok: true,
        id,
        revision: method === "POST" ? 1 : input.revision + 1,
      });
    }
    return json({ error: "Endpoint not found." }, 404);
  } catch (e) {
    if (e.status) return json({ error: e.message }, e.status);
    console.error("Portfolio API failed", path, e.message);
    return json(
      {
        error:
          "The database is unavailable or its schema needs setup. Please try again after configuration.",
      },
      503,
    );
  }
}
export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path.startsWith("/api/")) return handleAPI(request, env);
    if (path === "/data/content.json")
      return json({ error: "Use /api/content." }, 404);
    return env.ASSETS.fetch(request);
  },
};
