"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

// About › Off the clock. The interests in one line of type, each (but the pipa) with a
// small ink mark that moves once when hovered or tapped; then the pipa itself, drawn
// lying on its side, with four strings you can pluck. Sweep across them and each string
// you cross bends where you crossed it and rings down as a damped oscillation (run only
// while something still moves). Sound is off until the visitor turns it on; then each
// pluck is a synthesised string at the pipa's open tuning, A D E A.
const L = {
  en: {
    h: "Off the clock",
    pipa: "Pipa (Level 10)",
    rest: ["chess", "poker", "skydiving", "documentary film"],
    cap: "Four strings, tuned A D E A. Sweep across them to pluck.",
    on: "Sound on",
    off: "Sound off",
    aria: "A pipa; pluck its four strings with the pointer",
  },
  zh: {
    h: "工作之外",
    pipa: "琵琶十级",
    rest: ["国际象棋", "德州扑克", "跳伞", "纪录片拍摄"],
    cap: "四根弦，定弦 A D E A。划过琴弦即可拨响。",
    on: "声音：开",
    off: "声音：关",
    aria: "一把琵琶，可以用鼠标或手指拨动四根弦",
  },
};

const W = 600;
const H = 200;
const NUT = 74;
const BRIDGE = 536;
// top to bottom: the thinnest, highest string first; they fan out from nut to bridge
const STRINGS = [
  { y0: 94, y1: 81, f: 220.0, w: 0.8 },
  { y0: 98, y1: 93.7, f: 164.81, w: 1.0 },
  { y0: 102, y1: 106.3, f: 146.83, w: 1.2 },
  { y0: 106, y1: 119, f: 110.0, w: 1.5 },
];
const base = (s: (typeof STRINGS)[number], x: number) => s.y0 + ((s.y1 - s.y0) * (x - NUT)) / (BRIDGE - NUT);
// frets at equal-tempered steps from the nut: the first four are the tall xiang on the
// neck, the rest the thin pin frets running down the soundboard
const span = (x: number) => [base(STRINGS[0], x), base(STRINGS[3], x)];
const FRETS = Array.from({ length: 17 }, (_, k) => NUT + (BRIDGE - NUT) * (1 - 2 ** (-(k + 1) / 12)));
const XIANG = FRETS.slice(0, 4)
  .map((x) => `M${x.toFixed(1)} 88.5V111.5`)
  .join("");
const PIN = FRETS.slice(4)
  .map((x) => {
    const [a, b] = span(x);
    return `M${x.toFixed(1)} ${(a - 5).toFixed(1)}V${(b + 5).toFixed(1)}`;
  })
  .join("");
// the body: a narrow neck that swells, without a step, into the pear
const BODY =
  "M74 89 C120 88.5 160 87.5 182 85.5 C232 81 286 46 362 24 C424 8 486 6 532 13 C574 20 598 56 598 100 " +
  "C598 144 574 180 532 187 C486 194 424 192 362 176 C286 154 232 119 182 114.5 C160 112.5 120 111.5 74 111";
const OMEGA = 2 * Math.PI * 6.5;
const DAMP = 2 * 0.05 * OMEGA;

function pluckSound(ctx: AudioContext, f: number, gain: number) {
  // Karplus-Strong: noise round a delay line that averages itself down
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * 1.8);
  const buf = ctx.createBuffer(1, len, sr);
  const d = buf.getChannelData(0);
  const p = Math.round(sr / f);
  for (let i = 0; i < p; i++) d[i] = Math.random() * 2 - 1;
  for (let i = p; i < len; i++) d[i] = 0.996 * 0.5 * (d[i - p] + d[i - p + 1]);
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  g.gain.value = gain;
  src.buffer = buf;
  src.connect(g).connect(ctx.destination);
  src.start();
}

