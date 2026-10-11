import React, { useCallback, useEffect, useState } from "react";
import { useMedia, useRoute } from "./hooks.js";
import { loadContent, resolveRoute, groups } from "./lib.js";
import LoadingScreen from "./components/LoadingScreen.jsx";
import Navigation from "./components/Navigation.jsx";
import Background from "./components/Background.jsx";
import Cursor from "./components/Cursor.jsx";
import { WorkDetail } from "./components/Content.jsx";
import Home from "./pages/Home.jsx";
import Business from "./pages/Business.jsx";
import WorkList from "./pages/WorkList.jsx";
import Editor from "./pages/Editor.jsx";
import {
  BlogIndex,
  BlogZeroTrust,
  BlogPasswordSecurity,
  BlogRansomware,
} from "./pages/Blog.jsx";
const titles = {
  home: "Malinga Portfolio",
  projects: "Projects",
  labs: "Lab practicals",
  business: "PSudo IT Solution",
  editor: "Content editor",
  blog: "Cybersecurity Blog",
  "zero-trust": "Zero-Trust Security",
  "password-security": "Password Security",
  ransomware: "Ransomware Prevention",
  detail: "Work detail",
  "not-found": "Page not found",
};
export default function App() {
  const url = useRoute(),
    route = resolveRoute(url.pathname, url.search),
    [data, setData] = useState(null),
    [loadedPage, setLoadedPage] = useState(null),
    [settled, setSettled] = useState(false),
    [error, setError] = useState(""),
    [paused, setPaused] = useState(false),
    reduced = useMedia("(prefers-reduced-motion: reduce)");
  const pageKey = url.pathname + url.search;
  const loading = loadedPage !== pageKey;
  const finishLoading = useCallback(() => {
    setLoadedPage(pageKey);
    requestAnimationFrame(() => {
      document.getElementById("page-content")?.focus({ preventScroll: true });
    });
  }, [pageKey]);
  async function reload() {
    setError("");
    try {
      setData(await loadContent());
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    let cancelled = false;
    loadContent()
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setSettled(true);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
          setSettled(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    document.body.classList.toggle("portfolio-home", route.page === "home");
    document.title = titles[route.page] + " | M.T. Malinga";
    let id = url.hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {}
    const frame = requestAnimationFrame(() => {
      if (id)
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
      else window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [url.href, !!data]);
  useEffect(() => {
    document.body.classList.toggle("background-paused", paused || reduced);
  }, [paused, reduced]);
  let content;
  if (
    ["projects", "labs", "editor", "detail", "home"].includes(route.page) &&
    !data
  )
    content = (
      <div className="work-main" role="status">
        {error ? (
          <>
            <p>{error}</p>
            <button onClick={reload}>Retry</button>
          </>
        ) : (
          <p>Loading portfolio…</p>
        )}
      </div>
    );
  else if (route.page === "home")
    content = (
      <Home
        data={data}
        paused={paused}
        onToggle={() => setPaused(!paused)}
        reduced={reduced}
      />
    );
  else if (["projects", "labs"].includes(route.page))
    content = <WorkList key={route.page} kind={route.page} data={data} />;
  else if (route.page === "editor") content = <Editor published={data} />;
  else if (route.page === "business") content = <Business />;
  else if (route.page === "blog") content = <BlogIndex />;
  else if (route.page === "zero-trust") content = <BlogZeroTrust />;
  else if (route.page === "password-security")
    content = <BlogPasswordSecurity />;
  else if (route.page === "ransomware") content = <BlogRansomware />;
  else if (route.page === "detail") {
    const kind = route.params.get("type"),
      entry = groups.includes(kind)
        ? data[kind].find(
            (v) => v.id === route.params.get("id") && v.status === "published",
          )
        : null;
    content = (
      <div className="work-main">
        {entry ? (
          <WorkDetail entry={entry} kind={kind} />
        ) : (
          <>
            <h1>Entry not found</h1>
            <p>This entry may be a draft or no longer available.</p>
            <a href="/projects.html">View projects</a>
          </>
        )}
      </div>
    );
  } else
    content = (
      <div className="work-main">
        <h1>Page not found</h1>
        <a href="/index.html">Return home</a>
      </div>
    );
  return (
    <>
      {loading && (
        <LoadingScreen
          key={pageKey}
          ready={settled}
          home={route.page === "home"}
          onDone={finishLoading}
        />
      )}
      <div id="site-shell" inert={loading} aria-busy={loading}>
        {route.page === "home" && <Background paused={paused} />}
        <Navigation url={url} />
        <main
          id="page-content"
          tabIndex="-1"
          className={
            ["projects", "labs", "editor", "detail", "not-found"].includes(
              route.page,
            )
              ? "work-page"
              : undefined
          }
          key={url.pathname + url.search}
        >
          {content}
        </main>
        <footer className="shared-footer">
          <span>
            © {new Date().getFullYear()} M.T. Malinga · Cyber Security & IT
          </span>
          <div>
            <a href="/editor.html">Content editor</a>
            <a
              href="https://github.com/maliwick"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/thisaramalinga523cyber/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
          </div>
        </footer>
      </div>
      {!loading && <Cursor />}
    </>
  );
}
