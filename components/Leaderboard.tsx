"use client";

import { useEffect, useRef } from "react";
import type { Board } from "@/lib/arena";

// Arena's top traders set in the site's own type. The one motion on the page that
// explains the product: when the board first scrolls into view the rows start out
// of order and settle into rank, once. Already on screen at load, reduced motion
// or Save-Data: it is simply shown in order.
const L = {
  en: {
    head: ["#", "Trader", "Score", "ROI 90D", "PnL", "Max DD"],
    market: { futures: "Futures", spot: "Spot", onchain: "On-chain" },
    cap: (n: number, d: string) => `Top ${n} human traders by Arena Score over 90 days, bots excluded. Data as of ${d}.`,
    live: "Live board",
    month: (d: Date) => d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }),
  },
  zh: {
    head: ["#", "交易者", "评分", "90 天收益", "盈亏", "最大回撤"],
    market: { futures: "合约", spot: "现货", onchain: "链上" },
    cap: (n: number, d: string) => `按 90 天 Arena 评分排名的前 ${n} 位真人交易者，已排除机器人。数据截至 ${d}。`,
    live: "查看实时榜单",
    month: (d: Date) => `${d.getUTCFullYear()} 年 ${d.getUTCMonth() + 1} 月`,
  },
};

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });
const pct = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(1)}%`;
// a fixed shuffle (not random) so server and client render the same thing
const SHUFFLE = [3, 5, 0, 4, 1, 2];

export default function Leaderboard({ board, lang }: { board: Board; lang: "en" | "zh" }) {
  const list = useRef<HTMLDivElement>(null);
  const t = L[lang];

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const calm =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (calm || el.getBoundingClientRect().top < window.innerHeight) return;
    const rows = [...el.children] as HTMLElement[];
    const tops = rows.map((r) => r.offsetTop);
    const from = rows.map((_, i) => `translateY(${tops[SHUFFLE[i] % rows.length] - tops[i]}px)`);
    // rows wait out of sight in their shuffled slots, so nothing overprints before the move
    rows.forEach((r, i) => {
      r.style.transform = from[i];
      r.style.opacity = "0";
    });
    const cs = getComputedStyle(document.documentElement);
    const ease = cs.getPropertyValue("--ease").trim();
    // token durations in ms (browsers normalise them to either "0.7s" or "80ms")
    const sec = (v: string) => {
      const t = cs.getPropertyValue(v).trim();
      return t.endsWith("ms") ? parseFloat(t) : parseFloat(t) * 1000;
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        rows.forEach((r, i) => {
          // each row stays invisible while it crosses the others and only shows where it lands
          r.animate(
            // easing sits on the keyframe so the fade-in point is a point in time, not in eased progress
            [{ transform: from[i], opacity: 0, easing: ease }, { opacity: 0, offset: 0.6 }, { transform: "none", opacity: 1 }],
            { duration: sec("--dur") * 1.3, delay: 120 + i * sec("--stagger") * 1.5, fill: "backwards" },
          );
          r.style.transform = "";
          r.style.opacity = "";
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      rows.forEach((r) => {
        r.style.transform = "";
        r.style.opacity = "";
      });
    };
  }, []);

  const asOf = board.asOf ? t.month(new Date(board.asOf)) : "";

  return (
    <figure className="board">
      <div role="table" aria-label={t.cap(board.rows.length, asOf)}>
        <div role="rowgroup">
          <div role="row" className="board-row board-head">
            {t.head.map((h, i) => (
              <span role="columnheader" key={h} className={`c${i}`}>
                {h}
              </span>
            ))}
          </div>
        </div>
        <div role="rowgroup" ref={list}>
          {board.rows.map((r, i) => (
            <div role="row" className="board-row" key={r.name + r.exchange}>
              <span role="cell" className="c0">{String(i + 1).padStart(2, "0")}</span>
              <span role="cell" className="c1">
                <span className="b-name">{r.name}</span>
                <span className="b-src">
                  {r.exchange} · {t.market[r.market]}
                </span>
              </span>
              <span role="cell" className="c2">{Math.round(r.score)}</span>
              <span role="cell" className="c3">{pct(r.roi)}</span>
              <span role="cell" className="c4">{usd.format(r.pnl)}</span>
              <span role="cell" className="c5">{r.mdd === null ? "—" : pct(-r.mdd)}</span>
            </div>
          ))}
        </div>
      </div>
      <figcaption>
        {t.cap(board.rows.length, asOf)}{" "}
        <a className="tlink" href="https://arenafi.org" target="_blank" rel="noopener noreferrer">
          {t.live} ↗
        </a>
      </figcaption>
    </figure>
  );
}
