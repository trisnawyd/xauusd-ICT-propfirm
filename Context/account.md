---
updated: 2026-07-09 03:33 UTC (ASIAN — 4 trades closed −$53.13, FLAT; equity $4,989.90; 0W/3L/1BE)
synced_from: MT5 Bridge
---

# Account

| Field | Value |
|-------|-------|
| Broker | Exness MT5 |
| Instrument | XAU/USD |
| Lot size | Dynamic (1% risk model) |
| Balance | $4,989.90 |
| Equity | $4,989.90 |
| Max risk per trade (1%) | $49.90 |
| Margin used | $0 |
| Free margin | $5,043.37 |
| Open positions | **None** |
| Pending orders | **None** (BUY LIMIT #9710396 filled → closed BE scratch #7559209 +$0.52) |

## Session Status — 2026-07-09
- Daily P&L: **−$53.13** closed (**0 win, 3 loss, 1 BE scratch**) — reconciled in [[Trade Log/20260709]]:
  - T1 #7594957 SELL 4073.82 → 4079.42, net **−$11.25** (8 min, 0.02 lot) — **right direction, wrong location.** The 4089.55 reject had already fired (bias short, price later fell to 4054), but this shorted **mid-range at 4073.82** (discount, below M15 EQ 4078); a routine bounce to 4079 stopped it before the down-leg. Same error as 07/07 T2.
  - T2 #7595731 BUY 4073.66 → 4068.24, net **−$16.34** (11 min, 0.03 lot) — **knife-catch #1.** Flipped the losing short into a long, buying into the live down-move with no reclaim trigger.
  - T3 #7596364 BUY 4063.17 → 4054.56, net **−$25.91** (4 min, 0.03 lot) — **knife-catch #2, biggest loss.** Bought lower as the drop accelerated; stopped −86 pips in 4 min. The recurring "don't buy the dip into a downtrend" loss (06/26, 06/30, 07/06).
  - T4 #7596725 BUY 4058.32 → 4058.42, net **+$0.37** (13 min, 0.03 lot) — third long, scratched at BE. The one disciplined exit.
- Session start equity: $5,043.37 → **current $4,989.90 (−$53.47 balance / −$53.13 closed, −1.06% day)** — within the −20% daily limit.
- **FLAT** — no open positions, no pendings.
- ⚠️ Behavioral: the SHORT direction was the day's edge (4089 reject → 4054), but T1 gave it away on a mid-range entry and T2–T4 then reversed into dip-buying longs against the down-leg (−$42.25 of the −$53). **Lesson: sell the rejection AT supply (4085–4090) or a confirmed break, not mid-range; and never flip a losing short into a dip-buy — re-short higher instead.**
- Market context: ASIAN (03:33 UTC), price ~4063 at the 4062 SSL after the down-leg. HTF NEUTRAL / range 4021.56–4092. Forward read: [[Analysis/LTF/202607/20260709/20260709_0435_wait]].
- News (UTC): 12:30 Initial Jobless Claims (HIGH), 14:00 Existing Home Sales (HIGH), 17:00 30-Year Bond Auction (HIGH). Stand down ~15 min around 12:30 / 14:00.

## Session Status — 2026-07-08
- Daily P&L: **+$31.86** closed (**3 win, 1 loss, 1 BE scratch**) — reconciled in [[Trade Log/20260708]]:
  - T3 #7559209 BUY 4047.99 → 4048.19, net **+$0.52 (8 min, BE scratch)** — fill of the Claude-armed BUY LIMIT #9710396 (Watch A demand long) from [[Analysis/LTF/202607/20260708/20260708_1024_wait]]. Filled on a drift-down to 4048 *without* the M5 CHoCH confirming (alert #240 @4058.77 never fired); closed manually at BE ("no buyer pressure"). Correct scratch — price kept sliding to 4045.95 after the close.
  - T4 #7561302 BUY 4063.77 → 4058.75, net **−$10.09 (5 min, LOSS)** — manual long chasing the 4040-floor bounce mid-OTE; cut quickly.
  - T5 #7562090 BUY 4063.55 → 4068.66, net **+$10.17 (13 min, WIN)** — immediate long re-entry same ~4063 area, rode to the 4072.8 rejection top and banked. T4+T5 = +$0.08 wash. Both off-CONFIRM-flow LONGs off the held 4040.22 demand floor (technical bounce, not a war bid). The stated sell focus (fade 4081–4092) never triggered — price rejected at 4072.8 (OTE top, discount), short of the zone.
  - T1 #7528202 BUY 4101.70 → 4102.73, net **+$2.01** (23 min) — manual scalp long off the early-London 4098–4102 M5 demand bounce. Small, off-plan, green.
  - **T2 #7544896 SELL 4119.90 → 4105.25, net +$29.25 (69 min, 0.02 lot) — the breakdown short, day's edge (WIN).** With-trend short off the 4133.85 BSL sweep + rejection, expressed as the compression breakdown rather than the armed 4136.5 bounce-sell (which never filled — price broke down instead of bouncing, so the limit was correctly abandoned). Banked manually at **4105.25 = +146.5 pips** into the 4103.93–4110.32 OTE/support shelf (the pre-planned first target). Price then ran to **4088** through the 4091.97 SSL — full move was there; early bank captured the clean first leg. Linked: [[Analysis/LTF/202607/20260708/20260708_0634_wait]].
- Session start equity: $5,011.79 → **current $5,042.95 (+$31.26, +0.62% day)** — flat, within all limits.
- **FLAT** — no open positions, no pendings.
- ✅ Behavioral: both manual/off-CONFIRM-flow, but disciplined — adapted the plan when price chose down over the bounce, sized small ($25) on a mid-range/EQ entry, and banked into the target shelf instead of stabbing for the low. Clean green day on the with-trend breakdown thesis.
- Market context: LONDON (08:1x UTC), price ~4088 after the breakdown through 4091.97. HTF bearish-lean confirmed — the markdown resumed. Next: continuation toward 4081/4073/4052 on a bounce-reject, or watch for the 3984–4012 deep-demand reaction. Forward read: [[Analysis/LTF/202607/20260708/20260708_0634_wait]].
- News: no HIGH gold cluster in Asian/London; FOMC Minutes 18:00 UTC (MEDIUM), 10Y auction 20:00 (HIGH) — stand down ~15 min around each.

## Session Status — 2026-07-07
- Daily P&L: **−$1.36** closed (1 win, 1 loss, 1 BE scratch) — day recovered to ~breakeven — reconciled in [[Trade Log/20260707]]:
  - T1 #7446323 BUY 4122.56 → 4122.37, net **−$0.65** (2 min, scratch) — manual counter-trend long off the 4116–4124 session-low bounce ("instant break-even"). Off-plan (not at 4080–4100 demand, counter-trend), moved to BE instantly, scratched on noise. Right instinct on the bounce, wrong location + BE stop inside the M1 noise band.
  - **T2 #7479968 SELL 0.05 @ 4150.47 → 4160.48, net −$50.18 (19 min) — the A82 supply short, STOPPED full-risk.** With-trend short into 4148–4157 supply per [[Analysis/LTF/202607/20260707/20260707_1141_short]] (A 82). Structure real (BSL 4146.23 swept, M15 premium, London), but **entered mid-zone at 4150.47 on a soft 4148.17 rejection wick that never confirmed** — price stair-stepped UP through the FVG (absorption, not rejection), broke the 4156.69 top, tagged SL 4160.47. Lesson: a soft wick ≠ an M1 trigger; the real supply/BSL was higher (4167.74/4178).
  - **T3 #7487035 SELL 4173.40 → 4163.48, net +$49.47 (10 min) — the SAME short at the RIGHT level, WIN.** Price ran up to the session high **4178.6**, tagging the descending trendline (~4178) / above NY high 4167.74 = the real HTF supply + BSL, and rejected. Short from 4173.40 rode it down to 4163.48. **This is what T2 should have been** — identical bias, entered at the correct liquidity (trendline/NY-high) so the entry sat *above* the rejection, not below it. T2+T3 net −$0.71 on the short idea: right thesis, second attempt fixed the location.
- Session start equity: ~$5,013.80 → **current $5,012.10 (−$1.36, −0.03% day)** — flat, within all limits.
- **FLAT** — no open positions, no pendings.
- ✅ Behavioral: all three manual/off-CONFIRM-flow. The takeaway is T2→T3: the A82 grade was inflated on an unconfirmed trigger and stopped mid-zone, but the **re-attempt at the actual resistance (4173/4178 trendline reject) was textbook and clawed the loss straight back.** Discipline reinforced: **short the rejection at the real liquidity level (trendline/NY-high), not mid-FVG; wait for the displacement.** T3 did exactly that.
- Market context: OVERLAP (13:10 UTC), price ~4161 after rejecting the **4178.6 trendline high**. HTF bearish-at-resistance thesis just confirmed by that reject. Next: with-trend continuation down (draw 4148 → 4128 → 4116) OR another rejection short on a re-tag of 4167–4178. Forward read: [[Analysis/LTF/202607/20260707/20260707_1141_short]].

## Session Status — 2026-07-06
- Daily P&L: **−$33.98** closed (3 win, 5 loss) — reconciled in [[Trade Log/20260706]]:
  - **T8 #7398113 SELL 0.06 @ 4135.14 → 4143.21, net −$48.57 (14 min) — first full-CONFIRM-flow trade, STOPPED.** Armed SELL_LIMIT off [[Analysis/LTF/202607/20260706/20260706_1444_short]] (B 66) after M5 confirmed a close below the 4131.22 session low. Filled 4135.14; **Waller's 15:00 UTC speech sparked a full reclaim of the 4128.32 low** (4128→4144 no pause) → SL 4143. Bear trap / failed breakdown. Structure was valid (with-trend, confirmed break, 4.1:1) but arming ~16 min before a Fed speaker was the error. Gave back T7's recovery → day red −$33.98. **Lesson: no breakdown shorts placed inside ~15 min of a Fed speaker.**
  - *(T1–T7 below: T7 recovered the day to +$14.59 before T8.)*
  - T1 #7291240 SELL 4197.13 → 4202.33, net **−$10.45** (11 min) — off-plan short fading the range top; stopped on the wick to new Asian high 4203.17.
  - T2 #7291534 BUY 4202.48 → 4191.91, net **−$31.79** (2 min) — chased the 4202 breakout WITHOUT the required M5 break-and-hold; reversed straight back into the range.
  - T3 #7292716 BUY 4185.87 → 4179.94, net **−$29.78** (6 min) — third long, bought into the markdown off the trapped 4203.17 high; knife-catch, stopped.
  - T4 #7294168 BUY 4183.06 → 4176.14, net **−$34.73** (5 min) — fourth long, same knife-catch pattern lower; stopped as breakdown continued. T2–T4 = three longs fighting a downtrend = −$96.30.
  - T5 #7299220 SELL 4177.47 → 4165.88, net **+$11.56** (49 min) — finally flipped WITH the breakdown momentum; closed early (WIN).
  - T6 #7300101 SELL 4177.47 → 4164.95, net **+$49.98** (58 min) — second short same entry, rode the markdown to 4164.95 (WIN).
  - **T7 #7373748 SELL 0.03 @ 4152.26 → 4132.30, net +$59.80 (94 min) — THE PLAN TRADE (WIN).** With-trend short off the M15 IFVG rejection at the 4152.55 box top (engulfing retest → break), rode the box breakdown 199.6 pips to the session low 4131.22. First trade of the day aligned with a Claude plan (Watch A box-breakdown short, [[Analysis/LTF/202607/20260706/20260706_1017_wait]]). Recovered the whole −$45.21 hole in one clean trade.
- Session start equity: ~$5,048.01 → **current $5,062.52 (+$14.59, +0.29% day)**
- **FLAT** — no open positions, no pendings.
- ✅ Behavioral turn: T1–T6 were off-plan whipsaw (4 longs fading the breakdown −$106.75, 2 shorts recovering +$61.54). **T7 was the fix in action** — with-trend, entered on a rejection trigger at a real level (IFVG resistance), let it run ~200 pips instead of the usual early bank. One disciplined trade > six discretionary stabs. Lesson reinforced: **don't fade a range top / don't buy a knife; DO sell the rejection at resistance with the trend and hold to the demand target.**
- Market context: LONDON (12:44 UTC), price ~4133 at the session low / into the 4127–4146 H4 demand floor after the box broke down. Daily +0.29%, green. 🚨 HIGH-impact US cluster TODAY 13:45/14:00 UTC (S&P Services PMI, ISM Non-Mfg PMI + Prices Paid) + Waller 15:00 — no new positions 13:30–14:15 UTC (~1h out).

## Session Status — 2026-07-02
- Daily P&L: **+$49.55** closed (5 win, 3 loss) — reconciled in [[Trade Log/20260702]]:
  - T1 #7212602 SELL 4062.28 → 4068.95, net **−$33.48** (15 min) — entered the 4054.46–4064.20 supply shelf per [[Analysis/LTF/202607/20260702/20260702_0137_wait]] Watch B zone, but off-plan price/lot; supply didn't hold on first test, session extended to new Asian high 4074.23.
  - T2 #7213838 SELL 4068.25 → 4057.94, net **+$51.42** (85 min) — re-short near the sweep-reject zone after T1 stopped out, SL 4078.25 / TP 4038.25 (thesis covered live in [[Analysis/LTF/202607/20260702/20260702_0427_wait]] Watch B). Closed manually well short of TP — banked profit early, same pattern as 07/01's early exits.
  - T3 #7216281 SELL 4067.39 → 4072.68, net **−$15.95** (2 min) — off-plan manual short, premature entry into the still-extending rally toward 4079.9.
  - T4 #7216512 SELL 4070.75 → 4075.75, net **−$25.13** (3 min) — 2nd off-plan manual re-short, same premature-entry pattern, stopped at the fresh high.
  - T5 #7217042 SELL 4074.42 → 4074.14, net **+$1.53** (12 min, scratch) — off-plan manual short taken almost exactly at the 4079.9 cascade top; closed early near BE.
  - T6 #7217909 SELL 4064.91 → 4064.85, net **+$0.17** (13 min, scratch) — off-plan manual short, no linked plan.
  - T7 #7218915 SELL 4068.73 → 4064.59, net **+$20.57** (23 min) — **fill of the Claude-armed SELL_LIMIT #9266059** from [[Analysis/LTF/202607/20260702/20260702_0719_short]] (planned entry 4068.35). Closed manually before the 4055.25 TP — same early-exit pattern as T2/T5, thesis correct.
  - T8 #7218916 SELL 4074.90 → 4064.79, net **+$50.42** (19 min) — off-plan manual short near the cascade top, best single result of the day, ungraded/discretionary.
- Session start equity: $5,000.36 → **current $5,048.90 (+$48.54, +0.97% day)**
- **FLAT** — no open positions, no pendings. The ARMED SELL_LIMIT filled and closed as T7; nothing resting now.
- ⚠️ Behavioral note: 6 of 8 trades today (all but T2/T7, which trace to a Claude plan) were placed directly in MT5 outside Claude's confirm flow — correct directional read every time, but timing/exit discipline is discretionary. Combined off-plan net (T1,T3,T4,T5,T6,T8): +$11.08. The recurring pattern across 06/29, 07/01, and now T2/T5/T7 today is banking profit well before the plan's TP — worth a deliberate look at exit discipline once this session settles.
- Market context: LONDON (08:02 UTC). HTF NEUTRAL range 3942.86–4145.04. 🚨 HIGH-impact NFP cluster 12:30 UTC — no new positions 12:15–13:00 UTC.

## Session Status — 2026-07-01
- **FLAT** — no open positions, no pendings.
- Daily P&L: **−$28.36** closed (2 win, 1 loss) — reconciled in [[Trade Log/20260701]]:
  - T1 #7177967 BUY 3975.93 → 3963.78, −121.5 pips, net **−$48.70** (~124 min, 0.04 lot) — sweep-reclaim long (B+ 71) from [[Analysis/LTF/202607/20260701/20260701_0220_long]]. Filled on the retest ~04:00 UTC; the reclaim did NOT hold — price re-broke below the 3969.95 sweep low and ran the 3965 stop (slipped to 3963.78). Second consecutive sweep+reclaim ASIAN-discount long to fail this way in 48h.
  - T2+T3 #9226130 BUY 3973.78 (0.04 lot), closed in two manual pieces: 7182024 partial @3983.86 **+$20.11** (20 min) + 7182748 remainder @3973.92 **+$0.23** (36 min) — Watch B breakout-continuation long (B+ 70) from [[Analysis/LTF/202607/20260701/20260701_0801_long]]. The 4th test of the demand sequence finally held; partial banked real profit into strength, remainder closed near breakeven ahead of the SL/TP resolving — left most of the 3.1:1 R:R uncollected but avoided holding into the 12:15–14:00 UTC news block.
- Session start equity: $5,028.92 → **current $5,000.36 (−$28.56, −0.57% day)**
- Market context: LONDON (11:21 UTC), flat and reset for a fresh read. 🚨 HIGH-impact US data TODAY 12:15 ADP NFP, 13:45 S&P Manu PMI, 14:00 ISM Manufacturing PMI + Prices Paid (~1–3h out) — range-resolver, stand down into it.

## Session Status — 2026-06-30
- Daily P&L: **−$23.43** closed (2 win, 3 loss) — reconciled in [[Trade Log/20260630]]:
  - T1 #9181531 BUY 3962.85 → 3958.32, −44 pips, net **−$9.11** (~47 min, 0.02 lot) — floor-reversal long (B+ 72), cut on a failed reclaim. Correct location, early entry (the floor reversal was ultimately right — ran to 4055 hours later — the reclaim just needed more basing).
  - T2 deal 7141502 SELL 3963.54 → 3972.24, −87 pips, net **−$26.18** (~29 min, 0.03 lot) — **breakdown short (old Watch B), FAILED.** Shorted into the already-swept 3942.86 floor; price reclaimed + squeezed up. Largest loss = chasing the bottom.
  - T3 deal 7141735 SELL 3972.8 → 3978.1, −53 pips, net **−$15.98** (~4 min, 0.03 lot) — 2nd breakdown short re-entry, cut in 4 min as the reversal ran. T2+T3 = −$42.16 = two stabs at a wrong directional thesis.
  - T4 deal 7142459 SELL 3995.14 → 3987.05, +81 pips, net **+$8.06** (~27 min, partial) — **short-from-supply (old Watch C), WIN.** Retrace into the 3990–3994 bear OB.
  - T5 deal 7142525 SELL 3995.14 → 3990.17, net **+$19.78** (~32 min, runner) — same 3995 supply short, runner tranche. T4+T5 = **+$27.84**, the only edge that worked.
- Session start equity: $5,052.69 → **current $5,028.92 (−$23.43, −0.46% day)**
- **FLAT** — no positions, no pendings. Forward read: [[Analysis/LTF/202606/20260630/20260630_0919_wait]].
- HTF bias: NEUTRAL range 3942.86–4106 **RECOVERING UP off the swept floor** (htf-context 06-30 09:19 UTC, fresh). Price 4019 pulled back into M15 premium after the 745-pip rally; fresh H4 bull FVG 3998.33–4014.69 [open] = demand below.
- Market context: LONDON (09:19 UTC), price ~4019. Daily −0.46%, within limits. 🚨 HIGH-impact US data TODAY 16:45 Chicago PMI / 17:00 CB Consumer Confidence + JOLTS (~7.5h out) = range-resolver, flatten before it. Lesson logged: trade EDGE rejections (supply/floor reactions), not breakdowns into a swept level or the mid-range.

## Session Status — 2026-06-29
- Daily P&L: **+$2.36** total closed (1 win, 2 loss, 1 scratch) — reconciled in [[Trade Log/20260629]]:
  - T1 ticket 7114992 SELL 4054.08 → 4053.83, +2.5 pips, net **+$0.45** (8 min, 0.02 lot) — discretionary range-mid short, no edge. Scratched to BE before the breakdown.
  - T2 ticket 7120352 BUY 4049.94 → 4039.85, −101 pips, net **−$20.23** (27 min, 0.02 lot) — Watch A long, FAILED. Bought the 4039-4043 demand pre-confirmation; demand broke. Cut before the 4034 SL.
  - T3 ticket 7121316 BUY 4032.64 → 4031.24, −14 pips, net **−$4.28** (16 min, 0.03 lot) — 2nd counter-trend long into the breakdown. Floated +$17, rolled over, stopped ~BE (small loss).
  - **T4 position #9163615 BUY 4030.15 (0.03 lot) — THE WIN, +$26.42 total, well managed.** Bounce-off-4024.38-sweep long (good location: discount/OTE), but again a no-trigger instinct entry (3rd long). This time let it run + scaled out:
    - 7123464 partial 0.01 @4051.03, +208 pips, net **+$20.85** (40 min) — banked the 200-pip pop into the EQ/4052 BoS.
    - 7127696 runner 0.02 @4032.96, +28 pips, net **+$5.57** (143 min) — risk-free BE+ stop did its job when the rally faded back from 4052; locked profit instead of a giveback.
- Session start equity: $5,050.59 → **current $5,052.69 (+$2.10 balance / +$2.36 closed P&L, +0.05% day)**
- **FLAT** — no open positions, no pendings. Forward read: [[Analysis/LTF/202606/20260629/20260629_1350_wait]].
- HTF bias: NEUTRAL range 3958.57-4106 (htf-context 06-29 00:47 UTC, fresh to 06-30 00:47). Intraday compressed to a 4024.38↔4066.87 sub-range; price 4031 back in the lower half / discount.
- Market context: OVERLAP (14:01 UTC), price ~4031. Daily +0.05%, within limits. 🚨 HIGH-impact US data 16:45 Chicago PMI / 17:00 CB Consumer Confidence + JOLTS (~3h out) = range-resolver. ⚠️ Behavioral: 4 longs/shorts, 3 were no-trigger instinct entries; the day was saved by ONE well-managed long. Green, but process (entering pre-trigger) needs fixing — keep the location read, wait for the M1 confirmation.

## Session Status — 2026-06-26
- Daily P&L: **−$61.36** total closed (0 win, 2 loss) — reconciled in [[Trade Log/20260626]]:
  - T1 ticket 7077413 BUY 4000.00 → 3994.29, −57 pips, net −$11.47 (7 min, 0.02 lot) — **counter-trend dip-buy, NOT from a plan.** Bought 4000 mid-range in discount against a fully-aligned BEARISH HTF; price continued down, cut after 7 min. The "do NOT buy the dip" loss.
  - T2 ticket 7094096 (= live #9066665) SELL 4050.00 → 4074.92, −249 pips, net −$49.89 (272 min, 0.02 lot) — **planned A-grade armed short, STOPPED OUT.** Armed @4050 into 4049–4072 supply, filled ~12:35 UTC. Bounce extended THROUGH the zone (broke 4072 → 4074 → stopped at 4074.92, new high 4077.31). Textbook WITH-bias setup; supply simply didn't hold. Full-risk loss.
- Session start equity: $5,112.05 → **end $5,050.59 (−$61.46 day, −1.20%)**
- **FLAT** — no open positions, no pendings. Forward read: [[Analysis/LTF/202606/20260626/20260626_1352_short]] (HOLD call that got stopped).
- HTF bias: ⚠️ **STALE / needs refresh.** Was BEARISH (06-26 03:09 UTC) but the relief bounce 3958.57→**4077.31** has now CLEARED the H1 bear-FVG cluster 4049–4072.75 AND the H4 OTE. A reclaim + H4 close above EQ 4087.01 neutralizes the bearish read. Run `analyze HTF` before the next trade.
- Market context: flat after 2 losses (~13:57 UTC OVERLAP). Price ~4076, broke supply to new session high 4077.31. Daily DD −1.20%, within −20% limit. **Suggest standing down — no revenge trades into a bounce that just stopped a WITH-bias short.**

## Session Status — 2026-06-24
- Daily P&L: **+$61.52** closed (1 win, 0 loss) — reconciled in [[Trade Log/20260624]]:
  - T1 ticket 8999451 SELL 4102.02 (armed limit), scaled out: 0.02 @4091.25 +$21.49 (partial, +1R) and 0.02 @4081.98 +$40.03 (runner, ~200 pips) — B+ (76) short into H4 bear FVG 4097.98–4107.40 on the new bearish down-leg. **First trade with full [[Playbooks/trade-management-checklist]] adherence** (armed entry → partial+BE at +1R → let runner run). Best result of the week. Minor note: runner closed discretionarily at 4081.98 ("200 enough") vs TP 4068 — sound here, but keep runner exits rule-based.
- Session start equity: $5,050.63
- HTF bias: See Context/htf-context.md (06-24 01:13 UTC — fresh). BEARISH (D1/H4/H1 aligned); hawkish Fed + de-escalation unwind. Range floor 4090.5 broken, swept Asian low 4068.25; draw on liquidity 4068.25 → 4052.79 → 4023.56.
- Market context: flat after +$61.52 win (~02:15 UTC ASIAN). Price ~4082. 🚨 HIGH-impact 12:30 UTC PCE/GDP cluster — no positioning into it. Forward read: [[Analysis/LTF/202606/20260624/20260624_0113_wait]].

## Session Status — 2026-06-23
- Daily P&L: **+$2.02** closed (0 win, 0 loss, 1 win-side scratch) — reconciled in [[Trade Log/20260623]]:
  - T1 ticket 8986441 (hist 7001190) SELL 4139.6 → 4138.9, +7 pips, net +$2.02 (11 min, 0.03 lot) — B+ (76) range-high bull-trap short off the 4140.24 BSL sweep. Moved to BE early, then closed manually at 4138.9 on spike-above-4140 risk before the move developed (thesis target was EQ 4112 / range low 4090.5). Win-side scratch. Lesson: once BE is locked, let structure (M5 close back above 4140.24, alert #93) define the exit, not a single wick — keeps the 4.3:1 asymmetry intact.
- Session start equity: $5,048.69
- HTF bias: See Context/htf-context.md (06-23 01:56 UTC — fresh). BEARISH-lean (D1 ranging / H4 below OTE / H1 bearish); hawkish Fed + de-escalation unwind. Range 4090.5–4133.45, swept highs to 4140.24.
- Market context: flat after scratch (~14:10 UTC OVERLAP). Price ~4136.6, inside upper range below the swept high. Forward read: [[Analysis/LTF/202606/20260623/20260623_1357_wait]].

## Session Status — 2026-06-22
- Daily P&L: **+$1.27** closed (0 win, 0 loss, 1 BE scratch) — reconciled in [[Trade Log/20260622]]:
  - T1 ticket 8952061 (hist 6971129) BUY 4189.66 → 4190.11, +4.5 pips, net +$1.27 (44 min, 0.03 lot) — B+ (77) range-low sweep-reclaim long. Pushed to 4210.97 (~+$60 floating) but failed to reach TP 4214.66/London high 4215.44, rotated back through EQ and tagged the BE stop. Risk-free scratch. Lesson: bank/trail B+ range trades into strength — a trail to 4197 = locked +$22 vs BE.
- Session start equity: $5,047.50
- HTF bias: See Context/htf-context.md (06-22 01:19 UTC — fresh). D1 BULLISH-lean/range 4121–4369, H4 BULLISH (OTE reclaimed), H1 BoS UP. Choppy M15 range 4188.54–4215.44.
- Market context: flat after BE scratch (14:30 UTC OVERLAP). Bullish thesis intact above 4136.24. Forward read: [[Analysis/LTF/202606/20260622/20260622_1340_long]].

## Session Status — 2026-06-19
- Daily P&L: **+$35.65** closed (1 win, 0 loss) — reconciled in [[Trade Log/20260619]]:
  - T1 ticket 6937519 SELL 4167.31 → 4155.40, +119.1 pips, net +$35.65 (178 min, 0.03 lot) — H4 FVG rejection short, WITH-D1. Trailed SL to 4155 (too tight, $0.69 above swing high 4154.31), wick-hunted to ~4156 then reversed; runner toward TP 4121.81 given away. Green but mismanaged exit.
- Session start equity: $5,011.85
- HTF bias: See Context/htf-context.md (06-19 01:26 UTC — fresh). D1 BEARISH; overnight crash to day low 4121.32, corrective bounce to ~4178, now chopping M15 EQ 4152.55.
- Market context: WAIT at EQ (11:57 UTC LONDON). No HIGH-impact USD events next 24h. Forward read: [[Analysis/LTF/202606/20260619/20260619_1157_wait]].

## Session Status — 2026-06-16
- Daily P&L: **+$12.29** closed (1 win, 1 loss) — reconciled in [[Trade Log/20260616]]:
  - T1 ticket 6855635 SELL 4338.85 → 4354.19, -153.4 pips, net -$46.10 (282 min, 0.03 lot) — 08:06 Watch-B gap-fill short, stopped at SL 4353.85 when supply 4349.48 reclaimed (invalidation flagged in 12:24 WAIT).
  - T2 ticket 6860437 SELL 4345.55 → 4326.06, +194.9 pips, net +$58.39 (70 min, 0.03 lot) — discretionary re-short into the same supply after the failed breakout; caught the gap-fill down to 4326. Ungraded but well-located.
- Session start equity: $4,999.72
- HTF bias: See Context/htf-context.md (updated 06-16 01:04 UTC — fresh). BULLISH (H4/H1), D1 bearish compromised; failed breakout 4369.17, gap-fill underway toward 4305.8/4285.37.
- Market context: failed London breakout 4355.08 → gap-fill sell-off through M15 EQ to 4326 (14:19 UTC OVERLAP). No HIGH-impact USD events flagged.

## Lot Sizing Formula
Lot = Max Risk ÷ (SL pips × $10)  → round to nearest 0.01

| SL (pips) | Lot | Risk $ |
|-----------|-----|--------|
| 50        | 0.10 | $50.00 |
| 80        | 0.06 | $48.00 |
| 100       | 0.05 | $50.00 |
| 130       | 0.04 | $52.00 → use 0.03 ($39.00) |
| 200       | 0.03 | $60.00 → use 0.02 ($40.00) |

Use `calculate lot [sl_pips]` command for precise value on current equity.

## Notes
- Commission per trade: $0.11
- Risk model: dynamic 1% of current equity per trade
- Update after every closed trade with "sync account"
- Session equity (06/16): $5,011.93 | Change: +$12.29 (1 win, 1 loss — tickets 6855635 −$46.10, 6860437 +$58.39; reconciled in Trade Log/20260616.md)
- Session equity (06/15): $4,999.80 | Change: -$4.16 (1 win, 1 loss — tickets 6819788 −$9.05, 6831635 +$5.05; reconciled in Trade Log/20260615.md)
- Session equity (06/11): $5,003.96 | Change: +$59.93 (1 win — ticket 6751297, reconciled in Trade Log/20260611.md)
- Previous session equity (06/10): $4,944.03 | Change: +$15.73 (1 win, 1 scratch — reconciled in Trade Log/20260610.md)
- Session equity (06/09): $4,928.30 | Change: +$2.05 (1 win)
- 06/09 SELL (6696599) closed at 4340.97 / +$2.05 — NOT at SL/TP; verify manual close vs SL modification in MT5 (carried over)
