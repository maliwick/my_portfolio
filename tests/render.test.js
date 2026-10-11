import test, { after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
after(() => server.close());
const content = JSON.parse(
  fs.readFileSync(new URL("../public/data/content.json", import.meta.url)),
);
test("shared navigation renders complete desktop and sidebar links", async () => {
  const { default: Navigation } = await server.ssrLoadModule(
    "/src/components/Navigation.jsx",
  );
  const html = renderToStaticMarkup(
    React.createElement(Navigation, {
      url: new URL("https://example.com/labs.html"),
    }),
  );
  assert.equal((html.match(/href="\/labs.html"/g) || []).length, 2);
  assert.equal((html.match(/aria-current="page"/g) || []).length, 2);
  assert(html.includes('aria-controls="site-drawer"'));
  assert(html.includes("Skip to content"));
});
test("homepage preserves sections, badge samples, and motion controls", async () => {
  const { default: Home } = await server.ssrLoadModule("/src/pages/Home.jsx");
  const html = renderToStaticMarkup(
    React.createElement(Home, {
      data: content,
      paused: false,
      reduced: false,
      onToggle() {},
    }),
  );
  for (const id of [
    "home",
    "about",
    "skills",
    "projects",
    "badges",
    "experience",
    "contact",
  ])
    assert(html.includes('id="' + id + '"'));
  assert(html.includes("Pause background"));
  assert(html.includes("/projects.html"));
  assert(html.includes("SAMPLE / PLACEHOLDER"));
  assert(!/<a[^>]*><button/.test(html));
});
test("business and all blog articles render as React pages", async () => {
  const { default: Business } = await server.ssrLoadModule(
    "/src/pages/Business.jsx",
  );
  const html = renderToStaticMarkup(React.createElement(Business));
  assert(html.includes("COMING SOON"));
  assert(html.includes("inquiry-email"));
  assert(html.includes("Prepare email"));
  const blogs = await server.ssrLoadModule("/src/pages/Blog.jsx");
  for (const name of [
    "BlogIndex",
    "BlogZeroTrust",
    "BlogPasswordSecurity",
    "BlogRansomware",
  ])
    assert(
      renderToStaticMarkup(React.createElement(blogs[name])).length > 1000,
    );
});
test("content is escaped and editor retains export and publishing instructions", async () => {
  const { WorkDetail } = await server.ssrLoadModule(
    "/src/components/Content.jsx",
  );
  const malicious = {
    ...content.labs[0],
    title: "<script>alert(1)</script>",
    body: "<img src=x onerror=alert(1)>",
  };
  const html = renderToStaticMarkup(
    React.createElement(WorkDetail, { entry: malicious, kind: "labs" }),
  );
  assert(!html.includes("<script>"));
  assert(html.includes("&lt;script&gt;"));
  const { default: Editor } = await server.ssrLoadModule(
    "/src/pages/Editor.jsx",
  );
  const editor = renderToStaticMarkup(
    React.createElement(Editor, { published: content }),
  );
  assert(editor.includes("public/data/content.json"));
  assert(editor.includes("Download content.json"));
});

test("initial visit shows an accessible loader and makes the page inert", async () => {
  const previousLocation = globalThis.location,
    previousMedia = globalThis.matchMedia;
  globalThis.location = { href: "https://example.com/index.html" };
  globalThis.matchMedia = () => ({ matches: false });
  try {
    const { default: App } = await server.ssrLoadModule("/src/App.jsx");
    const html = renderToStaticMarkup(React.createElement(App));
    assert(html.includes('aria-label="Loading portfolio"'));
    assert(html.includes('id="site-shell" inert="" aria-busy="true"'));
    assert(html.includes("loading-emblem"));
    const entry = fs.readFileSync(
      new URL("../index.html", import.meta.url),
      "utf8",
    );
    assert(entry.includes('id="boot-loader"'));
    assert(/<noscript\s*>/.test(entry));
  } finally {
    globalThis.location = previousLocation;
    globalThis.matchMedia = previousMedia;
  }
});
