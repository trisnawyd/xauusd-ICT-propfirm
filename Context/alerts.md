# Active Alerts

<!-- Version-controlled alert list (ships with the commit). Broker/detect/calendar timestamps are broker time (UTC+3); subtract 3h for UTC. Trust get_session_levels UTC. -->

Updated: 2026-07-14 13:21 UTC (OVERLAP, post-CPI) — bias flips **BEARISH → NEUTRAL**. Cold CPI core (0.0% m/m) spiked gold **4030 → 4103.23** at 12:30 UTC and killed the entire 07/14 bear map. **Revised 13:21:** the post-spike bull FVG has now **PRINTED and is OPEN** — Gate 3 finally has a demand zone. Table below = actual `list_alerts` EA state, verified after this cycle's `set_alert`/`delete_alert` calls.

| ID | Label | Price | Direction | Set At |
|----|-------|-------|-----------|--------|
| #173 | D1 swing high — **lower-high series breaks, bear structure dies** | 4138.42 | above | 2026-07-14 12:52 UTC |
| #172 | **Day high / BSL grab — bull continuation trigger** | 4103.23 | above | 2026-07-14 12:52 UTC |
| #177 | **Bull FVG TOP (H1+H4, CONFIRMED) — price enters Setup A long zone** | 4070.62 | below | 2026-07-14 13:21 UTC |
| #178 | Bull FVG FLOOR — **zone failing, Setup A invalidating** | 4032.20 | below | 2026-07-14 13:21 UTC |
| #175 | CPI spike origin — move fully faded, **fade-SHORT live (Setup B)** | 4022.98 | below | 2026-07-14 12:52 UTC |
| #176 | Day low — full CPI reversal, **bear map revives** | 3983.20 | below | 2026-07-14 13:21 UTC |

_Price at update: **4077.13**. H4 EQ **4081.91** sits 5 points above; the bull FVG top **4070.62** sits 6 points below. Price is pinned between them._

**What each one tells you:**
- **#172 (4103.23)** → price is retesting the spike high. This level is a **BSL grab** (the 12:00 UTC candle swept 4080.97 + 4091.20, wicked 4103.23, closed back below). A *reclaim-and-hold* means the raid was real accumulation → 4110.73 → 4138.42. A second rejection means it was a trap.
- **#173 (4138.42)** → **the structural one.** Until this breaks, 4103.23 is still a LOWER HIGH and the D1 lower-high series (4382.31 → 4220.61 → 4203.17 → 4138.42) is intact. **Only here does the bear structure genuinely die.**
- **#177 (4070.62)** → **price has entered the bull FVG.** Start watching M5/M1 for a long trigger. ⚠️ **Do NOT buy the first touch** — see the R:R note below.
- **#178 (4032.20)** → price is at the **FVG floor**; the zone is failing and Setup A is invalidating. An H1 close-hold below here flips the read to Setup B.
- **#175 (4022.98)** → the CPI spike has **fully round-tripped**. Setup B (fade-short) is live.
- **#176 (3983.20)** → total reversal; the 07/14 bear map comes back online (3958.57 → 3942.86).

**Current watch plan — Gate 3 now PASSES long. Still no trade at market.**
The 12:52 read said "zero open zones, Gate 3 fails both ways." **That has changed** — it was a data-timing artifact, exactly as flagged. The FVGs have now printed:
- **H1 BULLISH 4032.20–4070.62 [OPEN]**
- **H4 BULLISH 4034.37–4070.62 [OPEN]**

There is now a real, unmitigated HTF demand zone. **Setup A's precondition is MET.**

- **Setup A (LONG, PRIMARY — LIVE):** pullback into the FVG + M15/M5 bullish rejection → entry ~**4045**, SL **4022** (below the 4022.98 spike origin), TP1 **4103.23**, TP2 **4138.42**. SL (4045−4022)×10 = **230 pips** → 0.02 lot = **$46.00** (max risk $49.35 ✓) | TP1 (4103.23−4045)×10 = **582 pips** → **R:R 2.5:1** ✓
  - ⚠️ **DO NOT buy the FVG top.** Entry at 4068 with SL 4030 = 380 pips against a 352-pip TP1 → **R:R 0.93:1 — fails the 1:2 hard rule.** The trade only works on a **deeper fill toward 4045**. #177 firing means *start watching*, not *enter*.
- **Setup B (SHORT, conditional):** H1 **close-hold below 4032.20** → entry ~**4030**, SL **4048**, TP **3983.20**. SL **180 pips** → 0.02 lot = **$36.00** ✓ | TP **468 pips** → **R:R 2.6:1**. ⚠️ Fades a real catalyst — requires the H1 close first, do not pre-empt.
- **At market (4077): nothing.** Price is above the zone. Wait for the retrace.

_Bias **NEUTRAL / TRANSITIONAL**. Bear map dead, bull structure unproven — 4103.23 is still a lower high vs 4138.42 and the spike high was a rejected BSL grab. But a confirmed bull FVG at 4032–4070 now gives the long a real zone to work from._

**⚠️ NEWS REMAINING (UTC):** **16:40 & 16:55 Fed Barr** · **17:30 Fed Cook** · **18:55 Fed Bowman** · **20:00 TIC** — all MEDIUM. (The calendar tool reports these as 19:40/19:55/20:30/21:55 — **broker time, +3h**.) A Fed speaker framing the 0.0% core print is the next volatility risk. No new entries ±15min around each.

<!-- Removed this cycle: #169 (3983.20), #170 (3958.57), #171 (3942.86) — all deleted; the bear-map labels they carried ("bear continuation", "bear resolution") are dead after CPI. The 3983.20 LEVEL survives as #176 with a corrected label. NOTE: #164–#168 (4060.70 / 4051.17 / 4042.50 / 4037.49 / 4021.56) were never deleted — they FIRED and were auto-consumed by the EA as the CPI spike ran straight through all five. alerts.md had drifted from EA state; this cycle re-verified against list_alerts. -->
