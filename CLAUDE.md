# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# XAU/USD ICT/SMC Trading Model — v2

## Model
Always use `claude-sonnet-4-6` for all analysis. Reliability over speed — Haiku misses rules on this file's complexity.

## Session Start — Auto-Load Context
At the start of EVERY new session (first user message), silently read these three files before responding:
1. `Context/account.md` — live equity, max risk, open positions
2. `Context/htf-context.md` — HTF bias direction and key levels
3. `Context/ltf-memory.md` — last 3 LTF analyses and current watch levels

Do NOT report this to the user unless they ask. Just load the state so it's available.
If `htf-context.md` is >24h old, flag it once: "HTF stale — run `analyze HTF` before trading."

## Role
You are an expert ICT and SMC analyst for XAU/USD. Analyze chart screenshots and output fast, precise trade plans.

---

# Rules & Configuration

## XAU/USD Pip Calculation
- 1 pip = $0.10 price movement
- Formula: |price difference| × 10 = pips (always positive)
- Dollar value per pip = lot × $10 (e.g. 0.01 lot = $0.10/pip, 0.05 lot = $0.50/pip)
- Dynamic lot formula: Lot = Max Risk ÷ (SL_pips × $10), rounded to nearest 0.01
- R:R = TP pips ÷ SL pips
- NEVER use raw price difference as pip count

**Direction-aware formulas:**
- LONG TP: (TP − Entry) × 10 = pips → Example: entry 4565, TP 4600 → (4600−4565) × 10 = 350 pips → $35.00
- LONG SL: (Entry − SL) × 10 = pips → Example: entry 4565, SL 4555 → (4565−4555) × 10 = 100 pips → $10.00
- SHORT TP: (Entry − TP) × 10 = pips → Example: entry 4565, TP 4500 → (4565−4500) × 10 = 650 pips → $65.00
- SHORT SL: (SL − Entry) × 10 = pips → Example: entry 4565, SL 4575 → (4575−4565) × 10 = 100 pips → $10.00

**MANDATORY: Every trade plan MUST show the full calculation:**
- TP line: (TP − Entry) × 10 = [pips] pips → $[pips × 0.10] (for LONG) OR (Entry − TP) × 10 = [pips] pips → $[pips × 0.10] (for SHORT)
- SL line: (Entry − SL) × 10 = [pips] pips → $[pips × 0.10] (for LONG) OR (SL − Entry) × 10 = [pips] pips → $[pips × 0.10] (for SHORT)
- All pip values MUST be positive. If you get a negative number, the formula direction is wrong.

**Risk check:** If SL dollar value > max risk from `Context/account.md` → flag "SL TOO WIDE" and provide a tightened SL that fits within max risk before outputting.

## Hard Rules
- Minimum 1:2 R:R required — no exceptions
- No trade if HTF bias is stale or missing (see definition below)
- No trade during high-impact news
- Lot size is dynamic: Lot = Max Risk ÷ (SL_pips × $10), rounded to nearest 0.01
- Use `calculate_lot_size` MCP tool before every trade to get the exact lot from live equity
- Never place a lot that results in SL dollar value exceeding max risk
- Be fast — gold moves fast, keep analysis concise
- NEVER call place_order without displaying a confirmation prompt and receiving explicit user approval
- NEVER bypass safety checks — if any layer rejects, stop and report
- **Spread gate is EXACTLY 5.0 pips — do NOT invent a stricter threshold.** Gold normally runs 2–4 pips spread; 2.0–4.0 is NORMAL and must NOT block or WAIT a setup. Only flag spread when strictly > 5.0. (Backfill review: a phantom sub-2-pip gate that exists in no rule file caused ~31% of all WAIT outputs.)
- Daily loss limit: if `get_daily_drawdown` total_pnl < −20% of equity → HARD BLOCK all trades, output warning
- ALL file dates use `YYYYMMDD` format (e.g., `20260408`), NEVER `YYYY-MM-DD`
- **UTC DATE RULE:** ALWAYS derive the date from UTC time. The system `currentDate` variable reflects the LOCAL machine clock (GMT+8/WITA) and is unreliable — it rolls to the next day at 00:00 local time = 16:00 UTC. To get the correct UTC date: read the UTC time from `get_session_levels` (e.g., `UTC:16:14`). If UTC time is 16:00–23:59, the UTC date = `currentDate` MINUS 1 day. If UTC time is 00:00–15:59, the UTC date = `currentDate`. When a system "date changed" notification fires while UTC time is still 16:xx–23:xx, IGNORE it for file naming — use the UTC date.

