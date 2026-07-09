---
# ============================================================
# EA/CONFIG MACHINE-READABLE BLOCK — Top One Trader
# 2 Step PRO v2 · $5,000 · MetaTrader 5
# Ruleset for accounts purchased AFTER May 17-18 2026 (V2)
# ============================================================
prop_firm: "Top One Trader"
account_type: "2 Step PRO"
ruleset_version: "v2 (post-May-17-2026)"
account_size_usd: 5000
platform: "MetaTrader 5"
purchase_gate: "V2 applies to 2 Step PRO accounts purchased after May 17-18 2026; earlier purchases = Old Version (8% max loss + 50% consistency)"
retrieved_date: "2026-07-09"
updated: "2026-07-09 07:40 UTC"

# --- Daily loss (EA-consumed) ---
daily_loss_pct: 4.0
daily_loss_usd: 200.00
daily_loss_reference: "initial_balance"      # fixed $ anchored to initial balance; resets daily. NOT trailing prev-day-high (that mechanic is 1-Step Flash, a different product).
daily_loss_breach: "hard"
daily_reset_time: "17:00 EST"                 # INFERRED from the 1-Step Flash article; NOT confirmed on a 2 Step PRO page.

# --- Max overall loss (EA-consumed) ---
max_overall_loss_pct: 9.0                     # V2 value. Old Version = 8%. CONFLICT — see field provenance.
max_overall_loss_usd: 450.00
max_overall_loss_type: "static"              # fixed from initial balance; does NOT trail or lock up.
max_overall_loss_breach: "hard"

# --- Profit targets ---
profit_target_phase1_pct: 8.0
profit_target_phase1_usd: 400.00
profit_target_phase2_pct: 5.0
profit_target_phase2_usd: 250.00

# --- Minimum days ---
min_profitable_days: 3
min_profitable_day_threshold_pct: 0.5
min_profitable_day_threshold_usd: 25.00

# --- Consistency ---
consistency_rule: "none"                      # V2 has NO consistency rule. 50% best-day cap applies ONLY to pre-May-17-2026 Old Version.

# --- News (EA-consumed for the funded window) ---
news_rule_challenge: "unrestricted"
news_rule_funded: "no open or close within 5 min before / 5 min after a high-impact news event"
news_window_min: 5

# --- Inactivity ---
inactivity_days: 30
inactivity_breach: "hard"

# --- Stop loss ---
stop_loss_required: true
stop_loss_breach: "soft"                      # required each trade unless the no-SL add-on is purchased.

# --- Equity shield (auto-close thresholds) ---
equity_shield_single_symbol_pct: 2.0
equity_shield_all_symbols_pct: 2.5

# --- Lot / position cap (funded phase) ---
max_lot_funded: "20% of account size, capped at 20 lots total"
max_lot_funded_cap_lots: 20

# --- Soft breach limit ---
soft_breach_limit: "NEEDS_REVIEW"            # not documented on any fetched page.
---

# Top One Trader — 2 Step PRO v2 · $5K · MT5

> **Your account:** 2 Step PRO, $5,000, MetaTrader 5, purchased 2026 (post-May-17) → **V2 ruleset**.
> V2 differs from the Old Version on two breach-critical points: **max overall loss 9% (was 8%)** and **no consistency rule (was 50% best-day cap)**, plus a new **3-profitable-day** minimum.

## Rules reference

### Breach limits (the ones that fail the account)
- **Daily loss — 4% of initial balance = $200 on $5K. HARD breach.** Anchored to the initial balance (fixed $200 envelope), resets each trading day. This is *not* the 1-Step Flash "previous-day-high" trailing daily rule — 2 Step PRO's daily limit is a fixed amount off initial balance.
- **Max overall loss — 9% of initial balance = $450 on $5K. STATIC, HARD breach.** Measured from the starting balance and fixed for the life of the account; it does **not** trail up as the account grows and does **not** lock. Equity below $4,550 = breach. *(Old Version was 8% / $400 — see reconciliation.)*

### Targets & days
- **Phase 1 profit target:** 8% = **$400** (equity $5,400).
- **Phase 2 profit target:** 5% = **$250** (equity $5,250).
- **Minimum profitable days:** **3**, each day booking ≥ 0.5% (= **$25**) profit. (New in V2 — the Old Version had none.)
- **Time limit:** none (unlimited trading period).

### Consistency
- **No consistency rule on V2.** The 50%-of-total-profit single-day cap applies **only to 2 Step PRO accounts purchased before May 17 2026** (Old Version). Your post-May-17 account is exempt.

### Operational rules
- **News (challenge):** unrestricted.
- **News (funded):** no opening or closing a trade within **5 minutes before to 5 minutes after** a high-impact news event.
- **Inactivity:** must place at least one trade every **30 days** — HARD breach.
- **Stop loss:** required on every trade unless the no-SL add-on is purchased — **soft** breach.
- **Equity shield (auto-protect):** trades auto-close if open loss exceeds **2% on a single symbol** or **2.5% across all symbols**.
- **Max lot (funded):** 20% of account size, capped at **20 lots** total. (For a $5K account the 20-lot cap effectively never binds; the "20% of account size" interpretation for small accounts is unconfirmed — treat as NEEDS_REVIEW.)
- **Soft breach limit:** how many soft breaches are tolerated before termination is **not documented** on the fetched pages — NEEDS_REVIEW.

