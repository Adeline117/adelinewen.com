"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

const InfinityHero = dynamic(() => import("@/components/InfinityHero"), { ssr: false });

type Lang = "en" | "zh";
type Section = { label: string; title: ReactNode; lead: string; more: { text: string; href: string } };
type Row = { n: string; d: string; m: string };
type CS = { k: string; v: string };
type TL = { y: string; h: string; d: string };
type CLink = { label: string; val: string; href: string };
type Form = { name: string; email: string; message: string; send: string; sending: string; sent: string; err: string };

const COPY: Record<
  Lang,
  {
    nav: string[];
    heroTitle: ReactNode;
    heroSub: ReactNode;
    heroHint: string;
    about: Section & { tags: string[]; resume: TL[] };
    research: Section & { tl: TL[] };
    arena: Section & { stats: Row[]; cs: CS[] };
    contact: { label: string; title: ReactNode; lead: string; links: CLink[]; form: Form };
  }
> = {
  en: {
    nav: ["About", "Research", "Work", "Contact"],
    heroTitle: (
      <>
        Adeline <em>Wen</em>
      </>
    ),
    heroSub: (
      <>
        Economics undergrad at UW. I research decentralized systems — and built <b>arenafi.org</b>.
      </>
    ),
    heroHint: "scroll to explore ↓",
    about: {
      label: "01 — About",
      title: (
        <>
          A bit <em>about me</em>.
        </>
      ),
      lead:
        "I'm Adeline (she/her), an undergraduate at the University of Washington studying Economics with an Informatics minor (Dean's List). I research decentralized systems at the UW Decentralized Computing Lab, work as an analyst at Stably, and build products on the side.",
      more: { text: "Connect on LinkedIn →", href: "https://www.linkedin.com/in/adeline1107" },
      tags: ["Blockchain", "On-Chain Analysis", "Data Science", "JavaScript", "API Dev", "Econometrics"],
      resume: [
        { y: "Apr 2026 – Present", h: "Analyst · Stably", d: "Research & growth at a stablecoin infrastructure company." },
        { y: "Feb 2026 – Present", h: "Undergraduate RA · UW DC Lab", d: "Sybil-detection research under Prof. Wei Cai; built hascidb.org." },
        { y: "Dec 2025 – Present", h: "Founder · Arena", d: "Solo-built arenafi.org, ranking 68,000+ traders." },
        { y: "2025 – 2029", h: "BA Economics · University of Washington", d: "Informatics minor · Dean's List." },
      ],
    },
    research: {
      label: "02 — Research",
      title: (
        <>
          Papers &amp; <em>research</em>.
        </>
      ),
      lead:
        "At the UW Decentralized Computing Lab with Prof. Wei Cai — first-author work on airdrop Sybil detection and interpretable on-chain governance.",
      more: { text: "Explore HasciDB →", href: "https://hascidb.org" },
      tl: [
        { y: "2026 · IEEE SMC", h: "Human-Centered Airdrop Governance", d: "Interpretable behavioral modeling of strategic hunters. To appear in IEEE Xplore." },
        { y: "2026 · Nanyang Blockchain Conf", h: "HasciDB", d: "First open-source cross-project airdrop Sybil database (2.5M+ wallets). First author." },
      ],
    },
    arena: {
      label: "03 — Arena",
      title: (
        <>
          Arena, <em>solo-built</em>.
        </>
      ),
      lead:
        "Arena (arenafi.org) is a platform I designed and built end-to-end. It ranks 68,000+ crypto traders across 44+ exchanges, turning scattered trading activity into one clean leaderboard.",
      more: { text: "Visit arenafi.org →", href: "https://arenafi.org" },
      cs: [
        { k: "Problem", v: "Trading activity is scattered across dozens of exchanges, so there was no neutral way to compare traders." },
        { k: "What I built", v: "A unified leaderboard — exchange API integrations, a normalized scoring pipeline, and the full front end." },
        { k: "Result", v: "68,000+ traders ranked across 44+ exchanges, designed and shipped solo." },
      ],
      stats: [
        { n: "68,000+", d: "crypto traders ranked", m: "" },
        { n: "44+", d: "exchanges integrated", m: "" },
        { n: "Solo", d: "designed & built end-to-end", m: "JS · API" },
        { n: "2025", d: "launched", m: "" },
      ],
    },
    contact: {
      label: "04 — Contact",
      title: (
        <>
          Let&apos;s <em>talk</em>.
        </>
      ),
      lead: "Open to research and building opportunities — always up for a good problem.",
      links: [
        { label: "Email", val: "ywen8@uw.edu", href: "mailto:ywen8@uw.edu" },
        { label: "GitHub", val: "@Adeline117 ↗", href: "https://github.com/Adeline117" },
        { label: "LinkedIn", val: "/in/adeline1107 ↗", href: "https://www.linkedin.com/in/adeline1107" },
        { label: "Arena", val: "arenafi.org ↗", href: "https://arenafi.org" },
        { label: "X", val: "@AdelineWen07 ↗", href: "https://x.com/AdelineWen07" },
        { label: "Instagram", val: "@adelinew07 ↗", href: "https://www.instagram.com/adelinew07/" },
      ],
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        send: "Send message",
        sending: "Sending…",
        sent: "Thanks — I'll be in touch soon.",
        err: "Couldn't send — please email ywen8@uw.edu directly.",
      },
    },
  },
  zh: {
    nav: ["关于", "研究", "项目", "联系"],
    heroTitle: (
      <>
        Adeline <em>Wen</em>
      </>
    ),
    heroSub: (
      <>
        华盛顿大学经济学本科生。研究去中心化系统——并独立做了 <b>arenafi.org</b>。
      </>
    ),
    heroHint: "向下滚动了解 ↓",
    about: {
      label: "01 — 关于",
      title: (
        <>
          关于<em>我</em>。
        </>
      ),
      lead:
        "我是 Adeline（她/她），华盛顿大学本科生，主修经济学、辅修信息学（院长名单）。我在去中心化计算实验室做研究，同时在 Stably 任分析师，业余也自己做产品。",
      more: { text: "在 LinkedIn 联系 →", href: "https://www.linkedin.com/in/adeline1107" },
      tags: ["区块链", "链上分析", "数据科学", "JavaScript", "API 开发", "计量经济学"],
      resume: [
        { y: "2026.04 – 至今", h: "分析师 · Stably", d: "稳定币基础设施公司的研究与增长。" },
        { y: "2026.02 – 至今", h: "本科研究助理 · UW 去中心化计算实验室", d: "导师 Wei Cai 教授；Sybil 检测研究，构建了 hascidb.org。" },
        { y: "2025.12 – 至今", h: "创始人 · Arena", d: "独立构建 arenafi.org，为 68,000+ 交易者排名。" },
        { y: "2025 – 2029", h: "经济学学士 · 华盛顿大学", d: "辅修信息学 · 院长名单。" },
      ],
    },
    research: {
      label: "02 — 研究",
      title: (
        <>
          论文与<em>研究</em>。
        </>
      ),
      lead:
        "在华盛顿大学去中心化计算实验室，导师 Wei Cai 教授——第一作者，研究空投 Sybil 检测与可解释的链上治理。",
      more: { text: "查看 HasciDB →", href: "https://hascidb.org" },
      tl: [
        { y: "2026 · IEEE SMC", h: "以人为本的空投治理", d: "对策略型猎手的可解释行为建模，将收录于 IEEE Xplore。" },
        { y: "2026 · 南洋区块链大会", h: "HasciDB", d: "首个开源跨项目空投 Sybil 数据库（250 万+ 钱包），第一作者。" },
      ],
    },
    arena: {
      label: "03 — Arena",
      title: (
        <>
          Arena，<em>独立打造</em>。
        </>
      ),
      lead:
        "Arena（arenafi.org）是我从头到尾独立设计、构建的平台。它为 44+ 交易所的 68,000+ 加密交易者排名，把分散的交易行为整合成一个清晰的榜单。",
      more: { text: "访问 arenafi.org →", href: "https://arenafi.org" },
      cs: [
        { k: "问题", v: "交易行为分散在几十个交易所，没有一个中立的方式去横向比较交易者。" },
        { k: "我做了什么", v: "一个统一的排行榜——交易所 API 接入、标准化的评分管线，以及整个前端。" },
        { k: "结果", v: "为 44+ 交易所的 68,000+ 交易者排名，独立完成设计与上线。" },
      ],
      stats: [
        { n: "68,000+", d: "加密交易者排名", m: "" },
        { n: "44+", d: "接入交易所", m: "" },
        { n: "独立", d: "从设计到开发全包", m: "JS · API" },
        { n: "2025", d: "上线", m: "" },
      ],
    },
    contact: {
      label: "04 — 联系",
      title: (
        <>
          聊聊<em>吧</em>。
        </>
      ),
      lead: "对研究与构建的机会开放——随时欢迎好问题。",
      links: [
        { label: "邮箱", val: "ywen8@uw.edu", href: "mailto:ywen8@uw.edu" },
        { label: "GitHub", val: "@Adeline117 ↗", href: "https://github.com/Adeline117" },
        { label: "LinkedIn", val: "/in/adeline1107 ↗", href: "https://www.linkedin.com/in/adeline1107" },
        { label: "Arena", val: "arenafi.org ↗", href: "https://arenafi.org" },
        { label: "X", val: "@AdelineWen07 ↗", href: "https://x.com/AdelineWen07" },
        { label: "Instagram", val: "@adelinew07 ↗", href: "https://www.instagram.com/adelinew07/" },
      ],
      form: {
        name: "你的称呼",
        email: "邮箱",
        message: "留言",
        send: "发送",
        sending: "发送中…",
        sent: "谢谢，我会尽快回复你。",
        err: "发送失败——请直接邮件 ywen8@uw.edu。",
      },
    },
  },
};

