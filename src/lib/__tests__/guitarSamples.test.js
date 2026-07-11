import { describe, it, expect } from "vitest";
import {
  midiToSampleName,
  clampMidiToRange,
  sampleUrl,
  collectStepMidis,
  SAMPLE_MIN_MIDI,
  SAMPLE_MAX_MIDI,
} from "../guitarSamples.js";

describe("midiToSampleName", () => {
  it.each([
    [60, "C4"],
    [61, "Db4"],
    [69, "A4"],
    [24, "C1"],
    [84, "C6"],
    [82, "Bb5"],
    [21, "A0"],
  ])("MIDI %i → %s", (midi, name) => {
    expect(midiToSampleName(midi)).toBe(name);
  });
});

describe("clampMidiToRange", () => {
  it("leaves in-range notes unchanged", () => {
    expect(clampMidiToRange(60)).toBe(60);
    expect(clampMidiToRange(SAMPLE_MIN_MIDI)).toBe(SAMPLE_MIN_MIDI);
    expect(clampMidiToRange(SAMPLE_MAX_MIDI)).toBe(SAMPLE_MAX_MIDI);
  });

  it("shifts out-of-range notes by octaves, preserving pitch class", () => {
    expect(clampMidiToRange(23)).toBe(35); // below min: +12
    expect(clampMidiToRange(12)).toBe(24); // below min: +12
    expect(clampMidiToRange(85)).toBe(73); // above max: -12
    expect(clampMidiToRange(96)).toBe(84); // above max: -12
  });

  it("keeps pitch class for every shift", () => {
    for (const midi of [0, 5, 100, 127]) {
      expect(clampMidiToRange(midi) % 12).toBe(midi % 12);
    }
  });
});

describe("sampleUrl", () => {
  it("builds a path under the given base", () => {
    expect(sampleUrl("/", "electric_guitar_clean", 60)).toBe("/samples/guitar/electric_guitar_clean/C4.mp3");
  });

  it("normalizes a base with or without a trailing slash", () => {
    expect(sampleUrl("/app", "distortion_guitar", 48)).toBe("/app/samples/guitar/distortion_guitar/C3.mp3");
    expect(sampleUrl("/app/", "distortion_guitar", 48)).toBe("/app/samples/guitar/distortion_guitar/C3.mp3");
  });
});

describe("collectStepMidis", () => {
  const steps = [
    { chord: { rootPc: 0, minor: false, ext: "" } }, // C: 48,52,55
    { chord: { rootPc: 0, minor: false, ext: "" } }, // duplicate
  ];

  it("returns unique, ascending, in-range notes", () => {
    expect(collectStepMidis(steps, "clean")).toEqual([48, 52, 55]);
  });

  it("reflects the distortion power-chord voicing", () => {
    expect(collectStepMidis(steps, "distortion")).toEqual([48, 55, 60]);
  });
});
