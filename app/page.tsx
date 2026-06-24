"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const InfinityHero = dynamic(() => import("@/components/InfinityHero"), { ssr: false });

const STATIONS = [0.18, 0.42, 0.68, 0.92];
const DATA = [
  { idx: "01 — Work", title: ["Selected ", "builds", "."], desc: "Crafted, precise interfaces and the systems behind them." },
  { idx: "02 — About", title: ["Where it ", "meets", "."], desc: "The crossing point — research and making, one continuous loop. This is me." },
  { idx: "03 — Research", title: ["Decentralized ", "systems", "."], desc: "UW Decentralized Computing Lab — Sybil detection & on-chain analysis." },
  { idx: "04 — Contact", title: ["Let's ", "build", "."], desc: "Back to the start. Open to 2026 opportunities — say hello." },
];
const NAV = ["Work", "About", "Research", "Contact"];

export default function Home() {
  const [active, setActive] = useState(0);
  const [introOpacity, setIntroOpacity] = useState(1);
  const [dark, setDark] = useState(false);
  const trackRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const len = track ? track.getTotalLength() : 0;

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const u = max > 0 ? window.scrollY / max : 0;
      setIntroOpacity(Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.5)));

      let best = 0;
      let bd = 9;
      STATIONS.forEach((s, i) => {
        const d = Math.abs(s - u);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      setActive(best);

      if (track && beadRef.current) {
        const pt = track.getPointAtLength((u % 1) * len);
        beadRef.current.setAttribute("cx", String(pt.x));
        beadRef.current.setAttribute("cy", String(pt.y));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const goTo = (i: number) => {
    const max = document.body.scrollHeight - window.innerHeight;
    window.scrollTo({ top: STATIONS[i] * max, behavior: "smooth" });
  };

  const d = DATA[active];

  return (
    <>
      <InfinityHero />
      <div className="grain" />
      <div className="scrim t" />
      <div className="scrim b" />

      <nav>
        <div className="logo">Adeline Wen</div>
        <div className="links">
          {NAV.map((label, i) => (
            <button key={label} className={i === active ? "active" : ""} onClick={() => goTo(i)}>
              <span className="i">{String(i + 1).padStart(2, "0")}</span>
              {label}
            </button>
          ))}
        </div>
      </nav>

      <button className="toggle" onClick={() => setDark((v) => !v)}>
        ◐ Light / Dark
      </button>

      <div className="intro" style={{ opacity: introOpacity }}>
        <div className="meta">Software Engineer · Researcher</div>
        <h1>
          The <em>infinite</em> loop
          <br />
          of craft.
        </h1>
        <div className="hint">scroll to travel the loop ↓</div>
      </div>

      <div className="station" key={active}>
        <div className="idx">{d.idx}</div>
        <h2>
          {d.title[0]}
          <em>{d.title[1]}</em>
          {d.title[2]}
        </h2>
        <p>{d.desc}</p>
      </div>

      <div className="prog">
        <div className="count">
          <b>{String(active + 1).padStart(2, "0")}</b> / 04
        </div>
        <svg width="84" height="44" viewBox="0 0 84 44">
          <path
            ref={trackRef}
            className="track"
            d="M42,22 C42,6 18,6 14,22 C10,38 42,38 42,22 C42,6 74,6 70,22 C66,38 42,38 42,22 Z"
          />
          <circle ref={beadRef} className="bead" r="3" cx="42" cy="22" />
        </svg>
      </div>

      <div className="spacer" />
    </>
  );
}
