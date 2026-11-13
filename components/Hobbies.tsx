"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Off the clock: the five interests from the CV, each drawn in the site's ink and each
// with one small thing to do. The drawings ink themselves in once when the row first
// scrolls into view; after that nothing moves unless you hover or tap a card. The pipa
// is the only one that makes a sound, and only when tapped.
const L = {
  en: {
    h: "Off the clock",
    items: { pipa: "Pipa · Level 10", chess: "Chess", poker: "Poker", sky: "Skydiving", doc: "Documentary film" },
    play: "Tap to strum",
  },
  zh: {
    h: "工作之外",
    items: { pipa: "琵琶 · 十级", chess: "国际象棋", poker: "德州扑克", sky: "跳伞", doc: "纪录片拍摄" },
    play: "点一下听",
  },
};

// pipa open strings, low to high: A2 D3 E3 A3
const TUNING = [110, 146.83, 164.81, 220];

// a plucked string, synthesised (Karplus-Strong): a burst of noise fed round a short
// delay loop that averages itself down, the way a real string loses its brightness
function pluck(ctx: AudioContext, f: number, when: number) {
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * 1.6);
  const buf = ctx.createBuffer(1, len, sr);
  const d = buf.getChannelData(0);
  const p = Math.round(sr / f);
  for (let i = 0; i < p; i++) d[i] = Math.random() * 2 - 1;
  for (let i = p; i < len; i++) d[i] = 0.996 * 0.5 * (d[i - p] + d[i - p + 1]);
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  g.gain.value = 0.22;
  src.buffer = buf;
  src.connect(g).connect(ctx.destination);
  src.start(when);
}

function Card({ k, label, children, onTap, hint }: { k: string; label: string; children: ReactNode; onTap?: () => void; hint?: string }) {
  const [on, setOn] = useState(false);
  const Tag = onTap ? "button" : "div";
  return (
    <li className={`hob hob-${k}${on ? " on" : ""}`}>
      <Tag
        className="hob-art"
        {...(onTap ? { type: "button" as const, "aria-label": `${label}: ${hint}` } : { tabIndex: 0, role: "img", "aria-label": label })}
        onPointerEnter={(e: React.PointerEvent) => e.pointerType === "mouse" && setOn(true)}
        onPointerLeave={(e: React.PointerEvent) => e.pointerType === "mouse" && setOn(false)}
        onFocus={() => setOn(true)}
        onBlur={() => setOn(false)}
        onClick={() => {
          onTap?.();
          // touch has no hover: a tap plays the card's move once
          if (!onTap) {
            setOn(false);
            requestAnimationFrame(() => setOn(true));
          }
        }}
      >
        <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
          {children}
        </svg>
      </Tag>
      <div className="hob-label">
        {label}
        {hint && <span className="hob-hint">{hint}</span>}
      </div>
    </li>
  );
}