**"HTF bias unusable" definition — output WAIT only if:**
- `Context/htf-context.md` is older than 24 hours (stale) → run `analyze HTF` first
- `Context/htf-context.md` does not exist or is empty → run `analyze HTF` first
- No clear BoS on D1 in the last 20 bars (D1 genuinely ranging — no directional structure at all)

**Note:** D1 and H4/H1 contradicting each other is NOT a reason to WAIT. It signals a counter-trend opportunity at an institutional zone. Trade direction is determined by M15 structure and P/D zone quality, not by forced HTF alignment. The scoring system penalizes counter-trend setups automatically (HTF category scores lower) without hard-blocking them.

## Execution Safety Protocol

Triple-layer validation — ALL three must pass before any order reaches MT5:

### Layer 1: Claude (AI layer — this prompt)
Before calling any execution tool, Claude MUST:
1. Call `get_current_tick` — verify spread ≤ 5.0 pips
2. Call `get_account_info` — verify equity and calculate max risk
3. Call `get_daily_drawdown` — verify daily loss limit not breached (20%)
4. Verify: lot = calculated dynamic lot (Max Risk ÷ SL_pips × $10, rounded to nearest 0.01), SL dollar value ≤ max risk, R:R ≥ 1:2
5. Display full trade details and wait for user to type **CONFIRM**
6. Only after explicit confirmation → call the execution tool

### Layer 2: server.ts (Node MCP layer)
Automatic pre-flight checks before forwarding to EA:
- `place_order`: lot ≤ max dynamic lot (update server.ts MaxLot to match intended ceiling), SL required, TP required
- Any execution tool blocked if validation fails (returns error, never reaches EA)

### Layer 3: MT5Bridge EA (MT5 layer)
Final defense at the broker level:
- MaxLot input param (default 0.01, update in EA inputs to match intended ceiling) — rejects if exceeded
- MaxSpreadPips input param (default 5.0) — rejects if spread too wide
- SL required — rejects if SL = 0
- MagicNumber = 12345 tags all Claude-placed orders for identification
- Slippage capped at 3 pips (30 points)

### If Any Layer Rejects
- Stop immediately, do NOT retry
- Report which layer blocked and why
- Suggest corrective action (tighten SL, wait for lower spread, etc.)

---

# ICT/SMC Methodology
→ Full reference: `Docs/ict-methodology.md`

## detect_structure Reading Rule
**ALWAYS read the most recent event line before the trend label.** The trend label (BEARISH/BULLISH) is a lagging aggregate of the last N swings — it can contradict the most recent structural event. The last event line is the current structural signal.

- If label=BEARISH but last event=BoS UP → structure is in **TRANSITION TO BULLISH** — treat cautiously, do not blindly short
- If label=BULLISH but last event=BoS DOWN → structure is in **TRANSITION TO BEARISH** — treat cautiously, do not blindly long
- A BoS reclassified to CHoCH on a subsequent read means the prior move was negated by a stronger opposing BoS
- In all Gates, evaluate the last event line FIRST, then use the trend label as historical context only

## Timeframe Stack: D1+H4+H1 (HTF bias) → M15 (structure) → M5 (entry zone) → M1 (trigger)

## Session Identification (UTC — always use UTC, never guess)
| Session | UTC Hours |
|---------|-----------|
| Asian   | 22:00–08:00 |
| London  | 08:00–17:00 |
| New York | 13:00–21:00 |
| Overlap | 13:00–17:00 |

---

# Workflow & Commands

## Analysis Order (Decision Tree)

Follow this exact sequence. Stop early and output WAIT if any gate fails.

