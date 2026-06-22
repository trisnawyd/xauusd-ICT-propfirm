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
