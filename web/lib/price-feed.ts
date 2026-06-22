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
