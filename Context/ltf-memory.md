---
updated: 2026-07-01 07:45 UTC
snapshot: "[[Analysis/LTF/20260701/20260701_0745_wait]]"
---

# LTF Memory — Last 3 Analyses

## Current Market Structure (as of 2026-07-01 07:45 UTC)

**Account:** **FLAT** — no positions, no pendings. Equity **$4,980.12**, max risk **$49.80**. Daily P&L **−$48.70**. Spread 2.2 ✓. ASIAN (07:45 UTC).

**Alert #162 (@3972, OTE-clear reclaim confirm) fired** — after the cancelled 07:23 long, price based at a **higher low (3960.65, vs. the prior 3959.73)** and pushed cleanly through 3968 → 3972 → 3973.14. M5 structure flipped BEARISH → BULLISH. This is the 4th test of the same demand level this session with shrinking sweep depth each time — constructive, but price has now run PAST the entry zone (OTE 3965.63–3970.26, FVG 3965.24–3968.13) with nothing to retest at current price (3971.79) → **Gate 3 WAIT, no zone at price, do not chase.**

**News:** 🚨 HIGH-impact US TODAY — 12:15 UTC ADP NFP, 13:45 S&P Manu PMI, 14:00 ISM Manufacturing PMI + Prices Paid (~4.5h out) = range-resolver, flatten before it.

**M15 Status:** label BULLISH now (flipped); last logged event still stale (BoS UP@3979.14, 05:45 UTC) — detector hasn't caught up to the 3959.73→3960.65→reclaim sequence. EQ 3973.52, OTE 3965.63–3970.26, price 3971.79 = just above OTE, approaching EQ.
**M5 Status:** label BULLISH; last event also stale (BoS DOWN@3959.73, 07:15 UTC). 0 open OBs (all consumed by the reclaim). Open FVGs: BULLISH 3965.24–3968.13 (below price, Watch A retest zone) and BEARISH 3990.56–3993.78 (well above, supply).
**M1 Status:** clean uptrend off the 3960.65 low — 3966.01→3967.71→3968.8→3969.93→3971.26→3971.94, high 3973.14, no pullback yet to test if the breakout holds.
**HTF frame (00:20 UTC, ~7.5h old, fresh):** NEUTRAL range 3942.86–4106 RECOVERING UP.

**Key Levels:**
- **4102–4107 — H4 ceiling | 4043.95 — H4 EQ | 4013–4016 — old M15 reclaim line**
- **3990–3994 — open M5 bear FVG (supply) | 3983.1–3987.3 — recent M5 bear OB (filled, resistance-on-retest) | 3973.52 — M15 EQ (Watch B trigger)**
- **3965.24–3968.13 — open M5 bull FVG (Watch A retest zone) | 3960.65 — latest higher low (invalidation ref) | 3959.73 / 3942.86 — prior sweep low / Asian swept floor**

**Setup:** 🟢 **LONG OPEN — Watch B filled.** Alert #165 fired (M5 close above EQ 3973.52 confirmed at 3976.31), user entered #9226130 BUY 0.04 @3973.78, SL 3965 / TP 4001 (3.1:1), graded B+ (70) in [[Analysis/LTF/20260701/20260701_0801_long]]. Watch A (#164, pullback retest) deleted — moot with a live position on. #163 (3960.65 breakdown) left active as a structural backstop below the SL.

---

## Analysis #1 — 2026-07-01 07:45 UTC (WAIT — Gate 3, no zone / do not chase)

- **Direction:** WAIT — alert #162 fired (price cleared 3972), 4th test of the demand level held with a genuine higher low (3960.65) and M5 flipped bullish, but price has run past the OTE/FVG entry zone to 3971.79 with EQ (3973.52) next — nothing to retest at price.
- **Watch A (preferred):** pullback into M5 bull FVG 3965.24–3968.13 + M1 reaction → LONG ~3967, SL 3957, TP 3990 (2.3:1).
- **Watch B:** M5/M15 close above EQ 3973.52 → LONG ~3974, SL 3965, TP 4001 (3.0:1).
- **Invalidation:** Watch A void on close below 3960.65 (4th reclaim failure); Watch B void on rejection below 3968.

---

## Analysis #2 — 2026-07-01 07:23 UTC (LONG — CANCELLED, no_fill)

- **Direction:** LONG — alert #161 fired on a sweep through 3961 to a fresh low 3959.73, M15-confirmed SSL sweep+reclaim (close back 3969.63), fresh M5 bullish FVG + M15 OTE overlap at price. B+ (71/100).
- **Outcome:** User CONFIRMed, but price broke back below the entry FVG (3970.6→3962.8, 3 consecutive bearish M1 closes) before fill — order held, never placed. calculate_lot_size tool bug found (10x correct risk) — flagged, manual formula used instead.
- **Invalidation (as written):** M5 close back below 3958 (would have been the 3rd reclaim failure — instead a higher low at 3960.65 printed, superseding this).

---

## Analysis #3 — 2026-07-01 06:28 UTC (WAIT — Gate 3, no zone / no arm)

- **Direction:** WAIT — the 02:20 sweep-reclaim long (#7177967) stopped out −$48.70; the H1 demand zone 3971–3975 it was built on had been breached to a fresh low 3962.97. No open M5 OB/FVG at price 3967.82 at the time.
- **Outcome:** superseded ~55 min later when price swept deeper to 3959.73 and reclaimed, producing a fresh M5 FVG and the 07:23 LONG setup above.
- **Invalidation (as written):** Watch A void M5 close <3961; Watch B void M5 close >3975 — both technically overtaken by the fresh sweep.

---
