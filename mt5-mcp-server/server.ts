import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as zmq from "zeromq";

const sock = new zmq.Request();
sock.connect("tcp://127.0.0.1:5555");

// --- Safety configuration (server-side layer) ---
export const SAFETY_CONFIG = {
  maxLot: 0.20,
  maxSpreadPips: 5.0,
  requireSL: true,
  requireTP: true,
  maxRiskPct: 10,
} as const;

export const EXECUTION_TOOLS = new Set([
  "place_order",
  "place_pending_order",
  "delete_pending_order",
  "close_position",
  "modify_position",
  "trailing_stop",
  "move_to_breakeven",
]);

export const ANALYSIS_TOOLS = new Set([
  "detect_structure",
  "detect_fvg",
  "detect_order_blocks",
  "get_premium_discount",
  "detect_liquidity_sweeps",
  "get_performance_stats",
]);

export function validateExecution(params: Record<string, unknown>): string | null {
  const name = params.name as string;
  const args = (params.arguments ?? {}) as Record<string, unknown>;

  if (!EXECUTION_TOOLS.has(name)) return null; // not an execution tool

  if (name === "place_order" || name === "place_pending_order") {
    const volume = args.volume as number | undefined;
    const sl = args.sl as number | undefined;
    const tp = args.tp as number | undefined;

    if (volume !== undefined && volume > SAFETY_CONFIG.maxLot)
      return `BLOCKED: lot ${volume} exceeds max ${SAFETY_CONFIG.maxLot}`;
    if (SAFETY_CONFIG.requireSL && (!sl || sl === 0))
      return "BLOCKED: stop loss is required";
    if (SAFETY_CONFIG.requireTP && (!tp || tp === 0))
      return "BLOCKED: take profit is required";
    if (sl !== undefined && tp !== undefined && sl === tp)
      return "BLOCKED: stop loss and take profit cannot be equal";
    if (
      name === "place_pending_order" &&
      (!args.price || (args.price as number) <= 0)
    )
      return "BLOCKED: price is required for pending orders";
  }

  return null; // passed
}

// --- Phase 2: Analysis engine (computed locally from EA data) ---

async function callEA(
  name: string,
  args: Record<string, unknown> = {},
): Promise<any> {
  await sock.send(JSON.stringify({ name, arguments: args }));
  const [response] = await sock.receive();
  return JSON.parse(response.toString());
}

interface Swing {
  type: "high" | "low";
  price: number;
  time: string;
}
interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export function calculateATR(candles: Candle[], period: number = 14): number {
  if (candles.length < 2) return 0;
  const trs: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const tr = Math.max(
      candles[i].high - candles[i].low,
      Math.abs(candles[i].high - candles[i - 1].close),
      Math.abs(candles[i].low - candles[i - 1].close),
    );
    trs.push(tr);
  }
  const slice = trs.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

interface StructureEvent {
  type: "BoS" | "CHoCH";
  direction: "UP" | "DOWN";
  price: number;
  time: string;
  broken_level: number;
}

export function analyzeStructure(swings: Swing[]): {
  trend: string;
  events: StructureEvent[];
  last_high: number | null;
  last_low: number | null;
} {
  const events: StructureEvent[] = [];
  let trend: "BULLISH" | "BEARISH" | "UNKNOWN" = "UNKNOWN";
  let prevHigh: Swing | null = null,
    lastHigh: Swing | null = null;
  let prevLow: Swing | null = null,
    lastLow: Swing | null = null;

  for (const s of swings) {
    if (s.type === "high") {
      prevHigh = lastHigh;
      lastHigh = s;
      if (prevHigh && lastHigh.price > prevHigh.price) {
        const t = trend === "BEARISH" ? "CHoCH" : "BoS";
        events.push({
          type: t as "BoS" | "CHoCH",
          direction: "UP",
          price: lastHigh.price,
          time: lastHigh.time,
          broken_level: prevHigh.price,
        });
        trend = "BULLISH";
      }
    } else {
      prevLow = lastLow;
      lastLow = s;
      if (prevLow && lastLow.price < prevLow.price) {
        const t = trend === "BULLISH" ? "CHoCH" : "BoS";
        events.push({
          type: t as "BoS" | "CHoCH",
          direction: "DOWN",
          price: lastLow.price,
          time: lastLow.time,
          broken_level: prevLow.price,
        });
        trend = "BEARISH";
      }
    }
  }

  return {
    trend,
    events,
    last_high: lastHigh?.price ?? null,
    last_low: lastLow?.price ?? null,
  };
}

export function detectFVGs(candles: Candle[], minSize: number = 0): {
  type: string;
  top: number;
  bottom: number;
  time: string;
  mitigated: boolean;
}[] {
  const fvgs: {
    type: string;
    top: number;
    bottom: number;
    time: string;
    mitigated: boolean;
  }[] = [];
  for (let i = 2; i < candles.length; i++) {
    const a = candles[i - 2],
      c = candles[i];

    // Bullish FVG: gap between candle1 high and candle3 low
    if (c.low > a.high) {
      const gapSize = c.low - a.high;
      if (gapSize < minSize) continue;
      let mitigated = false;
      for (let j = i + 1; j < candles.length; j++) {
        if (candles[j].low <= c.low) {
          mitigated = true;
          break;
        }
      }
      fvgs.push({
        type: "BULLISH",
        top: c.low,
        bottom: a.high,
        time: candles[i - 1].time,
        mitigated,
      });
    }

    // Bearish FVG: gap between candle1 low and candle3 high
    if (c.high < a.low) {
      const gapSize = a.low - c.high;
      if (gapSize < minSize) continue;
      let mitigated = false;
      for (let j = i + 1; j < candles.length; j++) {
        if (candles[j].high >= c.high) {
          mitigated = true;
          break;
        }
      }
      fvgs.push({
        type: "BEARISH",
        top: a.low,
        bottom: c.high,
        time: candles[i - 1].time,
        mitigated,
      });
    }
  }
  return fvgs;
}

