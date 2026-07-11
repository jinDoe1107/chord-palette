import { describe, it, expect } from "vitest";
import { parseToken, tokenToChord, maybeAddSeventh, isValidToken, chordMidiNotes, chordFrequencies } from "../chordTheory.js";
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

describe("chordMidiNotes", () => {
  it.each([
    ["C major triad", { rootPc: 0, minor: false, ext: "" }, [48, 52, 55]],
    ["A minor triad", { rootPc: 9, minor: true, ext: "" }, [57, 60, 64]],
    ["G dominant 7th", { rootPc: 7, minor: false, ext: "7" }, [55, 59, 62, 65]],
    ["C major 7th", { rootPc: 0, minor: false, ext: "M7" }, [48, 52, 55, 59]],
  ])("%s", (_label, chord, expected) => {
    expect(chordMidiNotes(chord)).toEqual(expected);
  });

  it("prefers explicit intervals over minor/ext", () => {
    expect(chordMidiNotes({ rootPc: 0, minor: true, intervals: [0, 4, 8] })).toEqual([48, 52, 56]);
  });

  it("shifts every note by an octave when chord.octave is set", () => {
    expect(chordMidiNotes({ rootPc: 0, minor: false, ext: "", octave: 1 })).toEqual([60, 64, 67]);
    expect(chordMidiNotes({ rootPc: 0, minor: false, ext: "", octave: -1 })).toEqual([36, 40, 43]);
  });

  it("prepends a bass note for slash chords (F/G)", () => {
    expect(chordMidiNotes({ rootPc: 5, minor: false, ext: "", bassPc: 7 })).toEqual([43, 53, 57, 60]);
  });

  it("ignores a bass equal to the root", () => {
    expect(chordMidiNotes({ rootPc: 0, minor: false, ext: "", bassPc: 0 })).toEqual([48, 52, 55]);
  });
});

describe("chordFrequencies", () => {
  it("is chordMidiNotes mapped to Hz (A minor starts at 220Hz)", () => {
    const freqs = chordFrequencies({ rootPc: 9, minor: true, ext: "" });
    expect(freqs[0]).toBeCloseTo(220, 5); // MIDI 57 = A3 = 220Hz
    expect(freqs).toEqual(chordMidiNotes({ rootPc: 9, minor: true, ext: "" }).map((m) => 440 * Math.pow(2, (m - 69) / 12)));
  });
});
