import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getHTFList } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const dynamic = "force-static";

export default function HTFListPage() {
  const items = getHTFList();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">HTF Bias Snapshots</h1>
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
    </div>
  );
}