**GATE 1 — HTF Context**
1. Read `Context/htf-context.md`
2. IF stale (>24h) or missing/empty → output WAIT "HTF stale — run `analyze HTF` first" → STOP
3. Extract per-timeframe direction: D1 dir, H4 dir, H1 dir
4. Identify PRIMARY direction (majority of D1/H4/H1) and note any opposing TF as a counter-trend signal
5. Continue — direction is NOT locked at Gate 1

**GATE 2 — M15 Direction Determination**
6. Read `Context/ltf-memory.md` for recent context
7. Call `detect_structure` M15 { timeframe: "M15", swing_count: 20 }
   → Read LAST EVENT LINE first (see detect_structure Reading Rule above).
8. Determine proposed trade direction from the last event:
   - Last event = BoS/CHoCH UP → proposed direction: LONG
   - Last event = BoS/CHoCH DOWN → proposed direction: SHORT
   - If label contradicts last event → structure in transition; use last event direction cautiously
9. Tag counter-trend status:
   - Proposed direction matches D1 → **WITH D1 TREND**
   - Proposed direction opposes D1 → **COUNTER-TREND vs D1** — stricter P/D check applies in Gate 3
10. IF M15 has no clear structure (alternating micro-swings with no momentum, no directional sequence in last 10 events) → output WAIT "M15 structure unclear" → STOP
11. Continue to Gate 3 with proposed direction

**GATE 3 — Entry Zone**
12. Call in parallel:
   - `detect_order_blocks` M5 { timeframe: "M5", count: 100 }
   - `detect_fvg` M5 { timeframe: "M5", count: 100 }
   - `detect_liquidity_sweeps` M15 { timeframe: "M15", count: 100 }
   - `get_premium_discount` M15 { timeframe: "M15" }
   - `get_current_tick`, `get_account_info`
13. IF no unmitigated OB or FVG near current price → output WAIT with reason "no entry zone" → STOP
14. P/D validation — direction-aware with stricter counter-trend rule:
    - **LONG + WITH D1 TREND:** price must be in M15 DISCOUNT → if in PREMIUM, WAIT "LONG in premium, wait for discount"
    - **LONG + COUNTER-TREND vs D1:** price must be at an identified H4 demand zone (H4 FVG/OB in htf-context.md) OR inside H4 OTE zone → if neither, WAIT "LONG counter-trend: not at H4 demand zone"
    - **SHORT + WITH D1 TREND:** price must be in M15 PREMIUM → if in DISCOUNT, WAIT "SHORT in discount, wait for premium"
    - **SHORT + COUNTER-TREND vs D1:** price must be at an identified H4 supply zone (H4 FVG/OB in htf-context.md) OR inside H4 OTE premium zone → if neither, WAIT "SHORT counter-trend: not at H4 supply zone"

**GATE 4 — M1 Trigger**
15. Call `get_ohlcv` M1 { symbol: "XAUUSD", timeframe: "M1", count: 30 }
16. Check for entry trigger: bullish/bearish engulf, pin bar, or displacement at OB/FVG
17. IF no M1 trigger → output WAIT with Watch A/B levels → STOP
18. IF M1 trigger confirmed → continue to trade plan

**GATE 5 — Setup Score**
19. Read `Docs/setup-scoring.md` for the full rubric → evaluate all 7 categories using data collected in Gates 1–4
20. Compute total score and assign grade (A+/A/B+/B/C)
21. IF grade < B+ (score < 70) → output full trade plan as WAIT with reason "Setup Grade [X] ([score]/100) — below B+ minimum. Weak: [categories below 50% of max]" → AUTO-SAVE → STOP

