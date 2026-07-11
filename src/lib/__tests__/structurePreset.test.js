import { describe, it, expect } from "vitest";
import { buildStandardStructure } from "../structurePreset.js";
import { songDurationSeconds } from "../duration.js";
import { SECTION_TYPES, LENGTH_RANGE } from "../../data/musicData.js";
import { mulberry32 } from "../rng.js";
import { GENRE_FAMILY } from "../../data/structureRecipes.js";

const TYPE_IDS = new Set(SECTION_TYPES.map((t) => t.id));
const GENRE_IDS = Object.keys(GENRE_FAMILY);
const SAMPLE_LENGTHS = [LENGTH_RANGE.min, 150, LENGTH_RANGE.default, 360, LENGTH_RANGE.max];

function assertValidShape(structure) {
  expect(structure[0].type).toBe("intro");
  expect(structure.at(-1).type).toBe("outro");
  structure.forEach((s) => {
    expect(TYPE_IDS.has(s.type), `unknown type ${s.type}`).toBe(true);
    expect(s.bars % 2).toBe(0);
    expect(s.bars).toBeGreaterThanOrEqual(2);
    expect(s.bars).toBeLessThanOrEqual(16);
    expect(s.moodId).toBeNull();
  });
}

describe("buildStandardStructure", () => {
  it("valid shape & roughly on-target across genres/lengths/seeds", () => {
    for (const genreId of GENRE_IDS) {
      for (const targetSeconds of SAMPLE_LENGTHS) {
        for (let seed = 1; seed <= 8; seed++) {
          const bpm = 120;
          const structure = buildStandardStructure({ bpm, genreId, targetSeconds, rng: mulberry32(seed) });
          assertValidShape(structure);
          const total = structure.reduce((sum, s) => sum + s.bars, 0);
          const secs = songDurationSeconds(total, bpm);
          expect(secs).toBeGreaterThan(targetSeconds * 0.45);
          expect(secs).toBeLessThan(targetSeconds * 1.6);
        }
      }
    }
  });

  it("reaches close to the max length for every genre (no more low ceiling)", () => {
    for (const genreId of GENRE_IDS) {
      const bpm = 120;
      const structure = buildStandardStructure({
        bpm, genreId, targetSeconds: LENGTH_RANGE.max, rng: mulberry32(1),
      });
      const total = structure.reduce((sum, s) => sum + s.bars, 0);
      const secs = songDurationSeconds(total, bpm);
      expect(secs).toBeGreaterThan(LENGTH_RANGE.max * 0.7); // かつての頭打ち(例: ブルース3:44)を再発させない
    }
  });

  it("is deterministic for the same seed", () => {
    const opts = { bpm: 122, genreId: "jpop", targetSeconds: 240 };
    expect(buildStandardStructure({ ...opts, rng: mulberry32(42) }))
      .toEqual(buildStandardStructure({ ...opts, rng: mulberry32(42) }));
  });

  it("genre changes the section vocabulary", () => {
    const blues = buildStandardStructure({ bpm: 100, genreId: "blues", rng: mulberry32(1) });
    expect(blues.some((s) => s.type === "chorus")).toBe(false); // ブルースはサビ無し
    const edm = buildStandardStructure({ bpm: 126, genreId: "edm", rng: mulberry32(1) });
    expect(edm.every((s) => TYPE_IDS.has(s.type))).toBe(true);
  });

  it("no rng ⇒ deterministic fallback", () => {
    expect(buildStandardStructure({ bpm: 120, genreId: "jpop" }))
      .toEqual(buildStandardStructure({ bpm: 120, genreId: "jpop" }));
  });
});
