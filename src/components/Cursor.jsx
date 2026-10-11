import { useEffect } from "react";
export default function Cursor() {
  useEffect(() => {
    const listeners = [];
    const listen = (target, type, callback, options) => {
      target.addEventListener(type, callback, options);
      listeners.push(() => target.removeEventListener(type, callback, options));
    };
    const pointer = matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const layer = document.createElement("div");
    layer.className = "professional-cursor";
    layer.hidden = true;
    layer.setAttribute("aria-hidden", "true");
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.append(document.createElement("span"));
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.append(document.createElement("span"));
    layer.append(ring, dot);
    document.body.append(layer);
    let x = 0,
      y = 0,
      rx = 0,
      ry = 0,
      frame = 0,
      visible = false;
    const enabled = () => pointer.matches && !reduced.matches;
    function hide() {
      visible = false;
      layer.hidden = true;
      root.classList.remove("cursor-active");
      cancelAnimationFrame(frame);
      frame = 0;
      layer.classList.remove("is-pressed");
    }
    function draw() {
      frame = 0;
      if (!visible) return;
      rx += (x - rx) * 0.26;
      ry += (y - ry) * 0.26;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      if (Math.abs(x - rx) + Math.abs(y - ry) > 0.1)
        frame = requestAnimationFrame(draw);
    }
    listen(
      document,
      "pointermove",
      (e) => {
        if (
          !enabled() ||
          e.pointerType !== "mouse" ||
          e.target.closest(
            'input,textarea,select,[contenteditable="true"],iframe',
          )
        ) {
          hide();
          return;
        }
        x = e.clientX;
        y = e.clientY;
        if (!visible) {
          rx = x;
          ry = y;
          visible = true;
          layer.hidden = false;
          root.classList.add("cursor-active");
        }
        dot.style.transform = `translate3d(${x}px,${y}px,0)`;
        layer.classList.toggle(
          "is-interactive",
          !!e.target.closest('a,button,[role="button"],summary'),
        );
        if (!frame) frame = requestAnimationFrame(draw);
      },
      { passive: true },
    );
    listen(document, "pointerdown", (e) => {
      if (e.pointerType === "mouse" && visible)
        layer.classList.add("is-pressed");
    });
    listen(document, "pointerup", () => layer.classList.remove("is-pressed"));
    listen(document, "pointerout", (e) => {
      if (!e.relatedTarget) hide();
    });
    listen(window, "blur", hide);
    listen(document, "visibilitychange", () => {
      if (document.hidden) hide();
    });
    listen(pointer, "change", hide);
    listen(reduced, "change", hide);
    const drawer = document.getElementById("site-drawer");
    // Native modal dialogs occupy the top layer. Move the cursor into that same layer.
    const observer = new MutationObserver(() => {
      (drawer.open ? drawer : document.body).append(layer);
      hide();
    });
    if (drawer)
      observer.observe(drawer, { attributes: true, attributeFilter: ["open"] });
    return () => {
      hide();
      listeners.forEach((remove) => remove());
      observer.disconnect();
      layer.remove();
    };
  }, []);
  return null;
}