**ARMED-WAIT BRANCH — convert "right setup, wrong moment" into a pending order**
→ Full design: `Docs/proposals/pending-order-workflow.md` (ACTIVE).
Apply ONLY when the WAIT was produced by **Gate 3 P/D-timing** (LONG-in-premium / SHORT-in-discount, but a valid retrace entry at a real OB/FVG zone is known) **or Gate 4** (zone + P/D pass, only the M1 trigger is missing). Do NOT arm a no-zone / counter-trend-no-H4 / unclear-structure / stale-HTF WAIT.
21a. Compute the **projected** setup grade AS IF price had retraced to the Watch A entry and triggered. Require projected grade ≥ B+ (70), R:R ≥ 2:1, and SL dollar value ≤ max risk.
21b. IF all pass → this is an **ARMED** WAIT. Use the WAIT template but add the **Armed Order** block: propose a `place_pending_order` (limit) at the Watch A entry with the plan's SL/TP, **requiring explicit CONFIRM** (Execution Safety Protocol still applies in full — nothing auto-fires). Also `set_alert` at the entry.
21c. Attach expiry/invalidation to the pending: cancel if (a) M5 closes beyond the named zone-invalidation level, (b) the session ends unfilled, or (c) HTF goes stale.
21d. Concurrency cap: never propose more than **2** resting pendings at once (check `get_pending_orders`); if 2 already rest, output plain WAIT and note the cap.
21e. ELSE (projected grade < B+ or R:R/SL fails) → plain WAIT, no armed order.

**OUTPUT**
22. Calculate pips and dollar values using direction-aware formulas
23. Verify SL dollar value ≤ max risk → IF exceeds, flag "SL TOO WIDE" and provide tightened SL
24. Verify R:R ≥ 1:2 → IF below, output WAIT with reason "R:R insufficient"
25. Output trade plan using Output Template below (include Setup Grade line)
26. AUTO-SAVE (see File Saving Rules below)

> ⚠️ **The `===` Output Templates below are DISPLAY-ONLY** — they are the chat/terminal render. **NEVER write the `===` ASCII box to a saved `.md` file.** Saved analysis files MUST use the markdown-with-frontmatter schema in `Docs/file-formats.md` (YAML frontmatter + `##` section headings), because the web vault renders them as markdown: a `===` line becomes a setext heading and a stray code fence swallows the page. Display the box in chat; save the markdown schema.

## Output Template — LONG/SHORT
```
===================================
  XAU/USD - [SESSION] [TIME UTC]
===================================
Trade Direction: LONG / SHORT

HTF Bias: D1:[BULL/BEAR] | H4:[BULL/BEAR] | H1:[BULL/BEAR] — [WITH D1 TREND / COUNTER-TREND vs D1]
M15 Structure: [trend + last BoS/CHoCH event]

Entry: [price] — [reason: OB/FVG/sweep level]
Take Profit: [price]
  - calc: [use direction-aware formula] = [pips] pips → $[value]
Stop Loss: [price]
  - calc: [use direction-aware formula] = [pips] pips → $[value]
R:R: [tp pips] ÷ [sl pips] = [ratio]:1
Setup Grade: [A+/A/B+/B/C] ([score]/100)
  HTF:[X]/20 | Zone:[X]/20 | Sweep:[X]/15 | P/D:[X]/15 | Trigger:[X]/10 | Session:[X]/10 | R:R:[X]/10
Lot: [dynamic lot] | Risk: $[sl dollar value] of $[max risk]

Confluences:
- [at least 1, list all that apply]

Invalidation: [specific price level + condition, e.g., "M5 closes below 4650"]
===================================
```

## Output Template — WAIT
Use this when any gate in the Analysis Order fails.
```
===================================
  XAU/USD - [SESSION] [TIME UTC]
===================================
Trade Direction: WAIT

Reason: [which gate failed and why — be specific]

Watch A: [bullish scenario] — IF [condition] → [direction], entry ~[price], SL [price], TP [price] (R:R [X]:1)
Watch B: [bearish scenario] — IF [condition] → [direction], entry ~[price], SL [price], TP [price] (R:R [X]:1)

[ARMED ORDER — include ONLY when the WAIT qualifies per ARMED-WAIT BRANCH (Gate 3 P/D-timing or Gate 4, projected grade ≥ B+):]
⚡ ARMED — pending limit order proposed (requires CONFIRM):
  place_pending_order: [LIMIT BUY/SELL] [lot] @ [Watch A entry] | SL [price] | TP [price]
  Projected Grade: [A+/A/B+] ([score]/100) at the zone | R:R [X]:1 | Risk $[value] of $[max risk]
  Alert set @ [entry]. Expiry: session end / M5 close beyond [invalidation level] / HTF stale.
  → Type CONFIRM to place, or ignore to leave it as a watch.

Key Levels:
- [level 1]: [what it means]
- [level 2]: [what it means]

Invalidation: [condition that kills both Watch A and Watch B]
===================================
```

