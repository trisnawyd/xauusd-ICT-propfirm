---
updated: 2026-06-03 01:21 UTC (latest sync)
synced_from: MT5 Bridge
---

# Account

| Field | Value |
|-------|-------|
| Broker | Exness MT5 |
| Instrument | XAU/USD |
| Lot size | Dynamic (1% risk model) |
| Balance | $4,949.13 |
| Equity | $4,949.13 |
| Max risk per trade (1%) | $49.49 |
| Margin used | $0 |
| Free margin | $4,949.13 |
| Open positions | None |
| Pending orders | None |

## Session Status — 2026-06-03
- Daily P&L: $0.00 (no trades yet — session start equity: $4,949.13)
- HTF bias: See Context/htf-context.md

## Lot Sizing Formula
Lot = Max Risk ÷ (SL pips × $10)  → round to nearest 0.01

| SL (pips) | Lot | Risk $ |
|-----------|-----|--------|
| 50        | 0.09 | $45.00 |
| 80        | 0.06 | $48.00 |
| 100       | 0.04 | $40.00 |
| 130       | 0.03 | $39.00 |
| 200       | 0.02 | $40.00 |

Use `calculate lot [sl_pips]` command for precise value on current equity.

## Notes
- Commission per trade: $0.11
- Risk model: dynamic 1% of current equity per trade
- Update after every closed trade with "sync account"
- Session start equity (06/03): $4,949.13
- ⚠️ Equity dropped $31.03 from previous recorded balance ($4,980.16) — check trade log for 06/02 activity
