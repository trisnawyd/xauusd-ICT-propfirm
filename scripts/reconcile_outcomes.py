#!/usr/bin/env python3
"""
reconcile_outcomes.py — close the feedback loop for the XAU/USD ICT model.

Joins closed MT5 trades (parsed from `Trade Log/YYYYMMDD.md`) back to the
analysis files that planned them (`Analysis/LTF/**/*.md` frontmatter), writes
the realised outcome into each matched analysis's frontmatter, and emits both a
reconciliation report and a portfolio-stats summary.

Two distinct outputs, deliberately separated:
  1. PORTFOLIO STATS  — computed from the trade log alone (ground truth of P&L).
  2. PLAN ADHERENCE   — which trades came from a graded model signal vs were
                        discretionary (no matching plan). This is the headline:
                        if trades and plans are disjoint, the model isn't what's
                        being traded.

Stdlib only. Default is a dry run; pass --write-back to mutate analysis files.

Usage:
  python3 scripts/reconcile_outcomes.py                 # dry-run report
  python3 scripts/reconcile_outcomes.py --write-back    # also patch frontmatter
  python3 scripts/reconcile_outcomes.py --entry-tol 3.0 # widen entry match window
"""

from __future__ import annotations

import argparse
import datetime as dt
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
TRADE_LOG_DIR = REPO / "Trade Log"
LTF_DIR = REPO / "Analysis" / "LTF"
STATS_DIR = REPO / "Stats"


# --------------------------------------------------------------------------- #
# number / direction normalisation
# --------------------------------------------------------------------------- #

def num(s: str | None) -> float | None:
    """Parse a price/money/pip cell. Handles $, commas, +, unicode minus, *."""
    if s is None:
        return None
    s = s.strip().replace("−", "-")  # U+2212 MINUS SIGN -> ASCII hyphen
    s = s.replace("$", "").replace(",", "").replace("+", "").replace("*", "").strip()
    if s in ("", "-", "—", "N/A", "n/a"):
        return None
    m = re.search(r"-?\d+(?:\.\d+)?", s)
    return float(m.group()) if m else None


def label_dir(s: str) -> str | None:
    s = s.strip().lower().replace("*", "")
    if s.startswith("buy"):
        return "LONG"
    if s.startswith("sell"):
        return "SHORT"
    return None


def effective_dir(entry: float, exit_: float, is_win: bool) -> str | None:
    """Direction derived from price move + P&L sign, neutralising the known
    get_trade_history buy/sell label-inversion bug."""
    move = exit_ - entry
    if abs(move) < 1e-9:
        return None  # scratch — can't infer
    if (move > 0 and is_win) or (move < 0 and not is_win):
        return "LONG"
    return "SHORT"


# --------------------------------------------------------------------------- #
# data models
# --------------------------------------------------------------------------- #

@dataclass
class Trade:
    date: str          # YYYYMMDD from filename
    ticket: str
    label: str         # raw Dir/Type cell
    entry: float
    exit: float
    pnl: float
    result: str        # WIN / LOSS / ...
    exit_type: str
    suspect_label: bool
    file: str

    @property
    def is_win(self) -> bool:
        return self.result.upper().startswith("WIN")

    @property
    def eff_dir(self) -> str | None:
        return effective_dir(self.entry, self.exit, self.is_win)

    @property
    def label_mismatch(self) -> bool:
        ld = label_dir(self.label)
        ed = self.eff_dir
        return ld is not None and ed is not None and ld != ed


@dataclass
class Analysis:
    file: Path
    date: str
    fm: dict
    matched_ticket: str | None = None

    @property
    def direction(self) -> str:
        return (self.fm.get("direction") or "").upper()

    def f(self, key) -> float | None:
        return num(self.fm.get(key))


# --------------------------------------------------------------------------- #
# parsing
# --------------------------------------------------------------------------- #

def parse_trade_logs() -> list[Trade]:
    trades: list[Trade] = []
    for fp in sorted(TRADE_LOG_DIR.glob("2*.md")):
        date = fp.stem
        lines = fp.read_text(encoding="utf-8").splitlines()
        header_cols: list[str] | None = None
        for line in lines:
            if not line.lstrip().startswith("|"):
                header_cols = None
                continue
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            low = [c.lower() for c in cells]
            if "ticket" in low:                      # header row
                header_cols = low
                continue
            if header_cols is None:
                continue
            if set("".join(cells)) <= set("-: "):    # separator row |---|---|
                continue
            row = dict(zip(header_cols, cells))
            if not (row.get("#", "").isdigit()):
                continue
            label = row.get("dir") or row.get("type") or ""
            entry = num(row.get("entry") or row.get("open"))
            exit_ = num(row.get("exit") or row.get("close"))
            pnl = num(row.get("net p&l") or row.get("net p&amp;l") or row.get("pnl"))
            if entry is None or exit_ is None or pnl is None:
                continue
            trades.append(Trade(
                date=date,
                ticket=row.get("ticket", "?"),
                label=label,
                entry=entry, exit=exit_, pnl=pnl,
                result=row.get("result", ""),
                exit_type=row.get("exit type", ""),
                suspect_label="*" in label,
                file=fp.name,
            ))
    return trades


