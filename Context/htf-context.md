---
updated: 2026-07-06 00:02 UTC
source: MCP (detect_structure D1/H4/H1, detect_fvg H4/H1, get_premium_discount H4, get_session_levels, get_current_tick, get_account_info, get_economic_calendar) — refreshed ASIAN 07/06 00:02 (Monday reopen). New HTF high 4202 above the prior 4195.5; price retraced to ~4176 (H4 premium / M15 discount). Bull regime intact.
snapshot: "[[Analysis/HTF/202607/20260706]]"
---

# HTF Context — XAU/USD

## Bias: BULLISH — new HTF high **4202** on the Monday Asian reopen (above the prior 4195.5), price pulled back to **~4176** (H4 PREMIUM, EQ 4069.18 / M15 discount). The 3942–4145 range broke up last week on the dovish NFP; this week opens by extending the high to 4202 then retracing. Clean **LONG-with-D1** regime with a rate-cut/weak-DXY tailwind. No long-location edge at 4176 (premium); the playable trade is a **pullback into up-leg demand (4127–4146 H4/H1 FVG, best confluence with the broken 4145.04 ceiling) + M1 bullish trigger**, OR a **continuation break-and-hold above 4202** (→ 4233 supply). Do NOT chase longs at 4176.

**Reason:** D1 BULLISH, last event BoS UP@4220.61 (06/22) — dated but directionally bullish, backed by the dovish-NFP macro. H4 label BULLISH — last *labeled* event stale (BoS DOWN@3959.73, 07/01) but price printed a fresh high **4202 above the old 4145.04 ceiling**, confirming the break holds; algo re-labels BoS UP on the next close above a labeled swing. H1 labels **lagging BEARISH** (last BoS DOWN@4162.59 @07/03 19:00 broker) — predates the Monday run to 4202; the open up-leg FVGs (4133–4146.24) are the imbalances the algo will convert on the next close-break. Net: **structurally bullish, retracing in premium.**

**What changed since 20260703 07:00 UTC:**
- **High extended 4195.5 → 4202** on the Monday Asian reopen, then rejected back to ~4170 and holding ~4176.
- **⚠️ Suspected bad tick:** `get_session_levels` reports Asian L **4122.61**, but M15 structure shows no swing below 4155.15, M1 30-candle low is 4170.11, and the resting below-4155/4162/4140 alerts never fired. Treat 4122.61 as a Sunday-reopen artifact; effective Asian range **~4155–4202**.
- **H4 4151.17–4160.61 FVG now FILLED** (was open on 07/03); the 4127–4146 stack remains the primary open up-leg demand.
- **News back on:** HIGH-impact US cluster **TODAY 13:45/14:00 UTC** (see below) — clear for Asian/early London, lockout 13:30–14:15 UTC.

---

## D1 Analysis
- **D1 trend (algo): BULLISH** — last event BoS UP@4220.61 broke 4096.36 (06/22). Price 4176 below 4220.61 but structure + macro point up.
- **D1 Bias: BULLISH.** Break of 4145.04 re-engages bullish structure toward 4220.61 / 4233.

## H4 Analysis
- **H4 trend (algo): BULLISH.** Last labeled event BoS DOWN@3959.73 (07/01) stale — new high 4202 above the old ceiling = effective bull-break/extension.
- **H4 P/D (detector 4195.5 / 3942.86):** EQ **4069.18** | OTE 3996.92–4039.37. Price 4176 = **PREMIUM** (detector high lags the 4202 print).
- **H4 FVGs open:** BULLISH **4127.24–4146.24** (07/03, up-leg + broken ceiling = best retest demand); BULLISH **4080.41–4100.08** (07/02, NFP-leg); BULLISH **4052.75–4052.94**; BULLISH **3984.74–4012.55** (deep stack, spans OTE). BEARISH **4233.39–4239.57** (next supply above 4202).
- **H4 Bias: BULLISH.** 4202 = continuation trigger; 4127–4146 = primary retest demand; 4080–4100 deeper; 4233 = next supply target.

## H1 Analysis
- **H1 trend (algo): BEARISH** (label) — **lagging**: last event BoS DOWN@4162.59 broke 4172.97 (07/03 19:00 broker), predates the Monday reopen. Effective read = bullish-extension.
- **H1 FVGs open:** BULLISH **4133–4146.24** (07/03, up-leg/ceiling-retest demand); BULLISH **3986–3997.64** (07/01, deep stack).
- **H1 Bias: BULLISH-transition** (labels stale, price above the breakout).

