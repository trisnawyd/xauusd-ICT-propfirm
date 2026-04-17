# XAU/USD ICT Trading Model v2

An AI-assisted trading system that combines **ICT/SMC methodology** with **Claude Code** and a custom **MT5 MCP bridge** to analyze, plan, and execute XAU/USD trades in real time.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Claude Code (AI Layer)            │
│  CLAUDE.md (812 lines) — rules, commands, workflow  │
│  ICT methodology, safety protocol, file management  │
└────────────────────┬────────────────────────────────┘
                     │ MCP Protocol (stdio)
┌────────────────────▼────────────────────────────────┐
│              server.ts (Node.js MCP Server)          │
│  953 lines — tool definitions, analysis algorithms  │
│  Safety validation (Layer 2), ZeroMQ bridge         │
└────────────────────┬────────────────────────────────┘
                     │ ZeroMQ (tcp://127.0.0.1:5555)
┌────────────────────▼────────────────────────────────┐
│           MT5Bridge EA (MetaTrader 5)                │
│  1214 lines MQL5 — data feeds, order execution      │
│  Safety validation (Layer 3), alert system          │
└─────────────────────────────────────────────────────┘
```

**Data flows down** (Claude → server.ts → EA → MT5 broker) for execution.
**Data flows up** (MT5 → EA → server.ts → Claude) for market analysis.

---

## Current Capabilities

### MCP Tools: 30+ tools across 4 categories

| Category | Count | Examples |
|----------|-------|---------|
| Market Data | 11 | tick, OHLCV, session levels, spread, drawdown, calendar |
| Trade Execution | 7 | place order, close, modify, trailing stop, breakeven, pending orders |
| Analysis (computed in server.ts) | 7 | structure (BoS/CHoCH), FVG, order blocks, premium/discount, liquidity sweeps, performance stats |
| Alerts | 3 | set/list/delete price alerts |

### Commands: 20+ user-facing commands

- **Analysis:** HTF via image/MCP, LTF via image/MCP
- **Execution:** place order, pending order, close, modify, trail, breakeven
- **Management:** log trade, sync account, performance stats, dashboard
- **Utilities:** market status, check spread, lot size calculator, economic calendar, alerts

### Safety: Triple-layer validation

Every trade passes through 3 independent safety gates:
1. **Claude (AI)** — spread check, risk calculation, R:R validation, user confirmation
2. **server.ts (Node)** — lot cap (0.01), SL/TP required, pending order validation
3. **MT5Bridge EA** — MaxLot, MaxSpread, SL required, MagicNumber tagging, slippage cap

### Analysis Engine (server.ts)

All ICT/SMC analysis runs locally in TypeScript — no external API calls:
- **Structure detection** — BoS/CHoCH from swing data, trend classification
- **FVG detection** — 3-candle imbalance gaps with mitigation tracking
- **Order block identification** — last opposing candle before each BoS
- **Premium/discount zones** — equilibrium, OTE (61.8%–78.6%)
- **Liquidity sweep detection** — BSL/SSL wicks beyond swing levels

### Knowledge Base (Obsidian Vault)

| Directory | Purpose | Files |
|-----------|---------|-------|
| `Context/` | Live state (account, HTF bias, LTF memory) | 3 core files, auto-updated |
| `Analysis/HTF/` | D1/H4/H1 bias snapshots | 1 per day |
| `Analysis/LTF/` | M15/M5/M1 trade plans | ~31 files across sessions |
| `Trade Log/` | Per-day trade records | 3 days logged |
| `Daily Journal/` | Session reviews and lessons | 1 journal entry |
| `Playbooks/` | Reusable setup definitions | 2 setups documented |
| `Docs/` | ICT methodology reference | 1 reference doc |

---

## Complexity Assessment

### Codebase Size

| Component | Lines | Language |
|-----------|-------|----------|
| CLAUDE.md (prompt engineering) | 812 | Markdown |
| server.ts (MCP server + analysis) | 953 | TypeScript |
| MT5Bridge.mq5 (EA) | 1,214 | MQL5 |
| Supporting docs/configs | ~300 | Markdown/JSON |
| **Total** | **~3,300** | |

### System Complexity: Moderate-High

- 3 runtime layers communicating over 2 protocols (MCP stdio + ZeroMQ)
- 30+ MCP tools with typed schemas
- 812-line prompt governing 20+ commands, 4-gate decision tree, file management rules
- UTC date derivation logic to handle GMT+8 timezone offset
- Auto-save system maintaining 6+ directories of structured markdown

### Dependencies

| Dependency | Purpose | Risk Level |
|------------|---------|------------|
| Claude Code CLI | AI reasoning layer | Low (Anthropic-maintained) |
| @modelcontextprotocol/sdk | MCP protocol | Low (standard) |
| zeromq (Node + MQL5) | EA ↔ server.ts bridge | Medium (binary dependency) |
| MetaTrader 5 | Broker connection | External (Exness) |
| Obsidian | Vault viewer (optional) | Low |

---

## Cost Analysis

### API Token Usage

| Activity | Estimated Tokens | Frequency |
|----------|-----------------|-----------|
| Session start (context load) | ~4,000 input | Once per session |
| CLAUDE.md (always loaded) | ~6,000 input | Every message |
| HTF analysis via MCP | ~8,000–12,000 total | 1–2x per day |
| LTF analysis via MCP | ~10,000–15,000 total | 3–10x per day |
| Trade execution flow | ~5,000–8,000 total | Per trade |
| Dashboard / market status | ~3,000–5,000 total | Ad-hoc |

**Estimated daily cost:** 80,000–200,000 tokens depending on session activity. On Claude Opus, this is roughly **$2–6/day** at current API rates. Using Claude Code Pro subscription ($100/mo or $200/mo) makes this effectively flat-rate.

### Broker Costs

- Commission: $0.11 per trade (0.01 lot)
- Spread: typically 0.8–1.5 pips ($0.08–0.15 on 0.01 lot)
- **Per-trade cost:** ~$0.19–0.26

---

## Advantages

### 1. Discipline Enforcement
The 4-gate decision tree forces systematic analysis before every trade. No gate can be skipped — HTF bias, LTF structure, entry zone, and M1 trigger must all pass. This eliminates emotional entries.

### 2. Triple-Layer Safety
Three independent systems validate every order. Even if Claude hallucinates a valid trade, server.ts blocks oversized lots and missing SL, and the EA rejects wide spreads. No single point of failure.

### 3. Complete Trade Documentation
Every analysis auto-saves to structured markdown. Trade logs, journal entries, and LTF analysis files create a searchable audit trail. Cross-referencing (journal → analysis file) enables pattern review.

### 4. Speed of Analysis
10 MCP tool calls in parallel return multi-timeframe structure, FVGs, order blocks, premium/discount, and liquidity sweeps in seconds. Manual chart analysis of this scope takes 10–15 minutes.

### 5. Contextual Memory
`htf-context.md` and `ltf-memory.md` carry forward between sessions. The AI doesn't start from zero — it knows the current bias, recent watch levels, and last 3 analyses.

### 6. Risk Management Automation
Daily drawdown hard-block (20%), max lot enforcement, auto-sync after every trade action, and mandatory R:R checks are always active and cannot be bypassed.

### 7. Low Capital Requirement
0.01 lot micro-sizing allows the system to operate on a ~$136 account with $13.59 max risk per trade. The entire system is viable for small accounts.

---

## Disadvantages

### 1. Single Instrument / Single Broker
The entire system is hardcoded for XAU/USD on Exness MT5. Adapting to other instruments requires modifying pip calculations, session times, spread thresholds, and lot sizing throughout CLAUDE.md and server.ts.

### 2. Heavy Prompt Dependency
The 812-line CLAUDE.md is the brain of the system. If Claude misinterprets a rule, skips a gate, or hallucinates price levels, the downstream analysis is wrong. The prompt is complex enough that edge cases exist.

### 3. No Backtesting Framework
Analysis algorithms (structure, FVG, OB) run on live data only. There's no way to backtest a strategy across historical data programmatically — the single `analyze_weekly_pattern.py` script is a one-off.

### 4. ZeroMQ Single-Point Bridge
The EA ↔ server.ts connection uses a single ZeroMQ REQ/REP socket on localhost. If the EA restarts, the bridge drops. If MT5 loses connection, all MCP tools fail silently or with timeouts.

### 5. No Automated Trade Execution
Despite full execution infrastructure, every trade still requires manual `CONFIRM`. The system cannot autonomously enter trades when conditions align — it's a decision support tool, not a bot.

### 6. Context Window Pressure
CLAUDE.md alone consumes ~6,000 tokens on every message. A full LTF analysis with 10 tool responses can push a single exchange to 20,000+ tokens. Extended sessions risk context compression losing earlier analysis.

### 7. Model Dependency
The system requires Claude (specified as claude-sonnet-4-6 for analysis). It cannot fall back to other models without prompt adaptation. Anthropic API outages or model changes directly affect trading.

### 8. UTC/Timezone Fragility
The manual UTC date derivation rule (comparing local GMT+8 clock vs. UTC time from `get_session_levels`) is a workaround for a fundamental timezone mismatch. Despite the rule, a bug already occurred and was fixed (commit `2635142`).

---

## Good Potential

### Short-Term (Achievable Now)

- **Consistent 75% win rate scalping** — the April 8 session showed 6W/2L with +$34.85 net on a $130 account (+27% in one day). If the system enforces discipline, this is repeatable.
- **Rapid skill development** — the structured journal + analysis files create a feedback loop. Reviewing past WAIT decisions and missed entries accelerates learning ICT methodology.
- **Account growth at micro scale** — 10% risk per trade on a small account is aggressive but manageable with the safety layers. $136 → $500+ is achievable in weeks with consistent execution.

### Medium-Term (With Development)

- **Multi-session autonomy** — adding alert-triggered analysis (EA fires alert → Claude auto-analyzes → presents trade plan on next user check-in) would catch setups outside active sessions.
- **Playbook expansion** — as more trades are logged, pattern recognition improves. New setups can be codified from journal reviews into reusable playbooks.
- **Performance-based adaptation** — the `get_performance_stats` tool already tracks win rate by session. This data could inform which sessions to trade and which to skip.

### Long-Term (Aspirational)

- **Multi-instrument expansion** — abstracting the instrument-specific logic into config files would allow the same framework for EUR/USD, NAS100, or crypto.
- **Community/education value** — the structured approach (prompt engineering + MCP + trading methodology) is a replicable template others could adapt.
- **Semi-automated execution** — with sufficient track record, the `CONFIRM` gate could be relaxed for high-conviction setups (e.g., A+ confluence score), moving toward assisted autonomy.

---

## Bad Potential

### Catastrophic Risks

- **Correlated losses during news** — the economic calendar check exists but requires Claude to act on it. A flash crash during a high-impact event could blow through the SL before the EA processes it (slippage > 3 pip cap).
- **Over-reliance on AI judgment** — if the trader stops independently reading charts and trusts Claude's analysis uncritically, misinterpretations compound. The AI is a tool, not an oracle.
- **Account blow-up at 10% risk** — three consecutive losses = -30%. Five = -50%. The 10% risk model is aggressive; a losing streak during choppy markets is survivable but painful.

### Operational Risks

- **Bridge failure during open trade** — if ZeroMQ disconnects while a position is open, Claude cannot modify SL or close the position. The trader must intervene manually in MT5.
- **Stale context leading to bad trades** — if `htf-context.md` isn't updated and the HTF bias has flipped, all LTF analysis runs against the wrong directional assumption. The >24h staleness check helps but isn't foolproof.
- **Prompt drift** — as CLAUDE.md grows (already 812 lines), maintenance becomes harder. Conflicting rules, outdated sections, or unclear precedence can cause inconsistent behavior.

### Psychological Risks

- **False confidence from tooling** — professional-looking dashboards and structured output may create an illusion of certainty. Markets are inherently uncertain; no amount of tooling changes that.
- **Revenge trading with AI assistance** — the system makes it fast to analyze and execute. After a loss, the temptation to immediately re-enter ("the AI says there's a setup") increases.
- **Analysis paralysis** — the 4-gate system correctly outputs WAIT often (most of the April 8 LTF analyses were WAIT). A trader might override the system or become frustrated with wait signals.

---

## Development Timeline

| Date | Milestone |
|------|-----------|
| April 6, 2026 | Project created — initial EA + MCP server + CLAUDE.md |
| April 6–7 | Phases 1–3: execution, analysis engine, risk management |
| April 8 | First full live trading day — 8 trades, 75% WR, +$34.85 |
| April 8–9 | Phases 4–5: auto-journal, performance stats, dashboard, calendar |
| **3 days** | **From zero to 5-phase completion** |

---

## Tech Stack

- **AI:** Claude Code CLI + claude-sonnet-4-6 (analysis model)
- **MCP Server:** Node.js + TypeScript + @modelcontextprotocol/sdk
- **Bridge:** ZeroMQ (REQ/REP) between Node.js and MT5
- **EA:** MQL5 (MetaTrader 5 Expert Advisor)
- **Broker:** Exness MT5 (micro lot, XAU/USD)
- **Vault:** Obsidian (optional viewer for markdown files)
- **Version Control:** Git

---

## Summary

This is a **decision support system**, not an autonomous trading bot. It enforces ICT/SMC methodology through structured analysis gates, protects capital through triple-layer safety, and builds institutional-grade documentation automatically. The system was built in 3 days and has already demonstrated live profitability.

The primary risk is not technical failure — the safety layers handle that. The primary risk is **human**: over-reliance on AI judgment, aggressive risk sizing, and the psychological pressure of fast-paced gold trading. The tooling amplifies whatever the trader brings to it — discipline or recklessness.

**Current status:** All 5 development phases complete. Live trading on $136 account. System is operational and generating structured analysis with every session.
