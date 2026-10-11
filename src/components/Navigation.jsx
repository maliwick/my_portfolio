import React, { useRef, useEffect } from "react";
import Icon from "./Icon.jsx";
import { resolveRoute } from "../lib.js";
const links = [
  ["Home", "/index.html"],
  ["Badges", "/index.html#badges"],
  ["Skills", "/index.html#skills"],
  ["Experience", "/index.html#experience"],
  ["About", "/index.html#about"],
  ["Projects", "/projects.html"],
  ["Labs", "/labs.html"],
  ["Blog", "/blog.html"],
  ["PSudo IT", "/business/index.html"],
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
  useEffect(() => {
    close();
  }, [url.href]);
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
    links.map(([label, href], index) => {
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
          <span className="nav-number">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{label}</span>
          <Icon className="nav-arrow" />
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
        <a
          className="site-search-link"
          href="/search.html"
          aria-label="Search portfolio"
        >
          <Icon name="search" />
        </a>
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
          <Icon name="menu" /> <span>Menu</span>
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
          <div>
            <p className="drawer-eyebrow">M.T. MALINGA</p>
            <h2 id="site-drawer-title">Explore the portfolio</h2>
          </div>
          <form method="dialog">
            <button
              id="site-menu-close"
              type="submit"
              aria-label="Close navigation menu"
            >
              <Icon name="close" />
            </button>
          </form>
        </div>
        <nav className="site-links" aria-label="Mobile navigation">
          {navLinks()}
        </nav>
        <div className="site-drawer-footer">
          <a href="/search.html" onClick={close}>
            Search portfolio
          </a>
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
