"use client";

import { useEffect, useRef, useState } from "react";
import type { Shot } from "./gallery";

// One event's photographs as a horizontal reel.
// - native overflow + proximity snap: touch swipes, trackpads, shift-wheel and
//   arrow keys (the region is focusable) all work with no carousel JS
// - fixed row height, natural widths: mixed portrait/landscape widths mean the
//   next picture always peeks past the edge — the scroll affordance is free
// - prev/next buttons exist only for fine pointers with hover (CSS)
// - Live Photos loop silently while half on screen; reduced-motion or
//   Save-Data visitors get the still
// - every photo opens a native <dialog> lightbox (focus trap + Esc for free)
export default function PhotoStrip({ shots, label, lang }: { shots: Shot[]; label: string; lang: "en" | "zh" }) {
  const reel = useRef<HTMLUListElement>(null);
  const box = useRef<HTMLDialogElement>(null);
  const big = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [idx, setIdx] = useState(0);
  // the lightbox list mounts on first open, so a page visit never fetches
  // the full-screen copies of photos nobody enlarged
  const [lb, setLb] = useState(false);
  const want = useRef(0);

  const calm = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

  useEffect(() => {
    const el = reel.current;
    if (!el) return;
    const update = () =>
      setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const io = calm()
      ? null
      : new IntersectionObserver(
          (es) =>
            es.forEach((e) => {
              const v = e.target as HTMLVideoElement;
              if (e.isIntersecting) v.play().catch(() => {});
              else v.pause();
            }),
          { threshold: 0.5 },
        );
    el.querySelectorAll("video").forEach((v) => io?.observe(v));
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      io?.disconnect();
    };
  }, []);

  const page = (dir: 1 | -1) =>
    reel.current?.scrollBy({ left: dir * reel.current.clientWidth * 0.8, behavior: calm() ? "auto" : "smooth" });

  const land = (i: number) => {
    const item = big.current?.children[i] as HTMLElement | undefined;
    if (!item) return;
    item.scrollIntoView({ behavior: "instant", inline: "start", block: "nearest" });
    if (!calm()) (item.querySelector("video") as HTMLVideoElement | null)?.play().catch(() => {});
  };
  const open = (i: number) => {
    const d = box.current;
    if (!d) return;
    d.showModal();
    setIdx(i);
    want.current = i;
    if (lb) land(i);
    else setLb(true); // first open: land once the list has mounted (effect below)
  };
  useEffect(() => {
    if (lb) land(want.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lb]);
  const step = (dir: 1 | -1) => {
    const n = Math.min(shots.length - 1, Math.max(0, idx + dir));
    (big.current?.children[n] as HTMLElement | undefined)?.scrollIntoView({
      behavior: calm() ? "instant" : "smooth",
      inline: "start",
      block: "nearest",
    });
  };
  // keep the counter honest when the visitor swipes inside the lightbox
  const onBigScroll = () => {
    const el = big.current;
    if (el) setIdx(Math.round(el.scrollLeft / el.clientWidth));
  };

  const zh = lang === "zh";
  const alt = (i: number) => `${label} — ${i + 1}/${shots.length}`;

  return (
    <div className={`strip-wrap${edge.start ? " at-start" : ""}${edge.end ? " at-end" : ""}`}>
      <div className="strip" role="region" aria-label={zh ? `${label} 照片` : `Photos — ${label}`} tabIndex={0}>
        <ul ref={reel} role="list">
          {shots.map((s, i) => (
            <li key={s.src}>
              <button
                type="button"
                className="plate"
                style={{ aspectRatio: `${s.w} / ${s.h}` }}
                onClick={() => open(i)}
                aria-label={zh ? `放大查看 ${alt(i)}` : `Enlarge ${alt(i)}`}
              >
                {s.live ? (
                  <video src={s.live} poster={s.src} muted loop playsInline preload="none" width={s.w} height={s.h} aria-hidden="true" />
                ) : (
                  <img src={s.src} width={s.w} height={s.h} alt={alt(i)} loading="lazy" decoding="async" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button type="button" className="strip-btn prev" aria-label={zh ? "上一组照片" : "Previous photos"} onClick={() => page(-1)} disabled={edge.start}>
        ←
      </button>
      <button type="button" className="strip-btn next" aria-label={zh ? "下一组照片" : "Next photos"} onClick={() => page(1)} disabled={edge.end}>
        →
      </button>

      <dialog
        ref={box}
        className="lightbox"
        aria-label={label}
        onClick={(e) => e.target === e.currentTarget && box.current?.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClose={() => box.current?.querySelectorAll("video").forEach((v) => v.pause())}
      >
        <ul ref={big} role="list" onScroll={onBigScroll}>
          {lb && shots.map((s, i) => (
            <li key={s.src}>
              {s.live ? (
                <video src={s.live} poster={s.src} muted loop playsInline preload="none" width={s.w} height={s.h} />
              ) : (
                <img src={s.src} width={s.w} height={s.h} alt={alt(i)} loading="lazy" decoding="async" />
              )}
            </li>
          ))}
        </ul>
        <div className="lb-bar">
          <span className="lb-count">
            {idx + 1} / {shots.length}
          </span>
          <button type="button" onClick={() => step(-1)} disabled={idx === 0} aria-label={zh ? "上一张" : "Previous"}>
            ←
          </button>
          <button type="button" onClick={() => step(1)} disabled={idx === shots.length - 1} aria-label={zh ? "下一张" : "Next"}>
            →
          </button>
          <button type="button" onClick={() => box.current?.close()} aria-label={zh ? "关闭" : "Close"}>
            ✕
          </button>
        </div>
      </dialog>
    </div>
  );
}
