import Link from "next/link";
import { Activity, Newspaper, ScrollText, TrendingUp, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DirectionBadge, GradeBadge } from "@/components/direction-badge";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CalendarHighlights as Highlights } from "@/lib/calendar";

function biasColor(label?: string): string {
  if (!label) return "text-muted-foreground";
  const u = label.toUpperCase();
  if (u.includes("BULL")) return "text-green-500";
  if (u.includes("BEAR")) return "text-red-500";
  if (u.includes("RANG") || u.includes("NEUTRAL")) return "text-amber-500";
  return "text-muted-foreground";
}

/** Border + bg + text tint for a small bias pill, matching the impact badge. */
function biasBadgeClass(label: string): string {
  const u = label.toUpperCase();
  if (u.includes("BULL")) return "border-green-500/30 bg-green-500/15 text-green-500";
  if (u.includes("BEAR")) return "border-red-500/30 bg-red-500/15 text-red-500";
  if (u.includes("RANG") || u.includes("NEUTRAL"))
    return "border-amber-500/30 bg-amber-500/15 text-amber-500";
  return "border-border bg-muted text-muted-foreground";
}

function Shell({
  href,
  icon: Icon,
  category,
  children,
}: {
  href: string;
  icon: LucideIcon;
  category: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-colors group-hover:border-primary/50">
        <CardContent className="flex h-full flex-col gap-2 py-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Icon className="size-3.5" />
            {category}
          </div>
          {children}
        </CardContent>
      </Card>
    </Link>
  );
}

export function CalendarHighlights({ data }: { data: Highlights }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {data.htf && (
        <Shell href={`/htf/${data.htf.date}`} icon={TrendingUp} category="Latest HTF Bias">
          <div className={cn("text-base font-semibold leading-snug", biasColor(data.htf.bias))}>
            {data.htf.bias ?? "—"}
          </div>
          <div className="mt-auto text-xs text-muted-foreground">{formatDate(data.htf.date)}</div>
        </Shell>
      )}

      {data.ltf && (
        <Shell
          href={`/ltf/${data.ltf.date}/${data.ltf.slug}`}
          icon={Activity}
          category="Latest LTF Read"
        >
          <div className="flex items-center gap-2">
            <DirectionBadge direction={data.ltf.direction} />
            <GradeBadge grade={data.ltf.grade} />
          </div>
          <div className="mt-auto text-xs text-muted-foreground">
            {formatDate(data.ltf.date)} · {data.ltf.time} · {data.ltf.session}
          </div>
        </Shell>
      )}

      {data.trade && (
        <Shell href={`/trade-log/${data.trade.date}`} icon={ScrollText} category="Last Trade Day">
          <div
            className={cn(
              "font-mono text-base font-semibold",
              data.trade.pnlSign === "pos"
                ? "text-green-500"
                : data.trade.pnlSign === "neg"
                  ? "text-red-500"
                  : "text-foreground",
            )}
          >
            {data.trade.netPnl ?? "—"}
          </div>
          <div className="mt-auto text-xs text-muted-foreground">
            {formatDate(data.trade.date)}
            {data.trade.wins != null ? ` · ${data.trade.wins}W / ${data.trade.losses}L` : ""}
          </div>
        </Shell>
      )}

      {data.news && (
        <Shell href={`/news/${data.news.slug.join("/")}`} icon={Newspaper} category="Latest News">
          <div className="flex items-start justify-between gap-2">
            <div className="line-clamp-2 text-sm font-semibold leading-snug">
              {data.news.event ?? data.news.slug.join("/")}
            </div>
            {data.news.impact && (
              <span
                className={cn(
                  "shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-bold",
                  data.news.impact.toUpperCase() === "HIGH"
                    ? "border-red-500/30 bg-red-500/15 text-red-500"
                    : data.news.impact.toUpperCase() === "MEDIUM"
                      ? "border-amber-500/30 bg-amber-500/15 text-amber-500"
                      : "border-border bg-muted text-muted-foreground",
                )}
              >
                {data.news.impact}
              </span>
            )}
          </div>
          <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
            {data.news.implication && (
              <span
                className={cn(
                  "shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-bold",
                  biasBadgeClass(data.news.implication),
                )}
              >
                {data.news.implication}
              </span>
            )}
            <span>{formatDate(data.news.date)}</span>
          </div>
        </Shell>
      )}
    </div>
  );
}
