import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getTradeLogList } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";

export default function TradeLogListPage() {
  const items = getTradeLogList();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Trade Log</h1>
      <div className="grid gap-3">
        {items.map((t) => {
          const positive = t.netPnl?.includes("+");
          const negative = t.netPnl?.includes("-");
          return (
            <Link key={t.date} href={`/trade-log/${t.date}`}>
              <Card className="transition-colors hover:border-primary/50">
                <CardContent className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <div className="font-semibold">{formatDate(t.date)}</div>
                    <div className="text-sm text-muted-foreground">
                      {t.trades ? `${t.trades} trade(s)` : ""}
                      {t.wins != null ? ` · ${t.wins}W / ${t.losses}L` : ""}
                    </div>
                  </div>
                  {t.netPnl && (
                    <span
                      className={cn(
                        "font-mono text-sm font-semibold",
                        positive && "text-green-500",
                        negative && "text-red-500",
                      )}
                    >
                      {t.netPnl}
                    </span>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
