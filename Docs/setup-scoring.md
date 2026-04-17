# Setup Scoring System — Reference Guide

A 7-category, 100-point scoring rubric that grades every trade setup after it passes the 4-gate decision tree. The grade determines whether the setup is executable or should be observed only.

**Authoritative source:** The scoring rules in `CLAUDE.md` are what Claude follows at runtime. This document is a human-readable reference with rationale and examples.

---

## Why Score Setups?

Passing all 4 gates means a setup is structurally valid, but not all valid setups are equal. A London BSL sweep with 6 confluences at an H4 OB is fundamentally different from a weak M1 pin bar during Asian session. The scoring system:

1. **Filters marginal setups** — prevents executing trades that technically pass but lack conviction
2. **Builds empirical data** — correlates grades with win/loss outcomes over time to validate which confluence combinations actually perform
3. **Speeds up decision-making** — a single grade (A+, A, B+, B, C) gives instant confidence signal

---

## Scoring Categories

### 1. HTF Multi-Timeframe Alignment (20 points)

Measures how many higher timeframes support the trade direction. D1 is the institutional anchor — trading with it earns full points; trading against it earns partial points based on how much of the HTF stack agrees.

| Condition | Points |
|-----------|--------|
| D1 + H4 + H1 all aligned with trade direction | 20 |
| H4 + H1 aligned with trade direction, D1 counter | 14 |
| H1 aligned with trade direction, D1 + H4 counter | 8 |
| Only M15 aligned, D1 + H4 + H1 all counter | 2 |

**Counter-trend math:** A trade with H4+H1 aligned but D1 counter starts at 14/20. Reaching B+ (70 total) requires 56/80 from the remaining six categories — achievable for a high-quality setup (strong zone + confirmed sweep + correct P/D + clean trigger), but impossible for a marginal one. This is the natural filter that allows good counter-trend trades while blocking weak ones.

**Why the change from forced alignment:** D1 and H4 contradicting is not ambiguity — it's a counter-trend opportunity. Locking direction to D1 caused missed moves when H4+H1 were clearly pushing the other way. The scoring system now quantifies the reduced conviction automatically: counter-trend trades must earn their execution through superior confluence on all other factors.

### 2. Entry Zone Quality (20 points)

The precision of your entry determines both risk and probability.

| Condition | Points |
|-----------|--------|
| Unmitigated OB + FVG overlapping at entry | 20 |
| Unmitigated OB at entry, price inside OB body | 15 |
| Unmitigated FVG at entry | 12 |
| HTF OB/FVG aligns with M5 zone | +5 bonus (cap 20) |
| Momentum/displacement only, no OB/FVG | 5 |

**Why 20 points:** OB+FVG overlap is the highest-probability ICT entry. When institutional supply/demand (OB) coincides with an imbalance (FVG), the zone is doubly significant.

### 3. Liquidity Sweep Confirmation (15 points)

Sweeps reveal smart money accumulation/distribution before the real move.

| Condition | Points |
|-----------|--------|
| Session high/low BSL/SSL sweep confirmed (wick + rejection) | 15 |
| Multi-level sweep (2+ liquidity pools in same move) | 15 |
| Sweep visible on M15/M5 but not at session level | 10 |
| No fresh sweep, but prior sweep cleared path | 5 |
| No sweep evidence | 0 |

**Why 15 points:** Liquidity sweeps are the "manipulation" phase of ICT's AMD model. A trade entered after confirmed manipulation has directional conviction that unswept setups lack.

### 4. Premium/Discount Zone Correctness (15 points)

Core ICT principle: buy in discount, sell in premium.

| Condition | Points |
|-----------|--------|
| LONG in discount zone (below EQ) OR SHORT in premium zone (above EQ) | 15 |
| Entry inside OTE (61.8%–78.6% retracement) | 15 |
| Trade at equilibrium (near EQ) | 5 |
| Wrong zone (LONG in premium / SHORT in discount) | 0 |

**Why 15 points:** Premium/discount is the institutional value framework. Buying in premium means buying where institutions are selling.

### 5. M1 Trigger Quality (10 points)

The entry confirmation on the fastest timeframe.

| Condition | Points |
|-----------|--------|
| Clean engulf/pin bar + displacement at OB/FVG, confirmed LH/HL sequence (3+ candles) | 10 |
| LH/HL sequence confirmed (2 candles) | 7 |
| Single displacement candle, no confirmed sequence yet | 4 |
| Weak signal (inside bar, doji near zone) | 2 |

**Why 10 points:** M1 is the noisiest timeframe. A strong trigger adds confidence but shouldn't be the deciding factor — the higher-timeframe confluences matter more.

### 6. Session Timing (10 points)

Not all hours trade equally. Overlap and London open have the best follow-through for gold.

