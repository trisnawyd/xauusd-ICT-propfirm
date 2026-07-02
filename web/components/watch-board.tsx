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
  type AutoscaleInfo,
} from "lightweight-charts";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fetchGoldQuote,
  fetchTwelveCandles,
  fetchMt5Candles,
  fetchMt5Tick,
  TWELVEDATA_KEY,
  MT5_BRIDGE_URL,
} from "@/lib/price-feed";
import type { OhlcSnapshot, WatchLevel } from "@/lib/types";

// Twelve Data free tier = 8 req/min, ~800/day. 30s poll (2/min) while visible
// stays well under per-minute and survives a multi-hour session on the daily cap.
const TD_POLL_MS = 30_000;
const SPOT_POLL_MS = 10_000;
// MT5 bridge is local + rate-limit-free, so it can poll fast — but only when
// Twelve Data is NOT also configured (a TD fallback during MT5 downtime must
// stay under the 8/min cap, so MT5+TD shares the slower TD cadence).
const MT5_POLL_MS = 5_000;
// 1 pip = $0.10. A level counts "touched" once observed price reaches within
// this tolerance (~2 pips) or crosses it.
const TOUCH_TOLERANCE = 0.2;
const HAS_TD = !!TWELVEDATA_KEY;
const HAS_MT5 = !!MT5_BRIDGE_URL;
// fitContent() squeezes every fetched bar into the container width — with the
// full 120-bar fetch that renders candles a couple px wide. Default-zoom to the
// most recent window instead so each candle is readable; users can still scroll
// out to see the rest.
const DEFAULT_VISIBLE_BARS = 60;
// Must match timeScale.rightOffset below — setVisibleLogicalRange's `to` is an
// explicit logical index, so it overrides rightOffset unless the offset is
// folded in here too (otherwise every setData call snaps the right edge back
// to the last bar with zero whitespace).
const RIGHT_OFFSET_BARS = 12;

