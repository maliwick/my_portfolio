import React, { useState } from "react";
import { groups, publicItems, entryUrl } from "../lib.js";
import { Tags, Sample } from "../components/Content.jsx";
export default function Search({ data }) {
  const [query, setQuery] = useState(""),
    [kind, setKind] = useState("all");
  const entries = groups
    .filter((k) => kind === "all" || kind === k)
    .flatMap((k) =>
      publicItems(data[k], query).map((v) => ({ ...v, kind: k })),
    );
  return (
    <div className="work-main public-search">
      <p className="work-kicker">EXPLORE THE PORTFOLIO</p>
      <h1>Find my work.</h1>
      <p className="work-lead">
        Browse projects, lab practicals, badges and blog articles.
      </p>
      <div className="search-filters">
        <label>
          Search portfolio
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, topic or tool"
          />
        </label>
        <label>
          Content type
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="all">Everything</option>
            {groups.map((k) => (
              <option key={k} value={k}>
                {k === "labs"
                  ? "Labs"
                  : k === "blog"
                    ? "Blog"
                    : k === "badges"
                      ? "Badges"
                      : "Projects"}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p role="status">{entries.length} results</p>
      <div className="work-grid">
        {entries.map((v) => (
          <article className="work-card" key={v.kind + v.id}>
            <p className="work-kicker">{v.kind}</p>
            <Sample entry={v} />
            <h2>{v.title}</h2>
            <p>{v.summary}</p>
            <Tags tags={v.tags} />
            <a
              href={
                entryUrl(v.kind, v.id)
              }
            >
              Read more ↗
            </a>
          </article>
        ))}
        {!entries.length && (
          <p>No matches. Try another topic or show all content types.</p>
        )}
      </div>
    </div>
  );
}
