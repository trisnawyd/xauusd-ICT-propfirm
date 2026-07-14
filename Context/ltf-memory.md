---
updated: 2026-07-14 02:05 UTC
snapshot: "[[Analysis/LTF/202607/20260714/20260714_0205_wait]]"
---

# LTF Memory — Last 3 Analyses

## Current Market Structure (as of 2026-07-14 02:05 UTC)

**Account:** balance/equity **$4,934.73**. **FLAT** — 0 open positions, **1 pending (#9954835 SELL_LIMIT 0.02 @4042.5, SL 4054.5, TP 3986.5)**. Daily P&L **$0.00** (closed $0 / float $0) — full buffer vs the −$200 daily block (0/2 daily cap, 0/2 consecutive losses). **ASIAN** session, 02:05 UTC. Spread **2.0** (normal).

**🚨 TRADE LOG GAP — unresolved, operator action needed:** MT5 `get_trade_history 7d` shows **4 trades on 07/13 that were never logged** and never appeared in any Trade Log file (no `Trade Log/20260713.md` exists): #7726387 BUY 4059.09→4059.33 (+$0.21), #7735849 BUY 4073.74→4063.57 (**−$30.59**), #7749656 BUY 4045.23→4039.30 (**−$17.87**), #7766829 BUY 3989.99→3994.80 (+$9.57). Net **−$38.68**. **All four were LONGS taken into a confirmed BEARISH tape** — none matches any graded plan (every 07/13 analysis was WAIT or SHORT). This is the same class of unexplained BUY that the 07/13 07:35 cycle flagged as #9910326 @4059.09 (same entry price as #7726387). **The reported balance does not reconcile with these P&Ls** (account.md had $4,934.13 on 07/13; equity is now $4,934.73, a +$0.60 delta, not −$38.68) — so either `get_trade_history` P&L is unreliable or the log is missing context. **Do not fabricate the log; the operator must confirm the origin of these trades before they are written to ground truth.**

**HTF (01:56 UTC, ~10 min old, FRESH):** **BEARISH** — D1 BEAR | H4 BEAR | H1 BEAR. 07/13 printed a −97 point bear marubozu (O4098.12 → C4001.17) that broke the **4021.56 D1 floor** and ran to 3986.4. Primary = **SHORT the retrace into 4020–4043**. Bear invalidation = H1 reclaim-hold above **4060.70** (H4 EQ, stepped down from 4101.09). **Zero unmitigated H4/H1 demand exists anywhere.**

**M15 Status:** algo label BULLISH — **lagging, ignore**. Last event **BoS DOWN@3992.02**. The last ten events alternate CHoCH UP/DOWN inside a 3983–4012 band — range, not trend. P/D H4012.33 / L3983.2, **EQ 3997.77**, price 4009.94 = **PREMIUM** (thin — the range is only 29 points). Open FVGs (3): BEARISH 4047.15–4051.17, BEARISH **4037.49–4041.94** (Watch A zone), BULLISH 4004.32–4005.85. Open OB (1): BEARISH 4058.36–4066.20.
**M5 Status:** algo label BEARISH; last event BoS UP@4005.04 broke 4004.32 — chop. **0 open FVGs (0/5), 0 open OBs (0/9)** — every zone mitigated. **This is the Gate 3 failure.**
**M1 Status:** genuine upward push in the last ~10 min — 4002 → **4012.33** high, now 4009.9. Displacement is *toward* the short zone. 1 open FVG: BULLISH 3998.35–3998.83 (below price).

**Character:** Nine hours of 3983–4012 compression directly beneath the 4020–4043 supply band, with price now pressing the range top. Heavy two-way liquidity chop (10 M15 + 14 M5 sweeps, both sides). This is a market coiling into the **15:30 UTC CPI** release. The base is doing what a continuation base should — but it has not yet delivered the retrace that makes the short valid.

**Key Levels:**
- 4060.70 — H4 EQ — **bear invalidation**
- 4058.36–4066.20 — M15 bear OB [open] — deeper supply
- 4047.15–4051.17 — M15 bear FVG [open] — SL shelter for Watch A
- 4042.50 — pending #9954835 entry (top edge of H4 sell-OTE)
- 4037.49–4041.94 — **M15 bear FVG [open] — the Watch A entry zone**
- 4021.56 — old D1 low, broken 07/13 — **flipped support → resistance**
- 4012.33 / 4009.59 — M15 range high / Asian high — price pressing here now
- 3997.77 — M15 EQ — shorts only valid above it
- 3983.20 — today's low, SSL swept — close-hold below → Watch B
- 3958.57 / 3942.86 — D1 swing low / D1 range floor

**Setup:** **WAIT at market (Gate 3 — no entry zone).** The short is with-trend and price is in M15 premium, but M5 has zero open OBs and zero open FVGs; nearest supply is ~300 pips up. **Watch A is already covered by resting pending #9954835** — no new order placed or proposed (this cycle never places orders). **LONG is not permissible** (fails Gate 3 counter-trend: no H4 demand zone, price below H4 OTE).

---

## Analysis #1 — 2026-07-14 02:05 UTC (WAIT — Gate 3, no entry zone)
- **Direction:** WAIT at market. SHORT is with-trend (D1/H4/H1 all bear) and price 4009.94 IS in M15 premium (EQ 3997.77) — P/D passes — but **M5 has 0 open FVGs and 0 open OBs**, and the nearest supply (M15 bear FVG 4037.49–4041.94) is ~300 pips above. Gate 2 was already marginal: M15 events alternate CHoCH UP/DOWN in a 3983–4012 range with no directional sequence.
- **Watch A (SHORT, PRIMARY):** rally into 4037–4042 (M15 bear FVG ∩ H4 sell-OTE ∩ flipped 4021.56) → entry ~4040, SL 4055, TP 3958.57 (R:R **5.4:1**, lot 0.03, risk $45.00). **Already covered by pending #9954835 @4042.5** — its TP 3986.5 is conservative and forfeits the 3958/3942 leg.
- **Watch B (SHORT, continuation):** M5 close-hold below 3983.20 → entry ~3982, SL 3996, TP 3944 (R:R **2.7:1**, lot 0.03, risk $42.00).
- **LONG:** not available — fails Gate 3 counter-trend (no open H4 demand, price below H4 OTE).
- **Invalidation:** H1 reclaim-hold above 4060.70 (H4 EQ) kills both watches → 4067.51 → 4090–4097.56.
- **⚠️ CPI 15:30 UTC (HIGH).** No new entries 15:15–15:45.

---

## Analysis #2 — 2026-07-13 07:35 UTC (WAIT — book discrepancy found + corrected)
- **Direction:** WAIT at market (Gate 3) — price 4056.74 in H4+M15 DISCOUNT, no valid short-at-market zone; no open demand zone for a LONG either.
- **Book found on start:** open BUY #9910326 @4059.09 (unexplained, no matching Watch/alert) + pending SELL_LIMIT #9910379 @4094 (= Watch A, matches alert #285). `state/auto-open-state` was stale ("flat") and the prior 07:30Z cycle never logged completion — corrected that cycle; BUY position flagged for operator review, left untouched. **Follow-up (07/14): this BUY closed at 4059.33 for +$0.21 (ticket #7726387) and was joined by three more unlogged LONGs — see the trade-log gap above.**
- **Watch A (SHORT, PRIMARY) — already resting:** no new order placed; existing pending #9910379 covered the only valid HTF zone (4090.17–4097.56).
- **Invalidation:** H1 reclaim-hold above 4101.09 (H4 EQ).

---

## Analysis #3 — 2026-07-13 07:04 UTC (WAIT — armed order rejected)
- **Direction:** WAIT (Gate 3 at market) — price in M15 DISCOUNT (4053.91 < EQ 4066.93). Fresh 4043.68 SSL sweep+reclaim reinforced the bear thesis without opening a new zone.
- **Watch A (SHORT, PRIMARY) — attempted:** SELL_LIMIT 0.03 @4094, SL 4102, TP 4021.56 (R:R 9.05, Grade A 82/100). **REJECTED by MT5 terminal — AutoTrading disabled by server (code 10026).** Not an ICT-gate or MCP-safety block; a broker/terminal-side block.
- **Invalidation:** H1 reclaim-hold above 4101.09 (H4 EQ).
