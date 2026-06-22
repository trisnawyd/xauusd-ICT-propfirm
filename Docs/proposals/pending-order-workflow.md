# PROPOSAL — Armed-WAIT → Pending-Order Workflow

> Status: **DRAFT, not active.** Needs your sign-off before any rule file changes.
> Author: Claude · Context: outcome-tracking backfill (branch `feature/outcome-tracking-eval`)

## Problem this solves

The gate-fail backfill showed **~60% of all WAIT outputs are "right setup, wrong moment"**:

| Gate-fail bucket | Share of WAITs | Nature |
|---|---|---|
| Gate 3 — P/D timing (SHORT-in-discount / LONG-in-premium) | ~46% | Valid zone exists; price just hasn't retraced to it yet |
| Gate 4 — armed, no M1 trigger | ~14% | Zone + P/D already pass; only the trigger candle is missing |

In every one of these the model **already computes the exact entry** (the "Watch A" level) — then emits it as prose and moves on. By the time you next look, the retrace has come and gone. The entry is known and unused.

The other ~40% of WAITs are genuine no-trades and must stay WAIT: no zone at price (26% of G3), counter-trend with no H4 zone (26% of G3), structure unclear (Gate 2), HTF stale (Gate 1).

## Proposed change (minimal, respects existing safety protocol)

When a WAIT is **"armed"** — defined precisely below — convert the Watch A level from prose into an **actionable pending-order proposal + price alert**, instead of leaving it as a forgettable line.

### "Armed" trigger conditions (ALL must hold)
1. A specific entry price exists at a real, unmitigated OB/FVG zone (not "no zone").
2. Direction is structurally valid (passes Gate 2; for counter-trend, price IS at / will retrace into an H4 zone).
3. The only thing failing is **P/D timing** (price on the wrong side of EQ but a valid retrace entry is known) **or** **no M1 trigger yet**.
4. Projected setup at the zone grades **≥ B+ (70)**, R:R **≥ 2:1**, and SL dollar value **≤ max risk**.
5. Daily drawdown limit not breached; spread rule (5.0) respected at fill time by the EA.

### Action when armed
- **Auto-set the price alert** at the Watch A entry (alerts are non-execution — already done today, keep it).
- **Propose a pending limit order** (`place_pending_order`) at the Watch A entry with the plan's SL/TP — but **still require explicit CONFIRM** per the existing Execution Safety Protocol. This does NOT bypass any safety layer; it just turns "watch ~4186" into a concrete order you can approve in one word.
- Attach an **invalidation/expiry**: cancel the pending if (a) structure invalidates (e.g., M5 closes beyond the zone-killing level named in the plan), or (b) the session ends unfilled, or (c) HTF goes stale.

### What does NOT change
- The triple-layer safety protocol stays intact; no order reaches MT5 without CONFIRM.
- Genuine no-trade WAITs (no zone / counter-trend-no-H4 / unclear / stale) still output plain WAIT.
- Lot sizing, max-risk, daily-drawdown, and the 5.0 spread gate are unchanged.

## Why pending orders specifically
The model's edge (if any) is identifying the zone, not catching the exact second of the retrace. A resting limit at the zone is the natural expression of "wait for retrace to X" — and it's the one thing that turns the 60% of dead WAITs into setups that can actually fill while you're away (e.g. taking a bath).

## Risks / open questions for you
1. **Authorization model:** do you want pendings to still require live CONFIRM, or a pre-authorized "auto-arm" mode within strict bounds (max N concurrent, max risk each)? I drafted the conservative CONFIRM-required version.
2. **Expiry policy:** cancel at session end, or trail the pending with the zone?
3. **Concurrency cap:** how many resting pendings at once? (suggest ≤ 2.)
4. This is **unproven** — it should ship behind the reconciler so every filled pending gets an outcome and we can measure whether armed-WAIT pendings actually profit before trusting it.

## If approved, files to change
- `CLAUDE.md` — add the armed-WAIT branch to the Analysis Order (after Gate 4).
- `Docs/commands-reference.md` — define the `arm pending` action.
- `Docs/agents/analyst.md` — emit a pending-order proposal block when armed.
- WAIT output template — add an "Armed Order" section.
