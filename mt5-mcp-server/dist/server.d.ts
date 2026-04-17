export declare const SAFETY_CONFIG: {
    readonly maxLot: 0.01;
    readonly maxSpreadPips: 3;
    readonly requireSL: true;
    readonly requireTP: true;
    readonly maxRiskPct: 10;
};
export declare const EXECUTION_TOOLS: Set<string>;
export declare const ANALYSIS_TOOLS: Set<string>;
export declare function validateExecution(params: Record<string, unknown>): string | null;
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
export declare function calculateATR(candles: Candle[], period?: number): number;
interface StructureEvent {
    type: "BoS" | "CHoCH";
    direction: "UP" | "DOWN";
    price: number;
    time: string;
    broken_level: number;
}
export declare function analyzeStructure(swings: Swing[]): {
    trend: string;
    events: StructureEvent[];
    last_high: number | null;
    last_low: number | null;
};
export declare function detectFVGs(candles: Candle[], minSize?: number): {
    type: string;
    top: number;
    bottom: number;
    time: string;
    mitigated: boolean;
}[];
export declare function findOrderBlocks(candles: Candle[], events: StructureEvent[]): {
    type: string;
    top: number;
    bottom: number;
    time: string;
    mitigated: boolean;
    bos_price: number;
    bos_time: string;
}[];
export declare function calculatePremiumDiscount(swingHigh: number, swingLow: number, currentPrice: number): {
    swing_high: number;
    swing_low: number;
    equilibrium: number;
    ote_top: number;
    ote_bottom: number;
    current_price: number;
    zone: string;
};
export declare function detectLiquiditySweeps(candles: Candle[], swings: Swing[]): {
    type: string;
    swept_level: number;
    wick: number;
    close: number;
    time: string;
}[];
export declare const TOOL_DEFINITIONS: readonly [{
    readonly name: "get_current_tick";
    readonly description: "Get current XAU/USD bid/ask/spread";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {};
    };
}, {
    readonly name: "get_ohlcv";
    readonly description: "Get OHLCV candles";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly symbol: {
                readonly type: "string";
                readonly description: "Trading symbol, e.g. XAUUSD";
            };
            readonly timeframe: {
                readonly type: "string";
                readonly enum: readonly ["M1", "M5", "M15", "H1", "H4", "D1", "W1"];
                readonly description: "Candle timeframe (e.g. M1, M5, M15, H1, H4, D1, W1)";
            };
            readonly count: {
                readonly type: "number";
                readonly description: "Number of candles to retrieve";
            };
        };
        readonly required: readonly ["symbol", "timeframe", "count"];
    };
}, {
    readonly name: "get_open_positions";
    readonly description: "Get all open trades (active positions only)";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {};
    };
}, {
    readonly name: "get_pending_orders";
    readonly description: "Get all pending orders (BUY_LIMIT, SELL_LIMIT, BUY_STOP, SELL_STOP) on XAUUSD";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {};
    };
}, {
    readonly name: "get_account_info";
    readonly description: "Get balance, equity, margin";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {};
    };
}, {
    readonly name: "get_trade_history";
    readonly description: "Get closed trade history. period: 'today', '7d' (default), '30d', 'all'. Returns ticket, type, open/close price, profit, commission, swap, net_profit, duration_minutes.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly period: {
                readonly type: "string";
                readonly enum: readonly ["today", "7d", "30d", "all"];
                readonly description: "Time range: today, 7d (default), 30d, or all history";
            };
            readonly symbol: {
                readonly type: "string";
                readonly description: "Symbol to filter, default XAUUSD";
            };
        };
        readonly required: readonly [];
    };
}, {
    readonly name: "get_session_levels";
    readonly description: "Get Asia/London/NY session levels (high, low, open) in UTC. Returns active_session and levels for each session.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {};
    };
}, {
    readonly name: "get_swing_levels";
    readonly description: "Get last N swing highs/lows on a given timeframe. Returns alternating swings with price and time.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly timeframe: {
                readonly type: "string";
                readonly description: "Timeframe (M1, M5, M15, H1, H4, D1)";
            };
            readonly count: {
                readonly type: "number";
                readonly description: "Number of swings to return (default 10)";
            };
        };
        readonly required: readonly [];
    };
}, {
    readonly name: "get_spread_history";
    readonly description: "Get recent tick spread data for XAUUSD with avg/max/min stats. Spread is in pips.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly count: {
                readonly type: "number";
                readonly description: "Number of ticks to sample (default 20, max 200)";
            };
        };
        readonly required: readonly [];
    };
}, {
    readonly name: "calculate_lot_size";
    readonly description: "Calculate recommended lot size from SL pips and risk %. Returns recommended_lot, risk_dollars, pip_value. For XAUUSD 0.01 lot.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly sl_pips: {
                readonly type: "number";
                readonly description: "Stop loss distance in pips";
            };
            readonly risk_pct: {
                readonly type: "number";
                readonly description: "Risk percentage of equity (default 10)";
            };
        };
        readonly required: readonly ["sl_pips"];
    };
}, {
    readonly name: "get_daily_drawdown";
    readonly description: "Get today's closed P&L + floating P&L from open positions since UTC midnight. Returns closed_pnl, floating_pnl, total_pnl.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {};
    };
}, {
    readonly name: "place_order";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly enum: readonly ["BUY", "SELL"];
                readonly description: "Order direction";
            };
            readonly volume: {
                readonly type: "number";
                readonly description: "Lot size (max 0.01)";
            };
            readonly sl: {
                readonly type: "number";
                readonly description: "Stop loss price (required)";
            };
            readonly tp: {
                readonly type: "number";
                readonly description: "Take profit price (required)";
            };
            readonly comment: {
                readonly type: "string";
                readonly description: "Order comment (default: Claude)";
            };
        };
        readonly required: readonly ["type", "volume", "sl", "tp"];
    };
}, {
    readonly name: "close_position";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly ticket: {
                readonly type: "number";
                readonly description: "Position ticket to close";
            };
            readonly close_all: {
                readonly type: "string";
                readonly enum: readonly ["true", "false"];
                readonly description: "Set to 'true' to close all XAUUSD positions";
            };
        };
        readonly required: readonly [];
    };
}, {
    readonly name: "modify_position";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly ticket: {
                readonly type: "number";
                readonly description: "Position ticket to modify";
            };
            readonly sl: {
                readonly type: "number";
                readonly description: "New stop loss price (0 = keep current)";
            };
            readonly tp: {
                readonly type: "number";
                readonly description: "New take profit price (0 = keep current)";
            };
        };
        readonly required: readonly ["ticket"];
    };
}, {
    readonly name: "place_pending_order";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly enum: readonly ["BUY_LIMIT", "SELL_LIMIT", "BUY_STOP", "SELL_STOP"];
                readonly description: "BUY_LIMIT=buy at lower price, SELL_LIMIT=sell at higher price, BUY_STOP=buy on breakout up, SELL_STOP=sell on breakout down";
            };
            readonly price: {
                readonly type: "number";
                readonly description: "Trigger/entry price for the pending order";
            };
            readonly volume: {
                readonly type: "number";
                readonly description: "Lot size (max 0.01)";
            };
            readonly sl: {
                readonly type: "number";
                readonly description: "Stop loss price (required)";
            };
            readonly tp: {
                readonly type: "number";
                readonly description: "Take profit price (required)";
            };
            readonly comment: {
                readonly type: "string";
                readonly description: "Order comment (default: Claude)";
            };
        };
        readonly required: readonly ["type", "price", "volume", "sl", "tp"];
    };
}, {
    readonly name: "delete_pending_order";
    readonly description: "Delete a pending order by ticket number.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly ticket: {
                readonly type: "number";
                readonly description: "Pending order ticket to delete";
            };
        };
        readonly required: readonly ["ticket"];
    };
}, {
    readonly name: "trailing_stop";
    readonly description: "Trail the stop loss of an open position by N pips from current price. Only moves SL in the profitable direction.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly ticket: {
                readonly type: "number";
                readonly description: "Position ticket";
            };
            readonly trail_pips: {
                readonly type: "number";
                readonly description: "Distance in pips to trail behind current price";
            };
        };
        readonly required: readonly ["ticket", "trail_pips"];
    };
}, {
    readonly name: "move_to_breakeven";
    readonly description: "Move stop loss to break-even (open price + optional buffer pips). No-op if SL already at or past BE.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly ticket: {
                readonly type: "number";
                readonly description: "Position ticket";
            };
            readonly buffer_pips: {
                readonly type: "number";
                readonly description: "Pips above/below open price for buffer (default: 1)";
            };
        };
        readonly required: readonly ["ticket"];
    };
}, {
    readonly name: "get_performance_stats";
    readonly description: "Compute trading statistics from closed trade history: win rate, profit factor, avg win/loss, session breakdown, current streak.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly period: {
                readonly type: "string";
                readonly enum: readonly ["today", "7d", "30d", "all"];
                readonly description: "History window (default: 30d)";
            };
        };
        readonly required: readonly [];
    };
}, {
    readonly name: "get_economic_calendar";
    readonly description: "Get upcoming USD high/medium-impact economic events from MT5 calendar. Returns event name, time (UTC), impact level, forecast, and prev value.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly period: {
                readonly type: "string";
                readonly enum: readonly ["today", "24h", "48h"];
                readonly description: "Time window: today (UTC day), 24h from now (default), 48h from now";
            };
            readonly high_only: {
                readonly type: "string";
                readonly enum: readonly ["true", "false"];
                readonly description: "Set true to return only HIGH-impact events (default: false = HIGH + MEDIUM)";
            };
        };
        readonly required: readonly [];
    };
}, {
    readonly name: "set_alert";
    readonly description: "Set a price alert on XAUUSD. Auto-detects direction (above/below) from current price if not specified. EA fires Print alert when triggered, then removes it.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly price: {
                readonly type: "number";
                readonly description: "Price level to alert at";
            };
            readonly label: {
                readonly type: "string";
                readonly description: "Short label for this alert (e.g. 'OB top', 'Asian high')";
            };
            readonly direction: {
                readonly type: "string";
                readonly enum: readonly ["above", "below"];
                readonly description: "Fire when price goes above or below (auto-detected if omitted)";
            };
        };
        readonly required: readonly ["price"];
    };
}, {
    readonly name: "list_alerts";
    readonly description: "List all active price alerts currently registered in the EA.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {};
    };
}, {
    readonly name: "delete_alert";
    readonly description: "Delete a price alert by ID. Get IDs from list_alerts.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly id: {
                readonly type: "number";
                readonly description: "Alert ID to delete";
            };
        };
        readonly required: readonly ["id"];
    };
}, {
    readonly name: "detect_structure";
    readonly description: "Detect BoS (Break of Structure) and CHoCH (Change of Character) events. Returns trend direction and list of structure events with price/time.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly timeframe: {
                readonly type: "string";
                readonly description: "Timeframe: M1, M5, M15, H1, H4, D1";
            };
            readonly swing_count: {
                readonly type: "number";
                readonly description: "Number of swings to analyze (default 20)";
            };
        };
        readonly required: readonly ["timeframe"];
    };
}, {
    readonly name: "detect_fvg";
    readonly description: "Detect Fair Value Gaps (imbalance zones) from 3-candle patterns. Returns bullish/bearish FVGs with mitigated/unmitigated status.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly timeframe: {
                readonly type: "string";
                readonly description: "Timeframe: M1, M5, M15, H1, H4, D1";
            };
            readonly count: {
                readonly type: "number";
                readonly description: "Number of candles to scan (default 100)";
            };
        };
        readonly required: readonly ["timeframe"];
    };
}, {
    readonly name: "detect_order_blocks";
    readonly description: "Detect Order Blocks — last opposing candle before each BoS/CHoCH event. Returns OB zones with mitigation status.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly timeframe: {
                readonly type: "string";
                readonly description: "Timeframe: M1, M5, M15, H1, H4, D1";
            };
            readonly count: {
                readonly type: "number";
                readonly description: "Number of candles to scan (default 100)";
            };
        };
        readonly required: readonly ["timeframe"];
    };
}, {
    readonly name: "get_premium_discount";
    readonly description: "Calculate premium/discount zones, equilibrium, and OTE (61.8%-78.6% retracement) from the swing range. Returns current zone classification.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly timeframe: {
                readonly type: "string";
                readonly description: "Timeframe for swing range: M15, H1, H4, D1";
            };
        };
        readonly required: readonly ["timeframe"];
    };
}, {
    readonly name: "detect_liquidity_sweeps";
    readonly description: "Detect BSL (buy-side) and SSL (sell-side) liquidity sweeps — wicks exceeding swing levels that close back inside.";
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly timeframe: {
                readonly type: "string";
                readonly description: "Timeframe: M1, M5, M15, H1, H4, D1";
            };
            readonly count: {
                readonly type: "number";
                readonly description: "Number of candles to scan (default 100)";
            };
        };
        readonly required: readonly ["timeframe"];
    };
}];
export declare function compactOutput(toolName: string, raw: string): string;
export {};
