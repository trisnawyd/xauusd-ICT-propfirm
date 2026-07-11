# Trade Management Checklist (enforce on EVERY trade)

**Why this exists:** Entries have been fine (consistently B+). The edge is being bled at the **exit** — emotion is deciding when to close, and emotion peaks at the turn. This checklist removes the exit decision from how you feel. Pre-decide everything; then only execute.

> Two-day evidence this fixes:
> - **06-22 BUY** — held a B+ long, gave back **+$60 floating** to a BE scratch (held too long, no partial).
> - **06-23 SHORT** — closed at the **start** of the move on a single 4140 wick (closed too early, no structure rule). +$2.02 instead of the armed 4.3:1.
> Opposite mistakes, same root cause: no mechanical rule → fear decides.

---

## RULE 1 — Stop goes BEYOND the liquidity, never AT it
Your stop must not sit where every other stop sits (just above a swept high / below a swept low) — that pool is exactly where price is *drawn* to sweep before reversing your way.

- Place SL beyond the level where the **next** trader would be trapped, + a buffer (gold: ~3–5 pips past the wick, not 1).
- Wider stop ⇒ **smaller lot**, same dollar risk. Re-run `calculate lot [sl_pips]` — never widen the dollar risk to keep a big lot.
- Hard cap unchanged: SL $ ≤ 1% max risk (currently ~$50). R:R ≥ 1:2.

✅ Check: "Is my SL past the obvious liquidity, or parked inside it?" If inside → move it out and recut the lot.

---

## RULE 2 — Partial at +1R, runner to target (THE core fix)
This single rule kills both failure modes — early-fear closes AND give-back round-trips.

- At **+1R**, close **half** the position. Lock the win.
- Simultaneously move SL on the remainder to **breakeven + 1 pip**.
- Result: a reversal now scratches you **green**; a real move still runs to target.
- Do NOT move to BE *before* +1R (06-22 lesson: BE parked inside the entry FVG = premature scratch).

✅ Check: "Have I taken the +1R partial and moved the rest to BE?" Until +1R, the original SL stands — no touching it out of fear.

---

## RULE 3 — After BE, exit on STRUCTURE, not on a candle/feeling
Once the trade is risk-free, a single scary wick has **no vote**. Pre-define the invalidation level and let price close through it.