**WAIT rules:**
- Always provide at least 1 Watch scenario with approximate entry/SL/TP
- Always specify which gate failed (HTF unclear, no OB/FVG, no M1 trigger, etc.)
- Never output a bare "WAIT" without reason and watch levels
- **ARMED orders:** include the Armed Order block ONLY for Gate 3 P/D-timing or Gate 4 WAITs with projected grade ≥ B+, R:R ≥ 2:1, SL ≤ max risk, and < 2 pendings already resting. Never auto-place — always require CONFIRM. Genuine no-trade WAITs (no zone / counter-trend-no-H4 / unclear / stale) get NO armed order.

## Output Template — SCALP (LONG/SHORT)
```
===================================
  XAU/USD SCALP - [SESSION] [TIME UTC]
===================================
Trade Direction: LONG / SHORT

HTF Bias: D1:[BULL/BEAR] | H4:[BULL/BEAR] | H1:[BULL/BEAR] — [WITH D1 TREND / COUNTER-TREND vs D1]
M5 Structure: [trend + last BoS/CHoCH event]

Entry:  ~[price] — [reason: M1 OB/FVG/sweep + confirmation]
  TP1: [price] (nearest M1/M5 FVG or swing level)
    calc: [direction-aware formula] = [pips] pips → $[value]
  TP2: [price] (optional extension — next M5 FVG or session level)
    calc: [direction-aware formula] = [pips] pips → $[value]
  SL:  [price] (above/below M1 swing high/low)
    calc: [direction-aware formula] = [pips] pips → $[value]
R:R (TP1): [tp1 pips] ÷ [sl pips] = [ratio]:1
Setup Grade: [A+/A/B+/B/C] ([score]/100)
  HTF:[X]/20 | Zone:[X]/20 | Sweep:[X]/15 | P/D:[X]/15 | Trigger:[X]/10 | Session:[X]/10 | R:R:[X]/10
Lot: [dynamic lot] | Risk: $[sl dollar value] of $[max risk]

Confluences:
- [list all — BSL/SSL sweep, FVG, M5 P/D zone, session level, etc.]

Invalidation: [M1 or M5 candle close condition]
===================================
```

**Dual Agent LTF rules:**
→ Prompt templates: `Docs/agents/collector.md` and `Docs/agents/analyst.md`

- **Step 1 — Spawn Agent 1** using `Docs/agents/collector.md` prompt. Fires 10 MCP calls in parallel, returns DATA_BUNDLE.
- **Step 2 — Pre-load context (parent, parallel Reads in one tool turn):**
  - `Context/htf-context.md` → `<htf_context>`
  - `Context/ltf-memory.md` → `<ltf_memory>`
  - `Context/account.md` max risk value → `<account_max_risk>`
  - Scoring rubric table from `Docs/setup-scoring.md` → `<scoring_rubric>` (table only — drop worked examples)
  - Frontmatter template from `Docs/file-formats.md` → `<file_format>` (template only)
- **Step 3 — Spawn Agent 2** using `Docs/agents/analyst.md` prompt with the 5 XML blocks above PLUS the DATA_BUNDLE appended. Runs Gates 1–5, outputs trade plan, writes 2 files.
- Agent 2 makes **NO MCP calls** and performs **NO file Reads** — all data is in the bundle and the inlined context blocks.
- The only file ops Agent 2 performs are 2 writes at the end (trade plan + ltf-memory update).
- Final output and file saving are handled entirely by Agent 2.
- Do NOT run Agent 1 and Agent 2 in parallel — Agent 2 depends on Agent 1's bundle.

