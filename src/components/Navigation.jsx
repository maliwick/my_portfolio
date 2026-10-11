import React, { useRef, useEffect } from "react";
import { resolveRoute } from "../lib.js";
const links = [
  ["Home", "/index.html"],
  ["About", "/index.html#about"],
  ["Skills", "/index.html#skills"],
  ["Projects", "/projects.html"],
  ["Labs", "/labs.html"],
  ["Experience", "/index.html#experience"],
  ["Badges", "/index.html#badges"],
  ["PSudo IT", "/business/index.html"],
  ["Blog", "/blog.html"],
  ["Contact", "/index.html#contact"],
];
export default function Navigation({ url }) {
  const drawer = useRef(null),
    toggle = useRef(null),
    overflow = useRef("");
  const route = resolveRoute(url.pathname, url.search);
  let activePage = route.page;
  if (activePage === "detail")
    activePage = route.params.get("type") === "labs" ? "labs" : "projects";
  if (["zero-trust", "password-security", "ransomware"].includes(activePage))
    activePage = "blog";
  const close = () => drawer.current?.open && drawer.current.close();
  const closed = () => {
    document.body.style.overflow = overflow.current;
    toggle.current?.setAttribute("aria-expanded", "false");
    if (!matchMedia("(min-width:1241px)").matches) toggle.current?.focus();
  };
  useEffect(() => {
    const media = matchMedia("(min-width:1241px)");
    const changed = () => {
      if (media.matches) close();
    };
    media.addEventListener("change", changed);
    return () => {
      media.removeEventListener("change", changed);
      document.body.style.overflow = overflow.current;
    };
  }, []);
  const navLinks = () =>
    links.map(([label, href]) => {
      const target = new URL(href, url);
      const targetPage = resolveRoute(target.pathname).page;
      const active =
        targetPage === activePage &&
        (target.hash ? url.hash === target.hash : !url.hash);
      return (
        <a
          key={href}
          href={href}
          aria-current={
            active ? (target.hash ? "location" : "page") : undefined
          }
          onClick={close}
        >
          {label}
        </a>
      );
    });
  return (
    <>
      <a className="site-skip" href="#page-content">
        Skip to content
      </a>
      <header id="site-header">
        <a className="site-brand" href="/index.html">
          <span className="site-mark" aria-hidden="true">
            M<span>.</span>
          </span>
          <span>
            M.T. MALINGA<small>CYBER SECURITY / IT</small>
          </span>
        </a>
        <nav
          id="site-desktop"
          className="site-links"
          aria-label="Main navigation"
        >
          {navLinks()}
        </nav>
        <button
          id="site-menu-toggle"
          ref={toggle}
          type="button"
          aria-label="Open navigation menu"
          aria-expanded="false"
          aria-controls="site-drawer"
          onClick={() => {
            overflow.current = document.body.style.overflow;
            drawer.current.showModal();
            toggle.current.setAttribute("aria-expanded", "true");
            document.body.style.overflow = "hidden";
          }}
        >
          <span aria-hidden="true">☰</span> Menu
        </button>
      </header>
      <dialog
        id="site-drawer"
        ref={drawer}
        aria-labelledby="site-drawer-title"
        onClose={closed}
        onClick={(e) => {
          if (e.target !== drawer.current) return;
          const r = drawer.current.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            close();
        }}
      >
        <div className="site-drawer-top">
          <h2 id="site-drawer-title">Navigation</h2>
          <form method="dialog">
            <button
              id="site-menu-close"
              type="submit"
              aria-label="Close navigation menu"
            >
              ✕
            </button>
          </form>
        </div>
        <nav className="site-links" aria-label="Mobile navigation">
          {navLinks()}
        </nav>
        <div className="site-drawer-footer">
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
      </dialog>
    </>
  );
}
