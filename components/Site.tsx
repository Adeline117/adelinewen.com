"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

// cursor-reactive needle field behind the cover — desktop only (it's a pointer
// interaction), loaded after the text paints

type Lang = "en" | "zh";
type Section = { label: string; title: ReactNode; lead: ReactNode; more: { text: string; href: string } };
type Row = { n: string; d: string; m: string };
type Val = { h: string; d: string };
type Road = { phase: string; when: string; what: string };
type TL = { y: string; h: string; d: string; href?: string };
type Honor = { t: string; d: string; m: string; href?: string };
type CLink = { label: string; val: string; href: string; download?: boolean };

// wrap text in an inline link (external) when an href is present, else plain text
const linked = (text: string, href?: string): ReactNode =>
  href ? (
    <a className="ilink" href={href} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  ) : (
    text
  );
type Form = { name: string; email: string; message: string; send: string; sending: string; sent: string; mailed: string; err: string };

const COPY: Record<
  Lang,
  {
    nav: string[];
    heroSub: ReactNode;
    heroHint: string;
    heroCta: string;
    colophon: string;
    about: Section & { resume: TL[]; honorsLabel: string; honors: Honor[] };
    research: Section & { tl: TL[] };
    arena: Section & {
      stats: Row[];
      funnelIntro: string;
      value: { h: string; items: Val[] };
      roadmap: { h: string; steps: Road[] };
      vision: { d: ReactNode };
    };
    contact: { label: string; title: ReactNode; lead: string; links: CLink[]; form: Form };
  }
