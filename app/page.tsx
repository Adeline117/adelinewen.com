"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

const InfinityHero = dynamic(() => import("@/components/InfinityHero"), { ssr: false });

type Lang = "en" | "zh";

type Section = {
  label: string;
  title: ReactNode;
  lead: string;
  more: { text: string; href: string };
};
type Row = { n: string; d: string; m: string };
type TL = { y: string; h: string; d: string };
type CLink = { label: string; val: string; href: string };

const COPY: Record<
  Lang,
  {
    nav: string[];
    heroMeta: string;
    heroTitle: ReactNode;
    heroSub: ReactNode;
    heroHint: string;
    work: Section & { rows: Row[] };
    about: Section & { tags: string[] };
    research: Section & { tl: TL[] };
    contact: Section & { links: CLink[] };
  }
> = {
  en: {
    nav: ["Work", "About", "Research", "Contact"],
    heroMeta: "Researcher · Builder · Seattle",
    heroTitle: (
      <>
        Adeline <em>Wen</em>
      </>
    ),
    heroSub: (
      <>
        I research airdrop <b>Sybil detection</b> at the UW Decentralized Computing Lab — and build{" "}
        <b>arenafi.org</b>.
      </>
    ),
    heroHint: "scroll to explore ↓",
    work: {
      label: "01 — Work",
      title: (
        <>
          Things I&apos;ve <em>built</em>.
        </>
      ),
      lead: "Products I've shipped — mostly solo — across crypto, on-chain data, and the web.",
      more: { text: "Visit Arena →", href: "https://arenafi.org" },
      rows: [
        { n: "Arena", d: "Ranks 68,000+ crypto traders across 44+ exchanges.", m: "2025 · arenafi.org" },
        { n: "HasciDB", d: "Open-source airdrop Sybil-detection database — 2.5M+ wallets.", m: "2026 · hascidb.org" },
        { n: "adelinewen.com", d: "This site — a 3D WebGL portfolio.", m: "2026 · Next.js" },
      ],
    },
    about: {
      label: "02 — About",
      title: (
        <>
          Research meets the <em>build</em>.
        </>
      ),
      lead:
        "I'm Adeline (she/her) — an undergraduate researcher at the UW Decentralized Computing Lab and an analyst at Stably, studying Economics & Informatics at the University of Washington. I research how decentralized systems behave, then build tools to test what I find.",
      more: { text: "Connect on LinkedIn →", href: "https://www.linkedin.com/in/adeline1107" },
      tags: ["Blockchain", "On-Chain Analysis", "Data Science", "JavaScript", "API Dev", "Econometrics"],
    },
    research: {
      label: "03 — Research",
      title: (
        <>
          Sybil detection, <em>published</em>.
        </>
      ),
      lead:
        "At the UW Decentralized Computing Lab with Prof. Wei Cai. First-author work on detecting airdrop Sybils and making on-chain governance interpretable.",
      more: { text: "Explore HasciDB →", href: "https://hascidb.org" },
      tl: [
        { y: "2026 · IEEE SMC", h: "Human-Centered Airdrop Governance", d: "Interpretable behavioral modeling of strategic hunters. To appear in IEEE Xplore." },
        { y: "2026 · Nanyang Blockchain Conf", h: "HasciDB", d: "First open-source cross-project airdrop Sybil database (2.5M+ wallets). First author." },
        { y: "2026 · Present", h: "Undergraduate RA", d: "UW Decentralized Computing Lab, under Prof. Wei Cai." },
      ],
    },
    contact: {
      label: "04 — Contact",
      title: (
        <>
          Let&apos;s <em>build</em> something.
        </>
      ),
      lead: "Open to research and building opportunities — always up for a good problem.",
      more: { text: "Email me →", href: "mailto:ywen8@uw.edu" },
      links: [
        { label: "Email", val: "ywen8@uw.edu", href: "mailto:ywen8@uw.edu" },
        { label: "GitHub", val: "@Adeline117 ↗", href: "https://github.com/Adeline117" },
        { label: "LinkedIn", val: "/in/adeline1107 ↗", href: "https://www.linkedin.com/in/adeline1107" },
        { label: "Arena", val: "arenafi.org ↗", href: "https://arenafi.org" },
      ],
    },
  },
  zh: {
    nav: ["作品", "关于", "研究", "联系"],
    heroMeta: "研究者 · 构建者 · 西雅图",
    heroTitle: (
      <>
        Adeline <em>Wen</em>
      </>
    ),
    heroSub: (
      <>
        在华盛顿大学去中心化计算实验室研究空投 <b>Sybil 检测</b>，并独立构建 <b>arenafi.org</b>。
      </>
    ),
    heroHint: "向下滚动了解 ↓",
    work: {
      label: "01 — 作品",
      title: (
        <>
          我<em>做</em>的东西。
        </>
      ),
      lead: "我（大多独立）做出来的产品——涉及加密、链上数据与 Web。",
      more: { text: "访问 Arena →", href: "https://arenafi.org" },
      rows: [
        { n: "Arena", d: "为 44+ 交易所的 68,000+ 加密交易者做排名。", m: "2025 · arenafi.org" },
        { n: "HasciDB", d: "开源空投 Sybil 检测数据库，覆盖 250 万+ 钱包。", m: "2026 · hascidb.org" },
        { n: "adelinewen.com", d: "就是这个网站——3D WebGL 作品集。", m: "2026 · Next.js" },
      ],
    },
    about: {
      label: "02 — 关于",
      title: (
        <>
          研究与构建的<em>交汇</em>。
        </>
      ),
      lead:
        "我是 Adeline（她/她）——华盛顿大学去中心化计算实验室本科研究员、Stably 分析师，主修经济学、辅修信息学。我研究去中心化系统如何运行，再亲手构建工具去验证发现。",
      more: { text: "在 LinkedIn 联系 →", href: "https://www.linkedin.com/in/adeline1107" },
      tags: ["区块链", "链上分析", "数据科学", "JavaScript", "API 开发", "计量经济学"],
    },
    research: {
      label: "03 — 研究",
      title: (
        <>
          Sybil 检测，已<em>发表</em>。
        </>
      ),
      lead:
        "在华盛顿大学去中心化计算实验室，导师 Wei Cai 教授。第一作者，研究空投 Sybil 检测与可解释的链上治理。",
      more: { text: "查看 HasciDB →", href: "https://hascidb.org" },
      tl: [
        { y: "2026 · IEEE SMC", h: "以人为本的空投治理", d: "对策略型猎手的可解释行为建模，将收录于 IEEE Xplore。" },
        { y: "2026 · 南洋区块链大会", h: "HasciDB", d: "首个开源跨项目空投 Sybil 数据库（250 万+ 钱包），第一作者。" },
        { y: "2026 · 至今", h: "本科研究助理", d: "华盛顿大学去中心化计算实验室，导师 Wei Cai 教授。" },
      ],
    },
    contact: {
      label: "04 — 联系",
      title: (
        <>
          一起<em>做</em>点东西。
        </>
      ),
      lead: "对研究与构建的机会开放——随时欢迎好问题。",
      more: { text: "给我发邮件 →", href: "mailto:ywen8@uw.edu" },
      links: [
        { label: "邮箱", val: "ywen8@uw.edu", href: "mailto:ywen8@uw.edu" },
        { label: "GitHub", val: "@Adeline117 ↗", href: "https://github.com/Adeline117" },
        { label: "LinkedIn", val: "/in/adeline1107 ↗", href: "https://www.linkedin.com/in/adeline1107" },
        { label: "Arena", val: "arenafi.org ↗", href: "https://arenafi.org" },
      ],
    },
  },
};

