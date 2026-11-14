"use client";

import { useEffect, useRef, useState } from "react";
import { forceSimulation, forceLink, forceManyBody, forceX, forceY, forceCollide, type Simulation, type SimulationNodeDatum } from "d3-force";
import { NODES, LINKS } from "./sybil";

// HasciDB's real overlap map, live: one circle per airdrop, one line per pair of airdrops
// that share flagged wallets. It is a small physics model (springs along the lines,
// circles pushing each other apart and colliding), so dragging one project tugs its
// neighbours and the map settles again when you let go. Ink dots run along the heaviest
// lines, wallets moving between airdrops; they pause when the map is off screen.
// Save-Data: a still map, nothing runs.
const L = {
  en: {
    cap: "Sybil wallets shared across 15 Ethereum airdrops, from HasciDB. Circle area: Sybils caught in that airdrop; line weight: wallets caught in both (pairs sharing 2,000+). Drag a circle to pull the network.",
    read: (n: string, s: string) => `${n} · ${s} Sybils`,
    aria: "Network of 15 airdrops; the heaviest overlap is X2Y2 and LooksRare, with 75,343 shared Sybil wallets.",
  },
  zh: {
    cap: "15 个以太坊空投之间共享的 Sybil 钱包，数据来自 HasciDB。圆的面积是该空投检出的 Sybil 数，线的粗细是两边都被标记的钱包数（只画共享 2,000 个以上的组合）。拖动圆可以牵动整张网络。",
    read: (n: string, s: string) => `${n} · ${s} 个 Sybil`,
    aria: "15 个空投的关系网络；重叠最多的是 X2Y2 与 LooksRare，共有 75,343 个 Sybil 钱包。",
  },
};

const W = 600;
const H = 380;
// phones get a taller sheet: the same layout stretched to fill the narrow column, so the
// map is drawn larger and the labels of neighbouring airdrops stop overprinting
const TALL_H = 560;
const tallHome = (n: { x: number; y: number }) => ({ x: 30 + ((n.x - 56) * 540) / 488, y: 44 + ((n.y - 36) * 490) / 308 });
const fmt = new Intl.NumberFormat("en-US");
const MAXS = NODES[0].sybils;
const MAXV = LINKS[0][2];
const rad = (s: number) => 3 + Math.sqrt(s / MAXS) * 21;
const FLOWS = 12; // dots run along the 12 heaviest lines

type N = SimulationNodeDatum & { i: number; r: number };
type E = { source: N | number; target: N | number; v: number };

