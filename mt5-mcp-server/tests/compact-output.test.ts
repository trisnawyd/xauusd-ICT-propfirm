import { describe, it, expect } from "vitest";
import { compactOutput } from "../server.js";

const json = (o: unknown) => JSON.stringify(o);

describe("compactOutput: alert tools", () => {
  describe("set_alert", () => {
    it("formats a valid response with 2-decimal price", () => {
      const raw = json({
        id: 1,
        price: 2500.5,
        label: "OB top",
        direction: "above",
        active_count: 1,
      });
      expect(compactOutput("set_alert", raw)).toBe(
        'ALERT #1 set: "OB top" @ 2500.50 (above) | active:1',
      );
    });

    it("preserves trailing zeros even when JSON.parse strips them", () => {
      const raw = json({
        id: 2,
        price: 2500,
        label: "round",
        direction: "above",
        active_count: 2,
      });
      expect(compactOutput("set_alert", raw)).toBe(
        'ALERT #2 set: "round" @ 2500.00 (above) | active:2',
      );
    });

    it("returns ERROR on error field", () => {
      expect(compactOutput("set_alert", json({ error: "price required" }))).toBe(
        "ERROR: price required",
      );
    });
  });

  describe("list_alerts", () => {
    it("returns empty-state message when count is 0", () => {
      expect(
        compactOutput("list_alerts", json({ count: 0, alerts: [] })),
      ).toBe("no active alerts");
    });

    it("formats populated list with 2-decimal prices", () => {
      const raw = json({
        count: 2,
        alerts: [
          { id: 1, price: 2500.5, label: "OB top", direction: "above" },
          { id: 2, price: 2450, label: "OB bot", direction: "below" },
        ],
      });
      expect(compactOutput("list_alerts", raw)).toBe(
        [
          "2 active alert(s):",
          '#1 2500.50 [above] "OB top"',
          '#2 2450.00 [below] "OB bot"',
        ].join("\n"),
      );
    });

    it("guards against missing alerts array", () => {
      expect(compactOutput("list_alerts", json({ count: 1 }))).toBe(
        "no active alerts",
      );
    });
  });

  describe("delete_alert", () => {
    it("formats successful deletion with 2-decimal price", () => {
      const raw = json({ id: 3, deleted: true, label: "x", price: 2500.5 });
      expect(compactOutput("delete_alert", raw)).toBe(
        'ALERT #3 deleted: "x" @ 2500.50',
      );
    });

    it("returns ERROR on not-found", () => {
      expect(
        compactOutput("delete_alert", json({ error: "alert id 99 not found" })),
      ).toBe("ERROR: alert id 99 not found");
    });
  });
});

