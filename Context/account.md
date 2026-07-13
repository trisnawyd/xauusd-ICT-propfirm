---
updated: 2026-07-13 03:50 UTC (fresh week — FLAT, daily P&L $0.00)
synced_from: MT5 Bridge
---

# Account

| Field | Value |
|-------|-------|
| Broker | Exness MT5 |
| Instrument | XAU/USD |
| Lot size | Dynamic (1% risk model) |
| Balance | $4,934.13 |
| Equity | $4,934.13 |
| Max risk per trade (1%) | $49.34 |
| Margin used | $0 |
| Free margin | $4,934.13 |
| Open positions | **None** |
| Pending orders | **None** |

## Session Status — 2026-07-13 (ASIAN, 03:50 UTC)
- **FLAT** — no open positions, no pendings. Daily P&L **$0.00** — fresh week, nothing traded yet.
- Balance/equity unchanged at **$4,934.13**. Max risk (1%) = **$49.34**.
- Daily loss limit **−$200 (4% of $5K initial)** — **full buffer intact**. No halt condition (0/2 daily cap, 0/2 consecutive losses).
- **⚡ ARMED (pending CONFIRM, not placed):** SELL LIMIT **0.06 @ 4094** | SL **4102** | TP **4054** — R:R 5.0:1, risk $48.00, projected Grade A (81/100). See [[Analysis/LTF/202607/20260713/20260713_0350_wait]].
- **Missed move:** the 07/10 Watch B (break below 4085.43) triggered on the weekend gap and ran to 4052.79 — both 4064 and 4054 targets hit with the book flat.

### Prior session — 2026-07-10 (closed)
- Daily P&L **−$36.89 net**: 3 XAUUSD losses (−$85.13) offset by 1 US100 win (+$48.58). Balance $4,971.02 → $4,934.13 (−0.74%). See [[Trade Log/20260710]].

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
