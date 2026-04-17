# File Format Templates

> This file is read by Claude before saving analysis files.
> Date rules (YYYYMMDD, UTC derivation) live in CLAUDE.md.

---

## LTF Analysis File Save

After EVERY LTF analysis (including WAIT), save two files:

### Step 1: Save analysis file
- Path: `Analysis/LTF/YYYYMMDD/YYYYMMDD_HHMM_[long|short|wait].md`
- YYYYMMDD = UTC date (derived using the UTC Date Derivation rule in CLAUDE.md)
- HHMM = UTC hour+minute from `get_session_levels` (e.g., `1919` for 19:19 UTC)
- Direction suffix: `long`, `short`, or `wait` (lowercase)
- Create the `YYYYMMDD/` directory if it doesn't exist
- **Format: markdown with YAML frontmatter + `##` section headings** (NOT the raw `===` block)

**LONG/SHORT file format:**
```markdown
---
time: YYYY-MM-DD HH:MM UTC
session: [ASIAN/LONDON/NEW YORK/OVERLAP]
direction: [LONG/SHORT]
entry: [price]
sl: [price]
tp: [price]
rr: [ratio]
risk_usd: [dollar value]
equity: [equity at time of analysis]
source: MCP (tools used)
setup_grade: "[A+/A/B+/B/C]"
setup_score: [0-100]
score_breakdown: "HTF:[X] Zone:[X] Sweep:[X] PD:[X] Trigger:[X] Session:[X] RR:[X]"
---

# LTF Analysis — YYYY-MM-DD HH:MM UTC ([LONG/SHORT])

## Market Snapshot
## HTF Context
## LTF Structure
## Trade Plan
## Calculations
## Confluences
## Invalidation
```

**WAIT file format:**
```markdown
---
time: YYYY-MM-DD HH:MM UTC
session: [ASIAN/LONDON/NEW YORK/OVERLAP]
direction: WAIT
gate_fail: "[Gate N — reason]"
watch_a_entry: [price]
watch_a_sl: [price]
watch_a_tp: [price]
watch_a_rr: [ratio]
watch_b_entry: [price]
watch_b_sl: [price]
watch_b_tp: [price]
watch_b_rr: [ratio]
source: MCP (tools used)
setup_grade: "[B/C]"           # only if Gate 4 passed but grade < B+
setup_score: [0-100]           # only if Gate 4 passed but grade < B+
score_breakdown: "HTF:[X] Zone:[X] Sweep:[X] PD:[X] Trigger:[X] Session:[X] RR:[X]"  # only if Gate 4 passed
---

# LTF Analysis — YYYY-MM-DD HH:MM UTC (WAIT)

## Gate Fail
## Market Snapshot
## Structure
## Watch Scenarios
### Watch A — [scenario name]
### Watch B — [scenario name]
## Key Levels
## Invalidation
```

### Step 2: Update `Context/ltf-memory.md`
Rewrite the entire file using this exact structure:
```
---
updated: YYYY-MM-DD HH:MM UTC
snapshot: "[[Analysis/LTF/YYYYMMDD/YYYYMMDD_HHMM_direction]]"
---

# LTF Memory — Last 3 Analyses

## Current Market Structure (as of YYYY-MM-DD HH:MM UTC)

**M15 Status:** [trend + last BoS/CHoCH event with price]
**M5 Status:** [trend + key swing levels]
**M1 Status:** [current price action description]

**Key Levels:**
- [price] — [label: e.g., M15 high, OB zone, FVG top]
- [price] — [label]
- [price] — [label]

**Setup:** [LONG/SHORT/WAIT] — [1-sentence summary of decision]

---

## Analysis #1 — YYYY-MM-DD HH:MM UTC ([DIRECTION])
- **Direction:** [LONG/SHORT/WAIT] — [1-sentence reason]
- **Watch A:** [condition] → [direction], entry ~[price], SL [price], TP [price] (R:R [X]:1)
- **Watch B:** [condition] → [direction], entry ~[price], SL [price], TP [price] (R:R [X]:1)
- **Invalidation:** [condition]

---

## Analysis #2 — [previous analysis, copied from old #1]

---

## Analysis #3 — [previous analysis, copied from old #2]
```

**Update logic:**
1. New analysis becomes Analysis #1
2. Old #1 becomes #2, old #2 becomes #3
3. Old #3 is deleted (keep only last 3)
4. Rewrite "Current Market Structure" section with fresh data
5. Update the `updated:` and `snapshot:` frontmatter

---

## HTF Analysis File Save
- Overwrite `Context/htf-context.md` with full bias report
- Save snapshot to `Analysis/HTF/YYYYMMDD.md`
- If file exists for today, overwrite it (only 1 HTF snapshot per day)

---

## Scalp Analysis File Save

After EVERY scalp analysis (including WAIT), save one file. Do NOT update `Context/ltf-memory.md`.

- Path: `Analysis/Scalp/YYYYMMDD/YYYYMMDD_HHMM_[long|short|wait].md`
- Same date/time derivation rules as LTF (UTC date, HHMM from `get_session_levels`)
- Create the `YYYYMMDD/` subdirectory if it doesn't exist
- Multiple scalps per day → each gets its own timestamped file (no overwrite)

**LONG/SHORT file format:**
```markdown
---
time: YYYY-MM-DD HH:MM UTC
session: [ASIAN/LONDON/NEW YORK/OVERLAP]
direction: [LONG/SHORT]
entry: [price]
sl: [price]
tp1: [price]
tp2: [price]           # omit if no TP2
rr_tp1: [ratio]
risk_usd: [dollar value]
equity: [equity at time of analysis]
source: MCP (tools used)
setup_grade: "[A+/A/B+/B/C]"
setup_score: [0-100]
score_breakdown: "HTF:[X] Zone:[X] Sweep:[X] PD:[X] Trigger:[X] Session:[X] RR:[X]"
---

# Scalp Analysis — YYYY-MM-DD HH:MM UTC ([LONG/SHORT])

## Market Snapshot
## HTF Context
## M5/M1 Structure
## Trade Plan
## Calculations
## Confluences
## Invalidation
```

**WAIT file format:**
```markdown
---
time: YYYY-MM-DD HH:MM UTC
session: [ASIAN/LONDON/NEW YORK/OVERLAP]
direction: WAIT
gate_fail: "[Gate N — reason]"
watch_a_entry: [price]
watch_a_sl: [price]
watch_a_tp: [price]
watch_a_rr: [ratio]
watch_b_entry: [price]
watch_b_sl: [price]
watch_b_tp: [price]
watch_b_rr: [ratio]
source: MCP (tools used)
setup_grade: "[B/C]"           # only if Gate 4 passed but grade < B+
setup_score: [0-100]           # only if Gate 4 passed but grade < B+
score_breakdown: "HTF:[X] Zone:[X] Sweep:[X] PD:[X] Trigger:[X] Session:[X] RR:[X]"
---

# Scalp Analysis — YYYY-MM-DD HH:MM UTC (WAIT)

## Gate Fail
## Market Snapshot
## M5/M1 Structure
## Watch Scenarios
### Watch A — [scenario name]
### Watch B — [scenario name]
## Key Levels
## Invalidation
```
