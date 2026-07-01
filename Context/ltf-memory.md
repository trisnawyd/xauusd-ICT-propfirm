---
updated: 2026-07-01 07:23 UTC
snapshot: "[[Analysis/LTF/20260701/20260701_0723_long]]"
---

# LTF Memory — Last 3 Analyses

## Current Market Structure (as of 2026-07-01 07:23 UTC)

**Account:** **FLAT** — no positions, no pendings. Equity **$4,980.12**, max risk **$49.80**. Daily P&L **−$48.70**. Spread 2 ✓. ASIAN (07:23 UTC).

**Alert #161 (@3961, SHORT-continuation trigger) fired** — price swept through it to a fresh session low **3959.73** (07:07–07:15 UTC), but instead of continuing toward 3942.86 it reversed hard: M15-confirmed SSL sweep+reclaim (3962.97 → wick 3959.73 → closed back 3969.63), M1 displacement candle to 3970.82, now consolidating 3967.78–3970.51 right on top of a fresh M5 bullish FVG (3964.76–3968.36) inside the M15 OTE (3968.18–3972.26). This flips the SHORT-continuation thesis dead and produces a fresh **LONG** setup — graded **B+ (71/100)**, same grade as the 02:20 setup that failed.

**⚠️ Third sweep+reclaim ASIAN long inside ~30h.** 06/30 01:21 cut −$9.11; 07/01 02:20 stopped full −$48.70. This one (07:23) recommended at reduced size (0.03 lot) rather than full 1%, pending user CONFIRM — not yet executed as of this save.

**calculate_lot_size tool bug found:** returned lot 0.49 / risk $498.01 for sl_pips=100 — 10x the correct 1% figure ($49.80 → should be 0.05 lot / $50.00 per the account's own lot table). Used the manual formula instead. Needs a server.ts config check (looks like risk% defaulting to 10 instead of 1).

**News:** 🚨 HIGH-impact US TODAY — 12:15 UTC ADP NFP, 13:45 S&P Manu PMI, 14:00 ISM Manufacturing PMI + Prices Paid (~5h out) = range-resolver, flatten before it.

**M15 Status:** label BEARISH (stale — last logged event BoS UP@3979.14 05:45 UTC predates the fresh sweep); true latest structural event is the SSL sweep+reclaim at 3962.97/3959.73/close 3969.63 (07:15 UTC). EQ 3975.14, OTE 3968.18–3972.26, price 3968.07 = DISCOUNT.
**M5 Status:** label BULLISH (also stale — last event BoS DOWN@3963.07 06:30 UTC, predates the deeper sweep to 3959.73). Only 1 open OB (BEARISH 3983.1–3987.3, ~15 pips above). 2 open FVGs: BEARISH 3990.56–3993.78 (supply, above) and fresh BULLISH 3964.76–3968.36 (demand, at price).
**M1 Status:** displacement candle 3966.34→3970.82 high→3970.46 close (07:19 UTC) off the 3959.73 low, consolidating 3967.78–3970.51 since, last price 3968.07/3968.27.
**HTF frame (00:20 UTC, ~7h old, fresh):** NEUTRAL range 3942.86–4106 RECOVERING UP; H1 bull FVG demand 3971.34–3974.95 still the higher-timeframe zone of record (this LONG works a shallower, fresher M5/M15 zone instead).

**Key Levels:**
- **4102–4107 — H4 ceiling | 4043.95 — H4 EQ | 4013–4016 — old M15 reclaim line**
- **3990–3994 — open M5 bear FVG (supply) | 3983.1–3987.3 — open M5 bear OB (supply) | 3971.34–3974.95 — H1 bull FVG (prior demand, breached)**
- **3968.18–3972.26 — M15 OTE | 3964.76–3968.36 — fresh M5 bull FVG (current entry zone) | 3959.73 — fresh sweep low (invalidation reference) | 3942.86 — Asian swept floor (major support)**

**Setup:** ⛔ **LONG CANCELLED — never filled.** User CONFIRMed, but price broke back below the entry FVG (3970.6 → 3962.8, 3 consecutive bearish M1 closes) in the ~4 min between proposal and execution. Claude held the order rather than fill into a failing zone. This is now the THIRD failed long-side reclaim attempt at this general level this session — treat the next bounce here with high suspicion; the breakdown thesis (old Watch B: M5 close <3958/3959.73 → 3942.86) is regaining credibility. No fresh trade taken; re-run LTF for a clean read before acting further.

---

## Analysis #1 — 2026-07-01 07:23 UTC (LONG — sweep+reclaim off fresh low, alert-triggered)

- **Direction:** LONG — alert #161 fired on a sweep through 3961 to a fresh low 3959.73, M15-confirmed SSL sweep+reclaim (close back 3969.63), fresh M5 bullish FVG + M15 OTE overlap at price. B+ (71/100).
- **Trade Plan:** entry ~3968, SL 3958, TP 3990 (2.2:1). Recommended reduced size 0.03 lot ($30 risk) vs. formula 0.05 ($50) given this is the 3rd similar-pattern long in 30h.
- **Status:** Proposed, awaiting explicit CONFIRM — not yet placed.
- **Invalidation:** M5 close back below 3958 (3rd reclaim failure → 3942.86 next).

---

## Analysis #2 — 2026-07-01 06:28 UTC (WAIT — Gate 3, no zone / no arm)

- **Direction:** WAIT — the 02:20 sweep-reclaim long (#7177967) stopped out −$48.70; the H1 demand zone 3971–3975 it was built on had been breached to a fresh low 3962.97. No open M5 OB/FVG at price 3967.82 at the time.
- **Outcome:** superseded ~55 min later when price swept deeper to 3959.73 and reclaimed, producing a fresh M5 FVG and the 07:23 LONG setup above.
- **Invalidation (as written):** Watch A void M5 close <3961; Watch B void M5 close >3975 — both technically overtaken by the fresh sweep.

---

## Analysis #3 — 2026-07-01 02:20 UTC (LONG — sweep+reclaim of range low, armed pending)

- **Direction:** LONG — armed BUY_LIMIT #9218593 @3976, sweep+reclaim of the M15 range low 3975.72→3969.95 confirmed on M1. B+ (71/100).
- **Outcome:** FILLED 3975.93 (~04:00 UTC) → STOPPED OUT 3963.78 (~06:04 UTC), −$48.70. The reclaim did not hold; price re-broke below 3969.95 and ran the stop.
- **Invalidation (as written):** M5 close below 3965 kills the thesis — this is what triggered.

---
