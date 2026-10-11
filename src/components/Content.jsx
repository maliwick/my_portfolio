import React, { useState } from "react";
import { safeUrl } from "../lib.js";
export function ExternalLink({ url, children }) {
  const href = safeUrl(url);
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : null;
}
export function Sample({ entry }) {
  return entry.sample ? (
    <span className="sample-label">SAMPLE / PLACEHOLDER</span>
  ) : null;
}
export function Tags({ tags }) {
  return (
    <div className="work-tags">
      {tags.map((t, i) => (
        <span key={t + i}>{t}</span>
      ))}
    </div>
  );
}
export function WorkGrid({ items, kind }) {
  return (
    <div className="work-grid">
      {items.length ? (
        items.map((v, i) => (
          <article className="work-card" key={v.id}>
            <span className="work-index">
              {String(i + 1).padStart(2, "0")} /{" "}
              {kind === "labs" ? "LAB PRACTICAL" : "PROJECT"}
            </span>
            <Sample entry={v} />
            <h2>{v.title}</h2>
            <p>{v.summary}</p>
            <Tags tags={v.tags} />
            <a
              href={
                "/work.html?type=" + kind + "&id=" + encodeURIComponent(v.id)
              }
            >
              {kind === "labs" ? "Read write-up ↗" : "Explore project ↗"}
            </a>
          </article>
        ))
      ) : (
        <p className="work-empty">No entries found.</p>
      )}
    </div>
  );
}
export function WorkDetail({ entry, kind, preview = false }) {
  return (
    <article className="work-detail">
      {!preview && <a href={"/" + kind + ".html"}>← Back to {kind}</a>}
      <p className="work-kicker">{kind.toUpperCase()}</p>
      <Sample entry={entry} />
      <h1>{entry.title}</h1>
      <p className="work-lead">{entry.summary}</p>
      <Tags tags={entry.tags} />
      {entry.date && <p>{entry.date}</p>}
      {entry.issuer && <p>{entry.issuer}</p>}
      {entry.body && <div className="writeup">{entry.body}</div>}
      <ExternalLink url={entry.url}>
        {kind === "badges"
          ? "Verify credential ↗"
          : "View source / supporting work ↗"}
      </ExternalLink>
    </article>
  );
}
export function BadgeCarousel({ badges }) {
  const [paused, setPaused] = useState(false);
  const items = badges.filter((v) => v.status === "published");
  const group = (clone) => (
    <div className="badge-group" aria-hidden={clone || undefined}>
      {items.map((v) => (
        <article className="badge-card" key={v.id}>
          <div className="badge-emblem" aria-hidden="true">
            ◇
          </div>
          <Sample entry={v} />
          <strong>{v.title}</strong>
          <small>{v.issuer}</small>
          {safeUrl(v.url) && (
            <a
              href={safeUrl(v.url)}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={clone ? -1 : undefined}
            >
              Verify badge ↗
            </a>
          )}
        </article>
      ))}
    </div>
  );
  return (
    <section className="work-section badge-section" id="badges">
      <div className="work-heading">
        <div>
          <p className="work-kicker">LEARNING MILESTONES</p>
          <h2>Badges & achievements</h2>
          {items.some((v) => v.sample) && (
            <p>
              Sample badges demonstrate the layout. They do not represent earned
              credentials.
            </p>
          )}
        </div>
        {!!items.length && (
          <button
            className="work-button"
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
          >
            {paused ? "Resume motion" : "Pause motion"}
          </button>
        )}
      </div>
      {items.length ? (
        <div
          className="badge-window"
          tabIndex="0"
          aria-label="Badge carousel. Focus or hover to pause."
        >
          <div className={"badge-track" + (paused ? " is-paused" : "")}>
            {group(false)}
            {group(true)}
          </div>
        </div>
      ) : (
        <p>Earned badges will appear here when added.</p>
      )}
    </section>
  );
}
export function MotionButton({ paused, onToggle, reduced }) {
  return (
    <button
      className="background-toggle"
      type="button"
      disabled={reduced}
      aria-pressed={paused || reduced}
      onClick={onToggle}
    >
      {reduced
        ? "Reduced motion enabled"
        : paused
          ? "Resume background"
          : "Pause background"}
    </button>
  );
}
