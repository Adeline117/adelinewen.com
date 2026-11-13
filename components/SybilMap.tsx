"use client";

import { useEffect, useRef, useState } from "react";
import { NODES, LINKS } from "./sybil";

// HasciDB's real overlap map: one circle per airdrop, one line per pair of airdrops
// that share flagged wallets. It draws itself once when first scrolled into view
// (circles, then lines, heaviest first) and then holds still. Hover a project to
// trace its connections.
const L = {
  en: {
    cap: "Sybil wallets shared across 15 Ethereum airdrops, from HasciDB. Circle area: Sybils caught in that airdrop; line weight: wallets caught in both (pairs sharing 2,000+).",
    read: (n: string, s: string) => `${n} · ${s} Sybils`,
    aria: "Network of 15 airdrops; the heaviest overlap is X2Y2 and LooksRare, with 75,343 shared Sybil wallets.",
  },
  zh: {
    cap: "15 个以太坊空投之间共享的 Sybil 钱包，数据来自 HasciDB。圆的面积是该空投检出的 Sybil 数，线的粗细是两边都被标记的钱包数（只画共享 2,000 个以上的组合）。",
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
  const [on, setOn] = useState<number | null>(null);
  const t = L[lang];

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
      <svg viewBox="0 0 600 380" role="img" aria-label={t.aria} onMouseLeave={() => setOn(null)}>
        <g className="smap-links">
          {LINKS.map(([a, b, v], i) => {
            const k = Math.sqrt(v / MAXV);
            return (
              <path
                key={`${a}-${b}`}
                d={`M${NODES[a].x} ${NODES[a].y}L${NODES[b].x} ${NODES[b].y}`}
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
            const right = n.x < 470;
            return (
              <g
                key={n.name}
                className={`smap-node${i < 8 ? " major" : ""}${on === i ? " on" : ""}`}
                style={{ ["--d" as string]: `${i * 0.03}s` }}
                onMouseEnter={() => setOn(i)}
              >
                <circle cx={n.x} cy={n.y} r={rad} />
                <circle className="hit" cx={n.x} cy={n.y} r={Math.max(rad, 14)} />
                <text x={right ? n.x + rad + 6 : n.x - rad - 6} y={n.y + 4} textAnchor={right ? "start" : "end"}>
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
