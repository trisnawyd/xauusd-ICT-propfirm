"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  LineSeries,
  LineStyle,
  type IChartApi,
  type ISeriesApi,
  type IPriceLine,
  type UTCTimestamp,
} from "lightweight-charts";
import { fetchGoldQuote } from "@/lib/price-feed";
import type { OhlcSnapshot, WatchLevel } from "@/lib/types";

const POLL_MS = 10_000;
// 1 pip = $0.10 on XAU/USD. A level counts "touched" once observed price has
// reached within this tolerance (in price, ~2 pips) or crossed it.
const TOUCH_TOLERANCE = 0.2;

function pipsBetween(a: number, b: number): number {
  return Math.round(Math.abs(a - b) * 10);
}

// Mechanical, pure-time killzone read (no structure inference).
function killzone(d = new Date()): string {
  const h = d.getUTCHours();
  if (h >= 7 && h < 10) return "London KZ";
  if (h >= 12 && h < 15) return "NY KZ";
  if (h >= 8 && h < 17) return "London";
  if (h >= 13 && h < 21) return "New York";
  return "Asian";
}

function colorFor(kind: WatchLevel["kind"]): string {
  if (kind === "sl") return "#ef4444"; // red
  if (kind === "tp") return "#22c55e"; // green
  return "#f59e0b"; // entry — amber
}

