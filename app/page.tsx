"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const InfinityHero = dynamic(() => import("@/components/InfinityHero"), { ssr: false });

const NAV = ["Work", "About", "Research", "Contact"];

export default function Home() {
  const [active, setActive] = useState(0);
  const [dark, setDark] = useState(false);
  const secRefs = useRef<(HTMLElement | null)[]>([]);
  const trackRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<SVGCircleElement>(null);

  // reveal-on-scroll + active section tracking
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("on");
            const i = Number((e.target as HTMLElement).dataset.i);
            if (!Number.isNaN(i)) setActive(i);
          }
        });
      },
      { threshold: 0.55 }
    );
    secRefs.current.forEach((s) => s && obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // mini-∞ progress bead driven by scroll
  useEffect(() => {
    const track = trackRef.current;
    const len = track ? track.getTotalLength() : 0;
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const u = max > 0 ? window.scrollY / max : 0;
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

  const goTo = (i: number) => secRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
  const setRef = (i: number) => (el: HTMLElement | null) => {
    secRefs.current[i] = el;
  };

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

      {/* Hero — the 3D glass infinity */}
      <header className="hero">
        <div className="meta">Software Engineer · Researcher</div>
        <h1>
          The <em>infinite</em> loop
          <br />
          of craft.
        </h1>
        <div className="hint">scroll to travel the loop ↓</div>
      </header>

      {/* 01 — Work */}
      <section className="sec" id="work" data-i="0" ref={setRef(0)}>
        <div className="inner">
          <div className="left">
            <div className="label">01 — Selected Work</div>
            <h2>
              Things I&apos;ve <em>built</em>.
            </h2>
            <p className="lead">Crafted, precise interfaces and the systems behind them.</p>
            <a className="more" href="#">
              All projects →
            </a>
          </div>
          <div className="right">
            <ul className="rows">
              <li><span className="n">Portfolio 3D</span><span>2026 · WebGL</span></li>
              <li><span className="n">Trading Engine</span><span>2025 · Rust</span></li>
              <li><span className="n">Design System</span><span>2025 · React</span></li>
              <li><span className="n">HasciDB UI</span><span>2024 · Next.js</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* 02 — About */}
      <section className="sec" id="about" data-i="1" ref={setRef(1)}>
        <div className="inner">
          <div className="left">
            <div className="label">02 — About · the crossing</div>
            <h2>
              Where it all <em>meets</em>.
            </h2>
            <p className="lead">
              CS @ University of Washington. The point where research and making become one
              continuous loop — that&apos;s me.
            </p>
            <a className="more" href="#">
              More about me →
            </a>
          </div>
          <div className="right">
            <div className="about">
              <div className="portrait" />
              <div className="tags">
                <span>React</span><span>Three.js</span><span>Rust</span>
                <span>Solidity</span><span>Python</span><span>Figma</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Research */}
      <section className="sec" data-i="2" ref={setRef(2)}>
        <div className="inner">
          <div className="left">
            <div className="label">03 — Research</div>
            <h2>
              Decentralized <em>systems</em>.
            </h2>
            <p className="lead">UW Decentralized Computing Lab — the trust layer of open networks.</p>
            <a className="more" href="#">
              Read research →
            </a>
          </div>
          <div className="right">
            <ul className="tl">
              <li>
                <div className="y">2026 · UW DC Lab</div>
                <div className="h">Sybil Detection</div>
                <div className="dsc">ML framework for airdrop sybil identification.</div>
              </li>
              <li>
                <div className="y">2025</div>
                <div className="h">HasciDB</div>
                <div className="dsc">A database for identifying crypto sybil hunters.</div>
              </li>
              <li>
                <div className="y">2025</div>
                <div className="h">Blur</div>
                <div className="dsc">On-chain analysis &amp; privacy tooling.</div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 04 — Contact */}
      <section className="sec" data-i="3" ref={setRef(3)}>
        <div className="inner">
          <div className="left">
            <div className="label">04 — Contact</div>
            <h2>
              Let&apos;s <em>build</em> something.
            </h2>
            <p className="lead">
              Back to the start — the loop closes where it began. Open to 2026 opportunities.
            </p>
            <a className="more" href="mailto:ywen8@uw.edu">
              Email me →
            </a>
          </div>
          <div className="right">
            <div className="clinks">
              <a href="mailto:ywen8@uw.edu">Email<span className="ar">ywen8@uw.edu</span></a>
              <a href="https://github.com/Adeline117">GitHub<span className="ar">@Adeline117 ↗</span></a>
              <a href="#">LinkedIn<span className="ar">↗</span></a>
              <a href="#">X / Twitter<span className="ar">↗</span></a>
            </div>
          </div>
        </div>
      </section>

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
    </>
  );
}
