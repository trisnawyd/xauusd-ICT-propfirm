import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BiasGauge } from "@/components/bias-gauge";
import { Markdown } from "@/components/markdown";
import { DirectionBadge } from "@/components/direction-badge";
import { parseBias } from "@/lib/parse-bias";
import { getContextDoc, getHtfContextRaw, getLTFList } from "@/lib/content";
import type { Direction } from "@/lib/types";

export const dynamic = "force-static";

/** Slice the markdown body from a heading match up to the next stop marker. */
function section(body: string, startRe: RegExp, stopRe: RegExp): string | null {
  const lines = body.split("\n");
  const start = lines.findIndex((l) => startRe.test(l));
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (stopRe.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join("\n").trim();
}

export default function DashboardPage() {
  const htfRaw = getHtfContextRaw();
  const bias = parseBias(htfRaw);
  const account = getContextDoc("account");
  const ltfMemory = getContextDoc("ltf-memory");
  const latestLtf = getLTFList()[0];

  const currentStructure = ltfMemory
    ? section(ltfMemory.body, /^##\s+Current Market Structure/i, /^##\s+Analysis\s+#/i)
    : null;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Desk Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            HTF bias as of {bias.updated ?? "—"}
          </p>
        </div>
        {latestLtf && (
          <Link
            href={`/ltf/${latestLtf.date}/${latestLtf.slug}`}
            className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
          >
            <span className="text-muted-foreground">Latest read</span>
            <DirectionBadge direction={latestLtf.direction as Direction} />
          </Link>
        )}
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>HTF Bias</CardTitle>
          </CardHeader>
          <CardContent>
            <BiasGauge bias={bias} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            {account ? (
              <Markdown>{account.body.split("\n## ")[0]}</Markdown>
            ) : (
              <p className="text-sm text-muted-foreground">No account context found.</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Financial figures are redacted on the public site.
            </p>
          </CardContent>
        </Card>
      </div>

      {currentStructure && (
        <Card>
          <CardHeader>
            <CardTitle>Current Market Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <Markdown>{currentStructure}</Markdown>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
