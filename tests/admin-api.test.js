import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { handleAPI } from "../worker/index.js";
function setup(extra = {}) {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(
    fs.readFileSync(
      new URL(
        "../drizzle/" +
          fs
            .readdirSync(new URL("../drizzle/", import.meta.url))
            .find((v) => v.endsWith(".sql")),
        import.meta.url,
      ),
      "utf8",
    ),
  );
  function prepare(sql) {
    let values = [];
    return {
      bind(...args) {
        values = args;
        return this;
      },
      async first() {
        return sqlite.prepare(sql).get(...values) || null;
      },
      async all() {
        return { results: sqlite.prepare(sql).all(...values) };
      },
      async run() {
        return { meta: sqlite.prepare(sql).run(...values) };
      },
    };
  }
  const env = {
    DB: {
      prepare,
      async batch(statements) {
        sqlite.exec("BEGIN");
        try {
          const result = [];
          for (const s of statements) result.push(await s.run());
          sqlite.exec("COMMIT");
          return result;
        } catch (e) {
          sqlite.exec("ROLLBACK");
          throw e;
        }
      },
    },
    ADMIN_PASSWORD: "test-only-long-password-12345",
    ...extra,
  };
  return { env, sqlite };
}
const origin = "https://portfolio.example";
function request(path, method = "GET", value, auth = {}, extra = {}) {
  return new Request(origin + path, {
    method,
    headers: {
      ...(method !== "GET"
        ? { Origin: origin, "Content-Type": "application/json" }
        : {}),
      ...(auth.cookie
        ? { Cookie: auth.cookie, "X-CSRF-Token": auth.csrf }
        : {}),
      ...extra,
    },
    ...(value !== undefined ? { body: JSON.stringify(value) } : {}),
  });
}
async function login(env) {
  const res = await handleAPI(
    request("/api/admin/login", "POST", {
      username: "admin",
      password: env.ADMIN_PASSWORD,
    }),
    env,
  );
  assert.equal(res.status, 200);
  const data = await res.json();
  const cookie = res.headers.get("Set-Cookie");
  assert(cookie.includes("Secure; HttpOnly; SameSite=Strict"));
  return { cookie: cookie.split(";")[0], csrf: data.csrf };
}
const entry = {
  title: "Private security lab",
  summary: "A test lab entry",
  tags: ["Nmap"],
  body: "Do not leak this draft",
  date: "2026-10-11",
  issuer: "",
  author: "",
  url: "https://example.com",
  status: "draft",
  sample: false,
};
test("admin authentication, origin and CSRF checks protect every write", async () => {
  const { env } = setup();
  assert.equal(
    (await handleAPI(request("/api/admin/entries"), env)).status,
    401,
  );
  assert.equal(
    (await handleAPI(request("/api/admin/bootstrap", "POST", {}), env)).status,
    401,
  );
  const auth = await login(env);
  assert.equal(
    (
      await handleAPI(
        request("/api/admin/bootstrap", "POST", {}, auth, {
          Origin: "https://attacker.example",
        }),
        env,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handleAPI(
        request("/api/admin/bootstrap", "POST", {}, auth, {
          "X-CSRF-Token": "wrong",
        }),
        env,
      )
    ).status,
    403,
  );
  assert.equal(
    (await handleAPI(request("/api/admin/bootstrap", "POST", {}, auth), env))
      .status,
    200,
  );
  assert.equal(
    (await handleAPI(request("/api/admin/bootstrap", "POST", {}, auth), env))
      .status,
    409,
  );
});
test("drafts remain private; all four content types persist, publish, edit and delete", async () => {
  const { env, sqlite } = setup(),
    auth = await login(env);
  await handleAPI(request("/api/admin/bootstrap", "POST", {}, auth), env);
  for (const kind of ["projects", "labs", "badges", "blog"]) {
    const created = await handleAPI(
      request(
        "/api/admin/entries/" + kind,
        "POST",
        { ...entry, id: "private-" + kind },
        auth,
      ),
      env,
    );
    assert.equal(created.status, 200);
    const publicDraft = await (
      await handleAPI(request("/api/content"), env)
    ).json();
    assert(!JSON.stringify(publicDraft).includes("Do not leak this draft"));
    const stored = await (
      await handleAPI(
        request("/api/admin/entries", "GET", undefined, auth),
        env,
      )
    ).json();
    assert(
      stored.entries.some(
        (v) => v.id === "private-" + kind && v.status === "draft",
      ),
    );
    assert.equal(
      (
        await handleAPI(
          request(
            "/api/admin/entries/" + kind + "/private-" + kind,
            "PUT",
            { ...entry, status: "published", revision: 1 },
            auth,
          ),
          env,
        )
      ).status,
      200,
    );
    const published = await (
      await handleAPI(request("/api/content"), env)
    ).json();
    assert(published[kind].some((v) => v.id === "private-" + kind));
    assert.equal(
      (
        await handleAPI(
          request(
            "/api/admin/entries/" + kind + "/private-" + kind,
            "PUT",
            { ...entry, revision: 1 },
            auth,
          ),
          env,
        )
      ).status,
      409,
    );
    assert.equal(
      (
        await handleAPI(
          request(
            "/api/admin/entries/" + kind + "/private-" + kind,
            "DELETE",
            { revision: 2 },
            auth,
          ),
          env,
        )
      ).status,
      200,
    );
    const deleted = await (
      await handleAPI(request("/api/content"), env)
    ).json();
    assert(!deleted[kind].some((v) => v.id === "private-" + kind));
  }
  assert(
    sqlite.prepare("SELECT COUNT(*) AS count FROM admin_audit").get().count >=
      13,
  );
});
test("unsafe content is rejected; expired and revoked sessions cannot edit", async () => {
  const { env, sqlite } = setup(),
    auth = await login(env);
  await handleAPI(request("/api/admin/bootstrap", "POST", {}, auth), env);
  assert.equal(
    (
      await handleAPI(
        request(
          "/api/admin/entries/labs",
          "POST",
          { ...entry, url: "javascript:alert(1)" },
          auth,
        ),
        env,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await handleAPI(
        request(
          "/api/admin/entries/labs",
          "POST",
          { ...entry, tags: Array(21).fill("x") },
          auth,
        ),
        env,
      )
    ).status,
    400,
  );
  assert.equal(
    (await handleAPI(request("/api/admin/logout", "POST", {}, auth), env))
      .status,
    200,
  );
  assert.equal(
    (
      await handleAPI(
        request("/api/admin/entries", "GET", undefined, auth),
        env,
      )
    ).status,
    401,
  );
  const expired = await login(env);
  sqlite.prepare("UPDATE admin_sessions SET expires_at = 1").run();
  assert.equal(
    (
      await handleAPI(
        request("/api/admin/entries", "GET", undefined, expired),
        env,
      )
    ).status,
    401,
  );
});
test("password sign-in is rate limited and secrets never appear in responses", async () => {
  const { env } = setup();
  for (let i = 0; i < 5; i++)
    assert.equal(
      (
        await handleAPI(
          request("/api/admin/login", "POST", {
            username: "admin",
            password: "bad",
          }),
          env,
        )
      ).status,
      401,
    );
  assert.equal(
    (
      await handleAPI(
        request("/api/admin/login", "POST", {
          username: "admin",
          password: env.ADMIN_PASSWORD,
        }),
        env,
      )
    ).status,
    429,
  );
  assert(
    !(
      await (await handleAPI(request("/api/admin/session"), env)).text()
    ).includes(env.ADMIN_PASSWORD),
  );
});
test("preview sign-in authorizes only the owner; Cloudflare ignores spoofed identity headers", async () => {
  const { env } = setup({
    AUTH_MODE: "chatgpt",
    ADMIN_EMAIL: "owner@example.com",
  });
  const headers = {
    "oai-authenticated-user-email": "owner@example.com",
    "oai-authenticated-user-id": "site-user",
  };
  assert.equal(
    (
      await handleAPI(
        request("/api/admin/entries", "GET", undefined, {}, headers),
        env,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await handleAPI(
        request(
          "/api/admin/entries",
          "GET",
          undefined,
          {},
          { ...headers, "oai-authenticated-user-email": "other@example.com" },
        ),
        env,
      )
    ).status,
    401,
  );
  assert.equal(
    (
      await handleAPI(
        request("/api/admin/entries", "GET", undefined, {}, headers),
        { ...env, AUTH_MODE: "password" },
      )
    ).status,
    401,
  );
});
test("public portfolio remains available before database setup and seed deletions never reappear", async () => {
  const fallback = await (await handleAPI(request("/api/content"), {})).json();
  assert.equal(fallback.blog.length, 3);
  const session = await (
    await handleAPI(request("/api/admin/session"), {})
  ).json();
  assert.equal(session.configured, false);
  const { env, sqlite } = setup(),
    auth = await login(env);
  await handleAPI(request("/api/admin/bootstrap", "POST", {}, auth), env);
  const entries = (
    await (
      await handleAPI(
        request("/api/admin/entries", "GET", undefined, auth),
        env,
      )
    ).json()
  ).entries;
  for (const v of entries)
    await handleAPI(
      request(
        "/api/admin/entries/" + v.kind + "/" + v.id,
        "DELETE",
        { revision: v.revision },
        auth,
      ),
      env,
    );
  const empty = await (await handleAPI(request("/api/content"), env)).json();
  assert(Object.values(empty).every((v) => v.length === 0));
  assert.equal(
    sqlite.prepare("SELECT COUNT(*) AS count FROM portfolio_entries").get()
      .count,
    0,
  );
});
