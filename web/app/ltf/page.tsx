import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Markdown } from "@/components/markdown";
import { DirectionBadge, GradeBadge } from "@/components/direction-badge";
import { getLTF, getLTFList } from "@/lib/content";
import { formatDate, timeFromSlug } from "@/lib/format";
import type { Direction, LTFEntry } from "@/lib/types";

export const dynamic = "force-static";

function Stat({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-mono text-base">{value}</div>
    </div>
  );
}

export default function LTFListPage() {
  const items = getLTFList();
  const latest = items[0];
  const latestDoc = latest ? getLTF(latest.date, latest.slug) : null;

  const byDate = new Map<string, LTFEntry[]>();
  for (const item of items) {
    if (!byDate.has(item.date)) byDate.set(item.date, []);
    byDate.get(item.date)!.push(item);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">LTF Analysis</h1>

      {latest && latestDoc && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Latest Snapshot
            </h2>
            <Link
              href={`/ltf/${latest.date}/${latest.slug}`}
              className="text-xs text-primary underline underline-offset-2"
            >
              Open full →
            </Link>
          </div>
          <Card className="border-primary/40">
            <CardContent className="space-y-5 py-5">
              <header className="flex flex-wrap items-center gap-3">
                <DirectionBadge direction={latestDoc.entry.direction as Direction} />
                <GradeBadge grade={latestDoc.entry.grade} />
                <span className="text-sm text-muted-foreground">
                  {formatDate(latest.date)} · {latestDoc.entry.time} · {latestDoc.entry.session}
                </span>
              </header>

              {(latestDoc.entry.direction === "LONG" || latestDoc.entry.direction === "SHORT") && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Stat label="Entry" value={latestDoc.entry.entry} />
                  <Stat label="Stop Loss" value={latestDoc.entry.sl} />
                  <Stat label="Take Profit" value={latestDoc.entry.tp} />
                  <Stat
                    label="R:R"
                    value={latestDoc.entry.rr ? `${latestDoc.entry.rr}:1` : undefined}
                  />
                </div>
              )}

              {latestDoc.entry.direction === "WAIT" && latestDoc.entry.gateFailed && (
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Gate failed
                  </div>
                  <div className="mt-1 text-sm">{latestDoc.entry.gateFailed}</div>
                </div>
              )}

              <Markdown>{latestDoc.body}</Markdown>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          All Analyses
        </h2>
        {[...byDate.entries()].map(([date, entries]) => (
          <section key={date} className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">{formatDate(date)}</h3>
            <div className="grid gap-3">
              {entries.map((e) => (
                <Link key={e.slug} href={`/ltf/${e.date}/${e.slug}`}>
                  <Card className="transition-colors hover:border-primary/50">
                    <CardContent className="flex items-center justify-between gap-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-12 font-mono text-sm text-muted-foreground">
                          {e.time || timeFromSlug(e.slug)}
                        </span>
                        <DirectionBadge direction={e.direction as Direction} />
                        <span className="text-sm text-muted-foreground">{e.session}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {e.direction !== "WAIT" && e.entry && (
                          <span className="font-mono text-sm">@ {e.entry}</span>
                        )}
                        <GradeBadge grade={e.grade} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </section>
    </div>
  );
}
