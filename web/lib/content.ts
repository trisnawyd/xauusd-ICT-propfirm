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
  TradeLogEntry,
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
  return safeReaddir(base)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const date = f.replace(/\.md$/, "");
      const { data } = safeMatter(fs.readFileSync(path.join(base, f), "utf8"));
      const biasMatch = fs
        .readFileSync(path.join(base, f), "utf8")
        .match(/^##\s+Bias:\s*(.+)$/m);
      return {
        date,
        updated: str(data.updated),
        biasLabel: biasMatch?.[1]?.split(/[—\-|]/)[0].trim(),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getHTF(date: string): MarkdownDoc | null {
  const p = dir("Analysis", "HTF", `${date}.md`);
  if (!fs.existsSync(p)) return null;
  return readDoc(p);
}

// ---------------- LTF ----------------

export function getLTFList(): LTFEntry[] {
  const base = dir("Analysis", "LTF");
  const out: LTFEntry[] = [];
  for (const date of safeReaddir(base)) {
    const dayDir = path.join(base, date);
    if (!fs.statSync(dayDir).isDirectory()) continue;
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

export function getLTF(date: string, slug: string): (MarkdownDoc & { entry: LTFEntry }) | null {
  const p = dir("Analysis", "LTF", date, `${slug}.md`);
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
  return { ...doc, entry };
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
    // Only the clean one-file-per-event analyses (Analysis/News/<date>/<file>).
    // Skip deeper working dirs like "June NFP/" (multi-model scratch dumps).
    .filter((slug) => slug.length === 2)
    .map((slug) => {
      const file = path.join(base, ...slug.slice(0, -1), `${slug[slug.length - 1]}.md`);
      const { data } = safeMatter(fs.readFileSync(file, "utf8"));
      return {
        slug,
        date: str(data.date) ?? slug[0],
        time: str(data.time),
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
      date: str(d.date) ?? slug[0],
      time: str(d.time),
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
      const pnl = raw.match(/Net P&L:\s*\*\*([^*]+)\*\*/);
      const wl = raw.match(/Wins:\s*(\d+)\s*\|\s*Losses:\s*(\d+)/);
      const trades = raw.match(/Trades:\s*(\d+)/);
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
