// Arena's public leaderboard, read server-side so the portfolio can typeset the
// product in its own type instead of showing a screenshot of it.
// - one request a day (ISR); a failed or malformed response falls back to the
//   committed snapshot, so the section never renders empty
// - human traders only: bots and anything flagged suspicious are dropped, then
//   the survivors are renumbered 1..n (the API's rank counts the bots too)
// - no avatars: they live on exchange CDNs and would leak visitors' IPs there
import snapshot from "./arena-snapshot.json";

export type BoardRow = {
  name: string;
  exchange: string;
  market: "futures" | "spot" | "onchain";
  score: number;
  roi: number; // percent
  pnl: number; // USD
  mdd: number | null; // percent
};
export type Board = { rows: BoardRow[]; asOf: string };

type ApiTrader = {
  platform: string;
  display_name: string;
  arena_score: number;
  roi: number;
  pnl: number;
  max_drawdown: number | null;
  computed_at: string;
  is_bot?: boolean;
  quality_flags?: { is_suspicious?: boolean };
};

const SIZE = 6;
const URL = `https://www.arenafi.org/api/rankings?window=90d&limit=${SIZE * 2}&trader_type=human`;

const EXCHANGES: Record<string, string> = {
  okx: "OKX", binance: "Binance", bybit: "Bybit", bitget: "Bitget", mexc: "MEXC", htx: "HTX",
  gate: "Gate", gateio: "Gate", bingx: "BingX", btcc: "BTCC", bitmart: "BitMart", bitunix: "Bitunix",
  blofin: "BloFin", phemex: "Phemex", toobit: "Toobit", xt: "XT", hyperliquid: "Hyperliquid", gmx: "GMX",
};
const ONCHAIN = new Set(["hyperliquid", "gmx"]);

function normalise(t: ApiTrader): BoardRow | null {
  if (t.is_bot || t.quality_flags?.is_suspicious) return null;
  if (![t.arena_score, t.roi, t.pnl].every(Number.isFinite) || !t.display_name) return null;
  const [head, ...rest] = t.platform.split("_");
  const kind = rest.join("_");
  const market = ONCHAIN.has(head) || /web3|wallet/.test(kind) ? "onchain" : /spot/.test(kind) ? "spot" : "futures";
  return {
    name: t.display_name,
    exchange: EXCHANGES[head] ?? head.charAt(0).toUpperCase() + head.slice(1),
    market,
    score: t.arena_score,
    roi: t.roi,
    pnl: t.pnl,
    mdd: Number.isFinite(t.max_drawdown) ? (t.max_drawdown as number) : null,
  };
}

function toBoard(traders: ApiTrader[]): Board | null {
  const rows = traders.map(normalise).filter((r): r is BoardRow => r !== null).slice(0, SIZE);
  if (rows.length < 3) return null;
  // the newest computation among the rows shown, so the caption never overstates freshness
  const asOf = traders.map((t) => t.computed_at).filter(Boolean).sort().at(-1) ?? "";
  return { rows, asOf };
}

const FALLBACK = toBoard(snapshot.traders as ApiTrader[]) as Board;

export async function getBoard(): Promise<Board> {
  try {
    const res = await fetch(URL, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return FALLBACK;
    const body = (await res.json()) as { success?: boolean; data?: { traders?: ApiTrader[] } };
    const traders = body?.data?.traders;
    return (Array.isArray(traders) && toBoard(traders)) || FALLBACK;
  } catch {
    return FALLBACK;
  }
}
