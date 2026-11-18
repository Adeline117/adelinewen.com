import type { ReactNode } from "react";
import SubPage from "./SubPage";
import Leaderboard from "./Leaderboard";
import type { Board } from "@/lib/arena";

type Lang = "en" | "zh";

// /arena and /zh/arena: Arena told at length. How the score works is taken from
// arenafi.org/methodology, Arena's public method.
const INF = "M42 22 C 35 12 28 8 22 8 A 14 14 0 1 0 22 36 C 28 36 35 32 42 22 C 49 12 56 8 62 8 A 14 14 0 1 1 62 36 C 56 36 49 32 42 22 Z";

const COPY: Record<
  Lang,
  {
    label: string;
    title: ReactNode;
    lead: ReactNode;
    stats: { n: string; d: string }[];
    score: { h: string; intro: string; rows: { name: string; key: string; what: string }[] };
    road: { h: string; steps: { phase: string; when: string; what: string }[] };
    vision: ReactNode;
    links: { href: string; text: string }[];
    next: { href: string; text: string };
    other: string;
  }
> = {
  en: {
    label: "Arena · arenafi.org",
    title: (
      <>
        Crypto’s <em>world ranking</em>.
      </>
    ),
    lead: (
      <>
        Tennis has the ATP rankings and chess has Elo. Crypto trading moves hundreds of billions of dollars a day, but there has been no common way to tell who trades best. Each exchange shows only its own traders. I built{" "}
        <a className="tlink" href="https://arenafi.org" target="_blank" rel="noopener noreferrer">
          Arena
        </a>{" "}
        on my own to put 68,000+ traders from 44+ centralized and decentralized exchanges on one board, ranked by one public score.
      </>
    ),
    stats: [
      { n: "68,000+", d: "traders ranked" },
      { n: "44+", d: "exchanges · CEX + DEX" },
      { n: "2 h", d: "between recomputes of the board" },
    ],
    score: {
      h: "The Arena Score",
      intro:
        "Arena Score = 100 × Quality × Confidence, from 0 to 100. It measures risk-adjusted performance, not raw return, and roughly equals the share of traders you beat.",
      rows: [
        { name: "Quality", key: "5 measures", what: "Half earnings, half skill: profit 0.30, return 0.20, drawdown 0.20, Sharpe ratio 0.20, consistency 0.10." },
        { name: "Confidence", key: "0.35 – 1.0", what: "Grows with the number of trades, trades ÷ (trades + 50), so a thin track record can’t reach the top." },
        { name: "Time", key: "3 windows", what: "The three windows count 70%, 25% and 5%: months of steady results matter, a week’s spike barely does." },
        { name: "Fair play", key: "tanh cap", what: "Extreme returns are compressed (10,000% scores only a little above 1,000%), outliers are checked, and every score is computed on Arena’s servers, never self-reported." },
      ],
    },
    road: {
      h: "Roadmap",
      steps: [
        { phase: "V1 · Discover", when: "now", what: "Live leaderboard, trader claiming & verification, community cold start." },
        { phase: "V2 · Prove", when: "6–18 mo", what: "A stable in-app currency, head-to-head battles, spectator betting, the first 12-week season." },
        { phase: "V3 · Follow", when: "18–36 mo", what: "Copy-trading vaults, advanced bet types, institutional data API." },
      ],
    },
    vision: (
      <>
        Traders compete hard, but trading has no world ranking, no official matches and no star traders the public can follow. Arena builds them in that order: <em>find the best traders, let them prove it in public, then let anyone follow them.</em>
      </>
    ),
    links: [
      { href: "https://arenafi.org", text: "Visit arenafi.org ↗" },
      { href: "https://arenafi.org/methodology", text: "The full method ↗" },
    ],
    next: { href: "/research", text: "Research →" },
    other: "/zh/arena",
  },
  zh: {
    label: "Arena · arenafi.org",
    title: (
      <>
        加密交易的<em>世界排名</em>
      </>
    ),
    lead: (
      <>
        网球有 ATP 排名，国际象棋有 Elo。加密交易每天成交数千亿美元，却一直没有统一的办法判断谁交易得最好，各家交易所只展示自己的交易者。我一个人做了{" "}
        <a className="tlink" href="https://arenafi.org" target="_blank" rel="noopener noreferrer">
          Arena
        </a>
        ，把 44+ 家中心化和去中心化交易所的 68,000+ 名交易者放上同一张榜，用一个公开的评分排名。
      </>
    ),
    stats: [
      { n: "68,000+", d: "交易者排名" },
      { n: "44+", d: "交易所 · CEX + DEX" },
      { n: "2 小时", d: "榜单重新计算一次" },
    ],
    score: {
      h: "Arena 评分",
      intro: "Arena 评分 = 100 × 质量 × 置信度，范围 0 到 100。它衡量的是风险调整后的表现，而不是单纯的收益率，大致等于你超过了百分之多少的交易者。",
      rows: [
        { name: "质量", key: "5 项", what: "收益和技术各占一半：盈亏 0.30、收益率 0.20、回撤 0.20、夏普比率 0.20、稳定性 0.10。" },
        { name: "置信度", key: "0.35 – 1.0", what: "随交易笔数增长，交易数 ÷（交易数 + 50），数据太少的账户上不了榜首。" },
        { name: "时间", key: "3 个窗口", what: "三个时间窗口分别占 70%、25%、5%：几个月的稳定成绩才算数，一周的暴涨几乎不算。" },
        { name: "防作弊", key: "tanh 封顶", what: "极端收益会被压缩（10,000% 只比 1,000% 高一点），异常值会被检查，所有分数都在 Arena 的服务器上计算，不能自己上报。" },
      ],
    },
    road: {
      h: "路线图",
      steps: [
        { phase: "V1 · 发现", when: "现在", what: "排行榜上线、交易者认领与验证、社区冷启动。" },
        { phase: "V2 · 证明", when: "6–18 个月", what: "稳定的站内货币、1v1 对战、观众下注、第一个 12 周赛季。" },
        { phase: "V3 · 跟随", when: "18–36 个月", what: "跟单金库、进阶下注、机构数据 API。" },
      ],
    },
    vision: (
      <>
        交易者之间竞争很激烈，但交易没有世界排名，没有正式比赛，也没有大众能追随的明星交易者。Arena 按这个顺序来做：<em>先找出最强的人，再让他们公开比，最后让任何人都能跟。</em>
      </>
    ),
    links: [
      { href: "https://arenafi.org", text: "访问 arenafi.org ↗" },
      { href: "https://arenafi.org/methodology", text: "完整的评分方法 ↗" },
    ],
    next: { href: "/zh/research", text: "研究 →" },
    other: "/arena",
  },
};

