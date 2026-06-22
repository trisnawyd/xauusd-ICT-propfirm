---
updated: 2026-06-19 11:57 UTC (latest sync)
synced_from: MT5 Bridge
---

# Account

| Field | Value |
|-------|-------|
| Broker | Exness MT5 |
| Instrument | XAU/USD |
| Lot size | Dynamic (1% risk model) |
| Balance | $5,047.50 |
| Equity | $5,047.50 |
| Max risk per trade (1%) | $50.48 |
| Margin used | $0 |
| Free margin | $5,047.50 |
| Open positions | #8952061 BUY 0.03 @4189.66, **SL 4189.76 (BE+1)**, TP 4214.66 — risk-free runner — [[Analysis/LTF/20260622/20260622_1340_long]] |
| Pending orders | None |

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
