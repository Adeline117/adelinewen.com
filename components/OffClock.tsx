"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

// About › Off the clock. The interests from the CV in one line of type, and one thing to
// play with: the four strings of a pipa, drawn as hairlines. Sweep across them and each
// string you cross is plucked: it bends where you crossed it and rings down as a damped
// oscillation (a small physics model, run only while something is still moving). Sound
// is off until the visitor turns it on; then each pluck is a synthesised string at the
// pipa's open tuning, A D E A. On touch screens a tap plucks the nearest string.
const L = {
  en: {
    h: "Off the clock",
    list: ["Pipa (Level 10, the highest grade)", "chess", "poker", "skydiving", "documentary film"],
    cap: "A pipa’s four strings, tuned A D E A. Sweep across them to pluck.",
    on: "Sound on",
    off: "Sound off",
    aria: "Four pipa strings; pluck them with the pointer",
  },
  zh: {
    h: "工作之外",
    list: ["琵琶（十级，最高级）", "国际象棋", "德州扑克", "跳伞", "纪录片拍摄"],
    cap: "琵琶的四根弦，定弦 A D E A。划过琴弦即可拨响。",
    on: "声音：开",
    off: "声音：关",
    aria: "四根琵琶弦，可以用鼠标或手指拨动",
  },
};

const W = 600; // viewBox width; the svg stretches to its column
const H = 112;
// top to bottom: the thinnest, highest string first
const STRINGS = [
  { y: 22, f: 220.0, note: "A", w: 0.8 },
  { y: 44, f: 164.81, note: "E", w: 1.0 },
  { y: 66, f: 146.83, note: "D", w: 1.2 },
  { y: 88, f: 110.0, note: "A", w: 1.5 },
];
const OMEGA = 2 * Math.PI * 6.5; // the drawn string swings ~6.5 times a second
const DAMP = 2 * 0.05 * OMEGA; // and rings down over about two seconds

function pluckSound(ctx: AudioContext, f: number, gain: number) {
  // Karplus-Strong: noise round a delay line that averages itself, like a string
  // losing its brightness after the pick leaves it
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

export default function OffClock({ lang }: { lang: "en" | "zh" }) {
  const t = L[lang];
  const svg = useRef<SVGSVGElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const state = useRef(STRINGS.map(() => ({ a: 0, v: 0, x: W / 2 })));
  const raf = useRef(0);
  const last = useRef<{ y: number } | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const [sound, setSound] = useState(false);
  const soundRef = useRef(false);
  const calm = useRef(false);

  useEffect(() => {
    calm.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const draw = () => {
    STRINGS.forEach((s, i) => {
      const { a, x } = state.current[i];
      // a quadratic through the pluck point: the string bends at the finger, not the middle
      paths.current[i]?.setAttribute("d", `M0 ${s.y}Q${x.toFixed(1)} ${(s.y + 2 * a).toFixed(2)} ${W} ${s.y}`);
    });
  };

  const run = () => {
    let prev = 0;
    const step = (now: number) => {
      const dt = prev ? Math.min(0.032, (now - prev) / 1000) : 0.016;
      prev = now;
      let moving = false;
      for (const st of state.current) {
        // damped spring, semi-implicit Euler
        st.v += (-OMEGA * OMEGA * st.a - DAMP * st.v) * dt;
        st.a += st.v * dt;
        if (Math.abs(st.a) > 0.03 || Math.abs(st.v) > 0.3) moving = true;
        else {
          st.a = 0;
          st.v = 0;
        }
      }
      draw();
      raf.current = moving ? requestAnimationFrame(step) : 0;
    };
    if (!raf.current) raf.current = requestAnimationFrame(step);
  };

  const pluck = (i: number, x: number, dir: number, force: number) => {
    const st = state.current[i];
    if (!calm.current) {
      st.a = dir * Math.min(10, 4.5 + force);
      st.v = 0;
      st.x = Math.max(60, Math.min(W - 60, x));
      run();
    }
    if (soundRef.current && audio.current) pluckSound(audio.current, STRINGS[i].f, 0.12 + Math.min(0.12, force * 0.02));
  };

  // pointer position in viewBox units (the svg is stretched horizontally)
  const at = (e: PointerEvent) => {
    const r = svg.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const p = at(e);
    const prev = last.current;
    last.current = { y: p.y };
    if (!prev) return;
    STRINGS.forEach((s, i) => {
      if ((prev.y - s.y) * (p.y - s.y) < 0) pluck(i, p.x, Math.sign(p.y - prev.y), Math.abs(p.y - prev.y) * 0.4);
    });
  };

  const onDown = (e: PointerEvent) => {
    const p = at(e);
    let best = 0;
    STRINGS.forEach((s, i) => {
      if (Math.abs(s.y - p.y) < Math.abs(STRINGS[best].y - p.y)) best = i;
    });
    if (Math.abs(STRINGS[best].y - p.y) < 16) pluck(best, p.x, 1, 4);
  };

  const toggle = () => {
    const next = !soundRef.current;
    soundRef.current = next;
    setSound(next);
    if (next) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      audio.current ??= new AC();
      if (audio.current.state === "suspended") audio.current.resume();
      // a soft strum, low to high, so turning sound on is its own confirmation
      [3, 2, 1, 0].forEach((i, k) => window.setTimeout(() => pluck(i, W * 0.62, 1, 2), k * 70));
    }
  };

  return (
    <div className="offclock">
      <h3 className="oc-h">{t.h}</h3>
      <p className="oc-list">
        {t.list.map((x, i) => (
          <span key={x}>
            {x}
            {i < t.list.length - 1 && <span className="oc-sep" aria-hidden="true">{lang === "zh" ? "、" : ", "}</span>}
          </span>
        ))}
        {lang === "zh" ? "。" : "."}
      </p>
      <figure className="strings">
        <div className="str-board">
          <ol className="str-notes" aria-hidden="true">
            {STRINGS.map((s, i) => (
              <li key={i} style={{ top: `${(s.y / H) * 100}%` }}>
                {s.note}
              </li>
            ))}
          </ol>
          <svg
            ref={svg}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={t.aria}
            onPointerMove={onMove}
            onPointerLeave={() => (last.current = null)}
            onPointerDown={onDown}
          >
            <path className="str-nut" d={`M1 10V${H - 10}M${W - 1} 10V${H - 10}`} />
            {STRINGS.map((s, i) => (
              <path
                key={i}
                ref={(el) => {
                  paths.current[i] = el;
                }}
                className="str"
                pathLength={1}
                style={{ strokeWidth: s.w, ["--i" as string]: i }}
                d={`M0 ${s.y}Q${W / 2} ${s.y} ${W} ${s.y}`}
              />
            ))}
          </svg>
        </div>
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
