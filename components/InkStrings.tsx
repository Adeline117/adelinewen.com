"use client";

import { useEffect, useRef } from "react";

// The page is strung. Four strings run down the left margin, nut under the nav, bridge at
// the foot of the screen, side by side and thin to thick like a pipa's. Scrolling strums
// them (down: left to right; up: right to left; harder the faster the page moves) and a
// pointer crossing one plucks it where it crosses.
//
// Each string is a real vibrating string, not a wave drawn on a line: a 1-D wave equation
// over 64 points with light damping, so a pluck starts as a kink that runs to both ends
// and back, settling into the fundamental. Fast motion blurs, as a real string does, into
// a spindle: the drawing keeps each point's recent reach and shades that envelope behind
// the string's actual position. At rest the strings are drawn once and the loop stops.
// Only where the margin is wide enough to hold them; still under reduced motion.

const N = 64; // segments per string
const STRINGS = [
  { w: 0.7, c: 1.0 }, // thinnest, highest
  { w: 0.9, c: 0.84 },
  { w: 1.15, c: 0.75 },
  { w: 1.5, c: 0.62 }, // thickest, lowest
];
const GAP = 9; // px between strings
const F0 = 7; // fundamental of the thinnest string, Hz (slow enough to see, fast enough to blur)
const DAMP = 2.2; // 1/s
const MIN_MARGIN = 100; // px of left margin needed to show them

type S = { y: Float32Array; v: Float32Array; env: Float32Array };

