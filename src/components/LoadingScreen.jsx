import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function LoadingScreen({ ready, home, onDone }) {
  const started = useRef(Date.now());
  const [imageReady, setImageReady] = useState(!home);
  const [leaving, setLeaving] = useState(false);
  useLayoutEffect(() => {
    document.getElementById("boot-loader")?.remove();
    document.documentElement.classList.add("site-loading");
    return () => document.documentElement.classList.remove("site-loading");
  }, []);
  useEffect(() => {
    if (!home) return;
    let active = true;
    const image = new Image();
    const finish = () => {
      if (active) setImageReady(true);
    };
    image.onload = finish;
    image.onerror = finish;
    image.src = "/image/cybersecurity-background.webp";
    if (image.complete) finish();
    const timeout = setTimeout(finish, 3500);
    return () => {
      active = false;
      image.onload = null;
      image.onerror = null;
      clearTimeout(timeout);
    };
  }, [home]);
  useEffect(() => {
    if (!ready || !imageReady) return;
    const delay = Math.max(0, 650 - (Date.now() - started.current));
    const timer = setTimeout(() => setLeaving(true), delay);
    return () => clearTimeout(timer);
  }, [ready, imageReady]);
  useEffect(() => {
    const timeout = setTimeout(() => setLeaving(true), 7000);
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(onDone, 350);
    return () => clearTimeout(timer);
  }, [leaving, onDone]);
  return (
    <div
      className={"loading-screen" + (leaving ? " is-leaving" : "")}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className="loading-grid" aria-hidden="true" />
      <div className="loading-panel">
        <div className="loading-emblem" aria-hidden="true">
          <span className="loading-orbit" />
          <svg viewBox="0 0 64 72" fill="none">
            <path
              d="M32 4 56 14v20c0 16-10 27-24 34C18 61 8 50 8 34V14L32 4Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="m21 35 8 8 15-18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="loading-kicker">M.T. MALINGA</p>
        <h1>
          Loading portfolio
          <span className="loading-dots" aria-hidden="true">
            ...
          </span>
        </h1>
        <p className="loading-caption">
          Cyber Security · Projects · Lab Practicals
        </p>
        <div className="loading-track" aria-hidden="true">
          <span />
        </div>
        <span className="loading-code" aria-hidden="true">
          01 / BUILD · EXPLORE · SECURE
        </span>
      </div>
    </div>
  );
}
