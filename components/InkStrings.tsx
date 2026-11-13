"use client";

import { useEffect, useRef } from "react";

// The background's one moving element: four hairline strings across the sheet, fanning a
// little from left to right as a pipa's do from nut to bridge. At rest they breathe, very
// slowly. Scrolling plucks them: each string is a few standing-wave modes on damped
// springs, kicked by how fast the page moves, so a flick makes them shiver and a slow
// read barely stirs them. One canvas under everything; drawn in the page's ink at low
// alpha; the browser stops the loop in background tabs; still under reduced motion.
const LINES = [
  { a: 0.17, b: 0.11, ph: 0 },
  { a: 0.39, b: 0.35, ph: 1.7 },
  { a: 0.61, b: 0.66, ph: 3.1 },
  { a: 0.83, b: 0.91, ph: 4.6 },
];
const MODES = 3;
const OMEGA = [1.3, 2.6, 3.9].map((f) => 2 * Math.PI * f);
const ZETA = 0.06;
const ALPHA = 0.085;

export default function InkStrings() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let ink = "";
    const readInk = () => {
      ink = getComputedStyle(document.body).getPropertyValue("--ink").trim() || "#18140c";
    };

    const st = LINES.map(() => ({ m: new Array(MODES).fill(0), v: new Array(MODES).fill(0) }));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = ink;
      ctx.globalAlpha = ALPHA;
      ctx.lineWidth = 1;
      const n = Math.max(24, Math.round(w / 24));
      LINES.forEach((l, i) => {
        const breathe = calm ? 0 : 1.6 * Math.sin(t * 0.45 + l.ph);
        ctx.beginPath();
        for (let k = 0; k <= n; k++) {
          const u = k / n;
          let y = h * (l.a + (l.b - l.a) * u) + breathe * Math.sin(Math.PI * u);
          for (let j = 0; j < MODES; j++) y += st[i].m[j] * Math.sin((j + 1) * Math.PI * u);
          if (k) ctx.lineTo(u * w, y);
          else ctx.moveTo(0, y);
        }
        ctx.stroke();
      });
    };

    resize();
    readInk();
    draw(0);
    const theme = new MutationObserver(() => {
      readInk();
      if (calm) draw(0);
    });
    theme.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    const onResize = () => {
      resize();
      if (calm) draw(0);
    };
    window.addEventListener("resize", onResize);
    if (calm) {
      return () => {
        theme.disconnect();
        window.removeEventListener("resize", onResize);
      };
    }

    // scroll plucks: the kick follows the page's speed, alternating in sign string to string
    let lastY = window.scrollY;
    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      const kick = Math.max(-40, Math.min(40, dy)) * 0.9;
      st.forEach((s, i) => {
        const sgn = i % 2 ? -1 : 1;
        s.v[0] += sgn * kick;
        s.v[1] -= sgn * kick * 0.45;
        s.v[2] += sgn * kick * 0.2;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    let prev = 0;
    const loop = (now: number) => {
      const dt = prev ? Math.min(0.033, (now - prev) / 1000) : 0.016;
      prev = now;
      for (const s of st) {
        for (let j = 0; j < MODES; j++) {
          const o = OMEGA[j];
          s.v[j] += (-o * o * s.m[j] - 2 * ZETA * o * s.v[j]) * dt;
          s.m[j] += s.v[j] * dt;
          // never more than a shiver
          s.m[j] = Math.max(-22, Math.min(22, s.m[j]));
        }
      }
      draw(now / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      theme.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={ref} className="ink-strings" aria-hidden="true" />;
}
