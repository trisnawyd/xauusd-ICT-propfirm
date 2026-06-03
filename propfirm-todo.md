# Prop Firm — TODO

## Pending

### [x] #1 — Update server.ts MaxLot validation to support dynamic lot sizing
The Layer 2 (server.ts) MCP bridge currently hard-blocks any order with lot > 0.01. Now that lot sizing is dynamic (based on 2% risk model), the MaxLot validation limit needs to be raised to accommodate larger lots (e.g. 0.20). Find the lot validation check in server.ts and update the ceiling value.

---

### [ ] #2 — Raise MaxLot input param in MT5Bridge EA
The Layer 3 (MT5Bridge EA) has a MaxLot input parameter defaulting to 0.01, which will reject any dynamic lot larger than that. In MT5: go to the EA inputs, find MaxLot, and raise it to the intended ceiling (e.g. 0.20). This must be done before placing any trade with lot > 0.01.

---

## Context
These tasks are blocking the dynamic lot sizing model introduced on 2026-04-17.

**Formula:** `Lot = Max Risk ÷ (SL pips × $10)`, rounded to nearest 0.01
**Risk model:** 2% of equity ($97.74 at current equity $4887.11)

| SL (pips) | Lot  | Risk $  |
|-----------|------|---------|
| 50        | 0.19 | ~$95    |
| 100       | 0.09 | ~$90    |
| 150       | 0.06 | ~$90    |
| 200       | 0.05 | ~$100   |
| 300       | 0.03 | ~$90    |
