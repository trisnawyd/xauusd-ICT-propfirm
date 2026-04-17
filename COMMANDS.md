# XAU/USD Trading Model — Command Reference

Quick reference for all available commands. Full behavior details in `CLAUDE.md`.

---

## Analysis Commands

| Command | Aliases | Data Source | Auto-Save |
|---------|---------|-------------|-----------|
| `analyze HTF via image` | `update htf` | Chart screenshots (D1/4H/1H) | ✅ `Context/htf-context.md` + `Analysis/HTF/` |
| `analyze HTF via mcp` | `htf analysis` | Live MT5 bridge (D1/4H/1H) | ✅ `Context/htf-context.md` + `Analysis/HTF/` |
| `analyze LTF via image` | `analyze` | Chart screenshots (M15/M5/M1) | ✅ `Context/ltf-memory.md` + `Analysis/LTF/` |
| `analyze LTF via mcp` | `analyze via mcp`, `ltf analysis` | Live MT5 bridge (M15/M5/M1) | ✅ `Context/ltf-memory.md` + `Analysis/LTF/` |

---

## Trade Execution Commands

| Command | Aliases | What It Does |
|---------|---------|-------------|
| `execute trade` | `place order`, `open trade` | Market order. Pre-flight checks → confirmation → `place_order` → **auto-sync** |
| `place pending order` | `set limit`, `set stop` | Limit/stop at specified price → confirmation → `place_pending_order` (supports `invalidation_price`) |
| `delete pending order` | `cancel order` | Delete pending order by ticket → confirmation → `delete_pending_order` |
| `close trade` | `close position` | Show positions → confirmation → `close_position` → **auto-sync** + log trade |
| `close all` | — | Quick shortcut: skip listing, show total P&L → confirmation → close all XAUUSD positions |
| `modify SL/TP` | `modify position` | Show old vs new → validate risk → confirmation → `modify_position` → **auto-sync** |
| `trail [ticket] [pips]` | `trailing stop` | Trail SL N pips behind current price (only improves SL) → `trailing_stop` → **auto-sync**. Ticket optional if 1 position open. |
| `move SL to BE [ticket]` | `breakeven`, `be` | Move SL to open price + 1 pip buffer → `move_to_breakeven` → **auto-sync**. Ticket optional if 1 position open. |

> All execution commands require **explicit user CONFIRM** before sending to MT5.
> Triple-layer safety: Claude checks → server.ts checks → EA checks.
> **Auto-sync** = equity/free_margin/margin_level appended to response automatically (Phase 3A).
> **Daily loss limit** = server.ts hard-blocks all execution if drawdown > 20% of equity (Phase 3B).

---

## Trade Management Commands

| Command | What It Does |
|---------|-------------|
| `log trade` | Append closed trade to `Trade Log/YYYYMMDD.md`, auto-runs `sync account`, **auto-journals** to `Daily Journal/YYYYMMDD.md` |
| `sync account` | Pull live equity + positions from MT5, update `Context/account.md` |
| `sync trade log` | Pull today's trades from MT5, sync any missing entries in trade log |
| `performance` | Trading stats report: WR, profit factor, avg win/loss, session breakdown, current streak |

---

## Market Utility Commands (MCP Only)

| Command | MCP Tool Used | Output |
|---------|--------------|--------|
| `market status` | tick + session + positions + account | Quick live market snapshot |
| `check spread` | `get_spread_history` | Avg/max/min spread in pips; entry suitability |
| `lot size [sl_pips]` | `calculate_lot_size` | Recommended lot size, actual risk in $ |
| `check drawdown` | `get_daily_drawdown` | Today's closed + floating P&L vs. account |

---

## Alert Commands

| Command | Aliases | What It Does |
|---------|---------|-------------|
| `set alert [price] [label]` | `alert [price]` | Register price alert in EA; auto-detects above/below from current price; saves to `Context/alerts.md` |
| `list alerts` | `alerts` | Show all active alerts registered in the EA |
| `delete alert [id]` | `cancel alert [id]` | Remove alert by ID (get IDs from `list alerts`) |

---

## Market Utility Commands (continued)

