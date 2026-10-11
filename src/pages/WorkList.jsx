import React, { useState } from "react";
import { publicItems } from "../lib.js";
import { WorkGrid } from "../components/Content.jsx";
export default function WorkList({ kind, data }) {
  const [query, setQuery] = useState("");
  const title = kind === "labs" ? "Lab practicals" : "Projects";
  const items = publicItems(data[kind], query);
  return (
    <div className="work-main">
      <p className="work-kicker">MY WORK / {kind.toUpperCase()}</p>
      <h1>
        {title}
        <span>.</span>
      </h1>
      <p className="work-lead">
        {kind === "labs"
          ? "Experiments, evidence, and lessons from authorized security labs."
          : "Applications, academic projects, and the things I build."}
      </p>
      <label className="work-search">
        Search {title.toLowerCase()}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, topic, or tool"
        />
      </label>
      <p role="status">
        {items.length} {title.toLowerCase()}
      </p>
      <WorkGrid items={items} kind={kind} />
    </div>
  );
}
