---
updated: 2026-06-29 05:38 UTC
snapshot: "[[Analysis/LTF/20260629/20260629_0538_wait]]"
---

# LTF Memory — Last 3 Analyses

## Current Market Structure (as of 2026-06-29 05:38 UTC)

**Account:** **FLAT** — no positions, no pendings. Equity **$5,050.99**, max risk **$50.51**. Daily P&L **+$0.45** (scratch short #7114992 closed BE). Spread 2.0 ✓. ASIAN (05:38 UTC). ⏱️ Clock: session_levels UTC authoritative; M1 stamps broker GMT+3 (08:xx = 05:xx UTC).

**⏸️ WAIT — Gate 4, H4 demand tap with no M1 trigger (no arm):** The 02:29 EQ pin resolved DOWN — price broke below the M15 range low 4046.96 (displacement 4049→4040.57) and now sits at **4042 inside the 4039-4043 H4 bull FVG** (real HTF demand, Watch A long zone; alert #122 @4044 fired). M15 DISCOUNT = correct side for a long, but NO M1 reclaim yet and a fresh bearish M5 FVG 4045.83-4047.8 printed overhead. Projected long grade B (~60) < B+ (capped by Asian timing + neutral/counter HTF + falling-knife tape) = **no arm** — a resting BUY_LIMIT into a knife is the 06/26 stop-out mechanic. Decision line: hold 4039 + M1 reclaim = LONG; M5 close <4035 = breakdown SHORT to 3982 floor. News: Hormuz upside wildcard; HIGH-impact US data 16:45-17:00 UTC (~11h out) = range-resolver.

**Today's trade:** #7114992 SELL 4054.08 → 4053.83, net **+$0.45** (8 min, scratch) — discretionary counter-move short at range mid, chopped just before the breakdown. Not a planned A/B setup.

**M15 Status:** trend BEARISH (label), last BoS UP@4075.78 (06:15) then reversed + broke swing low 4046.96 → now 4042 below range. Range 4075.78 / 4046.96, EQ 4061.37 → deep DISCOUNT. OTE 4053.13-4057.97.
**M5 Status:** 10 OBs all filled. 2 open FVGs — BEARISH 4061.87-4063.85 (overhead) + BEARISH 4045.83-4047.8 (just above price = Watch B short zone if 4039 fails).
**M1 Status:** displacement down 08:30, then chop 4041-4046, last close 4042.41. No bullish reclaim, no trigger.
**HTF frame (00:47 UTC, fresh):** NEUTRAL range 3958.57-4106; price now at the LOWER edge (4039-4043 H4 demand). Overhead supply 4102-4107 / 4090. Floor 3982.74 → 3958.57.

**Key Levels:**
- **4102-4107 — H4 bear FVG / ceiling (#117 @4102)** | **4090 — Asian high BSL (#120 @4090)**
- **4061.37 — M15 EQ (Watch A long target / reclaim line)**
- **4039.92-4042.99 — H4 bull FVG demand = price NOW (decision line: hold=long, break=short)**
- **4035 — breakdown trigger (#123) | 3982 — range-floor (#121) | 3958.57 — bear-invalidation floor (#109)**

**Setup:** WAIT — at H4 demand, no M1 trigger, projected long < B+. Watch A LONG on M1 reclaim above ~4047 (entry ~4044, SL 4034, TP 4064/4090, 2:1). Watch B SHORT on M5 close <4035 → retrace into 4045-4048 bear FVG (entry ~4046, SL 4056, TP 4012/3982, 3.4:1). Alerts: #109 3958.57, #117 4102, #120 4090, #121 3982, #123 4035 (added; #122 4044 fired on the demand tap).

---

## Analysis #1 — 2026-06-29 05:38 UTC (WAIT — Gate 4, H4 demand tap, no trigger)

- **Direction:** WAIT — EQ pin resolved down; price broke M15 range low 4046.96, now 4042 inside the 4039-4043 H4 bull FVG in deep discount (Watch A long location, #122 @4044 fired). No M1 reclaim + fresh bear M5 FVG overhead = no trigger. Projected long grade B (~60) < B+ → no arm (no resting limit into a falling knife). Scratch short #7114992 closed BE (+$0.45).
- **Watch A (LONG, demand reclaim):** hold 4039-4043 + M1 bullish reclaim >~4047 / M5 CHoCH up → ~4044, SL 4034, TP1 4064 (2:1) / TP2 4090 (4.6:1). Needs M1 trigger.
- **Watch B (SHORT, breakdown):** M5 close <4035 (demand fails) → short retrace into 4045.83-4047.8 bear M5 FVG → ~4046, SL 4056, TP1 4012 (3.4:1) / TP2 3982 (6.4:1). Alert #123 @4035.
- **Invalidation:** Watch A void M5 close <4034 (→ flips to B); Watch B void M5 close >4056. Range breaks down H4 close <3982 → 3958.57; up H4 close >4107 → 4145.

---

## Analysis #2 — 2026-06-29 02:29 UTC (WAIT — Gate 3, no zone + SHORT-in-discount)

- **Direction:** WAIT — EQ pin held, price ~4070. M15 last event flipped BoS DOWN@4053.65 (proposed SHORT) but price in M15 DISCOUNT = wrong side; all M5 OB/FVG filled = no live zone. #119 @4055 confirmed stale, deleted. No arm (supply short discretionary, not a resting limit). [Subsequently resolved DOWN to the 4039-4043 H4 demand — see #1.]
- **Watch A (LONG, range-low fade):** pullback into 4039-4043 H4 bull FVG + M1 reclaim → ~4042, SL 4028, TP1 4071 (2.1:1) / TP2 4090 (3.4:1).
- **Watch B (SHORT, range-high fade, DISCRETIONARY):** tag 4090/4096 or 4102-4107 + M5 CHoCH-DOWN → ~4099, SL 4114, TP1 4064 (2.3:1) / TP2 4042 (3.8:1).
- **Invalidation:** both void on range break (H4 close >4107 bull / <3982 bear).

---

## Analysis #3 — 2026-06-29 00:47 UTC (WAIT — Gate 4, mid-range no-edge)

- **Direction:** WAIT — HTF downgraded to NEUTRAL range 3958-4106 (06/26 bull-lean stalled at 4096, reverted to EQ). M15 proposed LONG but price 4066 mid-range at EQ = no trigger, no edge. No arm (projected long B 59).
- **Watch A (LONG):** pullback into 4057-4063 M5 bull FVG / M15 OTE + M1 confirm → ~4060, SL 4046, TP1 4088 (2:1) / TP2 4096 (2.6:1).
- **Watch B (SHORT):** tag 4096.36 / 4102-4107 + M5 CHoCH DOWN → ~4099, SL 4113, TP1 4069 (2.1:1) / TP2 4042 (4.1:1).
- **Invalidation:** both void on range break (H4 close >4107 bull / <3982 bear).
