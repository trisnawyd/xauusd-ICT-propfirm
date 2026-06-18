import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { getNews, getNewsList } from "@/lib/content";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getNewsList().map((n) => ({ slug: n.slug }));
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const doc = getNews(slug);
  if (!doc) notFound();

  return (
    <article className="space-y-4">
      <p className="text-sm text-muted-foreground">News · {doc.entry.event ?? slug.join(" / ")}</p>
      <Markdown>{doc.body}</Markdown>
    </article>
  );
}
