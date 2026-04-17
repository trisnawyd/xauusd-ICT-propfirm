import { describe, it, expect } from "vitest";
import { analyzeStructure, detectFVGs, findOrderBlocks, calculatePremiumDiscount, detectLiquiditySweeps, } from "../server.js";
const t = (hh) => `2026.04.13 ${hh}:00`;
describe("analyzeStructure", () => {
    it("detects BoS UP then CHoCH DOWN", () => {
        const swings = [
            { type: "low", price: 2490, time: t("09:00") },
            { type: "high", price: 2500, time: t("09:30") },
            { type: "low", price: 2495, time: t("10:00") },
            { type: "high", price: 2510, time: t("10:30") },
            { type: "low", price: 2480, time: t("11:00") },
        ];
        const result = analyzeStructure(swings);
        expect(result.trend).toBe("BEARISH");
        expect(result.events).toHaveLength(2);
        expect(result.events[0]).toMatchObject({
            type: "BoS",
            direction: "UP",
            price: 2510,
            broken_level: 2500,
        });
        expect(result.events[1]).toMatchObject({
            type: "CHoCH",
            direction: "DOWN",
            price: 2480,
            broken_level: 2495,
        });
        expect(result.last_high).toBe(2510);
        expect(result.last_low).toBe(2480);
    });
    it("emits no events for flat-ranging swings", () => {
        const swings = [
            { type: "high", price: 2500, time: t("09:00") },
            { type: "low", price: 2495, time: t("09:30") },
        ];
        const result = analyzeStructure(swings);
        expect(result.trend).toBe("UNKNOWN");
        expect(result.events).toHaveLength(0);
    });
});
describe("detectFVGs", () => {
    it("detects a bullish FVG (unmitigated)", () => {
        const candles = [
            { time: t("10:00"), open: 2490, high: 2495, low: 2488, close: 2493 },
            { time: t("10:01"), open: 2495, high: 2510, low: 2494, close: 2508 },
            { time: t("10:02"), open: 2508, high: 2510, low: 2500, close: 2508 },
            { time: t("10:03"), open: 2508, high: 2512, low: 2509, close: 2511 },
        ];
        const fvgs = detectFVGs(candles);
        expect(fvgs).toHaveLength(1);
        expect(fvgs[0]).toMatchObject({
            type: "BULLISH",
            top: 2500,
            bottom: 2495,
            time: t("10:01"),
            mitigated: false,
        });
    });
    it("marks a bullish FVG as mitigated when a later candle fills it", () => {
        const candles = [
            { time: t("10:00"), open: 2490, high: 2495, low: 2488, close: 2493 },
            { time: t("10:01"), open: 2495, high: 2510, low: 2494, close: 2508 },
            { time: t("10:02"), open: 2508, high: 2510, low: 2500, close: 2508 },
            { time: t("10:03"), open: 2508, high: 2509, low: 2498, close: 2502 },
        ];
        const fvgs = detectFVGs(candles);
        expect(fvgs).toHaveLength(1);
        expect(fvgs[0].mitigated).toBe(true);
    });
    it("detects a bearish FVG", () => {
        const candles = [
            { time: t("10:00"), open: 2510, high: 2512, low: 2505, close: 2507 },
            { time: t("10:01"), open: 2505, high: 2506, low: 2490, close: 2495 },
            { time: t("10:02"), open: 2495, high: 2500, low: 2490, close: 2492 },
            { time: t("10:03"), open: 2492, high: 2494, low: 2488, close: 2490 },
        ];
        const fvgs = detectFVGs(candles);
        expect(fvgs).toHaveLength(1);
        expect(fvgs[0]).toMatchObject({
            type: "BEARISH",
            top: 2505,
            bottom: 2500,
            mitigated: false,
        });
    });
    it("emits no FVGs for a smooth sequence", () => {
        const candles = [
            { time: t("10:00"), open: 2500, high: 2502, low: 2499, close: 2501 },
            { time: t("10:01"), open: 2501, high: 2503, low: 2500, close: 2502 },
            { time: t("10:02"), open: 2502, high: 2504, low: 2501, close: 2503 },
        ];
        expect(detectFVGs(candles)).toHaveLength(0);
    });
});
describe("findOrderBlocks", () => {
    it("detects a bullish OB as the last bearish candle before BoS UP", () => {
        const candles = [
            { time: t("10:00"), open: 2500, high: 2502, low: 2497, close: 2498 },
            { time: t("10:01"), open: 2498, high: 2511, low: 2497, close: 2510 },
            { time: t("10:02"), open: 2510, high: 2513, low: 2509, close: 2512 },
        ];
        const events = [
            {
                type: "BoS",
                direction: "UP",
                price: 2510,
                time: t("10:01"),
                broken_level: 2500,
            },
        ];
        const obs = findOrderBlocks(candles, events);
        expect(obs).toHaveLength(1);
        expect(obs[0]).toMatchObject({
            type: "BULLISH",
            top: 2502,
            bottom: 2497,
            time: t("10:00"),
            mitigated: false,
            bos_price: 2510,
        });
    });
    it("detects a bearish OB and marks it mitigated when later high reclaims it", () => {
        const candles = [
            { time: t("10:00"), open: 2500, high: 2505, low: 2499, close: 2503 },
            { time: t("10:01"), open: 2503, high: 2504, low: 2489, close: 2490 },
            { time: t("10:02"), open: 2490, high: 2506, low: 2488, close: 2504 },
        ];
        const events = [
            {
                type: "BoS",
                direction: "DOWN",
                price: 2490,
                time: t("10:01"),
                broken_level: 2500,
            },
        ];
        const obs = findOrderBlocks(candles, events);
        expect(obs).toHaveLength(1);
        expect(obs[0]).toMatchObject({
            type: "BEARISH",
            top: 2505,
            bottom: 2499,
            mitigated: true,
        });
    });
});
describe("calculatePremiumDiscount", () => {
    it("classifies premium zone and returns OTE band", () => {
        const result = calculatePremiumDiscount(2510, 2490, 2505);
        expect(result).toEqual({
            swing_high: 2510,
            swing_low: 2490,
            equilibrium: 2500,
            ote_top: 2497.64,
            ote_bottom: 2494.28,
            current_price: 2505,
            zone: "PREMIUM",
        });
    });
    it("classifies discount zone", () => {
        const result = calculatePremiumDiscount(2510, 2490, 2495);
        expect(result.zone).toBe("DISCOUNT");
    });
    it("classifies equilibrium when price exactly at midpoint", () => {
        const result = calculatePremiumDiscount(2510, 2490, 2500);
        expect(result.zone).toBe("EQUILIBRIUM");
    });
});
describe("detectLiquiditySweeps", () => {
    it("detects a BSL sweep (high swept, candle closes back inside)", () => {
        const swings = [{ type: "high", price: 2510, time: t("09:00") }];
        const candles = [
            { time: t("09:30"), open: 2508, high: 2512, low: 2507, close: 2509 },
        ];
        const sweeps = detectLiquiditySweeps(candles, swings);
        expect(sweeps).toHaveLength(1);
        expect(sweeps[0]).toMatchObject({
            type: "BSL",
            swept_level: 2510,
            wick: 2512,
            close: 2509,
        });
    });
    it("detects an SSL sweep (low swept, candle closes back inside)", () => {
        const swings = [{ type: "low", price: 2490, time: t("09:00") }];
        const candles = [
            { time: t("09:30"), open: 2492, high: 2493, low: 2488, close: 2491 },
        ];
        const sweeps = detectLiquiditySweeps(candles, swings);
        expect(sweeps).toHaveLength(1);
        expect(sweeps[0]).toMatchObject({
            type: "SSL",
            swept_level: 2490,
            wick: 2488,
            close: 2491,
        });
    });
    it("ignores candles that break the level but close outside (no sweep)", () => {
        const swings = [{ type: "high", price: 2510, time: t("09:00") }];
        const candles = [
            { time: t("09:30"), open: 2509, high: 2515, low: 2508, close: 2513 },
        ];
        expect(detectLiquiditySweeps(candles, swings)).toHaveLength(0);
    });
});
//# sourceMappingURL=analysis.test.js.map