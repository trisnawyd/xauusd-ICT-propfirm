# Fix Plan — Gate 2 Mis-proposes Counter-Trend LONG During HTF-Trend Pullbacks

**Status:** Diagnosed, NOT yet applied (check-only per request)
**Date raised:** 20260610
**Severity:** Low–Medium — does NOT cause wrong trades or lost money. Causes **mislabeled gate failures** that make a correct WAIT look like the system rejected a good setup. Pollutes the analysis log and obscures the real signal (no trigger armed yet).

---

## Symptom

The last analysis (`Analysis/LTF/202606/20260610/20260610_0653_wait.md`) failed with:

> `gate_fail: "Gate 3 — counter-trend LONG (M15 last event BoS UP) not at H4 demand/OTE; no WITH-trend SHORT trigger yet"`

The HTF stack is unambiguously bearish (D1 BEARISH | H4 CONFIRMED BEARISH | H1 BEARISH, per `Context/htf-context.md`). Yet Gate 2 proposed a **LONG**, then Gate 3 blocked that LONG. The trade the system is actually waiting for — a WITH-trend SHORT into supply — was never evaluated as the proposed direction; it only appeared as a Watch scenario.

**The WAIT output is correct** (no trigger fired). The *reason string* is half-wrong: it reports a counter-trend-LONG block when the genuine state is "with-trend short not yet armed."

## Pattern across the last 7 analyses

| File | Gate | Stated reason |
|------|------|---------------|
| 20260609_0511 | 3 | no unmitigated M5 OB/FVG near price |
| 20260609_0533 | 3 | 0 unmitigated M5 OB/FVG (all mitigated) |
| 20260609_0633 | 4 | no M1 trigger; price below all bearish FVGs |
| 20260609_0754 | 3 | SHORT P/D fails (price in DISCOUNT) + 0 zones + LONG below H4 OTE |
| 20260609_1202 | 3 | no unmitigated supply zone for SHORT |
| 20260609_1512 | 3 | SHORT (with-trend) but price in M15 DISCOUNT |
| 20260610_0653 | 3 | counter-trend LONG not at H4 demand; no SHORT trigger |

**6 of 7 die at Gate 3.** This is not bad luck — it is a structural property of the gate framework meeting a strong one-directional trend (a ~190-point D1 crash, 4362 → 4172). The framework is built for *retracement-to-zone* entries; in a displacement regime the zones get consumed and price sits in discount after a sweep, so Gate 3 has nothing to engage. Most of these WAITs are **correct** — the market genuinely offered no armed entry.

## Root cause

`CLAUDE.md` → Analysis Order → **Gate 2 (M15 Direction Determination)**, steps 7–9:

- Step 7–8 set the *proposed direction* from the **single last M15 structural event**.
- During a downtrend pullback, every corrective bounce off the low prints a **BoS UP on M15** (here: BoS UP@4192.74, a bounce off the 4172 triple-bottom).
- So Gate 2 mechanically proposes **LONG**.
- Step 9 then tags it **COUNTER-TREND vs D1** (LONG opposes D1 BEARISH).
- Gate 3's counter-trend-LONG rule requires price at an H4 demand zone / OTE. In a crash there is no H4 demand below price → **blocked**.

The flaw: **in an HTF trend, a minor corrective BoS on the entry timeframe is not a direction signal — it is the pullback that sets up the with-trend continuation.** Gate 2 reads it as a fresh LONG bias and walks the whole gate chain down a direction the HTF guidance already says is low-probability. The actual high-prob direction (SHORT into supply) is correctly described in `htf-context.md` Setups A/B/C but never becomes Gate 2's "proposed direction," so it is evaluated only as a Watch, never as an armed candidate.

Note the `detect_structure` Reading Rule ("read the last event line first") is being applied too literally: it was written to catch *trend reversals* (label lags a real BoS), but here it is firing on a *corrective bounce inside an intact trend* and manufacturing a counter-trend bias.

## Scope — what is and isn't affected

- **Affected:** the *proposed direction* and the *gate_fail reason string* during HTF-trend pullbacks. Cosmetic/diagnostic, plus wasted gate evaluation on the wrong side.
- **NOT affected:** execution safety, lot sizing, P/D math, the Watch scenarios (those are correct), or final WAIT/TRADE decision in this case. No money is at risk from this bug.

## Fix

Add a **trend-context override** to Gate 2, between current steps 8 and 9:

> **8a. Trend-pullback check.** If the last M15 event is a BoS/CHoCH that *opposes* the PRIMARY HTF direction from Gate 1, AND that event is a minor swing inside an intact HTF trend (e.g. a BoS at a *descending* level during a downtrend, or the bounce off a freshly swept SSL/BSL), do NOT propose the counter-trend direction. Instead:
> - Set proposed direction = **PRIMARY HTF direction** (the continuation side).
> - Mark the setup state **"pullback in progress — with-trend trigger not yet armed."**
> - Carry the with-trend supply/demand zones from `htf-context.md` into Gate 3 as the entry zones to wait for.

Then Gate 3 evaluates the *correct* side. When price has not yet rallied into supply, the honest gate_fail becomes:

> `gate_fail: "Gate 3/4 — WITH-trend SHORT: price not yet at supply (nearest H1 FVG 4247–4255); no M1 trigger. Waiting for retrace."`

…instead of the misleading "counter-trend LONG blocked."

### Tightening rule (keep the override honest)

The override flips direction to the HTF side **only when the opposing event is a minor corrective swing.** If the opposing M15 event is a *genuine* CHoCH with displacement that breaks a major HTF level (real reversal), the existing Reading Rule must still win — do NOT suppress it. Suggested discriminator: opposing event is corrective if it (a) is a BoS (not CHoCH), or (b) sits below the prior swing high in a downtrend / above the prior swing low in an uptrend, or (c) is the first bounce off a level swept within the last ~10 M15 bars. Reversal (Reading Rule applies) if it is a CHoCH that closes beyond the last HTF structural level with displacement.

## What NOT to do

- **Do NOT loosen Gate 3** to let trades fire in this regime. The reason it produces WAITs is mostly correct: price is in discount after a sweep, no fresh supply at price, CPI 8h out. Loosening it = shorting/longing into a falling knife and chasing displacement. The Gate 3 WAITs at 0511/0533/1202/1512 were the system doing its job.
- **Do NOT remove the Reading Rule.** It is correct for reversals; it is only being over-applied to corrective bounces. The fix narrows it, not deletes it.

## Verification plan (after applying)

1. Re-run LTF analysis on the next bounce off 4172 (or any downtrend pullback). Confirm Gate 2 proposes **SHORT** (continuation), not LONG.
2. Confirm the gate_fail string reads "with-trend trigger not yet armed," not "counter-trend LONG blocked."
3. Confirm that when price rallies into H1 FVG 4247–4255 with M15 CHoCH DOWN + M1 trigger, the system arms a SHORT (Setup A) rather than producing another WAIT.
4. Regression: feed a real M15 CHoCH-with-displacement reversal and confirm the Reading Rule still flips bias (override must NOT suppress true reversals).

## Files to change

- `CLAUDE.md` — Analysis Order, Gate 2 (add step 8a trend-pullback override + discriminator). Also tighten the gate_fail wording guidance.
- `Docs/commands-reference.md` — mirror the Gate 2 change in the LTF command procedure if it duplicates the gate steps.
- `Docs/agents/analyst.md` — the dual-agent analyst runs Gates 1–5; apply the same step 8a so the agent path matches.
