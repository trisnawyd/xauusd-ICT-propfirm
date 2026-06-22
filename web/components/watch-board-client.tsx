"use client";

// Client wrapper: `ssr: false` dynamic imports are only allowed inside Client
// Components in this Next version, so the server LTF page imports THIS, which
// lazily loads the chart (lightweight-charts is browser-only) on the client.
import dynamic from "next/dynamic";
import type { OhlcSnapshot, WatchLevel } from "@/lib/types";

const WatchBoard = dynamic(() => import("./watch-board"), {
  ssr: false,
  loading: () => <div className="h-[360px] w-full animate-pulse rounded-lg bg-muted" />,
});

export default function WatchBoardClient({
  levels,
  ohlc,
}: {
  levels: WatchLevel[];
  ohlc?: OhlcSnapshot | null;
}) {
  return <WatchBoard levels={levels} ohlc={ohlc} />;
}
