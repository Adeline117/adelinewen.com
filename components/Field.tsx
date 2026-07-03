"use client";

import { useEffect, useRef } from "react";

// A cursor-reactive needle field — a sparse grid of fine hairline strokes.
// They drift on a slow ambient wave; near the cursor they swing to swirl around
// it and grow longer/darker. Physical feel: velocity widens the disturbance,
// a decaying "energy" per needle leaves a flowing wake behind fast movement,
// and a click sends a ripple ring through the field. Monochrome, crisp, light.
type P = { x: number; y: number; a: number; e: number };
type Ripple = { x: number; y: number; r: number };

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

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
    let pts: P[] = [];
    let dpr = 1;
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
          pts.push({ x: i * gap + gap * 0.5, y: j * gap + gap * 0.5, a: 0, e: 0 });
    };
    build();
    const onResize = () => build();
    window.addEventListener("resize", onResize);

    let mx = -9999, my = -9999, tx = -9999, ty = -9999, pmx = -9999, pmy = -9999, speed = 0;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    window.addEventListener("pointermove", onMove);
    const onOut = (e: PointerEvent) => { if (!e.relatedTarget) { tx = -9999; ty = -9999; } };
    window.addEventListener("pointerout", onOut);

    const ripples: Ripple[] = [];
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > W || y > H) return;
      if (ripples.length < 4) ripples.push({ x, y, r: 0 });
    };
    window.addEventListener("pointerdown", onDown);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const R = 300; // base influence radius
    const CURL = 0.42; // radians of swirl — needles orbit rather than stab
    let raf = 0, t = 0;
    const draw = () => {
      t += 0.016;
      if (pmx < -9000) { pmx = mx; pmy = my; }
      mx += (tx - mx) * 0.15;
      my += (ty - my) * 0.15;
      const inst = Math.hypot(mx - pmx, my - pmy);
      pmx = mx; pmy = my;
      speed += (inst - speed) * 0.15;
      const boost = Math.min(speed / 12, 1.3);
      const radius = R * (1 + boost * 0.55);
      const active = tx > -9000;

      // advance ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].r += 9;
        if (ripples[i].r > Math.hypot(W, H)) ripples.splice(i, 1);
      }

      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = ink;
      ctx.lineCap = "round";
      for (const p of pts) {
        const dx = mx - p.x, dy = my - p.y;
        const d = Math.hypot(dx, dy);
        const f = active ? smooth(radius, 0, d) : 0; // 1 near cursor → 0 at radius
        let te = f * (0.72 + boost * 0.5);
        // ripple rings inject energy where their expanding edge passes
        for (const rp of ripples) {
          const rd = Math.abs(Math.hypot(rp.x - p.x, rp.y - p.y) - rp.r);
          if (rd < 46) te = Math.max(te, (1 - rd / 46) * 0.9);
        }
        // attack fast, release slow → a wake trails behind the cursor
        p.e += (te - p.e) * (te > p.e ? 0.35 : 0.055);
        const en = Math.min(p.e, 1);
        // aim: swirl around the cursor when excited, else the ambient wave
        const target = p.e > 0.002
          ? Math.atan2(dy, dx) + CURL
          : Math.sin((p.x + p.y) * 0.006 + t * 0.35) * 0.55;
        let da = target - p.a;
        da = Math.atan2(Math.sin(da), Math.cos(da));
        p.a += da * (0.06 + en * 0.22);
        const len = 6 + p.e * 15;
        const cx = Math.cos(p.a) * len * 0.5;
        const cy = Math.sin(p.a) * len * 0.5;
        ctx.globalAlpha = 0.085 + en * 0.5;
        ctx.lineWidth = 1 + en * 0.7;
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
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={ref} className="field-canvas" aria-hidden="true" />;
}
