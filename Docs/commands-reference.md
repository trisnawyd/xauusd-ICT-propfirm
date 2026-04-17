# Command Reference — Full Definitions

> This file is read by Claude when a command is invoked.
> Compact index lives in CLAUDE.md. Do not duplicate changes.

---

## Analysis Commands

### `analyze HTF via image` (aliases: `update htf`)
Analyze D1/4H/1H from chart **screenshots**. Use when you want visual confirmation.
1. User provides D1, 4H, 1H chart screenshots
2. Extract: trend, BoS/CHoCH, OBs, FVGs, key levels, session highs/lows
3. **AUTO-SAVE:**
   - Overwrite `Context/htf-context.md`
   - Save snapshot to `Analysis/HTF/YYYYMMDD.md`
4. Reply: **HTF Updated —** followed by a 2-sentence bias summary

---

### `analyze HTF via mcp` (aliases: `htf analysis`)
Analyze D1/4H/1H using **live MT5 data**. Use at session start for quick bias update.
1. Call MCP tools (all in parallel — 8 calls):
   - `detect_structure` { timeframe: "D1", swing_count: 30 }
   - `detect_structure` { timeframe: "H4", swing_count: 20 }
   - `detect_structure` { timeframe: "H1", swing_count: 20 }
   - `detect_fvg` { timeframe: "H4", count: 100 }
   - `detect_fvg` { timeframe: "H1", count: 100 }
   - `get_premium_discount` { timeframe: "H4" }
   - `get_session_levels`, `get_current_tick`, `get_account_info`
2. Analyze: D1 trend → H4 structure + FVGs → H1 entry zones → determine bias (BULLISH/BEARISH/UNCLEAR)
3. **AUTO-SAVE:**
   - Overwrite `Context/htf-context.md`
   - Save snapshot to `Analysis/HTF/YYYYMMDD.md`
4. Reply: **HTF Updated —** followed by bias direction, key levels, and unmitigated OB/FVG zones

---

### `analyze LTF via image` (aliases: `analyze`)
Analyze M15/M5/M1 from chart **screenshots**. Use for visual entry confirmation.
1. User provides M15, M5, M1 chart screenshots
2. Read `Context/htf-context.md` for HTF bias
3. Extract: BoS/CHoCH, OBs, FVGs, swings, entry triggers
4. Output trade plan using standard template
5. **AUTO-SAVE:**
   - Save to `Analysis/LTF/YYYYMMDD/YYYYMMDD_HHMM_[long|short|wait].md`
   - Update `Context/ltf-memory.md` (keep last 3 summaries)

---

### `analyze LTF via mcp` (aliases: `analyze via mcp`, `ltf analysis`)
Analyze M15/M5/M1 using **live MT5 data**. Use for fast trade decisions mid-session.
1. Call MCP tools (all in parallel — 10 calls):
   - `detect_structure` { timeframe: "M15", swing_count: 20 }
   - `detect_structure` { timeframe: "M5", swing_count: 20 }
   - `detect_fvg` { timeframe: "M5", count: 100 }
   - `detect_fvg` { timeframe: "M1", count: 50 }
   - `detect_order_blocks` { timeframe: "M5", count: 100 }
   - `detect_liquidity_sweeps` { timeframe: "M15", count: 100 }
   - `detect_liquidity_sweeps` { timeframe: "M5", count: 100 }
   - `get_premium_discount` { timeframe: "M15" }
   - `get_session_levels`, `get_current_tick`, `get_account_info`
2. Read `Context/htf-context.md` for HTF bias
3. Follow the Analysis Order decision tree (Gates 1–4)
4. Output trade plan using Output Template (LONG/SHORT or WAIT)
5. **AUTO-SAVE** (see File Saving Rules)

---

### `scalp setup` (aliases: `scalp`, `find scalp`, `scalp via mcp`)
Fast M1/M5 entry scan aligned to HTF bias. Use when price is near a key level and a quick in-and-out opportunity is forming. Shorter SL, tighter TP, same grade minimum.

