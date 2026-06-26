---
updated: 2026-06-26 13:57 UTC (short stopped out — flat)
synced_from: MT5 Bridge
---

# Account

| Field | Value |
|-------|-------|
| Broker | Exness MT5 |
| Instrument | XAU/USD |
| Lot size | Dynamic (1% risk model) |
| Balance | $5,050.59 |
| Equity | $5,050.59 |
| Max risk per trade (1%) | $50.51 |
| Margin used | $0 (flat) |
| Free margin | $5,050.59 |
| Open positions | **None** — flat |
| Pending orders | None |

## Session Status — 2026-06-26
- Daily P&L: **−$61.36** total closed (0 win, 2 loss) — reconciled in [[Trade Log/20260626]]:
  - T1 ticket 7077413 BUY 4000.00 → 3994.29, −57 pips, net −$11.47 (7 min, 0.02 lot) — **counter-trend dip-buy, NOT from a plan.** Bought 4000 mid-range in discount against a fully-aligned BEARISH HTF; price continued down, cut after 7 min. The "do NOT buy the dip" loss.
  - T2 ticket 7094096 (= live #9066665) SELL 4050.00 → 4074.92, −249 pips, net −$49.89 (272 min, 0.02 lot) — **planned A-grade armed short, STOPPED OUT.** Armed @4050 into 4049–4072 supply, filled ~12:35 UTC. Bounce extended THROUGH the zone (broke 4072 → 4074 → stopped at 4074.92, new high 4077.31). Textbook WITH-bias setup; supply simply didn't hold. Full-risk loss.
- Session start equity: $5,112.05 → **end $5,050.59 (−$61.46 day, −1.20%)**
- **FLAT** — no open positions, no pendings. Forward read: [[Analysis/LTF/20260626/20260626_1352_short]] (HOLD call that got stopped).
- HTF bias: ⚠️ **STALE / needs refresh.** Was BEARISH (06-26 03:09 UTC) but the relief bounce 3958.57→**4077.31** has now CLEARED the H1 bear-FVG cluster 4049–4072.75 AND the H4 OTE. A reclaim + H4 close above EQ 4087.01 neutralizes the bearish read. Run `analyze HTF` before the next trade.
- Market context: flat after 2 losses (~13:57 UTC OVERLAP). Price ~4076, broke supply to new session high 4077.31. Daily DD −1.20%, within −20% limit. **Suggest standing down — no revenge trades into a bounce that just stopped a WITH-bias short.**

## Session Status — 2026-06-24
- Daily P&L: **+$61.52** closed (1 win, 0 loss) — reconciled in [[Trade Log/20260624]]:
  - T1 ticket 8999451 SELL 4102.02 (armed limit), scaled out: 0.02 @4091.25 +$21.49 (partial, +1R) and 0.02 @4081.98 +$40.03 (runner, ~200 pips) — B+ (76) short into H4 bear FVG 4097.98–4107.40 on the new bearish down-leg. **First trade with full [[Playbooks/trade-management-checklist]] adherence** (armed entry → partial+BE at +1R → let runner run). Best result of the week. Minor note: runner closed discretionarily at 4081.98 ("200 enough") vs TP 4068 — sound here, but keep runner exits rule-based.
- Session start equity: $5,050.63
- HTF bias: See Context/htf-context.md (06-24 01:13 UTC — fresh). BEARISH (D1/H4/H1 aligned); hawkish Fed + de-escalation unwind. Range floor 4090.5 broken, swept Asian low 4068.25; draw on liquidity 4068.25 → 4052.79 → 4023.56.
- Market context: flat after +$61.52 win (~02:15 UTC ASIAN). Price ~4082. 🚨 HIGH-impact 12:30 UTC PCE/GDP cluster — no positioning into it. Forward read: [[Analysis/LTF/20260624/20260624_0113_wait]].

## Session Status — 2026-06-23
- Daily P&L: **+$2.02** closed (0 win, 0 loss, 1 win-side scratch) — reconciled in [[Trade Log/20260623]]:
  - T1 ticket 8986441 (hist 7001190) SELL 4139.6 → 4138.9, +7 pips, net +$2.02 (11 min, 0.03 lot) — B+ (76) range-high bull-trap short off the 4140.24 BSL sweep. Moved to BE early, then closed manually at 4138.9 on spike-above-4140 risk before the move developed (thesis target was EQ 4112 / range low 4090.5). Win-side scratch. Lesson: once BE is locked, let structure (M5 close back above 4140.24, alert #93) define the exit, not a single wick — keeps the 4.3:1 asymmetry intact.
- Session start equity: $5,048.69
- HTF bias: See Context/htf-context.md (06-23 01:56 UTC — fresh). BEARISH-lean (D1 ranging / H4 below OTE / H1 bearish); hawkish Fed + de-escalation unwind. Range 4090.5–4133.45, swept highs to 4140.24.
- Market context: flat after scratch (~14:10 UTC OVERLAP). Price ~4136.6, inside upper range below the swept high. Forward read: [[Analysis/LTF/20260623/20260623_1357_wait]].

## Session Status — 2026-06-22
- Daily P&L: **+$1.27** closed (0 win, 0 loss, 1 BE scratch) — reconciled in [[Trade Log/20260622]]:
  - T1 ticket 8952061 (hist 6971129) BUY 4189.66 → 4190.11, +4.5 pips, net +$1.27 (44 min, 0.03 lot) — B+ (77) range-low sweep-reclaim long. Pushed to 4210.97 (~+$60 floating) but failed to reach TP 4214.66/London high 4215.44, rotated back through EQ and tagged the BE stop. Risk-free scratch. Lesson: bank/trail B+ range trades into strength — a trail to 4197 = locked +$22 vs BE.
- Session start equity: $5,047.50
- HTF bias: See Context/htf-context.md (06-22 01:19 UTC — fresh). D1 BULLISH-lean/range 4121–4369, H4 BULLISH (OTE reclaimed), H1 BoS UP. Choppy M15 range 4188.54–4215.44.
- Market context: flat after BE scratch (14:30 UTC OVERLAP). Bullish thesis intact above 4136.24. Forward read: [[Analysis/LTF/20260622/20260622_1340_long]].

## Session Status — 2026-06-19
- Daily P&L: **+$35.65** closed (1 win, 0 loss) — reconciled in [[Trade Log/20260619]]:
  - T1 ticket 6937519 SELL 4167.31 → 4155.40, +119.1 pips, net +$35.65 (178 min, 0.03 lot) — H4 FVG rejection short, WITH-D1. Trailed SL to 4155 (too tight, $0.69 above swing high 4154.31), wick-hunted to ~4156 then reversed; runner toward TP 4121.81 given away. Green but mismanaged exit.
- Session start equity: $5,011.85
- HTF bias: See Context/htf-context.md (06-19 01:26 UTC — fresh). D1 BEARISH; overnight crash to day low 4121.32, corrective bounce to ~4178, now chopping M15 EQ 4152.55.
- Market context: WAIT at EQ (11:57 UTC LONDON). No HIGH-impact USD events next 24h. Forward read: [[Analysis/LTF/20260619/20260619_1157_wait]].

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
