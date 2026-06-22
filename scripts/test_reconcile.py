#!/usr/bin/env python3
"""Minimal regression tests for reconcile_outcomes parsing/logic.
Run: python3 scripts/test_reconcile.py   (exits non-zero on failure)
"""
from reconcile_outcomes import num, label_dir, effective_dir


def test_num():
    assert num("−$31.28") == -31.28          # U+2212 unicode minus + $
    assert num("+$2.05") == 2.05
    assert num("4322.95") == 4322.95
    assert num("buy*") is None               # non-numeric label
    assert num("-") is None and num("") is None and num(None) is None
    assert num("4,341.68") == 4341.68        # thousands comma


def test_label_dir():
    assert label_dir("buy*") == "LONG"
    assert label_dir("SELL*") == "SHORT"
    assert label_dir("BUY") == "LONG"
    assert label_dir("?") is None


def test_effective_dir_neutralizes_label_bug():
    # ticket 6673963: labelled buy* but price rose into a LOSS -> effectively SHORT
    assert effective_dir(entry=4322.95, exit_=4333.35, is_win=False) == "SHORT"
    # genuine winning long: price up, win
    assert effective_dir(entry=4074.98, exit_=4095.01, is_win=True) == "LONG"
    # genuine winning short: price down, win
    assert effective_dir(entry=4345.55, exit_=4326.06, is_win=True) == "SHORT"
    # scratch (no move) -> undecidable
    assert effective_dir(entry=4100.0, exit_=4100.0, is_win=False) is None


def main():
    fns = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    for fn in fns:
        fn()
        print(f"  ok  {fn.__name__}")
    print(f"\n{len(fns)} test(s) passed.")


if __name__ == "__main__":
    main()
