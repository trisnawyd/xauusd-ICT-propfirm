# Speed Optimization Plan — LTF Analysis Pipeline

## Observed Baseline (Real Run)
- **Total wall time:** 6m 33s
- **Agent 2 (Analyst):** 2m 57s, 47k tokens, 9 tool uses
- **Agent 1 (Collector):** ~3m 36s (remainder)
- **Symptom:** by the time the trade plan is ready, M1 has moved 5+ candles. Trigger stale.

This is not a tuning problem — it's two distinct bugs against the original design contract.

---

## Confirmed Diagnosis

### Collector (`Docs/agents/collector.md`)
- Prompt **correctly** states "in parallel (single message, multiple tool calls)" — contract is fine.
- 3m 36s wall time suggests the slowness is per-call, not coordination:
  - `detect_order_blocks M5 count:100` — heavy scan
  - `detect_fvg M5 count:100` — heavy scan
  - `detect_fvg M1 count:100` — heavy scan
  - `detect_liquidity_sweeps M15 count:100` — heavy scan
- Four scans at count:100 each, plus likely MCP/server.ts serial processing, explains the bulk of the time.
- `detect_structure M5` (#6) and `detect_fvg M1` (#9) are not consumed by the Analyst — wasted calls.

### Analyst (`Docs/agents/analyst.md`)
The 9 tool uses are **all file I/O**, not MCP. Breakdown:
- Step 0 (line 9): 5 mandatory file reads (htf-context, ltf-memory, account, setup-scoring, file-formats)
- Gate 1 (line 29): `"Read htf-context.md"` — duplicate
- Gate 5 (line 62): `"Read Docs/setup-scoring.md"` — duplicate
- Step 5 (line 93): `"Read Docs/file-formats.md"` — duplicate
- Step 5: 2 file writes (trade plan + ltf-memory update)

Approximate total: 5 + 3 duplicates + 2 writes ≈ 10. Screenshot shows 9. ✓

47k tokens is mostly the contents of those 5 reference files loaded into context, plus the bundle. Most of it is dead reference weight, not active reasoning fuel.

---

## Tier 0 — Bugs to Fix First

### A. Strip Analyst's file I/O to zero
Parent orchestrator pre-loads and inlines everything Agent 2 needs:
- `htf-context.md` → `<htf_context>...</htf_context>` block in prompt
- `ltf-memory.md` → `<ltf_memory>...</ltf_memory>` block in prompt
- `account.md` max risk → single value in prompt
- Scoring rubric **table only** from `setup-scoring.md` (drop worked examples) → inlined
- File format frontmatter template only (drop docs around it) → inlined

Delete:
- `Step 0 — Read Context Files` (entire section)
- `Read htf-context.md` in Gate 1
- `Read Docs/setup-scoring.md for full rubric before scoring` in Gate 5
- `Read Docs/file-formats.md for exact frontmatter format` in Step 5

**Analyst tool uses: 9 → 2 (only the two writes at end).**
**Removes ~30k tokens of file content + 5–7 serial Read round-trips.**

### B. Trim Collector's payload
Edit `Docs/agents/collector.md`:
- **Remove call #6** `detect_structure M5` — unused by any gate
- **Remove call #9** `detect_fvg M1` — Gate 4 reads OHLCV_M1 directly; FVG_M1 not referenced
- **Reduce `count:100` → `count:50`** on OBs, FVG_M5, liquidity_sweeps. 50 most recent is plenty for unmitigated zones — older ones are usually already swept.

### C. Verify parallel execution
Check Agent 1's actual tool-use timeline in the logs:
- Are all calls fired in one message?
- Are responses arriving concurrently or serially?
- If MCP server (`server.ts`) processes calls serially → fix server concurrency
- If model is firing them in batches → switching Collector to Haiku may help (Haiku tends to follow parallel directives more literally)

---

## Tier 1 — After Tier 0 Lands

### 1. Collapse to single agent for on-demand LTF
Once Analyst has zero file I/O, the dual-agent handoff is pure overhead. A single Sonnet agent with:
- All context inlined (from Tier 0 A)
- Parallel MCP calls fired in one message
- One warm context, one reasoning pass

…should outperform the dual-agent flow for on-demand analysis.

Keep dual-agent only for scheduled / background runs where bundle handoff isn't on the critical path.

### 2. Downgrade Collector to Haiku
Only if you keep dual-agent. Agent 1 does no reasoning — Haiku is 3–5× faster and cheaper for tool plumbing.

### 3. M15 structure micro-cache
Only safe cache in the system. M15 structure cannot change between candle closes.
- Save last `detect_structure M15` result + close-time of last M15 candle
- On next analysis: if no new M15 candle has closed → skip the MCP call
- Saves 1 call, zero staleness risk

---

## Tier 2 — Polish (After Tier 0 + 1)

4. **Output verbosity trim.** Tighten trade plan template — drop redundant "calc:" lines, shorter confluences format. Output tokens dominate LLM latency.
5. **Pre-warm at session opens.** Only meaningful once on-demand path is fast. Background-spawn Collector at London −30s, NY −30s, NY-PM −30s.
6. **Gate 5 short-circuit.** If Gate 1 or 3 fails → output WAIT without scoring. Saves grade-computation tokens on no-trade outcomes.

---

## Do Not Do

| Idea | Why Not |
|------|---------|
| Disk-persist OB/FVG/tick data | Staleness — "unmitigated" flips on every tick; cached zones = trading into traps |
| One-agent-per-timeframe | Gates are sequential; M5 can't know which OBs to evaluate before M15 direction is set |
| Haiku on Analyst | CLAUDE.md explicitly warns Haiku misses rules on this file's complexity |
| 5-min cache on M5 data | Same staleness problem as disk persistence |

---

## Realistic Latency Targets

| Stage | Now | After Tier 0 | After Tier 1 |
|-------|-----|-------------|-------------|
| Collector | 3m 36s | ~30–60s (drop unused calls + count:50) | ~15–25s (single agent, parallel) |
| Analyst | 2m 57s | ~45–75s (no file I/O, smaller context) | merged into single pass |
| **Total** | **6m 33s** | **~75–120s** | **~45–75s** |

---

## Implementation Order
1. **Tier 0-A** (inline Analyst context) — biggest certain win, no risk
2. **Tier 0-B** (trim Collector calls) — easy, no risk
3. **Tier 0-C** (verify parallelism) — diagnostic, no code yet
4. **Measure new baseline** before doing Tier 1
5. **Tier 1** decisions based on measured data

## Honest Summary
The 6m 33s isn't a "needs caching" problem. It's two design-contract violations:
- Analyst's mandatory file Reads should never have been mandatory — that data belongs in the prompt
- Collector pulls data nothing consumes (M5 structure, FVG_M1) at maximum count

Fix those first. Tier 1+2 only matter if Tier 0 isn't enough.