export default function Home() {
  const [active, setActive] = useState(0);
  const [dark, setDark] = useState<boolean | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const secRefs = useRef<(HTMLElement | null)[]>([]);
  const trackRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<SVGCircleElement>(null);

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

  // theme: stored, else system
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setDark(stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);
  useEffect(() => {
    if (dark === null) return;
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // language: stored, else browser
  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    setLang(stored ?? (navigator.language.startsWith("zh") ? "zh" : "en"));
  }, []);
  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh" : "en";
  }, [lang]);

  const goTo = (i: number) => secRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
  const setRef = (i: number) => (el: HTMLElement | null) => {
    secRefs.current[i] = el;
  };

  const t = COPY[lang];

  return (
    <>
      <InfinityHero />
      <div className="grain" />
      <div className="scrim t" />
      <div className="scrim b" />

      <nav>
        <div className="logo">Adeline Wen</div>
        <div className="links">
          {t.nav.map((label, i) => (
            <button key={i} className={i === active ? "active" : ""} onClick={() => goTo(i)}>
              <span className="i">{String(i + 1).padStart(2, "0")}</span>
              {label}
            </button>
          ))}
        </div>
      </nav>

      <div className="controls">
        <button className="toggle" onClick={() => setLang((l) => (l === "en" ? "zh" : "en"))}>
          {lang === "en" ? "中文" : "EN"}
        </button>
        <button className="toggle" onClick={() => setDark((v) => !v)}>
          ◐
        </button>
      </div>

      <header className="hero">
        <div className="meta">{t.heroMeta}</div>
        <h1>{t.heroTitle}</h1>
        <p className="sub">{t.heroSub}</p>
        <div className="hint">{t.heroHint}</div>
      </header>

      {/* 01 — Work */}
      <section className="sec" id="work" data-i="0" ref={setRef(0)}>
        <div className="inner">
          <div className="left">
            <div className="label">{t.work.label}</div>
            <h2>{t.work.title}</h2>
            <p className="lead">{t.work.lead}</p>
            <a className="more" href={t.work.more.href} target="_blank" rel="noopener noreferrer">
              {t.work.more.text}
            </a>
          </div>
          <div className="right">
            <ul className="rows">
              {t.work.rows.map((r) => (
                <li key={r.n}>
                  <div className="rinfo">
                    <span className="n">{r.n}</span>
                    <span className="rd">{r.d}</span>
                  </div>
                  <span className="rm">{r.m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 02 — About */}
      <section className="sec" id="about" data-i="1" ref={setRef(1)}>
        <div className="inner">
          <div className="left">
            <div className="label">{t.about.label}</div>
            <h2>{t.about.title}</h2>
            <p className="lead">{t.about.lead}</p>
            <a className="more" href={t.about.more.href} target="_blank" rel="noopener noreferrer">
              {t.about.more.text}
            </a>
          </div>
          <div className="right">
            <div className="about">
              <div className="portrait" />
              <div className="tags">
                {t.about.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Research */}
      <section className="sec" data-i="2" ref={setRef(2)}>
        <div className="inner">
          <div className="left">
            <div className="label">{t.research.label}</div>
            <h2>{t.research.title}</h2>
            <p className="lead">{t.research.lead}</p>
            <a className="more" href={t.research.more.href} target="_blank" rel="noopener noreferrer">
              {t.research.more.text}
            </a>
          </div>
          <div className="right">
            <ul className="tl">
              {t.research.tl.map((item) => (
                <li key={item.h}>
                  <div className="y">{item.y}</div>
                  <div className="h">{item.h}</div>
                  <div className="dsc">{item.d}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 04 — Contact */}
      <section className="sec" data-i="3" ref={setRef(3)}>
        <div className="inner">
          <div className="left">
            <div className="label">{t.contact.label}</div>
            <h2>{t.contact.title}</h2>
            <p className="lead">{t.contact.lead}</p>
            <a className="more" href={t.contact.more.href}>
              {t.contact.more.text}
            </a>
          </div>
          <div className="right">
            <div className="clinks">
              {t.contact.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={l.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                >
                  {l.label}
                  <span className="ar">{l.val}</span>
                </a>
              ))}
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