### How this maps to the XAUUSD ICT model
- Model max risk is 1% ($50) per trade — well inside the $200 daily and $450 overall envelopes.
- Daily hard floor: **$200 loss** = ~4 max-risk trades. The model's existing 20% daily-drawdown block is far looser than the firm's 4% — **the firm's 4% ($200) is the binding daily limit.** Consider tightening the model's daily block to $200.
- Overall hard floor: equity **$4,550**. Static, so it never moves in your favor.
- No consistency rule → no need to spread profit across days on this account.

## Field provenance

| Field | Value | Confidence | Source |
|-------|-------|-----------|--------|
| daily_loss_pct | 4% ($200) | VERIFIED | [comparison](https://help.toponetrader.com/en/articles/10912482-comparison-of-account-types) + [old rules](https://help.toponetrader.com/en/articles/8568650-what-are-the-rules-for-the-2-step-pro-challenge-account) (agree) |
| daily_loss_reference | initial_balance | VERIFIED | PRO pages state "4% of initial balance"; Flash prev-day-high mechanic excluded |
| daily_reset_time | 17:00 EST | INFERRED | [1-Step Flash DD](https://help.toponetrader.com/en/articles/15146575-1-step-flash-daily-drawdown-rule) — not confirmed on a PRO page |
| max_overall_loss_pct | **9%** ($450) | VERIFIED* | [comparison](https://help.toponetrader.com/en/articles/10912482-comparison-of-account-types) (V2, verbatim, 2 fetches) — **conflicts with Old Version 8%** |
| max_overall_loss_type | static | VERIFIED | [comparison](https://help.toponetrader.com/en/articles/10912482-comparison-of-account-types) + [drawdown](https://help.toponetrader.com/en/articles/9136900-what-is-the-max-trailing-and-static-drawdown) |
| profit_target_phase1 | 8% ($400) | VERIFIED | comparison + old rules (agree) |
| profit_target_phase2 | 5% ($250) | VERIFIED | comparison + old rules (agree) |
| min_profitable_days | 3 @ 0.5% ($25) | VERIFIED | [comparison](https://help.toponetrader.com/en/articles/10912482-comparison-of-account-types) (V2) |
| consistency_rule | none (V2) | VERIFIED | [comparison](https://help.toponetrader.com/en/articles/10912482-comparison-of-account-types) + [consistency date gate](https://help.toponetrader.com/en/articles/10860801) |
| news_rule_challenge | unrestricted | VERIFIED | [old rules](https://help.toponetrader.com/en/articles/8568650-what-are-the-rules-for-the-2-step-pro-challenge-account) |
| news_rule_funded | ±5 min high-impact | VERIFIED | [old rules](https://help.toponetrader.com/en/articles/8568650-what-are-the-rules-for-the-2-step-pro-challenge-account) |
| inactivity_days | 30 (hard) | VERIFIED | old rules + new-version search summary (agree) |
| stop_loss_rule | required, soft | VERIFIED | old rules + new-version search summary (agree) |
| equity_shield | 2% / 2.5% | VERIFIED | old rules + new-version search summary (agree) |
| max_lot_funded | 20% / 20 lots | INFERRED | old rules; $5K interpretation unconfirmed |
| soft_breach_limit | — | NEEDS_REVIEW | not found on any fetched page |

\* **VERIFIED\*** = stated verbatim on the V2 comparison table and corroborated by two independent fetches, **but** the explicitly-labeled "Old Version" pages say 8%. Selected 9% per the post-May-17-2026 purchase gate (V2). Eyeball this one against your account dashboard before trusting the EA to it.

## Version reconciliation (Old Version vs V2)

| Field | Old Version (pre-May-17-2026) | **V2 (your account)** | Source |
|-------|-------------------------------|----------------------|--------|
| Max overall loss | 8% ($400) | **9% ($450)** | comparison table = V2 |
| Consistency rule | 50% best-day cap | **none** | consistency article date gate |
| Min profitable days | none | **3 @ 0.5%** | comparison table = V2 |
| Daily loss | 4% ($200) | 4% ($200) | unchanged |
| Phase 1 / Phase 2 | 8% / 5% | 8% / 5% | unchanged |
| Drawdown type | static | static | unchanged |

## Change log

### 2026-07-09 07:40 UTC — initial creation
- First write of this note. No prior version existed, so no EA-consumed number was overwritten.
- Selected **V2** ruleset to match a post-May-17-2026 purchase.
- Key V2 deltas from Old Version recorded above: max loss **9%** (not 8%), **no** consistency rule, **3** profitable-day minimum.
- Open items to confirm against the live account dashboard: (1) `max_overall_loss_pct` 9% vs 8%; (2) `daily_reset_time`; (3) `soft_breach_limit`; (4) funded `max_lot` meaning on a $5K account.
