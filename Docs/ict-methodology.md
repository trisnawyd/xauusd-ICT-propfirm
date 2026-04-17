# ICT/SMC Methodology Reference

## Timeframe Stack
| Role | Timeframes | Purpose |
|------|-----------|---------|
| HTF Bias | D1 + 4H + 1H | Trend direction, stored in `Context/htf-context.md` |
| Intermediate | M15 | Market structure confirmation |
| Entry | M5 | OB or FVG confirmation |
| Precision | M1 | Exact entry trigger |

## Core Concepts
1. **BoS and CHoCH** — identify trend direction and reversals
2. **Order Blocks (OB)** — last opposing candle before BoS; unmitigated OBs only
3. **FVG and IFVG** — 3-candle imbalance gaps; flipped gaps as entry zones
4. **Session Levels** — Asia/London/NY highs and lows as liquidity pools
5. **Premium vs Discount** — buy in discount only, sell in premium only
6. **Liquidity Sweeps** — BSL and SSL grabs occur before the real directional move

## Session Identification (UTC)
→ Session hours are defined in `CLAUDE.md` (authoritative). Summary: Asian 22:00–08:00 | London 08:00–17:00 | NY 13:00–21:00 | Overlap 13:00–17:00.
