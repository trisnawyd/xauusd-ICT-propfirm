# Speed Optimization Plan — LTF Analysis Pipeline

## Final Status: Tier 0 SHIPPED. Tier 1 ATTEMPTED, NO GAIN, REVERTED.

Current production system runs at **~168s** (down from 6m 33s baseline, **57% reduction**). Further LLM-level optimization is not pursued — see "Workflow Insight" below for the actual next step.

---

## Observed Baseline (Real Run)
- **Total wall time:** 6m 33s
- **Agent 2 (Analyst):** 2m 57s, 47k tokens, 9 tool uses
- **Agent 1 (Collector):** ~3m 36s (remainder)
- **Symptom:** by the time the trade plan is ready, M1 has moved 5+ candles. Trigger stale.

This was not a tuning problem — two distinct bugs against the original design contract.

---

## Confirmed Diagnosis

### Collector (`Docs/agents/collector.md`)
- Prompt correctly stated "in parallel (single message, multiple tool calls)" — contract fine.
- 3m 36s wall time = per-call MCP latency (count:100 heavy scans on OBs/FVGs/sweeps).
- `detect_structure M5` and `detect_fvg M1` were never consumed by Analyst — wasted calls.

### Analyst (`Docs/agents/analyst.md`)
The 9 tool uses were **all file I/O**, not MCP:
- Step 0: 5 mandatory file reads (htf-context, ltf-memory, account, setup-scoring, file-formats)
- 3 duplicate Reads in Gates 1, 5, and Step 5
- 2 file writes at the end

47k tokens were mostly dead reference weight (worked examples, methodology docs).

---

## Tier 0 — SHIPPED (commit `caafab1`)

### A. Stripped Analyst file I/O to zero
Parent orchestrator now pre-loads and inlines 5 XML blocks before spawning Analyst:
- `<htf_context>` ← `Context/htf-context.md`
- `<ltf_memory>` ← `Context/ltf-memory.md`
- `<account_max_risk>` ← single value from `Context/account.md`
- `<scoring_rubric>` ← rubric table only from `Docs/setup-scoring.md`
- `<file_format>` ← frontmatter template only from `Docs/file-formats.md`

All Read instructions removed from `analyst.md`.

**Result: Analyst tool uses 9 → 5, tokens 47k → 36k.**

### B. Trimmed Collector payload
- Removed `detect_structure M5` (unused)
- Removed `detect_fvg M1` (unused)
- Reduced `count:100` → `count:50` on OBs, FVG_M5, liquidity_sweeps
- 12 calls → 10 calls

**Result: Collector wall time 3m 36s → 42s (5× faster).**

### C. Parallel execution verified
The MCP calls were already firing in parallel — the bottleneck was per-call latency from oversized `count:100` payloads. The `count:50` reduction was the actual fix, not coordination.

---

## Tier 1 — ATTEMPTED, REVERTED

### #1 — Collapse to single agent (TESTED, NO GAIN)
Theory: dual-agent handoff was wasting time on bundle pass-through. Reality: it wasn't.

| Metric | Tier 0 (dual) | Tier 1 (single) |
|--------|--------------|----------------|
| Wall time | 168s | **167.9s** |
| Tool uses | 16 | 17 |
| Tokens | ~63k combined | 38.7k |

**Decision: reverted.** Architectural simplification with zero speed benefit isn't worth maintaining a parallel implementation. The dual-agent files (`collector.md`, `analyst.md`) remain the production path.

### #2 — Haiku on Collector (NOT PURSUED)
Conflicts with #1. Moot once #1 was reverted. Possible Tier 2 fallback if cost (not speed) becomes the constraint.

### #3 — M15 structure micro-cache (NOT PURSUED)
Skipped because the agent needs current UTC time to validate cache freshness, which requires an MCP/Bash call before the parallel batch — adding ~1–2s serial, offsetting the cache saving. Net wash.

---

## Why Tier 1 Failed: The Real Bottleneck

The math after Tier 0 and Tier 1 testing:
- 42s Collector (MCP latency)
- ~125s Analyst (sequential gate reasoning over ~36k tokens)
- = 168s total

When collapsed: 167.9s (MCP + reasoning in one context, same total work).

**The binding constraint is sequential gate reasoning, not coordination overhead.** Gates 1–5 cannot be parallelized — each depends on the previous. The only ways to reduce reasoning time:
- Faster model (Haiku — CLAUDE.md explicitly warns it misses rules — bad trade)
- Less reasoning (simpler gates, shorter output — degrades plan quality)
- Smaller context (already done in Tier 0)

None of these are net-positive trades for this system.

---

## Workflow Insight — The Actual Next Step

The LTF analysis output is a **framework**, not a **trigger**. Once Watch A and Watch B levels are set ("SHORT at 4474–4481 with M1 bearish engulf, SL 4485, TP 4444"), you don't need to re-analyze every few minutes — you watch the levels and execute when conditions materialize.

**Re-analyze only when:**
- M15 closes (every 15 min) — structure could shift
- Price approaches a watch zone — confirm trigger conditions
- HTF context flips (rare, daily)

This cuts "analysis runs per session" from ~10 to ~3. The 168s stops mattering because the human waiting time between runs is now minutes-to-hours, not seconds.

---

## Do Not Do (Validated)

| Idea | Why Not |
|------|---------|
| Disk-persist OB/FVG/tick data | Staleness — "unmitigated" flips on every tick; cached zones = trading into traps |
| One-agent-per-timeframe | Gates are sequential; M5 can't know which OBs to evaluate before M15 direction is set |
| Haiku on Analyst | CLAUDE.md explicitly warns Haiku misses rules on this file's complexity |
| Single-agent collapse | Measured: zero speed benefit, adds maintenance cost |
| M15 micro-cache (per-call check) | Time-validation overhead offsets the saved call |

---

## Lessons

1. **Diagnose before optimizing.** Tier 0 worked because we read the agent files and confirmed the bugs. Tier 1 failed because we theorized about coordination overhead without measuring it first.
2. **Measure each tier before deciding the next.** Tier 1 looked good in projection (90–120s) and delivered nothing. Without the measurement step, we'd have built Tier 2 on a false foundation.
3. **The fastest analysis is the one you don't have to re-run.** Workflow changes can outperform infrastructure optimization. Going from 10 runs/session to 3 runs/session at 168s each beats going to 100s each at 10 runs.
