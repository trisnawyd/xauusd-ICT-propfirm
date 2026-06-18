import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { getTradeLog, getTradeLogList } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getTradeLogList().map((t) => ({ date: t.date }));
}

export default async function TradeLogDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const doc = getTradeLog(date);
  if (!doc) notFound();

  return (
    <article className="space-y-4">
      <p className="text-sm text-muted-foreground">Trade Log · {formatDate(date)}</p>
      <Markdown>{doc.body}</Markdown>
    </article>
  );
}