> = {
  en: {
    nav: ["About", "Research", "Arena", "Contact"],
    colophon: "© 2026 Adeline Wen",
    heroSub: (
      <>
        Research assistant at the University of Washington Decentralized Computing Lab, and independent developer of <a className="tlink" href="https://arenafi.org" target="_blank" rel="noopener noreferrer"><b>arenafi.org</b></a>.
      </>
    ),
    heroHint: "Scroll ↓",
    heroCta: "Get in touch",
    about: {
      label: "01 · About",
      title: (
        <>
          A bit <em>about me</em>.
        </>
      ),
      lead:
        "I’m Adeline (she/her), an Economics undergrad at the University of Washington. I’m fascinated by how decentralized systems and markets actually behave, and I like to understand them by researching and building things of my own.",
      more: { text: "Connect on LinkedIn ↗", href: "https://www.linkedin.com/in/adeline1107" },
      resume: [
        { y: "Apr 2026 – Present", h: "Crypto Analyst · Stably", d: "Research & growth at a stablecoin infrastructure company.", href: "https://www.stably.io/" },
        { y: "Feb 2026 – Present", h: "Undergraduate Research Assistant · UW Decentralized Computing Lab", d: "Research under Prof. Wei Cai; built hascidb.org (open-source Sybil database, 2.5M+ wallets) and published on blockchain, crypto, and decentralized AI.", href: "https://faculty.washington.edu/weicaics/" },
        { y: "Dec 2025 – Present", h: "Independent Developer · Arena", d: "Solo-built arenafi.org, ranking 68,000+ traders.", href: "https://arenafi.org" },
        { y: "2025 – 2029", h: "Bachelor of Economics · University of Washington", d: "Informatics minor · Dean’s List.", href: "https://www.washington.edu/" },
      ],
      honorsLabel: "Honors & Fellowships",
      honors: [
        { t: "Paradigm Fellowship 2026", d: "One of ~30 fellows selected worldwide — leading crypto & frontier-tech VC.", m: "N. California · Aug 2026", href: "https://paradigm.xyz/fellowship-2026/" },
        { t: "Y Combinator Startup School 2026", d: "Selected to attend.", m: "San Francisco · Jul 2026", href: "https://www.startupschool.org/" },
        { t: "Dempsey Startup Competition 2026", d: "Investment Round — Top 40 of 174 teams.", m: "Pacific NW · May 2026", href: "https://foster.uw.edu/centers/buerk-ctr-entrepreneurship/entrepreneurship-competitions/dempsey-startup-competition/" },
      ],
    },
    research: {
      label: "02 · Research",
      title: (
        <>
          Papers &amp; <em>research</em>.
        </>
      ),
      lead:
        "At the UW Decentralized Computing Lab with Prof. Wei Cai, first-author and co-authored research in blockchain and decentralized AI, from airdrop Sybil detection (catching one person who fakes thousands of wallets to farm token giveaways) to interpretable on⁠-⁠chain governance.",
      more: { text: "Explore HasciDB ↗", href: "https://hascidb.org" },
      tl: [
        { y: "Accepted · Nanyang Blockchain Conference 2026", h: "HasciDB: A Database for Identifying Crypto Sybil Airdrop Hunters", d: "First author. The largest open-source cross-project airdrop Sybil-detection database (hascidb.org, 2.5M+ wallets). With Wei Cai et al." },
        { y: "Accepted · IEEE SMC 2026 · IEEE Xplore", h: "Human-Centered Decision Support for Crypto Airdrop Governance: Interpretable Behavioral Modeling of Strategic Hunters", d: "Co-author. An extension of HasciDB toward interpretable, human-centered airdrop governance. With Wei Cai et al." },
      ],
    },
    arena: {
      label: "03 · Arena",
      title: (
        <>
          Arena, <em>solo-built</em>.
        </>
      ),
      lead: (
        <>
          Tennis has the ATP rankings; chess has Elo. Crypto trading moves hundreds of billions a day, yet no one could answer the simplest question: who are the best traders? Arena (<a className="tlink" href="https://arenafi.org" target="_blank" rel="noopener noreferrer">arenafi.org</a>) is the cross-platform answer. I designed, built, and shipped it solo, unifying 68,000+ traders across 44+ exchanges (CEX + DEX) into one transparent Arena Score, giving crypto trading a world ranking for the first time.
        </>
      ),
      more: { text: "Visit arenafi.org ↗", href: "https://arenafi.org" },
      stats: [
        { n: "68,000+", d: "traders ranked", m: "" },
        { n: "44+", d: "exchanges · CEX + DEX", m: "" },
        { n: "60", d: "automated data pipelines", m: "" },
        { n: "Solo", d: "designed, built & shipped", m: "Next.js · Supabase · Redis" },
      ],
      funnelIntro: "Rankings are only step one. Arena’s full form is a three-stage funnel, where each step builds on the data of the last.",
      value: {
        h: "Why it’s different",
        items: [
          { h: "Cross-platform visibility", d: "The only place that sees every trader on every exchange. Binance won’t show you Bybit’s traders; Arena shows them all." },
          { h: "One transparent standard", d: "Arena Score, 0–100, weighted 60% return-on-investment and 40% absolute profit, with a published methodology anyone can audit. Accounts under $500 profit are filtered out, and my own Sybil-detection research keeps fake-wallet farming off the board." },
          { h: "Competition, not display", d: "Not a static dashboard but a live contest." },
        ],
      },
      roadmap: {
        h: "Roadmap",
        steps: [
          { phase: "V1 · Discover", when: "now", what: "Live leaderboard, trader claiming & verification, community cold start." },
          { phase: "V2 · Prove", when: "6–18 mo", what: "A stable in-app currency, head-to-head battles, spectator betting, the first 12-week season." },
          { phase: "V3 · Follow", when: "18–36 mo", what: "Copy-trading vaults, advanced bet types, ARENA token, institutional data API." },
        ],
      },
      vision: {
        d: (
          <>
            Trading is fiercely competitive, yet it’s the only sport with no world ranking, no official matches, and no star system. Arena fills in all three, in order: <em>discover the best, let them prove it in public, then let anyone follow.</em>
          </>
        ),
      },
    },
    contact: {
      label: "04 · Contact",
      title: (
        <>
          Let’s <em>talk</em>.
        </>
      ),
      lead: "Based in Seattle, open to research and building opportunities, always up for a good problem.",
      links: [
        { label: "Email", val: "adelinewen1107@outlook.com", href: "mailto:adelinewen1107@outlook.com" },
        { label: "GitHub", val: "@Adeline117 ↗", href: "https://github.com/Adeline117" },
        { label: "LinkedIn", val: "/in/adeline1107 ↗", href: "https://www.linkedin.com/in/adeline1107" },
        { label: "X", val: "@AdelineWen07 ↗", href: "https://x.com/AdelineWen07" },
        { label: "Instagram", val: "@adelinew07 ↗", href: "https://www.instagram.com/adelinew07/" },
      ],
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        send: "Send message",
        sending: "Sending…",
        sent: "Thanks, I’ll be in touch soon.",
        mailed: "Opening your email app — if nothing happens, write to adelinewen1107@outlook.com.",
        err: "Couldn’t send, please email adelinewen1107@outlook.com directly.",
      },
    },
  },
  zh: {
    nav: ["关于", "研究", "Arena", "联系"],
    colophon: "© 2026 Adeline Wen",
    heroSub: (
      <>
        华盛顿大学去中心化计算实验室研究助理，<a className="tlink" href="https://arenafi.org" target="_blank" rel="noopener noreferrer"><b>arenafi.org</b></a> 独立开发者。
      </>
    ),
    heroHint: "滚动 ↓",
    heroCta: "联系我",
    about: {
      label: "01 · 关于",
      title: (
        <>
          关于<em>我</em>。
        </>
      ),
      lead:
        "我是 Adeline，华盛顿大学经济学本科生。我着迷于去中心化系统与市场真实的运转方式，喜欢通过研究和亲手构建去理解它们。",
      more: { text: "在 LinkedIn 联系 ↗", href: "https://www.linkedin.com/in/adeline1107" },
      resume: [
        { y: "2026.04 – 至今", h: "加密分析师 · Stably", d: "稳定币基础设施公司的研究与增长。", href: "https://www.stably.io/" },
        { y: "2026.02 – 至今", h: "本科研究助理 · UW 去中心化计算实验室", d: "导师 Wei Cai 教授；构建了 hascidb.org（开源 Sybil 检测数据库，250 万+ 钱包），并发表区块链、加密与去中心化 AI 方向的多篇论文。", href: "https://faculty.washington.edu/weicaics/" },
        { y: "2025.12 – 至今", h: "独立开发 · Arena", d: "独立构建 arenafi.org，为 68,000+ 交易者排名。", href: "https://arenafi.org" },
        { y: "2025 – 2029", h: "经济学学士 · 华盛顿大学", d: "辅修信息学 · 院长名单。", href: "https://www.washington.edu/" },
      ],
      honorsLabel: "荣誉与入选",
      honors: [
        { t: "Paradigm Fellowship 2026", d: "全球约 30 名入选者之一 —— 顶级加密与前沿科技风投。", m: "北加州 · 2026.08", href: "https://paradigm.xyz/fellowship-2026/" },
        { t: "Y Combinator Startup School 2026", d: "获选参加。", m: "旧金山 · 2026.07", href: "https://www.startupschool.org/" },
        { t: "Dempsey 创业大赛 2026", d: "投资轮 —— 174 支队伍中前 40。", m: "太平洋西北 · 2026.05", href: "https://foster.uw.edu/centers/buerk-ctr-entrepreneurship/entrepreneurship-competitions/dempsey-startup-competition/" },
      ],
    },
    research: {
      label: "02 · 研究",
      title: (
        <>
          论文与<em>研究</em>。
        </>
      ),
      lead:
        "在华盛顿大学去中心化计算实验室，导师 Wei Cai 教授，区块链与去中心化 AI 研究（第一作者及合作者），涵盖空投 Sybil 检测（识别一个人伪造成千上万个钱包来套取代币空投）与可解释的链上治理。",
      more: { text: "查看 HasciDB ↗", href: "https://hascidb.org" },
      tl: [
        { y: "已接收 · 南洋区块链大会 2026", h: "HasciDB：识别加密 Sybil 空投猎人的数据库", d: "第一作者。最大的开源跨项目空投 Sybil 检测数据库（hascidb.org，250 万+ 钱包）。与 Wei Cai 教授等合作。" },
        { y: "已接收 · IEEE SMC 2026 · IEEE Xplore", h: "面向加密空投治理的以人为本决策支持：策略型猎手的可解释行为建模", d: "合作者。HasciDB 的延伸工作，面向可解释、以人为本的空投治理。与 Wei Cai 教授等合作。" },
      ],
    },
    arena: {
      label: "03 · Arena",
      title: (
        <>
          Arena，<em>独立打造</em>。
        </>
      ),
      lead: (
        <>
          网球有 ATP 排名，国际象棋有 Elo。加密交易每天成交数千亿美元，却没人能回答最基本的问题：谁是最好的交易者？Arena（<a className="tlink" href="https://arenafi.org" target="_blank" rel="noopener noreferrer">arenafi.org</a>）是跨平台的答案。我独立设计、开发并上线，把 44+ 交易所（中心化 + 去中心化）上分散的 68,000+ 交易者，统一进一个透明的 Arena 评分，第一次给加密交易一个世界排名。
        </>
      ),
      more: { text: "访问 arenafi.org ↗", href: "https://arenafi.org" },
      stats: [
        { n: "68,000+", d: "交易者排名", m: "" },
        { n: "44+", d: "交易所 · CEX + DEX", m: "" },
        { n: "60", d: "自动化数据管线", m: "" },
        { n: "独立", d: "设计、开发、上线", m: "Next.js · Supabase · Redis" },
      ],
      funnelIntro: "排名只是第一步。Arena 的完整形态是一个三段漏斗，每一步都建立在上一步的数据之上。",
      value: {
        h: "为什么不一样",
        items: [
          { h: "跨平台可见", d: "唯一能看见每个交易所、每位交易者的地方。币安不会告诉你 Bybit 的交易者；Arena 全都看得见。" },
          { h: "统一透明的标准", d: "Arena 评分，0–100，其中收益率（ROI）占 60%、绝对盈亏占 40%，方法论公开、任何人可审计。绝对盈利低于 $500 的账户被过滤，我自己的 Sybil 检测研究也把伪造钱包刷分挡在榜外。" },
          { h: "是竞技，不是展示", d: "这里的数据不是静态看板，而是实时比赛。" },
        ],
      },
      roadmap: {
        h: "路线图",
        steps: [
          { phase: "V1 · 发现", when: "现在", what: "排行榜上线、交易者认领与验证、社区冷启动。" },
          { phase: "V2 · 证明", when: "6–18 个月", what: "稳定的站内货币、1v1 对战、观众下注、第一个 12 周赛季。" },
          { phase: "V3 · 跟随", when: "18–36 个月", what: "跟单金库、进阶下注、ARENA 代币、机构数据 API。" },
        ],
      },
      vision: {
        d: (
          <>
            交易竞争激烈，却是唯一没有世界排名、没有官方比赛、没有明星体系的运动。Arena 依次补上这三样：<em>先发现最强者，再让他们公开证明，最后让任何人都能跟随。</em>
          </>
        ),
      },
    },
    contact: {
      label: "04 · 联系",
      title: (
        <>
          聊聊<em>吧</em>。
        </>
      ),
      lead: "常驻西雅图，对研究与构建的机会开放，随时欢迎好问题。",
      links: [
        { label: "邮箱", val: "adelinewen1107@outlook.com", href: "mailto:adelinewen1107@outlook.com" },
        { label: "GitHub", val: "@Adeline117 ↗", href: "https://github.com/Adeline117" },
        { label: "LinkedIn", val: "/in/adeline1107 ↗", href: "https://www.linkedin.com/in/adeline1107" },
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
        mailed: "正在打开你的邮件应用——若没反应，请直接写信到 adelinewen1107@outlook.com。",
        err: "发送失败，请直接邮件 adelinewen1107@outlook.com。",
      },
    },
  },
};

