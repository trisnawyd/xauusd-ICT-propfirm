# XAU/USD ICT Model v2 — Improvement Backlog

> **Phases 1–6 complete.** Initial build is done and live-profitable (89% WR, PF 6.64, +$90.20 net in first 7 days). This backlog tracks improvements identified in the 20260412 system review — safety bugs, trading discipline, automation, engineering quality, and cost efficiency.
>
> **Constraint:** no improvement may reduce trading performance (win rate, profit factor, growth rate).
>
> **Execution rule:** work Tier 1 first, then validate with live trades before moving to Tier 2. Do not batch tiers.

---

## Tier 1 — Safety Bugs (do first, zero performance risk)

**Why first:** these are real gaps in the triple-layer safety. No trading-behavior change, only correctness.

- [x] **1A. Fix silent drawdown-check swallow** — `mt5-mcp-server/src/server.ts` ~line 880 has `} catch { /* allow through */ }`. If the daily loss limit check crashes, trades are allowed. Change to log + **block**. *(Effort: 5 min)*
- [x] **1B. Add spread check to Layer 2 (Node)** — `validateExecution()` at `server.ts` lines 53–58 does NOT check spread; only the EA does. If EA reports stale/bad spread, Layer 2 is blind. *(Effort: 10 min)*
- [x] **1C. Add TP-required check to Layer 2** — only SL is validated in Node. TP=0 currently passes. *(Effort: 5 min)* *(was already implemented)*
- [x] **1D. Add SL ≠ TP check to Layer 2** — prevents broker rejection on bad direction-formula. *(Effort: 5 min)*
- [x] **1E. Consolidate safety constants into `SAFETY_CONFIG`** — `SAFETY_CONFIG` already exists as single source in `server.ts`; remaining `0.01` refs are in description strings only. *(already done)*
- [ ] **1F. Reconcile equity gap** — Trade Log ends at $162.72 on 04/10, current account shows $150.40 = −$12.32 unaccounted. Run `sync trade log` + `sync account` on Monday 22:00 UTC open. *(Effort: 2 min, operational)*

**Verification:** simulate drawdown crash → order blocked. Submit order with TP=0 → rejected at Node. Submit with SL=TP → rejected at Node. Grep for `0.01` in server.ts / MT5Bridge.mq5 → only `SAFETY_CONFIG.maxLot` references.

---

## Tier 2 — Trading Discipline (biggest EV gain)

**Why:** the review found avg win ($6.25) < avg loss ($8.00). The 04/10 Grade A setup with R:R 4.55 only captured $0.57 and $0.39 — TPs are not being respected. This is the largest available improvement, and fixing it will raise both avg win and profit factor.

- [ ] **2A. Enforce TP discipline rule** — add to `CLAUDE.md` Hard Rules: "No manual close before partial TP unless SL has been moved to BE first." Prevents early exits from ruining planned R:R. *(Effort: 10 min)*
- [ ] **2B. Auto-move SL to BE at 50% TP distance** — update `execute trade` command in `Docs/commands-reference.md` so every filled entry registers an auto-BE trigger when price reaches mid-way to TP. Requires EA-side logic or a Node-side timer poll. *(Effort: 1 hour)*
- [ ] **2C. Session filter for Overlap** — require A+ grade minimum to trade Overlap (13:00–17:00 UTC). Current Overlap avg P&L is $0.98/trade vs London's $10.70 — small scalps after the move completes. Add to `CLAUDE.md` Hard Rules. *(Effort: 5 min)*

**Verification:** run 10 live trades after Tier 2 ships. Target: avg win > avg loss. Overlap trade count should drop to near-zero unless A+. BE auto-move must fire at 50% of TP distance on next live trade.

---

## Tier 3 — Automation Extensions (positive performance impact)

**Why:** extend system capability without changing trading rules. All of these were identified as missing in the system architecture review.