**Key differences vs `analyze LTF via mcp`:**
- Timeframe stack shifted down: M5 (structure) → M1 (entry zone + trigger)
- Entry zone: M1 OB or M1 FVG is sufficient — does NOT require M5 OB/FVG
- Premium/Discount evaluated on **M5** (not M15)
- Target: nearest M1/M5 FVG or swing level (not full HTF swing)
- SL: above/below most recent M1 swing high/low
- Shows **TP1** (primary scalp target) and optional **TP2** (extension)
- **AUTO-SAVE** to `Analysis/Scalp/YYYYMMDD/` (separate from LTF folder)

1. Call MCP tools (all in parallel — 9 calls):
   - `detect_structure` { timeframe: "M5", swing_count: 10 }
   - `detect_structure` { timeframe: "M1", swing_count: 20 }
   - `detect_fvg` { timeframe: "M1", count: 50 }
   - `detect_fvg` { timeframe: "M5", count: 50 }
   - `detect_order_blocks` { timeframe: "M1", count: 50 }
   - `detect_liquidity_sweeps` { timeframe: "M5", count: 50 }
   - `get_premium_discount` { timeframe: "M5" }
   - `get_session_levels`, `get_current_tick`
2. Read `Context/htf-context.md` for HTF bias
3. Follow the **Scalp Analysis Gates** below
4. Output using **Scalp Output Template** (see CLAUDE.md)
5. **AUTO-SAVE** to `Analysis/Scalp/YYYYMMDD/YYYYMMDD_HHMM_[long|short|wait].md`
   - Do NOT update `Context/ltf-memory.md` for scalp analyses

#### Scalp Analysis Gates

**GATE 1 — HTF Context** (identical to LTF Gate 1)
- Read `Context/htf-context.md` — block only if stale (>24h) or missing/empty
- Extract D1/H4/H1 directions; note counter-trend signal if TFs disagree

**GATE 2 — M5 Direction Determination**
- Call `detect_structure` M5; read LAST EVENT LINE first
- Proposed direction: BoS/CHoCH UP → LONG; DOWN → SHORT
- Tag: WITH D1 TREND or COUNTER-TREND vs D1
- WAIT only if M5 has no clear structure (alternating micro-swings, no directional momentum)
- M5 opposing D1 is NOT a block — Gate 3 P/D validates zone quality

**GATE 3 — M1 Entry Zone**
- Valid entry zone = any of: unmitigated M1 OB, M1 FVG, or M5 FVG within 15 pips of current price
- If no valid zone near price → WAIT "no M1/M5 entry zone within 15 pips"
- P/D check on **M5** — same counter-trend rule as LTF Gate 3:
  - WITH D1 TREND LONG: M5 must be DISCOUNT → if PREMIUM, WAIT
  - COUNTER-TREND LONG: must be at H4 demand zone (from htf-context.md) → if not, WAIT
  - WITH D1 TREND SHORT: M5 must be PREMIUM → if DISCOUNT, WAIT
  - COUNTER-TREND SHORT: must be at H4 supply zone (from htf-context.md) → if not, WAIT

**GATE 4 — M1 Trigger** (identical to LTF Gate 4)
- Bearish/bullish engulf, pin bar, or displacement candle at the OB/FVG
- If no trigger → WAIT with watch levels

**GATE 5 — Score** (identical rubric, same B+ minimum of 70)
- Score using standard 7-category rubric
- If grade < B+ → output WAIT with grade breakdown

---

## Trade Execution Commands

### `execute trade` (aliases: `place order`, `open trade`)
Place a market order on XAUUSD. **Requires explicit user confirmation.**
1. Pre-flight checks (all in parallel):
   - `get_current_tick` — verify spread < 1.5 pips
   - `get_account_info` — get equity, calculate max risk (10%)
   - `get_daily_drawdown` — verify daily loss < 20% (server.ts also hard-blocks this automatically)