export function findOrderBlocks(candles: Candle[], events: StructureEvent[]) {
  const obs: {
    type: string;
    top: number;
    bottom: number;
    time: string;
    mitigated: boolean;
    bos_price: number;
    bos_time: string;
  }[] = [];

  for (const event of events) {
    // Find candle at break time, fallback to price match
    let breakIdx = candles.findIndex((c) => c.time === event.time);
    if (breakIdx === -1) {
      for (let j = 0; j < candles.length; j++) {
        if (event.direction === "UP" && candles[j].high >= event.price) {
          breakIdx = j;
          break;
        }
        if (event.direction === "DOWN" && candles[j].low <= event.price) {
          breakIdx = j;
          break;
        }
      }
    }
    if (breakIdx < 1) continue;

    if (event.direction === "UP") {
      // Bullish OB: last bearish candle before break
      for (let j = breakIdx - 1; j >= 0; j--) {
        if (candles[j].close < candles[j].open) {
          let mitigated = false;
          for (let k = breakIdx + 1; k < candles.length; k++) {
            if (candles[k].low <= candles[j].high) {
              mitigated = true;
              break;
            }
          }
          obs.push({
            type: "BULLISH",
            top: candles[j].high,
            bottom: candles[j].low,
            time: candles[j].time,
            mitigated,
            bos_price: event.price,
            bos_time: event.time,
          });
          break;
        }
      }
    } else {
      // Bearish OB: last bullish candle before break
      for (let j = breakIdx - 1; j >= 0; j--) {
        if (candles[j].close > candles[j].open) {
          let mitigated = false;
          for (let k = breakIdx + 1; k < candles.length; k++) {
            if (candles[k].high >= candles[j].low) {
              mitigated = true;
              break;
            }
          }
          obs.push({
            type: "BEARISH",
            top: candles[j].high,
            bottom: candles[j].low,
            time: candles[j].time,
            mitigated,
            bos_price: event.price,
            bos_time: event.time,
          });
          break;
        }
      }
    }
  }

  return obs;
}

export function calculatePremiumDiscount(
  swingHigh: number,
  swingLow: number,
  currentPrice: number,
) {
  const eq = (swingHigh + swingLow) / 2;
  const range = swingHigh - swingLow;
  const ote_top = swingHigh - range * 0.618;
  const ote_bottom = swingHigh - range * 0.786;
  const zone =
    currentPrice > eq
      ? "PREMIUM"
      : currentPrice < eq
        ? "DISCOUNT"
        : "EQUILIBRIUM";

  return {
    swing_high: swingHigh,
    swing_low: swingLow,
    equilibrium: Math.round(eq * 100) / 100,
    ote_top: Math.round(ote_top * 100) / 100,
    ote_bottom: Math.round(ote_bottom * 100) / 100,
    current_price: currentPrice,
    zone,
  };
}

export function detectLiquiditySweeps(candles: Candle[], swings: Swing[]) {
  const sweeps: {
    type: string;
    swept_level: number;
    wick: number;
    close: number;
    time: string;
  }[] = [];

  for (const swing of swings) {
    for (let i = 0; i < candles.length; i++) {
      if (candles[i].time <= swing.time) continue;

      if (
        swing.type === "high" &&
        candles[i].high > swing.price &&
        candles[i].close < swing.price
      ) {
        sweeps.push({
          type: "BSL",
          swept_level: swing.price,
          wick: candles[i].high,
          close: candles[i].close,
          time: candles[i].time,
        });
        break;
      }
      if (
        swing.type === "low" &&
        candles[i].low < swing.price &&
        candles[i].close > swing.price
      ) {
        sweeps.push({
          type: "SSL",
          swept_level: swing.price,
          wick: candles[i].low,
          close: candles[i].close,
          time: candles[i].time,
        });
        break;
      }
    }
  }

  return sweeps;
}

// Compact formatter for analysis results
function fmtT(timeStr: string): string {
  const [datePart, timePart] = timeStr.split(" ");
  const hhmm = timePart?.substring(0, 5) ?? "00:00";
  const [, mm, dd] = datePart.split(".");
  return mm && dd ? `${mm}/${dd} ${hhmm}` : hhmm;
}

