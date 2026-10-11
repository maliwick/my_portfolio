import React, { useEffect, useState } from "react";
import Icon from "../components/Icon.jsx";
import { WorkDetail } from "../components/Content.jsx";
const categories = {
  projects: "Projects",
  labs: "Labs",
  badges: "Badges",
  blog: "Blog",
};
const blank = (kind) => ({
  kind,
  id: "",
  title: "",
  summary: "",
  body: "",
  tags: "",
  date: "",
  issuer: "",
  author: "",
  url: "",
  sample: false,
  status: "draft",
});
async function api(path, options = {}) {
  const response = await fetch("/api/admin/" + path, {
    credentials: "same-origin",
    cache: "no-store",
    ...options,
  });
  const data = await response
    .json()
    .catch(() => ({
      error:
        "The admin API is not available on this host. Complete the database setup to enable the dashboard.",
    }));
  if (!response.ok || data.error) {
    const e = new Error(data.error || "Request failed.");
    e.status = response.status;
    throw e;
  }
  return data;
}
export default function Admin({ onPublished }) {
  const [session, setSession] = useState(null),
    [entries, setEntries] = useState([]),
    [initialized, setInitialized] = useState(false),
    [audit, setAudit] = useState([]);
  const [kind, setKind] = useState("projects"),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all"),
    [form, setForm] = useState(() => blank("projects")),
    [selected, setSelected] = useState(null),
    [dirty, setDirty] = useState(false),
    [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [username, setUsername] = useState("admin"),
    [password, setPassword] = useState("");
  const mutate = (path, method, value = {}) =>
    api(path, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": session.csrf,
      },
      body: JSON.stringify(value),
    });
  async function refresh() {
    const [data, history] = await Promise.all([api("entries"), api("audit")]);
    setEntries(data.entries);
    setInitialized(data.initialized);
    setAudit(history.events);
    return data;
  }
  useEffect(() => {
    let active = true;
    api("session")
      .then(async (s) => {
        if (!active) return;
        setSession(s);
        if (s.authenticated) {
          const [data, history] = await Promise.all([
            api("entries"),
            api("audit"),
          ]);
          if (active) {
            setEntries(data.entries);
            setInitialized(data.initialized);
            setAudit(history.events);
          }
        }
      })
      .catch((e) => {
        if (active) {
          setError(e.message);
          setSession({ configured: false, authenticated: false });
        }
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const leave = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const link = (e) => {
      if (e.defaultPrevented || !e.target?.closest?.("a[href]")) return;
      if (!confirm("Discard your unsaved entry changes?")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", leave);
    document.addEventListener("click", link, true);
    return () => {
      window.removeEventListener("beforeunload", leave);
      document.removeEventListener("click", link, true);
    };
  }, [dirty]);
  function reset(nextKind = kind) {
    if (dirty && !confirm("Discard your unsaved entry changes?")) return false;
    setKind(nextKind);
    setForm(blank(nextKind));
    setSelected(null);
    setDirty(false);
    setPreview(false);
    setNotice("");
    return true;
  }
  function pick(entry) {
    if (dirty && !confirm("Discard your unsaved entry changes?")) return;
    setForm({ ...blank(entry.kind), ...entry, tags: entry.tags.join(", ") });
    setSelected(entry);
    setKind(entry.kind);
    setDirty(false);
    setPreview(false);
    setNotice("");
  }
  function change(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
    setPreview(false);
  }
  function entryData() {
    return {
      ...form,
      tags: form.tags
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
      revision: selected?.revision,
    };
  }
  async function action(fn) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
    } catch (e) {
      setError(e.message);
      if (e.status === 401) setSession((s) => ({ ...s, authenticated: false }));
    } finally {
      setBusy(false);
    }
  }
  async function save(e) {
    e.preventDefault();
    await action(async () => {
      const data = entryData();
      const result = await mutate(
        "entries/" + kind + (selected ? "/" + selected.id : ""),
        selected ? "PUT" : "POST",
        data,
      );
      const next = await refresh();
      const saved = next.entries.find(
        (v) => v.kind === kind && v.id === result.id,
      );
      setSelected(saved);
      setForm({ ...saved, tags: saved.tags.join(", ") });
      setDirty(false);
      setPreview(false);
      setNotice(
        saved.status === "published"
          ? "Published. Visitors can see this entry now."
          : "Draft saved privately.",
      );
      await onPublished();
    });
  }
  async function login(e) {
    e.preventDefault();
    await action(async () => {
      const s = await api("login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      setPassword("");
      setSession({ ...s, configured: true, authMode: "password" });
      await refresh();
    });
  }
  const visible = entries.filter(
    (v) =>
      v.kind === kind &&
      (filter === "all" || v.status === filter) &&
      (v.title + " " + v.summary + " " + v.tags.join(" "))
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  if (!session)
    return (
      <div className="admin-page">
        <p role="status">Checking admin access…</p>
      </div>
    );
  if (!session.authenticated)
    return (
      <div className="admin-page admin-login">
        <p className="work-kicker">PRIVATE WORKSPACE</p>
        <h1>Admin sign-in</h1>
        <p>
          Manage portfolio content. Visitors can browse and search without an
          account.
        </p>
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
        {!session.configured ? (
          <div className="admin-setup">
            <h2>One-time setup required</h2>
            <p>
              Connect the D1 database, apply the migration and configure admin
              access. Until setup is complete, the public portfolio remains
              available and admin writes stay disabled.
            </p>
            <a
              href="https://github.com/maliwick/my_portfolio/blob/main/ADMIN_SETUP.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open setup instructions <Icon />
            </a>
          </div>
        ) : session.authMode === "chatgpt" ? (
          <a
            className="work-button"
            href="/signin-with-chatgpt?returnTo=%2Fadmin.html"
            target="_top"
          >
            Sign in with ChatGPT
          </a>
        ) : (
          <form onSubmit={login}>
            <label>
              Username
              <input
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                maxLength="80"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength="256"
              />
            </label>
            <button disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          </form>
        )}
        <a href="/index.html">← Back to the public portfolio</a>
      </div>
    );
  return (
    <div className="admin-page">
      <header className="admin-heading">
        <div>
          <p className="work-kicker">PRIVATE WORKSPACE</p>
          <h1>Portfolio dashboard</h1>
          <p>
            Welcome, {session.username}. Save drafts privately or publish to
            your portfolio.
          </p>
        </div>
        <div className="admin-actions">
          <a className="work-button" href="/search.html">
            View public portfolio <Icon />
          </a>
          <button
            disabled={busy || !initialized}
            onClick={() => {
              const groups = { projects: [], labs: [], badges: [], blog: [] };
              for (const entry of entries) groups[entry.kind].push(entry);
              const link = document.createElement("a");
              link.href = URL.createObjectURL(
                new Blob([JSON.stringify(groups, null, 2)], {
                  type: "application/json",
                }),
              );
              link.download = "portfolio-backup.json";
              link.click();
              setTimeout(() => URL.revokeObjectURL(link.href), 1000);
            }}
          >
            Download backup
          </button>
          {session.authMode === "chatgpt" ? (
            <a
              href="/signout-with-chatgpt?returnTo=%2Fadmin.html"
              target="_top"
            >
              Sign out
            </a>
          ) : (
            <button
              disabled={busy}
              onClick={() => {
                if (
                  dirty &&
                  !confirm("Discard your unsaved changes and sign out?")
                )
                  return;
                action(async () => {
                  await mutate("logout", "POST");
                  setDirty(false);
                  setEntries([]);
                  setSession((s) => ({ ...s, authenticated: false }));
                });
              }}
            >
              Sign out
            </button>
          )}
        </div>
      </header>
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      )}
      <div className="admin-stats">
        {Object.entries(categories).map(([key, label]) => (
          <div key={key}>
            <span>{label}</span>
            <strong>{entries.filter((v) => v.kind === key).length}</strong>
            <small>
              {
                entries.filter(
                  (v) => v.kind === key && v.status === "published",
                ).length
              }{" "}
              published ·{" "}
              {
                entries.filter((v) => v.kind === key && v.status === "draft")
                  .length
              }{" "}
              drafts
            </small>
          </div>
        ))}
      </div>
      {!initialized ? (
        <section className="admin-setup">
          <h2>Bring your existing portfolio into the database</h2>
          <p>
            Import the current projects, labs, badges and three blog articles
            once. After that, edits and publishing save directly to the
            database.
          </p>
          <button
            disabled={busy}
            onClick={() =>
              action(async () => {
                await mutate("bootstrap", "POST");
                await refresh();
                await onPublished();
                setNotice(
                  "Existing content imported. Your dashboard is ready.",
                );
              })
            }
          >
            {busy ? "Importing…" : "Import existing portfolio"}
          </button>
        </section>
      ) : (
        <>
          <div className="admin-layout">
            <aside className="admin-sidebar">
              <nav aria-label="Admin content categories">
                {Object.entries(categories).map(([key, label]) => (
                  <button
                    type="button"
                    key={key}
                    aria-pressed={kind === key}
                    disabled={busy}
                    onClick={() => reset(key)}
                  >
                    <Icon
                      name={
                        key === "blog"
                          ? "book"
                          : key === "projects"
                            ? "code"
                            : "shield"
                      }
                    />
                    {label}
                    <span>{entries.filter((v) => v.kind === key).length}</span>
                  </button>
                ))}
              </nav>
              <p>
                Draft entries are visible only to the admin. Published entries
                appear to visitors immediately.
              </p>
            </aside>
            <div className="admin-content">
              <section className="admin-list">
                <div className="admin-section-heading">
                  <h2>{categories[kind]}</h2>
                  <button type="button" disabled={busy} onClick={() => reset()}>
                    + New entry
                  </button>
                </div>
                <div className="admin-filters">
                  <label>
                    Search entries
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Title, topic or tool"
                    />
                  </label>
                  <label>
                    Visibility
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">All entries</option>
                      <option value="published">Published</option>
                      <option value="draft">Drafts</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      if (
                        dirty &&
                        !confirm(
                          "Reload entries? Unsaved form changes will be kept.",
                        )
                      )
                        return;
                      action(async () => {
                        await refresh();
                        setNotice(
                          "Entry list refreshed. Reselect an entry to load its latest version.",
                        );
                      });
                    }}
                  >
                    Refresh list
                  </button>
                </div>
                <div className="admin-entry-list">
                  {visible.map((v) => (
                    <button
                      type="button"
                      key={v.id}
                      disabled={busy}
                      aria-pressed={
                        selected?.id === v.id && selected?.kind === v.kind
                      }
                      onClick={() => pick(v)}
                    >
                      <span>
                        <strong>{v.title}</strong>
                        <small>
                          {v.date || "No date"} · Updated{" "}
                          {new Date(v.updatedAt).toLocaleDateString()}
                        </small>
                      </span>
                      <span className={"admin-status " + v.status}>
                        {v.status}
                      </span>
                    </button>
                  ))}
                  {!visible.length && (
                    <p>No entries match. Create a new entry to get started.</p>
                  )}
                </div>
              </section>
              <section className="admin-editor">
                <div className="admin-section-heading">
                  <h2>
                    {selected
                      ? "Edit entry"
                      : "New " +
                        categories[kind].toLowerCase().replace(/s$/, "") +
                        " entry"}
                  </h2>
                  <span>
                    {dirty
                      ? "Unsaved changes"
                      : selected
                        ? "Saved"
                        : "New draft"}
                  </span>
                </div>
                <form onSubmit={save}>
                  <fieldset disabled={busy}>
                    <div className="admin-form-grid">
                      <label>
                        Title
                        <input
                          required
                          maxLength="160"
                          value={form.title}
                          onChange={(e) => change("title", e.target.value)}
                        />
                      </label>
                      <label>
                        Visibility
                        <select
                          value={form.status}
                          onChange={(e) => change("status", e.target.value)}
                        >
                          <option value="draft">Draft — admin only</option>
                          <option value="published">Published — public</option>
                        </select>
                      </label>
                      <label className="admin-wide">
                        Short description
                        <textarea
                          required
                          maxLength="600"
                          rows="3"
                          value={form.summary}
                          onChange={(e) => change("summary", e.target.value)}
                        />
                      </label>
                      <label>
                        Topics / tools
                        <input
                          maxLength="1200"
                          value={form.tags}
                          onChange={(e) => change("tags", e.target.value)}
                          placeholder="Comma-separated tags"
                        />
                      </label>
                      <label>
                        Date
                        <input
                          type="date"
                          value={form.date}
                          onChange={(e) => change("date", e.target.value)}
                        />
                      </label>
                      {kind === "badges" && (
                        <label>
                          Issuer
                          <input
                            maxLength="160"
                            value={form.issuer}
                            onChange={(e) => change("issuer", e.target.value)}
                          />
                        </label>
                      )}
                      {kind === "blog" && (
                        <label>
                          Author
                          <input
                            maxLength="160"
                            value={form.author}
                            onChange={(e) => change("author", e.target.value)}
                          />
                        </label>
                      )}
                      <label className="admin-wide">
                        Supporting / verification link
                        <input
                          type="url"
                          maxLength="2048"
                          value={form.url}
                          onChange={(e) => change("url", e.target.value)}
                          placeholder="https://…"
                        />
                      </label>
                      <label className="admin-wide">
                        Full content / write-up
                        <textarea
                          maxLength="50000"
                          rows="14"
                          value={form.body}
                          onChange={(e) => change("body", e.target.value)}
                          placeholder="Write your article, lab evidence, findings, lessons or project details. Plain text with line breaks."
                        />
                      </label>
                      <label className="admin-wide admin-check">
                        <input
                          type="checkbox"
                          checked={form.sample}
                          onChange={(e) => change("sample", e.target.checked)}
                        />
                        Sample / placeholder
                      </label>
                    </div>
                    <div className="admin-actions">
                      <button type="submit">
                        {busy
                          ? "Saving…"
                          : form.status === "published"
                            ? "Save & publish"
                            : "Save private draft"}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e.currentTarget.form.reportValidity())
                            setPreview(!preview);
                        }}
                      >
                        Preview
                      </button>
                      {selected && (
                        <button
                          className="admin-danger"
                          type="button"
                          onClick={() => {
                            if (
                              !confirm(
                                "Delete “" +
                                  selected.title +
                                  "”? This removes it from the portfolio and cannot be undone.",
                              )
                            )
                              return;
                            action(async () => {
                              await mutate(
                                "entries/" + kind + "/" + selected.id,
                                "DELETE",
                                { revision: selected.revision },
                              );
                              setDirty(false);
                              setSelected(null);
                              setForm(blank(kind));
                              setPreview(false);
                              await refresh();
                              await onPublished();
                              setNotice("Entry deleted.");
                            });
                          }}
                        >
                          Delete entry
                        </button>
                      )}
                    </div>
                  </fieldset>
                </form>
                {preview && (
                  <div className="admin-preview">
                    <WorkDetail entry={entryData()} kind={kind} preview />
                  </div>
                )}
              </section>
            </div>
          </div>
          <section className="admin-history">
            <h2>Recent activity</h2>
            {audit.length ? (
              <ul>
                {audit.slice(0, 12).map((event, i) => (
                  <li key={i}>
                    <span>
                      {event.action} · {event.kind} · {event.entry_id}
                    </span>
                    <time>{new Date(event.created_at).toLocaleString()}</time>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No changes recorded yet.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
