# Active Alerts

<!-- Version-controlled alert list (ships with the commit). Broker/detect/calendar timestamps are broker time (UTC+3); subtract 3h for UTC. Trust get_session_levels UTC. -->

Updated: 2026-07-14 12:52 UTC (LONDON, post-CPI) — bias flips **BEARISH → NEUTRAL**. Cold CPI core (0.0% m/m) spiked gold **4030 → 4103.23** at 12:30 UTC and killed the entire 07/14 bear map. Table below = actual `list_alerts` EA state, verified after this cycle's `set_alert`/`delete_alert` calls.

| ID | Label | Price | Direction | Set At |
|----|-------|-------|-----------|--------|
| #173 | D1 swing high — **lower-high series breaks, bear structure dies** | 4138.42 | above | 2026-07-14 12:52 UTC |
| #172 | **Day high / BSL grab — bull continuation trigger** | 4103.23 | above | 2026-07-14 12:52 UTC |
| #174 | H1 bull FVG top (forming) — **retrace-LONG zone (Setup A)** | 4032.20 | below | 2026-07-14 12:52 UTC |
| #175 | CPI spike origin — move fully faded, **fade-SHORT live (Setup B)** | 4022.98 | below | 2026-07-14 12:52 UTC |
| #176 | Day low — full CPI reversal, **bear map revives** | 3983.20 | below | 2026-07-14 12:52 UTC |

_Price at update: **4079.74**. H4 EQ **4081.91** sits 2 points above — price is ON the fence._

**What each one tells you:**
- **#172 (4103.23)** → price is retesting the spike high. This level is a **BSL grab** (the 12:00 UTC candle swept 4080.97 + 4091.20, wicked 4103.23, closed back at 4079.86). A *reclaim-and-hold* means the raid was real accumulation → 4110.73 → 4138.42. A second rejection means it was a trap.
- **#173 (4138.42)** → **the structural one.** Until this breaks, 4103.23 is still a LOWER HIGH and the D1 lower-high series (4382.31 → 4220.61 → 4203.17 → 4138.42) is intact. **Only here does the bear structure genuinely die.**
- **#174 (4032.20)** → price is entering the **Setup A** retrace-long zone. ⚠️ **Precondition: the H1 bull FVG must actually print in `detect_fvg` first** — it cannot exist yet (the 12:00 UTC H1 candle is still open; an FVG needs 3 closed candles). If the FVG never forms, this alert is just a level.
- **#175 (4022.98)** → the CPI spike has **fully round-tripped**. Setup B (fade-short) activates on an H1 close-hold below 4032.20.
- **#176 (3983.20)** → total reversal; the 07/14 bear map comes back online (3958.57 → 3942.86).

**Current watch plan — NO TRADE AT MARKET (Gate 3 fails BOTH directions):**
Zero unmitigated H4/H1 OBs and FVGs (`open:0` on all four scans) and price is sitting on H4 EQ. A LONG has no demand zone to buy; a SHORT has no supply zone to sell and would fade a live fundamental catalyst. Wait for the impulse to resolve into structure, then trade the retest — not the spike.

- **Setup A (LONG, PRIMARY — conditional):** H1 bull FVG prints → pullback into **4032–4058** + M15/M5 bullish rejection → entry ~**4045**, SL **4022**, TP1 **4103.23**, TP2 **4138.42**. SL (4045−4022)×10 = **230 pips** → 0.02 lot = **$46.00** (max risk $49.35 ✓) | TP1 **582 pips** → **R:R 2.5:1**.
- **Setup B (SHORT, conditional):** H1 **close-hold below 4032.20** → entry ~**4030**, SL **4048**, TP **3983.20**. SL **180 pips** → 0.02 lot = **$36.00** ✓ | TP **468 pips** → **R:R 2.6:1**. ⚠️ Fades a real catalyst — requires the H1 close first, do not pre-empt.
- **At market: nothing.** Both directions fail Gate 3.

_Bias **NEUTRAL / TRANSITIONAL**. Bear map dead, bull structure unproven. Price 4079.74 on H4 EQ 4081.91, D1 lower-high 4138.42 intact, spike high was a rejected BSL grab._

**⚠️ NEWS REMAINING (UTC):** **16:40 & 16:55 Fed Barr** · **17:30 Fed Cook** · **18:55 Fed Bowman** · **20:00 TIC** — all MEDIUM. (The calendar tool reports these as 19:40/19:55/20:30/21:55 — **broker time, +3h**.) A Fed speaker framing the 0.0% core print is the next volatility risk. No new entries ±15min around each.

<!-- Removed this cycle: #169 (3983.20), #170 (3958.57), #171 (3942.86) — all deleted; the bear-map labels they carried ("bear continuation", "bear resolution") are dead after CPI. The 3983.20 LEVEL survives as #176 with a corrected label. NOTE: #164–#168 (4060.70 / 4051.17 / 4042.50 / 4037.49 / 4021.56) were never deleted — they FIRED and were auto-consumed by the EA as the CPI spike ran straight through all five. alerts.md had drifted from EA state; this cycle re-verified against list_alerts. -->
