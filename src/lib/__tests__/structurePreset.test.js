import { describe, it, expect } from "vitest";
import { buildStandardStructure } from "../structurePreset.js";
import { songDurationSeconds } from "../duration.js";
import { SECTION_TYPES } from "../../data/musicData.js";

const TYPE_IDS = new Set(SECTION_TYPES.map((t) => t.id));

describe("buildStandardStructure", () => {
  it.each([[60], [90], [107], [122], [150], [180]])("bpm %i: valid shape and roughly 4 minutes", (bpm) => {
    const structure = buildStandardStructure(bpm);
    expect(structure[0].type).toBe("intro");
    expect(structure.at(-1).type).toBe("outro");
    structure.forEach((s) => {
      expect(TYPE_IDS.has(s.type), `unknown type ${s.type}`).toBe(true);
      expect(s.bars % 2).toBe(0);
      expect(s.bars).toBeGreaterThanOrEqual(2);
      expect(s.bars).toBeLessThanOrEqual(16);
      expect(s.moodId).toBeNull();
    });
    const total = structure.reduce((sum, s) => sum + s.bars, 0);
    expect(Math.abs(songDurationSeconds(total, bpm) - 240)).toBeLessThanOrEqual(45);
  });

  it("adds a solo for fast tempos only", () => {
    expect(buildStandardStructure(150).some((s) => s.type === "solo")).toBe(true);
    expect(buildStandardStructure(107).some((s) => s.type === "solo")).toBe(false);
  });

  it("is deterministic", () => {
    expect(buildStandardStructure(122)).toEqual(buildStandardStructure(122));
  });
});
