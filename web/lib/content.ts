import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { redact } from "./redact";
import type {
  Direction,
  HTFEntry,
  LTFEntry,
  MarkdownDoc,
  NewsEntry,
  OhlcSnapshot,
  TradeLogEntry,
  WatchLevel,
} from "./types";

// On Vercel set Root Directory = web AND enable "Include files outside of the
// Root Directory in the Build Step" so the parent vault is on disk at build.
// All reads happen at build time (SSG) — never at request time.
export const CONTENT_ROOT = path.join(process.cwd(), "..");

const dir = (...p: string[]) => path.join(CONTENT_ROOT, ...p);

/**
 * gray-matter, but tolerant of the vault's malformed YAML (e.g. unquoted
 * colons inside `source:` values). On a YAML error we fall back to a lenient
 * line-by-line `key: value` parse so a bad field never breaks the build.
 */
function safeMatter(raw: string): { data: Record<string, unknown>; content: string } {
  try {
    const { data, content } = matter(raw);
    return { data: data as Record<string, unknown>, content };
  } catch {
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!fm) return { data: {}, content: raw };
    const data: Record<string, unknown> = {};
    for (const line of fm[1].split(/\r?\n/)) {
      const idx = line.indexOf(":");
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      value = value.replace(/^["']|["']$/g, "");
      if (key) data[key] = value;
    }
    return { data, content: fm[2] ?? "" };
  }
}

function safeReaddir(p: string): string[] {
  try {
    return fs.readdirSync(p);
  } catch {
    return [];
  }
}

function readDoc(filePath: string): MarkdownDoc {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = safeMatter(raw);
  return { meta: data, body: redact(content.trim()) };
}

function str(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  return String(v);
}

/** Normalize a bias value to its leading label: "BEARISH (all TF aligned)" ->
 *  "BEARISH", "NEUTRAL → BULLISH" -> "NEUTRAL", "**STRONG BULLISH**" ->
 *  "STRONG BULLISH". Strips bold and cuts at the first separator/qualifier. */
function cleanBias(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  const s = String(v)
    .replace(/\*\*/g, "")
    .split(/[—\-|(→\n]/)[0]
    .trim();
  return s || undefined;
}

function num(v: unknown): number | undefined {
  if (v === undefined || v === null) return undefined;
  const n = Number(String(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** Build the entry/sl/tp levels for one scenario (a trade or a Watch leg). */
function scenarioLevels(
  scenario: "A" | "B" | "primary",
  entry: number | undefined,
  sl: number | undefined,
  tp: number | undefined,
  direction?: Direction,
): WatchLevel[] {
  if (entry === undefined) return [];
  // Watch legs don't store direction in frontmatter — infer from TP side.
  const dir: Direction =
    direction ?? (tp !== undefined ? (tp > entry ? "LONG" : "SHORT") : "UNKNOWN");
  const tag = scenario === "primary" ? "" : `Watch ${scenario} · `;
  const out: WatchLevel[] = [
    { price: entry, label: `${tag}Entry`, kind: "entry", scenario, direction: dir },
  ];
  if (sl !== undefined) out.push({ price: sl, label: `${tag}Stop Loss`, kind: "sl", scenario, direction: dir });
  if (tp !== undefined) out.push({ price: tp, label: `${tag}Take Profit`, kind: "tp", scenario, direction: dir });
  return out;
}

/**
 * Extract key levels from LTF frontmatter — reliable, structured, already
 * maintained by the desk system (no body regex). For LONG/SHORT reads we use
 * the primary entry/sl/tp; for WAIT reads we use the watch_a/watch_b legs.
 */
function extractLevels(meta: Record<string, unknown>, entry: LTFEntry): WatchLevel[] {
  const levels: WatchLevel[] = [];
  if (entry.direction === "LONG" || entry.direction === "SHORT") {
    levels.push(
      ...scenarioLevels("primary", num(entry.entry), num(entry.sl), num(entry.tp), entry.direction),
    );
  }
  levels.push(...scenarioLevels("A", num(meta.watch_a_entry), num(meta.watch_a_sl), num(meta.watch_a_tp)));
  levels.push(...scenarioLevels("B", num(meta.watch_b_entry), num(meta.watch_b_sl), num(meta.watch_b_tp)));
  return levels;
}

function directionFromName(name: string): Direction {
  const lower = name.toLowerCase();
  if (lower.includes("long")) return "LONG";
  if (lower.includes("short")) return "SHORT";
  if (lower.includes("wait")) return "WAIT";
  return "UNKNOWN";
}

// ---------------- Context ----------------

export function getContextDoc(name: "account" | "htf-context" | "ltf-memory"): MarkdownDoc | null {
  const p = dir("Context", `${name}.md`);
  if (!fs.existsSync(p)) return null;
  return readDoc(p);
}

/** Raw htf-context.md content (frontmatter included) for bias parsing. */
export function getHtfContextRaw(): string {
  const p = dir("Context", "htf-context.md");
  if (!fs.existsSync(p)) return "";
  return fs.readFileSync(p, "utf8");
}

// ---------------- HTF ----------------

export function getHTFList(): HTFEntry[] {
  const base = dir("Analysis", "HTF");
  // Layout: Analysis/HTF/<YYYYMM>/<YYYYMMDD>.md
  return safeReaddir(base)
    .filter((m) => /^\d{6}$/.test(m) && fs.statSync(path.join(base, m)).isDirectory())
    .flatMap((month) =>
      safeReaddir(path.join(base, month))
        .filter((f) => f.endsWith(".md"))
        .map((f) => path.join(month, f)),
    )
    .map((relPath) => {
      const date = path.basename(relPath, ".md");
      const raw = fs.readFileSync(path.join(base, relPath), "utf8");
      const { data } = safeMatter(raw);
      // Prefer the frontmatter bias key — it's clean and reliable. Files use a
      // few key variants (bias / primary_bias / overall_bias / htf_bias). Only
      // if none is present fall back to the body "## Bias …" heading, which is
      // fragile: some files title the section "## Bias Summary" or "## Summary",
      // so a naive capture grabs "Summary"/"Resolution" as the bias.
      const fmBias =
        str(data.bias) ??
        str(data.primary_bias) ??
        str(data.overall_bias) ??
        str(data.htf_bias);
      const bodyBias = raw
        .match(/^##\s+Bias\b:?\s*([\s\S]*?)(?:\r?\n\s*\r?\n|\r?\n##|$)/m)?.[1];
      const biasLabel = cleanBias(fmBias ?? bodyBias);
      return {
        date,
        updated: str(data.updated),
        biasLabel: biasLabel || undefined,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getHTF(date: string): MarkdownDoc | null {
  const p = dir("Analysis", "HTF", date.slice(0, 6), `${date}.md`);
  if (!fs.existsSync(p)) return null;
  return readDoc(p);
}

// ---------------- LTF ----------------

export function getLTFList(): LTFEntry[] {
  const base = dir("Analysis", "LTF");
  const out: LTFEntry[] = [];
  // Layout: Analysis/LTF/<YYYYMM>/<YYYYMMDD>/<slug>.md
  const dayDirs: { date: string; dayDir: string }[] = [];
  for (const month of safeReaddir(base)) {
    const monthDir = path.join(base, month);
    if (!/^\d{6}$/.test(month) || !fs.statSync(monthDir).isDirectory()) continue;
    for (const date of safeReaddir(monthDir)) {
      const dayDir = path.join(monthDir, date);
      if (!fs.statSync(dayDir).isDirectory()) continue;
      dayDirs.push({ date, dayDir });
    }
  }
  for (const { date, dayDir } of dayDirs) {
    for (const file of safeReaddir(dayDir)) {
      if (!file.endsWith(".md")) continue;
      const slug = file.replace(/\.md$/, "");
      const { data } = safeMatter(fs.readFileSync(path.join(dayDir, file), "utf8"));
      out.push({
        date,
        slug,
        time: str(data.time) ?? slug.split("_")[1] ?? "",
        session: str(data.session) ?? "",
        direction: (str(data.direction)?.toUpperCase() as Direction) || directionFromName(slug),
        grade: str(data.setup_grade)?.replace(/"/g, ""),
        score: data.setup_score != null ? Number(data.setup_score) : undefined,
        gateFailed: str(data.gate_failed) ?? str(data.gate_fail),
        entry: str(data.entry),
        sl: str(data.sl),
        tp: str(data.tp),
        rr: str(data.rr),
      });
    }
  }
  return out.sort((a, b) => (b.date + b.slug).localeCompare(a.date + a.slug));
}

/** Sibling OHLC snapshot (`<slug>_ohlc.json`) for the live watch board, if present. */
function getLTFOhlc(date: string, slug: string): OhlcSnapshot | null {
  const p = dir("Analysis", "LTF", date.slice(0, 6), date, `${slug}_ohlc.json`);
  if (!fs.existsSync(p)) return null;
  try {
    const snap = JSON.parse(fs.readFileSync(p, "utf8")) as OhlcSnapshot;
    return Array.isArray(snap.bars) && snap.bars.length > 0 ? snap : null;
  } catch {
    return null;
  }
}

export function getLTF(
  date: string,
  slug: string,
): (MarkdownDoc & { entry: LTFEntry; ohlc: OhlcSnapshot | null }) | null {
  const p = dir("Analysis", "LTF", date.slice(0, 6), date, `${slug}.md`);
  if (!fs.existsSync(p)) return null;
  const doc = readDoc(p);
  const d = doc.meta;
  const entry: LTFEntry = {
    date,
    slug,
    time: str(d.time) ?? slug.split("_")[1] ?? "",
    session: str(d.session) ?? "",
    direction: (str(d.direction)?.toUpperCase() as Direction) || directionFromName(slug),
    grade: str(d.setup_grade)?.replace(/"/g, ""),
    score: d.setup_score != null ? Number(d.setup_score) : undefined,
    gateFailed: str(d.gate_failed) ?? str(d.gate_fail),
    entry: str(d.entry),
    sl: str(d.sl),
    tp: str(d.tp),
    rr: str(d.rr),
  };
  entry.levels = extractLevels(d, entry);
  return { ...doc, entry, ohlc: getLTFOhlc(date, slug) };
}

// ---------------- News (variable depth under Analysis/News) ----------------

function walkMd(base: string, rel: string[] = []): string[][] {
  const here = path.join(base, ...rel);
  const results: string[][] = [];
  for (const name of safeReaddir(here)) {
    const full = path.join(here, name);
    if (fs.statSync(full).isDirectory()) {
      results.push(...walkMd(base, [...rel, name]));
    } else if (name.endsWith(".md")) {
      results.push([...rel, name.replace(/\.md$/, "")]);
    }
  }
  return results;
}

export function getNewsList(): NewsEntry[] {
  const base = dir("Analysis", "News");
  return walkMd(base)
    // Only the clean one-file-per-event analyses (Analysis/News/<YYYYMM>/<date>/<file>).
    // Skip deeper working dirs like "June NFP/" (multi-model scratch dumps).
    .filter((slug) => slug.length === 3 && /^\d{6}$/.test(slug[0]) && /^\d{8}$/.test(slug[1]))
    .map((slug) => {
      const file = path.join(base, ...slug.slice(0, -1), `${slug[slug.length - 1]}.md`);
      const { data } = safeMatter(fs.readFileSync(file, "utf8"));
      return {
        slug,
        date: str(data.date) ?? slug[1],
        time: str(data.time) ?? str(data.time_utc),
        event: str(data.event),
        impact: str(data.impact),
        implication: str(data.xauusd_implication),
        tradeRule: str(data.trade_rule),
      };
    })
    .sort((a, b) => b.slug.join("/").localeCompare(a.slug.join("/")));
}

export function getNews(slug: string[]): (MarkdownDoc & { entry: NewsEntry }) | null {
  const base = dir("Analysis", "News");
  const p = path.join(base, ...slug.slice(0, -1), `${slug[slug.length - 1]}.md`);
  if (!fs.existsSync(p)) return null;
  const doc = readDoc(p);
  const d = doc.meta;
  return {
    ...doc,
    entry: {
      slug,
      date: str(d.date) ?? slug.find((s) => /^\d{8}$/.test(s)) ?? slug[0],
      time: str(d.time) ?? str(d.time_utc),
      event: str(d.event),
      impact: str(d.impact),
      implication: str(d.xauusd_implication),
      tradeRule: str(d.trade_rule),
    },
  };
}

// ---------------- Trade Log (no frontmatter) ----------------

export function getTradeLogList(): TradeLogEntry[] {
  const base = dir("Trade Log");
  return safeReaddir(base)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const date = f.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(base, f), "utf8");
      // Tolerate the label variants the log files use: "Net P&L: **+$2.36**"
      // (label outside bold), "**Daily P&L: −$23.43**" (label inside bold), and
      // "Closed P&L: **+$49.55**". Capture the amount itself.
      const pnl = raw.match(/(?:Net|Daily|Closed) P&L:\s*\**\s*([+\-−]?\$[\d.,]+)/);
      // Tolerate "Wins: 2 | Losses: 3" and the inline "(2 win, 3 loss)" form.
      const wl =
        raw.match(/Wins:\s*(\d+)\s*\|\s*Losses:\s*(\d+)/) ||
        raw.match(/\((\d+)\s*wins?,\s*(\d+)\s*loss/i);
      // Tolerate "Trades: 3" and label variants like "Trades closed today: 8".
      const trades = raw.match(/Trades[^:\n]*:\s*(\d+)/);
      return {
        date,
        netPnl: pnl?.[1]?.trim(),
        wins: wl?.[1],
        losses: wl?.[2],
        trades: trades?.[1],
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getTradeLog(date: string): MarkdownDoc | null {
  const p = dir("Trade Log", `${date}.md`);
  if (!fs.existsSync(p)) return null;
  return readDoc(p);
}
