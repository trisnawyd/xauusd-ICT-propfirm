# Fix Plan — Trade History Reports Inverted Direction

**Status:** Diagnosed, NOT yet applied (check-only per request)
**Date raised:** 20260609
**Severity:** Medium — wrong direction label on closed trades; corrupts trade-log reconciliation and journaling. Does NOT affect PnL, equity, or live execution.

---

## Symptom
`get_trade_history` returns the opposite direction for every closed trade. The last SELL shows as `buy`, the last BUY shows as `sell`, etc.

## Live verification (MCP, 7d, XAUUSD)
All 5 returned trades contradict the price/PnL relationship, confirming a 100% systematic inversion (not random):

| ticket  | reported | open→close      | net    | truth |
|---------|----------|-----------------|--------|-------|
| 6550796 | sell     | 4497.26→4486.97 | −30.95 | BUY   |
| 6585578 | sell     | 4439.98→4429.60 | −35.87 | BUY   |
| 6589298 | sell     | 4458.78→4473.67 | +44.59 | BUY   |
| 6673963 | buy      | 4322.95→4333.35 | −31.28 | SELL  |
| 6696599 | buy      | 4341.68→4340.97 | +2.05  | SELL  |

(A real SELL profits when price falls; a real BUY profits when price rises. Every row violates its own label, so the label is inverted while open/close/net are correct.)

## Root cause
`mt5-mcp-server/MT5Bridge.mq5`, function `GetTradeHistory()`:

- Line 534 — the outer loop intentionally selects only the **closing** deal: `if(HistoryDealGetInteger(ticket, DEAL_ENTRY) != DEAL_ENTRY_OUT) continue;`
- Line 544 — `long dtype = HistoryDealGetInteger(ticket, DEAL_TYPE);` reads the type of that **closing** deal.
- Line 571 — `(dtype == DEAL_TYPE_BUY ? "buy" : "sell")` labels the trade from the closing deal.

In MT5, a position is closed by a deal of the **opposite** type:
- BUY position → closed by a `DEAL_TYPE_SELL` deal → mislabeled `sell`
- SELL position → closed by a `DEAL_TYPE_BUY` deal → mislabeled `buy`

So `dtype` is structurally the inverse of the position direction. The user's "deals instead of position" hypothesis is correct: the direction must come from the **opening** deal (`DEAL_ENTRY_IN`), not the closing deal.

## Scope check — what is and isn't affected
- **Affected:** the `type` field of `get_trade_history` only.
- **NOT affected:**
  - `open_price` (read from the open deal, line 555) and `close_price` (close deal, line 541) — correct.
  - `net_profit` / `profit` / `commission` / `swap` — correct.
  - `get_performance_stats` (server.ts:532–575) — uses `net_profit` and `open_time`, never `type`. Win/loss math is unaffected.
  - `get_daily_drawdown` (MT5Bridge.mq5:~814) — uses profit only, no type. Unaffected.
  - Live `get_open_positions` (line 419) — reads `POSITION_TYPE` directly. Correct, not part of this bug.
- **server.ts:1174–1182** just forwards `t.type` verbatim into CSV — no change needed there.

---

## Fix

### Primary fix (recommended — self-documenting)
The inner loop at lines 549–558 already locates the matching opening deal `ot`. Capture its type there and use it for the label.

1. Add an `otype` variable alongside `oprice`/`otime` (near line 547–548):
   ```mq5
   double   oprice = 0;
   datetime otime  = 0;
   long     otype  = -1;
   ```
2. Inside the inner loop, after `otime = ...` (line 556), capture the open deal's type:
   ```mq5
   otype  = HistoryDealGetInteger(ot, DEAL_TYPE);
   ```
3. Change line 571 from `dtype` to `otype`:
   ```mq5
   (otype == DEAL_TYPE_BUY ? "buy" : "sell"),
   ```
4. `dtype` (line 544) becomes unused — remove it to avoid confusion.

### Edge case to handle while fixing
If a position was opened *before* `from_time` (e.g. opened 8 days ago, closed within the 7d window), the inner loop won't find the opening deal in the selected range, leaving `oprice=0`, `otime=0`, `otype=-1`. With the fix, `otype=-1` would fall through to `"sell"`, and `open_price` already shows `0.00` (pre-existing). Mitigation: widen the `HistorySelect` lower bound by a buffer (e.g. start from `from_time - 7*86400`) and keep the *display/filter* window based on the closing deal's `ctime`. Optional but recommended to make open_price/type robust for trades that span the window boundary.

### Fallback fix (one-liner, NOT preferred)
Since the closing deal type is always the inverse, line 571 could be inverted:
```mq5
(dtype == DEAL_TYPE_BUY ? "sell" : "buy"),
```
Rejected as the primary: it's correct but cryptic, and it does nothing for the open-deal edge case. Use only if a minimal diff is required.

---

## Apply & deploy steps
1. Edit `mt5-mcp-server/MT5Bridge.mq5` per the primary fix.
2. **Recompile in MetaEditor** → produces a new `MT5Bridge.ex5` (the `.mq5` source change alone does nothing until recompiled).
3. In MT5, remove and re-attach the EA to the chart (or recompile triggers auto-reload), confirm "MT5Bridge" loaded OK in Experts log.
4. No change to `server.ts` or `dist/server.js`; no MCP server restart strictly required, but restart if anything is cached.

## Verification after fix
1. Re-run `get_trade_history period:7d` and re-check the same 5 tickets against the table above — each `type` should now match the price/PnL logic.
2. Spot-check one trade against the MT5 terminal History tab (Positions view) for the same ticket/position id.
3. Confirm `get_performance_stats` win rate is unchanged (it never depended on type).
4. Reconcile against `Trade Log/` entries that were written from the inverted data — earlier logged directions may need correcting (separate cleanup task; list affected dates before editing).

## Follow-up (not part of this fix)
- Audit existing `Trade Log/YYYYMMDD.md` files whose direction was sourced from this tool; they may carry the inverted label.
- Add a unit/integration check or a sanity assertion (e.g. flag any row where a "sell" has profit while close>open) to catch regressions.