export default function WatchBoard({
  levels,
  ohlc,
}: {
  levels: WatchLevel[];
  ohlc?: OhlcSnapshot | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | ISeriesApi<"Line"> | null>(null);
  const livePriceLineRef = useRef<IPriceLine | null>(null);
  const lastTimeRef = useRef<number>(0);
  const brokerPriceRef = useRef<number | null>(null);

  // Spot → broker offset, so the live (spot) marker aligns with broker candles + levels.
  const offset = ohlc ? ohlc.brokerRef - ohlc.spotRef : 0;

  const [brokerPrice, setBrokerPrice] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [range, setRange] = useState<{ low: number; high: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zone, setZone] = useState<string>(() => killzone());

  // Build + tear down the chart once.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const dark = document.documentElement.classList.contains("dark");
    const chart = createChart(el, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "rgba(0,0,0,0)" },
        textColor: dark ? "#a1a1aa" : "#52525b",
        attributionLogo: true,
      },
      grid: {
        vertLines: { color: dark ? "#27272a" : "#f4f4f5" },
        horzLines: { color: dark ? "#27272a" : "#f4f4f5" },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, timeVisible: true, secondsVisible: false },
    });

    // Pin the y-axis to span every level (+ candles + live), so levels are
    // always visible on first render instead of the scale collapsing.
    const levelPrices = levels.map((l) => l.price);
    const barLo = ohlc ? Math.min(...ohlc.bars.map((b) => b.low)) : Infinity;
    const barHi = ohlc ? Math.max(...ohlc.bars.map((b) => b.high)) : -Infinity;
    const autoscaleInfoProvider = () => {
      const prices = [...levelPrices];
      if (Number.isFinite(barLo)) prices.push(barLo, barHi);
      if (brokerPriceRef.current != null) prices.push(brokerPriceRef.current);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const pad = (max - min) * 0.08 || 1;
      return { priceRange: { minValue: min - pad, maxValue: max + pad } };
    };

    let series: ISeriesApi<"Candlestick"> | ISeriesApi<"Line">;
    if (ohlc) {
      const cs = chart.addSeries(CandlestickSeries, {
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderVisible: false,
        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444",
        priceLineVisible: false,
        autoscaleInfoProvider,
      });
      cs.setData(ohlc.bars.map((b) => ({ ...b, time: b.time as UTCTimestamp })));
      lastTimeRef.current = ohlc.bars[ohlc.bars.length - 1].time;
      chart.timeScale().fitContent();
      series = cs;
    } else {
      // No snapshot: fall back to a live line that grows from polls.
      series = chart.addSeries(LineSeries, {
        color: dark ? "#fafafa" : "#18181b",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
        autoscaleInfoProvider,
      });
    }

    // Static horizontal lines for every key level (broker price). Short titles —
    // price already shows on the axis label — so right-edge labels don't overlap.
    for (const lv of levels) {
      const tag = lv.scenario === "primary" ? "" : `${lv.scenario} `;
      series.createPriceLine({
        price: lv.price,
        color: colorFor(lv.kind),
        lineWidth: 1,
        lineStyle: lv.kind === "entry" ? LineStyle.Solid : LineStyle.Dashed,
        axisLabelVisible: true,
        title: `${tag}${lv.kind.toUpperCase()}`,
      });
    }

    chartRef.current = chart;
    seriesRef.current = series;
    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      livePriceLineRef.current = null;
    };
  }, [levels, ohlc]);

  // Poll live spot — only while the tab is visible (cuts request volume).
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = async () => {
      if (cancelled) return;
      if (document.visibilityState !== "visible") {
        timer = setTimeout(tick, POLL_MS);
        return;
      }
      try {
        const q = await fetchGoldQuote();
        if (cancelled) return;
        const broker = q.price + offset; // map spot → broker scale
        brokerPriceRef.current = broker;
        setBrokerPrice(broker);
        setUpdatedAt(q.updatedAt);
        setZone(killzone());
        setError(null);
        setRange((r) =>
          r ? { low: Math.min(r.low, broker), high: Math.max(r.high, broker) } : { low: broker, high: broker },
        );

        const series = seriesRef.current;
        if (series) {
          // Live horizontal marker (works for both candles and line).
          if (livePriceLineRef.current) {
            livePriceLineRef.current.applyOptions({ price: broker });
          } else {
            livePriceLineRef.current = series.createPriceLine({
              price: broker,
              color: "#3b82f6",
              lineWidth: 2,
              lineStyle: LineStyle.Solid,
              axisLabelVisible: true,
              title: "LIVE",
            });
          }
          // No snapshot → also grow the line series from polls.
          if (!ohlc) {
            let t = Math.floor(Date.now() / 1000);
            if (t <= lastTimeRef.current) t = lastTimeRef.current + 1;
            lastTimeRef.current = t;
            (series as ISeriesApi<"Line">).update({ time: t as UTCTimestamp, value: broker });
          }
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "fetch failed");
      }
      timer = setTimeout(tick, POLL_MS);
    };

    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [offset, ohlc]);

  const isTouched = (lv: WatchLevel): boolean =>
    range !== null && range.low - TOUCH_TOLERANCE <= lv.price && lv.price <= range.high + TOUCH_TOLERANCE;

  const groups = useMemo(() => {
    const m = new Map<string, WatchLevel[]>();
    for (const lv of levels) {
      const key = lv.scenario === "primary" ? "Trade" : `Watch ${lv.scenario}`;
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(lv);
    }
    return [...m.entries()];
  }, [levels]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-mono text-2xl">{brokerPrice !== null ? brokerPrice.toFixed(2) : "—"}</span>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {ohlc ? `${ohlc.timeframe} · ${zone}` : `spot XAU/USD · ${zone}`}
        </span>
        {error ? (
          <span className="text-xs text-red-500">feed error: {error}</span>
        ) : updatedAt ? (
          <span className="text-xs text-muted-foreground">
            live {new Date(updatedAt).toLocaleTimeString()}
            {ohlc ? ` · candles frozen ${new Date(ohlc.generatedAt).toLocaleString()}` : ""}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">connecting…</span>
        )}
      </div>

      <div ref={containerRef} className="h-[360px] w-full" />

      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map(([name, lvs]) => (
          <div key={name} className="rounded-lg border p-3">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {name} {lvs[0]?.direction !== "UNKNOWN" ? `· ${lvs[0]?.direction}` : ""}
            </div>
            <ul className="space-y-1.5">
              {lvs.map((lv, i) => {
                const touched = isTouched(lv);
                return (
                  <li key={i} className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-2">
                      <span className={touched ? "text-green-500" : "text-muted-foreground"}>
                        {touched ? "✓" : "○"}
                      </span>
                      <span style={{ color: colorFor(lv.kind) }}>●</span>
                      <span>{lv.label.replace(/^Watch [AB] · /, "")}</span>
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {lv.price.toFixed(2)}
                      {brokerPrice !== null && !touched ? (
                        <span className="ml-2 text-xs">{pipsBetween(brokerPrice, lv.price)}p</span>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