export default function Hobbies({ lang }: { lang: "en" | "zh" }) {
  const t = L[lang];
  const root = useRef<HTMLDivElement>(null);
  const ctx = useRef<AudioContext | null>(null);
  const [tc, setTc] = useState("00:00:00");
  const docOn = useRef(false);

  // ink the drawings in once, the first time the row scrolls into view
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const calm =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (calm || el.getBoundingClientRect().top < window.innerHeight) return;
    el.classList.add("pre");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        el.classList.replace("pre", "play");
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the documentary card's timecode runs only while its card is active
  useEffect(() => {
    const el = root.current?.querySelector(".hob-doc");
    if (!el) return;
    let raf = 0;
    let t0 = 0;
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const f = Math.floor(((now - t0) / 1000) * 24);
      const s = Math.floor(f / 24);
      setTc(`00:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}:${String(f % 24).padStart(2, "0")}`.slice(3));
      raf = requestAnimationFrame(tick);
    };
    const mo = new MutationObserver(() => {
      const active = el.classList.contains("on");
      if (active === docOn.current) return;
      docOn.current = active;
      cancelAnimationFrame(raf);
      t0 = 0;
      if (active) raf = requestAnimationFrame(tick);
      else setTc("00:00:00");
    });
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const play = () => {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx.current ??= new AC();
    const c = ctx.current;
    if (c.state === "suspended") c.resume();
    TUNING.forEach((f, i) => pluck(c, f, c.currentTime + i * 0.07));
    // each string shivers as it sounds, low to high
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      root.current?.querySelectorAll(".hob-pipa .str").forEach((el, i) =>
        el.animate(
          [{ transform: "none" }, { transform: "translateX(1.4px)" }, { transform: "translateX(-1.1px)" }, { transform: "translateX(0.7px)" }, { transform: "translateX(-0.4px)" }, { transform: "none" }],
          { duration: 520, delay: i * 70, easing: getComputedStyle(document.documentElement).getPropertyValue("--ease").trim() }, // delay matches the strum
        ),
      );
  };

  return (
    <div className="hobbies" ref={root}>
      <h3 className="hob-h">{t.h}</h3>
      <ul className="hob-grid">
        {/* pipa: tap to strum; each string shivers in turn, low to high */}
        <Card k="pipa" label={t.items.pipa} onTap={play} hint={t.play}>
          <path className="ink" pathLength={1} d="M56 6 L64 6 L63 30 L57 30 Z" />
          <path className="ink" pathLength={1} d="M60 30 C 42 36 31 64 34 88 C 37 110 83 110 86 88 C 89 64 78 36 60 30 Z" />
          <path className="ink thin" pathLength={1} d="M55 12 H51 M55 18 H51 M65 12 H69 M65 18 H69" />
          <path className="ink thin" pathLength={1} d="M57 36 H63 M56 44 H64 M53 54 H67 M50 66 H70" />
          <path className="ink thin" pathLength={1} d="M52 96 H68" />
          <g className="strings">
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                className="ink str"
                pathLength={1}
                d={`M${57.6 + i * 1.6} 8 L${54.5 + i * 3.7} 96`}
              />
            ))}
          </g>
        </Card>

        {/* chess: a knight hops two L-moves across the board and back */}
        <Card k="chess" label={t.items.chess}>
          <rect className="ink" pathLength={1} x="16" y="16" width="88" height="88" />
          <path className="ink hair" pathLength={1} d="M27 16V104M38 16V104M49 16V104M60 16V104M71 16V104M82 16V104M93 16V104M16 27H104M16 38H104M16 49H104M16 60H104M16 71H104M16 82H104M16 93H104" />
          <path className="trail" d="M32.5 87.5 L54.5 76.5 L65.5 54.5 L87.5 43.5" />
          <g className="knight">
            <text x="32.5" y="93.5" textAnchor="middle">{"♞︎"}</text>
          </g>
        </Card>

        {/* poker: two cards face down; hover turns them over */}
        <Card k="poker" label={t.items.poker}>
          <defs>
            <pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <path d="M0 0V4" className="hatch" />
            </pattern>
          </defs>
          {[
            { x: 30, r: -9, rank: "A", suit: "♠︎" },
            { x: 56, r: 7, rank: "A", suit: "♥︎" },
          ].map((c, i) => (
            <g key={i} className="pcard" style={{ transform: `rotate(${c.r}deg)`, ["--i" as string]: i }}>
              <g className="back">
                <rect className="ink" pathLength={1} x={c.x} y="30" width="36" height="52" rx="4" />
                <rect x={c.x + 4} y="34" width="28" height="44" rx="2" fill="url(#hatch)" className="fade" />
              </g>
              <g className="front">
                <rect className="face" x={c.x} y="30" width="36" height="52" rx="4" />
                <text className="rank" x={c.x + 5} y="43">{c.rank}</text>
                <text className="suit" x={c.x + 18} y="64" textAnchor="middle">{c.suit}</text>
              </g>
            </g>
          ))}
        </Card>

        {/* skydiving: free fall; hover opens the canopy and the jumper floats */}
        <Card k="sky" label={t.items.sky}>
          <path className="ink hair" pathLength={1} d="M14 104 H106" />
          <path className="ink hair" pathLength={1} d="M22 104 l6 -6 l5 6 M86 104 l7 -8 l6 8" />
          <g transform="translate(0 -14)">
          <g className="jumper">
            <path className="canopy" pathLength={1} d="M34 44 Q60 14 86 44 Q73 38 60 44 Q47 38 34 44 Z M34 44 L58 70 M86 44 L62 70 M60 44 L60 70" />
            <circle className="ink" pathLength={1} cx="60" cy="68" r="3.4" />
            <path className="ink body" pathLength={1} d="M60 71.5 V84 M60 75 L50 69 M60 75 L70 69 M60 84 L53 93 M60 84 L67 93" />
          </g>
          </g>
          <path className="ink hair wind" pathLength={1} d="M42 90 V100 M78 88 V98 M50 96 V104" />
        </Card>

        {/* documentary: the clapper snaps shut and the timecode starts rolling */}
        <Card k="doc" label={t.items.doc}>
          <rect className="ink" pathLength={1} x="22" y="50" width="76" height="48" rx="2" />
          <path className="ink thin" pathLength={1} d="M22 62 H98 M34 74 H86" />
          <g className="clap">
            <rect className="ink" pathLength={1} x="22" y="38" width="76" height="11" />
            <path className="ink thin" pathLength={1} d="M30 38 L36 49 M44 38 L50 49 M58 38 L64 49 M72 38 L78 49 M86 38 L92 49" />
          </g>
          {/* REC and timecode sit on the slate, clear of the swinging stick */}
          <circle className="rec fade" cx="32" cy="85" r="2.6" />
          <text className="tc" x="38" y="88.5">{tc}</text>
        </Card>
      </ul>
    </div>
  );
}