function compactAnalysis(toolName: string, data: any): string {
  switch (toolName) {
    case "detect_structure": {
      const lines = [`${data.timeframe} trend:${data.trend}`];
      for (const e of data.events)
        lines.push(
          `${e.type} ${e.direction}@${e.price} broke ${e.broken_level} ${fmtT(e.time)}`,
        );
      lines.push(`last:H${data.last_high},L${data.last_low}`);
      return lines.join("\n");
    }
    case "detect_fvg": {
      const lines = [
        `${data.timeframe} fvgs:${data.total} open:${data.unmitigated}`,
      ];
      for (const f of data.fvgs)
        lines.push(
          `${f.type} ${f.bottom}-${f.top} ${fmtT(f.time)} [${f.mitigated ? "filled" : "open"}]`,
        );
      return lines.join("\n");
    }
    case "detect_order_blocks": {
      const lines = [
        `${data.timeframe} obs:${data.total} open:${data.unmitigated}`,
      ];
      for (const o of data.order_blocks)
        lines.push(
          `${o.type} ${o.bottom}-${o.top} ${fmtT(o.time)} [${o.mitigated ? "filled" : "open"}] bos:${o.bos_price}@${fmtT(o.bos_time)}`,
        );
      return lines.join("\n");
    }
    case "get_premium_discount":
      return `${data.timeframe} H:${data.swing_high} L:${data.swing_low} EQ:${data.equilibrium} zone:${data.zone} price:${data.current_price}\nOTE:${data.ote_bottom}-${data.ote_top}`;
    case "detect_liquidity_sweeps": {
      const lines = [`${data.timeframe} sweeps:${data.sweeps.length}`];
      for (const s of data.sweeps)
        lines.push(
          `${s.type}@${s.swept_level} wick:${s.wick} close:${s.close} ${fmtT(s.time)}`,
        );
      return lines.join("\n");
    }
    default:
      return JSON.stringify(data);
  }
}

async function handleAnalysisTool(
  name: string,
  args: Record<string, unknown>,
): Promise<string> {
  const tf = (args.timeframe as string) || "M15";
  const count = (args.count as number) || 100;

  switch (name) {
    case "detect_structure": {
      const swingData = await callEA("get_swing_levels", {
        timeframe: tf,
        count: (args.swing_count as number) || 20,
      });
      const result = analyzeStructure(swingData.swings);
      return compactAnalysis(name, { timeframe: tf, ...result });
    }

    case "detect_fvg": {
      const ohlcvData = await callEA("get_ohlcv", {
        symbol: "XAUUSD",
        timeframe: tf,
        count,
      });
      const htfExempt = ["H4", "D1", "W1"].includes(tf);
      const minFvgSize = htfExempt ? 0 : calculateATR(ohlcvData.candles) * 0.15;
      const fvgs = detectFVGs(ohlcvData.candles, minFvgSize);
      return compactAnalysis(name, {
        timeframe: tf,
        total: fvgs.length,
        unmitigated: fvgs.filter((f) => !f.mitigated).length,
        fvgs,
      });
    }

    case "detect_order_blocks": {
      const swingData = await callEA("get_swing_levels", {
        timeframe: tf,
        count: 20,
      });
      const ohlcvData = await callEA("get_ohlcv", {
        symbol: "XAUUSD",
        timeframe: tf,
        count,
      });
      const { events } = analyzeStructure(swingData.swings);
      const obs = findOrderBlocks(ohlcvData.candles, events);
      return compactAnalysis(name, {
        timeframe: tf,
        total: obs.length,
        unmitigated: obs.filter((o) => !o.mitigated).length,
        order_blocks: obs,
      });
    }

    case "get_premium_discount": {
      const swingData = await callEA("get_swing_levels", {
        timeframe: tf,
        count: 10,
      });
      const tickData = await callEA("get_current_tick", {});
      const highs = (swingData.swings as Swing[]).filter(
        (s) => s.type === "high",
      );
      const lows = (swingData.swings as Swing[]).filter(
        (s) => s.type === "low",
      );
      const swingHigh = highs.length
        ? Math.max(...highs.map((h) => h.price))
        : 0;
      const swingLow = lows.length ? Math.min(...lows.map((l) => l.price)) : 0;
      const result = calculatePremiumDiscount(
        swingHigh,
        swingLow,
        tickData.bid,
      );
      return compactAnalysis(name, { timeframe: tf, ...result });
    }

    case "detect_liquidity_sweeps": {
      const swingData = await callEA("get_swing_levels", {
        timeframe: tf,
        count: 20,
      });
      const ohlcvData = await callEA("get_ohlcv", {
        symbol: "XAUUSD",
        timeframe: tf,
        count,
      });
      const sweeps = detectLiquiditySweeps(ohlcvData.candles, swingData.swings);
      return compactAnalysis(name, { timeframe: tf, sweeps });
    }

    case "get_performance_stats": {
      const period = (args.period as string) || "30d";
      const raw = await callEA("get_trade_history", {
        period,
        symbol: "XAUUSD",
      });
      const trades: any[] = Array.isArray(raw) ? raw : (raw.trades ?? []);

      let wins = 0,
        losses = 0,
        grossWin = 0,
        grossLoss = 0,
        totalDuration = 0;
      const sessions: Record<string, { w: number; l: number; pnl: number }> = {
        ASIAN: { w: 0, l: 0, pnl: 0 },
        LONDON: { w: 0, l: 0, pnl: 0 },
        OVERLAP: { w: 0, l: 0, pnl: 0 },
        NEW_YORK: { w: 0, l: 0, pnl: 0 },
      };

      for (const t of trades) {
        const net = t.net_profit as number;
        const dur = (t.duration_minutes as number) || 0;
        totalDuration += dur;
        if (net > 0) {
          wins++;
          grossWin += net;
        } else {
          losses++;
          grossLoss += Math.abs(net);
        }

        // Map open_time to session (UTC hours from "YYYY.MM.DD HH:MM:SS")
        const hour = parseInt(
          (t.open_time as string)?.split(" ")[1]?.split(":")[0] ?? "0",
        );
        let ses = "ASIAN";
        if (hour >= 13 && hour < 17) ses = "OVERLAP";
        else if (hour >= 8 && hour < 17) ses = "LONDON";
        else if (hour >= 17 && hour < 21) ses = "NEW_YORK";
        sessions[ses].pnl += net;
        if (net > 0) sessions[ses].w++;
        else sessions[ses].l++;
      }

      const total = trades.length;
      const wr = total > 0 ? ((wins / total) * 100).toFixed(0) : "0";
      const pf =
        grossLoss > 0
          ? (grossWin / grossLoss).toFixed(2)
          : grossWin > 0
            ? "∞"
            : "0";
      const avgW = wins > 0 ? (grossWin / wins).toFixed(2) : "0";
      const avgL = losses > 0 ? (grossLoss / losses).toFixed(2) : "0";
      const avgDur = total > 0 ? Math.round(totalDuration / total) : 0;
      const net = (grossWin - grossLoss).toFixed(2);

      // Current streak
      let streak = 0,
        streakType = "";
      for (let i = trades.length - 1; i >= 0; i--) {
        const n = trades[i].net_profit as number;
        if (i === trades.length - 1) {
          streakType = n > 0 ? "W" : "L";
          streak = 1;
        } else if (
          (n > 0 && streakType === "W") ||
          (n <= 0 && streakType === "L")
        )
          streak++;
        else break;
      }

      const sesFmt = (s: { w: number; l: number; pnl: number }) =>
        `${s.w}W/${s.l}L $${s.pnl.toFixed(2)}`;

      return [
        `${period} | ${total} trades | WR:${wr}% | PF:${pf} | net:$${net}`,
        `wins:${wins} avg:$${avgW} | losses:${losses} avg:-$${avgL} | avg_dur:${avgDur}min`,
        `streak:${streak}${streakType}`,
        `ASIAN:${sesFmt(sessions.ASIAN)} LONDON:${sesFmt(sessions.LONDON)}`,
        `OVERLAP:${sesFmt(sessions.OVERLAP)} NY:${sesFmt(sessions.NEW_YORK)}`,
      ].join("\n");
    }

    default:
      return `Unknown analysis tool: ${name}`;
  }
}