2. Validate:
   - Lot = 0.01 (never exceed)
   - SL dollar value ≤ max risk
   - R:R ≥ 1:2
   - Spread < 1.5 pips
3. Display confirmation prompt:
   ```
   ⚠️ TRADE CONFIRMATION
   Direction: [BUY/SELL]
   Entry: [price] | SL: [price] | TP: [price]
   Risk: $[X] of $[max] | R:R: [ratio]
   Spread: [X] pips | Lot: 0.01
   Type CONFIRM to execute.
   ```
4. Wait for user to type **CONFIRM** — do NOT proceed without it
5. Call `place_order { type, volume: 0.01, sl, tp }`
6. server.ts auto-appends equity/margin after execution (no manual sync needed)
7. Save trade entry to `Context/ltf-memory.md`

---

### `place pending order` (aliases: `set limit`, `set stop`)
Place a pending order (limit or stop) on XAUUSD. **Requires explicit user confirmation.**
1. Pre-flight checks: same as `execute trade` (spread, risk, drawdown)
2. Validate: lot = 0.01, SL/TP set, entry price specified, R:R ≥ 1:2
3. Extract invalidation level from the trade plan's "Invalidation:" field — use as `invalidation_price`
4. Display confirmation prompt:
   ```
   ⚠️ PENDING ORDER CONFIRMATION
   Type: [BUY_LIMIT / SELL_LIMIT / BUY_STOP / SELL_STOP]
   Entry: [price] | SL: [price] | TP: [price]
   Risk: $[X] of $[max] | R:R: [ratio]
   Lot: 0.01
   Invalidation: [price] (EA will auto-cancel if breached)
   Type CONFIRM to place.
   ```
5. Wait for user **CONFIRM**
6. Call `place_pending_order { type, price, volume: 0.01, sl, tp, invalidation_price }`
7. Report ticket number and confirm invalidation level registered

**Order types:**
- **BUY_LIMIT** — buy at a lower price (e.g., price pulls back to OB)
- **SELL_LIMIT** — sell at a higher price (e.g., price retraces to FVG)
- **BUY_STOP** — buy on breakout above a level
- **SELL_STOP** — sell on breakdown below a level

---

### `delete pending order` (aliases: `cancel order`)
Delete a pending order by ticket.
1. Show pending order details
2. Wait for user **CONFIRM**
3. Call `delete_pending_order { ticket }`

---

### `close trade` (aliases: `close position`)
Close an open position or all positions.
1. Call `get_open_positions` — show current positions
2. Display confirmation: position details, current P&L
3. Wait for user **CONFIRM**
4. Call `close_position { ticket }` or `close_position { close_all: "true" }`
5. Auto-run `sync account` + `log trade`

**Quick shortcut — `close all`:**
Skip position listing. Go straight to confirmation:
```
⚠️ CLOSE ALL — [N] position(s) | Total P&L: $[X]
Type CONFIRM to close all.
```
Then call `close_position { close_all: "true" }` → auto-sync + log trade.

---

### `modify SL/TP` (aliases: `modify position`)
Change SL and/or TP on an open position.
1. Call `get_open_positions` — show current values
2. Display old vs new SL/TP comparison
3. Validate new SL doesn't increase risk beyond max
4. Wait for user **CONFIRM**
5. Call `modify_position { ticket, sl, tp }`
6. Auto-run `sync account`

---

### `trail [ticket] [pips]` (aliases: `trailing stop`)
Move SL to trail N pips behind current price. Only improves SL (never worsens).
1. Call `get_open_positions` — show current position and SL
   - **If ticket omitted and only 1 position open** → use that ticket automatically
   - **If ticket omitted and multiple positions** → ask user which ticket
2. Call `trailing_stop { ticket, trail_pips: N }`
3. Report: new SL vs old SL, or "no change" if trail would worsen SL

