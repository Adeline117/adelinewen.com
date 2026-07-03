"use client";

import { useEffect, useRef } from "react";

// A cursor-reactive needle field — a sparse grid of fine hairline strokes that
// drift slowly on their own and swing to point at the cursor as it approaches,
// growing longer/darker near it. Monochrome, crisp, editorial; the page feels
// like it responds to you. Canvas 2D, light-weight, theme-aware.
export default function Field() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ink = "#141414";
    const readInk = () => {
      const v = getComputedStyle(document.body).getPropertyValue("--ink").trim();
      if (v) ink = v;
    };
    readInk();
    const themeObs = new MutationObserver(readInk);
    themeObs.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    let W = 0, H = 0, gap = 54;
    let pts: { x: number; y: number; a: number }[] = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = Math.max(46, Math.min(62, W / 26));
      const cols = Math.ceil(W / gap) + 1;
      const rows = Math.ceil(H / gap) + 1;
      pts = [];
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++)
          pts.push({ x: i * gap + gap * 0.5, y: j * gap + gap * 0.5, a: 0 });
    };
    build();
    const onResize = () => build();
    window.addEventListener("resize", onResize);

    let mx = -9999, my = -9999, tx = -9999, ty = -9999;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    window.addEventListener("pointermove", onMove);
    const onOut = (e: PointerEvent) => { if (!e.relatedTarget) { tx = -9999; ty = -9999; } };
    window.addEventListener("pointerout", onOut);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const R = 300; // cursor influence radius
    let raf = 0, t = 0;
    const draw = () => {
      t += 0.016;
      mx += (tx - mx) * 0.12;
      my += (ty - my) * 0.12;
      const active = tx > -9000;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = ink;
      ctx.lineCap = "round";
      for (const p of pts) {
        const dx = mx - p.x, dy = my - p.y;
        const d = Math.hypot(dx, dy);
        const near = active && d < R;
        // slow ambient wave when far; align to cursor when near
        const target = near ? Math.atan2(dy, dx) : Math.sin((p.x + p.y) * 0.006 + t * 0.35) * 0.55;
        let da = target - p.a;
        da = Math.atan2(Math.sin(da), Math.cos(da)); // shortest turn
        p.a += da * (near ? 0.2 : 0.06);
        const infl = near ? 1 - d / R : 0;
        const len = 6 + infl * 13;
        const cx = Math.cos(p.a) * len * 0.5;
        const cy = Math.sin(p.a) * len * 0.5;
        ctx.globalAlpha = 0.085 + infl * 0.5;
        ctx.lineWidth = 1 + infl * 0.7;
        ctx.beginPath();
        ctx.moveTo(p.x - cx, p.y - cy);
        ctx.lineTo(p.x + cx, p.y + cy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      draw();
    };
    if (reduced) draw();
    else tick();

    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
    };
  }, []);

  return <canvas ref={ref} className="field-canvas" aria-hidden="true" />;
}
