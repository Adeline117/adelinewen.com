"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { BRIDGE, H, NUT, PipaBody, STRINGS, W, base } from "./pipa";

// About › Off the clock. The interests in one line of type, each (but the pipa) with a
// small ink mark that moves on its own now and then, and when hovered or tapped; then the pipa itself, drawn
// lying on its side, with four strings you can pluck. Sweep across them and each string
// you cross bends where you crossed it and rings down as a damped oscillation (run only
// while something still moves). Sound is off until the visitor turns it on; then each
// pluck is a synthesised string at the pipa's open tuning, A D E A.
const L = {
  en: {
    h: "Off the clock",
    // the two with something to show say it in the sentence; the rest are named lightly.
    // A number is the index of a mark in GLYPHS: chess, poker, skydiving, film
    line: ["Pipa, to Level 10. ", [3, "Documentaries"], ", one of them past a million organic views on Douyin, China’s TikTok. Also ", [0, "chess"], ", ", [1, "poker"], " and ", [2, "skydiving"], "."],
    cap: "Four strings, tuned A D E A. Sweep across them to pluck.",
    on: "Sound on",
    off: "Sound off",
    aria: "A pipa; pluck its four strings with the pointer",
  },
  zh: {
    h: "工作之外",
    line: ["琵琶考到十级。拍", [3, "纪录片"], "，有一条在抖音自然播放破百万。闲时下", [0, "国际象棋"], "、打", [1, "德州扑克"], "，也", [2, "跳伞"], "。"],
    cap: "四根弦，定弦 A D E A。划过琴弦即可拨响。",
    on: "声音：开",
    off: "声音：关",
    aria: "一把琵琶，可以用鼠标或手指拨动四根弦",
  },
};

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
  // skydiving: a canopy alone (no figure): the dome opens, then it sways down on its lines
  <g key="sky">
    <g className="g-jumper">
      {/* dome, scalloped hem, and the two seams between its panels */}
      <path
        className="g-ink g-canopy"
        pathLength={1}
        d="M2.5 10 C2.5 5.2 6.8 2 12 2 C17.2 2 21.5 5.2 21.5 10 Q19.9 8.7 18.3 10 Q16.7 8.7 15.1 10 Q13.5 8.7 12 10 Q10.5 8.7 8.9 10 Q7.3 8.7 5.7 10 Q4.1 8.7 2.5 10 Z M8.9 10 C8.4 6.4 9.6 3.4 12 2 M15.1 10 C15.6 6.4 14.4 3.4 12 2"
      />
      {/* suspension lines gathering to a ring */}
      <path className="g-ink g-lines" pathLength={1} d="M2.5 10 L11.2 19.4 M8.9 10 L11.6 19.2 M15.1 10 L12.4 19.2 M21.5 10 L12.8 19.4" />
      <circle className="g-ink" pathLength={1} cx="12" cy="20.4" r="1.1" />
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
  const list = useRef<HTMLParagraphElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const state = useRef(STRINGS.map(() => ({ a: 0, v: 0, x: W / 2 })));
  const raf = useRef(0);
  const last = useRef<{ x: number; y: number } | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const [sound, setSound] = useState(false);
  const soundRef = useRef(false);
  const calm = useRef(false);
  const [playing, setPlaying] = useState<number[]>([]);
  const playTimers = useRef<number[]>([]);

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
    clearTimeout(playTimers.current[i]);
    setPlaying((v) => v.filter((x) => x !== i));
    requestAnimationFrame(() => setPlaying((v) => [...v, i]));
    playTimers.current[i] = window.setTimeout(() => setPlaying((v) => v.filter((x) => x !== i)), 2000);
  };

  // Left alone, the corner keeps breathing. When the line of interests comes into view
  // each mark plays its move in turn, then one every few seconds, round and round. When
  // the pipa comes into view its strings tremble once, low to high, without sound (the
  // hint that they can be plucked), and after that one string now and then stirs. All of
  // it pauses off screen and in a background tab.
  useEffect(() => {
    if (calm.current || !list.current || !svg.current) return;
    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => seen.set(e.target, e.isIntersecting)),
      { threshold: 0.5 },
    );
    io.observe(list.current);
    io.observe(svg.current);
    const live = (el: Element | null) => !!el && !!seen.get(el) && !document.hidden;
    let k = 0;
    let marks = 0;
    const markTick = () => {
      if (live(list.current)) {
        tap([3, 0, 1, 2][k % 4]); // in reading order
        k++;
      }
      marks = window.setTimeout(markTick, k > 0 && k < 4 ? 900 : 4200);
    };
    marks = window.setTimeout(markTick, 1200);
    let strummed = false;
    const later: number[] = [];
    const strings = window.setInterval(() => {
      if (!live(svg.current)) return;
      if (!strummed) {
        strummed = true;
        [3, 2, 1, 0].forEach((i, n) => later.push(window.setTimeout(() => pluck(i, W * 0.62, 1, -1), 1800 + n * 140)));
        return;
      }
      if (Math.random() < 0.45 && state.current.every((st) => st.a === 0)) {
        pluck(Math.floor(Math.random() * 4), 200 + Math.random() * 260, Math.random() < 0.5 ? -1 : 1, -2);
      }
    }, 2400);
    return () => {
      io.disconnect();
      clearTimeout(marks);
      clearInterval(strings);
      later.forEach(clearTimeout);
    };
    // tap and pluck read refs and a state setter only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="offclock">
      <h3 className="oc-h">{t.h}</h3>
      <p className="oc-list" ref={list}>
        {(t.line as (string | [number, string])[]).map((part, n) =>
          typeof part === "string" ? (
            part
          ) : (
            <span
              key={n}
              className={`oc-item oc-${["chess", "poker", "sky", "doc"][part[0]]}${playing.includes(part[0]) ? " on" : ""}`}
              onClick={() => tap(part[0])}
            >
              {part[1]}
              <svg className="oc-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                {GLYPHS[part[0]]}
              </svg>
            </span>
          ),
        )}
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
          <PipaBody />
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
