"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { NODES, LINKS } from "./sybil";

// HasciDB's real overlap map: one circle per airdrop, one line per pair of airdrops
// that share flagged wallets. It draws itself once when first scrolled into view
// (circles, then lines, heaviest first) and then holds still. Hover a project to
// trace its connections; drag one to pull it around (the lines follow).
const L = {
  en: {
    cap: "Sybil wallets shared across 15 Ethereum airdrops, from HasciDB. Circle area: Sybils caught in that airdrop; line weight: wallets caught in both (pairs sharing 2,000+). Circles can be dragged.",
    read: (n: string, s: string) => `${n} · ${s} Sybils`,
    aria: "Network of 15 airdrops; the heaviest overlap is X2Y2 and LooksRare, with 75,343 shared Sybil wallets.",
  },
  zh: {
    cap: "15 个以太坊空投之间共享的 Sybil 钱包，数据来自 HasciDB。圆的面积是该空投检出的 Sybil 数，线的粗细是两边都被标记的钱包数（只画共享 2,000 个以上的组合）。圆可以拖动。",
    read: (n: string, s: string) => `${n} · ${s} 个 Sybil`,
    aria: "15 个空投的关系网络；重叠最多的是 X2Y2 与 LooksRare，共有 75,343 个 Sybil 钱包。",
  },
};

const fmt = new Intl.NumberFormat("en-US");
const MAXS = NODES[0].sybils;
const MAXV = LINKS[0][2];
const r = (s: number) => 3 + Math.sqrt(s / MAXS) * 21;

export default function SybilMap({ lang }: { lang: "en" | "zh" }) {
  const fig = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [on, setOn] = useState<number | null>(null);
  const [pos, setPos] = useState(() => NODES.map((n) => ({ x: n.x, y: n.y })));
  const drag = useRef<{ i: number; dx: number; dy: number } | null>(null);
  const t = L[lang];

  // pointer position in the map's own 600 x 380 units
  const at = (e: PointerEvent) => {
    const m = svg.current?.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };
  const grab = (i: number) => (e: PointerEvent) => {
    e.preventDefault();
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {}
    const p = at(e);
    drag.current = { i, dx: pos[i].x - p.x, dy: pos[i].y - p.y };
    setOn(i);
  };
  const move = (e: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const p = at(e);
    const x = Math.min(590, Math.max(10, p.x + d.dx));
    const y = Math.min(370, Math.max(10, p.y + d.dy));
    setPos((q) => q.map((v, k) => (k === d.i ? { x, y } : v)));
  };
  const drop = () => {
    drag.current = null;
  };

  useEffect(() => {
    const el = fig.current;
    if (!el) return;
    const calm =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    // already on screen at load: just show it
    if (calm || el.getBoundingClientRect().top < window.innerHeight) return;
    el.classList.add("pre");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        el.classList.replace("pre", "play");
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const lit = (a: number, b: number) => on === null || on === a || on === b;

  return (
    <figure className={`smap${on === null ? "" : " tracing"}`} ref={fig}>
      <svg ref={svg} viewBox="0 0 600 380" role="img" aria-label={t.aria} onMouseLeave={() => !drag.current && setOn(null)}>
        <g className="smap-links">
          {LINKS.map(([a, b, v], i) => {
            const k = Math.sqrt(v / MAXV);
            return (
              <path
                key={`${a}-${b}`}
                d={`M${pos[a].x} ${pos[a].y}L${pos[b].x} ${pos[b].y}`}
                pathLength={1}
                className={lit(a, b) ? "lit" : undefined}
                style={{ strokeWidth: 0.5 + k * 3.5, ["--o" as string]: 0.14 + k * 0.6, ["--d" as string]: `${0.5 + i * 0.022}s` }}
              />
            );
          })}
        </g>
        <g className="smap-nodes">
          {NODES.map((n, i) => {
            const rad = r(n.sybils);
            const { x, y } = pos[i];
            const right = x < 470;
            return (
              <g
                key={n.name}
                className={`smap-node${i < 8 ? " major" : ""}${on === i ? " on" : ""}`}
                style={{ ["--d" as string]: `${i * 0.03}s` }}
                onMouseEnter={() => !drag.current && setOn(i)}
                onPointerDown={grab(i)}
                onPointerMove={move}
                onPointerUp={drop}
                onPointerCancel={drop}
              >
                <circle cx={x} cy={y} r={rad} />
                <circle className="hit" cx={x} cy={y} r={Math.max(rad, 14)} />
                <text x={right ? x + rad + 6 : x - rad - 6} y={y + 4} textAnchor={right ? "start" : "end"}>
                  {n.name}
                </text>
              </g>
            );
          })}
        </g>
        <text className="smap-read" x="0" y="12" aria-hidden="true">
          {on !== null && t.read(NODES[on].name, fmt.format(NODES[on].sybils))}
        </text>
      </svg>
      <figcaption>{t.cap}</figcaption>
    </figure>
  );
}