export default function SybilMap({ lang }: { lang: "en" | "zh" }) {
  const fig = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const sim = useRef<Simulation<N, E> | null>(null);
  const nodes = useRef<N[]>(NODES.map((n, i) => ({ i, r: rad(n.sybils), x: n.x, y: n.y })));
  const dragging = useRef<number | null>(null);
  const sheetH = useRef(H);
  const [on, setOn] = useState<number | null>(null);
  const t = L[lang];

  useEffect(() => {
    const el = fig.current;
    const root = svg.current;
    if (!el || !root) return;
    const calm =
      !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

    const ns = nodes.current;
    const tall = window.matchMedia("(max-width: 820px)").matches;
    const h = tall ? TALL_H : H;
    sheetH.current = h;
    const home = NODES.map((n) => (tall ? tallHome(n) : { x: n.x, y: n.y }));
    if (tall) {
      root.setAttribute("viewBox", `0 0 ${W} ${h}`);
      ns.forEach((n, i) => {
        n.x = home[i].x;
        n.y = home[i].y;
      });
    }
    const links: E[] = LINKS.map(([a, b, v]) => ({ source: a, target: b, v }));
    const linkEls = [...root.querySelectorAll<SVGPathElement>(".smap-links path")];
    const nodeEls = [...root.querySelectorAll<SVGGElement>(".smap-node")];
    const dots = [...root.querySelectorAll<SVGCircleElement>(".smap-flow circle")];

    const draw = () => {
      ns.forEach((n, i) => {
        // keep every circle on the sheet
        n.x = Math.max(n.r + 2, Math.min(W - n.r - 2, n.x!));
        n.y = Math.max(n.r + 24, Math.min(h - n.r - 2, n.y!)); // the top line is the readout's
        const g = nodeEls[i];
        const [c, hit, txt] = g.children as unknown as [SVGCircleElement, SVGCircleElement, SVGTextElement];
        c.setAttribute("cx", String(n.x));
        c.setAttribute("cy", String(n.y));
        hit.setAttribute("cx", String(n.x));
        hit.setAttribute("cy", String(n.y));
        const right = n.x! < W - 130;
        txt.setAttribute("x", String(right ? n.x! + n.r + 6 : n.x! - n.r - 6));
        txt.setAttribute("y", String(n.y! + 4));
        txt.setAttribute("text-anchor", right ? "start" : "end");
      });
      links.forEach((l, k) => {
        const a = l.source as N;
        const b = l.target as N;
        linkEls[k].setAttribute("d", `M${a.x} ${a.y}L${b.x} ${b.y}`);
      });
    };

    const s = forceSimulation<N, E>(ns)
      .force(
        "link",
        forceLink<N, E>(links)
          // each spring's rest length is the distance in the drawn layout, so at rest the map is exactly that layout
          .distance((l) => Math.hypot(home[(l.source as N).i].x - home[(l.target as N).i].x, home[(l.source as N).i].y - home[(l.target as N).i].y))
          .strength((l) => 0.04 + 0.5 * Math.sqrt(l.v / MAXV)),
      )
      .force("charge", forceManyBody<N>().strength(-30).distanceMax(120))
      // a light pull back toward the drawn layout, so the map always settles where it was designed to
      .force("homeX", forceX<N>((n) => home[n.i].x).strength(0.08))
      .force("homeY", forceY<N>((n) => home[n.i].y).strength(0.08))
      .force("collide", forceCollide<N>().radius((n) => n.r + 5).strength(0.9))
      .alpha(calm ? 0 : 0.35)
      .alphaDecay(0.03)
      .on("tick", draw);
    if (calm) {
      s.stop();
      for (let k = 0; k < 120; k++) s.tick();
    }
    draw();
    sim.current = s;

    // dots flowing along the heaviest lines, only while the map is on screen
    let raf = 0;
    let visible = false;
    const phase = dots.map((_, k) => (k * 0.37) % 1);
    let last = 0;
    const flow = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      dots.forEach((d, k) => {
        const l = links[k];
        const a = l.source as N;
        const b = l.target as N;
        phase[k] = (phase[k] + dt * (0.18 + 0.25 * Math.sqrt(l.v / MAXV))) % 1;
        const p = phase[k];
        d.setAttribute("cx", String(a.x! + (b.x! - a.x!) * p));
        d.setAttribute("cy", String(a.y! + (b.y! - a.y!) * p));
        d.style.opacity = String(Math.sin(p * Math.PI) * 0.8);
      });
      if (visible) raf = requestAnimationFrame(flow);
    };
    // dots wait until their lines are inked (when the map will draw itself in)
    const willReveal = !calm && el.getBoundingClientRect().top >= window.innerHeight;
    let inked = !willReveal;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      last = 0;
      if (visible && !calm && inked) raf = requestAnimationFrame(flow);
    });
    io.observe(el);

    // the first time it scrolls into view, ink it in
    let reveal: IntersectionObserver | null = null;
    let later = 0;
    if (willReveal) {
      el.classList.add("pre");
      reveal = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          reveal?.disconnect();
          el.classList.replace("pre", "play");
          s.alpha(0.5).restart();
          later = window.setTimeout(() => {
            inked = true;
            if (visible) {
              cancelAnimationFrame(raf);
              last = 0;
              raf = requestAnimationFrame(flow);
            }
          }, 1800);
        },
        { threshold: 0.4 },
      );
      reveal.observe(el);
    }

    return () => {
      s.stop();
      io.disconnect();
      reveal?.disconnect();
      clearTimeout(later);
      cancelAnimationFrame(raf);
    };
  }, []);

  // pointer position in the map's own 600 x 380 units
  const at = (e: React.PointerEvent) => {
    const m = svg.current?.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };
  const grab = (i: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {}
    const n = nodes.current[i];
    const p = at(e);
    n.fx = p.x;
    n.fy = p.y;
    dragging.current = i;
    setOn(i);
    sim.current?.alphaTarget(0.3).restart();
    // a ring goes out from the circle you picked up
    const ring = svg.current?.querySelector<SVGCircleElement>(".smap-ring");
    if (ring) {
      ring.setAttribute("cx", String(n.x));
      ring.setAttribute("cy", String(n.y));
      ring.animate([{ r: `${n.r}px`, opacity: 0.5 }, { r: `${n.r + 26}px`, opacity: 0 }] as Keyframe[], { duration: 700, easing: getComputedStyle(document.documentElement).getPropertyValue("--ease").trim() });
    }
  };
  const move = (e: React.PointerEvent) => {
    const i = dragging.current;
    if (i === null) return;
    const n = nodes.current[i];
    const p = at(e);
    n.fx = Math.max(n.r, Math.min(W - n.r, p.x));
    n.fy = Math.max(n.r + 24, Math.min(sheetH.current - n.r, p.y));
  };
  const drop = (e: React.PointerEvent) => {
    const i = dragging.current;
    if (i === null) return;
    // touch has no hover-out: let the trace fade on its own
    if (e.pointerType !== "mouse") window.setTimeout(() => dragging.current === null && setOn(null), 1200);
    const n = nodes.current[i];
    n.fx = null;
    n.fy = null;
    dragging.current = null;
    sim.current?.alphaTarget(0);
  };

  const lit = (a: number, b: number) => on === null || on === a || on === b;

  return (
    <figure className={`smap${on === null ? "" : " tracing"}`} ref={fig}>
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.aria} onMouseLeave={() => dragging.current === null && setOn(null)}>
        <g className="smap-links">
          {LINKS.map(([a, b, v], i) => {
            const k = Math.sqrt(v / MAXV);
            return (
              <path
                key={`${a}-${b}`}
                d={`M${NODES[a].x} ${NODES[a].y}L${NODES[b].x} ${NODES[b].y}`}
                pathLength={1}
                className={lit(a, b) ? "lit" : undefined}
                style={{ strokeWidth: 0.5 + k * 3.5, ["--o" as string]: 0.14 + k * 0.6, ["--d" as string]: `${0.5 + i * Math.min(0.022, 0.8 / LINKS.length)}s` }}
              />
            );
          })}
        </g>
        <g className="smap-flow" aria-hidden="true">
          {LINKS.slice(0, FLOWS).map(([a, b]) => (
            <circle key={`${a}-${b}`} r="1.8" cx={NODES[a].x} cy={NODES[a].y} style={{ opacity: 0 }} />
          ))}
        </g>
        <circle className="smap-ring" r="0" cx="0" cy="0" />
        <g className="smap-nodes">
          {NODES.map((n, i) => {
            const r = rad(n.sybils);
            const right = n.x < W - 130;
            return (
              <g
                key={n.name}
                className={`smap-node${i < 8 ? " major" : ""}${on === i ? " on" : ""}`}
                style={{ ["--d" as string]: `${i * 0.03}s` }}
                onMouseEnter={() => dragging.current === null && setOn(i)}
                onMouseLeave={() => dragging.current === null && setOn(null)}
                onPointerDown={grab(i)}
                onPointerMove={move}
                onPointerUp={drop}
                onPointerCancel={drop}
              >
                <circle cx={n.x} cy={n.y} r={r} />
                <circle className="hit" cx={n.x} cy={n.y} r={Math.max(r, 14)} />
                <text x={right ? n.x + r + 6 : n.x - r - 6} y={n.y + 4} textAnchor={right ? "start" : "end"}>
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
