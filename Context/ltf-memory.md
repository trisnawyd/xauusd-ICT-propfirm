---
updated: 2026-07-01 14:45 UTC
snapshot: "[[Analysis/LTF/20260701/20260701_1445_short]]"
---

# LTF Memory — Last 3 Analyses

## Current Market Structure (as of 2026-07-01 14:45 UTC)

**Account:** **FLAT** — no positions, no pendings. Equity **$5,000.36**, max risk **$50.00**. Daily P&L **−$28.36** (2 win, 1 loss). Spread 2 ✓. OVERLAP (14:45 UTC).

**Big picture:** price tagged the H4 bear FVG ceiling (4102.44–4107.40) at 4106.99 (17:25) with a clean pin-bar rejection — basis of the 14:29 SHORT plan, never filled (CONFIRM not given). Price then displaced through the zone on the 14:00 UTC ISM release, two closes above 4110, session high **4115.74** (17:36) — looked like genuine breakout continuation. It wasn't: `detect_liquidity_sweeps` caught a clean **BSL sweep@4108.21 (wick 4115.74, close 4095.96)** — stops swept, immediate reversal, closed back below the level. Price round-tripped the entire breakout in ~9 minutes back to **4092.4**. Second rejection at the same HTF-flagged zone.

**News:** ADP/ISM data cluster (12:15/14:00 UTC) all missed forecast+prior — bearish USD fundamentally (see [[Analysis/News/20260701/20260701_1436_us-manufacturing-data-miss]]). The 4106.99→4115.74 spike was the market pricing the weak data; the fade back to 4092 is the liquidity-grab/reversal — consistent with "sweep the news spike," not a contradiction of the bullish fundamentals.

**M15 Status:** label BULLISH, but live signal is the confirmed BSL sweep@4108.21 (17:30) — swept and rejected. EQ recalculates to ~4043 with the new 4115.74 high; price 4096 = PREMIUM either way.
**M5 Status:** label BEARISH, last formal event BoS DOWN@4082.22 (17:00, pre-spike/stale), but fresh BSL sweeps confirmed at both 4099.96 and 4108.21 — current signal is bearish reversal.
**M1 Status:** impulsive reversal candles 17:37–17:44 (4115.74 high → 4092.4), fresh open bearish FVG 4099.44–4104.83 (17:41) — the retest/entry zone.
**HTF frame (00:20 UTC, ~14.5h old, still fresh):** NEUTRAL range 3942.86–4106 RECOVERING UP. Ceiling zone (4102.44–4107.40) has now been tested twice and held both times (pin-bar + sweep-reject).

**Key Levels:**
- **4108 — SHORT invalidation | 4102.44–4107.40 — H4 bear FVG ceiling | 4115.74 — session high / swept level | 4145 — H4 range high (if ceiling truly breaks)**
- **4103 — SHORT entry retest (M1 bear FVG 4099.44–4104.83) | 4063.60 — NY high / TP1 flip zone | 4039.61 — M15 EQ (old range)**
- **3959.73 — today's ASIAN low / session floor | 3942.86 — swept floor / breakdown level**

**Setup:** 🔴 **SHORT proposed — liquidity sweep + reject at H4 ceiling, A (81/100), awaiting user CONFIRM.** Entry 4103 (retest of M1 bear FVG), SL 4108, TP 4063.6 (7.88:1). Counter-trend vs D1 but at the exact pre-identified H4 supply zone with a tool-confirmed liquidity sweep trigger. Not filled yet — price currently 4092.4, below the entry zone. Alerts #172 (entry @4103) / #173 (invalidation @4108) set.

---

## Analysis #1 — 2026-07-01 14:45 UTC (SHORT — liquidity sweep + reject at H4 ceiling, awaiting CONFIRM)

- **Direction:** SHORT — confirmed BSL liquidity sweep@4108.21 (wick 4115.74, close 4095.96) at the H4 bear FVG ceiling, second rejection of the same zone. Counter-trend vs D1, satisfied via Gate 3's stricter counter-trend rule (real H4 supply zone).
- **Entry:** 4103 (M1 bear FVG retest) | **SL:** 4108 | **TP:** 4063.6 (7.88:1) | **Grade:** A (81/100)
- **Invalidation:** M5 close/hold above 4108 → reopens range-break continuation toward 4145.

---

## Analysis #2 — 2026-07-01 14:29 UTC (SHORT — H4 ceiling rejection, no_fill/invalidated then vindicated)

- **Direction:** SHORT — price tagged H4 bear FVG ceiling at 4106.99, M1 pin-bar rejection. Never confirmed/filled by user.
- **Entry:** ~4101.5 | **SL:** 4110 | **TP:** 4063.6 (4.46:1) | **Grade:** B+ (76/100)
- **Outcome:** `no_fill` — price displaced through 4110 to 4115.74 before the plan could fill, initially logged as invalidated breakout. Re-read at 14:45 UTC: the displacement was itself a liquidity sweep (BSL@4108.21) that immediately reversed — the original thesis was directionally correct, just needed the sweep to complete. No loss taken either way; CONFIRM gate did its job twice over.

---

## Analysis #3 — 2026-07-01 13:28 UTC (WAIT — Gate 3 P/D-timing, ARMED)

- **Direction:** WAIT — M15/M5 last event BoS UP proposed LONG (WITH D1 trend), but price 4039.64 was in M15 PREMIUM after the fast recovery leg from 3973→4039 — no zone to chase.
- **Watch A (ARMED):** pullback into M5 bull FVG 3991.4–3993.55 → LONG ~3993.5, SL 3984, TP 4034 (4.3:1), projected B+ (75). **Never filled — no pullback came before the rally continued straight through to 4106.99.**
- **Watch B:** rejection at H4 EQ 4043.95 → SHORT ~4044, SL 4054, TP 4020 (2.4:1). Alert fired instantly with a clean push-through — thesis invalidated at that level, but the same idea played out correctly one level higher at the true H4 ceiling (now confirmed twice — see #1/#2 above).
- **Invalidation:** both watches void on M15 close below 3959.73.

---
