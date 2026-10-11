import React, { useEffect, useRef } from "react";
export default function Background({ paused }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const glyphs = "01ABCDEF{}<>/";
    const nodeNames = ["TLS", "0xA7", "SSH", "SHA256", "0101", "AUTH"];
    let width = 0,
      height = 0,
      points = [],
      streams = [],
      frame = 0,
      last = 0;
    function resize() {
      width = innerWidth;
      height = innerHeight;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      points = Array.from({ length: width < 700 ? 14 : 28 }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        label: nodeNames[i % nodeNames.length],
      }));
      streams = Array.from({ length: width < 700 ? 7 : 18 }, (_, i) => ({
        x: width * 0.2 + (i / ((width < 700 ? 7 : 18) - 1)) * width * 0.8,
        y: Math.random() * height,
        speed: 0.35 + Math.random() * 0.35,
        chars: Array.from(
          { length: 12 },
          () => glyphs[Math.floor(Math.random() * glyphs.length)],
        ),
      }));
    }
    function draw(now) {
      frame = 0;
      if (paused || document.hidden || reduced.matches || !ctx) return;
      frame = requestAnimationFrame(draw);
      if (now - last < 33) return;
      const dt = Math.min((now - last) / 33 || 1, 2);
      last = now;
      ctx.clearRect(0, 0, width, height);
      // Sparse hexadecimal/binary streams with faded tails, rather than a solid wall of text.
      ctx.font = "11px monospace";
      streams.forEach((s) => {
        s.y += s.speed * dt;
        if (s.y - 180 > height) s.y = -20;
        s.chars.forEach((g, i) => {
          ctx.fillStyle = `rgba(46,224,146,${(1 - i / 12) * 0.19})`;
          ctx.fillText(g, s.x, s.y - i * 16);
        });
      });
      // Moving nodes and orthogonal circuit traces form a security-network motif.
      points.forEach((p, i) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.strokeStyle = "rgba(97,218,182,.5)";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(p.x - 2, p.y - 2, 4, 4);
        if (i % 4 === 0) {
          ctx.fillStyle = "rgba(97,218,182,.25)";
          ctx.font = "9px monospace";
          ctx.fillText(p.label, p.x + 8, p.y - 6);
        }
        for (let j = i + 1; j < points.length; j++) {
          const q = points[j],
            distance = Math.hypot(p.x - q.x, p.y - q.y);
          if (distance < 180) {
            ctx.strokeStyle = `rgba(72,195,170,${(1 - distance / 180) * 0.25})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo((p.x + q.x) / 2, p.y);
            ctx.lineTo((p.x + q.x) / 2, q.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      });
    }
    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      document.body.classList.toggle(
        "background-paused",
        paused || reduced.matches || document.hidden,
      );
      if (!paused && !document.hidden && !reduced.matches && ctx) {
        last = performance.now();
        frame = requestAnimationFrame(draw);
      }
    }
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    resize();
    sync();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
    };
  }, [paused]);
  return (
    <div className="portfolio-backdrop" aria-hidden="true">
      <div className="cyber-image" />
      <div className="cyber-scan" />
      <div className="ambient-orb orb-green" />
      <div className="ambient-orb orb-blue" />
      <div className="ambient-grid" />
      <canvas id="ambientCanvas" ref={ref} />
    </div>
  );
}