export default function InkStrings() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const st: S[] = STRINGS.map(() => ({ y: new Float32Array(N + 1), v: new Float32Array(N + 1), env: new Float32Array(N + 1) }));
    let vw = 0;
    let vh = 0;
    let x0 = 0; // x of the first string
    let top = 0;
    let bot = 0;
    let shown = false;
    let ink = "#18140c";

    const layout = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      vw = window.innerWidth;
      vh = window.innerHeight;
      cv.width = Math.round(vw * dpr);
      cv.height = Math.round(vh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const margin = document.querySelector("nav .logo")?.getBoundingClientRect().left ?? 0;
      shown = margin >= MIN_MARGIN;
      x0 = Math.round(margin / 2 - (GAP * (STRINGS.length - 1)) / 2) + 0.5;
      top = (document.querySelector("nav")?.getBoundingClientRect().bottom ?? 64) + 28;
      bot = vh - 28;
      ink = getComputedStyle(document.body).getPropertyValue("--ink").trim() || ink;
    };

    const draw = () => {
      ctx.clearRect(0, 0, vw, vh);
      if (!shown) return;
      const len = bot - top;
      const dy = len / N;
      const x1 = x0 + GAP * (STRINGS.length - 1);
      ctx.strokeStyle = ink;
      ctx.fillStyle = ink;
      // nut and bridge: a short bar across the four, and a pin above / below each string
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x0 - 5, top);
      ctx.lineTo(x1 + 5, top);
      ctx.moveTo(x0 - 5, bot);
      ctx.lineTo(x1 + 5, bot);
      ctx.stroke();
      STRINGS.forEach((_, i) => {
        const x = x0 + i * GAP;
        ctx.beginPath();
        ctx.arc(x, top - 9, 1.8, 0, Math.PI * 2);
        ctx.arc(x, bot + 9, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
      STRINGS.forEach((s, i) => {
        const x = x0 + i * GAP;
        const { y, env } = st[i];
        // the blur of a string in motion: its recent reach, shaded as a spindle
        let moving = false;
        for (let j = 0; j <= N; j++) if (env[j] > 0.4) moving = true;
        if (moving) {
          ctx.globalAlpha = 0.13;
          ctx.beginPath();
          for (let j = 0; j <= N; j++) ctx.lineTo(x + env[j], top + j * dy);
          for (let j = N; j >= 0; j--) ctx.lineTo(x - env[j], top + j * dy);
          ctx.closePath();
          ctx.fill();
        }
        // the string where it is now
        ctx.globalAlpha = 0.42;
        ctx.lineWidth = s.w;
        ctx.beginPath();
        for (let j = 0; j <= N; j++) {
          if (j) ctx.lineTo(x + y[j], top + j * dy);
          else ctx.moveTo(x + y[j], top);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    };

    layout();
    draw();
    const onResize = () => {
      layout();
      draw();
    };
    window.addEventListener("resize", onResize);
    const theme = new MutationObserver(() => {
      ink = getComputedStyle(document.body).getPropertyValue("--ink").trim() || ink;
      draw();
    });
    theme.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    if (calm) {
      return () => {
        window.removeEventListener("resize", onResize);
        theme.disconnect();
      };
    }

    // -- the physics ---------------------------------------------------------------
    let raf = 0;
    let prev = 0;
    const energy = () => st.some((s) => s.env.some((e) => e > 0.15));
    const step = (now: number) => {
      const dt = prev ? Math.min(0.034, (now - prev) / 1000) : 0.016;
      prev = now;
      const len = bot - top;
      STRINGS.forEach((cfg, i) => {
        const s = st[i];
        const c = 2 * len * F0 * cfg.c; // wave speed for this string's fundamental
        const dx = len / N;
        const sub = Math.max(1, Math.ceil((c * dt) / (dx * 0.9)));
        const h = dt / sub;
        const k = (c * c) / (dx * dx);
        for (let n = 0; n < sub; n++) {
          for (let j = 1; j < N; j++) s.v[j] += (k * (s.y[j - 1] - 2 * s.y[j] + s.y[j + 1]) - DAMP * s.v[j]) * h;
          for (let j = 1; j < N; j++) s.y[j] += s.v[j] * h;
        }
        // the envelope follows the reach up at once and lets go over ~0.12 s
        const fall = Math.exp(-dt / 0.16);
        for (let j = 0; j <= N; j++) s.env[j] = Math.max(Math.abs(s.y[j]), s.env[j] * fall);
      });
      draw();
      if (energy()) raf = requestAnimationFrame(step);
      else {
        st.forEach((s) => {
          s.y.fill(0);
          s.v.fill(0);
          s.env.fill(0);
        });
        draw();
        raf = 0;
        prev = 0;
      }
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    // pull string i aside by a at fraction p of its length, and let go
    const pluck = (i: number, p: number, a: number) => {
      const j0 = Math.max(2, Math.min(N - 2, Math.round(p * N)));
      const s = st[i];
      for (let j = 1; j < N; j++) {
        const shape = j <= j0 ? j / j0 : (N - j) / (N - j0);
        s.y[j] += a * shape;
        s.v[j] = 0;
      }
      wake();
    };

    // scrolling strums: rate-limited, the four in turn, a hand's height down the strings
    let lastY = window.scrollY;
    let lastStrum = 0;
    const timers: number[] = [];
    const onScroll = () => {
      const d = window.scrollY - lastY;
      lastY = window.scrollY;
      if (!shown || Math.abs(d) < 3) return;
      const now = performance.now();
      if (now - lastStrum < 240) return;
      lastStrum = now;
      const a = Math.min(14, 4 + Math.abs(d) * 0.12);
      const order = d > 0 ? [0, 1, 2, 3] : [3, 2, 1, 0];
      order.forEach((i, n) => timers.push(window.setTimeout(() => pluck(i, 0.32, (d > 0 ? 1 : -1) * a), n * 38)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // a pointer crossing a string plucks it where it crossed
    let px = -1;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !shown) return;
      const x = e.clientX;
      if (px >= 0 && e.clientY > top && e.clientY < bot) {
        STRINGS.forEach((_, i) => {
          const sx = x0 + i * GAP;
          if ((px - sx) * (x - sx) < 0) pluck(i, (e.clientY - top) / (bot - top), Math.sign(x - px) * Math.min(8, 2.5 + Math.abs(x - px) * 0.15));
        });
      }
      px = x;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      theme.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="ink-strings" aria-hidden="true" />;
}
