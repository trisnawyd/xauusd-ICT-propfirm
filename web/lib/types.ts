export type Direction = "LONG" | "SHORT" | "WAIT" | "UNKNOWN";

export type TFBias = "BULLISH" | "BEARISH" | "RANGING" | "NEUTRAL";

export interface BiasReading {
  /** Headline label, e.g. "RANGING-to-BEARISH" */
  label: string;
  d1: TFBias;
  h4: TFBias;
  h1: TFBias;
  /** Aggregate needle value in [-1, 1] (−1 = max bearish, +1 = max bullish) */
  value: number;
  /** Current price parsed from the Premium/Discount section, if present */
  currentPrice?: string;
  /** PREMIUM | DISCOUNT, if present */
  premiumDiscount?: "PREMIUM" | "DISCOUNT";
  updated?: string;
}

export interface MarkdownDoc {
  /** raw frontmatter object */
  meta: Record<string, unknown>;
  /** redacted markdown body (frontmatter stripped) */
  body: string;
}

export interface LTFEntry {
  date: string; // YYYYMMDD
  slug: string; // filename without .md
  time: string; // display time
  session: string;
  direction: Direction;
  grade?: string;
  score?: number;
  gateFailed?: string;
  entry?: string;
  sl?: string;
  tp?: string;
  rr?: string;
}

export interface HTFEntry {
  date: string; // YYYYMMDD
  updated?: string;
  biasLabel?: string;
}

export interface NewsEntry {
  slug: string[]; // path segments under Analysis/News
  date: string;
  time?: string;
  event?: string;
  impact?: string;
  implication?: string;
  tradeRule?: string;
}

export interface TradeLogEntry {
  date: string; // YYYYMMDD
  netPnl?: string;
  wins?: string;
  losses?: string;
  trades?: string;
}

export interface CalendarDay {
  date: string; // YYYYMMDD
  htfBias?: string; // headline bias label from Analysis/HTF/<date>.md
  netPnl?: string; // raw P&L string from Trade Log/<date>.md
  pnlSign: "pos" | "neg" | null;
  wins?: string;
  losses?: string;
  ltfCount: number;
  ltfBreakdown: { long: number; short: number; wait: number };
  news: { event?: string; impact?: string }[];
}
