import { describe, it, expect } from "vitest";
import {
  TOOL_DEFINITIONS,
  EXECUTION_TOOLS,
  ANALYSIS_TOOLS,
  validateExecution,
} from "../server.js";

const IN_SCOPE_ALERT = ["set_alert", "list_alerts", "delete_alert"];
const IN_SCOPE_DATA = [
  "get_current_tick",
  "get_ohlcv",
  "get_open_positions",
  "get_pending_orders",
  "get_account_info",
  "get_trade_history",
  "get_session_levels",
  "get_swing_levels",
  "get_spread_history",
  "calculate_lot_size",
  "get_daily_drawdown",
  "get_economic_calendar",
];
const IN_SCOPE_ANALYSIS = [
  "detect_structure",
  "detect_fvg",
  "detect_order_blocks",
  "get_premium_discount",
  "detect_liquidity_sweeps",
  "get_performance_stats",
];
const IN_SCOPE = [...IN_SCOPE_ALERT, ...IN_SCOPE_DATA, ...IN_SCOPE_ANALYSIS];

const byName = new Map(
  TOOL_DEFINITIONS.map((t) => [t.name, t] as const),
);

describe("TOOL_DEFINITIONS: shape contract", () => {
  it("contains every in-scope tool", () => {
    for (const name of IN_SCOPE) {
      expect(byName.has(name), `missing tool: ${name}`).toBe(true);
    }
  });

  it.each(IN_SCOPE)("tool %s has name, description, object schema", (name) => {
    const tool = byName.get(name)!;
    expect(tool.name).toBe(name);
    expect(typeof tool.description).toBe("string");
    expect(tool.description.length).toBeGreaterThan(0);
    expect(tool.inputSchema.type).toBe("object");
    expect(typeof tool.inputSchema.properties).toBe("object");
  });
});

describe("TOOL_DEFINITIONS: required params for alert tools", () => {
  it("set_alert requires price only", () => {
    const t = byName.get("set_alert")!;
    expect((t.inputSchema as { required?: string[] }).required).toEqual([
      "price",
    ]);
  });

  it("delete_alert requires id only", () => {
    const t = byName.get("delete_alert")!;
    expect((t.inputSchema as { required?: string[] }).required).toEqual(["id"]);
  });

  it("list_alerts has no required params", () => {
    const t = byName.get("list_alerts")!;
    const req = (t.inputSchema as { required?: string[] }).required;
    expect(req === undefined || req.length === 0).toBe(true);
  });
});

describe("EXECUTION_TOOLS / ANALYSIS_TOOLS sets", () => {
  it("execution and analysis sets do not overlap", () => {
    for (const name of ANALYSIS_TOOLS) {
      expect(EXECUTION_TOOLS.has(name)).toBe(false);
    }
  });

  it("every in-scope analysis tool is in ANALYSIS_TOOLS", () => {
    for (const name of IN_SCOPE_ANALYSIS) {
      expect(ANALYSIS_TOOLS.has(name)).toBe(true);
    }
  });

  it("no in-scope tool is accidentally in EXECUTION_TOOLS", () => {
    for (const name of IN_SCOPE) {
      expect(EXECUTION_TOOLS.has(name)).toBe(false);
    }
  });
});

describe("validateExecution: non-execution tools pass through", () => {
  it("returns null for any in-scope (non-execution) tool", () => {
    for (const name of IN_SCOPE) {
      expect(validateExecution({ name, arguments: {} })).toBeNull();
    }
  });
});