export default function Site({ routeLang }: { routeLang?: Lang }) {
  const [active, setActive] = useState(0);
  const [dark, setDark] = useState<boolean | null>(null);
  const [lang, setLang] = useState<Lang>(routeLang ?? "en");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [hp, setHp] = useState(""); // honeypot — humans leave it empty, bots fill it
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const secRefs = useRef<(HTMLElement | null)[]>([]);
  const trackRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("on");
        });
      },
      { threshold: 0.2 }
    );
    secRefs.current.forEach((s) => s && obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const len = track ? track.getTotalLength() : 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.body.scrollHeight - window.innerHeight;
      const u = max > 0 ? window.scrollY / max : 0;
      if (track && beadRef.current) {
        const pt = track.getPointAtLength((u % 1) * len);
        beadRef.current.setAttribute("cx", String(pt.x));
        beadRef.current.setAttribute("cy", String(pt.y));
      }
      let best = 0;
      let bd = Infinity;
      secRefs.current.forEach((s, i) => {
        if (!s) return;
        const r = s.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - window.innerHeight / 2);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      setActive(best);
    };
    // rAF-throttle: coalesce scroll bursts into one layout read per frame
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setDark(stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);
  useEffect(() => {
    if (dark === null) return;
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (routeLang) return; // explicit /zh or / route decides the language
    const stored = localStorage.getItem("lang") as Lang | null;
    setLang(stored ?? (navigator.language.startsWith("zh") ? "zh" : "en"));
  }, [routeLang]);
  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh" : "en";
  }, [lang]);

  const goTo = (i: number) => secRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
  const setRef = (i: number) => (el: HTMLElement | null) => {
    secRefs.current[i] = el;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company: hp }),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
        return;
      }
      if (res.status === 503) {
        // backend not configured yet → fall back to the visitor's mail client
        const body = encodeURIComponent(`From: ${form.name} <${form.email}>\n\n${form.message}`);
        const subject = encodeURIComponent(`Portfolio contact — ${form.name}`);
        window.location.href = `mailto:ywen8@uw.edu?subject=${subject}&body=${body}`;
        setStatus("idle");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const t = COPY[lang];
  const ids = ["about", "research", "arena", "contact"];

  const renderSection = (i: number, sec: Section, right: ReactNode) => (
    <section className="sec" id={ids[i]} data-i={i} ref={setRef(i)}>
      <div className="inner">
        <div className="left">
          <div className="label">{sec.label}</div>
          <h2>{sec.title}</h2>
          <p className="lead">{sec.lead}</p>
          {i === 0 && (
            <div className="tags">
              {t.about.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
          {i === 2 && (
            <dl className="cs">
              {t.arena.cs.map((c) => (
                <div key={c.k}>
                  <dt>{c.k}</dt>
                  <dd>{c.v}</dd>
                </div>
              ))}
            </dl>
          )}
          <a className="more" href={sec.more.href} target="_blank" rel="noopener noreferrer">
            {sec.more.text}
          </a>
        </div>
        <div className="right">{right}</div>
      </div>
    </section>
  );

  return (
    <>
      <a href="#about" className="skip">
        {lang === "zh" ? "跳到内容" : "Skip to content"}
      </a>
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
        <button
          className="toggle"
          aria-label={lang === "en" ? "切换到中文" : "Switch to English"}
          onClick={() => setLang((l) => (l === "en" ? "zh" : "en"))}
        >
          {lang === "en" ? "中文" : "EN"}
        </button>
        <button
          className="toggle"
          aria-label={lang === "zh" ? "切换深色模式" : "Toggle dark mode"}
          onClick={() => setDark((v) => !v)}
        >
          ◐
        </button>
      </div>

      <header className="hero">
        <h1>{t.heroTitle}</h1>
        <p className="sub">{t.heroSub}</p>
        <div className="hint">{t.heroHint}</div>
      </header>

      {renderSection(
        0,
        t.about,
        <ul className="tl">
          {t.about.resume.map((item) => (
            <li key={item.h}>
              <div className="y">{item.y}</div>
              <div className="h">{item.h}</div>
              <div className="dsc">{item.d}</div>
            </li>
          ))}
        </ul>
      )}

      {renderSection(
        1,
        t.research,
        <ul className="tl">
          {t.research.tl.map((item) => (
            <li key={item.h}>
              <div className="y">{item.y}</div>
              <div className="h">{item.h}</div>
              <div className="dsc">{item.d}</div>
            </li>
          ))}
        </ul>
      )}

      {renderSection(
        2,
        t.arena,
        <ul className="rows">
          {t.arena.stats.map((r) => (
            <li key={r.d}>
              <div className="rinfo">
                <span className="n">{r.n}</span>
                <span className="rd">{r.d}</span>
              </div>
              {r.m && <span className="rm">{r.m}</span>}
            </li>
          ))}
        </ul>
      )}

      {/* 04 — Contact (with working form) */}
      <section className="sec" id="contact" data-i={3} ref={setRef(3)}>
        <div className="inner">
          <div className="left">
            <div className="label">{t.contact.label}</div>
            <h2>{t.contact.title}</h2>
            <p className="lead">{t.contact.lead}</p>
            <form className="cform" onSubmit={submit}>
              {/* honeypot: hidden from humans, catches naive bots */}
              <input
                className="hp"
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
              />
              <input
                required
                placeholder={t.contact.form.name}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                required
                type="email"
                placeholder={t.contact.form.email}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <textarea
                required
                placeholder={t.contact.form.message}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button type="submit" disabled={status === "sending"}>
                {status === "sending" ? t.contact.form.sending : t.contact.form.send}
              </button>
              {status === "sent" && <div className="status ok">{t.contact.form.sent}</div>}
              {status === "error" && <div className="status err">{t.contact.form.err}</div>}
            </form>
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