---

### `move SL to BE [ticket]` (aliases: `breakeven`, `be`)
Move SL to break-even (open price + 1 pip buffer).
1. Call `get_open_positions` — show current position
   - **If ticket omitted and only 1 position open** → use that ticket automatically
   - **If ticket omitted and multiple positions** → ask user which ticket
2. Call `move_to_breakeven { ticket }` (optionally `buffer_pips: N`)
3. Report: new SL or "already at BE"

---

## Trade Management Commands

### `log trade`
After every closed trade:
1. Append to `Trade Log/YYYYMMDD.md`:
   - Entry, exit, pips, gross P&L, commission ($0.11), net P&L, win/loss, time (UTC)
   - Update session summary at top (total trades, wins, equity after)
2. Automatically run `sync account` to update `Context/account.md`
3. **AUTO-JOURNAL:** Append a review block to `Daily Journal/YYYYMMDD.md` (create file if it doesn't exist):
   ```
   ## Trade [N] Review — HH:MM UTC ([WIN/LOSS])
   - **Setup:** [OB/FVG/Sweep/other] at [price zone]
   - **Entry:** [price] | **Exit:** [price] | **Result:** +/-$X ([pips] pips)
   - **R:R planned:** [X]:1 | **R:R achieved:** [actual ratio]
   - **LTF Analysis:** [[Analysis/LTF/YYYYMMDD/YYYYMMDD_HHMM_direction]] ← link if file exists
   - **Setup Grade:** [A+/A/B+] ([score]/100) ← from linked LTF analysis frontmatter, or "N/A" if no grade
   - **What worked:** [1 sentence — confluence, entry timing, etc.]
   - **What didn't:** [1 sentence or "N/A"]
   - **Lesson:** [1 sentence]
   ```
   - R:R achieved: TP hit → same as planned. SL hit → 0. Manual close → |exit−entry| / |SL−entry|
   - Scan `Analysis/LTF/YYYYMMDD/` for a file whose HHMM is within 30 min of trade open time — link it if found

---

### `sync account` (aliases: `update account`)
Sync live account data from MT5 bridge and update context file.
1. Call `get_account_info` from MCP
2. Call `get_open_positions` from MCP
3. Update `Context/account.md` with new equity, margin, open positions
4. Recalculate max risk (10% of new equity)
5. Reply: **Account synced — Equity: $X | Max Risk: $Y | Open: N position(s)**

---

### `sync trade log` (aliases: `sync log`)
Pull today's closed trade history from MT5 and update the trade log file.
1. Call `get_trade_history { period: "today" }` from MCP
2. Compare with existing `Trade Log/YYYYMMDD.md`
3. Add any missing trades; correct P&L if different
4. Update session summary
5. Run `sync account` after

---

### `performance` (aliases: `stats`, `performance stats`)
Show trading statistics from closed trade history.
1. Call `get_performance_stats { period: "30d" }` (user can specify: today, 7d, 30d, all)
2. Output formatted stats report:
   ```
   ============================================
     PERFORMANCE STATS — [PERIOD]
   ============================================
   Trades:      [N] total | [W] wins | [L] losses
   Win Rate:    [X]%
   Profit Factor: [X] (gross_win / gross_loss; >1.5 = good, >2.0 = excellent)
   Net P&L:     $[X]
   Avg Win:     $[X] | Avg Loss: -$[X]
   Avg Duration: [X] min

   Current Streak: [N] [WIN/LOSS] in a row

   Session Breakdown:
     Asian:    [W]W/[L]L | $[pnl]
     London:   [W]W/[L]L | $[pnl]
     Overlap:  [W]W/[L]L | $[pnl]
     New York: [W]W/[L]L | $[pnl]

   Grade Correlation:
     A+ setups: [N] trades | WR [X]% | Avg R:R [X]
     A  setups: [N] trades | WR [X]% | Avg R:R [X]
     B+ setups: [N] trades | WR [X]% | Avg R:R [X]
   ============================================
   ```
3. Flag if profit factor < 1.0 ("below breakeven — review setup criteria")
4. Flag if win rate < 40% ("low win rate — review entry triggers")
5. **Grade Correlation logic:** scan `Analysis/LTF/` files for `setup_grade` frontmatter, cross-reference with `Trade Log/` entries by matching timestamps (analysis HHMM within 30 min of trade open time), group win/loss by grade. If fewer than 5 graded trades exist, show "Insufficient data — need 5+ graded trades for correlation."
6. **AUTO-SAVE:** Save full report to `Stats/YYYYMMDD_[period]_review.md` (e.g. `Stats/20260412_7d_review.md`). Include frontmatter:
   ```
   ---
   date: YYYYMMDD
   period: [today/7d/30d/all] (YYYYMMDD–YYYYMMDD)
   source: MT5 get_performance_stats + Trade Log manual review
   equity_start: $X
   equity_end: $X
   net_growth_pct: [X]%
   ---
   ```
   Then full stats table, session breakdown, grade correlation, equity progression, key findings, and action items.

---

## Market Utility Commands

### `dashboard` (aliases: `dash`)
Full multi-timeframe live dashboard. All calls in parallel.
1. Call (in parallel — 7 calls):
   - `get_current_tick`
   - `get_session_levels`
   - `get_open_positions`
   - `get_pending_orders`
   - `get_account_info`
   - `get_daily_drawdown`
   - `detect_structure` { timeframe: "M15", swing_count: 10 }
2. Output using this template:
   ```
   ============================================
     DASHBOARD — [SESSION] [TIME UTC]
   ============================================
   Price:   [bid] / [ask] | Spread: [X] pips
   Session: [ASIAN/LONDON/NY/OVERLAP]
     Asia:   H[X]  L[X]
     London: H[X]  L[X]
     NY:     H[X]  L[X]

   M15 Structure: [trend] | last [BoS/CHoCH] [UP/DOWN] @ [price]

   Account:  $[equity] | Free: $[free_margin]
   Today:    $[total_pnl] ([closed_pnl] closed + [floating_pnl] float)

   Positions: [None / N open]
     [#ticket DIR @entry pnl:$X sl:X tp:X]
   Pending:   [None / N pending]
     [#ticket TYPE @price sl:X tp:X]
   ============================================
   ```
3. No file saved

---

### `market status` (aliases: `check market`)
Quick live snapshot of current market conditions.
1. Call (in parallel): `get_current_tick`, `get_session_levels`, `get_open_positions`, `get_account_info`, `get_economic_calendar { period: "24h", high_only: "true" }`
2. Output formatted summary: current price, spread, session, active positions, equity
3. If any HIGH-impact USD events in next 6h → append warning: "⚠️ NEWS: [event] @ [time UTC]"
4. No file saved

---

### `check spread`
Check current XAU/USD spread conditions before entering a trade.
1. Call `get_spread_history { count: 50 }`
2. Report: avg/max/min spread in pips, trend (widening or tightening)
3. Flag if avg spread > 1.5 pips (avoid entry during wide spread)

---

### `lot size [sl_pips]` (aliases: `calculate lot`)
Calculate recommended lot size for a given SL distance.
1. Call `calculate_lot_size { sl_pips: N }` (optionally `risk_pct: X`)
2. Report: recommended lot, actual risk in $, pip value
3. Automatically uses live equity from MCP

---

### `check drawdown`
Check today's P&L performance vs. account risk limits.
1. Call `get_daily_drawdown` from MCP
2. Report: closed P&L today, floating P&L, total P&L, equity
3. Flag if total drawdown exceeds 20% of equity (daily risk limit warning)

---

### `economic calendar` (aliases: `news`, `calendar`)
Show upcoming USD high/medium-impact economic events.
1. Call `get_economic_calendar { period: "24h" }` (user can specify: today, 24h, 48h)
2. Output formatted table:
   ```
   USD News — next [period]:
   [HH:MM] [HIGH/MEDIUM] [Event Name] | fcst:[X] prev:[X]
   ```
3. Flag any HIGH-impact event in the next 2h: "⚠️ HIGH-IMPACT NEWS IN [X]min — consider waiting"
4. No trade rule: if HIGH-impact event < 15 min away → output WAIT regardless of setup quality

---

## Alert Commands

### `set alert [price] [label]` (aliases: `alert [price]`)
Register a price alert in the EA. Fires a terminal Print when price reaches the level (auto-detected direction: above or below current price).
1. Call `set_alert { price, label, direction? }` — direction auto-detected if omitted
2. **AUTO-SAVE:** Append to `Context/alerts.md`:
   ```
   - [YYYY-MM-DD HH:MM UTC] #[id] [label] @ [price] ([above/below])
   ```
3. Report: alert ID, price, direction, total active alerts

**Examples:**
- `set alert 4800 Asian high` → fires when bid ≥ 4800
- `set alert 4700 OB top below` → fires when bid ≤ 4700

---

### `list alerts` (aliases: `alerts`)
Show all active price alerts currently registered in the EA.
1. Call `list_alerts` from MCP
2. Report: ID, price, direction, label for each alert
3. Cross-reference with `Context/alerts.md` to show any that survived an EA restart

---

### `delete alert [id]` (aliases: `cancel alert [id]`)
Remove a price alert by ID.
1. Call `delete_alert { id }` from MCP
2. Update `Context/alerts.md` — mark deleted alert with `~~strikethrough~~`
3. Report: deleted alert details

---

## Command: "setup"
Run a full system verification. Read all context files and output a formatted status report:

1. Read `Context/account.md` → report equity, max risk, open positions
2. Read `Context/htf-context.md` → report bias direction, last update timestamp, and key levels summary
3. Read `Context/ltf-memory.md` → report last analysis time, direction (LONG/SHORT/WAIT), and current watch level
4. Scan `Analysis/LTF/` → find the most recent LTF analysis file and report filename + direction
5. Scan `Trade Log/` → check if a log exists for today (YYYYMMDD.md); if yes, report trade count and session P&L; if no, report "No trades today"
6. Check Obsidian connection — confirm IDE is connected (Obsidian MCP)
7. Verify rules loaded — confirm CLAUDE.md has pip calc, hard rules, and playbooks present
8. Output using this exact template:

```
============================================
  SYSTEM SETUP CHECK — [DATE] [TIME UTC]
============================================

OBSIDIAN        [OK / NOT CONNECTED]
CLAUDE.md RULES [OK / MISSING: ...]

ACCOUNT
  Equity:       $[X]
  Max Risk:     $[Y] (10%)
  Open Trades:  [None / X position(s)]

HTF CONTEXT     [STALE if >24h / OK]
  Bias:         [BEARISH / BULLISH / UNCLEAR]
  Last Updated: [YYYY-MM-DD HH:MM UTC]
  Key Level:    [most important level to watch]

LTF MEMORY      [STALE if >4h / OK]
  Last Analysis:[YYYY-MM-DD HH:MM UTC]
  Direction:    [LONG / SHORT / WAIT]
  Watch Level:  [price]

TODAY'S TRADES  [No trades / X trades | Net P&L: $X]

PLAYBOOKS       [OK — 2 setups loaded / MISSING]

--------------------------------------------
STATUS: [READY TO TRADE / ACTION NEEDED]
--------------------------------------------
[If ACTION NEEDED, list what's missing or stale]
============================================
```

- Mark **STALE** if HTF context is older than 24h or LTF memory is older than 4h
- Mark **ACTION NEEDED** if any critical item (account, HTF bias, Obsidian) is missing or stale
- Mark **READY TO TRADE** only if all items are OK