## Premium / Discount (H4)
- **Detector:** H 4195.5 / L 3942.86 | EQ **4069.18** | OTE 3996.92–4039.37 | price 4176 = **PREMIUM**
- **Read:** ~107 pts above EQ. No deep-discount long location up here; the up-leg FVG stack **4127–4146** is the intraday-relevant demand (old-ceiling confluence). Deeper longs want 4080–4100 or the 3984–4012 stack. Continuation longs take a break-hold above 4202.

---

## Session Levels (00:02 UTC — ASIAN active, London opens 08:00)

| Session | High | Low | Open |
|---------|------|-----|------|
| Asian (active) | 4202 | ~4155 (4122.61 = suspected bad tick) | 4182.9 |
| London (07/03) | 4186.88 | 4160.61 | 4177.38 |
| NY (07/03) | 4186.62 | 4155.15 | 4174.79 |

**Current:** 4175.95 / 4176.15 | Spread **2 ✓** | Session ASIAN → London
Asian ran to a new high 4202 then rejected to ~4170; price chopping ~4176, holding well above the broken 4145.04 ceiling.

---

## Key Levels

### Supply / Resistance (above ~4176)
| Level | Source | Notes |
|-------|--------|-------|
| **4186.88** | Prior London/NY high | Intermediate momentum reclaim |
| **4202** | New Asian/HTF high (07/06) | **Continuation trigger** — M5 break-and-hold → 4233 |
| **4233.39–4239.57** | H4 bear FVG [open] | Next supply / continuation TP |

### Support / Demand (below ~4176)
| Level | Source | Notes |
|-------|--------|-------|
| **4155.15** | M15 swing low / NY low | Intraday floor; loss = breakdown risk |
| **4127.24–4146.24** | H4 bull FVG + H1 4133–4146.24 [open] | **Primary Watch A LONG zone** — up-leg demand + broken 4145.04 ceiling |
| **4080.41–4100.08** | H4 bull FVG [open] (NFP-leg) | Deeper demand shelf |
| **4069.18** | H4 EQ | Premium/discount pivot — below = intraday bull read neutral |
| **3984.74–4012.55** | H4 + H1 3986–3997.64 + OTE | Deep primary demand stack (alert #178 @4012.55) |
| **3942.86** | Range floor / swept low | Close below re-opens breakdown to 3920/3900 (alert #158) |

---

## Trade Directional Guidance

### BIAS: BULLISH — high extended to 4202, price retracing in premium. LONG-with-D1 with dovish-NFP tailwind. No chase at 4176; the edge is a pullback into 4127–4146 up-leg demand + M1 bullish trigger, OR a continuation break-and-hold above 4202. A clean M15/H4 close below 4127 warns the break is failing (retest 4080–4100); below 4069 EQ neutralizes the intraday bull read.

**Setup A — LONG the ceiling-retest pullback (primary edge):**
- Condition: pullback into **4127–4146** (H4/H1 up-leg FVG + broken 4145.04 ceiling) + M1 bullish rejection/engulf.
- Entry ~4140 | SL below 4120 | TP1 4186.88 | TP 4202 / 4233.
- Invalidation: M15 close below 4107 → deeper 4080–4100; below 4069 = bull read neutral.

**Setup B — LONG the continuation break (secondary):**
- Condition: M5 break-and-hold **above 4202** + retest-hold.
- Entry ~4204 | SL 4190 | TP 4233.
- Invalidation: rejection wick at 4202 + M5 close back below 4190 → revert to Setup A.

**Setup C — SHORT (counter-trend, only at supply):**
- Condition: rejection at **4202** or **4233–4239** (H4 bear FVG) with M1 bearish trigger. Counter-trend vs D1 — scoring penalizes; needs premium + clean trigger.
- Entry ~4232 | SL 4241 | TP 4160. Lowest priority.

### BIAS RESOLUTION (watch these)
- **Continuation (bull):** M5 close above **4202** → 4233–4239 supply
- **Ceiling-retest hold (bull):** M1 bullish trigger in 4127–4146 → back to 4202 → 4233
- **Break-failing (caution):** M15/H4 close below **4127** → retest 4080–4100; below **4069** EQ = intraday bull read neutralized
- **Deep breakdown (bear, low prob):** M15/H4 close below 3984.74 → 3942.86; below 3942.86 = open air 3920/3900
- **News:** 🚨 HIGH-impact cluster **TODAY 13:45 UTC S&P Global Services PMI, 14:00 ISM Non-Mfg PMI + Prices Paid, 15:00 Fed Waller** — range-resolver; no new positions 13:30–14:15 UTC. Re-check `economic calendar` before London.
