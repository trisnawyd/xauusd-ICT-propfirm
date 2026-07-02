---
updated: 2026-07-02 00:15 UTC
source: MCP (detect_structure D1/H4/H1, detect_fvg H4/H1, get_premium_discount H4, get_session_levels, get_current_tick, get_account_info) — refreshed ASIAN 07/02 after the ceiling-rejection short thesis played out overnight WITHOUT a fill: price never retested 4103, it fell straight from ~4092 to ~4028.6 (through TP1 4063.6) and is now basing at the H4 equilibrium
snapshot: "[[Analysis/HTF/202607/20260702]]"
---

# HTF Context — XAU/USD

## Bias: NEUTRAL — range **3942.86 / 4145.04**, price parked AT EQUILIBRIUM (~4042 vs full-range EQ 4043.95) after the ceiling fade completed. The 07/01 double rejection at the internal ceiling (pin-bar 4106.99 + BSL sweep-reject 4115.74) resolved exactly as read: a descending-high fade (4088.70 → 4073.47 → 4068.59) into a NY-close breakdown to **4028.61**, round-tripping the whole recovery leg back to mid-range. The 14:45 SHORT plan (entry 4103) **never filled** — price never retraced to the entry zone before collapsing; thesis right, fill missed, zero risk taken. The H1 bull FVG shelf 4033.93–4082.22 flagged yesterday has been **consumed [filled]** by this decline — price is now sitting in its lower half. Remaining open demand: H4 bull FVG **3984.74–4012.55** + H1 bull FVG **3986–3997.64** (overlapping, = the primary demand stack, also spans the H4 OTE 3979.86–4008.90). Remaining supply: the 4102.44–4107.40 S/R flip ceiling (twice-rejected), the swept 4115.74 high, then the true range high **4145.04**. Mid-range + Asian session + **NFP day (12:30 UTC HIGH-impact jobs cluster)** = no-edge location; the playable trades are at the edges — Watch levels set both sides.