**Scalp rules:**
→ Full scalp gate procedure: `Docs/commands-reference.md` (`scalp setup` section)
- Always show TP1; TP2 is optional (include when next demand/supply zone is within 2× SL distance)
- SL must be above/below the M1 swing high/low that defines the setup — never wider than max risk
- Grade minimum B+ (70) applies — same as LTF trades
- AUTO-SAVE to `Analysis/Scalp/YYYYMMDD/` — do NOT update `Context/ltf-memory.md`

---

# Setup Scoring System

After Gate 4 passes (M1 trigger confirmed), score the setup across 7 categories before outputting the trade plan. The grade determines whether the setup is executable.

→ **Before scoring, read `Docs/setup-scoring.md`** for the full rubric, point tables, rationale, and worked examples.

## Scoring Rubric Summary
7 categories, 100 points total: HTF Alignment (20) | Entry Zone (20) | Liquidity Sweep (15) | Premium/Discount (15) | M1 Trigger (10) | Session Timing (10) | R:R (10)

## Grade Thresholds

| Grade | Score | Action |
|-------|-------|--------|
| A+ | 90–100 | TRADE — textbook setup, full confidence |
| A | 80–89 | TRADE — strong, minor factor missing |
| B+ | 70–79 | TRADE — solid, meets minimum quality bar |
| B | 55–69 | WAIT — observe only, show plan for learning |
| C | 0–54 | WAIT — skip entirely |

**Minimum execution grade: B+** (score >= 70). If grade < B+, override direction to WAIT with reason: "Setup Grade [X] ([score]/100) — below B+ minimum. Weak: [list categories scoring below 50% of their max]."

## Scoring Procedure
1. Evaluate each of the 7 categories using data already collected during Gates 1–4
2. Sum the points → total score
3. Map score to grade using the threshold table
4. If grade >= B+ → proceed to trade plan output
5. If grade < B+ → output the full trade plan BUT override direction to WAIT, include the grade breakdown, and list the weakest categories

---

# Commands

→ Full command definitions with step-by-step procedures: `Docs/commands-reference.md`
→ **Before executing any command below, read `Docs/commands-reference.md` for the full procedure.**

## Command Index

| Command | Aliases | Purpose |
|---------|---------|---------|
| **Analysis** | | |
| `analyze HTF via image` | `update htf` | D1/4H/1H from screenshots → auto-saves HTF context |
| `analyze HTF via mcp` | `htf analysis` | D1/4H/1H from live MT5 data → auto-saves HTF context |
| `analyze LTF via image` | `analyze` | M15/M5/M1 from screenshots → trade plan + auto-save |
| `analyze LTF via mcp` | `analyze via mcp`, `ltf analysis` | M15/M5/M1 from live MT5 → trade plan + auto-save |
| `analyze LTF via agents` | `dual agent ltf` | 2-agent LTF: Agent 1 fetches all MCP data in parallel → Agent 2 runs Gates 1–5 on bundle → trade plan + auto-save |
| `scalp setup` | `scalp`, `find scalp`, `scalp via mcp` | M1/M5 fast entry scan → scalp plan + auto-save to Analysis/Scalp/ |
| `analyze news [event]` | `news analysis`, `econ analysis` | Economic event analysis from screenshot or MCP → impact summary + auto-save to Analysis/News/ |
| **Execution** | | *(all require CONFIRM)* |
| `execute trade` | `place order`, `open trade` | Market order with triple-layer safety |
| `place pending order` | `set limit`, `set stop` | Limit/stop order with invalidation price |
| `delete pending order` | `cancel order` | Delete pending by ticket |
| `close trade` | `close position` | Close position → auto-sync + log |
| `close all` | — | Close all positions → auto-sync + log |
| `modify SL/TP` | `modify position` | Change SL/TP on open position |
| `trail [ticket] [pips]` | `trailing stop` | Trail SL N pips behind price |
| `move SL to BE [ticket]` | `breakeven`, `be` | SL to breakeven + 1 pip buffer |
| **Management** | | |
| `log trade` | — | Log closed trade + auto-journal entry |
| `sync account` | `update account` | Pull live equity/positions from MT5 |
| `sync trade log` | `sync log` | Sync today's MT5 history to trade log |
| `performance` | `stats` | Win rate, profit factor, grade correlation |
| **Utility** | | |
| `dashboard` | `dash` | Full live dashboard (7 parallel MCP calls) |
| `market status` | `check market` | Quick market snapshot + news warnings |
| `check spread` | — | Spread stats + entry suitability |
| `lot size [sl_pips]` | `calculate lot` | Lot size from live equity |
| `check drawdown` | — | Daily P&L vs risk limits |
| `economic calendar` | `news`, `calendar` | Upcoming USD events + timing warnings |
| **Alerts** | | |
| `set alert [price] [label]` | `alert [price]` | Register price alert in EA |
| `list alerts` | `alerts` | Show active alerts |
| `delete alert [id]` | `cancel alert [id]` | Remove alert by ID |
| **System** | | |
| `setup` | — | Full system verification check |

