import { describe, it, expect } from "vitest";
import { buildSelectionPrompt, parseSelection, makeLlmChooser } from "../lmEngine.js";
import { generateProgressionWith } from "../generateProgression.js";
import { isValidToken } from "../chordTheory.js";
import { mulberry32 } from "../rng.js";

const CANDS = [
  { id: "axis", tokens: ["I", "V", "vi", "IV"] },
  { id: "komuro", tokens: ["vi", "IV", "V", "I"] },
  { id: "canon", tokens: ["I", "V", "vi", "iii", "IV", "I", "IV", "V"] },
];
const ctx = {
  mode: "major", genreId: "jpop", moodId: "wistful", role: "chorus",
  sectionType: "chorus", bars: 8, ai: true, prevEndToken: "V7", nextStartToken: null,
};
const req = (over = {}) => ({
  genreId: "jpop", moodId: "wistful", keyIndex: 0, keyMode: "major", bpm: 120,
  hint: null, sections: [], rng: mulberry32(7), ...over,
});
// Transformers.js text-generationパイプラインの応答形状を再現
const fakeGenerator = (reply) => async (messages) => [
  { generated_text: [...messages, { role: "assistant", content: reply }] },
];
const identityRng = () => 0.99; // Fisher–Yatesが並びを変えない値(j===iになる)

describe("parseSelection", () => {
  it("parses a bare number and 1-indexes it", () => {
    expect(parseSelection("2", 3)).toBe(1);
    expect(parseSelection(" 3.", 3)).toBe(2);
    expect(parseSelection("The best is 1 because...", 3)).toBe(0);
  });
  it("rejects out-of-range and garbage", () => {
    expect(parseSelection("4", 3)).toBeNull();
    expect(parseSelection("0", 3)).toBeNull();
    expect(parseSelection("none of them", 3)).toBeNull();
  });
});

describe("buildSelectionPrompt", () => {
  it("includes song context, numbered candidates and the answer instruction", () => {
    const p = buildSelectionPrompt(req(), ctx, CANDS);
    expect(p).toContain("genre=J-POP");
    expect(p).toContain("Section: chorus (8 bars)");
    expect(p).toContain("ends on: V7");
    expect(p).toContain("1. I V vi IV");
    expect(p).toContain("3. I V vi iii IV I IV V");
    expect(p).toContain("Answer with only the number");
  });
  it("embeds the hint only when present", () => {
    expect(buildSelectionPrompt(req(), ctx, CANDS)).not.toContain("User request");
    expect(buildSelectionPrompt(req({ hint: "サビは壮大に" }), ctx, CANDS)).toContain("User request (Japanese): サビは壮大に");
  });
  it("embeds the per-section hint only when present", () => {
    expect(buildSelectionPrompt(req(), ctx, CANDS)).not.toContain("Request for this section");
    expect(buildSelectionPrompt(req(), { ...ctx, hint: "静かに始めて" }, CANDS))
      .toContain("Request for this section (Japanese): 静かに始めて");
  });
});

describe("makeLlmChooser", () => {
  it("returns the candidate the model picked", async () => {
    const chooser = makeLlmChooser(req({ rng: identityRng }), fakeGenerator("2"));
    expect(await chooser(ctx, CANDS)).toBe(CANDS[1]);
  });
  it("skips the model for a single candidate", async () => {
    let called = false;
    const spy = async () => { called = true; return []; };
    const chooser = makeLlmChooser(req(), spy);
    expect(await chooser(ctx, [CANDS[0]])).toBe(CANDS[0]);
    expect(called).toBe(false);
  });
  it("skips the model when the section has AI off", async () => {
    let called = false;
    const spy = async () => { called = true; return []; };
    const chooser = makeLlmChooser(req({ rng: mulberry32(4) }), spy);
    expect(CANDS).toContain(await chooser({ ...ctx, ai: false }, CANDS));
    expect(called).toBe(false);
  });
  it("falls back to a shuffled pick on garbage output", async () => {
    const chooser = makeLlmChooser(req({ rng: mulberry32(9) }), fakeGenerator("I like them all"));
    const chosen = await chooser(ctx, CANDS);
    expect(CANDS).toContain(chosen);
  });
  it("falls back when the generator throws", async () => {
    const chooser = makeLlmChooser(req({ rng: mulberry32(9) }), async () => { throw new Error("boom"); });
    expect(CANDS).toContain(await chooser(ctx, CANDS));
  });
  it("is deterministic for the same seed (shuffle + greedy)", async () => {
    const run = async () =>
      (await makeLlmChooser(req({ rng: mulberry32(5) }), fakeGenerator("1"))(ctx, CANDS)).id;
    expect(await run()).toBe(await run());
  });
});

describe("generateProgressionWith + llm chooser", () => {
  it("produces valid tokens with correct bar counts end-to-end", async () => {
    const sections = [
      { type: "a", bars: 8, moodId: null, ai: true, fixedTokens: null },
      { type: "b", bars: 8, moodId: null, ai: true, fixedTokens: null },
      { type: "chorus", bars: 8, moodId: null, ai: true, fixedTokens: null },
      { type: "outro", bars: 4, moodId: null, ai: false, fixedTokens: null }, // AIオフ混在でも成立する
    ];
    const r = req({ sections, rng: mulberry32(3), hint: "明るく" });
    const result = await generateProgressionWith(r, makeLlmChooser(r, fakeGenerator("1")));
    expect(result).toHaveLength(4);
    result.forEach((tokens, i) => {
      expect(tokens).toHaveLength(sections[i].bars);
      tokens.forEach((t) => expect(isValidToken(t), `invalid ${t}`).toBe(true));
    });
    expect(result[1].at(-1)).toBe("V7"); // 仕上げ処理も通っている
    expect(result[3].at(-1)).toBe("I");
  });
  it("passes per-section hints through to the prompt", async () => {
    const prompts = [];
    const gen = async (messages) => {
      prompts.push(messages[0].content);
      return [{ generated_text: [...messages, { role: "assistant", content: "1" }] }];
    };
    const sections = [
      { type: "a", bars: 4, moodId: null, ai: true, hint: "静かに始めて", fixedTokens: null },
      { type: "chorus", bars: 4, moodId: null, ai: false, hint: null, fixedTokens: null },
    ];
    const r = req({ sections, rng: mulberry32(3) });
    await generateProgressionWith(r, makeLlmChooser(r, gen));
    expect(prompts.some((p) => p.includes("Request for this section (Japanese): 静かに始めて"))).toBe(true);
  });
});
