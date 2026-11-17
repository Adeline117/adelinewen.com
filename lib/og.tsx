import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactNode } from "react";
import { LINKS, NODES } from "@/components/sybil";
import { getBoard } from "@/lib/arena";

// Share cards for the research and Arena pages, in the home card's dress (Fraunces on
// paper, ink, the site's address bottom right) with each page's own evidence on the right.
// Latin type only: the card font has no hanzi (and its plus sign renders badly here), so the /zh pages share
// the same cards.
export const OG_SIZE = { width: 1200, height: 630 };
const INK = "#15130f";
const MUTE = "#6b675f";

async function card(paper: string, kicker: string, title: string, sub: string, art: ReactNode) {
  const fraunces = await readFile(join(process.cwd(), "app/og-assets/fraunces-340.ttf"));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", padding: "64px 72px", background: paper, color: INK, fontFamily: "Fraunces" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 520 }}>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 5, color: MUTE }}>{kicker}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 80, fontWeight: 300, letterSpacing: -2.5, lineHeight: 1 }}>{title}</div>
            <div style={{ display: "flex", fontSize: 26, color: MUTE, marginTop: 24, lineHeight: 1.35 }}>{sub}</div>
          </div>
          <div style={{ display: "flex", fontSize: 24 }}>adelinewen.com</div>
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "flex-end" }}>{art}</div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Fraunces", data: fraunces, weight: 300, style: "normal" }] },
  );
}

// the Sybil overlap network, as on the page: circle area = Sybils caught, line weight =
// wallets caught in both airdrops
export function researchCard() {
  const max = Math.max(...NODES.map((n) => n.sybils));
  const top = Math.max(...LINKS.map((l) => l[2]));
  const r = (s: number) => 4 + 22 * Math.sqrt(s / max);
  const map = (
    <svg width="520" height="372" viewBox="30 10 540 350">
      {LINKS.map(([a, b, v]) => (
        <line key={`${a}-${b}`} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke={INK} strokeOpacity={0.22 + 0.5 * (v / top)} strokeWidth={0.8 + 4 * (v / top)} />
      ))}
      {NODES.map((n) => (
        <circle key={n.name} cx={n.x} cy={n.y} r={r(n.sybils)} fill="#eef1f2" stroke={INK} strokeWidth={1.4} />
      ))}
    </svg>
  );
  return card(
    "#eef1f2",
    "RESEARCH · UW CAIS LAB",
    "Catching Sybils.",
    "HasciDB: 2.54M Ethereum addresses across 16 airdrops, the largest open airdrop Sybil database.",
    map,
  );
}

// the top of the live board: rank, where the trader trades, score and 90-day return.
// Trader names are left off (many are in scripts the card font can't set).
export async function arenaCard() {
  const { rows } = await getBoard();
  const list = (
    <div style={{ display: "flex", flexDirection: "column", width: 500 }}>
      {rows.slice(0, 5).map((row, i) => (
        <div key={i} style={{ display: "flex", alignItems: "baseline", padding: "16px 0", borderTop: i ? `1px solid #d8d0bf` : "none" }}>
          <span style={{ width: 52, fontSize: 20, color: MUTE }}>{String(i + 1).padStart(2, "0")}</span>
          <span style={{ flex: 1, fontSize: 22, letterSpacing: 3, color: MUTE }}>{row.exchange.toUpperCase()}</span>
          <span style={{ width: 96, fontSize: 48, textAlign: "right" }}>{Math.round(row.score)}</span>
          <span style={{ width: 130, fontSize: 24, textAlign: "right", color: MUTE }}>{`${row.roi < 0 ? "−" : ""}${Math.abs(row.roi).toFixed(1)}%`}</span>
        </div>
      ))}
    </div>
  );
  return card(
    "#f4ecdc",
    "ARENA · ARENAFI.ORG",
    "Crypto’s world ranking.",
    "Over 68,000 traders from more than 44 exchanges, ranked by one public 0–100 score.",
    list,
  );
}