def parse_frontmatter(text: str) -> dict:
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    fm: dict = {}
    for line in text[3:end].splitlines():
        line = line.split("#", 1)[0].rstrip() if not line.strip().startswith("#") else ""
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        k, v = k.strip(), v.strip().strip('"').strip("'")
        if k:
            fm[k] = v
    return fm


def parse_analyses() -> list[Analysis]:
    out: list[Analysis] = []
    for fp in sorted(LTF_DIR.glob("*/*.md")):
        text = fp.read_text(encoding="utf-8")
        fm = parse_frontmatter(text)
        if not fm:
            continue
        out.append(Analysis(file=fp, date=fp.parent.name, fm=fm))
    return out


# --------------------------------------------------------------------------- #
# matching + outcome classification
# --------------------------------------------------------------------------- #

def classify_outcome(a: Analysis, t: Trade) -> tuple[str, float | None]:
    entry, sl, tp = a.f("entry"), a.f("sl"), a.f("tp")
    outcome = "manual"
    if tp is not None and abs(t.exit - tp) <= 0.5:
        outcome = "tp"
    elif sl is not None and abs(t.exit - sl) <= 0.5:
        outcome = "sl"
    actual_r = None
    if entry is not None and sl is not None and abs(entry - sl) > 1e-9:
        if a.direction == "LONG":
            actual_r = (t.exit - entry) / (entry - sl)
        else:  # SHORT
            actual_r = (entry - t.exit) / (sl - entry)
        actual_r = round(actual_r, 2)
    return outcome, actual_r


def match(trades: list[Trade], analyses: list[Analysis], tol: float):
    actionable = [a for a in analyses if a.direction in ("LONG", "SHORT")]
    matched: list[tuple[Trade, Analysis, str, float | None]] = []
    unmatched_trades: list[Trade] = []
    for t in trades:
        ed = t.eff_dir
        cands = [
            a for a in actionable
            if a.date == t.date
            and a.direction == ed
            and a.f("entry") is not None
            and abs(a.f("entry") - t.entry) <= tol
            and a.matched_ticket is None
        ]
        if not cands:
            unmatched_trades.append(t)
            continue
        a = min(cands, key=lambda a: abs(a.f("entry") - t.entry))
        a.matched_ticket = t.ticket
        outcome, actual_r = classify_outcome(a, t)
        matched.append((t, a, outcome, actual_r))
    unmatched_analyses = [a for a in actionable if a.matched_ticket is None]
    return matched, unmatched_trades, unmatched_analyses


# --------------------------------------------------------------------------- #
# write-back
# --------------------------------------------------------------------------- #

OUTCOME_KEYS = ["outcome", "trade_ticket", "exit_price", "actual_r", "pnl_usd", "closed_at"]


def write_back(a: Analysis, t: Trade, outcome: str, actual_r: float | None):
    vals = {
        "outcome": outcome,
        "trade_ticket": t.ticket,
        "exit_price": f"{t.exit:.2f}",
        "actual_r": "" if actual_r is None else f"{actual_r}",
        "pnl_usd": f"{t.pnl:.2f}",
        "closed_at": f"{a.date[:4]}-{a.date[4:6]}-{a.date[6:]} (date only — open_time not in log)",
    }
    text = a.file.read_text(encoding="utf-8")
    end = text.find("\n---", 3)
    head, body = text[: end + 1], text[end + 1 :]
    lines = head.splitlines()
    for key, val in vals.items():
        pat = re.compile(rf"^{re.escape(key)}:.*$")
        for i, ln in enumerate(lines):
            # overwrite any existing line for this key (blank placeholder or a
            # stale value from a prior write-back, e.g. an armed-pending ticket
            # superseded by the actual fill/close ticket) — never leave a dupe key
            if pat.match(ln):
                lines[i] = f"{key}: {val}"
                break
        else:
            lines.append(f"{key}: {val}")  # field absent (pre-schema file) -> insert
    a.file.write_text("\n".join(lines) + "\n" + body, encoding="utf-8")


# --------------------------------------------------------------------------- #
# stats
# --------------------------------------------------------------------------- #

def portfolio_stats(trades: list[Trade]) -> dict:
    wins = [t for t in trades if t.is_win]
    losses = [t for t in trades if not t.is_win]
    gross_win = sum(t.pnl for t in wins)
    gross_loss = sum(t.pnl for t in losses)  # negative
    n = len(trades)
    return {
        "n": n,
        "wins": len(wins),
        "losses": len(losses),
        "win_rate": (len(wins) / n * 100) if n else 0.0,
        "net": sum(t.pnl for t in trades),
        "gross_win": gross_win,
        "gross_loss": gross_loss,
        "profit_factor": (gross_win / abs(gross_loss)) if gross_loss else float("inf"),
        "avg_win": (gross_win / len(wins)) if wins else 0.0,
        "avg_loss": (gross_loss / len(losses)) if losses else 0.0,
        "expectancy": (sum(t.pnl for t in trades) / n) if n else 0.0,
    }