// small ink marks, 24 x 24, drawn in currentColor
const GLYPHS: ReactNode[] = [
  // chess: a knight that hops an L
  <g key="chess">
    <path className="g-ink" pathLength={1} d="M5 22H19" />
    <g className="g-knight">
      <path className="g-ink" pathLength={1} d="M8 20 C8 16 10 14 11.5 12 C9.5 12.5 7 11.5 5.5 9.5 L10 4.5 L11 2 L12.5 4 C16.5 5 18.5 9.5 17 14 L17 20 Z" />
      <circle className="g-fill" cx="10.6" cy="6.8" r="0.8" />
    </g>
  </g>,
  // poker: a card that turns over to the ace of spades
  <g key="poker">
    <g className="g-card">
      <rect className="g-ink g-back" pathLength={1} x="6" y="3" width="12" height="18" rx="2" />
      <rect className="g-ink g-back" pathLength={1} x="8.75" y="5.75" width="6.5" height="12.5" rx="1" />
      <g className="g-face">
        <rect className="g-ink" pathLength={1} x="6" y="3" width="12" height="18" rx="2" />
        <path className="g-fill" d="M12 8 C14 10.5 16 11.5 16 13.5 C16 15 14.6 15.8 13.2 15.2 L14 17.5 H10 L10.8 15.2 C9.4 15.8 8 15 8 13.5 C8 11.5 10 10.5 12 8 Z" />
      </g>
    </g>
  </g>,
  // skydiving: the canopy opens and the jumper drifts down
  <g key="sky">
    <g className="g-jumper">
      <path className="g-ink g-canopy" pathLength={1} d="M3 9 Q12 0 21 9 Q16.5 7 12 9 Q7.5 7 3 9 M3 9 L11 16 M21 9 L13 16 M12 9 V16" />
      <circle className="g-ink" pathLength={1} cx="12" cy="17.5" r="1.6" />
      <path className="g-ink" pathLength={1} d="M12 19 V22 M12 20 L9.5 18.5 M12 20 L14.5 18.5" />
    </g>
  </g>,
  // documentary: a frame, the REC light comes on
  <g key="doc">
    <rect className="g-ink" pathLength={1} x="2.5" y="6" width="14" height="12" rx="1.5" />
    <path className="g-ink" pathLength={1} d="M16.5 10 L21.5 7 V17 L16.5 14" />
    <circle className="g-rec" cx="6.5" cy="9.8" r="1.6" />
  </g>,
];

