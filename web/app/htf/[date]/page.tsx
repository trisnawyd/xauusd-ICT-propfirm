import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { getHTF, getHTFList } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getHTFList().map((i) => ({ date: i.date }));
}

export default async function HTFDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const doc = getHTF(date);
  if (!doc) notFound();

  return (
    <article className="space-y-4">
      <p className="text-sm text-muted-foreground">HTF · {formatDate(date)}</p>
      <Markdown>{doc.body}</Markdown>
    </article>
  );
}
