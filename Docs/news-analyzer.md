# News Analyzer — Prompt Template & Workflow

> This file is read by Claude when `analyze news` is invoked.
> Command index lives in CLAUDE.md. Full procedure lives in `Docs/commands-reference.md`.

---

## Prompt Template

Use this template verbatim when analyzing any economic event. Fill in the event data from the user's screenshot or MCP calendar.

```
Provide analysis of this economic event:

[EVENT NAME]
- Forecast: [value or N/A]
- Previous: [value]

Provide a concise analysis in 3 short sections:

1. What It Is (2-3 sentences max)
Explain this economic indicator in simple terms. What does it measure? Why do investors
care—or is it relatively minor?

2. Market Impact (3-4 bullet points)
Based on the actual vs forecast (if available), explain which assets might move and in
what direction:
- Stocks: [likely direction and reasoning]
- Bonds: [likely direction and reasoning]
- Currency: [likely direction and reasoning]
- Other relevant assets: [if applicable]

If data shows reading came in higher/lower than expected, explain the typical market reaction.

3. Historical Context (2-3 sentences)
Describe the trend of this indicator over recent periods. Has it been rising, falling, or
stable? Any notable patterns or inflection points worth mentioning?

Keep the entire response under 150 words. Use clear, jargon-free language. Focus on
actionable insights for investors.
```

---

## Impact Classification

Before applying the template, classify the event impact to determine trade warnings:

| Impact | Examples | Trade Rule |
|--------|---------|------------|
| HIGH | NFP, CPI, FOMC, GDP, Unemployment Claims (major miss/beat) | ⚠️ No new trades 15 min before and 15 min after release |
| MEDIUM | Retail Sales, PPI, Consumer Confidence, Durable Goods | Caution — widen SL or wait for post-news candle |
| LOW | Building Permits, Wholesale Inventories, minor regional data | No special action needed |

Impact level is determined from:
- Forex Factory screenshot: use the color-coded impact indicator (red = HIGH, orange = MEDIUM, yellow = LOW)
- MCP calendar: use the `impact` field from `get_economic_calendar`

---

## XAU/USD Specific Guidance

Apply these gold-specific interpretations when writing Market Impact:

| Event Type | Beat (actual > forecast) | Miss (actual < forecast) |
|-----------|--------------------------|--------------------------|
| USD Jobs (NFP, Claims) | USD strengthens → XAU/USD bearish | USD weakens → XAU/USD bullish |
| USD Inflation (CPI, PCE) | Rate hike expectations → XAU bearish | Disinflationary → XAU bullish |
| GDP / Growth | Risk-on → XAU mixed/bearish | Risk-off → XAU bullish |
| FOMC (hawkish) | USD up → XAU bearish | USD down → XAU bullish |
| Geopolitical / Risk events | — | → XAU strongly bullish (safe haven) |

Always frame Market Impact from XAU/USD's perspective first, then broader assets.

---

## Output Format

After the 3-section analysis, append a one-line trade implication for the current session:

```
---
XAU/USD Implication: [BULLISH / BEARISH / NEUTRAL] — [1 sentence on expected reaction]
Trade Rule: [AVOID 15MIN / CAUTION / NO RESTRICTION]
```

Full output example:

```
===================================
  NEWS ANALYSIS — [EVENT NAME]
  [DATE] [TIME UTC] | Impact: [HIGH/MEDIUM/LOW]
===================================

1. What It Is
[2-3 sentences]

2. Market Impact
- Stocks: [direction + reason]
- Bonds: [direction + reason]
- Currency (USD): [direction + reason]
- Gold (XAU/USD): [direction + reason]

3. Historical Context
[2-3 sentences]

---
XAU/USD Implication: [BULLISH/BEARISH/NEUTRAL] — [1 sentence]
Trade Rule: [AVOID 15MIN / CAUTION / NO RESTRICTION]
===================================
```
