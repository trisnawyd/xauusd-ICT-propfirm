---
updated: 2026-07-01 14:48 UTC
source: MCP (detect_structure D1/H4/H1, detect_fvg H4/H1, get_premium_discount H4, get_session_levels, get_current_tick, get_account_info) — refreshed OVERLAP 07/01 after the ceiling (4102.44-4107.40) was tested twice: a pin-bar rejection at 4106.99 (17:25 broker) then a confirmed BSL liquidity sweep to 4115.74 (17:36) that immediately reversed and round-tripped back to ~4090 within 9 minutes
snapshot: "[[Analysis/HTF/20260701]]"
---

# HTF Context — XAU/USD

## Bias: NEUTRAL — range **3942.86 / 4145.04**, RECOVERING but twice-rejected at the internal ceiling. The 06/30 floor-reversal recovery ran uninterrupted from 3973 all the way to the H4 bear FVG ceiling (4102.44–4107.40), tagged it at 4106.99 (M1 pin-bar rejection), then displaced through it on the 14:00 UTC ISM release to a session high of **4115.74** — this looked like a genuine H4 range-break but wasn't: `detect_liquidity_sweeps` confirmed it as a **BSL sweep@4108.21** (wick 4115.74, close back to 4095.96), and price round-tripped the entire breakout leg back to ~4090 in under 10 minutes. Crucially, **4115.74 never came close to the true H4 structural high (4145.04, set 06/23)** — this was a sweep of an internal LTF/H4-FVG level, not a break of the actual range boundary. Both H4 and H1 detectors' **most recent captured event is bearish** (H4: BoS DOWN@3942.86 06/30; H1: BoS DOWN@3959.73 07/01) even though their lagging trend labels still read BULLISH — per the reading rule, both timeframes are in **transition-to-bearish**, not confirmed uptrends. Combined with the double rejection at the ceiling, the near-term edge now leans **short-the-premium**, not chase-the-breakout. A genuine bullish resolution requires an H4 close above **4145.04** (not 4107/4110) — until then this is a range-fade market.

