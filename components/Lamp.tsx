"use client";

import { useEffect, useRef } from "react";

// A reading lamp over the sheet: the pool of light drifts, slowly and a little behind,
// toward where the pointer is, never quite reaching the edges. Without a pointer (phones)
// it wanders gently as the page scrolls. Moved by transform only, so nothing repaints;
// the loop runs only while the light is still travelling; fixed at centre under reduced
// motion.
const FOLLOW = 0.6; // how far toward the pointer the light goes (0 = stays, 1 = all the way)
const EASE = 0.045; // per-frame catch-up

export default function Lamp() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let cx = 0;
    let cy = 0;
    const centre = () => {
      cx = window.innerWidth * 0.5;
      cy = window.innerHeight * 0.44;
    };
    centre();
    let x = cx;
    let y = cy;
    let tx = cx;
    let ty = cy;
    const put = () => {
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    };
    put();

    const onResize = () => {
      centre();
      if (calm) {
        x = tx = cx;
        y = ty = cy;
        put();
      }
    };
    window.addEventListener("resize", onResize);
    if (calm) return () => window.removeEventListener("resize", onResize);

    let raf = 0;
    const loop = () => {
      x += (tx - x) * EASE;
      y += (ty - y) * EASE;
      put();
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    const go = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = cx + (e.clientX - cx) * FOLLOW;
      ty = cy + (e.clientY - cy) * FOLLOW;
      go();
    };
    const onScroll = () => {
      const s = window.scrollY;
      tx = cx + Math.sin(s / 700) * window.innerWidth * 0.12;
      ty = cy + Math.cos(s / 950) * window.innerHeight * 0.08 - window.innerHeight * 0.08;
      go();
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    else window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <div ref={ref} className="lamp" aria-hidden="true" />;
}
