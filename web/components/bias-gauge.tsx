import type { BiasReading, TFBias } from "@/lib/types";
import { cn } from "@/lib/utils";

const RED = "#ef4444";
const AMBER = "#f59e0b";
const GREEN = "#22c55e";

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, start);
  const e = polar(cx, cy, r, end);
  const largeArc = Math.abs(end - start) > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

function tfColor(b: TFBias) {
  if (b === "BULLISH") return "text-green-500 border-green-500/40 bg-green-500/10";
  if (b === "BEARISH") return "text-red-500 border-red-500/40 bg-red-500/10";
  if (b === "RANGING") return "text-amber-500 border-amber-500/40 bg-amber-500/10";
  return "text-muted-foreground border-border bg-muted/40";
}

export function BiasGauge({ bias }: { bias: BiasReading }) {
  const cx = 120;
  const cy = 120;
  const r = 96;
  const value = Math.max(-1, Math.min(1, bias.value));
  const angle = 90 - value * 90; // -1 -> 180 (left/bearish), +1 -> 0 (right/bullish)
  const needle = polar(cx, cy, r - 20, angle);

  const sentiment =
    value <= -0.34 ? "BEARISH" : value >= 0.34 ? "BULLISH" : "NEUTRAL / RANGING";
  const sentimentColor =
    value <= -0.34 ? RED : value >= 0.34 ? GREEN : AMBER;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 240 150" className="w-full max-w-[320px]">
        {/* track segments */}
        <path d={arcPath(cx, cy, r, 180, 120)} stroke={RED} strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.85} />
        <path d={arcPath(cx, cy, r, 120, 60)} stroke={AMBER} strokeWidth={16} fill="none" opacity={0.85} />
        <path d={arcPath(cx, cy, r, 60, 0)} stroke={GREEN} strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.85} />
        {/* needle */}
        <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={7} fill="currentColor" />
        {/* labels */}
        <text x={20} y={140} fontSize={11} fill={RED}>BEARISH</text>
        <text x={188} y={140} fontSize={11} fill={GREEN}>BULLISH</text>
      </svg>

      <div className="mt-1 text-center">
        <div className="text-lg font-semibold" style={{ color: sentimentColor }}>
          {sentiment}
        </div>
        <div className="text-sm text-muted-foreground">{bias.label}</div>
      </div>

      <div className="mt-4 flex gap-2">
        {([["D1", bias.d1], ["H4", bias.h4], ["H1", bias.h1]] as const).map(([tf, b]) => (
          <div
            key={tf}
            className={cn("rounded-md border px-3 py-1.5 text-center text-xs font-medium", tfColor(b))}
          >
            <div className="font-bold">{tf}</div>
            <div>{b}</div>
          </div>
        ))}
      </div>

      {bias.currentPrice && (
        <div className="mt-3 text-sm text-muted-foreground">
          Price <span className="font-mono text-foreground">{bias.currentPrice}</span>
          {bias.premiumDiscount && (
            <span
              className={cn(
                "ml-2 rounded px-1.5 py-0.5 text-xs font-semibold",
                bias.premiumDiscount === "PREMIUM"
                  ? "bg-red-500/15 text-red-500"
                  : "bg-green-500/15 text-green-500",
              )}
            >
              {bias.premiumDiscount}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