| Condition | Points |
|-----------|--------|
| London/NY Overlap (13:00–17:00 UTC) | 10 |
| London open (08:00–10:00 UTC) or NY open (13:00–15:00 UTC) | 8 |
| London mid (10:00–13:00 UTC) or NY mid (15:00–18:00 UTC) | 6 |
| Asian session (22:00–08:00 UTC) | 3 |
| Off-hours / session close | 1 |

**Why 10 points:** Session timing affects liquidity and volatility. An A+ setup during Asian session may stall until London opens.

### 7. R:R Ratio (10 points)

Higher reward-to-risk means the trade can sustain more imprecision and still profit.

| Condition | Points |
|-----------|--------|
| R:R >= 5:1 | 10 |
| R:R >= 3:1 | 7 |
| R:R >= 2:1 | 4 |
| R:R >= 1.5:1 | 2 |
| R:R < 1.5:1 | 0 |

**Why 10 points:** R:R is important but is partially a function of SL placement and target selection, which are already influenced by the structural categories above.

---

## Grade Thresholds

| Grade | Score | Action |
|-------|-------|--------|
| **A+** | 90–100 | TRADE — textbook setup, execute with full confidence |
| **A** | 80–89 | TRADE — strong setup, minor factor missing |
| **B+** | 70–79 | TRADE — solid, meets minimum quality bar |
| **B** | 55–69 | WAIT — decent structure but too many gaps, observe only |
| **C** | 0–54 | WAIT — weak setup, skip entirely |

**Minimum execution grade: B+** (score >= 70)

Setups below B+ still get a full trade plan in the output (for learning), but the direction is overridden to WAIT with the specific weak categories called out.

---

## Worked Examples

### Example 1: A+ Setup (93/100)

**File:** `Analysis/LTF/20260407/20260407_0815_short.md`
**Context:** London open BSL sweep SHORT — D1+H4+H1 bearish, Asian high swept at 08:14, M1 lower high confirmed

| Category | Score | Reasoning |
|----------|-------|-----------|
| HTF Alignment | 20/20 | D1 bearish (lower highs 4800→4706→4665), H4 bearish OB zone, H1 lower highs confirmed |
| Entry Zone | 15/20 | H4 bearish OB (4640–4685), price inside OB body. No FVG overlap at entry. |
| Liquidity Sweep | 15/15 | Asian high 4664.38 swept to 4665.63, immediate wick rejection |
| Premium/Discount | 15/15 | SHORT in premium — price above H4 equilibrium, inside bearish OB |
| M1 Trigger | 10/10 | M1 lower high 4663.88 < 4665.63 confirmed, clean rejection candle |
| Session Timing | 8/10 | London open (08:15 UTC) — prime ICT manipulation window |
| R:R Ratio | 10/10 | 5.95:1 (TP1) — excellent risk/reward |
| **Total** | **93/100** | **Grade: A+** |

**Result:** This trade was executed and won. The A+ grade correctly identified a high-conviction setup.

---

### Example 2: B Setup (64/100)

**File:** `Analysis/LTF/20260408/20260408_1919_long.md`
**Context:** NY session triple SSL sweep LONG — HTF bullish, M5 CHoCH up, awaiting pullback to M1 FVG

| Category | Score | Reasoning |
|----------|-------|-----------|
| HTF Alignment | 15/20 | D1 + H4 bullish, but H1 was corrective (bearish algo) with recent BoS UP confirming momentum |
| Entry Zone | 12/20 | M1 FVG at 4672–4679 for entry. No OB overlap. FVG-only entry. |
| Liquidity Sweep | 15/15 | Triple SSL sweep at 19:15 — 3 levels swept in one candle, massive |
| Premium/Discount | 5/15 | Price at 4690 near equilibrium (H4 EQ ~4705), not in clear discount yet |
| M1 Trigger | 4/10 | No pullback occurred yet — setup is conditional, no confirmed entry trigger |
| Session Timing | 6/10 | NY mid-session (19:19 UTC) — decent but past prime hours |
| R:R Ratio | 7/10 | 2.57:1 — adequate but not strong |
| **Total** | **64/100** | **Grade: B** |

**Under the scoring system:** This would be output as WAIT with the note: "Setup Grade B (64/100) — below B+ minimum. Weak: P/D zone (5/15), M1 trigger (4/10), R:R (7/10)." The trader sees the full plan but doesn't execute until the pullback confirms and conditions improve.

---

## Calibration

After accumulating **50+ graded trades**, review the grade-vs-outcome correlation:

1. Run `performance` to see the Grade Correlation block
2. Check: Do A+ setups actually win more than B+ setups?
3. If a category has no correlation with outcomes, consider reducing its weight
4. If a category strongly predicts wins, consider increasing its weight

**Adjust the rubric periodically** — the initial weights are based on ICT theory and pattern analysis from the first 28 analysis files. Real trade outcomes may reveal different optimal weights.

Common recalibration signals:
- A+ setups losing frequently → HTF or entry zone criteria may be too loose
- B+ setups winning frequently → minimum grade threshold may be too conservative
- One category always scores max → it's not differentiating, consider tightening criteria