function zoomToDefault(chart: IChartApi, totalBars: number) {
  if (totalBars <= DEFAULT_VISIBLE_BARS) {
    chart.timeScale().fitContent();
    return;
  }
  chart.timeScale().setVisibleLogicalRange({
    from: totalBars - DEFAULT_VISIBLE_BARS,
    to: totalBars + RIGHT_OFFSET_BARS,
  });
}

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | ISeriesApi<"Line"> | null>(null);
  const livePriceLineRef = useRef<IPriceLine | null>(null);
  const lastTimeRef = useRef<number>(0);
  const brokerPriceRef = useRef<number | null>(null);
  const barsRangeRef = useRef<{ lo: number; hi: number } | null>(null);
  const fittedRef = useRef(false);

  const timeframe = ohlc?.timeframe ?? "M5";
  // Spot → broker offset for Twelve Data / gold-api (spot feeds). MT5 candles are
  // already broker prices, so they are applied with a zero offset (see tick()).
  const offset = ohlc ? ohlc.brokerRef - ohlc.spotRef : 0;
  // Candles when MT5 or Twelve Data is configured, or a snapshot is committed.
  const useCandles = HAS_MT5 || HAS_TD || !!ohlc;

  const [brokerPrice, setBrokerPrice] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [range, setRange] = useState<{ low: number; high: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zone, setZone] = useState<string>(() => killzone());
  // Active feed label — switches at runtime as MT5 degrades to TD / gold-api.
  const [source, setSource] = useState<string>(HAS_MT5 ? "MT5" : HAS_TD ? "Twelve Data" : "gold-api");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // In-page "maximize" overlay (fixed inset-0), not the native Fullscreen API —
  // that requires an `allow="fullscreen"` permission when embedded in an iframe
  // and adds OS-level chrome we don't want for a chart panel.
  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen]);

  const toggleFullscreen = () => setIsFullscreen((v) => !v);

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
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
        rightOffset: RIGHT_OFFSET_BARS,
      },
    });

    // Base the y-axis on whatever bars are actually ON SCREEN (baseImplementation
    // reflects the current visible range/zoom), then extend it just enough to
    // keep every level + the live marker visible — instead of always spanning the
    // full fetched dataset, which flattens candles once you zoom/scroll in.
    const levelPrices = levels.map((l) => l.price);
    const autoscaleInfoProvider = (baseImplementation: () => AutoscaleInfo | null) => {
      const base = baseImplementation();
      const prices = [...levelPrices];
      if (base?.priceRange) {
        prices.push(base.priceRange.minValue, base.priceRange.maxValue);
      } else if (barsRangeRef.current) {
        prices.push(barsRangeRef.current.lo, barsRangeRef.current.hi);
      }
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
        zoomToDefault(chart, ohlc.bars.length);
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
    // MT5 polls fast when it's the sole feed; when TD is also configured we hold
    // the slower TD cadence so a fallback during MT5 downtime stays under 8/min.
    const pollMs = HAS_MT5 ? (HAS_TD ? TD_POLL_MS : MT5_POLL_MS) : HAS_TD ? TD_POLL_MS : SPOT_POLL_MS;

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

    const onLive = (broker: number, ts: string, src: string) => {
      brokerPriceRef.current = broker;
      setBrokerPrice(broker);
      setUpdatedAt(ts);
      setZone(killzone());
      setSource(src);
      setError(null);
      setRange((r) =>
        r ? { low: Math.min(r.low, broker), high: Math.max(r.high, broker) } : { low: broker, high: broker },
      );
      updateMarker(broker);
    };

    // Paint candles onto the candlestick series, shifted by `off` onto the broker
    // scale (off=0 for MT5 broker candles, spot→broker offset for Twelve Data).
    const applyCandles = (candles: { time: number; open: number; high: number; low: number; close: number }[], off: number) => {
      const series = seriesRef.current as ISeriesApi<"Candlestick"> | null;
      if (!series) return;
      series.setData(
        candles.map((c) => ({
          time: c.time as UTCTimestamp,
          open: c.open + off,
          high: c.high + off,
          low: c.low + off,
          close: c.close + off,
        })),
      );
      barsRangeRef.current = {
        lo: Math.min(...candles.map((c) => c.low)) + off,
        hi: Math.max(...candles.map((c) => c.high)) + off,
      };
      if (!fittedRef.current && chartRef.current) {
        zoomToDefault(chartRef.current, candles.length);
        fittedRef.current = true;
      }
    };

    const tick = async () => {
      if (cancelled) return;
      if (document.visibilityState !== "visible") {
        timer = setTimeout(tick, pollMs);
        return;
      }
      try {
        let served = false;

        // 1) MT5 dev bridge — real broker candles + tick, already on broker scale.
        if (HAS_MT5) {
          try {
            const candles = await fetchMt5Candles(timeframe);
            if (cancelled) return;
            if (candles.length > 0) {
              applyCandles(candles, 0);
              let mark = candles[candles.length - 1].close;
              try {
                const t = await fetchMt5Tick();
                if (Number.isFinite(t.bid) && Number.isFinite(t.ask)) mark = (t.bid + t.ask) / 2;
              } catch {
                /* tick unavailable — keep last close as the live marker */
              }
              if (cancelled) return;
              onLive(mark, new Date().toISOString(), "live · MT5");
              served = true;
            }
          } catch {
            /* MT5 momentarily down — fall through to Twelve Data / gold-api */
          }
        }

        // 2) Twelve Data spot candles (primary when no MT5, else MT5-down fallback).
        if (!served && HAS_TD) {
          const candles = await fetchTwelveCandles(timeframe);
          if (cancelled) return;
          if (candles.length > 0) {
            applyCandles(candles, offset);
            const last = candles[candles.length - 1].close + offset;
            onLive(last, new Date().toISOString(), HAS_MT5 ? "Twelve Data · MT5 down" : "live · Twelve Data");
            served = true;
          }
        }

        // 3) gold-api spot marker (over committed candles, or growing the line).
        if (!served) {
          const q = await fetchGoldQuote();
          if (cancelled) return;
          const broker = q.price + offset;
          onLive(broker, q.updatedAt, HAS_MT5 || HAS_TD ? "gold-api · feed down" : "gold-api");
          if (!useCandles) {
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
  }, [offset, ohlc, timeframe, useCandles]);

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

  // `source` is set at runtime by the active feed (MT5 / Twelve Data / gold-api).
  const sourceLabel = useCandles ? `${timeframe} · ${source}` : `spot XAU/USD · ${source}`;

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "space-y-4",
        isFullscreen && "fixed inset-0 z-50 flex flex-col overflow-auto bg-background p-4",
      )}
    >
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
        <Button
          variant="outline"
          size="icon-sm"
          className="ml-auto"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen chart"}
          aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen chart"}
        >
          {isFullscreen ? <Minimize2 /> : <Maximize2 />}
        </Button>
      </div>

      <div ref={containerRef} className={cn("w-full", isFullscreen ? "min-h-0 flex-1" : "h-[360px]")} />

      <div className={cn("grid gap-4 sm:grid-cols-2", isFullscreen && "shrink-0")}>
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
