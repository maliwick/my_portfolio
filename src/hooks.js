import { useEffect, useState } from "react";
import { resolveRoute } from "./lib.js";
export function useMedia(query) {
  const [matches, setMatches] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const media = matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}
export function useRoute() {
  const [url, setUrl] = useState(() => new URL(location.href));
  useEffect(() => {
    const update = () => setUrl(new URL(location.href));
    const click = (e) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const a = e.target.closest("a[href]");
      if (
        !a ||
        a.hasAttribute("download") ||
        (a.target && a.target !== "_self")
      )
        return;
      const next = new URL(a.href);
      if (next.origin !== location.origin) return;
      if (resolveRoute(next.pathname).page === "not-found") return;
      e.preventDefault();
      history.pushState({}, "", next);
      update();
    };
    document.addEventListener("click", click);
    window.addEventListener("popstate", update);
    window.addEventListener("hashchange", update);
    return () => {
      document.removeEventListener("click", click);
      window.removeEventListener("popstate", update);
      window.removeEventListener("hashchange", update);
    };
  }, []);
  return url;
}