export default function Site({ routeLang }: { routeLang?: Lang }) {
  const [active, setActive] = useState(0);
  const [dark, setDark] = useState<boolean | null>(null);
  const [lang, setLang] = useState<Lang>(routeLang ?? "en");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [hp, setHp] = useState(""); // honeypot, humans leave it empty, bots fill it
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "mailed">("idle");
  const secRefs = useRef<(HTMLElement | null)[]>([]);
  const heroRef = useRef<HTMLElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<SVGCircleElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

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
      // the bead travels the ∞ once over the full page scroll
      const max = document.body.scrollHeight - window.innerHeight;
      const u = max > 0 ? window.scrollY / max : 0;
      if (track && beadRef.current) {
        const pt = track.getPointAtLength((u % 1) * len);
        beadRef.current.setAttribute("cx", String(pt.x));
        beadRef.current.setAttribute("cy", String(pt.y));
      }
      let best = 0;
      let bd = Infinity;
      const mid = window.innerHeight / 2;
      secRefs.current.forEach((s, i) => {
        if (!s) return;
        const r = s.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bd) {
          bd = d;
          best = i;
        }
        // variable-font morph: each heading gains weight as it reaches reading
        // position (compositor-only — just a CSS var the GPU interpolates)
        const h2 = s.querySelector("h2") as HTMLElement | null;
        if (h2) {
          const hr = h2.getBoundingClientRect();
          const t = Math.min(1, Math.abs(hr.top + hr.height / 2 - mid) / (mid * 1.1));
          h2.style.setProperty("--hw", String(Math.round(392 - t * 84))); // 392 centred → 308 far
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

  // Inverting cursor: a mix-blend-difference dot that lerps to the pointer and
  // grows over interactive targets. Desktop pointers only; native cursor hidden
  // while active (restored to a text caret over form fields).
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const ease = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 0.28;
    document.body.classList.add("has-cursor");
    let x = -100, y = -100, tx = -100, ty = -100, shown = false, raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; x = tx; y = ty; el.classList.add("on"); }
      const t = e.target as HTMLElement | null;
      el.classList.toggle("link", !!t?.closest("a,button,[role=button]"));
    };
    const onLeave = () => el.classList.remove("on");
    const onEnter = () => { if (shown) el.classList.add("on"); };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      x += (tx - x) * ease; y += (ty - y) * ease;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  // Ink lens on the cover name: a soft circle following the cursor reveals a
  // stroke-thickened copy of the type, so letters "ink in" where you point.
  // No layout change (mask + SVG dilate only), no ambient motion.
  useEffect(() => {
    const wrap = nameRef.current;
    if (!wrap) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lx = -300, ly = -300, tx = -300, ty = -300, lr = 0, tlr = 0, raf = 0, shown = false;
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top; tlr = 175;
      if (!shown) { shown = true; lx = tx; ly = ty; }
    };
    const onLeave = () => { tlr = 0; };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const k = reduced ? 1 : 0.2;
      lx += (tx - lx) * k; ly += (ty - ly) * k; lr += (tlr - lr) * 0.12;
      wrap.style.setProperty("--lx", lx + "px");
      wrap.style.setProperty("--ly", ly + "px");
      wrap.style.setProperty("--lr", lr.toFixed(1) + "px");
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Mouse-wheel / keyboard paging: one section per gesture, then center.
  // (Touch keeps the native CSS scroll-snap; we only hijack wheel + keys.)
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = () =>
      [heroRef.current, ...secRefs.current].filter(Boolean) as HTMLElement[];

    // index of the section currently closest to the viewport center
    const currentIndex = () => {
      const list = items();
      let best = 0;
      let bd = Infinity;
      list.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - window.innerHeight / 2);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      return best;
    };

    const go = (dir: number) => {
      const list = items();
      const next = Math.min(list.length - 1, Math.max(0, currentIndex() + dir));
      const el = list[next];
      if (!el) return;
      // land tall sections (e.g. the long Arena page) at the top, others centered
      const tall = el.getBoundingClientRect().height > window.innerHeight + 10;
      el.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: tall ? "start" : "center",
      });
    };

    let locked = false;
    let triggerAt = 0;
    let lastWheel = 0;
    let unlockTimer: ReturnType<typeof setTimeout>;
    // release the lock only once the wheel has gone quiet AND the scroll animation
    // has had time to finish — so one gesture (incl. its inertia tail) = one page
    const scheduleUnlock = () => {
      clearTimeout(unlockTimer);
      unlockTimer = setTimeout(() => {
        const now = performance.now();
        if (now - lastWheel >= 140 && now - triggerAt >= 600) locked = false;
        else scheduleUnlock();
      }, 80);
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 4) return;
      if ((e.target as HTMLElement).closest("textarea")) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const vh = window.innerHeight;
      const cur = items().find((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= vh / 2 && r.bottom >= vh / 2;
      });
      // ONLY the long Arena page scrolls natively (to its edge) before paging;
      // every other section always pages exactly one — never skips
      if (cur && cur.id === "arena") {
        const r = cur.getBoundingClientRect();
        const EDGE = 6;
        if (dir > 0 && r.bottom > vh + EDGE) return;
        if (dir < 0 && r.top < -EDGE) return;
      }
      e.preventDefault();
      lastWheel = performance.now();
      if (!locked) {
        locked = true;
        triggerAt = lastWheel;
        go(dir);
      }
      scheduleUnlock();
    };
    window.addEventListener("wheel", onWheel, { passive: false });

    const onKey = (e: KeyboardEvent) => {
      // don't hijack keys when a control is focused (Space/Enter must activate it)
      if ((e.target as HTMLElement).closest("input, textarea, button, a, select, [role=button]")) return;
      const down = e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ";
      const up = e.key === "ArrowUp" || e.key === "PageUp";
      if (!down && !up) return;
      e.preventDefault();
      if (locked) return;
      locked = true;
      triggerAt = lastWheel = performance.now();
      go(down ? 1 : -1);
      scheduleUnlock();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      clearTimeout(unlockTimer);
    };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    // stored choice wins; otherwise follow the OS scheme (matches the noFlash script)
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

  // Theme flip as a circular ink wipe from the click point (View Transitions API).
  // Falls back to the plain toggle where unsupported or reduced-motion.
  const flipTheme = (e: React.MouseEvent) => {
    const next = !dark;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDark(next);
      return;
    }
    document.documentElement.style.setProperty("--wx", `${e.clientX}px`);
    document.documentElement.style.setProperty("--wy", `${e.clientY}px`);
    // suspend the body's own 0.6s background fade so the wipe reveals a settled page
    document.documentElement.classList.add("theme-wiping");
    const vt = doc.startViewTransition(() => {
      flushSync(() => setDark(next));
      document.body.classList.toggle("dark", next); // ensure the DOM state is snapshotted
    });
    vt.finished.finally(() => document.documentElement.classList.remove("theme-wiping"));
  };

  const goTo = (i: number) => {
    const el = secRefs.current[i];
    if (!el) return;
    // match the wheel/key paging: tall Arena lands at top, others centered
    const tall = el.getBoundingClientRect().height > window.innerHeight + 10;
    el.scrollIntoView({ behavior: "smooth", block: tall ? "start" : "center" });
  };
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
        const subject = encodeURIComponent(`Portfolio contact, ${form.name}`);
        window.location.href = `mailto:adelinewen1107@outlook.com?subject=${subject}&body=${body}`;
        setStatus("mailed");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const t = COPY[lang];
  const ids = ["about", "research", "arena", "contact"];

  const renderSection = (i: number, sec: Section, right: ReactNode, rev = false, leftExtra: ReactNode = null) => (
    <section className={`sec${rev ? " rev" : ""}`} id={ids[i]} data-i={i} ref={setRef(i)}>
      <div className="inner">
        <div className="left">
          <div className="label">{sec.label}</div>
          <h2>{sec.title}</h2>
          <p className="lead">{sec.lead}</p>
          {leftExtra}
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
      <a href="#main" className="skip">
        {lang === "zh" ? "跳到内容" : "Skip to content"}
      </a>
      <div className="grain" />
      {/* ink-bleed filter: roughens the ∞ mark's vector edges so it reads pen-on-paper */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
        <filter id="ink" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* thickens glyph strokes in place (no layout shift) for the cover ink lens */}
        <filter id="thicken" x="-10%" y="-10%" width="120%" height="120%">
          <feMorphology operator="dilate" radius="1.4" />
        </filter>
      </svg>
      <div className="cursor" ref={cursorRef} aria-hidden="true" />

      <nav>
        <div className="logo">Adeline Wen</div>
        <div className="navright">
          <div className="links">
            {t.nav.map((label, i) => (
              <button key={i} className={i === active ? "active" : ""} onClick={() => goTo(i)}>
                {label}
              </button>
            ))}
          </div>
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
              aria-pressed={dark === true}
              onClick={flipTheme}
            >
              ◐
            </button>
          </div>
        </div>
      </nav>

      <main id="main" tabIndex={-1}>
      <header className="hero" ref={heroRef}>
        {/* cover kept clean — no animated field (the noise-field experiments read greasy) */}
        {/* the cover lines: huge, stacked, offset — each revealed through a line mask */}
        <div className="cover">
          <div className="namewrap" ref={nameRef}>
            <h1>
              <span className="mline"><span className="minner l1">Adeline</span></span>
              <span className="mline l2w">
                <span className="minner l2">
                  <em>Wen</em>
                </span>
              </span>
            </h1>
            {/* ink lens: identical name (decorative div, not a 2nd h1), stroke-
                thickened, revealed under the cursor */}
            <div className="inkl" aria-hidden="true">
              <span className="mline"><span className="minner l1">Adeline</span></span>
              <span className="mline l2w">
                <span className="minner l2">
                  <em>Wen</em>
                </span>
              </span>
            </div>
          </div>
          <p className="sub">{t.heroSub}</p>
        </div>
        {/* cover foot: scroll cue left, CTA right */}
        <div className="cover-foot">
          <div className="hint">{t.heroHint}</div>
          <button className="cta" onClick={() => goTo(3)}>{t.heroCta}</button>
        </div>
      </header>

      {renderSection(
        0,
        t.about,
        <>
          <ul className="tl">
            {t.about.resume.map((item) => (
              <li key={item.h}>
                <div className="y">{item.y}</div>
                <div className="h">{linked(item.h, item.href)}</div>
                <div className="dsc">{item.d}</div>
              </li>
            ))}
          </ul>
          <a className="more cv-link" href="/Adeline-Wen-CV.pdf" download>
            {lang === "zh" ? "下载完整简历 ↓" : "Download full CV ↓"}
          </a>
        </>,
        false,
        <div className="honors-wrap">
          <div className="honors-label">{t.about.honorsLabel}</div>
          <ul className="honors">
            {t.about.honors.map((h) => (
              <li key={h.t}>
                <div className="hinfo">
                  <span className="hn">{linked(h.t, h.href)}</span>
                  <span className="hd">{h.d}</span>
                </div>
                <span className="hm">{h.m}</span>
              </li>
            ))}
          </ul>
        </div>
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
        </ul>,
        true // zig-zag: this spread runs right-to-left
      )}

      {/* 03, Arena (full project page) */}
      <section className="sec arena-sec" id="arena" data-i={2} ref={setRef(2)}>
        <div className="arena-wrap">
          <div className="label">{t.arena.label}</div>
          <h2>{t.arena.title}</h2>
          <p className="lead">{t.arena.lead}</p>

          <ul className="rows arena-stats">
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

          <p className="ablock-intro">{t.arena.funnelIntro}</p>

          <div className="ablock">
            <h3>{t.arena.value.h}</h3>
            <ul className="alist abody">
              {t.arena.value.items.map((v) => (
                <li key={v.h}>
                  <b>{v.h}</b>{lang === "zh" ? "：" : ": "}{v.d}
                </li>
              ))}
            </ul>
          </div>

          <div className="ablock">
            <h3>{t.arena.roadmap.h}</h3>
            <ul className="aroad abody">
              {t.arena.roadmap.steps.map((s) => (
                <li key={s.phase}>
                  <div className="rp">{s.phase}</div>
                  <div className="rw">{s.when}</div>
                  <div className="rwhat">{s.what}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* the section lands on the dream — a full-width closing statement, no label */}
          <p className="arena-vision">{t.arena.vision.d}</p>

          {/* product signature: Arena's own ∞ mark, rendered in ink to stay in-system */}
          <div className="arena-sign">
            <svg className="inf-mark" viewBox="0 0 84 44" aria-hidden="true" focusable="false">
              <path
                d="M42 22 C 35 12 28 8 22 8 A 14 14 0 1 0 22 36 C 28 36 35 32 42 22 C 49 12 56 8 62 8 A 14 14 0 1 1 62 36 C 56 36 49 32 42 22 Z"
                fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
            <span className="wm">arena</span>
            <a className="more" href={t.arena.more.href} target="_blank" rel="noopener noreferrer">
              {t.arena.more.text}
            </a>
          </div>
        </div>
      </section>

      {/* 04, Contact (with working form) */}
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
              <label htmlFor="cf-name" className="sr-only">{t.contact.form.name}</label>
              <input
                id="cf-name"
                required
                autoComplete="name"
                placeholder={t.contact.form.name}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <label htmlFor="cf-email" className="sr-only">{t.contact.form.email}</label>
              <input
                id="cf-email"
                required
                type="email"
                autoComplete="email"
                placeholder={t.contact.form.email}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <label htmlFor="cf-message" className="sr-only">{t.contact.form.message}</label>
              <textarea
                id="cf-message"
                required
                placeholder={t.contact.form.message}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button type="submit" disabled={status === "sending"}>
                {status === "sending" ? t.contact.form.sending : t.contact.form.send}
              </button>
              <div role="status" aria-live="polite">
                {status === "sent" && <div className="status ok">{t.contact.form.sent}</div>}
                {status === "mailed" && <div className="status ok">{t.contact.form.mailed}</div>}
                {status === "error" && <div className="status err">{t.contact.form.err}</div>}
              </div>
            </form>
          </div>
          <div className="right">
            <div className="clinks">
              {t.contact.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  download={l.download || undefined}
                  target={l.href.startsWith("mailto") || l.download ? undefined : "_blank"}
                  rel={l.href.startsWith("mailto") || l.download ? undefined : "noopener noreferrer"}
                >
                  {l.label}
                  <span className="ar">{l.val}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="colophon">{t.colophon}</div>
      </section>
      </main>

      <div className="prog" aria-hidden="true">
        <div className="count">
          <b>{String(active + 1).padStart(2, "0")}</b> / 04
        </div>
        <svg width="70" height="44" viewBox="7 0 70 44">
          <path
            ref={trackRef}
            className="track"
            d="M42 22 C 35 12 28 8 22 8 A 14 14 0 1 0 22 36 C 28 36 35 32 42 22 C 49 12 56 8 62 8 A 14 14 0 1 1 62 36 C 56 36 49 32 42 22 Z"
          />
          <circle ref={beadRef} className="bead" r="3" cx="42" cy="22" />
        </svg>
      </div>
    </>
  );
}
