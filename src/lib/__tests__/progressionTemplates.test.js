import { describe, it, expect } from "vitest";
import { PROGRESSION_TEMPLATES, GENRE_FAMILIES, SECTION_ROLES } from "../../data/progressionTemplates.js";
import { isValidToken } from "../chordTheory.js";
import { MOODS, GENRES, SECTION_TYPES } from "../../data/musicData.js";

const MOOD_IDS = new Set(MOODS.map((m) => m.id));
const GENRE_IDS = new Set(GENRES.map((g) => g.id));
const ROLE_IDS = new Set(Object.values(SECTION_ROLES));

describe("SECTION_ROLES", () => {
  it("maps every section type to a role", () => {
    SECTION_TYPES.forEach((t) => expect(SECTION_ROLES[t.id], `missing role for ${t.id}`).toBeDefined());
  });
});

describe("PROGRESSION_TEMPLATES", () => {
  it("has unique ids", () => {
    const ids = PROGRESSION_TEMPLATES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(PROGRESSION_TEMPLATES.map((t) => [t.id, t]))("%s is well-formed", (_, tpl) => {
    expect(["major", "minor"]).toContain(tpl.mode);
    expect(tpl.tokens.length).toBeGreaterThanOrEqual(2);
    expect(tpl.tokens.length).toBeLessThanOrEqual(16);
    tpl.tokens.forEach((tok) => expect(isValidToken(tok), `invalid token ${tok}`).toBe(true));
    tpl.roles.forEach((r) => expect(ROLE_IDS.has(r), `unknown role ${r}`).toBe(true));
    tpl.moods.forEach((m) => expect(MOOD_IDS.has(m), `unknown mood ${m}`).toBe(true));
    (tpl.genres ?? []).forEach((g) => expect(GENRE_IDS.has(g), `unknown genre ${g}`).toBe(true));
  });

  it("reaches every genre in both modes via genres or family tags", () => {
    for (const mode of ["major", "minor"]) {
      for (const g of GENRES) {
        const reachable = PROGRESSION_TEMPLATES.some(
          (tpl) =>
            tpl.mode === mode &&
            (tpl.genres?.includes(g.id) || tpl.tags.some((t) => GENRE_FAMILIES[g.id].includes(t)))
        );
        expect(reachable, `${mode}: genre ${g.id} unreachable`).toBe(true);
      }
    }
  });

  it("has at least one template per mode (selection fallback guarantee)", () => {
    expect(PROGRESSION_TEMPLATES.some((t) => t.mode === "major")).toBe(true);
    expect(PROGRESSION_TEMPLATES.some((t) => t.mode === "minor")).toBe(true);
  });
});
