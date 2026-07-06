import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

/** Map an Obsidian vault path to a site route, or null if no page exists. */
function resolveWikiTarget(target: string): string | null {
  const t = target.trim().replace(/\.md$/, "");
  let m;
  if ((m = t.match(/^Analysis\/HTF\/(.+)$/))) return `/htf/${m[1]}`;
  if ((m = t.match(/^Analysis\/LTF\/([^/]+)\/(.+)$/))) return `/ltf/${m[1]}/${m[2]}`;
  if ((m = t.match(/^Analysis\/Scalp\/([^/]+)\/(.+)$/))) return `/scalp/${m[1]}/${m[2]}`;
  if ((m = t.match(/^Analysis\/News\/(.+)$/))) return `/news/${m[1]}`;
  if ((m = t.match(/^Trade Log\/(.+)$/))) return `/trade-log/${m[1]}`;
  if (/^Context\//.test(t)) return "/";
  return null;
}

/** Convert [[target|label]] / [[target]] wikilinks into markdown links or plain text. */
function preprocessWikilinks(md: string): string {
  return md.replace(/\[\[([^\]]+)\]\]/g, (_full, inner: string) => {
    const [target, label] = inner.split("|");
    const text = (label ?? target.split("/").pop() ?? target).trim();
    const route = resolveWikiTarget(target);
    return route ? `[${text}](${route})` : text;
  });
}

export function Markdown({ children }: { children: string }) {
  const source = preprocessWikilinks(children);
  return (
    <div className="prose-trade max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p) => <h1 className="mt-6 mb-3 text-2xl font-bold tracking-tight" {...p} />,
          h2: (p) => <h2 className="mt-6 mb-2 border-b border-border pb-1 text-xl font-semibold" {...p} />,
          h3: (p) => <h3 className="mt-4 mb-2 text-lg font-semibold" {...p} />,
          p: (p) => <p className="my-2 leading-relaxed text-foreground/90" {...p} />,
          ul: (p) => <ul className="my-2 list-disc space-y-1 pl-5 text-foreground/90" {...p} />,
          ol: (p) => <ol className="my-2 list-decimal space-y-1 pl-5 text-foreground/90" {...p} />,
          li: (p) => <li className="leading-relaxed" {...p} />,
          strong: (p) => <strong className="font-semibold text-foreground" {...p} />,
          hr: () => <hr className="my-4 border-border" />,
          code: (p) => <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm" {...p} />,
          a: ({ href, children, ...rest }) => {
            const url = String(href ?? "");
            if (url.startsWith("/")) {
              return (
                <Link href={url} className="text-primary underline underline-offset-2">
                  {children}
                </Link>
              );
            }
            return (
              <a href={url} className="text-primary underline underline-offset-2" {...rest}>
                {children}
              </a>
            );
          },
          table: (p) => (
            <div className="my-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm" {...p} />
            </div>
          ),
          thead: (p) => <thead className="bg-muted/60" {...p} />,
          th: (p) => <th className="border border-border px-3 py-2 text-left font-semibold" {...p} />,
          td: (p) => <td className="border border-border px-3 py-2 font-mono" {...p} />,
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
