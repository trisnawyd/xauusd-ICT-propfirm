"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarDay } from "@/lib/types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Today's UTC date as YYYYMMDD — the vault keys everything by UTC date. */
function todayUTC(): string {
  const n = new Date();
  return (
    `${n.getUTCFullYear()}` +
    `${String(n.getUTCMonth() + 1).padStart(2, "0")}` +
    `${String(n.getUTCDate()).padStart(2, "0")}`
  );
}

/** Build a YYYYMMDD string; day/month overflow normalizes across months/years. */
function dateStr(year: number, month0: number, day: number): string {
  const dt = new Date(Date.UTC(year, month0, day));
  return (
    `${dt.getUTCFullYear()}` +
    `${String(dt.getUTCMonth() + 1).padStart(2, "0")}` +
    `${String(dt.getUTCDate()).padStart(2, "0")}`
  );
}

/** Color from an HTF bias headline label (e.g. "RANGING-to-BEARISH"). */
function biasColor(label?: string): string {
  if (!label) return "bg-muted-foreground/30";
  const u = label.toUpperCase();
  if (u.includes("BULL")) return "bg-green-500";
  if (u.includes("BEAR")) return "bg-red-500";
  if (u.includes("RANG") || u.includes("NEUTRAL")) return "bg-amber-500";
  return "bg-muted-foreground/40";
}

function hasContent(d?: CalendarDay): d is CalendarDay {
  return !!d && (!!d.htfBias || d.ltfCount > 0 || !!d.netPnl || d.news.length > 0);
}

export function CalendarView({ days }: { days: CalendarDay[] }) {
  const byDate = useMemo(() => {
    const m = new Map<string, CalendarDay>();
    for (const d of days) m.set(d.date, d);
    return m;
  }, [days]);

  const today = todayUTC();

  // Land on the most recent month that has data; fall back to the current month.
  const latest = useMemo(
    () => days.map((d) => d.date).sort().at(-1) ?? today,
    [days, today],
  );
  const [cursor, setCursor] = useState({
    year: Number(latest.slice(0, 4)),
    month0: Number(latest.slice(4, 6)) - 1,
  });

  const { year, month0 } = cursor;
  const monthKey = `${year}${String(month0 + 1).padStart(2, "0")}`;
  const firstWeekday = new Date(Date.UTC(year, month0, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();

  const cells: string[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(dateStr(year, month0, 1 - firstWeekday + i));
  for (let d = 1; d <= daysInMonth; d++) cells.push(dateStr(year, month0, d));
  let k = 1;
  while (cells.length % 7 !== 0) cells.push(dateStr(year, month0, daysInMonth + k++));

  const step = (delta: number) => {
    setCursor((c) => {
      const m = c.month0 + delta;
      return { year: c.year + Math.floor(m / 12), month0: ((m % 12) + 12) % 12 };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          {MONTH_NAMES[month0]} {year}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous month"
            className="rounded-md border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              setCursor({ year: Number(today.slice(0, 4)), month0: Number(today.slice(4, 6)) - 1 })
            }
            className="rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next month"
            className="rounded-md border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="bg-background py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
          >
            {w}
          </div>
        ))}

        {cells.map((date) => {
          const inMonth = date.slice(0, 6) === monthKey;
          const d = inMonth ? byDate.get(date) : undefined;
          const content = hasContent(d);
          const dayNum = Number(date.slice(6, 8));
          const isToday = date === today;

          const inner = (
            <>
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isToday
                      ? "flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      : inMonth
                        ? "text-foreground/80"
                        : "text-muted-foreground/40",
                  )}
                >
                  {dayNum}
                </span>
                {content && (
                  <div className="flex items-center gap-1.5">
                    {d!.htfBias && (
                      <span
                        className={cn("size-2.5 rounded-full", biasColor(d!.htfBias))}
                        title={`HTF: ${d!.htfBias}`}
                      />
                    )}
                    {d!.news.length > 0 && (
                      <Newspaper
                        className={cn(
                          "size-3.5",
                          d!.news.some((n) => n.impact?.toUpperCase() === "HIGH")
                            ? "text-amber-500"
                            : "text-muted-foreground",
                        )}
                      />
                    )}
                  </div>
                )}
              </div>

              {content && (
                <div className="mt-1.5 flex flex-col gap-1">
                  {d!.netPnl && (
                    <span
                      className={cn(
                        "w-fit rounded-md px-1.5 py-0.5 font-mono text-xs font-semibold",
                        d!.pnlSign === "pos"
                          ? "bg-green-500/10 text-green-500"
                          : d!.pnlSign === "neg"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {d!.netPnl}
                    </span>
                  )}
                  {d!.ltfCount > 0 && (
                    <span className="flex w-fit items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground/80">{d!.ltfCount} LTF</span>
                      {d!.ltfBreakdown.long > 0 && (
                        <span className="text-green-500">{d!.ltfBreakdown.long}L</span>
                      )}
                      {d!.ltfBreakdown.short > 0 && (
                        <span className="text-red-500">{d!.ltfBreakdown.short}S</span>
                      )}
                      {d!.ltfBreakdown.wait > 0 && (
                        <span className="text-amber-500">{d!.ltfBreakdown.wait}W</span>
                      )}
                    </span>
                  )}
                </div>
              )}
            </>
          );

          const cellClass = cn(
            "flex min-h-28 flex-col p-2 lg:min-h-32",
            content
              ? "bg-background transition-colors hover:bg-muted"
              : cn("cal-stripes", inMonth ? "bg-background" : "bg-muted/20"),
          );

          return content ? (
            <Link key={date} href={`/day/${date}`} className={cellClass}>
              {inner}
            </Link>
          ) : (
            <div key={date} className={cellClass}>
              {inner}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-green-500" /> Bullish
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-red-500" /> Bearish
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-amber-500" /> Ranging
        </span>
        <span className="flex items-center gap-1.5">
          <Newspaper className="size-3.5 text-amber-500" /> High-impact news
        </span>
        <span>
          <span className="text-green-500">L</span>/<span className="text-red-500">S</span>/
          <span className="text-amber-500">W</span> = Long / Short / Wait analyses
        </span>
      </div>
    </div>
  );
}
