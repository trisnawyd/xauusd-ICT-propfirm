import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Markdown } from "@/components/markdown";
import { DirectionBadge, GradeBadge } from "@/components/direction-badge";
import WatchBoardClient from "@/components/watch-board-client";
import { getScalp, getScalpList } from "@/lib/content";
import { formatDate } from "@/lib/format";
import type { Direction } from "@/lib/types";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getScalpList().map((i) => ({ date: i.date, slug: i.slug }));
}

function Stat({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-mono text-base">{value}</div>
    </div>
  );
}

export default async function ScalpDetailPage({
  params,
}: {
  params: Promise<{ date: string; slug: string }>;
}) {
  const { date, slug } = await params;
  const doc = getScalp(date, slug);
  if (!doc) notFound();
  const e = doc.entry;
  const isTrade = e.direction === "LONG" || e.direction === "SHORT";

  return (
    <article className="space-y-5">
      <header className="flex flex-wrap items-center gap-3">
        <DirectionBadge direction={e.direction as Direction} />
        <GradeBadge grade={e.grade} />
        <span className="text-sm text-muted-foreground">
          {formatDate(date)} · {e.time} · {e.session}
        </span>
      </header>

      {isTrade && (
        <Card>
          <CardContent className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-5">
            <Stat label="Entry" value={e.entry} />
            <Stat label="Stop Loss" value={e.sl} />
            <Stat label="TP1" value={e.tp} />
            <Stat label="TP2" value={e.tp2} />
            <Stat label="R:R" value={e.rr ? `${e.rr}:1` : undefined} />
          </CardContent>
        </Card>
      )}

      {!isTrade && e.gateFailed && (
        <Card>
          <CardContent className="py-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Gate failed</div>
            <div className="mt-1 text-sm">{e.gateFailed}</div>
          </CardContent>
        </Card>
      )}

      {e.levels && e.levels.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
              Live Watch — spot price vs. this analysis&apos;s key levels
            </div>
            <WatchBoardClient levels={e.levels} ohlc={doc.ohlc} />
          </CardContent>
        </Card>
      )}

      <Markdown>{doc.body}</Markdown>
    </article>
  );
}
