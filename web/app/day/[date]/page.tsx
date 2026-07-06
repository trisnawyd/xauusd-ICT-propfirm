import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { DirectionBadge, GradeBadge } from "@/components/direction-badge";
import { getHTFList, getLTFList, getScalpList, getNewsList, getTradeLogList } from "@/lib/content";
import { formatDate, timeFromSlug } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Direction } from "@/lib/types";

export const dynamic = "force-static";

export function generateStaticParams() {
  const dates = new Set<string>();
  for (const h of getHTFList()) dates.add(h.date);
  for (const l of getLTFList()) dates.add(l.date);
  for (const s of getScalpList()) dates.add(s.date);
  for (const t of getTradeLogList()) dates.add(t.date);
  for (const n of getNewsList()) dates.add(n.date);
  return [...dates].map((date) => ({ date }));
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h2>
  );
}

export default async function DayPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;

  const htf = getHTFList().find((h) => h.date === date);
  const ltf = getLTFList()
    .filter((l) => l.date === date)
    .sort((a, b) => a.slug.localeCompare(b.slug));
  const scalp = getScalpList()
    .filter((s) => s.date === date)
    .sort((a, b) => a.slug.localeCompare(b.slug));
  const trade = getTradeLogList().find((t) => t.date === date);
  const news = getNewsList().filter((n) => n.date === date);

  if (!htf && ltf.length === 0 && scalp.length === 0 && !trade && news.length === 0) notFound();

  const pnlPos = trade?.netPnl?.includes("+");
  const pnlNeg = trade?.netPnl?.includes("-") || trade?.netPnl?.includes("−");

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight">{formatDate(date)}</h1>
        <Link href="/" className="text-xs text-primary underline underline-offset-2">
          ← Calendar
        </Link>
      </header>

      {htf && (
        <section className="space-y-3">
          <SectionTitle>HTF Bias</SectionTitle>
          <Link href={`/htf/${date}`}>
            <Card className="transition-colors hover:border-primary/50">
              <CardContent className="flex items-center justify-between gap-4 py-4">
                <div>
                  <div className="font-semibold">{htf.biasLabel ?? "—"}</div>
                  {htf.updated && (
                    <div className="text-sm text-muted-foreground">Updated {htf.updated}</div>
                  )}
                </div>
                <span className="text-xs text-primary">Open →</span>
              </CardContent>
            </Card>
          </Link>
        </section>
      )}

      {trade && (
        <section className="space-y-3">
          <SectionTitle>Trade Log</SectionTitle>
          <Link href={`/trade-log/${date}`}>
            <Card className="transition-colors hover:border-primary/50">
              <CardContent className="flex items-center justify-between gap-4 py-4">
                <div className="text-sm text-muted-foreground">
                  {trade.trades ? `${trade.trades} trade(s)` : "—"}
                  {trade.wins != null ? ` · ${trade.wins}W / ${trade.losses}L` : ""}
                </div>
                {trade.netPnl && (
                  <span
                    className={cn(
                      "font-mono text-sm font-semibold",
                      pnlPos && "text-green-500",
                      pnlNeg && "text-red-500",
                    )}
                  >
                    {trade.netPnl}
                  </span>
                )}
              </CardContent>
            </Card>
          </Link>
        </section>
      )}

      {ltf.length > 0 && (
        <section className="space-y-3">
          <SectionTitle>LTF Analyses ({ltf.length})</SectionTitle>
          <div className="grid gap-3">
            {ltf.map((e) => (
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
      )}

      {scalp.length > 0 && (
        <section className="space-y-3">
          <SectionTitle>Scalp Analyses ({scalp.length})</SectionTitle>
          <div className="grid gap-3">
            {scalp.map((e) => (
              <Link key={e.slug} href={`/scalp/${e.date}/${e.slug}`}>
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
      )}

      {news.length > 0 && (
        <section className="space-y-3">
          <SectionTitle>News</SectionTitle>
          <div className="grid gap-3">
            {news.map((n) => (
              <Link key={n.slug.join("/")} href={`/news/${n.slug.join("/")}`}>
                <Card className="transition-colors hover:border-primary/50">
                  <CardContent className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <div className="text-sm font-medium">{n.event ?? n.slug.join("/")}</div>
                      {n.time && <div className="text-xs text-muted-foreground">{n.time}</div>}
                    </div>
                    {n.impact && (
                      <span
                        className={cn(
                          "rounded-md border px-2 py-0.5 text-xs font-bold",
                          n.impact.toUpperCase() === "HIGH"
                            ? "border-red-500/30 bg-red-500/15 text-red-500"
                            : n.impact.toUpperCase() === "MEDIUM"
                              ? "border-amber-500/30 bg-amber-500/15 text-amber-500"
                              : "border-border bg-muted text-muted-foreground",
                        )}
                      >
                        {n.impact}
                      </span>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
