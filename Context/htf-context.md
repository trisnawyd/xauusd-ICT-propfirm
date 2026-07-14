---
updated: 2026-07-14 12:52 UTC (fresh MCP pull, post-CPI — cold core (0.0% m/m) spiked gold 4030 → 4103.23 in one candle. The 07/14 BEAR map is DEAD, killed by its own stated invalidation. But the D1 lower-high series is INTACT (4103.23 < 4138.42) and the spike high was a BSL grab that got sold back. Bias: NEUTRAL / TRANSITIONAL — no tradeable HTF zone in EITHER direction)
source: MCP (detect_structure D1/H4/H1, detect_fvg H4/H1, detect_order_blocks H4/H1, detect_liquidity_sweeps H1, get_premium_discount D1/H4, get_swing_levels D1, get_ohlcv D1/H1/M1, get_session_levels, get_current_tick, get_account_info, get_pending_orders, get_economic_calendar)
snapshot: "[[Analysis/HTF/202607/20260714]]"
---

# HTF Context — XAU/USD

> ⏱ **All times in this file are UTC.** MCP candle/structure/calendar tools return **broker time (UTC+3)** — every timestamp below has had 3h subtracted. Only `get_session_levels` reports true UTC.

## Bias: NEUTRAL / TRANSITIONAL

**The bear thesis is dead, and it died on the exact line the last context drew for it.** The 01:56 HTF said: *"Bull revival (invalidates the bear thesis): H1 reclaim-hold above 4060.7 (H4 EQ) → 4067.51 → 4090–4097.56."* At 12:30 UTC a cold CPI core (**0.0% m/m** vs 0.2% f) did precisely that, in sixty seconds: **4030.26 → 4090.01**, extending to **4103.23**. Every level the bear map was built on — the 4020–4043 flipped supply, the 4047–4053 shelter, the 4060.70 invalidation — was consumed in a single candle. Do not carry that map forward.

**But I am NOT calling this bullish, and here is the uncomfortable part:** the spike high is a **liquidity grab, not an impulse leg**. The 12:00 UTC H1 candle swept **BSL@4080.97** and **BSL@4091.20**, wicked **4103.23**, and closed back **below both at 4079.86**. Price is now **4079.74** — parked within 3 points of **H4 EQ (4081.91)**, the literal definition of no-man's-land. And critically: **4103.23 is still a LOWER HIGH** against the 07/09 D1 swing high at **4138.42**. The D1 lower-high series (4382.31 → 4220.61 → 4203.17 → 4138.42) has **not** been broken. No D1 BoS up has printed.

**The finding: bear map DEAD, bull structure UNPROVEN. There is no tradeable HTF zone in either direction.** Every H4 and H1 FVG and order block now reads **mitigated — `open:0` across all four scans.** Gate 3 fails at market both long and short. That is the honest read, and forcing a direction here is exactly the error that authored the wrong CPI call this morning.

---

## The Pivot — 4081.91 H4 EQ (price is ON it) | 4103.23 above | 4032.20 below

- **4103.23 (day high / BSL grab)** — reclaim-and-hold above = the spike was real, bull continuation opens 4110.73 → **4138.42**.
- **4138.42 (D1 swing high, 07/09)** — **THE LEVEL.** A break kills the D1 lower-high series and only *then* is the macro bear structure genuinely dead.
- **4032.20 (H1 bull FVG top — FORMING, see caveat)** — retrace-long zone if the impulse is real.
- **4022.98 (CPI spike origin)** — lost = the entire CPI move has unwound; the fade is on.

## ✅ RESOLVED at 13:21 UTC — the FVGs have printed
The 12:52 read reported `open:0` on every FVG/OB scan and called Gate 3 a fail in both directions. **That was a data-timing artifact, as flagged** — an FVG needs 3 *closed* candles and the 12:00 UTC H1 candle was still open. It has since closed, and the spike's imbalance is now on the board:

- **H1 BULLISH 4032.20–4070.62 — [OPEN]**
- **H4 BULLISH 4034.37–4070.62 — [OPEN]**

**Gate 3 now PASSES for a long.** There is a real, unmitigated HTF demand zone. Setup A's precondition is met. (Note the correction: **4032.20 is the FVG FLOOR, not its top** — the top is **4070.62**. The 12:52 alert map had this backwards; alerts rebuilt as #177/#178.)

`detect_structure` labels on all three TFs remain **lagging** — their last printed events are 1–4 days stale and none reflect the spike. Read the tape, not the label.

