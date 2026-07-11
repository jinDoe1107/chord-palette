import { describe, it, expect } from "vitest";
import { parseToken, tokenToChord, maybeAddSeventh, isValidToken } from "../chordTheory.js";
import { MINOR_SCALE } from "../../data/musicData.js";

describe("parseToken", () => {
  it.each([
    ["I", { degree: 0, flat: false, minor: false, ext: "", bassDegree: null }],
    ["vi7", { degree: 5, flat: false, minor: true, ext: "7", bassDegree: null }],
    ["bVII7", { degree: 6, flat: true, minor: false, ext: "7", bassDegree: null }],
    ["IV/V", { degree: 3, flat: false, minor: false, ext: "", bassDegree: 4 }],
    ["IM7", { degree: 0, flat: false, minor: false, ext: "M7", bassDegree: null }],
  ])("%s", (token, expected) => {
    expect(parseToken(token)).toMatchObject(expected);
  });
});

describe("tokenToChord", () => {
  it("maps diatonic tokens in C major", () => {
    expect(tokenToChord("I", 0).name).toBe("C");
    expect(tokenToChord("vi", 0).name).toBe("Am");
    expect(tokenToChord("V7", 0).name).toBe("G7");
    expect(tokenToChord("bVII", 0).name).toBe("Bb");
  });
  it("maps slash chords", () => {
    const c = tokenToChord("IV/V", 0);
    expect(c.name).toBe("F/G");
    expect(c.bassPc).toBe(7);
  });
  it("maps minor scale degrees", () => {
    expect(tokenToChord("i", 9, MINOR_SCALE).name).toBe("Am");
  });
});

describe("isValidToken", () => {
  it.each([
    ["IVM7", true],
    ["bVII7", true],
    ["IV/V", true],
    ["iii7", true],
    ["H7", false],
    ["sus4", false],
    ["", false],
  ])("%j → %s", (token, expected) => {
    expect(isValidToken(token)).toBe(expected);
  });
});

describe("maybeAddSeventh", () => {
  it("adds 7 to V and m7 to minor chords", () => {
    expect(maybeAddSeventh("V", 1, () => 0)).toBe("V7");
    expect(maybeAddSeventh("ii", 1, () => 0)).toBe("ii7");
    expect(maybeAddSeventh("I", 1, () => 0)).toBe("IM7");
  });
  it("leaves extended, borrowed and slash tokens untouched", () => {
    expect(maybeAddSeventh("V7", 1, () => 0)).toBe("V7");
    expect(maybeAddSeventh("bVII", 1, () => 0)).toBe("bVII");
    expect(maybeAddSeventh("IV/V", 1, () => 0)).toBe("IV/V");
  });
  it("respects probability", () => {
    expect(maybeAddSeventh("I", 0.5, () => 0.9)).toBe("I");
  });
});