const server = new Server(
  { name: "mt5-bridge", version: "1.0.0" },
  { capabilities: { tools: {}, resources: {} } },
);

export const TOOL_DEFINITIONS = [
    {
      name: "get_current_tick",
      description: "Get current XAU/USD bid/ask/spread",
      inputSchema: { type: "object" as const, properties: {} },
    },
    {
      name: "get_ohlcv",
      description: "Get OHLCV candles",
      inputSchema: {
        type: "object" as const,
        properties: {
          symbol: {
            type: "string",
            description: "Trading symbol, e.g. XAUUSD",
          },
          timeframe: {
            type: "string",
            enum: ["M1", "M5", "M15", "H1", "H4", "D1", "W1"],
            description:
              "Candle timeframe (e.g. M1, M5, M15, H1, H4, D1, W1)",
          },
          count: {
            type: "number",
            description: "Number of candles to retrieve",
          },
        },
        required: ["symbol", "timeframe", "count"],
      },
    },
    {
      name: "get_open_positions",
      description: "Get all open trades (active positions only)",
      inputSchema: { type: "object" as const, properties: {} },
    },
    {
      name: "get_pending_orders",
      description:
        "Get all pending orders (BUY_LIMIT, SELL_LIMIT, BUY_STOP, SELL_STOP) on XAUUSD",
      inputSchema: { type: "object" as const, properties: {} },
    },
    {
      name: "get_account_info",
      description: "Get balance, equity, margin",
      inputSchema: { type: "object" as const, properties: {} },
    },
    {
      name: "get_trade_history",
      description:
        "Get closed trade history. period: 'today', '7d' (default), '30d', 'all'. Returns ticket, type, open/close price, profit, commission, swap, net_profit, duration_minutes.",
      inputSchema: {
        type: "object" as const,
        properties: {
          period: {
            type: "string",
            enum: ["today", "7d", "30d", "all"],
            description: "Time range: today, 7d (default), 30d, or all history",
          },
          symbol: {
            type: "string",
            description: "Symbol to filter, default XAUUSD",
          },
        },
        required: [],
      },
    },
    {
      name: "get_session_levels",
      description:
        "Get Asia/London/NY session levels (high, low, open) in UTC. Returns active_session and levels for each session.",
      inputSchema: { type: "object" as const, properties: {} },
    },
    {
      name: "get_swing_levels",
      description:
        "Get last N swing highs/lows on a given timeframe. Returns alternating swings with price and time.",
      inputSchema: {
        type: "object" as const,
        properties: {
          timeframe: {
            type: "string",
            description: "Timeframe (M1, M5, M15, H1, H4, D1)",
          },
          count: {
            type: "number",
            description: "Number of swings to return (default 10)",
          },
        },
        required: [],
      },
    },
    {
      name: "get_spread_history",
      description:
        "Get recent tick spread data for XAUUSD with avg/max/min stats. Spread is in pips.",
      inputSchema: {
        type: "object" as const,
        properties: {
          count: {
            type: "number",
            description: "Number of ticks to sample (default 20, max 200)",
          },
        },
        required: [],
      },
    },
    {
      name: "calculate_lot_size",
      description:
        "Calculate recommended lot size from SL pips and risk %. Returns recommended_lot, risk_dollars, pip_value. For XAUUSD 0.01 lot.",
      inputSchema: {
        type: "object" as const,
        properties: {
          sl_pips: {
            type: "number",
            description: "Stop loss distance in pips",
          },
          risk_pct: {
            type: "number",
            description: "Risk percentage of equity (default 10)",
          },
        },
        required: ["sl_pips"],
      },
    },
    {
      name: "get_daily_drawdown",
      description:
        "Get today's closed P&L + floating P&L from open positions since UTC midnight. Returns closed_pnl, floating_pnl, total_pnl.",
      inputSchema: { type: "object" as const, properties: {} },
    },
    {
      name: "place_order",
      description:
        "Place a market order on XAUUSD. REQUIRES user confirmation before calling. " +
        "Safety: max lot 0.20, SL required, TP required, spread checked. " +
        "Returns ticket, open_price, sl, tp, volume.",
      inputSchema: {
        type: "object" as const,
        properties: {
          type: {
            type: "string",
            enum: ["BUY", "SELL"],
            description: "Order direction",
          },
          volume: { type: "number", description: "Lot size (max 0.20)" },
          sl: { type: "number", description: "Stop loss price (required)" },
          tp: { type: "number", description: "Take profit price (required)" },
          comment: {
            type: "string",
            description: "Order comment (default: Claude)",
          },
        },
        required: ["type", "volume", "sl", "tp"],
      },
    },
    {
      name: "close_position",
      description:
        "Close an open position by ticket, or close all XAUUSD positions. " +
        "Returns closed ticket(s) and profit.",
      inputSchema: {
        type: "object" as const,
        properties: {
          ticket: { type: "number", description: "Position ticket to close" },
          close_all: {
            type: "string",
            enum: ["true", "false"],
            description: "Set to 'true' to close all XAUUSD positions",
          },
        },
        required: [],
      },
    },
    {
      name: "modify_position",
      description:
        "Modify SL and/or TP of an open position. " +
        "Pass only the field(s) to change; unchanged fields keep their current value.",
      inputSchema: {
        type: "object" as const,
        properties: {
          ticket: { type: "number", description: "Position ticket to modify" },
          sl: {
            type: "number",
            description: "New stop loss price (0 = keep current)",
          },
          tp: {
            type: "number",
            description: "New take profit price (0 = keep current)",
          },
        },
        required: ["ticket"],
      },
    },
    {
      name: "place_pending_order",
      description:
        "Place a pending order on XAUUSD (limit or stop). REQUIRES user confirmation. " +
        "Safety: max lot 0.20, SL required, TP required, price required.",
      inputSchema: {
        type: "object" as const,
        properties: {
          type: {
            type: "string",
            enum: ["BUY_LIMIT", "SELL_LIMIT", "BUY_STOP", "SELL_STOP"],
            description:
              "BUY_LIMIT=buy at lower price, SELL_LIMIT=sell at higher price, BUY_STOP=buy on breakout up, SELL_STOP=sell on breakout down",
          },
          price: {
            type: "number",
            description: "Trigger/entry price for the pending order",
          },
          volume: { type: "number", description: "Lot size (max 0.20)" },
          sl: { type: "number", description: "Stop loss price (required)" },
          tp: { type: "number", description: "Take profit price (required)" },
          comment: {
            type: "string",
            description: "Order comment (default: Claude)",
          },
        },
        required: ["type", "price", "volume", "sl", "tp"],
      },
    },
    {
      name: "delete_pending_order",
      description: "Delete a pending order by ticket number.",
      inputSchema: {
        type: "object" as const,
        properties: {
          ticket: {
            type: "number",
            description: "Pending order ticket to delete",
          },
        },
        required: ["ticket"],
      },
    },
    // --- Phase 3: Trade management tools ---
    {
      name: "trailing_stop",
      description:
        "Trail the stop loss of an open position by N pips from current price. Only moves SL in the profitable direction.",
      inputSchema: {
        type: "object" as const,
        properties: {
          ticket: { type: "number", description: "Position ticket" },
          trail_pips: {
            type: "number",
            description: "Distance in pips to trail behind current price",
          },
        },
        required: ["ticket", "trail_pips"],
      },
    },
    {
      name: "move_to_breakeven",
      description:
        "Move stop loss to break-even (open price + optional buffer pips). No-op if SL already at or past BE.",
      inputSchema: {
        type: "object" as const,
        properties: {
          ticket: { type: "number", description: "Position ticket" },
          buffer_pips: {
            type: "number",
            description: "Pips above/below open price for buffer (default: 1)",
          },
        },
        required: ["ticket"],
      },
    },
    // --- Phase 4B: Performance stats (computed locally from trade history) ---
    {
      name: "get_performance_stats",
      description:
        "Compute trading statistics from closed trade history: win rate, profit factor, avg win/loss, session breakdown, current streak.",
      inputSchema: {
        type: "object" as const,
        properties: {
          period: {
            type: "string",
            enum: ["today", "7d", "30d", "all"],
            description: "History window (default: 30d)",
          },
        },
        required: [],
      },
    },
    // --- Phase 5D: Economic calendar ---
    {
      name: "get_economic_calendar",
      description:
        "Get upcoming USD high/medium-impact economic events from MT5 calendar. Returns event name, time (UTC), impact level, forecast, and prev value.",
      inputSchema: {
        type: "object" as const,
        properties: {
          period: {
            type: "string",
            enum: ["today", "24h", "48h"],
            description:
              "Time window: today (UTC day), 24h from now (default), 48h from now",
          },
          high_only: {
            type: "string",
            enum: ["true", "false"],
            description:
              "Set true to return only HIGH-impact events (default: false = HIGH + MEDIUM)",
          },
        },
        required: [],
      },
    },
    // --- Phase 4C: Price alert tools ---
    {
      name: "set_alert",
      description:
        "Set a price alert on XAUUSD. Auto-detects direction (above/below) from current price if not specified. EA fires Print alert when triggered, then removes it.",
      inputSchema: {
        type: "object" as const,
        properties: {
          price: { type: "number", description: "Price level to alert at" },
          label: {
            type: "string",
            description:
              "Short label for this alert (e.g. 'OB top', 'Asian high')",
          },
          direction: {
            type: "string",
            enum: ["above", "below"],
            description:
              "Fire when price goes above or below (auto-detected if omitted)",
          },
        },
        required: ["price"],
      },
    },
    {
      name: "list_alerts",
      description:
        "List all active price alerts currently registered in the EA.",
      inputSchema: { type: "object" as const, properties: {} },
    },
    {
      name: "delete_alert",
      description: "Delete a price alert by ID. Get IDs from list_alerts.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: { type: "number", description: "Alert ID to delete" },
        },
        required: ["id"],
      },
    },
    // --- Phase 2: Analysis tools (computed locally in server.ts) ---
    {
      name: "detect_structure",
      description:
        "Detect BoS (Break of Structure) and CHoCH (Change of Character) events. Returns trend direction and list of structure events with price/time.",
      inputSchema: {
        type: "object" as const,
        properties: {
          timeframe: {
            type: "string",
            description: "Timeframe: M1, M5, M15, H1, H4, D1",
          },
          swing_count: {
            type: "number",
            description: "Number of swings to analyze (default 20)",
          },
        },
        required: ["timeframe"],
      },
    },
    {
      name: "detect_fvg",
      description:
        "Detect Fair Value Gaps (imbalance zones) from 3-candle patterns. Returns bullish/bearish FVGs with mitigated/unmitigated status.",
      inputSchema: {
        type: "object" as const,
        properties: {
          timeframe: {
            type: "string",
            description: "Timeframe: M1, M5, M15, H1, H4, D1",
          },
          count: {
            type: "number",
            description: "Number of candles to scan (default 100)",
          },
        },
        required: ["timeframe"],
      },
    },
    {
      name: "detect_order_blocks",
      description:
        "Detect Order Blocks — last opposing candle before each BoS/CHoCH event. Returns OB zones with mitigation status.",
      inputSchema: {
        type: "object" as const,
        properties: {
          timeframe: {
            type: "string",
            description: "Timeframe: M1, M5, M15, H1, H4, D1",
          },
          count: {
            type: "number",
            description: "Number of candles to scan (default 100)",
          },
        },
        required: ["timeframe"],
      },
    },
    {
      name: "get_premium_discount",
      description:
        "Calculate premium/discount zones, equilibrium, and OTE (61.8%-78.6% retracement) from the swing range. Returns current zone classification.",
      inputSchema: {
        type: "object" as const,
        properties: {
          timeframe: {
            type: "string",
            description: "Timeframe for swing range: M15, H1, H4, D1",
          },
        },
        required: ["timeframe"],
      },
    },
    {
      name: "detect_liquidity_sweeps",
      description:
        "Detect BSL (buy-side) and SSL (sell-side) liquidity sweeps — wicks exceeding swing levels that close back inside.",
      inputSchema: {
        type: "object" as const,
        properties: {
          timeframe: {
            type: "string",
            description: "Timeframe: M1, M5, M15, H1, H4, D1",
          },
          count: {
            type: "number",
            description: "Number of candles to scan (default 100)",
          },
        },
        required: ["timeframe"],
      },
    },
  ] as const;

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOL_DEFINITIONS as unknown as Array<{
    name: string;
    description: string;
    inputSchema: { type: "object"; properties: Record<string, unknown>; required?: string[] };
  }>,
}));

