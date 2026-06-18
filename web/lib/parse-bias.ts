import type { BiasReading, TFBias } from "./types";

function classify(word: string | undefined): TFBias {
  if (!word) return "NEUTRAL";
  const w = word.toUpperCase();
  if (w.startsWith("BULL")) return "BULLISH";
  if (w.startsWith("BEAR")) return "BEARISH";
  if (w.startsWith("RANG")) return "RANGING";
  return "NEUTRAL";
}

function score(b: TFBias): number {
  if (b === "BULLISH") return 1;
  if (b === "BEARISH") return -1;
  return 0;
}

/**
 * Parse the `## Bias:` heading line of htf-context.md.
 * Expected shape:
 *   ## Bias: RANGING-to-BEARISH — ... D1 BEARISH | H4 BULLISH-label/... | H1 violent ...
 */
export function parseBias(htf: string): BiasReading {
  const lines = htf.split("\n");
  const biasLine = lines.find((l) => /^##\s+Bias:/i.test(l)) ?? "";

  // Headline label: text right after "Bias:" up to the first dash/pipe.
  const labelMatch = biasLine.replace(/^##\s+Bias:\s*/i, "");
  const label = labelMatch.split(/[—\-|]/)[0].trim() || "Unknown";

  // Per-timeframe: first ALL-CAPS word immediately after the TF token.
  const tf = (token: string): TFBias => {
    const m = biasLine.match(new RegExp(`\\b${token}\\s+([A-Z][A-Za-z]+)`));
    return classify(m?.[1]);
  };

  const d1 = tf("D1");
  const h4 = tf("H4");
  const h1 = tf("H1");

  // Weighted needle — D1 dominates, then H4, then H1.
  const value = score(d1) * 0.4 + score(h4) * 0.35 + score(h1) * 0.25;

  // Current price + premium/discount from the Premium/Discount section.
  const pdMatch = htf.match(/Current price\s+([\d.,]+)\s*→\s*(PREMIUM|DISCOUNT)/i);

  const updatedMatch = htf.match(/^updated:\s*(.+)$/m);

  return {
    label,
    d1,
    h4,
    h1,
    value: Math.max(-1, Math.min(1, value)),
    currentPrice: pdMatch?.[1],
    premiumDiscount: pdMatch?.[2]?.toUpperCase() as "PREMIUM" | "DISCOUNT" | undefined,
    updated: updatedMatch?.[1]?.trim(),
  };
}
