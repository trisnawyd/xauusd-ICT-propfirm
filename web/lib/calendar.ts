import { getHTFList, getLTFList, getNewsList, getTradeLogList } from "./content";
import type { CalendarDay, Direction } from "./types";

export interface CalendarHighlights {
  htf?: { date: string; bias?: string; updated?: string };
  ltf?: {
    date: string;
    slug: string;
    direction: Direction;
    session: string;
    time: string;
    grade?: string;
    entry?: string;
  };
  trade?: {
    date: string;
    netPnl?: string;
    pnlSign: "pos" | "neg" | null;
    wins?: string;
    losses?: string;
  };
  news?: {
    date: string;
    slug: string[];
    event?: string;
    impact?: string;
    implication?: string;
  };
}

function emptyDay(date: string): CalendarDay {
  return {
    date,
    pnlSign: null,
    ltfCount: 0,
    ltfBreakdown: { long: 0, short: 0, wait: 0 },
    news: [],
  };
}

/** "+$35.65" -> "pos", "-$12.00" / "−$12.00" -> "neg", else null. */
function pnlSign(raw?: string): "pos" | "neg" | null {
  if (!raw) return null;
  const t = raw.trim();
  if (/^[-−]/.test(t)) return "neg";
  if (/^\+/.test(t)) return "pos";
  return null;
}

/**
 * Merge the four per-section lists into one map keyed by YYYYMMDD. All reads
 * happen at build time (SSG) via lib/content.ts — this is pure aggregation.
 */
export function getCalendarDays(): Map<string, CalendarDay> {
  const days = new Map<string, CalendarDay>();
  const get = (date: string) => {
    let d = days.get(date);
    if (!d) {
      d = emptyDay(date);
      days.set(date, d);
    }
    return d;
  };

  for (const h of getHTFList()) {
    get(h.date).htfBias = h.biasLabel;
  }

  for (const l of getLTFList()) {
    const d = get(l.date);
    d.ltfCount += 1;
    if (l.direction === "LONG") d.ltfBreakdown.long += 1;
    else if (l.direction === "SHORT") d.ltfBreakdown.short += 1;
    else if (l.direction === "WAIT") d.ltfBreakdown.wait += 1;
  }

  for (const t of getTradeLogList()) {
    const d = get(t.date);
    d.netPnl = t.netPnl;
    d.pnlSign = pnlSign(t.netPnl);
    d.wins = t.wins;
    d.losses = t.losses;
  }

  for (const n of getNewsList()) {
    get(n.date).news.push({ event: n.event, impact: n.impact });
  }

  return days;
}

/**
 * The most recent entry from each section, for the highlights strip. All four
 * list functions return newest-first, so element [0] is the latest.
 */
export function getCalendarHighlights(): CalendarHighlights {
  const htf = getHTFList()[0];
  const ltf = getLTFList()[0];
  const trade = getTradeLogList()[0];
  const news = getNewsList()[0];

  return {
    htf: htf && { date: htf.date, bias: htf.biasLabel, updated: htf.updated },
    ltf: ltf && {
      date: ltf.date,
      slug: ltf.slug,
      direction: ltf.direction,
      session: ltf.session,
      time: ltf.time,
      grade: ltf.grade,
      entry: ltf.entry,
    },
    trade: trade && {
      date: trade.date,
      netPnl: trade.netPnl,
      pnlSign: pnlSign(trade.netPnl),
      wins: trade.wins,
      losses: trade.losses,
    },
    news: news && {
      date: news.date,
      slug: news.slug,
      event: news.event,
      impact: news.impact,
      implication: news.implication,
    },
  };
}
