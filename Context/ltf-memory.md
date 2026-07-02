---
updated: 2026-07-02 04:27 UTC
snapshot: "[[Analysis/LTF/202607/20260702/20260702_0427_wait]]"
---

# LTF Memory — Last 3 Analyses

## Current Market Structure (as of 2026-07-02 04:27 UTC)

**Account:** **1 OPEN position** — SELL #9260727 @4068.25, 0.05 lot, SL 4078.25, TP 4038.25, floating +$12.75. Equity $4,979.47, balance $4,966.62, max risk ~$49.79. Today: closed −$33.48 (ticket #7212602, stopped in 15 min on the first supply-shelf test), floating +$12.75 → total ≈ −$20.73. Spread 2 ✓. ASIAN (04:27 UTC).

**Big picture:** Since the 01:37 UTC read, price ran up through the ARMED short zone (never filled there), took out the Asian high three times (4068.75 → 4073.47/4074.23 → 4068.24), and rejected each time, closing back down to ~4065.5. The user shorted twice: first at 4062.28 (stopped out −$33.48 as the shelf broke on the first attempt) and again at 4068.25 (now open, floating small profit). M15/M5 structure both stayed BEARISH with clean continuation BoS DOWN events (M15 @4037.74, M5 @4062.76) — no transition, thesis intact. But every M5/M1 FVG and OB is now mitigated — **no open entry zone remains**, so a fresh LTF signal can't fire until a new imbalance prints.

**🚨 NFP DAY:** 12:30 UTC — Nonfarm Payrolls + Unemployment Rate + Initial Claims + AHE (all HIGH) + 14:00 Factory Orders. No new positions 12:15–13:00 UTC; manage/flatten the open short ahead of it.

**M15 Status:** trend BEARISH, last event BoS DOWN@4037.74 (00:30 UTC). P/D: H4074.23/L4029.2, EQ 4051.72, price PREMIUM. OTE (discount) 4038.84–4046.4.
**M5 Status:** trend BEARISH, last event BoS DOWN@4062.76 (00:45 UTC), aligned with M15 — no transition. All 8 OBs / 14 FVGs filled.
**M1 Status:** all 5 recent FVGs filled. Repeated sweep-and-reject wicks (4067.89, 4070.84) closing back down — sellers defending the shelf, but no fresh displacement for a trigger yet.

**Key Levels:**
- **4074.23 — Asian high / BSL sweep wick (rejected 3×) | 4068.59–4088.70 — overnight descending-highs supply shelf (existing short's zone)**
- **4051.72 — M15 EQ | 4038.84–4046.4 — M15 discount OTE**
- **4029.20 — overnight floor / next SSL (existing short's TP) | 3984.74–4012.55 — H4 primary demand stack | 3942.86 — range floor**

**Setup:** WAIT — Gate 3, no entry zone (all M5/M1 FVGs and M5 OBs mitigated). Watch A: bounce off M15 discount OTE 4038.84-4046.4 → LONG ~4042, SL 4036, TP 4063.6 (3.6:1). Watch B: retest of the swept 4068-4074 shelf → SHORT ~4070, SL 4080, TP 4029.2 (4.08:1) — same thesis as the open #9260727 short, a confirmation add rather than a new signal. Both void at 12:15 UTC NFP lockout.

---

## Analysis #1 — 2026-07-02 04:27 UTC (WAIT — Gate 3, no entry zone; all M5/M1 FVGs+OBs mitigated)

- **Direction:** WAIT — M15/M5 both BEARISH with clean continuation BoS DOWN events (no transition), reinforced by 3× BSL sweep-rejects at the new Asian high 4068-4074, but Gate 3 fails: zero open OB/FVG on M5 or M1 to enter from.
- **Watch A:** pullback into M15 discount OTE 4038.84-4046.4 + fresh M1 bullish trigger → LONG ~4042, SL 4036, TP 4063.6 (3.6:1). Counter-trend tactical bounce only.
- **Watch B:** retest of the swept 4068-4074 shelf + fresh M1 bearish trigger → SHORT ~4070, SL 4080, TP 4029.2 (4.08:1). Same thesis as the open #9260727 short (confirmation add, not standalone).
- **Invalidation:** 12:15 UTC NFP lockout kills both; M15 close above 4088.70 kills B; M15 close below 4029.20 kills A.

---

## Analysis #2 — 2026-07-02 01:37 UTC (WAIT — Gate 4 ARMED, session-high sweep-reject confirms bearish continuation)

- **Direction:** WAIT/ARMED — M15 BEARISH (BoS DOWN@4030.59) reinforced by confirmed BSL sweep-reject @4068.75; Gate 3 zone+P/D pass (premium, M5/M1 bear FVG shelf identified) but Gate 4 fails — price hasn't reached the shelf, no M1 trigger. Projected grade B+ (76/100): HTF 14/20 (H4+H1 bearish, D1 counter/stale), Zone 12/20, Sweep 15/15, P/D 15/15, Trigger 10/10 (projected), Session 3/10, R:R 7/10.
- **Watch A:** bounce off M1 bull FVG 4050.23-4050.81 + reclaim 4048.53 → LONG ~4051, SL 4046, TP 4063.6 (2.52:1). Not armed (counter to primary bias).
- **Watch B (ARMED):** M1 bearish trigger at M5/M1 bear FVG shelf 4055.8-4064.2 → SHORT ~4058, SL 4065.5, TP 4029.2 (3.84:1), lot 0.06, risk $45 of $50. `place_pending_order` proposed, awaiting CONFIRM.
- **Invalidation:** 12:15 UTC NFP lockout kills both; M5 close above 4064.2 kills B; M15 close below 4029.2 kills A.

---

## Analysis #3 — 2026-07-02 00:11 UTC (WAIT — grade B mid-range chop, NFP day)

- **Direction:** WAIT — Gates 1–4 pass for a cautious LONG (M5 double BoS UP off the 4033.18 SSL sweep, M15 discount, open M5 bull FVG) but Gate 5 = B (61/100): HTF 10/20, Trigger 4/10 (chase), Session 3/10. Price on the H4 EQ + NFP at 12:30 UTC.
- **Watch A:** pullback into M5 bull FVG 4036.66–4038.75 + M1 trigger → LONG ~4038, SL 4030, TP 4063.6 (3.2:1), lot 0.06.
- **Watch B:** M1 bearish trigger at supply shelf 4054.46–4064.20 / M15 EQ → SHORT ~4058, SL 4065.5, TP 4033.2 (3.3:1), lot 0.06.
- **Invalidation:** 12:15 UTC NFP lockout kills both; M15 close below 4029.2 kills A; M5 close above 4064.2 kills B.

---
