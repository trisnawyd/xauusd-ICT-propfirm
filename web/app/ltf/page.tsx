import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DirectionBadge, GradeBadge } from "@/components/direction-badge";
import { getLTFList } from "@/lib/content";
import { formatDate, timeFromSlug } from "@/lib/format";
import type { Direction, LTFEntry } from "@/lib/types";

export const dynamic = "force-static";

export default function LTFListPage() {
  const items = getLTFList();
  const byDate = new Map<string, LTFEntry[]>();
  for (const item of items) {
    if (!byDate.has(item.date)) byDate.set(item.date, []);
    byDate.get(item.date)!.push(item);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">LTF Analysis</h1>
      {[...byDate.entries()].map(([date, entries]) => (
        <section key={date} className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">{formatDate(date)}</h2>
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
    </div>
  );
}