## D1 Analysis
- **D1 (algo): BEARISH label.** Last event **BoS UP@4203.17 broke 4138.42 (07/06)** — 8 days stale, ignore. **No new D1 event has printed.**
- **07/13** = O4098.12 H4106.56 L3986.4 C4001.17 (bear marubozu, closed on the low).
- **07/14 (in progress)** = O3999.38 **H4103.23 L3983.2** C4080 — a **bullish outside day**: it swept below 07/13's low *and* recovered ~100 points, engulfing almost the entire prior candle. Textbook sweep-and-reverse — **if it closes here.** It is a 12-hour-old candle with 12 hours left to run.
- **D1 swings:** 4382.31 → 4220.61 → 4203.17 → **4138.42** (highs) | 3942.86 → 4021.56 → **3983.2** (lows, latest forming).
- **D1 P/D (4382.31/3942.86):** EQ **4162.59** | price 4078.79 = **DISCOUNT** | OTE **4036.9–4110.73** → **price is now INSIDE the D1 OTE** (this morning it was below it). That is a bullish relocation.
- **D1 Bias: BEARISH label, but structurally NEUTRAL.** The lower-high series is intact at 4138.42; the range floor 3942.86 was never tested. Nothing is resolved.

## H4 Analysis
- **H4 (algo): BULLISH label.** Last event BoS UP@4134.99 (07/10 01:00) — 4 days stale, ignore.
- **H4 P/D (4180.61/3983.2):** EQ **4081.91** | price 4078.67 = **DISCOUNT by 3 points** | OTE 4025.45–4058.61. **The range has re-anchored again** — EQ moved 4060.7 → **4081.91**, and price is sitting exactly on it. This is the fence.
- **H4 FVGs: 24 scanned, 0 OPEN.** **H4 OBs: 9 scanned, 0 OPEN.** Every zone mitigated.
- **H4 Bias: NEUTRAL.** Price at EQ, no zone above or below.

## H1 Analysis
- **H1 (algo): BULLISH label.** Last event BoS UP@4067.51 broke 4009.59 (07/13 13:00) — stale.
- **The live candle is the whole story.** 12:00 UTC: O4031.30 **H4103.23** L4022.98 C4080.17.
- **Sweeps on that one candle (all 12:00 UTC):**
  - **SSL@4047.18** and **SSL@4043.68** swept (wick 4022.98) → closed 4079.86. Sell-side stops taken *first*.
  - **BSL@4080.97** swept (wick **4103.23**) → closed **4079.86** — back below.
  - **BSL@4091.20** swept (wick **4103.23**) → closed **4079.86** — back below.
  - → **A double-sided raid.** It ran the sells, reversed, ran the buys, and closed in the middle. This is a liquidity event, not a trend.
- **H1 FVGs: 10 scanned, 0 OPEN.** **H1 OBs: 9 scanned, 0 OPEN.** (See timing caveat — a bull FVG is forming.)
- **H1 Bias: BULLISH momentum, overextended and rejected.** The close back under 4080.97 is the tell.

## Premium / Discount
- **D1 (4382.31/3942.86):** EQ 4162.59 | price 4078.79 = **DISCOUNT**, now **inside** the D1 OTE 4036.9–4110.73.
- **H4 (4180.61/3983.2):** EQ **4081.91** | price 4078.67 = **DISCOUNT by 3 points** — i.e. **AT equilibrium**.
- **Implication:** price at H4 EQ with **zero open zones on either side** means **both directions fail Gate 3 at market.** A LONG has no demand zone to buy (0 open H4/H1 OB/FVG); a SHORT has no supply zone to sell and would be selling *into* a fresh fundamental catalyst. **Neither direction is tradeable at market. That is the finding — same conclusion as this morning, opposite reason.**

---

## Key Levels

### Resistance / Supply (above ~4079.74)
| Level | Source | Notes |
|-------|--------|-------|
| **4080.97** | H1 BSL (swept 12:00) | Immediate pivot — price is under it |
| **4081.91** | **H4 EQ** | **THE FENCE.** Above = premium, below = discount |
| **4091.20** | H1 BSL (swept 12:00) | Second buy-stop shelf |
| **4103.23** | **DAY HIGH / spike high — BSL grab** | 🔔 #172 · Reclaim-hold = bull continuation is real |
| **4110.73** | D1 OTE top | Upper edge of the D1 discount OTE |
| **4138.42** | **D1 swing high (07/09)** | 🔔 #173 · **Break = D1 lower-high series DIES. Bear structure only truly dead here** |
| **4180.61** | H4 swing high (07/07) | Next objective if 4138.42 goes |