**Reason:** D1 BULLISH (last BoS UP@4220.61, 06/22) is stale — ~10 days old, price 4042 far below; not a live signal. H4: BULLISH label, last event still BoS DOWN@3942.86 (06/30) → TRANSITION TO BEARISH per the reading rule — unchanged. H1: label has now **flipped to BEARISH** (confirming yesterday's transition call), but its most recent captured event is BoS UP@4115.74 (07/01 17:00 broker) — which `detect_liquidity_sweeps` already proved was a BSL sweep, not a genuine break; the label (bearish) and the price action since (lower highs, NY-close breakdown) agree. Net: both directional impulses — the recovery rally and the ceiling fade — have completed; the market re-priced to EQ and is waiting for NFP.

**What changed since 20260701 14:48 UTC:**
- **The ceiling fade delivered in full, unfilled:** 4115.74 sweep high → descending M15 highs 4088.70/4073.47/4068.59 → NY-close breakdown to 4028.61 → Asian basing 4029.2–4045.33. TP1 4063.6 and the H4 EQ were both traded through; alert #171 fired. SHORT plan = `no_fill` (second consecutive no-fill on this thesis — the CONFIRM gate cost nothing, the market just never offered the retest).
- **H1 bull FVG 4033.93–4082.22 consumed** — no longer open demand; price trades inside its remains.
- **H1 trend label flipped BEARISH** (was BULLISH-lagging) — the transition called yesterday is now the printed label.
- **H4 detector range narrowed:** the algo now measures P/D off 4115.74/3942.86 → EQ 4029.30, OTE 3979.86–4008.90, price 4042 = marginal PREMIUM. Off the full structural range (4145.04/3942.86) EQ is 4043.95 → price dead-on EQ. Either way: equilibrium, no location edge.
- **NFP TODAY 12:30 UTC:** Nonfarm Payrolls + Unemployment Rate + Initial Claims + Average Hourly Earnings (all HIGH) in one release. Range-resolver for this whole 3942–4145 structure. No positions into 12:15–13:00 UTC minimum.

---

## D1 Analysis
- **D1 trend (algo): BULLISH** — last event BoS UP@4220.61 (06/22); stale, ~10 days old, predates the entire 4350→3942→4145 range.
- **D1 read:** multi-week markdown/recovery structure, still ranging entirely within 3942.86–4145.04. Not a live D1 signal either direction.
- **D1 Bias: NEUTRAL (stale label, price confined to a sub-range below it).**

## H4 Analysis
- **H4 trend (algo): BULLISH**, but **last event BoS DOWN@3942.86** (06/30 04:00) → **TRANSITION TO BEARISH** per the reading rule — unchanged since yesterday.
- **H4 P/D (detector range 4115.74 / 3942.86):** EQ **4029.30** | OTE 3979.86–4008.90. Price 4042 = marginal PREMIUM. Full-range EQ (4145.04/3942.86) = **4043.95** — price is sitting on it.
- **H4 FVGs open:** BULLISH **3984.74–4012.55** (07/01 12:00 — the primary demand floor, spans the OTE); BEARISH **4233.39–4239.57** (06/18, distant, only relevant above 4145.04). The 4102.44–4107.40 bear FVG remains formally [filled] but is the live S/R flip ceiling (rejected twice 07/01).
- **H4 Bias: NEUTRAL/range — at EQ mid-range. 4145.04 = real ceiling; 4102–4107 = internal ceiling; 3984.74–4012.55 = primary demand; 3942.86 = swept floor.**

## H1 Analysis
- **H1 trend (algo): BEARISH** (flipped from BULLISH — yesterday's transition confirmed). Last captured event is BoS UP@4115.74 (07/01), but that was the tool-confirmed BSL sweep — treat the bearish label + the post-sweep lower-high/lower-low sequence as the live signal.
- **H1 FVGs open:** BULLISH **3986–3997.64** (07/01 13:00) — the only open H1 zone; overlaps the H4 bull FVG and H4 OTE = demand stack.
- **H1 Bias: BEARISH-leaning/range — post-sweep fade complete, now flat at EQ.**

## Premium / Discount (H4)
- **Detector:** H 4115.74 / L 3942.86 | EQ **4029.30** | OTE 3979.86–4008.90 | price 4042.41 = marginal **PREMIUM**
- **Full structural range:** H 4145.04 / L 3942.86 | EQ **4043.95** | price ≈ EQ exactly
- **Read: price is AT equilibrium — no location edge in either direction.** Longs want the 3984.74–4012.55 demand stack or a reclaimed floor; shorts want the 4054–4064 intraday supply shelf or the 4102–4107 ceiling.

---

## Session Levels (00:11 UTC — ASIAN active, 07/02)

| Session | High | Low | Open |
|---------|------|-----|------|
| Asian (active, from 22:00 07/01) | 4068.59 | 3969.95* | 4034.33 |
| London (07/01) | 4108.21 | 3959.73 | 4022.02 |
| NY (07/01) | 4115.74 | 3979.43 | 4067.99 |

*Asian low carries the 07/01 print; the current Asian leg's actual floor is **4029.2** (23:45 07/01) / sweep wick 4032.03.

**Current:** 4042.51 / 4042.71 | Spread **2 ✓** | Session ASIAN
Basing 4029–4045 at the H4 EQ after the overnight fade; two consecutive M5 BoS UP (4040.72, 4045.33) off the 4033.18 SSL sweep.

---

## Key Levels

### Supply / Resistance (above ~4042)
| Level | Source | Notes |
|-------|--------|-------|
| **4054.46–4064.20** | M5 bear FVG cluster ×3 + M5 bear OB 4056.61–4059.88 | First supply shelf; M15 EQ 4058.95 inside it; NY-high flip 4063.6 at its top |
| **4068.59–4088.70** | Overnight descending highs | Fade sequence highs; break re-opens the ceiling |
| **4102.44–4107.40** | H4 bear FVG (filled, live S/R flip) | Twice-rejected ceiling (pin-bar 4106.99, sweep 4115.74) |
| **4115.74** | Swept BSL / 07/01 high | Liquidity taken — low-probability near-term target |
| **4145.04** | H4 swing high (06/23) | **The real range ceiling** — H4 close above = genuine bullish break |
| **4233.39–4239.57** | H4 bear FVG [open] | Only relevant above 4145.04 |

### Support / Demand (below ~4042)
| Level | Source | Notes |
|-------|--------|-------|
| **4036.66–4038.75** | M5 bull FVG [open] + M1 FVGs 4033.93–4036.58 | Intraday demand right under price |
| **4029.20 / 4032.03** | Overnight floor / SSL sweep wick | Asian basing floor — break kills the intraday long read |
| **3984.74–4012.55** | H4 bull FVG [open] + H1 bull FVG 3986–3997.64 + H4 OTE | **Primary demand stack** — the LONG reload zone |
| **3959.73** | 07/01 London low | Last defense above the floor |
| **3942.86** | Swept floor | **Close below re-opens breakdown to 3920/3900** |

---

## Trade Directional Guidance

### BIAS: NEUTRAL — range 3942.86 / 4145.04, price at EQ mid-range. Both completed impulses (recovery rally, ceiling fade) are spent. NFP at 12:30 UTC is the likely range-resolver — do NOT carry positions into it. Until then, only edge trades: fade the 4054–4064 supply shelf or buy the 3984.74–4012.55 demand stack, each with an M1 trigger.

**Current state: FLAT, WAIT — see [[Analysis/LTF/202607/20260702/20260702_0011_wait]] (Grade B 61/100, below B+). Alerts #174–178 bracket the box.**

---

**Setup A — LONG the demand stack (primary):**
- Condition: pullback into H4 bull FVG 3984.74–4012.55 / H1 3986–3997.64 (H4 OTE inside) + M15 CHoCH UP or clean M1 reversal trigger.
- Entry: ~3995–4010 | SL: below 3984 (beyond the FVG floor) | TP1: 4043.95 (EQ) | TP2: 4063.6
- Invalidation: M15 close below 3984.74 → next stop 3959.73 / floor 3942.86.

**Setup B — SHORT the supply shelf / ceiling (intraday):**
- Condition: M1 bearish trigger at 4054.46–4064.20 (M15 EQ + NY-high flip), or a deeper retest of 4102–4107.
- Entry: ~4058 (shelf) or ~4103 (ceiling) | SL: above 4065 / 4108 | TP: 4033 → 4012.55
- Invalidation: M5 close above 4064.2 (shelf) / 4108 (ceiling).

### BIAS RESOLUTION (watch these)
- **Range-up break (bull):** H4 close above **4145.04** → continuation toward 4233–4239 supply
- **Demand stack holds (bull, intraday):** reclaim from 3984–4012 → back to EQ 4043.95 → 4063.6 → ceiling
- **Demand stack fails (bear):** M15/H4 close below 3984.74 → 3959.73 → floor 3942.86; close below 3942.86 = open air 3920/3900
- **News: 🚨 NFP DAY — 12:30 UTC Nonfarm Payrolls + Unemployment Rate + Initial Claims + AHE (all HIGH), 14:00 Factory Orders (MED). Flatten / no new positions 12:15–13:00 UTC minimum; expect the 3942–4145 range verdict here. Re-run `analyze HTF` after the release.**
