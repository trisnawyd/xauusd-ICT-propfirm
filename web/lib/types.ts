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

export type LevelKind = "entry" | "sl" | "tp";

/** A single horizontal price level to render + watch on the live board. */
export interface WatchLevel {
  price: number;
  label: string; // e.g. "Watch A · Entry"
  kind: LevelKind;
  scenario: "A" | "B" | "primary";
  direction: Direction; // direction of the scenario this level belongs to
}

export interface OhlcBar {
  time: number; // UTC epoch seconds
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Per-analysis OHLC snapshot committed alongside the LTF markdown
 * (`<slug>_ohlc.json`). Candles + levels are broker (MT5) price; the live
 * gold-api spot marker is mapped to broker scale via offset = brokerRef - spotRef.
 */
export interface OhlcSnapshot {
  symbol: string;
  timeframe: string;
  generatedAt: string;
  brokerRef: number; // MT5 mid at snapshot
  spotRef: number; // gold-api spot at snapshot
  bars: OhlcBar[];
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
  /** Parsed key levels (only populated by getLTF, not in list views). */
  levels?: WatchLevel[];
}

/**
 * Scalp analysis summary. Same shape as LTFEntry — Scalp files share LTF's
 * directory layout and WAIT frontmatter. The one difference: LONG/SHORT scalp
 * files use `tp1`/`tp2`/`rr_tp1` (per Docs/file-formats.md). The reader maps
 * `tp1`→`tp` and `rr_tp1`→`rr` so shared UI/level code works unchanged; `tp2`
 * is the only extra field.
 */
export interface ScalpEntry {
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
  tp?: string; // holds tp1 for scalps
  tp2?: string; // optional second target
  rr?: string; // holds rr_tp1 for scalps
  /** Parsed key levels (only populated by getScalp, not in list views). */
  levels?: WatchLevel[];
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
  scalpCount: number;
  scalpBreakdown: { long: number; short: number; wait: number };
  news: { event?: string; impact?: string }[];
}
