# Active Alerts

<!-- Version-controlled alert list (ships with the commit). Broker/detect timestamps are broker time (UTC+3); subtract 3h for UTC. Trust get_session_levels UTC. -->

Updated: 2026-07-14 02:05 UTC (ASIAN) — bias stays **BEARISH**; the 4021.56 D1 floor broke on 07/13 and price ran to 3983.20. The whole alert map has been **rebuilt one shelf lower** — every level from the 07/13 map (4094 / 4101 / 4052 / 4021) is now behind price and dead.

## 🚨 EA alert state is OUT OF SYNC — operator action needed

`list_alerts` returns only **two ancient alerts** that survived an EA/terminal restart and bear no relation to the current tape:

| ID | Label | Price | Direction | Status |
|----|-------|-------|-----------|--------|
| #162 | M15 EQ reclaim (bounce alive) | 4200.31 | above | ❌ STALE — ~190 points above price, from a pre-June map |
| #163 | H1 FVG supply (Watch B) | 4247.57 | above | ❌ STALE — ~238 points above price, from a pre-June map |

The 07/13 alerts (#285–#288) and #267 are **gone from the EA** — lost when the terminal restarted. This cycle does **not** call `set_alert`/`delete_alert` (order/EA mutations are a human action, outside `/trade-cycle` scope). **To register the map below, run `set alert` for each level and delete #162/#163.**

## Target alert map — 2026-07-14 (to be registered)

| Label | Price | Direction | Why |
|-------|-------|-----------|-----|
| H4 EQ — **BEAR INVALIDATION** | 4060.70 | above | H1 reclaim-hold above kills the whole bear thesis → 4067.51 → 4090–4097.56 |
| M15 bear FVG top — SL shelter | 4051.17 | above | Upper edge of the Watch A stop zone |
| SHORT zone — pending #9954835 entry | 4042.50 | above | Top edge of H4 sell-OTE; the resting limit fills here |
| **SHORT zone floor — Watch A entry** | 4037.49 | above | M15 bear FVG 4037.49–4041.94 ∩ H4 sell-OTE ∩ flipped 4021.56 |
| Flipped D1 low — zone approach | 4021.56 | above | Broke 07/13; support → resistance. First warning the retrace is live |
| Day low break — **bear continuation** | 3983.20 | below | Close-hold below → Watch B → 3958.57 |
| D1 swing low — first target | 3958.57 | below | 06/24 low |
| D1 range floor — **bear resolution** | 3942.86 | below | Daily close below resolves the 3942–4382 D1 range |

**Current watch plan:**
- **Watch A (SHORT, PRIMARY):** rally into **4037–4042** (M15 bear FVG 4037.49–4041.94 ∩ H4 sell-OTE 4018.2–4043.16 ∩ flipped 4021.56) + M5/M1 bearish rejection → entry ~**4040**, SL **4055**, TP1 **3983.20** → TP **3958.57** (R:R **5.4:1**, lot 0.03, risk $45.00). **Already covered by resting pending #9954835** (SELL_LIMIT 0.02 @4042.5, SL 4054.5, TP 3986.5) — no new order proposed. Its TP 3986.5 is conservative and forfeits the 3958/3942 leg.
- **Watch B (SHORT, continuation):** M5 close-hold below **3983.20** → entry ~**3982**, SL **3996**, TP **3944** (R:R **2.7:1**, lot 0.03, risk $42.00).
- **LONG: not available** — fails Gate 3 counter-trend (zero open H4 demand zones; price is *below* the H4 OTE, not inside it).
- **Bear invalidation:** H1 reclaim-hold above **4060.70** (H4 EQ) → kills both watches, opens 4067.51 → 4090–4097.56.

_Bias BEARISH (D1/H4/H1 all down). Price 4009.29 has been compressing in a 3983–4012 range for ~9 hours, directly beneath the 4020–4043 supply band, and is now pressing the range top. **Gate 3 WAIT — no entry zone:** M5 has 0 open OBs and 0 open FVGs; the nearest supply is ~300 pips up. Sell the retrace into 4037–4042, don't chase._

**⚠️ CPI 15:30 UTC — HIGH impact** (CPI m/m, Core CPI m/m, CPI y/y). The day's pivot; the nine-hour base is a market waiting for it. **No new entries 15:15–15:45.** If #9954835 fills before then it carries a 120-pip SL through the release.

<!-- Dead this cycle (all behind price after the 07/13 breakdown): #267 (4180.61), #285 (4094.00), #286 (4101.09), #287 (4052.79), #288 (4021.56 — level survives as a flipped-resistance alert above, but the old "below" trigger is spent). Also stale in EA: #162 (4200.31), #163 (4247.57). -->
