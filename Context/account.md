---
updated: 2026-06-09 12:02 UTC (latest sync)
synced_from: MT5 Bridge
---

# Account

| Field | Value |
|-------|-------|
| Broker | Exness MT5 |
| Instrument | XAU/USD |
| Lot size | Dynamic (1% risk model) |
| Balance | $4,926.33 |
| Equity | $4,926.33 |
| Max risk per trade (1%) | $49.26 |
| Margin used | $0 |
| Free margin | $4,926.33 |
| Open positions | None |
| Pending orders | None |

## Session Status — 2026-06-09
- Daily P&L: $0.00 (no open positions, no pending orders)
- Session start equity: $4,926.33
- HTF bias: See Context/htf-context.md
- ✅ Equity drop of $31.36 ($4,957.69 → $4,926.33) RESOLVED via `sync trade log`: ticket 6673963 closed −$31.28 net (06/08) + ~$0.08 swap. Logged to `Trade Log/20260608.md`. NOTE: bridge reported direction/price for that ticket are internally inconsistent — verify in MT5 terminal.

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
- Session start equity (06/09): $4,926.33
- Previous session equity (06/08): $4,957.69 | Change: −$31.36 (unexplained — investigate)
