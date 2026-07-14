# Active Alerts

<!-- Version-controlled alert list (ships with the commit). Broker/detect timestamps are broker time (UTC+3); subtract 3h for UTC. Trust get_session_levels UTC. -->

Updated: 2026-07-14 02:20 UTC (ASIAN) — bias stays **BEARISH**; the 4021.56 D1 floor broke on 07/13 and price ran to 3983.20. The alert map has been **rebuilt one shelf lower** — every level from the 07/13 map (4094 / 4101 / 4052 / 4021-below) is now behind price and dead. Table below = actual `list_alerts` EA state, verified after this cycle's `set_alert`/`delete_alert` calls.

| ID | Label | Price | Direction | Set At |
|----|-------|-------|-----------|--------|
| #164 | H4 EQ — **BEAR INVALIDATION** | 4060.70 | above | 2026-07-14 02:20 UTC |
| #165 | M15 bear FVG top — SL shelter | 4051.17 | above | 2026-07-14 02:20 UTC |
| #166 | SHORT zone — pending #9954835 entry | 4042.50 | above | 2026-07-14 02:20 UTC |
| #167 | **Watch A entry — M15 bear FVG floor** | 4037.49 | above | 2026-07-14 02:20 UTC |
| #168 | Flipped D1 low — zone approach | 4021.56 | above | 2026-07-14 02:20 UTC |
| #169 | **Day low break — bear continuation (Watch B)** | 3983.20 | below | 2026-07-14 02:20 UTC |
| #170 | D1 swing low — first target | 3958.57 | below | 2026-07-14 02:20 UTC |
| #171 | D1 range floor — **bear resolution** | 3942.86 | below | 2026-07-14 02:20 UTC |

**What each one tells you:**
- **#168 (4021.56)** fires first on a rally — the retrace toward the short zone is live.
- **#167 (4037.49)** → price is entering the Watch A zone. **#166 (4042.50)** → the resting limit is about to fill.
- **#165 (4051.17)** → price is inside the stop shelter; the setup is under pressure.
- **#164 (4060.70)** → **thesis dead.** H1 reclaim-hold above H4 EQ opens 4067.51 → 4090–4097.56.
- **#169 (3983.20)** → the retrace never came; Watch B (continuation short) is live.
- **#170 / #171** → downside targets landing.

**Current watch plan:**
- **Watch A (SHORT, PRIMARY):** rally into **4037–4042** (M15 bear FVG 4037.49–4041.94 ∩ H4 sell-OTE 4018.2–4043.16 ∩ flipped 4021.56) + M5/M1 bearish rejection → entry ~**4040**, SL **4055**, TP1 **3983.20** → TP **3958.57** (R:R **5.4:1**, lot 0.03, risk $45.00). **Already covered by resting pending #9954835** (SELL_LIMIT 0.02 @4042.5, SL 4054.5, TP 3986.5) — no new order proposed. Its TP 3986.5 is conservative and forfeits the 3958/3942 leg.
- **Watch B (SHORT, continuation):** M5 close-hold below **3983.20** → entry ~**3982**, SL **3996**, TP **3944** (R:R **2.7:1**, lot 0.03, risk $42.00).
- **LONG: not available** — fails Gate 3 counter-trend (zero open H4 demand zones; price is *below* the H4 OTE, not inside it).
- **Bear invalidation:** H1 reclaim-hold above **4060.70** (H4 EQ) → kills both watches, opens 4067.51 → 4090–4097.56.

_Bias BEARISH (D1/H4/H1 all down). Price ~4009 has been compressing in a 3983–4012 range for ~9 hours, directly beneath the 4020–4043 supply band, and is now pressing the range top. **Gate 3 WAIT — no entry zone:** M5 has 0 open OBs and 0 open FVGs; the nearest supply is ~300 pips up. Sell the retrace into 4037–4042, don't chase._

**⚠️ CPI 15:30 UTC — HIGH impact** (CPI m/m, Core CPI m/m, CPI y/y). The day's pivot; the nine-hour base is a market waiting for it. **No new entries 15:15–15:45.** If #9954835 fills before then it carries a 120-pip SL through the release.

<!-- Removed this cycle: #162 (4200.31, "M15 EQ reclaim") and #163 (4247.57, "H1 FVG supply") — both deleted; ancient pre-June levels ~190-240 points above price that had survived an EA restart. Also dead (never re-registered after the restart): #267 (4180.61), #285 (4094.00), #286 (4101.09), #287 (4052.79), #288 (4021.56 below-trigger — the level survives as #168, but flipped to an above-trigger since price is now beneath it). -->
