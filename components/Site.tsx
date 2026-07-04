"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import dynamic from "next/dynamic";

// cursor-reactive needle field behind the cover — desktop only (it's a pointer
// interaction), loaded after the text paints
const Field = dynamic(() => import("@/components/Field"), { ssr: false });

type Lang = "en" | "zh";
type Section = { label: string; title: ReactNode; lead: string; more: { text: string; href: string } };
type Row = { n: string; d: string; m: string };
type CS = { k: string; v: string };
type Val = { h: string; d: string };
type Road = { phase: string; when: string; what: string };
type Rev = { k: string; v: string };
type TL = { y: string; h: string; d: string };
type CLink = { label: string; val: string; href: string };
type Form = { name: string; email: string; message: string; send: string; sending: string; sent: string; err: string };

const COPY: Record<
  Lang,
  {
    nav: string[];
    heroSub: ReactNode;
    heroHint: string;
    heroCta: string;
    colophon: string;
    about: Section & { resume: TL[] };
    research: Section & { tl: TL[] };
    arena: Section & {
      stats: Row[];
      funnelIntro: string;
      cs: CS[];
      value: { h: string; items: Val[] };
      model: { h: string; d: string; points: string[] };
      roadmap: { h: string; steps: Road[] };
      revenue: { h: string; d: string; rows: Rev[] };
      vision: { h: string; d: string };
    };
    contact: { label: string; title: ReactNode; lead: string; links: CLink[]; form: Form };
  }