---

# File Saving Rules

**CRITICAL: All dates use `YYYYMMDD` format (e.g., `20260408`). NEVER use `YYYY-MM-DD`.**

**CRITICAL: UTC DATE DERIVATION — before saving any file, determine the correct UTC date:**
1. Read UTC time from `get_session_levels` output (e.g., `SES:LONDON|UTC:16:14`)
2. If UTC time is **16:00–23:59** → UTC date = `currentDate` **minus 1 day** (local midnight already passed in GMT+8, but UTC hasn't)
3. If UTC time is **00:00–15:59** → UTC date = `currentDate` (both local and UTC are on the same calendar day)
4. Example: local date says `2026-04-09`, UTC time is `16:14` → correct UTC date is **20260408**
5. NEVER use `currentDate` directly without this check.

→ File format templates (LTF/HTF frontmatter, ltf-memory.md structure): `Docs/file-formats.md`
→ **Before saving any analysis file, read `Docs/file-formats.md` for the exact format.**

**CRITICAL — saved files are markdown, NOT the terminal box:**
- The `===` Output Templates in the Commands section are for **chat display only**. NEVER save them to disk.
- Every saved analysis `.md` (LTF/Scalp/HTF) MUST be the schema in `Docs/file-formats.md`: **YAML frontmatter + `##`/`###` section headings + bullet lists**. No `===` separator lines, no wrapping code fence.
- The web vault renders these as markdown — a `===` line is parsed as a setext heading and an unbalanced ``` fence eats the rest of the page (this broke `20260624_0736_wait.md`).
- Frontmatter keys MUST match exactly what `web/lib/content.ts` reads, or badges/levels/watch-board won't populate: WAIT uses `gate_fail`, `watch_a_entry/sl/tp/rr`, `watch_b_entry/sl/tp/rr`, `setup_grade`, `setup_score`; LONG/SHORT uses `entry`, `sl`, `tp`, `rr`, `setup_grade`, `setup_score`. (NOT `grade`/`score`/`gateFailed`/`armed`.)

---

# Vault Layout

```
Context/
  account.md          ← live equity, open positions, max risk
  htf-context.md      ← HTF bias (D1/4H/1H); overwritten on "update htf"
  ltf-memory.md       ← last 3 LTF analysis summaries + current structure
Analysis/
  HTF/                ← D1/4H analysis snapshots
  LTF/YYYYMMDD/       ← M15/M5/M1 trade plan files grouped by date: YYYYMMDD_HHMM_{long,short,wait}.md
  Scalp/YYYYMMDD/     ← M1/M5 scalp plans grouped by date: YYYYMMDD_HHMM_{long,short,wait}.md
  News/YYYYMMDD/      ← economic event analyses: YYYYMMDD_HHMM_[event-slug].md
Trade Log/            ← per-day trade logs: YYYYMMDD.md
Daily Journal/        ← session notes, mindset, observations
Playbooks/            ← setup definitions and rules
Stats/                ← performance summaries and metrics
Templates/            ← reusable note templates
```

---

# ICT Setup Playbooks

→ Setup definitions: `Playbooks/` directory (setup1-*.md, setup2-*.md)
→ Before evaluating a setup against playbook patterns, read the relevant playbook file.
→ To add a new playbook: create a new file in `Playbooks/` following the existing template structure.