def fmt_money(x: float) -> str:
    return f"{'+' if x >= 0 else '-'}${abs(x):.2f}"


# --------------------------------------------------------------------------- #
# report
# --------------------------------------------------------------------------- #

def build_report(trades, analyses, matched, un_trades, un_analyses, tol) -> str:
    s = portfolio_stats(trades)
    pf = "inf" if s["profit_factor"] == float("inf") else f"{s['profit_factor']:.2f}"
    L = []
    L.append("# Outcome Reconciliation — XAU/USD ICT Model")
    L.append(f"_Generated {dt.datetime.now(dt.timezone.utc):%Y-%m-%d %H:%M} UTC · entry-tol {tol} · "
             f"{len(trades)} trades / {len(analyses)} analyses_\n")

    L.append("## Portfolio stats (trade log = ground truth)")
    L.append(f"- Trades: {s['n']} | Wins: {s['wins']} | Losses: {s['losses']} | "
             f"Win rate: {s['win_rate']:.1f}%")
    L.append(f"- Net P&L: {fmt_money(s['net'])} | Profit factor: {pf}")
    L.append(f"- Gross win: {fmt_money(s['gross_win'])} | Gross loss: {fmt_money(s['gross_loss'])}")
    L.append(f"- Avg win: {fmt_money(s['avg_win'])} | Avg loss: {fmt_money(s['avg_loss'])} | "
             f"Expectancy/trade: {fmt_money(s['expectancy'])}\n")

    L.append("## Plan adherence (did trades come from model signals?)")
    L.append(f"- Trades matched to a graded plan: **{len(matched)} / {len(trades)}**")
    L.append(f"- Discretionary trades (no matching plan): **{len(un_trades)}**")
    L.append(f"- Actionable plans that never produced a trade: **{len(un_analyses)}**\n")

    if matched:
        L.append("### Matched trades")
        L.append("| Ticket | Date | Dir | Trade entry | Plan entry | Exit | Outcome | "
                 "Planned R:R | Actual R | Grade | P&L |")
        L.append("|---|---|---|---|---|---|---|---|---|---|---|")
        for t, a, outcome, ar in matched:
            L.append(f"| {t.ticket} | {t.date} | {a.direction} | {t.entry} | "
                     f"{a.f('entry')} | {t.exit} | {outcome} | {a.fm.get('rr','?')} | "
                     f"{'' if ar is None else ar} | {a.fm.get('setup_grade','—')} | "
                     f"{fmt_money(t.pnl)} |")
        L.append("")

    if un_trades:
        L.append("### Discretionary trades — no matching plan")
        L.append("| Ticket | Date | Label | Eff dir | Entry | Exit | Result | P&L | Note |")
        L.append("|---|---|---|---|---|---|---|---|---|")
        for t in un_trades:
            note = []
            if t.label_mismatch:
                note.append("label-inverted")
            if t.suspect_label:
                note.append("flagged *")
            L.append(f"| {t.ticket} | {t.date} | {t.label} | {t.eff_dir or '?'} | "
                     f"{t.entry} | {t.exit} | {t.result} | {fmt_money(t.pnl)} | "
                     f"{', '.join(note)} |")
        L.append("")

    if un_analyses:
        L.append("### Actionable plans with no trade (no_fill / skipped)")
        L.append("| File | Date | Dir | Entry | Grade | Score |")
        L.append("|---|---|---|---|---|---|")
        for a in un_analyses:
            rel = a.file.relative_to(REPO)
            L.append(f"| {rel} | {a.date} | {a.direction} | {a.f('entry')} | "
                     f"{a.fm.get('setup_grade','—')} | {a.fm.get('setup_score','—')} |")
        L.append("")

    return "\n".join(L)


# --------------------------------------------------------------------------- #

def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--entry-tol", type=float, default=2.0,
                    help="max |trade.entry - plan.entry| to call it a match (price, default 2.0)")
    ap.add_argument("--write-back", action="store_true",
                    help="patch matched analysis files' frontmatter with the outcome")
    ap.add_argument("--no-stats-file", action="store_true",
                    help="print report only, do not write Stats/ file")
    args = ap.parse_args()

    if not TRADE_LOG_DIR.exists():
        print(f"error: {TRADE_LOG_DIR} not found", file=sys.stderr)
        return 1

    trades = parse_trade_logs()
    analyses = parse_analyses()
    matched, un_trades, un_analyses = match(trades, analyses, args.entry_tol)

    report = build_report(trades, analyses, matched, un_trades, un_analyses, args.entry_tol)
    print(report)

    if args.write_back:
        for t, a, outcome, ar in matched:
            write_back(a, t, outcome, ar)
        print(f"\n[write-back] patched {len(matched)} analysis file(s).")

    if not args.no_stats_file and trades:
        STATS_DIR.mkdir(exist_ok=True)
        latest = max(t.date for t in trades)
        out = STATS_DIR / f"{latest}_reconcile_review.md"
        out.write_text(report + "\n", encoding="utf-8")
        print(f"\n[stats] wrote {out.relative_to(REPO)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
