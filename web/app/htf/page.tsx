import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Markdown } from "@/components/markdown";
import { getHTF, getHTFList } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const dynamic = "force-static";

export default function HTFListPage() {
  const items = getHTFList();
  const latest = items[0];
  const latestDoc = latest ? getHTF(latest.date) : null;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">HTF Bias Snapshots</h1>

      {latest && latestDoc && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Latest Snapshot
            </h2>
            <Link
              href={`/htf/${latest.date}`}
              className="text-xs text-primary underline underline-offset-2"
            >
              Open full →
            </Link>
          </div>
          <Card className="border-primary/40">
            <CardContent className="space-y-4 py-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold">{formatDate(latest.date)}</span>
                {latest.biasLabel && (
                  <span className="text-sm text-muted-foreground">{latest.biasLabel}</span>
                )}
                {latest.updated && (
                  <span className="text-xs text-muted-foreground">{latest.updated}</span>
                )}
              </div>
              <Markdown>{latestDoc.body}</Markdown>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          All Snapshots
        </h2>
        <div className="grid gap-3">
          {items.map((item) => (
            <Link key={item.date} href={`/htf/${item.date}`}>
              <Card className="transition-colors hover:border-primary/50">
                <CardContent className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <div className="font-semibold">{formatDate(item.date)}</div>
                    <div className="text-sm text-muted-foreground">{item.biasLabel ?? "—"}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.updated ?? ""}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
