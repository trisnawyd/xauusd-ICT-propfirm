---
updated: 2026-07-09 07:30 UTC (FRESH ACCOUNT — reset to $5,000.00, FLAT, no history)
synced_from: MT5 Bridge
---

# Account

| Field | Value |
|-------|-------|
| Broker | Exness MT5 |
| Instrument | XAU/USD |
| Lot size | Dynamic (1% risk model) |
| Balance | $5,000.00 |
| Equity | $5,000.00 |
| Max risk per trade (1%) | $50.00 |
| Margin used | $0 |
| Free margin | $5,000.00 |
| Open positions | **None** |
| Pending orders | **None** |

## Session Status — 2026-07-09 (FRESH ACCOUNT)
- **New account started.** Balance/equity reset to **$5,000.00**, max risk (1%) = **$50.00**.
- **FLAT** — no open positions, no pendings. Daily P&L **$0.00** (0W/0L).
- All prior-account trade logs, stats, and analysis archived to `_old-account/`. Live EA alerts cleared (was #158–#249) — alert set now empty.
- Clean slate — no session history carried forward. First trade on this account logs fresh.
- Market context: ASIAN (07:30 UTC), price ~4090. Run `analyze HTF` before the first trade — no HTF context carried from the old account state.
- News (UTC): 12:30 Initial Jobless Claims (HIGH), 14:00 Existing Home Sales (HIGH), 17:00 30-Year Bond Auction (HIGH). Stand down ~15 min around 12:30 / 14:00.

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
- Fresh account started 2026-07-09 at $5,000.00. Prior-account history in `_old-account/`.