| Command | MCP Tool Used | Output |
|---------|--------------|--------|
| `dashboard` | tick + session + positions + pending + account + drawdown + M15 structure (all parallel) | Full live dashboard with structure, P&L, positions |
| `economic calendar` | `get_economic_calendar` | Upcoming USD HIGH/MEDIUM events; warns if HIGH-impact < 2h |

> `market status` now also calls `get_economic_calendar` and flags HIGH-impact events in next 6h.

---

## System Commands

| Command | What It Does |
|---------|-------------|
| `setup` | Full system check: account, HTF bias, LTF memory, today's trades, rules loaded |

---

## Recommended Daily Workflow

```
1. setup                    → verify system is ready
2. analyze HTF via mcp      → get D1/4H/1H bias (auto-saves to htf-context.md)
3. analyze LTF via mcp      → find M15/M5/M1 entry setup (auto-saves to Analysis/LTF/)
4. lot size [sl_pips]       → confirm position sizing from live equity
5. check spread             → validate spread is acceptable before entry
6. execute trade            → confirm and place order via MT5 bridge (auto-syncs after)
7. [optional] move SL to BE → once trade is in profit, lock in break-even
8. [optional] trail [pips]  → trail SL as price moves further in profit
9. close trade / close all  → after TP/SL or manual close; auto-syncs + logs + auto-journals
10. check drawdown          → end of session P&L review
11. [optional] performance  → weekly/monthly review of win rate, profit factor, session breakdown
12. [optional] economic calendar → check upcoming USD news before next session
```

---

## MT5 Bridge Tools (Used Internally by Commands)

### Market Data
| Tool | Purpose |
|------|---------|
| `get_current_tick` | Current XAU/USD bid/ask/spread |
| `get_ohlcv` | OHLCV candles for any timeframe (M1–D1) |
| `get_open_positions` | All currently open trades (active positions) |
| `get_pending_orders` | All pending orders (limit/stop) on XAUUSD |
| `get_account_info` | Balance, equity, margin, leverage |
| `get_trade_history` | Closed deals with P&L (today/7d/30d/all) |
| `get_session_levels` | Asia/London/NY session high, low, open (UTC) |
| `get_swing_levels` | Last N swing highs/lows on any timeframe |
| `get_spread_history` | Recent tick spread avg/max/min stats |
| `calculate_lot_size` | Lot size from SL pips + risk % + live equity |
| `get_daily_drawdown` | Today's closed + floating P&L since UTC midnight |

### Trade Execution
| Tool | Purpose |
|------|---------|
| `place_order` | Place BUY/SELL market order with SL/TP (max 0.01 lot) |
| `close_position` | Close position by ticket or close all XAUUSD positions |
| `modify_position` | Modify SL/TP on an open position |
| `place_pending_order` | Place limit/stop order; accepts optional `invalidation_price` for EA auto-cancel |
| `delete_pending_order` | Delete a pending order by ticket |
| `trailing_stop` | Trail SL by N pips from current price (BUY: below bid, SELL: above ask) |
| `move_to_breakeven` | Move SL to open price + buffer pips (default 1 pip) |

### Analysis (Phase 2 — computed in server.ts from EA data)
| Tool | Purpose |
|------|---------|
| `detect_structure` | BoS/CHoCH detection, trend direction from swing data |
| `detect_fvg` | Fair Value Gap detection with mitigation tracking |
| `detect_order_blocks` | Order block identification (last opposing candle before BoS) |
| `get_premium_discount` | Equilibrium, premium/discount zones, OTE (61.8%–78.6%) |
| `detect_liquidity_sweeps` | BSL/SSL sweep detection (wicks beyond swing levels) |
| `get_performance_stats` | Win rate, profit factor, session breakdown, streak from trade history (today/7d/30d/all) |
| `get_economic_calendar` | Upcoming USD HIGH/MEDIUM events from MT5 calendar (period: today/24h/48h) |

### Alerts (Phase 4C — EA memory, polled every 100ms)
| Tool | Purpose |
|------|---------|
| `set_alert` | Register price alert; auto-detects direction (above/below) from current bid |
| `list_alerts` | Return all active alerts in EA memory |
| `delete_alert` | Remove alert by ID |
