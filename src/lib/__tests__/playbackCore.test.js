import { describe, it, expect } from "vitest";
import { barSeconds, midiToHz, flattenSteps, playbackMidisForTone } from "../playbackCore.js";

const song = {
  tempo: 120,
  sections: [
    { chords: [{ rootPc: 0 }, { rootPc: 5 }] },
    { chords: [{ rootPc: 7 }] },
  ],
};

describe("barSeconds", () => {
  it.each([
    [120, 1, 2],
    [120, 0.5, 4],
    [120, 1.5, 4 / 3],
    [60, 1, 4],
  ])("bpm=%i speed=%s → %s", (bpm, speed, expected) => {
    expect(barSeconds(bpm, speed)).toBeCloseTo(expected, 10);
  });

  it("guards against zero/invalid tempo and speed", () => {
    expect(barSeconds(0, 1)).toBe(2); // falls back to 120bpm
    expect(barSeconds(120, 0)).toBe(2); // falls back to ×1
  });
});

describe("midiToHz", () => {
  it("maps A4 and A3", () => {
    expect(midiToHz(69)).toBeCloseTo(440, 6);
    expect(midiToHz(57)).toBeCloseTo(220, 6);
  });
});

describe("flattenSteps", () => {
  it("flattens every bar with section/bar indices", () => {
    expect(flattenSteps(song)).toEqual([
      { si: 0, bi: 0, chord: { rootPc: 0 } },
      { si: 0, bi: 1, chord: { rootPc: 5 } },
      { si: 1, bi: 0, chord: { rootPc: 7 } },
    ]);
  });

  it("filters to a single section when sectionIndex is given", () => {
    expect(flattenSteps(song, 1)).toEqual([{ si: 1, bi: 0, chord: { rootPc: 7 } }]);
  });

  it("returns [] for a missing song", () => {
    expect(flattenSteps(null)).toEqual([]);
    expect(flattenSteps({})).toEqual([]);
  });
});

describe("playbackMidisForTone", () => {
  const cMajor = { rootPc: 0, minor: false, ext: "" };

  it("uses the full voicing for clean and crunch", () => {
    expect(playbackMidisForTone(cMajor, "clean")).toEqual([48, 52, 55]);
    expect(playbackMidisForTone(cMajor, "crunch")).toEqual([48, 52, 55]);
  });

  it("voices distortion as a power chord (root+5th+octave)", () => {
    expect(playbackMidisForTone(cMajor, "distortion")).toEqual([48, 55, 60]);
  });

  it("applies chord.octave to the distortion power chord", () => {
    expect(playbackMidisForTone({ ...cMajor, octave: -1 }, "distortion")).toEqual([36, 43, 48]);
  });

  it("keeps the slash bass on a distorted power chord (F/G)", () => {
    expect(playbackMidisForTone({ rootPc: 5, bassPc: 7 }, "distortion")).toEqual([43, 53, 60, 65]);
  });
});