**Reason:** D1 BULLISH (last BoS UP@4220.61, 06/22) remains stale/irrelevant — price 4090 sits far below the D1 OTE (4082.49–4192.11 is roughly in range now, but D1 structure itself hasn't registered anything since the 06/22 high). H4 BULLISH label, but last event is BoS DOWN@3942.86 (06/30 04:00) → per the detect_structure Reading Rule, this is TRANSITION TO BEARISH, not a confirmed uptrend — treat the bullish label cautiously. H1 same pattern: BULLISH label, last event BoS DOWN@3959.73 → TRANSITION TO BEARISH. Today's ADP/ISM data cluster (all three misses — bearish USD) produced the expected bullish spike, but it was swept and faded rather than held, which is itself informative: the fundamental tailwind exists but the technical structure at the ceiling won, at least for this attempt.

**What changed since 20260701 00:20 UTC:**
- **Recovery ran the full leg to the ceiling:** 3973 → 4106.99 (pin-bar reject) → swept to 4115.74 → reversed to ~4090. The prior "resolving up toward 4106 ceiling" path played out exactly, and the ceiling held (twice).
- **H4 range re-scoped:** true H4 high is **4145.04** (06/23, untested this leg), not 4107/4110 — the earlier "range-up break level" (4107.40) was an internal H4 FVG, not the actual H4 swing high. Updated bull-break trigger: **H4 close above 4145.04**, not 4107.40.
- **New H4 bullish FVG formed:** 3984.74–4012.55 (07/01 12:00, open) — fresh intraday demand floor, below current price.
- **New H1 bullish FVG formed:** 4033.93–4082.22 (07/01 16:00, open) — spans the H4 EQ (4043.95) and sits directly below current price; this is now the first real demand shelf on a deeper pullback, and roughly matches the SHORT plan's TP zone (4063.6 / 4039.61).
- **News cluster released:** ADP 98K (vs 118K fcst/122K prev), ISM Manufacturing PMI 53.3 (vs 53.8/54.0), ISM Prices Paid 73.0 (vs 77.7/82.1) — clean triple-miss, bearish USD / bullish gold fundamentally (see [[Analysis/News/20260701/20260701_1436_us-manufacturing-data-miss]]), but the immediate technical reaction was sweep-and-fade at the ceiling, not sustained continuation.

---

## D1 Analysis
- **D1 trend (algo): BULLISH** — last event BoS UP@4220.61 (06/22); stale, ~9 days old, predates the entire 4350→3942→4145 range this context now covers.
- **D1 read:** multi-week markdown/recovery structure; last week+ has ranged entirely within 3942.86–4145.04, well below the old 4220.61/4350 highs. Not a live D1 signal either direction right now.
- **D1 Bias: NEUTRAL (stale label, price action confined to a sub-range below it).**

## H4 Analysis
- **H4 trend (algo): BULLISH**, but **last event BoS DOWN@3942.86** (06/30 04:00, broke 3959.73) → **TRANSITION TO BEARISH** per the reading rule — the label is lagging a bearish structural break.
- **H4 P/D (range 4145.04 / 3942.86):** EQ **4043.95** | OTE 3986.13–4020.09. Price 4089.88 = **PREMIUM**.
- **H4 FVGs open:** BULLISH **3984.74–4012.55** (fresh, 07/01 12:00, intraday demand floor); BEARISH **4233.39–4239.57** (06/18, distant, only relevant above 4145.04). The bear FVG at 4102.44–4107.40 is formally [filled] per the H4 detector's own criteria (mitigated on an earlier visit), but has behaved as live intraday resistance twice today — treat it as an active S/R flip zone regardless of the algo's "filled" tag.
- **H4 Bias: NEUTRAL/range — twice-rejected at the 4102–4107 internal ceiling, has not tested the true range high 4145.04. EQ 4043.95 = pivot; 4145.04 = real ceiling; 3984.74–4012.55 = fresh demand; 3942.86 = swept floor.**

## H1 Analysis
- **H1 trend (algo): BULLISH**, but **last event BoS DOWN@3959.73** (07/01, broke 4012.55) → **TRANSITION TO BEARISH** per the reading rule.
- **H1 FVGs open:** BULLISH **3986–3997.64** (07/01 13:00, deeper demand, aligns with H4 OTE); BULLISH **4033.93–4082.22** (07/01 16:00, first demand shelf directly below current price, spans H4 EQ).
- **H1 Bias: NEUTRAL/recovering-but-rejected — bullish label lagging, most recent structural event and today's price action both bearish-leaning.**

## Premium / Discount (H4)
- **H4 range:** 4145.04 / 3942.86 | EQ **4043.95** | OTE 3986.13–4020.09
- **Current price ~4090 → PREMIUM.** Premium + twice-rejected ceiling favors fading rallies back toward EQ/OTE over chasing longs. A close above 4145.04 flips this to genuine bullish continuation; a close below 3942.86 re-opens the breakdown.

---

## Session Levels (14:48 UTC — OVERLAP active, 07/01)

| Session | High | Low | Open |
|---------|------|-----|------|
| Asian (07/01) | 4029.53 | 3969.95 | 3980.88 |
| London (07/01) | 4108.21 | 3959.73 | 4022.02 |
| NY (07/01, active) | 4115.74 | 3979.43 | 4091.48 |

**Current:** 4089.64 / 4089.84 | Spread **2 ✓** | Session OVERLAP
Price retracing off the 4115.74 sweep high, back toward the H4 EQ/H1 FVG shelf (4033.93–4082.22).

---

## Key Levels

### Supply / Resistance (above ~4090)
| Level | Source | Notes |
|-------|--------|-------|
| **4102.44–4107.40** | H4 bear FVG (formally filled, live intraday resistance) | Rejected twice today (pin-bar 4106.99, sweep-reject 4115.74) |
| **4115.74** | Session/NY high, swept BSL | Liquidity already taken here — low-probability repeat target near-term |
| **4145.04** | H4 swing high (06/23) | **The real range ceiling** — H4 close above here = genuine bullish break |
| **4233.39–4239.57** | H4 bear FVG [open] | Next supply, only relevant if 4145.04 breaks |

### Support / Demand (below ~4090)
| Level | Source | Notes |
|-------|--------|-------|
| **4063.60** | NY high (06/30) / flip zone | First support on the retrace; also SHORT plan TP1 |
| **4043.95** | H4 EQ | Pivot |
| **4033.93–4082.22** | H1 bull FVG [open] | First real demand shelf directly below price |
| **3986–3997.64** | H1 bull FVG [open] | Deeper demand, aligns with H4 OTE top |
| **3984.74–4012.55** | H4 bull FVG [open] | Fresh intraday demand floor |
| **3942.86** | Swept floor | **Close below re-opens breakdown to 3920/3900** |

---

## Trade Directional Guidance

### BIAS: NEUTRAL — range 3942.86 / 4145.04, twice-rejected at the internal 4102–4107 ceiling. Both H4 and H1's most recent structural event is bearish (transition-to-bearish under the lagging bullish label). Near-term edge favors fading premium (short toward EQ/H1 FVG shelf) over chasing the breakout — the breakout trigger is now 4145.04, not 4107/4110.
**Current state: price ~4090, retracing off the 4115.74 sweep. Live SHORT plan in play — see [[Analysis/LTF/20260701/20260701_1445_short]] (entry 4103 retest, SL 4108, TP 4063.6, awaiting CONFIRM).**

---

**Setup A — SHORT the premium / ceiling rejection (current live plan):**
- Condition: retest of the swept ceiling zone (already in progress — see LTF file).
- Entry: ~4103 | SL: 4108 | TP1: 4063.6 | TP2 (extension): 4039.61 (H4 EQ)
- Invalidation: H4/M5 close back above 4108 → reopens the breakout path toward 4145.04.

**Setup B — LONG the reclaim (if 4145.04 eventually breaks, or a clean H1 FVG hold):**
- Condition: hold/reclaim of the H1 bull FVG 4033.93–4082.22 with a clean M15 CHoCH UP, OR an H4 close above 4145.04 with retrace-and-hold above it.
- Entry: ~4045 (EQ reclaim) or ~4148 (post-breakout retest) | SL: below the respective zone
- Note: lower priority than Setup A until one of these triggers — do not chase mid-range.

### BIAS RESOLUTION (watch these)
- **Range-up break (bull, revised):** H4 close above **4145.04** (NOT 4107/4110 — that was proven to be an internal sweep level) → continuation toward 4233–4239 supply
- **Ceiling holds (bear, near-term):** rejection confirmed at 4102–4107 (already twice) → fade toward H4 EQ 4043.95 → H1 FVG shelf 4033.93–4082.22 → deeper toward 3984.74–4012.55
- **Range-down re-break (bear, macro):** close below 3942.86 → open air to 3920/3900
- **News:** ADP/ISM triple-miss already released (bearish USD / bullish gold fundamentally) but technically faded at the ceiling — Fed Chairman Warsh speech (13:00 UTC) also passed; no further HIGH-impact USD events flagged in the next few hours per this morning's calendar pull — reconfirm with a fresh `economic calendar` call before extending risk further into NY.
