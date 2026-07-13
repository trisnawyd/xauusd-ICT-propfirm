---
updated: 2026-07-13 03:21 UTC (fresh MCP pull — the 07/10 bear thesis EXECUTED: weekend gap down 4120.64 → 4098.12, then a straight sell-off through 4085.43 into 4052.79. Both projected targets 4064 and 4054 hit. Bias flips NEUTRAL → BEARISH; price now sits in H4 OTE discount on a fresh 4054 SSL sweep — do NOT chase the short here)
source: MCP (detect_structure D1/H4/H1, detect_fvg H4/H1, detect_order_blocks H4/H1, detect_liquidity_sweeps H1, get_premium_discount D1/H4, get_swing_levels D1/H4/H1, get_ohlcv D1/H1, get_session_levels, get_current_tick, get_economic_calendar)
snapshot: "[[Analysis/HTF/202607/20260713]]"
---

# HTF Context — XAU/USD

## Bias: BEARISH — the down-leg fired and ran. Friday closed **4120.64**; gold **gapped down to 4098.12** on the Monday open and sold off without a meaningful bounce: **4106.56 high → 4052.79 low**, now **4059.1**. The 07/10 bear trigger (**M5 close-hold below 4085.43 → 4064 → 4054 → 4021**) played out exactly — **4064 and 4054 are both already taken**. Price has broken below the **4073.12 H4 swing low** (the H4 `BULLISH` label is stale — its last printed event is 07/10; the live break is DOWN) and every H1/H4 FVG and OB below 4100 is now **filled**. The only open supply left is the **fresh H4 bear FVG 4090.17–4097.56** carved by today's drop.

**The uncomfortable part:** the trend is bearish, but **this is the worst possible place to sell**. Price is in **D1 DISCOUNT** (EQ 4162.59) and sitting **inside the H4 OTE discount 4055.6–4082.32**, and the last H1 candle just **swept the 4054.03 SSL** (wick 4052.79, closed back up at 4059.94). Selling 4059 is selling the bottom of a completed 60-point leg into a sweep. The with-trend trade is to **wait for the retrace into 4085–4097 supply and short that** — not to chase the break that already happened. The last three losses in this book all came from doing the impatient version of this.

**Continuity note:** the pivot shelf has stepped DOWN again — **4138 → 4101 → 4085 → now 4073/4052**. The 4085.43 level that was the SSL floor for two sessions is now the **flipped resistance ceiling**. The floor that matters is **4021.56** (D1 low / range floor); below it there is a genuine air-pocket down to the **3984.74–4012.55 H4 bull FVG**. Nothing bullish is on the table until price reclaims and holds **4101.09 (H4 EQ)**.

---

