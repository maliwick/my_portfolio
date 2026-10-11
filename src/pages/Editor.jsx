import React, { useState } from "react";
import { groups, draftKey, validateContent, loadContent } from "../lib.js";
import { WorkDetail } from "../components/Content.jsx";
const empty = () => ({
  kind: "projects",
  id: "",
  title: "",
  summary: "",
  tags: "",
  date: "",
  issuer: "",
  url: "",
  body: "",
  status: "draft",
  sample: false,
});
export default function Editor({ published }) {
  const [data, setData] = useState(() => {
    try {
      return validateContent(JSON.parse(localStorage.getItem(draftKey)));
    } catch {
      return structuredClone(published);
    }
  });
  const [form, setForm] = useState(empty),
    [selected, setSelected] = useState(null),
    [status, setStatus] = useState(
      "Drafts stay on this device until exported and committed.",
    ),
    [preview, setPreview] = useState(null);
  function store(next) {
    setData(next);
    try {
      localStorage.setItem(draftKey, JSON.stringify(next));
      setStatus(
        "Saved on this device. Download and commit content.json to publish.",
      );
    } catch {
      setStatus(
        "Browser storage is unavailable. Download content.json to keep your saved entries.",
      );
    }
  }
  function reset() {
    setSelected(null);
    setForm(empty());
    setPreview(null);
  }
  function pick(kind, v) {
    setSelected({ kind, id: v.id });
    setForm({ ...empty(), ...v, kind, tags: v.tags.join(", ") });
    setPreview(null);
  }
  function read() {
    const v = {
      ...form,
      id: form.id || "entry-" + crypto.randomUUID(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    delete v.kind;
    v.title = v.title.trim();
    v.summary = v.summary.trim();
    try {
      validateContent({ projects: [], labs: [], badges: [v] });
      return v;
    } catch (e) {
      setStatus(e.message);
      return null;
    }
  }
  function save(e) {
    e.preventDefault();
    const v = read();
    if (!v) return;
    const next = structuredClone(data);
    if (selected)
      next[selected.kind] = next[selected.kind].filter(
        (x) => x.id !== selected.id,
      );
    next[form.kind].push(v);
    try {
      validateContent(next);
    } catch (err) {
      setStatus(err.message);
      return;
    }
    store(next);
    setSelected({ kind: form.kind, id: v.id });
    setForm({ ...form, id: v.id });
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2) + "\n"], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(
      "Downloaded saved entries. Replace public/data/content.json and commit through GitHub.",
    );
  }
  async function importFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const next = validateContent(JSON.parse(await file.text()));
      store(next);
      reset();
    } catch (err) {
      setStatus("Import failed: " + err.message);
    }
    e.target.value = "";
  }
  function field(name, label, type = "text") {
    return (
      <label key={name}>
        {label}
        <input
          name={name}
          type={type}
          value={form[name]}
          required={name === "title"}
          maxLength={name === "title" ? 160 : undefined}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        />
      </label>
    );
  }
  return (
    <div className="work-main">
      <p className="work-kicker">OWNER WORKSPACE</p>
      <h1>
        Publish your work<span>.</span>
      </h1>
      <p className="work-lead">
        Prepare projects, lab reports, and badges here. Publishing requires your
        GitHub account; the editor saves drafts in your browser.
      </p>
      <div className="editor-guide">
        <h2>From draft to published</h2>
        <ol>
          <li>Create or edit an entry below. Preview and save it.</li>
          <li>
            Download <strong>content.json</strong>.
          </li>
          <li>
            Replace <strong>public/data/content.json</strong> in{" "}
            <a
              href="https://github.com/maliwick/my_portfolio/tree/main/public/data"
              target="_blank"
              rel="noopener noreferrer"
            >
              your GitHub repository
            </a>{" "}
            and commit.
          </li>
          <li>
            Your connected host builds and deploys the commit. The private
            ChatGPT preview needs a separate refresh.
          </li>
        </ol>
        <p>
          GitHub login controls publishing. This editor is public and cannot
          write to the server. Draft visibility hides entries from the
          interface; keep private information out of the public content file.
        </p>
      </div>
      <div className="editor-toolbar">
        <button type="button" onClick={reset}>
          New entry
        </button>
        <button type="button" onClick={download}>
          Download content.json
        </button>
        <label>
          Import content.json
          <input
            type="file"
            accept=".json,application/json"
            onChange={importFile}
          />
        </label>
        <button
          type="button"
          onClick={async () => {
            if (!confirm("Replace browser drafts with published content?"))
              return;
            try {
              store(await loadContent());
              reset();
            } catch (e) {
              setStatus(e.message);
            }
          }}
        >
          Reload published content
        </button>
      </div>
      <p role="status">{status}</p>
      <div className="editor-layout">
        <aside aria-label="Content entries">
          {groups.map((kind) => (
            <React.Fragment key={kind}>
              <h3>{kind}</h3>
              {data[kind].map((v) => (
                <button
                  type="button"
                  key={v.id}
                  onClick={() => pick(kind, v)}
                  aria-pressed={
                    selected?.kind === kind && selected?.id === v.id
                  }
                >
                  {v.title} · {v.status}
                </button>
              ))}
            </React.Fragment>
          ))}
        </aside>
        <form onSubmit={save}>
          <label>
            Content type
            <select
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value })}
            >
              {groups.map((k) => (
                <option value={k} key={k}>
                  {k === "labs"
                    ? "Lab practical"
                    : k === "badges"
                      ? "Badge"
                      : "Project"}
                </option>
              ))}
            </select>
          </label>
          {field("title", "Title")}
          <label>
            Short description
            <textarea
              required
              maxLength="600"
              rows="3"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </label>
          {field("tags", "Topics / tools (comma separated)")}
          {field("date", "Date", "date")}
          {field("issuer", "Issuer (for badges)")}
          {field("url", "Project or credential verification URL", "url")}
          <label>
            Full write-up
            <textarea
              rows="12"
              value={form.body}
              placeholder="Objective, tools, method, evidence, results, remediation, lessons…"
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </label>
          <label>
            Visibility
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="draft">Draft — hidden from visitors</option>
              <option value="published">
                Published — visible after GitHub commit
              </option>
            </select>
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={form.sample}
              onChange={(e) => setForm({ ...form, sample: e.target.checked })}
            />
            Sample / placeholder (not an earned credential)
          </label>
          <div className="editor-toolbar">
            <button type="submit">Save browser draft</button>
            <button
              type="button"
              onClick={(e) => {
                if (!e.currentTarget.form.reportValidity()) return;
                const v = read();
                if (v) setPreview({ entry: v, kind: form.kind });
              }}
            >
              Preview entry
            </button>
            <button
              type="button"
              disabled={!selected}
              onClick={() => {
                if (!confirm("Remove this entry from your browser draft?"))
                  return;
                const next = structuredClone(data);
                next[selected.kind] = next[selected.kind].filter(
                  (v) => v.id !== selected.id,
                );
                store(next);
                reset();
              }}
            >
              Delete entry
            </button>
          </div>
        </form>
      </div>
      <section aria-live="polite">
        {preview && <WorkDetail {...preview} preview />}
      </section>
    </div>
  );
}
