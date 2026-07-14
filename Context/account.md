---
updated: 2026-07-14 02:05 UTC (ASIAN — FLAT, 1 pending, daily P&L $0.00)
synced_from: MT5 Bridge
---

# Account

| Field | Value |
|-------|-------|
| Broker | Exness MT5 |
| Instrument | XAU/USD |
| Lot size | Dynamic (1% risk model) |
| Balance | $4,934.73 |
| Equity | $4,934.73 |
| Max risk per trade (1%) | $49.35 |
| Margin used | $808.50 |
| Free margin | $4,126.23 |
| Open positions | **None** |
| Pending orders | **1** — #9954835 SELL_LIMIT 0.02 @4042.5, SL 4054.5, TP 3986.5 |

## Session Status — 2026-07-14 (ASIAN, 02:05 UTC)
- **FLAT** — no open positions. Daily P&L **$0.00** (closed $0 / float $0) — nothing traded today.
- **1 resting pending:** #9954835 SELL_LIMIT 0.02 @4042.5 | SL 4054.5 | TP 3986.5 — R:R 4.67:1, risk **$24.00**. Sits at the top edge of the H4 sell-OTE (4018.2–4043.16), consistent with the HTF bear thesis. **Its TP 3986.5 is conservative** — it exits at the swept low and forfeits the 3958.57 / 3942.86 leg.
- Balance/equity **$4,934.73**. Max risk (1%) = **$49.35**.
- Daily loss limit **−$200 (4% of $5K initial)** — **full buffer intact** (0/2 daily cap, 0/2 consecutive losses).
- **⚠️ CPI 15:30 UTC (HIGH).** If the pending fills before then, it carries a 120-pip SL through the release.

## 🚨 UNRESOLVED — 07/13 trade-log gap (operator action needed)
MT5 `get_trade_history 7d` returns **4 trades on 07/13 that exist in no Trade Log file** (`Trade Log/20260713.md` does not exist) and match **no graded plan** — every 07/13 analysis was WAIT or SHORT, yet **all four were LONGS into a confirmed BEARISH tape**:

| Ticket | Dir | Entry | Exit | Net | Dur |
|--------|-----|-------|------|-----|-----|
| 7726387 | BUY | 4059.09 | 4059.33 | **+$0.21** | 27m |
| 7735849 | BUY | 4073.74 | 4063.57 | **−$30.59** | 120m |
| 7749656 | BUY | 4045.23 | 4039.30 | **−$17.87** | 0m |
| 7766829 | BUY | 3989.99 | 3994.80 | **+$9.57** | 83m |
| | | | **Net** | **−$38.68** | |

#7726387 @4059.09 is the same entry price as the unexplained open BUY **#9910326** that the 07/13 07:35 cycle flagged for review.

**The balance does NOT reconcile:** account.md recorded $4,934.13 on 07/13 03:50; equity is now $4,934.73 — a **+$0.60** delta, not the **−$38.68** these trades imply. Either `get_trade_history` P&L/labels are unreliable (the reconcile script already documents an intermittent buy/sell label-inversion bug in this tool) or the history is being misattributed. **These trades have deliberately NOT been written to the Trade Log** — fabricating ground truth from numbers that don't add up would corrupt the performance stats. **Operator must confirm the origin and the true P&L before they are logged.**

## Lot Sizing Formula
Lot = Max Risk ÷ (SL pips × $10)  → round to nearest 0.01

| SL (pips) | Lot | Risk $ |
|-----------|-----|--------|
| 50        | 0.10 | $50.00 |
| 80        | 0.06 | $48.00 |
| 100       | 0.05 | $50.00 |
| 130       | 0.04 | $52.00 → use 0.03 ($39.00) |
| 150       | 0.03 | $45.00 |
| 200       | 0.03 | $60.00 → use 0.02 ($40.00) |

Use `calculate lot [sl_pips]` command for precise value on current equity.

## Notes
- Commission per trade: $0.11
- Risk model: dynamic 1% of current equity per trade
- Update after every closed trade with "sync account"
- Fresh account started 2026-07-09 at $5,000.00. Prior-account history in `_old-account/`.
- **Logged performance to date (Trade Log = ground truth, 5 trades):** 1W / 4L, win rate 20%, net **−$75.96**, profit factor 0.39. Plan adherence: **1 of 5** trades came from a graded plan — the other 4 were discretionary. This is the single biggest leak in the book.