## The Pivot — 4085–4097 flipped supply vs 4052.79 sweep-low vs 4021.56 floor
- **4085.43 (old SSL, now flipped resistance) ∩ 4090.17–4097.56 (H4 bear FVG, OPEN) ∩ 4091.2 (H1 swing high) ∩ 4101.09 (H4 EQ)** — the retrace-supply band; rejection here = **with-trend SHORT (PRIMARY)**.
- **4052.79 (today's low, SSL swept) ∩ 4055.6–4082.32 (H4 OTE discount)** — where price is now; a sweep-and-reclaim pocket, NOT a short-entry zone.
- **Bear continuation:** M5/H1 close-hold below **4052.79** → 4036.9 (D1 OTE floor) → **4021.56** → 3984–4012. **Bear invalidation / bull revival:** H1 reclaim-hold above **4101.09** → 4106 → 4121.

## D1 Analysis
- **D1 (algo): BEARISH label**; last printed event **BoS UP@4203.17 broke 4138.42 (07/06)** — stale, and now overwhelmed by price action: today's candle is **O4098.12 H4106.56 L4052.79 C4059.76**, a −61 range-day off Friday's close with no bullish rejection.
- **D1 swings:** highs 4382.31 → 4203.17 → 4138.42 | lows 3942.86 → 4021.56 = **RANGE 3942.86–4382.31**.
- **D1 P/D (4382.31/3942.86):** EQ **4162.59**. Price 4059 = **DISCOUNT**, and **inside the D1 OTE 4036.9–4110.73**.
- **D1 Bias: BEARISH within a range that is still intact.** The range only resolves on a daily close below **3942.86** (bear) or above ~**4162.59** EQ (bull). Until then, 4021.56 is the floor to respect.

## H4 Analysis
- **H4 (algo): BULLISH label — IGNORE IT.** The last printed event is **BoS UP@4134.99 broke 4121.02 (07/10 04:00)**, three sessions stale. Live price has **broken below the 4073.12 H4 swing low**, which is an unprinted H4 breakdown; the next `detect_structure` refresh will very likely flip this label to BEARISH.
- **H4 P/D (4180.61/4021.56):** EQ **4101.09** | OTE **4055.6–4082.32**. Price 4059 = **DISCOUNT, inside OTE**.
- **H4 FVGs open (2):** **BEARISH 4090.17–4097.56 (07/13 00:00)** — fresh supply from today's drop, **the primary short zone**. **BULLISH 3984.74–4012.55** — deep demand, only in play below 4021.
- **H4 OBs: 0 open** — every H4 order block is filled. No demand shelf between price and 4021.56.
- **H4 Bias: BEARISH.** Resistance 4073 → 4085 → 4090–4097 → 4101; support 4052.79 → 4036.9 → 4021.56.

## H1 Analysis
- **H1 (algo): BEARISH label**, last printed event **BoS UP@4115.63 (07/10 19:00)** — stale, pre-weekend. Live structure is a clean sequence of lower highs/lows since the Monday open: 4106.56 → 4091.2 → 4077.7 → 4069.6, low 4052.79.
- **H1 FVGs: 0 open** (the 4084.99–4108.25 bear FVG from 07/13 01:00 already filled). **H1 OBs: 0 open.** No unmitigated H1 zone anywhere — a rally has nothing to lean on until 4085–4097.
- **Sweeps:** **SSL@4073.12** swept (wick 4070.04, close 4076.43) then failed; **SSL@4054.03 swept on the newest candle** (wick 4052.79, close 4059.94) — a live sell-side grab, unconfirmed.
- **H1 Bias: BEARISH, but extended.** Six straight down-hours with no retrace; the odds of a mean-reversion bounce into 4073–4085 before the next leg are high.

## Premium / Discount
- **D1 (4382.31/3942.86):** EQ 4162.59 | price 4059 = **DISCOUNT**, inside D1 OTE 4036.9–4110.73.
- **H4 (4180.61/4021.56):** EQ 4101.09 | price 4059 = **DISCOUNT**, inside H4 OTE 4055.6–4082.32.
- **Implication:** a SHORT taken here is a **short in discount** — it fails the Gate 3 P/D check. The with-trend short only becomes valid once price is pushed back up into the **4085–4101 premium/supply band**.

---

## Key Levels

### Resistance / Supply (above ~4059)
| Level | Source | Notes |
|-------|--------|-------|
| **4064.6 / 4069.6** | Intraday micro-highs | First friction on a bounce |
| **4073.12** | H4 swing low (broken) | **Flipped support→resistance**; first real retrace target |
| **4082.32** | H4 OTE top | Upper edge of the discount pocket |
| **4085.43** | Old London/NY SSL floor | **Flipped resistance** — the shelf that broke |
| **4090.17–4097.56** | **H4 bear FVG [OPEN]** | **PRIME SHORT ZONE — the only open supply** |
| **4091.2** | H1 swing high (today) | Confluence inside the FVG |
| **4101.09** | H4 EQ | **Bear invalidation — reclaim-hold above revives bulls** |
| **4106.56** | Today's high | Monday-open rejection level |
| **4121.02 / 4134.99** | H4 swing / prior ceiling | Deeper supply, not in play |

### Support / Demand (below ~4059)
| Level | Source | Notes |
|-------|--------|-------|
| **4055.6–4082.32** | H4 OTE discount | Price is inside it now |
| **4052.79** | Today's low (SSL swept) | Close-hold below → continuation |
| **4036.90** | D1 OTE floor | First target below the low |
| **4021.56** | D1 low / range floor | **The floor. Daily close below = bear resolution** |
| **3984.74–4012.55** | H4 bull FVG [OPEN] | Deep demand / only real LONG reload |
| **3942.86** | D1 range low | Range-break level |

---

## Trade Directional Guidance

### BIAS: BEARISH — but price is at the wrong end of the move. All three timeframes point down and the 4085.43 break ran its full projected path to 4054. Do **NOT** chase a short at 4059: it is in D1+H4 discount, inside H4 OTE, on a fresh 4054 SSL sweep. **Sell the retrace into 4085–4097, don't sell the low.** Nothing bullish exists above a tactical bounce until 4101.09 is reclaimed and held.

**Setup A — SHORT the retrace into flipped supply (with-trend, PRIMARY):**
- Condition: bounce into **4085–4097** (H4 bear FVG 4090.17–4097.56 ∩ flipped 4085.43 SSL ∩ 4091.2 H1 swing high) + M15/M5 bearish rejection/CHoCH in premium.
- Entry ~**4090** | SL **4102** (above H4 EQ) | TP **4052.79** → **4036.9** → **4021.56**.
- Calc: SL (4102−4090)×10 = **120 pips** | TP1 (4090−4052.79)×10 = **372 pips** → **R:R 3.1:1**.
- Invalidation: H1 reclaim-hold above **4101.09** → bulls back toward 4106/4121.

**Setup B — SHORT the continuation (with-trend, confirmation):**
- Condition: M5/H1 **close-hold below 4052.79** (no reclaim) → retest-short the underside.
- Entry ~**4052** | SL **4064** | TP **4021.56**.
- Calc: SL 120 pips | TP 304 pips → **R:R 2.5:1**.
- Invalidation: reclaim back above 4064.

**Setup C — LONG the sweep-reclaim (COUNTER-TREND, tactical only, lowest confidence):**
- Condition: the **4054.03 SSL sweep** (wick 4052.79) holds + **M15 bullish CHoCH** confirms. Qualifies under the Gate 3 counter-trend rule only because price is **inside the H4 OTE discount (4055.6–4082.32)**.
- Entry ~**4062** | SL **4050** | TP **4085** → **4090**.
- Calc: SL 120 pips | TP (4090−4062)×10 = **280 pips** → **R:R 2.3:1**.
- **Caveat:** this is a counter-trend bounce into the very supply band Setup A wants to short. Take it only on a confirmed M15 CHoCH, treat it as a scalp to 4085, and do not hold it through the FVG.
- Invalidation: M5 close-hold below 4052.79.

### BIAS RESOLUTION
- **Retrace short (base case):** bounce into 4085–4097 + reject → 4052.79 → 4036.9 → 4021.56.
- **Continuation short (confirmation):** close-hold below 4052.79 → 4036.9 → 4021.56.
- **Bear resolution:** **daily close below 4021.56** → opens the 3984.74–4012.55 H4 FVG → 3942.86.
- **Bull revival (invalidates the bear thesis):** H1 reclaim-hold above **4101.09** → 4106.56 → 4121.02.
- **News (UTC, all MEDIUM — no HIGH-impact today):** **09:25 Fed Bowman speech**, **16:30 Fed Waller speech**, **18:00 Federal Budget Balance**. Fed-speaker headlines can spike gold — avoid entering in the 10 min around 09:25 and 16:30.