export default function OffClock({ lang }: { lang: "en" | "zh" }) {
  const t = L[lang];
  const svg = useRef<SVGSVGElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const state = useRef(STRINGS.map(() => ({ a: 0, v: 0, x: W / 2 })));
  const raf = useRef(0);
  const last = useRef<{ x: number; y: number } | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const [sound, setSound] = useState(false);
  const soundRef = useRef(false);
  const calm = useRef(false);
  const [tapped, setTapped] = useState<number | null>(null);

  useEffect(() => {
    calm.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const d = (i: number) => {
    const s = STRINGS[i];
    const { a, x } = state.current[i];
    return `M${NUT} ${s.y0}Q${x.toFixed(1)} ${(base(s, x) + 2 * a).toFixed(2)} ${BRIDGE} ${s.y1}`;
  };
  const draw = () => STRINGS.forEach((_, i) => paths.current[i]?.setAttribute("d", d(i)));

  const run = () => {
    let prev = 0;
    const step = (now: number) => {
      const dt = prev ? Math.min(0.032, (now - prev) / 1000) : 0.016;
      prev = now;
      let moving = false;
      for (const st of state.current) {
        st.v += (-OMEGA * OMEGA * st.a - DAMP * st.v) * dt;
        st.a += st.v * dt;
        if (Math.abs(st.a) > 0.03 || Math.abs(st.v) > 0.3) moving = true;
        else st.a = st.v = 0;
      }
      draw();
      raf.current = moving ? requestAnimationFrame(step) : 0;
    };
    if (!raf.current) raf.current = requestAnimationFrame(step);
  };

  const pluck = (i: number, x: number, dir: number, force: number) => {
    const st = state.current[i];
    if (!calm.current) {
      st.a = dir * Math.min(8, 3.5 + force);
      st.v = 0;
      st.x = Math.max(NUT + 60, Math.min(BRIDGE - 40, x));
      run();
    }
    if (soundRef.current && audio.current) pluckSound(audio.current, STRINGS[i].f, 0.12 + Math.min(0.12, force * 0.02));
  };

  // pointer in viewBox units (the drawing keeps its aspect ratio)
  const at = (e: PointerEvent) => {
    const m = svg.current?.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const p = at(e);
    const prev = last.current;
    last.current = p;
    if (!prev || p.x < NUT || p.x > BRIDGE) return;
    STRINGS.forEach((s, i) => {
      if ((prev.y - base(s, prev.x)) * (p.y - base(s, p.x)) < 0) pluck(i, p.x, Math.sign(p.y - prev.y), Math.abs(p.y - prev.y) * 0.4);
    });
  };

  const onDown = (e: PointerEvent) => {
    const p = at(e);
    if (p.x < NUT || p.x > BRIDGE) return;
    let best = 0;
    STRINGS.forEach((s, i) => {
      if (Math.abs(base(s, p.x) - p.y) < Math.abs(base(STRINGS[best], p.x) - p.y)) best = i;
    });
    if (Math.abs(base(STRINGS[best], p.x) - p.y) < 18) pluck(best, p.x, 1, 4);
  };

  const toggle = () => {
    const next = !soundRef.current;
    soundRef.current = next;
    setSound(next);
    if (!next) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    audio.current ??= new AC();
    if (audio.current.state === "suspended") audio.current.resume();
    // a soft strum, low to high, so turning sound on confirms itself
    [3, 2, 1, 0].forEach((i, k) => window.setTimeout(() => pluck(i, W * 0.6, 1, 2), k * 70));
  };

  // touch has no hover: a tap plays the mark's move once
  const tap = (i: number) => {
    setTapped(null);
    requestAnimationFrame(() => setTapped(i));
    window.setTimeout(() => setTapped((v) => (v === i ? null : v)), 1800);
  };

  const sep = lang === "zh" ? "、" : ", ";
  return (
    <div className="offclock">
      <h3 className="oc-h">{t.h}</h3>
      <p className="oc-list">
        {t.pipa}
        {t.rest.map((x, i) => (
          <span key={x}>
            {sep}
            <span
              className={`oc-item oc-${["chess", "poker", "sky", "doc"][i]}${tapped === i ? " on" : ""}`}
              onClick={() => tap(i)}
            >
              {x}
              <svg className="oc-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                {GLYPHS[i]}
              </svg>
            </span>
          </span>
        ))}
        {lang === "zh" ? "。" : "."}
      </p>
      <figure className="strings">
        <svg
          ref={svg}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={t.aria}
          onPointerMove={onMove}
          onPointerLeave={() => (last.current = null)}
          onPointerDown={onDown}
        >
          <path className="pipa-fill" d={`${BODY} Z`} />
          <g className="pipa-body">
            {/* the head, bent back, a pegbox ending in a curled finial */}
            <path pathLength={1} d="M74 89 L32 92 C22 92 14 90 10 95 C6 100 10 106 16 105 C20 104.5 21 100 17 99.5 M74 111 L32 108 C24 108 18 107 16 105" />
            {/* four long pegs, two each side, swept back toward the head */}
            <path pathLength={1} d="M62 89.5 L52 70 C50 66 55 64 57 68 L66 89.2 M42 91 L32 71 C30 67 35 65 37 69 L46 90.7 M62 110.5 L52 130 C50 134 55 136 57 132 L66 110.8 M42 109 L32 129 C30 133 35 135 37 131 L46 109.3" />
            {/* the nut */}
            <path pathLength={1} d="M74 89V111" />
            <path pathLength={1} d={BODY} />
            <path pathLength={1} className="xiang" d={XIANG} />
            <path pathLength={1} className="frets" d={PIN} />
            {/* the fu shou, the carved tailpiece the strings tie to */}
            <path pathLength={1} d="M532 74 C527 70 527 64 534 64 C539 66 540 72 540 78 V122 C540 128 539 134 534 136 C527 136 527 130 532 126 Z" />
          </g>
          {STRINGS.map((s, i) => (
            <path
              key={i}
              ref={(el) => {
                paths.current[i] = el;
              }}
              className="str"
              pathLength={1}
              style={{ strokeWidth: s.w, ["--i" as string]: i }}
              d={`M${NUT} ${s.y0}Q${W / 2} ${base(s, W / 2)} ${BRIDGE} ${s.y1}`}
            />
          ))}
        </svg>
        <figcaption>
          <span>{t.cap}</span>
          <button type="button" className={`str-sound${sound ? " on" : ""}`} aria-pressed={sound} onClick={toggle}>
            {sound ? t.on : t.off}
          </button>
        </figcaption>
      </figure>
    </div>
  );
}