> = {
  en: {
    nav: ["About", "Research", "Work", "Contact"],
    colophon: "© 2026 Adeline Wen",
    heroSub: (
      <>
        Research assistant at the University of Washington Decentralized Computing Lab, and independent developer of <b>arenafi.org</b>.
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
        "I'm Adeline (she/her), an Economics undergrad at the University of Washington, with an Informatics minor. I'm fascinated by how decentralized systems actually behave: I research them at the UW Decentralized Computing Lab, dig into markets as a crypto analyst at Stably, and build products of my own to put ideas to the test.",
      more: { text: "Connect on LinkedIn ↗", href: "https://www.linkedin.com/in/adeline1107" },
      resume: [
        { y: "Apr 2026 – Present", h: "Crypto Analyst · Stably", d: "Research & growth at a stablecoin infrastructure company." },
        { y: "Feb 2026 – Present", h: "Undergraduate Research Assistant · UW Decentralized Computing Lab", d: "Research under Prof. Wei Cai; built hascidb.org (open-source Sybil database, 2.5M+ wallets) and published on blockchain, crypto, and decentralized AI." },
        { y: "Dec 2025 – Present", h: "Independent Developer · Arena", d: "Solo-built arenafi.org, ranking 68,000+ traders." },
        { y: "2025 – 2029", h: "Bachelor of Economics · University of Washington", d: "Informatics minor · Dean's List." },
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
        "At the UW Decentralized Computing Lab with Prof. Wei Cai, first-author and co-authored research in blockchain and decentralized AI, from airdrop Sybil detection (catching one person who fakes thousands of wallets to farm token giveaways) to interpretable on-chain governance.",
      more: { text: "Explore HasciDB ↗", href: "https://hascidb.org" },
      tl: [
        { y: "Accepted · Nanyang Blockchain Conference 2026", h: "HasciDB: A Database for Identifying Crypto Sybil Airdrop Hunters", d: "First author. The largest open-source cross-project airdrop Sybil-detection database (hascidb.org, 2.5M+ wallets). With Chunyang Li, Shutong Qu, Leon Leng, and Wei Cai." },
        { y: "Accepted · IEEE SMC 2026 · IEEE Xplore", h: "Human-Centered Decision Support for Crypto Airdrop Governance: Interpretable Behavioral Modeling of Strategic Hunters", d: "Co-author. An extension of HasciDB toward interpretable, human-centered airdrop governance. With Lindsay Zastrow, Cheri Allen, Leah Ingold, Yan Bai, and Wei Cai." },
      ],
    },
    arena: {
      label: "03 · Arena",
      title: (
        <>
          Arena, <em>solo-built</em>.
        </>
      ),
      lead:
        "Tennis has the ATP rankings; chess has Elo. Crypto trading moves hundreds of billions a day, yet no one could answer the simplest question: who are the best traders? Arena (arenafi.org) is the cross-platform answer. I designed, built, and shipped it solo, unifying 68,000+ traders across 44+ exchanges (CEX + DEX) into one transparent Arena Score, giving crypto trading a world ranking for the first time.",
      more: { text: "Visit arenafi.org ↗", href: "https://arenafi.org" },
      cs: [
        { k: "Discover", v: "Leaderboard, live now. Unified rankings across every exchange, built on a data pipeline spanning 44+ sources." },
        { k: "Prove", v: "Battles (V2). Traders go head-to-head on their real trades while spectators predict and bet." },
        { k: "Follow", v: "Copy trading (V3). The proven top traders open vaults anyone can follow." },
      ],
      stats: [
        { n: "68,000+", d: "traders ranked", m: "" },
        { n: "44+", d: "exchanges · CEX + DEX", m: "" },
        { n: "60", d: "automated data pipelines", m: "" },
        { n: "Solo", d: "designed, built & shipped", m: "Next.js · Supabase · Redis" },
      ],
      funnelIntro: "Rankings are only step one. Arena's full form is a three-stage funnel, where each step builds on the data of the last:",
      value: {
        h: "Why it's different",
        items: [
          { h: "Cross-platform visibility", d: "The only place that sees every trader on every exchange. Binance won't show you Bybit's traders; Arena shows them all." },
          { h: "One transparent standard", d: "Arena Score, 0–100, weighted 60% return-on-investment and 40% absolute profit, with a published methodology anyone can audit. Accounts under $500 profit are filtered out, and my own Sybil-detection research keeps fake-wallet farming off the board." },
          { h: "Competition, not display", d: "Not a static dashboard but a live contest." },
        ],
      },
      model: {
        h: "The business model: UFC + Polymarket",
        d: "Every breakout crypto product monetizes speculation. Arena makes the traders themselves the show: performers fight, spectators predict and bet, and the house takes a cut from both sides. Three things that have never been combined into one product:",
        points: [
          "Real traders competing on their real trades, not virtual athletes, not passive copy-trading.",
          "Cross-exchange normalization, putting a Binance trader and a Bybit trader on one scale.",
          "Spectators betting on real humans making real trades, in real time.",
        ],
      },
      roadmap: {
        h: "Roadmap",
        steps: [
          { phase: "V1 · Foundation", when: "now", what: "Live leaderboard, trader claiming & verification, community cold start." },
          { phase: "V2 · Competition", when: "6–18 mo", what: "A stable in-app currency, head-to-head battles, spectator betting, the first 12-week season." },
          { phase: "V3 · Full form", when: "18–36 mo", what: "Copy-trading vaults, advanced bet types, ARENA token, institutional data API." },
        ],
      },
      revenue: {
        h: "How it makes money",
        d: "Revenue comes from several independent layers, each stands on its own, so it holds even when any one slows:",
        rows: [
          { k: "Battle rake", v: "5% of bounty pools" },
          { k: "Betting spread", v: "3% of every bet placed" },
          { k: "Vault fees", v: "10% management + 10% performance" },
          { k: "SaaS & data", v: "Pro ($9.99/mo), exchange affiliates, data licensing to funds" },
        ],
      },
      vision: {
        h: "Long-term vision",
        d: "Trading is fiercely competitive, yet it's the only sport with no world ranking, no official matches, and no star system. Arena fills in all three, in order: discover the best, let them prove it in public, then let anyone follow.",
      },
    },
    contact: {
      label: "04 · Contact",
      title: (
        <>
          Let&apos;s <em>talk</em>.
        </>
      ),
      lead: "Based in Seattle, open to research and building opportunities, always up for a good problem.",
      links: [
        { label: "Email", val: "adelinewen1107@outlook.com", href: "mailto:adelinewen1107@outlook.com" },
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
        sent: "Thanks, I'll be in touch soon.",
        err: "Couldn't send, please email adelinewen1107@outlook.com directly.",
      },
    },
  },
  zh: {
    nav: ["关于", "研究", "项目", "联系"],
    colophon: "© 2026 Adeline Wen",
    heroSub: (
      <>
        华盛顿大学去中心化计算实验室研究助理，<b>arenafi.org</b> 独立开发者。
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
        "我是 Adeline（她/她），华盛顿大学经济学本科生，辅修信息学。我着迷于去中心化系统真实的运转方式：在华盛顿大学去中心化计算实验室做研究，在 Stably 任加密分析师钻研市场，也独立打造自己的产品，把想法付诸实践。",
      more: { text: "在 LinkedIn 联系 ↗", href: "https://www.linkedin.com/in/adeline1107" },
      resume: [
        { y: "2026.04 – 至今", h: "加密分析师 · Stably", d: "稳定币基础设施公司的研究与增长。" },
        { y: "2026.02 – 至今", h: "本科研究助理 · UW 去中心化计算实验室", d: "导师 Wei Cai 教授；构建了 hascidb.org（开源 Sybil 检测数据库，250 万+ 钱包），并发表区块链、加密与去中心化 AI 方向的多篇论文。" },
        { y: "2025.12 – 至今", h: "独立开发 · Arena", d: "独立构建 arenafi.org，为 68,000+ 交易者排名。" },
        { y: "2025 – 2029", h: "经济学学士 · 华盛顿大学", d: "辅修信息学 · 院长名单。" },
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
        { y: "已接收 · 南洋区块链大会 2026", h: "HasciDB：识别加密 Sybil 空投猎人的数据库", d: "第一作者。最大的开源跨项目空投 Sybil 检测数据库（hascidb.org，250 万+ 钱包）。合作者：Chunyang Li、Shutong Qu、Leon Leng、Wei Cai。" },
        { y: "已接收 · IEEE SMC 2026 · IEEE Xplore", h: "面向加密空投治理的以人为本决策支持：策略型猎手的可解释行为建模", d: "合作者。HasciDB 的延伸工作，面向可解释、以人为本的空投治理。合作者：Lindsay Zastrow、Cheri Allen、Leah Ingold、Yan Bai、Wei Cai。" },
      ],
    },
    arena: {
      label: "03 · Arena",
      title: (
        <>
          Arena，<em>独立打造</em>。
        </>
      ),
      lead:
        "网球有 ATP 排名，国际象棋有 Elo。加密交易每天成交数千亿美元，却没人能回答最基本的问题：谁是最好的交易者？Arena（arenafi.org）是跨平台的答案。我独立设计、开发并上线，把 44+ 交易所（中心化 + 去中心化）上分散的 68,000+ 交易者，统一进一个透明的 Arena 评分，第一次给加密交易一个世界排名。",
      more: { text: "访问 arenafi.org ↗", href: "https://arenafi.org" },
      cs: [
        { k: "发现", v: "排行榜（已上线）：跨所统一排名，建立在覆盖 44+ 数据源的管线之上。" },
        { k: "证明", v: "对战（V2）：交易者用各自的真实交易正面对决，观众预测并下注。" },
        { k: "跟随", v: "跟单（V3）：被验证的顶尖交易者开设金库，任何人都能跟投。" },
      ],
      stats: [
        { n: "68,000+", d: "交易者排名", m: "" },
        { n: "44+", d: "交易所 · CEX + DEX", m: "" },
        { n: "60", d: "自动化数据管线", m: "" },
        { n: "独立", d: "设计、开发、上线", m: "Next.js · Supabase · Redis" },
      ],
      funnelIntro: "排名只是第一步。Arena 的完整形态是一个三段漏斗，每一步都建立在上一步的数据之上：",
      value: {
        h: "为什么不一样",
        items: [
          { h: "跨平台可见", d: "唯一能看见每个交易所、每位交易者的地方。币安不会告诉你 Bybit 的交易者；Arena 全都看得见。" },
          { h: "统一透明的标准", d: "Arena 评分，0–100，其中收益率（ROI）占 60%、绝对盈亏占 40%，方法论公开、任何人可审计。绝对盈利低于 $500 的账户被过滤，我自己的 Sybil 检测研究也把伪造钱包刷分挡在榜外。" },
          { h: "是竞技，不是展示", d: "这里的数据不是静态看板，而是实时比赛。" },
        ],
      },
      model: {
        h: "商业模式：UFC + Polymarket",
        d: "所有爆发过的加密产品都在为投机变现。Arena 让交易者本身成为表演：选手对战，观众预测下注，平台从两边抽成。三件从未被组合进同一个产品的事：",
        points: [
          "真实交易者用真实交易正面较量，不是虚拟选手，也不是被动跟单。",
          "跨所归一化，把币安和 Bybit 的交易者放进同一把尺子。",
          "观众对真实的人、真实的交易、实时下注。",
        ],
      },
      roadmap: {
        h: "路线图",
        steps: [
          { phase: "V1 · 基础", when: "现在", what: "排行榜上线、交易者认领与验证、社区冷启动。" },
          { phase: "V2 · 竞技", when: "6–18 个月", what: "稳定的站内货币、1v1 对战、观众下注、第一个 12 周赛季。" },
          { phase: "V3 · 完整形态", when: "18–36 个月", what: "跟单金库、进阶下注、ARENA 代币、机构数据 API。" },
        ],
      },
      revenue: {
        h: "怎么赚钱",
        d: "收入来自多条相互独立的线，每条都能独立支撑，任何一条放缓都不塌：",
        rows: [
          { k: "对战抽成", v: "奖池的 5%" },
          { k: "下注价差", v: "每笔下注的 3%" },
          { k: "金库费", v: "10% 管理费 + 10% 业绩费" },
          { k: "SaaS 与数据", v: "Pro（$9.99/月）、交易所返佣、对基金的数据授权" },
        ],
      },
      vision: {
        h: "长期愿景",
        d: "交易竞争激烈，却是唯一没有世界排名、没有官方比赛、没有明星体系的运动。Arena 依次补上这三样：先发现最强者，再让他们公开证明，最后让任何人都能跟随。",
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
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [wide, setWide] = useState(false); // gate the cursor field to desktop widths
  const secRefs = useRef<(HTMLElement | null)[]>([]);
  const heroRef = useRef<HTMLElement>(null);
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

  // the cursor field is a pointer interaction — mount it only on desktop widths
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setDark(stored ? stored === "dark" : false); // default light — Swiss paper is the primary face
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

  const renderSection = (i: number, sec: Section, right: ReactNode, rev = false) => (
    <section className={`sec${rev ? " rev" : ""}`} id={ids[i]} data-i={i} ref={setRef(i)}>
      <div className="inner">
        <div className="left">
          <div className="label">{sec.label}</div>
          <h2>{sec.title}</h2>
          <p className="lead">{sec.lead}</p>
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
      <a href="#main" className="skip">
        {lang === "zh" ? "跳到内容" : "Skip to content"}
      </a>
      <div className="grain" />

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
        {/* cursor-reactive needle field behind the cover */}
        {wide && (
          <div className="hero-field" aria-hidden="true"><Field /></div>
        )}
        {/* the cover lines: huge, stacked, offset — each revealed through a line mask */}
        <div className="cover">
          <h1>
            <span className="mline"><span className="minner l1">Adeline</span></span>
            <span className="mline l2w">
              <span className="minner l2">
                <em>Wen</em>
              </span>
            </span>
          </h1>
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
            <h3>{lang === "zh" ? "漏斗" : "The funnel"}</h3>
            <dl className="cs abody">
              {t.arena.cs.map((c) => (
                <div key={c.k}>
                  <dt>{c.k}</dt>
                  <dd>{c.v}</dd>
                </div>
              ))}
            </dl>
          </div>

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
            <h3>{t.arena.model.h}</h3>
            <div className="abody">
              <p>{t.arena.model.d}</p>
              <ul className="alist">
                {t.arena.model.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
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

          <div className="ablock">
            <h3>{t.arena.revenue.h}</h3>
            <div className="abody">
              <p>{t.arena.revenue.d}</p>
              <dl className="arev">
                {t.arena.revenue.rows.map((r) => (
                  <div key={r.k}>
                    <dt>{r.k}</dt>
                    <dd>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="ablock">
            <h3>{t.arena.vision.h}</h3>
            <p className="abody">{t.arena.vision.d}</p>
          </div>

          <a className="more" href={t.arena.more.href} target="_blank" rel="noopener noreferrer">
            {t.arena.more.text}
          </a>
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
        <div className="colophon">{t.colophon}</div>
      </section>
      </main>

      <div className="prog" aria-hidden="true">
        <div className="count">
          <b>{String(active + 1).padStart(2, "0")}</b> / 04
        </div>
        <svg width="84" height="44" viewBox="0 0 84 44">
          <path
            ref={trackRef}
            className="track"
            d="M42,22 C34,8 10,8 10,22 C10,36 34,36 42,22 C50,8 74,8 74,22 C74,36 50,36 42,22 Z"
          />
          <circle ref={beadRef} className="bead" r="3" cx="42" cy="22" />
        </svg>
      </div>
    </>
  );
}
