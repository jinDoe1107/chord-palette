import { describe, it, expect } from "vitest";
import {
  selectTemplate,
  fitTemplateToBars,
  applyFinishing,
  generateProgression,
  buildSongSection,
} from "../generateProgression.js";
import { templateEngine } from "../engine.js";
import { isValidToken } from "../chordTheory.js";
import { mulberry32 } from "../rng.js";

const BLUES_12 = ["I7", "I7", "I7", "I7", "IV7", "IV7", "I7", "I7", "V7", "IV7", "I7", "V7"];

const req = (over = {}) => ({
  genreId: "jpop", moodId: "wistful", keyIndex: 0, keyMode: "major", bpm: 120,
  sections: [], rng: mulberry32(7), ...over,
});
const sec = (type, bars, over = {}) => ({ type, bars, moodId: null, fixedTokens: null, ...over });

describe("fitTemplateToBars", () => {
  it("tiles when divisible", () => {
    expect(fitTemplateToBars(["I", "V", "vi", "IV"], 8)).toEqual(["I", "V", "vi", "IV", "I", "V", "vi", "IV"]);
  });
  it("appends a head slice with cadence adjustment on remainder", () => {
    expect(fitTemplateToBars(["I", "V", "vi", "IV"], 6)).toEqual(["I", "V", "vi", "IV", "I", "IV"]);
  });
  it("truncates keeping the template cadence", () => {
    expect(fitTemplateToBars(BLUES_12, 8)).toEqual(["I7", "I7", "I7", "I7", "IV7", "IV7", "I7", "V7"]);
  });
  it("returns the head token for a single bar", () => {
    expect(fitTemplateToBars(["IM7", "IVM7"], 1)).toEqual(["IM7"]);
  });
  it("copies when the length matches", () => {
    expect(fitTemplateToBars(["I", "IV"], 2)).toEqual(["I", "IV"]);
  });
});

describe("applyFinishing", () => {
  it("forces V7 at the end of b/prechorus and tonic at the end of outro", () => {
    expect(applyFinishing(["I", "IV"], "b", "major").at(-1)).toBe("V7");
    expect(applyFinishing(["I", "IV"], "prechorus", "minor").at(-1)).toBe("V7");
    expect(applyFinishing(["IV", "V"], "outro", "major").at(-1)).toBe("I");
    expect(applyFinishing(["iv", "V7"], "outro", "minor").at(-1)).toBe("i");
    expect(applyFinishing(["I", "IV"], "chorus", "major")).toEqual(["I", "IV"]);
  });
});

describe("selectTemplate", () => {
  it("prefers jazz material for a jazz verse", () => {
    const tpl = selectTemplate(
      { mode: "major", genreId: "jazz", moodId: "chic", role: "verse", bars: 4, prevEndToken: null, nextStartToken: null },
      () => 0,
      { byType: {}, prevTemplateId: null }
    );
    expect(tpl.genres?.includes("jazz") || tpl.tags.includes("jazzy")).toBe(true);
  });
});

describe("generateProgression", () => {
  const structure = [sec("intro", 4), sec("a", 8), sec("b", 8), sec("chorus", 8), sec("outro", 4)];

  it("fills every section with valid tokens and honours finishing rules (major)", async () => {
    const result = await generateProgression(req({ sections: structure, rng: mulberry32(7) }));
    expect(result).toHaveLength(structure.length);
    result.forEach((tokens, i) => {
      expect(tokens).toHaveLength(structure[i].bars);
      tokens.forEach((t) => expect(isValidToken(t), `invalid ${t}`).toBe(true));
    });
    expect(result[2].at(-1)).toBe("V7"); // Bメロ
    expect(result[4].at(-1)).toBe("I"); // アウトロ
  });

  it("is reproducible for a given seed", async () => {
    const a = await generateProgression(req({ sections: structure, rng: mulberry32(7) }));
    const b = await generateProgression(req({ sections: structure, rng: mulberry32(7) }));
    expect(a).toEqual(b);
  });

  it("supports minor keys (metal × aggressive)", async () => {
    const sections = [sec("a", 8), sec("b", 8), sec("chorus", 8), sec("outro", 4)];
    const result = await generateProgression(req({
      genreId: "metal", moodId: "aggressive", keyIndex: 9, keyMode: "minor",
      sections, rng: mulberry32(11),
    }));
    result.forEach((tokens) => tokens.forEach((t) => expect(isValidToken(t), `invalid ${t}`).toBe(true)));
    expect(result[1].at(-1)).toBe("V7");
    expect(result[3].at(-1)).toBe("i");
  });

  it("echoes fixed sections without consuming randomness", async () => {
    const fixedA = ["I", "V", "vi", "IV"];
    const fixedB = ["IV", "V", "I", "I"];
    const result = await generateProgression(req({
      sections: [
        { type: "a", bars: 4, moodId: null, fixedTokens: fixedA },
        { type: "outro", bars: 4, moodId: null, fixedTokens: fixedB },
      ],
      rng: () => { throw new Error("rng must not be called"); },
    }));
    expect(result).toEqual([fixedA, fixedB]);
  });

  it("reuses the same template for repeated section types (theme and variation)", async () => {
    const noSub = () => 0.99; // 置換・7th付加のロールが全て外れる値
    const result = await generateProgression(req({
      genreId: "jpop", moodId: "bright",
      sections: [sec("chorus", 8), sec("a", 8), sec("chorus", 8)],
      rng: noSub,
    }));
    expect(result[0]).toEqual(result[2]);
  });
});

describe("templateEngine contract", () => {
  it("generate() can be awaited and matches the request shape", async () => {
    const r = req({ sections: [sec("a", 4), sec("chorus", 8)], rng: mulberry32(3) });
    const result = await templateEngine.generate(r);
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveLength(4);
    expect(result[1]).toHaveLength(8);
    expect(templateEngine.id).toBe("template");
    expect(templateEngine.init).toBeUndefined();
  });
});

describe("buildSongSection", () => {
  it("builds the section shape LeadSheet consumes", () => {
    const s = buildSongSection({ type: "chorus", bars: 2, moodId: "chic" }, ["IVM7", "V7"], 0, "major");
    expect(s.label).toBe("サビ");
    expect(s.moodId).toBe("chic");
    expect(typeof s.moodAccent).toBe("string");
    expect(s.tokens).toEqual(["IVM7", "V7"]);
    expect(s.chords.map((c) => c.name)).toEqual(["FM7", "G7"]);
    expect(s.chords[0].degreeLabel).toBe("IVM7");
  });
  it("uses the minor scale in minor mode and null moodAccent without override", () => {
    const s = buildSongSection({ type: "a", bars: 1, moodId: null }, ["i"], 9, "minor");
    expect(s.moodAccent).toBeNull();
    expect(s.label).toBe("Aメロ");
    expect(s.chords[0].name).toBe("Am");
  });
});
