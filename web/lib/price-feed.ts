// Live XAU/USD spot price feed.
//
// Source: gold-api.com — keyless, CORS-enabled, no rate limit, browser-direct.
// This is SPOT gold (~$2-3 off broker MT5 levels), which is acceptable for a
// level-touch watch board (the "generic price acceptable" decision).
//
// Response shape:
//   { "price": 4194.9, "symbol": "XAU", "updatedAt": "2026-06-22T05:46:17Z", ... }

export interface GoldQuote {
  price: number;
  updatedAt: string;
}

const ENDPOINT = "https://api.gold-api.com/price/XAU";

export async function fetchGoldQuote(signal?: AbortSignal): Promise<GoldQuote> {
  const res = await fetch(ENDPOINT, { signal, cache: "no-store" });
  if (!res.ok) throw new Error(`gold-api ${res.status}`);
  const data: unknown = await res.json();
  const price = Number((data as { price?: unknown })?.price);
  if (!Number.isFinite(price)) throw new Error("gold-api: missing price");
  const updatedAt = String((data as { updatedAt?: unknown })?.updatedAt ?? new Date().toISOString());
  return { price, updatedAt };
}

// ---------------- Twelve Data (live candles + spot) ----------------
//
// Free tier: 8 req/min, ~800/day. XAU/USD = spot gold. Browser-direct with a
// NEXT_PUBLIC key (baked into the bundle — accepted static-export tradeoff).
// `timezone=UTC` keeps candle times aligned with the broker levels.

export const TWELVEDATA_KEY = process.env.NEXT_PUBLIC_TWELVEDATA_KEY;

export interface Candle {
  time: number; // UTC epoch seconds
  open: number;
  high: number;
  low: number;
  close: number;
}

// Map the desk's MT5 timeframe codes to Twelve Data intervals.
const TF_TO_INTERVAL: Record<string, string> = {
  M1: "1min",
  M5: "5min",
  M15: "15min",
  H1: "1h",
  H4: "4h",
  D1: "1day",
  W1: "1week",
};

export function intervalFor(timeframe?: string): string {
  return TF_TO_INTERVAL[(timeframe ?? "M5").toUpperCase()] ?? "5min";
}

interface TDValue {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

export async function fetchTwelveCandles(
  timeframe = "M5",
  outputsize = 120,
  signal?: AbortSignal,
): Promise<Candle[]> {
  if (!TWELVEDATA_KEY) throw new Error("TWELVEDATA key missing");
  const interval = intervalFor(timeframe);
  const url =
    `https://api.twelvedata.com/time_series?symbol=XAU/USD&interval=${interval}` +
    `&outputsize=${outputsize}&timezone=UTC&apikey=${TWELVEDATA_KEY}`;
  const res = await fetch(url, { signal, cache: "no-store" });
  if (!res.ok) throw new Error(`twelvedata ${res.status}`);
  const data = (await res.json()) as { status?: string; message?: string; values?: TDValue[] };
  if (data.status === "error") throw new Error(data.message ?? "twelvedata error");
  const values = data.values ?? [];
  // Twelve Data returns newest-first; convert to ascending epoch-second candles.
  return values
    .map((v) => ({
      time: Math.floor(Date.parse(v.datetime.replace(" ", "T") + "Z") / 1000),
      open: +v.open,
      high: +v.high,
      low: +v.low,
      close: +v.close,
    }))
    .filter((c) => Number.isFinite(c.time) && Number.isFinite(c.close))
    .sort((a, b) => a.time - b.time);
}

// ---------------- MT5 dev bridge (local broker candles + tick) ----------------
//
// LOCAL DEV ONLY. When NEXT_PUBLIC_MT5_BRIDGE_URL points at the running bridge
// (mt5-mcp-server `npm run bridge`, requires MT5 + EA up), the watch chart uses
// real broker candles/tick instead of spot — already on the broker price scale,
// so no spot→broker offset is needed. Unset in production: the chart falls back
// to Twelve Data / gold-api exactly as before.

export const MT5_BRIDGE_URL = process.env.NEXT_PUBLIC_MT5_BRIDGE_URL;

// The bridge talks to MT5 over a brittle ZMQ REQ socket that can wedge (a lost
// reply leaves the socket unable to ever answer again). Without a bound, a hung
// `/ohlcv`/`/tick` never rejects, the chart's tick() loop awaits forever, and it
// can never fall through to Twelve Data / gold-api — the watch board sticks on
// "connecting…". Cap each bridge call so a dead bridge degrades gracefully.
const MT5_TIMEOUT_MS = 2_500;

function bridgeBase(): string {
  if (!MT5_BRIDGE_URL) throw new Error("MT5 bridge URL missing");
  return MT5_BRIDGE_URL.replace(/\/$/, "");
}

export async function fetchMt5Candles(
  timeframe = "M5",
  count = 180,
  signal?: AbortSignal,
): Promise<Candle[]> {
  const url = `${bridgeBase()}/ohlcv?tf=${timeframe.toUpperCase()}&count=${count}`;
  const res = await fetch(url, { signal: signal ?? AbortSignal.timeout(MT5_TIMEOUT_MS), cache: "no-store" });
  if (!res.ok) throw new Error(`mt5 bridge ${res.status}`);
  const data = (await res.json()) as { error?: string; candles?: Candle[] };
  if (data.error) throw new Error(data.error);
  return (data.candles ?? []).filter((c) => Number.isFinite(c.time) && Number.isFinite(c.close));
}

export interface Mt5Tick {
  bid: number;
  ask: number;
  spread: number;
}

export async function fetchMt5Tick(signal?: AbortSignal): Promise<Mt5Tick> {
  const res = await fetch(`${bridgeBase()}/tick`, {
    signal: signal ?? AbortSignal.timeout(MT5_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`mt5 bridge ${res.status}`);
  const data = (await res.json()) as { error?: string; bid?: number; ask?: number; spread?: number };
  if (data.error) throw new Error(data.error);
  return { bid: Number(data.bid), ask: Number(data.ask), spread: Number(data.spread) };
}
