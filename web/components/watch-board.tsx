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
import { fetchGoldQuote, fetchTwelveCandles, TWELVEDATA_KEY } from "@/lib/price-feed";
import type { OhlcSnapshot, WatchLevel } from "@/lib/types";

// Twelve Data free tier = 8 req/min, ~800/day. 30s poll (2/min) while visible
// stays well under per-minute and survives a multi-hour session on the daily cap.
const TD_POLL_MS = 30_000;
const SPOT_POLL_MS = 10_000;
// 1 pip = $0.10. A level counts "touched" once observed price reaches within
// this tolerance (~2 pips) or crosses it.
const TOUCH_TOLERANCE = 0.2;
const HAS_TD = !!TWELVEDATA_KEY;

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
  const barsRangeRef = useRef<{ lo: number; hi: number } | null>(null);
  const fittedRef = useRef(false);

  const timeframe = ohlc?.timeframe ?? "M5";
  // Spot → broker offset, so live candles/marker align with broker levels.
  const offset = ohlc ? ohlc.brokerRef - ohlc.spotRef : 0;
  // Candles when Twelve Data is configured, or when a snapshot is committed.
  const useCandles = HAS_TD || !!ohlc;

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
    // always visible instead of the scale collapsing onto the live marker.
    const levelPrices = levels.map((l) => l.price);
    const autoscaleInfoProvider = () => {
      const prices = [...levelPrices];
      if (barsRangeRef.current) prices.push(barsRangeRef.current.lo, barsRangeRef.current.hi);
      if (brokerPriceRef.current != null) prices.push(brokerPriceRef.current);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const pad = (max - min) * 0.08 || 1;
      return { priceRange: { minValue: min - pad, maxValue: max + pad } };
    };

    let series: ISeriesApi<"Candlestick"> | ISeriesApi<"Line">;
    if (useCandles) {
      const cs = chart.addSeries(CandlestickSeries, {
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderVisible: false,
        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444",
        priceLineVisible: false,
        autoscaleInfoProvider,
      });
      // Seed with the committed snapshot if present (live candles replace it
      // on the first Twelve Data fetch).
      if (ohlc) {
        cs.setData(ohlc.bars.map((b) => ({ ...b, time: b.time as UTCTimestamp })));
        barsRangeRef.current = {
          lo: Math.min(...ohlc.bars.map((b) => b.low)),
          hi: Math.max(...ohlc.bars.map((b) => b.high)),
        };
        lastTimeRef.current = ohlc.bars[ohlc.bars.length - 1].time;
        chart.timeScale().fitContent();
        fittedRef.current = true;
      }
      series = cs;
    } else {
      // No candles available: live line that grows from spot polls.
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
      barsRangeRef.current = null;
      fittedRef.current = false;
    };
  }, [levels, ohlc, useCandles]);

  // Poll the live feed — only while the tab is visible (cuts request volume).
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const pollMs = HAS_TD ? TD_POLL_MS : SPOT_POLL_MS;

    // Update the live horizontal marker (broker scale) on the active series.
    const updateMarker = (broker: number) => {
      const series = seriesRef.current;
      if (!series) return;
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
    };

    const onLive = (broker: number, ts: string) => {
      brokerPriceRef.current = broker;
      setBrokerPrice(broker);
      setUpdatedAt(ts);
      setZone(killzone());
      setError(null);
      setRange((r) =>
        r ? { low: Math.min(r.low, broker), high: Math.max(r.high, broker) } : { low: broker, high: broker },
      );
      updateMarker(broker);
    };

    const tick = async () => {
      if (cancelled) return;
      if (document.visibilityState !== "visible") {
        timer = setTimeout(tick, pollMs);
        return;
      }
      try {
        if (HAS_TD) {
          const candles = await fetchTwelveCandles(timeframe);
          if (cancelled || candles.length === 0) {
            timer = setTimeout(tick, pollMs);
            return;
          }
          const series = seriesRef.current as ISeriesApi<"Candlestick"> | null;
          if (series) {
            // Shift spot candles → broker scale so they align with the levels.
            series.setData(
              candles.map((c) => ({
                time: c.time as UTCTimestamp,
                open: c.open + offset,
                high: c.high + offset,
                low: c.low + offset,
                close: c.close + offset,
              })),
            );
            barsRangeRef.current = {
              lo: Math.min(...candles.map((c) => c.low)) + offset,
              hi: Math.max(...candles.map((c) => c.high)) + offset,
            };
            if (!fittedRef.current) {
              chartRef.current?.timeScale().fitContent();
              fittedRef.current = true;
            }
          }
          const lastClose = candles[candles.length - 1].close + offset;
          onLive(lastClose, new Date().toISOString());
        } else {
          // No Twelve Data key: gold-api spot marker (over committed candles or line).
          const q = await fetchGoldQuote();
          if (cancelled) return;
          const broker = q.price + offset;
          onLive(broker, q.updatedAt);
          if (!ohlc) {
            let t = Math.floor(Date.now() / 1000);
            if (t <= lastTimeRef.current) t = lastTimeRef.current + 1;
            lastTimeRef.current = t;
            (seriesRef.current as ISeriesApi<"Line">)?.update({ time: t as UTCTimestamp, value: broker });
          }
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "fetch failed");
      }
      timer = setTimeout(tick, pollMs);
    };

    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [offset, ohlc, timeframe]);

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

  const sourceLabel = HAS_TD
    ? `${timeframe} · live · Twelve Data`
    : useCandles
      ? `${timeframe} · spot marker · gold-api`
      : `spot XAU/USD · gold-api`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-mono text-2xl">{brokerPrice !== null ? brokerPrice.toFixed(2) : "—"}</span>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{sourceLabel} · {zone}</span>
        {error ? (
          <span className="text-xs text-red-500">feed error: {error}</span>
        ) : updatedAt ? (
          <span className="text-xs text-muted-foreground">updated {new Date(updatedAt).toLocaleTimeString()}</span>
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