- [ ] **3A. Price alert → auto-trigger LTF analysis** — mechanism already proven via `/loop` + cron during session. Read Watch A/B levels from `Context/ltf-memory.md`, poll tick every 5 min, trigger full LTF when within 15 pips. Cooldown 30 min. *(Effort: 20 min)*
- [ ] **3B. HTF auto-refresh on session start if stale** — add step to "Session Start — Auto-Load Context" in `CLAUDE.md`: if `htf-context.md` is >24h old, auto-run `analyze HTF via mcp` before accepting first user command. *(Effort: 5 min)*
- [ ] **3C. Playbook tagging in LTF frontmatter** — add `playbook: setup1|setup2` field to LTF analysis frontmatter spec in `Docs/file-formats.md` + update CLAUDE.md Gate 5 to set it. Enables per-playbook grade correlation over time. *(Effort: 15 min)*
- [ ] **3D. Backfill existing LTF analyses with `setup_grade`** — 11 pre-scoring files in `Analysis/LTF/` have no grade. Retroactively grade them with `backfilled: true` in frontmatter. Needed for grade correlation to reach the 5-trade minimum before May. *(Effort: 1 hour)*

**Verification:** set Watch level in `ltf-memory.md`, move price within 15 pips → full LTF analysis fires automatically. Clear `htf-context.md` → next session auto-runs HTF. Next LTF file has `playbook:` frontmatter.

---

## Tier 4 — Engineering Quality (Codex territory, no trading impact)

**Why:** codebase hardening. None of these affect trading logic. Safe to ship anytime.

- [ ] **4A. Unit tests for detection algorithms** — `mt5-mcp-server/src/` — FVG, OB, BoS/CHoCH, liquidity sweep are pure functions, trivially testable. Add Vitest. *(Effort: 2 hours)*
- [ ] **4B. Replace MT5 EA custom JSON parser** — `MT5Bridge.mq5` lines 1175–1197 uses `StringFind` + manual indexing. No escape support. `ExtractNumber()` fails on negatives. Replace with a proper parser or at minimum handle escapes + negatives. *(Effort: 1 hour)*
- [ ] **4C. Transaction audit log at Node layer** — append each execution tool call + result to `Trade Log/audit/YYYYMMDD.jsonl`. Reconciles against broker history if ZeroMQ socket dies mid-response. *(Effort: 30 min)*
- [ ] **4D. Fix DST-aware timezone in EA** — `MT5Bridge.mq5` line 433 uses `TimeCurrent() + TimeGMT()` offset, drifts on DST transitions. Use `TimeGMT()` directly. *(Effort: 30 min)*
- [ ] **4E. Delete or populate orphan directories** — `Templates/` is empty, `.codex/` is empty. Either populate with intent or `rm -rf`. *(Effort: 2 min)*
- [ ] **4F. Backtest harness** — one-off `Backtest/analyze_weekly_pattern.py` is not a framework. Build a minimal harness that replays historical D1/H4/M15/M5 OHLCV through the scoring rubric and outputs would-be win rate by grade. Validates rubric weights against real data. *(Effort: 4–6 hours)*

**Verification:** `npm test` in `mt5-mcp-server/` → green. Feed a JSON label with `\"` to `set_alert` → EA parses correctly. Audit log has one JSONL line per execution tool call.

---

## Tier 5 — Cost Efficiency (after Pro plan strain)

**Why:** current usage burns 2× Claude Pro accounts per weekly reset. These reduce token waste without touching trading logic.

- [ ] **5A. Compress MCP OHLCV responses** — server.ts tool output should filter to candles near key levels only, not dump all 100–200 candles. *(Effort: 1 hour)*
- [ ] **5B. Trigger-based LTF analysis** — already covered by 3A. Manual re-running is the main token burn.
- [ ] **5C. Evaluate Anthropic API vs Pro plan** — at current volume, pay-per-use API may be cheaper than 2× Pro accounts. Operational decision, not code. *(No effort, comparison only)*