// compactOutput: minimizes token usage per tool response.
// session_levels→pipe-delimited SES/A/L/NY; ohlcv→CSV t,o,h,l,c (HH:MM or MM/DD HH:MM);
// swing_levels→{time} H/L{price}; tick→single line; positions→#{ticket} lines;
// account→single line; trade_history→CSV; spread_history→single line;
// calculate_lot_size→single line; daily_drawdown→single line.
export function compactOutput(toolName: string, raw: string): string {
  try {
    const d = JSON.parse(raw);

    const fmtTime = (timeStr: string, singleDay: boolean): string => {
      const [datePart, timePart] = timeStr.split(" ");
      const hhmm = timePart?.substring(0, 5) ?? "00:00";
      if (singleDay) return hhmm;
      const [, mm, dd] = datePart.split(".");
      return `${mm}/${dd} ${hhmm}`;
    };

    switch (toolName) {
      case "get_session_levels": {
        const t = (d.time_utc as string).split(" ")[1]?.substring(0, 5) ?? "";
        const a = d.asian,
          l = d.london,
          ny = d.new_york;
        return [
          `SES:${d.active_session}|UTC:${t}`,
          `A:H${a.high},L${a.low},O${a.open}`,
          `L:H${l.high},L${l.low},O${l.open}`,
          `NY:H${ny.high},L${ny.low},O${ny.open}`,
        ].join("\n");
      }

      case "get_ohlcv": {
        const candles = d.candles as Array<{
          time: string;
          open: number;
          high: number;
          low: number;
          close: number;
        }>;
        const dates = new Set(candles.map((c) => c.time.split(" ")[0]));
        const singleDay = dates.size === 1;
        const rows = candles.map(
          (c) =>
            `${fmtTime(c.time, singleDay)},${c.open},${c.high},${c.low},${c.close}`,
        );
        return [`${d.symbol} ${d.timeframe}`, "t,o,h,l,c", ...rows].join("\n");
      }

      case "get_swing_levels": {
        const swings = d.swings as Array<{
          type: string;
          price: number;
          time: string;
        }>;
        const dates = new Set(swings.map((s) => s.time.split(" ")[0]));
        const singleDay = dates.size === 1;
        const rows = swings.map(
          (s) =>
            `${fmtTime(s.time, singleDay)} ${s.type === "high" ? "H" : "L"}${s.price}`,
        );
        return [`${d.timeframe} swings`, ...rows].join("\n");
      }

      case "get_current_tick":
        return `${d.symbol} bid:${d.bid} ask:${d.ask} spd:${d.spread}`;

      case "get_open_positions": {
        const positions = Array.isArray(d) ? d : (d.positions ?? []);
        if (positions.length === 0) return "no open positions";
        return positions
          .map(
            (p: any) =>
              `#${p.ticket} ${p.type} ${p.symbol} @${p.open_price} lot:${p.volume} sl:${p.sl} tp:${p.tp} pnl:${p.profit}`,
          )
          .join("\n");
      }

      case "get_pending_orders": {
        const orders = Array.isArray(d) ? d : (d.orders ?? []);
        if (orders.length === 0) return "no pending orders";
        return orders
          .map(
            (o: any) =>
              `#${o.ticket} ${o.type} @${o.price} lot:${o.volume} sl:${o.sl} tp:${o.tp}`,
          )
          .join("\n");
      }

      case "get_account_info":
        return `bal:${d.balance} eq:${d.equity} margin:${d.margin} free:${d.free_margin}`;

      case "get_trade_history": {
        const trades = Array.isArray(d) ? d : (d.trades ?? []);
        if (trades.length === 0) return "no trades";
        const rows = trades.map(
          (t: any) =>
            `${t.ticket},${t.type},${t.open_price},${t.close_price},${t.profit},${t.net_profit},${t.duration_minutes}`,
        );
        return ["ticket,type,open,close,pnl,net,dur", ...rows].join("\n");
      }

      case "get_spread_history":
        return `spread avg:${d.avg} max:${d.max} min:${d.min} n:${d.count}`;

      case "calculate_lot_size":
        return `lot:${d.recommended_lot} risk:$${d.risk_dollars} pip_val:${d.pip_value}`;

      case "get_daily_drawdown":
        return `closed:${d.closed_pnl} float:${d.floating_pnl} total:${d.total_pnl}`;

      case "place_order":
        return d.error
          ? `ERROR: ${d.error}`
          : `OPENED #${d.ticket} ${d.type} @${d.open_price} sl:${d.sl} tp:${d.tp} lot:${d.volume}`;

      case "close_position":
        return d.error
          ? `ERROR: ${d.error}`
          : `CLOSED ${d.closed_count} position(s)`;

      case "modify_position":
        return d.error
          ? `ERROR: ${d.error}`
          : `MODIFIED #${d.ticket} sl:${d.sl} tp:${d.tp}`;

      case "place_pending_order":
        return d.error
          ? `ERROR: ${d.error}`
          : `PENDING #${d.ticket} ${d.type} @${d.price} sl:${d.sl} tp:${d.tp} lot:${d.volume}`;

      case "delete_pending_order":
        return d.error ? `ERROR: ${d.error}` : `DELETED #${d.ticket}`;

      case "trailing_stop":
        return d.error
          ? `ERROR: ${d.error}`
          : d.action === "no_change"
            ? `#${d.ticket} trail no_change (sl:${d.current_sl} trail_would_be:${d.trail_sl})`
            : `#${d.ticket} TRAILED sl:${d.prev_sl}→${d.new_sl} (${d.trail_pips}pips)`;

      case "move_to_breakeven":
        return d.error
          ? `ERROR: ${d.error}`
          : d.action === "already_at_be"
            ? `#${d.ticket} already at/past BE (sl:${d.current_sl} be:${d.be_level})`
            : `#${d.ticket} MOVED TO BE sl:${d.prev_sl}→${d.new_sl} (open:${d.open_price})`;

      case "set_alert":
        return d.error
          ? `ERROR: ${d.error}`
          : `ALERT #${d.id} set: "${d.label}" @ ${Number(d.price).toFixed(2)} (${d.direction}) | active:${d.active_count}`;

      case "list_alerts": {
        if (!d.count || !Array.isArray(d.alerts) || d.alerts.length === 0)
          return "no active alerts";
        const rows = (d.alerts as any[]).map(
          (a: any) =>
            `#${a.id} ${Number(a.price).toFixed(2)} [${a.direction}] "${a.label}"`,
        );
        return [`${d.count} active alert(s):`, ...rows].join("\n");
      }

      case "delete_alert":
        return d.error
          ? `ERROR: ${d.error}`
          : `ALERT #${d.id} deleted: "${d.label}" @ ${Number(d.price).toFixed(2)}`;

      case "get_economic_calendar": {
        if (d.error) return `ERROR: ${d.error}`;
        if (d.count === 0)
          return `no USD high/medium events in next ${d.period}`;
        const rows = (d.events as any[]).map(
          (e: any) =>
            `${e.time.split(" ")[1]?.substring(0, 5)} [${e.impact}] ${e.event} | fcst:${e.forecast} prev:${e.prev}`,
        );
        return [`USD events (${d.period}): ${d.count}`, ...rows].join("\n");
      }

      default:
        return raw;
    }
  } catch {
    return raw;
  }
}

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  // Pre-flight safety check for execution tools
  const safetyError = validateExecution(req.params);
  if (safetyError) {
    return { content: [{ type: "text", text: `⛔ ${safetyError}` }] };
  }

  // Phase 2: Analysis tools computed locally (no EA roundtrip for analysis logic)
  if (ANALYSIS_TOOLS.has(req.params.name)) {
    const text = await handleAnalysisTool(
      req.params.name,
      (req.params.arguments ?? {}) as Record<string, unknown>,
    );
    return { content: [{ type: "text", text }] };
  }

  // 3B: Daily loss limit hard block — checked before any execution tool (except cancel)
  if (
    EXECUTION_TOOLS.has(req.params.name) &&
    req.params.name !== "delete_pending_order"
  ) {
    try {
      const dd = await callEA("get_daily_drawdown");
      if (dd.equity > 0 && dd.total_pnl !== undefined) {
        const pct = dd.total_pnl / dd.equity;
        if (pct < -0.2) {
          return {
            content: [
              {
                type: "text",
                text: `⛔ DAILY LOSS LIMIT BREACHED: P&L ${dd.total_pnl.toFixed(2)} = ${(pct * 100).toFixed(1)}% of equity ${dd.equity.toFixed(2)}. All trading blocked for today.`,
              },
            ],
          };
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[safety] drawdown check failed: ${msg}`);
      return {
        content: [
          {
            type: "text",
            text: `⛔ BLOCKED: daily loss limit check failed (${msg}). Fix EA connection before trading.`,
          },
        ],
      };
    }
  }

  // 1B: Spread check at Node layer for place_order / place_pending_order
  if (req.params.name === "place_order" || req.params.name === "place_pending_order") {
    try {
      const tick = await callEA("get_current_tick");
      if (tick.spread !== undefined) {
        const spreadPips = tick.spread; // bridge already returns spread in pips
        if (spreadPips > SAFETY_CONFIG.maxSpreadPips) {
          return {
            content: [
              {
                type: "text",
                text: `⛔ BLOCKED: spread ${spreadPips.toFixed(1)} pips exceeds max ${SAFETY_CONFIG.maxSpreadPips} pips. Wait for tighter spread.`,
              },
            ],
          };
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[safety] spread check failed: ${msg}`);
      return {
        content: [
          {
            type: "text",
            text: `⛔ BLOCKED: spread check failed (${msg}). Fix EA connection before trading.`,
          },
        ],
      };
    }
  }

  await sock.send(JSON.stringify(req.params));
  const [response] = await sock.receive();
  const compacted = compactOutput(req.params.name, response.toString());

  // 3A: Auto-sync account after every execution tool (except cancel/delete)
  if (
    EXECUTION_TOOLS.has(req.params.name) &&
    req.params.name !== "delete_pending_order"
  ) {
    try {
      const acct = await callEA("get_account_info");
      const syncLine = `\n— equity:${acct.equity} free_margin:${acct.free_margin} margin_level:${acct.margin_level?.toFixed(1)}%`;
      return { content: [{ type: "text", text: compacted + syncLine }] };
    } catch {
      /* return result without sync if EA unreachable */
    }
  }

  return { content: [{ type: "text", text: compacted }] };
});

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "mt5://account",
      name: "Account Info",
      description: "Current MT5 account balance, equity, margin, and leverage",
      mimeType: "application/json",
    },
    {
      uri: "mt5://positions",
      name: "Open Positions",
      description: "All open trades on XAU/USD",
      mimeType: "application/json",
    },
    {
      uri: "mt5://tick",
      name: "Current Tick",
      description: "Current XAU/USD bid/ask/spread",
      mimeType: "application/json",
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
  let toolName = "";
  switch (req.params.uri) {
    case "mt5://account":
      toolName = "get_account_info";
      break;
    case "mt5://positions":
      toolName = "get_open_positions";
      break;
    case "mt5://tick":
      toolName = "get_current_tick";
      break;
    default:
      throw new Error(`Unknown resource: ${req.params.uri}`);
  }

  await sock.send(JSON.stringify({ tool: toolName }));
  const [response] = await sock.receive();
  const compacted = compactOutput(toolName, response.toString());
  return {
    contents: [
      {
        uri: req.params.uri,
        mimeType: "application/json",
        text: compacted,
      },
    ],
  };
});

// Only connect stdio when run directly (not when imported by tests).
const entryUrl = process.argv[1] ? new URL(`file://${process.argv[1]}`).href : "";
if (import.meta.url === entryUrl) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