const ARENA_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Arena",
  url: "https://arenafi.org",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  description:
    "A ranking of 68,000+ crypto traders from 44+ centralized and decentralized exchanges on one board, by a single public 0–100 Arena Score.",
  creator: { "@type": "Person", name: "Adeline Wen", url: "https://adelinewen.com" },
};

export default function ArenaPage({ lang, board }: { lang: Lang; board: Board }) {
  const t = COPY[lang];
  return (
    <SubPage lang={lang} paper="arena" other={t.other} next={t.next}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARENA_LD) }} />
      <section className="sec arena-sec page-sec">
        <div className="arena-wrap">
          <div className="label">{t.label}</div>
          <h1>{t.title}</h1>
          <p className="lead">{t.lead}</p>

          <Leaderboard board={board} lang={lang} />

          <ul className="rows arena-stats">
            {t.stats.map((r) => (
              <li key={r.d}>
                <div className="rinfo">
                  <span className="n">{r.n}</span>
                  <span className="rd">{r.d}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="ablock">
            <h2>{t.score.h}</h2>
            <div className="abody">
              <p>{t.score.intro}</p>
              <ul className="aroad">
                {t.score.rows.map((r) => (
                  <li key={r.name}>
                    <div className="rp">{r.name}</div>
                    <div className="rw">{r.key}</div>
                    <div className="rwhat">{r.what}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="ablock">
            <h2>{t.road.h}</h2>
            <ul className="aroad abody">
              {t.road.steps.map((s) => (
                <li key={s.phase} className={s.when === "now" || s.when === "现在" ? "now" : undefined}>
                  <div className="rp">{s.phase}</div>
                  <div className="rw">{s.when}</div>
                  <div className="rwhat">{s.what}</div>
                </li>
              ))}
            </ul>
          </div>

          <p className="arena-vision">{t.vision}</p>

          <div className="arena-sign">
            <svg className="inf-mark" viewBox="0 0 84 44" aria-hidden="true" focusable="false">
              <path d={INF} fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              <path className="inf-glint" d={INF} pathLength={1} />
            </svg>
            <span className="wm">arena</span>
            <span className="sign-links">
              {t.links.map((l) => (
                <a key={l.href} className="more" href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.text}
                </a>
              ))}
            </span>
          </div>
        </div>
      </section>
    </SubPage>
  );
}
