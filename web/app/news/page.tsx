import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getNewsList } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";

function impactColor(impact?: string) {
  const i = impact?.toUpperCase();
  if (i === "HIGH") return "bg-red-500/15 text-red-500 border-red-500/30";
  if (i === "MEDIUM") return "bg-amber-500/15 text-amber-500 border-amber-500/30";
  return "bg-muted text-muted-foreground border-border";
}

export default function NewsListPage() {
  const items = getNewsList();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">News Analysis</h1>
      <div className="grid gap-3">
        {items.map((n) => (
          <Link key={n.slug.join("/")} href={`/news/${n.slug.join("/")}`}>
            <Card className="transition-colors hover:border-primary/50">
              <CardContent className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <div className="truncate font-semibold">{n.event ?? n.slug.at(-1)}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(n.date)}
                    {n.implication ? ` · ${n.implication}` : ""}
                  </div>
                </div>
                {n.impact && (
                  <span
                    className={cn(
                      "shrink-0 rounded-md border px-2 py-0.5 text-xs font-bold",
                      impactColor(n.impact),
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
    </div>
  );
}
