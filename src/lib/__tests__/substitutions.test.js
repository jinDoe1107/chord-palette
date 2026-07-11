import { describe, it, expect } from "vitest";
import { getSpice, tokenFunction, cadenceGuard, applySubstitutions } from "../substitutions.js";
import { isValidToken } from "../chordTheory.js";
import { mulberry32 } from "../rng.js";

describe("getSpice", () => {
  it("maps mood to base spice", () => {
    expect(getSpice("jpop", "bright")).toEqual({ prob: 0.15, maxTier: 1 });
  });
  it("jazzy genres raise prob and unlock tier 3", () => {
    const s = getSpice("jazz", "chic");
    expect(s.maxTier).toBe(3);
    expect(s.prob).toBeCloseTo(0.5);
  });
  it("blues caps tier at 2", () => {
    const s = getSpice("blues", "chic");
    expect(s.maxTier).toBe(2);
    expect(s.prob).toBeCloseTo(0.3);
  });
});

describe("tokenFunction", () => {
  it.each([
    ["V", "major", "D"],
    ["IV/V", "major", "D"],
    ["bVII", "major", "D"],
    ["vi", "major", "T"],
    ["IV", "major", "S"],
    ["bII", "minor", "S"],
    ["VII", "minor", "D"],
    ["i", "minor", "T"],
  ])("%s in %s → %s", (token, mode, fn) => {
    expect(tokenFunction(token, mode)).toBe(fn);
  });
});

describe("cadenceGuard", () => {
  it("guards 2 bars for sections of 4+ bars, else 1", () => {
    expect(cadenceGuard(8)).toBe(2);
    expect(cadenceGuard(4)).toBe(2);
    expect(cadenceGuard(2)).toBe(1);
  });
});

describe("applySubstitutions", () => {
  const eightBars = ["I", "IV", "V", "I", "I", "IV", "V", "I"];

  it("tier gate: maxTier 1 only emits diatonic swaps", () => {
    const out = applySubstitutions(eightBars, { mode: "major", spice: { prob: 1, maxTier: 1 } }, mulberry32(42));
    const allowed = new Set(["I", "ii", "iii", "IV", "V", "vi"]);
    out.forEach((tok) => expect(allowed.has(tok), `unexpected ${tok}`).toBe(true));
  });

  it("cadence guard: last two bars stay tier-1 even at maxTier 3", () => {
    const out = applySubstitutions(eightBars, { mode: "major", spice: { prob: 1, maxTier: 3 } }, mulberry32(1));
    expect(out[6]).toBe("V"); // Vにはtier1ルールが無いのでガード帯では不変
    expect(["I", "vi", "iii"]).toContain(out[7]);
  });

  it("deterministic trace: secondary dominant + lock + guard behaviour", () => {
    // b0: 候補=[III7](secDom, 次のviが対象) → 採用+次ロック / b1: ロックでスキップ
    // b2: ガード帯tier1で I→vi が先頭候補だが直前小節"vi"と同一なので見送り / b3: I→vi 採用(偽終止)
    const out = applySubstitutions(["III", "vi", "I", "I"], { mode: "major", spice: { prob: 1, maxTier: 3 } }, () => 0);
    expect(out).toEqual(["III7", "vi", "I", "vi"]);
  });

  it("minor rules emit only grammar-valid tokens", () => {
    const out = applySubstitutions(["i", "iv", "V7", "i"], { mode: "minor", spice: { prob: 1, maxTier: 3 } }, mulberry32(7));
    out.forEach((tok) => expect(isValidToken(tok), `invalid ${tok}`).toBe(true));
  });

  it("is deterministic for a given seed", () => {
    const a = applySubstitutions(eightBars, { mode: "major", spice: { prob: 0.5, maxTier: 3 } }, mulberry32(5));
    const b = applySubstitutions(eightBars, { mode: "major", spice: { prob: 0.5, maxTier: 3 } }, mulberry32(5));
    expect(a).toEqual(b);
  });

  it("never substitutes when prob is 0", () => {
    const out = applySubstitutions(eightBars, { mode: "major", spice: { prob: 0, maxTier: 3 } }, mulberry32(9));
    expect(out).toEqual(eightBars);
  });
});
