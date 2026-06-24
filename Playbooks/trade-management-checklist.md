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

## Adherence Log (mark each trade Y/N — track if you actually followed it)

| Date | Ticket | R1 SL-beyond-liq | R2 +1R partial+BE | R3 structure exit | Followed all 3? | Note |
|------|--------|------------------|-------------------|-------------------|-----------------|------|
| 2026-06-23 | 8986441 | N (SL above wick ok, but no buffer plan) | N (BE early, no partial) | N (closed on wick) | **No** | Win-side scratch +$2.02; textbook case of all 3 rules violated |
| 2026-06-24 | 8999451 | Y (SL 4113 above H4 FVG + BSL wick) | Y (0.02 partial @+1R 4091.25, SL→BE+) | ~ (runner closed 4081.98 on "200 enough", not TP/structure) | **Yes (R3 discretionary but sound)** | +$61.52 (+108 partial / +200 runner). First full-adherence trade — direct fix of the 06-22/06-23 exit leaks |