- Define the structural invalidation **before** entry (e.g. "M5 close back above the 4140.24 swept high").
- Set an alert at that level (the LTF analysis already does this — e.g. #93 @4141). That alert, or a candle close through it, is the ONLY reason to exit the runner early.
- A wick that pokes the level but closes back = noise. Hold.
- Capitulation feeling = often the turn. The discomfort that says "close now" is the same discomfort making others close = the reversal point. Distrust it.

✅ Check: "Is this an M5/M15 *close* through my invalidation, or just a wick scaring me?" Wick → hold. Close → exit.

---

## Pre-Trade Pre-Commit (fill this in BEFORE clicking buy/sell)
Write these 5 numbers down; you are not allowed to change them mid-trade except per Rules 2 & 3.

1. Entry: ______
2. SL (beyond liquidity + buffer): ______  → SL pips: ______ → lot: ______ → risk $: ______ (≤ max)
3. +1R partial price: ______ (= entry ± SL distance)
4. Final target (TP): ______ → R:R: ______ (≥ 2:1)
5. Structural invalidation for the runner: ______ (set alert here)

---

## In-Trade Decision Tree (the ONLY allowed actions)
```
price hits SL ............................. let it. Risk was pre-sized. Do nothing.
price hits +1R ............................ close HALF + move remainder SL to BE+1
runner: wick through invalidation ......... HOLD (noise)
runner: M5/M15 CLOSE through invalidation .. exit remainder
runner: hits final TP ..................... close remainder (or trail next swing if trending)
feel scared / want to "just close it" ..... NOT a valid action. Check the tree above.
```

---

## The one-line law
**Pre-decide the exit; let structure execute it. The only emotion-driven action allowed is none.**

---

## Auto-Mode Management Rules (mechanical — the headless loop runs these, no discretion)

**Scope:** applies ONLY when `auto-mode.json` `enabled: true`. Source of truth:
`xauusd-ict-claude/full-automation-plan.md` §5 and the runbook
`xauusd-ict-claude/docs/auto-cycle.md`. The manual RULE 1–3 above are for
hand-traded positions; the auto loop follows *this* table so the exit rules are
enforced the same way whether or not a human is watching. Cadence: the 5-min
management lane runs 24/5 **whenever any position or pending is open** (no time
stop — positions ride to SL/TP, so they can hold overnight).

| # | Trigger (all numbers pulled fresh this cycle) | Action | Maps to |
|---|---|---|---|
| A | Pending filled but its confirmation (e.g. M5 CHoCH alert) has NOT fired within 15 min of fill, **or** price closes M5 against entry without the trigger | `close_position` (scratch ≈ BE / small loss) | **NEW — no manual equivalent.** #9710396 07-08 lesson |
| B | Position ≥ **+1R** floating | `move_to_breakeven` (BE + 1 pip) | RULE 2 (BE half of it) |
| C | Position ≥ +1R **and** lot ≥ 0.02 | `close_position` half, keep runner to TP | RULE 2 (partial). At 0.01 lot there is nothing to halve → BE only |
| D | HIGH-impact event ≤ 15 min ahead, position **< +1R** | `close_position`; if **≥ +1R**, tighten to BE and hold | **NEW — no manual equivalent.** T8 07-06 Waller lesson |
| E | Session end / M5 close beyond invalidation level / HTF stale (pending) | `delete_pending_order`, log the cancel | RULE 3 invalidation, applied to pendings (armed-WAIT expiry) |
| F | Hard SL/TP always at broker on entry | (enforced by all 3 layers) | RULE 1 |

### Where auto DIVERGES from the manual rules above (read this)

- **Risk is 0.5%, not 1%.** Trial sizing is 0.5% (~$25) per trade, `auto_max_lot`
  **0.05**, R:R ≥ **2:1**. The manual "1% / ~$50 / R:R ≥ 1:2" caps do NOT apply in auto.
- **No discretionary early bank in v1.** The manual adherence log's "+200 enough,
  close the runner" call (ticket 8999451) would be **disallowed** by the auto loop —
  it runs partial-at-1R + runner-to-TP/structure only, and the review measures the
  delta vs. the human's early-exit instinct. "Bank when it feels done" is not codifiable.
- **SL is structural, sized by lot — never tightened to afford lot.** Same spirit as
  RULE 1, but mechanical: if 0.01 lot at the structural SL still exceeds 0.5% risk,
  **skip the trade** (do not narrow the stop to fit).
- **Rules A and D have no manual counterpart** — they exist because the two documented
  auto failure modes (pre-trigger fill, news-through-SL) are *management* failures a
  watching human caught by hand; the loop has to catch them by rule.

---

## Adherence Log (mark each trade Y/N — track if you actually followed it)

| Date | Ticket | R1 SL-beyond-liq | R2 +1R partial+BE | R3 structure exit | Followed all 3? | Note |
|------|--------|------------------|-------------------|-------------------|-----------------|------|
| 2026-06-23 | 8986441 | N (SL above wick ok, but no buffer plan) | N (BE early, no partial) | N (closed on wick) | **No** | Win-side scratch +$2.02; textbook case of all 3 rules violated |
| 2026-06-24 | 8999451 | Y (SL 4113 above H4 FVG + BSL wick) | Y (0.02 partial @+1R 4091.25, SL→BE+) | ~ (runner closed 4081.98 on "200 enough", not TP/structure) | **Yes (R3 discretionary but sound)** | +$61.52 (+108 partial / +200 runner). First full-adherence trade — direct fix of the 06-22/06-23 exit leaks |