describe("compactOutput: data query tools", () => {
  it("get_current_tick: single-line format", () => {
    const raw = json({ symbol: "XAUUSD", bid: 2500.5, ask: 2500.7, spread: 2 });
    expect(compactOutput("get_current_tick", raw)).toBe(
      "XAUUSD bid:2500.5 ask:2500.7 spd:2",
    );
  });

  it("get_account_info: single-line format", () => {
    const raw = json({
      balance: 10000,
      equity: 10050,
      margin: 100,
      free_margin: 9950,
    });
    expect(compactOutput("get_account_info", raw)).toBe(
      "bal:10000 eq:10050 margin:100 free:9950",
    );
  });

  it("get_spread_history: stats line", () => {
    const raw = json({ avg: 1.2, max: 2.5, min: 0.5, count: 20 });
    expect(compactOutput("get_spread_history", raw)).toBe(
      "spread avg:1.2 max:2.5 min:0.5 n:20",
    );
  });

  it("calculate_lot_size: single-line format", () => {
    const raw = json({
      recommended_lot: 0.01,
      risk_dollars: 10,
      pip_value: 0.1,
    });
    expect(compactOutput("calculate_lot_size", raw)).toBe(
      "lot:0.01 risk:$10 pip_val:0.1",
    );
  });

  it("get_daily_drawdown: single-line format", () => {
    const raw = json({ closed_pnl: -5, floating_pnl: 2, total_pnl: -3 });
    expect(compactOutput("get_daily_drawdown", raw)).toBe(
      "closed:-5 float:2 total:-3",
    );
  });

  describe("get_session_levels", () => {
    it("pipe-delimited with HH:MM time", () => {
      const raw = json({
        active_session: "LONDON",
        time_utc: "2026.04.13 16:14:00",
        asian: { high: 2501, low: 2490, open: 2495 },
        london: { high: 2510, low: 2498, open: 2500 },
        new_york: { high: 0, low: 0, open: 0 },
      });
      expect(compactOutput("get_session_levels", raw)).toBe(
        [
          "SES:LONDON|UTC:16:14",
          "A:H2501,L2490,O2495",
          "L:H2510,L2498,O2500",
          "NY:H0,L0,O0",
        ].join("\n"),
      );
    });
  });

  describe("get_ohlcv", () => {
    it("single-day mode: time formatted HH:MM", () => {
      const raw = json({
        symbol: "XAUUSD",
        timeframe: "M5",
        candles: [
          { time: "2026.04.13 10:00:00", open: 2500, high: 2505, low: 2499, close: 2504 },
          { time: "2026.04.13 10:05:00", open: 2504, high: 2506, low: 2503, close: 2505 },
        ],
      });
      expect(compactOutput("get_ohlcv", raw)).toBe(
        [
          "XAUUSD M5",
          "t,o,h,l,c",
          "10:00,2500,2505,2499,2504",
          "10:05,2504,2506,2503,2505",
        ].join("\n"),
      );
    });

    it("multi-day mode: time formatted MM/DD HH:MM", () => {
      const raw = json({
        symbol: "XAUUSD",
        timeframe: "H1",
        candles: [
          { time: "2026.04.12 23:00:00", open: 2500, high: 2502, low: 2499, close: 2501 },
          { time: "2026.04.13 00:00:00", open: 2501, high: 2503, low: 2500, close: 2502 },
        ],
      });
      expect(compactOutput("get_ohlcv", raw)).toBe(
        [
          "XAUUSD H1",
          "t,o,h,l,c",
          "04/12 23:00,2500,2502,2499,2501",
          "04/13 00:00,2501,2503,2500,2502",
        ].join("\n"),
      );
    });
  });

  describe("get_swing_levels", () => {
    it("formats H/L prefixed swings (single-day)", () => {
      const raw = json({
        timeframe: "M15",
        swings: [
          { type: "high", price: 2510, time: "2026.04.13 09:00:00" },
          { type: "low", price: 2495, time: "2026.04.13 10:30:00" },
        ],
      });
      expect(compactOutput("get_swing_levels", raw)).toBe(
        ["M15 swings", "09:00 H2510", "10:30 L2495"].join("\n"),
      );
    });
  });

  describe("get_open_positions", () => {
    it("no positions", () => {
      expect(compactOutput("get_open_positions", json([]))).toBe(
        "no open positions",
      );
      expect(
        compactOutput("get_open_positions", json({ positions: [] })),
      ).toBe("no open positions");
    });

    it("formats each position (bare array)", () => {
      const raw = json([
        {
          ticket: 111,
          type: "BUY",
          symbol: "XAUUSD",
          open_price: 2500,
          volume: 0.01,
          sl: 2490,
          tp: 2520,
          profit: 5,
        },
      ]);
      expect(compactOutput("get_open_positions", raw)).toBe(
        "#111 BUY XAUUSD @2500 lot:0.01 sl:2490 tp:2520 pnl:5",
      );
    });

    it("formats each position (wrapped shape)", () => {
      const raw = json({
        positions: [
          {
            ticket: 222,
            type: "SELL",
            symbol: "XAUUSD",
            open_price: 2510,
            volume: 0.01,
            sl: 2520,
            tp: 2490,
            profit: -3,
          },
        ],
      });
      expect(compactOutput("get_open_positions", raw)).toBe(
        "#222 SELL XAUUSD @2510 lot:0.01 sl:2520 tp:2490 pnl:-3",
      );
    });
  });

  describe("get_pending_orders", () => {
    it("no orders (bare array and wrapped)", () => {
      expect(compactOutput("get_pending_orders", json([]))).toBe(
        "no pending orders",
      );
      expect(compactOutput("get_pending_orders", json({ orders: [] }))).toBe(
        "no pending orders",
      );
    });

    it("formats pending orders", () => {
      const raw = json([
        {
          ticket: 333,
          type: "BUY_LIMIT",
          price: 2495,
          volume: 0.01,
          sl: 2485,
          tp: 2515,
        },
      ]);
      expect(compactOutput("get_pending_orders", raw)).toBe(
        "#333 BUY_LIMIT @2495 lot:0.01 sl:2485 tp:2515",
      );
    });
  });

  describe("get_trade_history", () => {
    it("no trades", () => {
      expect(compactOutput("get_trade_history", json([]))).toBe("no trades");
      expect(compactOutput("get_trade_history", json({ trades: [] }))).toBe(
        "no trades",
      );
    });

    it("formats CSV header + rows", () => {
      const raw = json({
        trades: [
          {
            ticket: 1,
            type: "BUY",
            open_price: 2500,
            close_price: 2510,
            profit: 10,
            net_profit: 9,
            duration_minutes: 30,
          },
          {
            ticket: 2,
            type: "SELL",
            open_price: 2510,
            close_price: 2505,
            profit: 5,
            net_profit: 4,
            duration_minutes: 15,
          },
        ],
      });
      expect(compactOutput("get_trade_history", raw)).toBe(
        [
          "ticket,type,open,close,pnl,net,dur",
          "1,BUY,2500,2510,10,9,30",
          "2,SELL,2510,2505,5,4,15",
        ].join("\n"),
      );
    });
  });

  describe("get_economic_calendar", () => {
    it("error case", () => {
      expect(
        compactOutput(
          "get_economic_calendar",
          json({ error: "calendar unavailable" }),
        ),
      ).toBe("ERROR: calendar unavailable");
    });

    it("no events", () => {
      expect(
        compactOutput(
          "get_economic_calendar",
          json({ count: 0, period: "24h" }),
        ),
      ).toBe("no USD high/medium events in next 24h");
    });

    it("formats event rows", () => {
      const raw = json({
        count: 1,
        period: "24h",
        events: [
          {
            time: "2026.04.13 13:30:00",
            impact: "HIGH",
            event: "CPI m/m",
            forecast: "0.3%",
            prev: "0.2%",
          },
        ],
      });
      expect(compactOutput("get_economic_calendar", raw)).toBe(
        ["USD events (24h): 1", "13:30 [HIGH] CPI m/m | fcst:0.3% prev:0.2%"].join(
          "\n",
        ),
      );
    });
  });
});

describe("compactOutput: fallthrough cases", () => {
  it("unknown tool returns raw JSON string", () => {
    const raw = json({ foo: "bar" });
    expect(compactOutput("unknown_tool", raw)).toBe(raw);
  });

  it("malformed JSON returns raw string", () => {
    expect(compactOutput("get_current_tick", "not-json")).toBe("not-json");
  });
});
