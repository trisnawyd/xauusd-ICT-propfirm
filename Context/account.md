---
updated: 2026-07-09 23:53 UTC (re-synced after Trade 2 stopped out, FLAT)
synced_from: MT5 Bridge
---

# Account

| Field | Value |
|-------|-------|
| Broker | Exness MT5 |
| Instrument | XAU/USD |
| Lot size | Dynamic (1% risk model) |
| Balance | $4,971.02 |
| Equity | $4,971.02 |
| Max risk per trade (1%) | $49.71 |
| Margin used | $0 |
| Free margin | $4,971.02 |
| Open positions | **None** |
| Pending orders | **None** |

## Session Status — 2026-07-09 (ASIAN, end of day)
- **FLAT** — no open positions, no pendings. Daily P&L **−$28.77** (2 positions: Trade 1 +$10.64, Trade 2 −$39.41).
- Balance moved **$5,000.00 → $4,971.02** (−0.58%) on the first day of the fresh account. Max risk (1%) now **$49.71**.
- **Trade 1:** with-D1 reject-SHORT @4118.06 (0.05 lot) into the 4112/4121 ceiling — partial 0.01 @4108.09 (+$9.94), runner 0.04 scratched BE @4117.86 (+$0.70). Disciplined green leg.
- **Trade 2:** re-short @4125.02 (0.03 lot) into NY — **stopped out @4138.13 (−$39.41)** as price broke up through the 4127.51/4129.52 highs. See [[Trade Log/20260709]].
- Daily loss limit **−$200 (4%)** untouched — **$171.23 of buffer remaining**.

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