**Verification:** measure tokens per analysis before/after 5A. Weekly Pro plan usage drops below limit after 3A + 5A.

---

## Execution Order

1. **Sunday (now, market closed):** Tier 1 (safety bugs) — all Node-side + markdown edits. Low risk, high value. Tomorrow's first trade immediately benefits from spread/TP/SL=TP gates.
2. **Monday 22:00 UTC (pre-open):** Run `sync trade log` + `sync account` (1F) to close the $12.32 equity gap.
3. **Monday during/after first live trade:** Tier 2 (discipline rules + auto-BE). Validate on the first win that the new TP respect rule and BE trigger work.
4. **After Tier 2 is live and clean:** Tier 3 (automation). Price alerts + HTF auto-refresh + playbook tags. All are low-risk extensions.
5. **After 20+ graded trades:** Tier 4 (engineering). Tests, audit log, JSON parser, backtest. No trading impact — safe anytime but best after the system has real data to test against.
6. **When Pro plan strain resumes:** Tier 5 (cost).

**Do not batch tiers.** Each tier should be trade-validated before the next ships.

---

## Critical Files

| Tier | File | Purpose |
|------|------|---------|
| 1 | `mt5-mcp-server/src/server.ts` | validateExecution (53–58), drawdown catch (~880), account sync (891) |
| 1 | new `mt5-mcp-server/src/safety-config.ts` | shared constants |
| 2 | `CLAUDE.md` Hard Rules (46–56) | discipline rules |
| 2 | `Docs/commands-reference.md` execute trade (72–96) | auto-BE trigger |
| 3 | `CLAUDE.md` Session Start (10–17) | HTF auto-refresh |
| 3 | `Docs/file-formats.md` LTF frontmatter | `playbook:` field |
| 4 | `mt5-mcp-server/src/*.test.ts` | new test files |
| 4 | `MT5Bridge.mq5` (1175–1197, 433) | JSON parser, DST fix |

---

## What NOT to Change (from review)

- **CLAUDE.md size** — loaded once per session, caches. Current size fine after scoring dedup.
- **Setup scoring rubric in `Docs/setup-scoring.md` only** — already deduplicated, don't move back.
- **ZeroMQ REQ/REP** — correct pattern, don't swap for HTTP/sockets.
- **MagicNumber tagging** — essential for Claude-order identification.
- **Manual `CONFIRM` gate on executions** — slow by design, not a bug.
- **B+ minimum grade threshold** — do NOT lower it. The filter is load-bearing for the 89% WR.
- **Decision tree in CLAUDE.md (not Docs/)** — runtime operational logic, moving would add file reads.

---

## Historical Context — Initial Build (Phases 1–6) ✅

Initial build shipped in 6 phases over 3 days. Full history archived in git. All items from the original roadmap below are complete:

- **Phase 1 — Trade Execution:** place_order, close_position, modify_position, safety infrastructure (MaxLot, MaxSpread, MagicNumber, SAFETY_CONFIG)
- **Phase 2 — Enhanced Analysis:** detect_structure, detect_fvg, detect_order_blocks, get_premium_discount, detect_liquidity_sweeps
- **Phase 3 — Account & Risk:** auto-sync, daily loss limit, trailing_stop, move_to_breakeven, pending order invalidation monitor
- **Phase 4 — Automation:** auto-journal, get_performance_stats, price alert system
- **Phase 5 — QoL:** multi-TF dashboard, quick commands, economic calendar
- **Phase 6 — Setup Scoring:** 7-category rubric, grade thresholds (A+/A/B+/B/C), Gate 5 integration, output template update, frontmatter fields, grade correlation, journal integration, reference doc (`Docs/setup-scoring.md`)

The only outstanding item from Phase 6 was **6I — backfill existing analyses with grades**, which is carried forward as Tier 3.3D above.