### Support / Demand (below ~4079.74)
| Level | Source | Notes |
|-------|--------|-------|
| **4058.61** | H4 OTE top | First shelf on a pullback |
| **4036.90** | D1 OTE floor | Loses the D1 OTE below here |
| **4032.20** | **H1 bull FVG top — FORMING** | 🔔 #174 · **Setup A retrace-long zone** (unconfirmed — see caveat) |
| **4025.45** | H4 OTE floor | Zone floor |
| **4022.98** | **CPI spike origin** | 🔔 #175 · Lost = the CPI move has fully unwound |
| **3983.20** | Day low / SSL (swept 03:00) | 🔔 #176 · **Full reversal — the bear map revives** |
| **3958.57 / 3942.86** | D1 swing low / D1 range floor | Only in play if the whole move unwinds |

---

## Trade Directional Guidance

### BIAS: NEUTRAL — **no trade at market, but Gate 3 now passes LONG on a retrace.**
Price (4077) sits between H4 EQ (4081.91) above and the confirmed bull FVG top (4070.62) below, inside post-news chop, with four Fed speakers still to come. The bear map is dead; the bull case is still a lower high that got rejected at 4103.23. **But the bull FVG has now printed — the long finally has a zone.** Trade the retest, not the spike.

**Setup A — LONG the retrace into the bull FVG (PRIMARY, LIVE):**
- **Precondition: MET** ✅ — H1 BULLISH **4032.20–4070.62 [OPEN]**, H4 BULLISH **4034.37–4070.62 [OPEN]**.
- Condition: pullback into the FVG + M15/M5 bullish rejection/CHoCH in the zone.
- Entry ~**4045** | SL **4022** (below the 4022.98 spike origin) | TP1 **4103.23** → TP2 **4138.42**.
- Calc: SL (4045−4022)×10 = **230 pips** → 0.02 lot = **$46.00** (max risk $49.35 ✓) | TP1 (4103.23−4045)×10 = **582 pips** → **R:R 2.5:1** ✓
- ⚠️ **DO NOT buy the FVG top.** Entry 4068 / SL 4030 = **380 pips** against a **352-pip** TP1 → **R:R 0.93:1 — fails the 1:2 hard rule.** The trade only exists on a **deeper fill toward 4045**. Alert #177 (4070.62) means *start watching*, NOT *enter*.
- Invalidation: H1 close below **4022.98**.

**Setup B — SHORT the failed spike (fade, CONDITIONAL):**
- Condition: **H1 close-hold below 4032.20** (the CPI move unwinding) → retest-short the underside.
- Entry ~**4030** | SL **4048** | TP **3983.20**.
- Calc: SL (4048−4030)×10 = **180 pips** → 0.02 lot = **$36.00** ✓ | TP (4030−3983.2)×10 = **468 pips** → **R:R 2.6:1** ✓
- Invalidation: reclaim above 4048.
- ⚠️ **This fades a genuine fundamental catalyst.** Requires the H1 close *first* — do not pre-empt it.

**Setup C — LONG/SHORT at market: NOT AVAILABLE.** Zero open H4/H1 OBs and FVGs. Price at H4 EQ. Fails Gate 3 both ways.

### BIAS RESOLUTION
- **Bull confirmation:** reclaim-hold **4103.23** → 4110.73 → **4138.42**. Only a break of **4138.42** kills the D1 lower-high series and makes the bull case structural.
- **Bull rejection / fade:** H1 close below **4032.20** → 4022.98 → 3983.20. The CPI move round-trips.
- **Bear revival:** close below **3983.20** → the entire 07/14 bear map comes back online (3958.57 → 3942.86).
- **⚠️ NEWS REMAINING (UTC — broker times in the calendar tool are +3h):** **16:40 & 16:55 Fed Barr**, **17:30 Fed Cook**, **18:55 Fed Bowman**, **20:00 TIC** — all MEDIUM. A Fed speaker framing the 0.0% core print is the next real volatility risk. No new entries ±15min around each.

### Book
Flat. **$4,934.73** balance/equity, **0 positions, 0 pendings**, daily P&L **$0.00**, full −$200 buffer intact. Max risk (1%) = **$49.35**. The pre-CPI pending #9954835 (SELL_LIMIT @4042.5) did **not** fill — see `Analysis/News/202607/20260714/20260714_0630_cpi.md` for why that was luck, not process.
