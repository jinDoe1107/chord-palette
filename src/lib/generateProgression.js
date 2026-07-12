import { MAJOR_SCALE, MINOR_SCALE, MOODS, GENRES, SECTION_TYPES } from "../data/musicData.js";
import { tokenToChord, maybeAddSeventh, pick } from "./chordTheory.js";
import { PROGRESSION_TEMPLATES, GENRE_FAMILIES, SECTION_ROLES } from "../data/progressionTemplates.js";
import { applySubstitutions, getSpice, tokenFunction } from "./substitutions.js";

/* セクション間の接続採点: 前の終止機能 → 次の開始機能 */
const TRANSITION = {
  D: { T: 2, S: 0, D: 1 },
  S: { T: 1, S: 1, D: 2 },
  T: { T: 1, S: 2, D: 1 },
};

export function scoreTemplate(tpl, ctx) {
  let score = 0;
  if (tpl.genres?.includes(ctx.genreId)) score += 3;
  const fams = GENRE_FAMILIES[ctx.genreId] ?? [];
  if (tpl.tags.some((t) => fams.includes(t))) score += 2;
  if (tpl.moods.includes(ctx.moodId)) score += 2;
  if (tpl.roles.includes(ctx.role)) score += 3;
  const len = tpl.tokens.length;
  if (ctx.bars % len === 0) score += 2;
  else if (len < ctx.bars) score += 1;
  else score -= 1;
  if (ctx.prevEndToken)
    score += TRANSITION[tokenFunction(ctx.prevEndToken, ctx.mode)][tokenFunction(tpl.tokens[0], ctx.mode)];
  if (ctx.nextStartToken)
    score += TRANSITION[tokenFunction(tpl.tokens[tpl.tokens.length - 1], ctx.mode)][tokenFunction(ctx.nextStartToken, ctx.mode)];
  return score;
}

/* 採点上位帯(max-2)の候補列挙。直前テンプレ回避も適用。selectTemplateとAI選択器で共用 */
export function listTemplateCandidates(ctx, state) {
  const pool = PROGRESSION_TEMPLATES.filter((t) => t.mode === ctx.mode); // ハードフィルタはmodeのみ=空にならない
  const scored = pool.map((t) => ({ t, s: scoreTemplate(t, ctx) }));
  const max = Math.max(...scored.map((x) => x.s));
  let candidates = scored.filter((x) => x.s >= max - 2).map((x) => x.t);
  if (candidates.length >= 2 && state.prevTemplateId) {
    const filtered = candidates.filter((t) => t.id !== state.prevTemplateId); // 直前セクションと同テンプレ回避
    if (filtered.length > 0) candidates = filtered;
  }
  return candidates;
}

export function selectTemplate(ctx, rng, state) {
  return pick(listTemplateCandidates(ctx, state), rng);
}

/* テンプレをセクション小節数に充填 */
export function fitTemplateToBars(tokens, bars) {
  const len = tokens.length;
  if (bars === len) return [...tokens];
  if (bars === 1) return [tokens[0]];
  if (bars < len) return [...tokens.slice(0, bars - 1), tokens[len - 1]]; // 切詰め+カデンツ保持
  const out = [];
  while (out.length + len <= bars) out.push(...tokens);
  const r = bars - out.length;
  if (r > 0) {
    out.push(...tokens.slice(0, r));
    out[bars - 1] = tokens[len - 1]; // 余り部の末尾をカデンツに差し替え
  }
  return out;
}

/* README仕様の仕上げ: Bメロ/プリコーラス末尾→V7、アウトロ末尾→トニック */
export function applyFinishing(tokens, type, keyMode) {
  const out = [...tokens];
  if (type === "b" || type === "prechorus") out[out.length - 1] = "V7";
  else if (type === "outro") out[out.length - 1] = keyMode === "minor" ? "i" : "I";
  return out;
}

/**
 * 生成パイプライン本体(チューザ注入版)。
 * chooseTemplate(ctx, candidates) は候補から1テンプレを返す(async可)。
 * テンプレエンジンは rng で選び、AIアシスト(lmEngine.js)はLLMで選ぶ。
 * それ以外の req/sections/戻り値の契約は engine.js のとおり。
 * 曲内一貫性: 同一typeのセクションは同じテンプレを再利用(置換は毎回再抽選)=テーマと変奏
 */
export async function generateProgressionWith(req, chooseTemplate) {
  const genre = GENRES.find((g) => g.id === req.genreId);
  const results = [];
  const state = { byType: {}, prevTemplateId: null, prevEndToken: null };
  for (let i = 0; i < req.sections.length; i++) {
    const sec = req.sections[i];
    if (sec.fixedTokens) {
      results.push(sec.fixedTokens);
      state.prevEndToken = sec.fixedTokens[sec.fixedTokens.length - 1] ?? null;
      state.prevTemplateId = null;
      continue;
    }
    const effMoodId = sec.moodId ?? req.moodId;
    const mood = MOODS.find((m) => m.id === effMoodId) ?? MOODS.find((m) => m.id === req.moodId);
    const ctx = {
      mode: req.keyMode, genreId: req.genreId, moodId: effMoodId,
      role: SECTION_ROLES[sec.type] ?? "verse", sectionType: sec.type, bars: sec.bars,
      prevEndToken: state.prevEndToken,
      nextStartToken: req.sections[i + 1]?.fixedTokens?.[0] ?? null,
    };
    const tpl = state.byType[sec.type] ?? (await chooseTemplate(ctx, listTemplateCandidates(ctx, state)));
    state.byType[sec.type] = tpl;
    state.prevTemplateId = tpl.id;
    let tokens = fitTemplateToBars(tpl.tokens, sec.bars);
    tokens = applySubstitutions(tokens, { mode: req.keyMode, spice: getSpice(req.genreId, effMoodId) }, req.rng);
    const prob = Math.min(1, Math.max(0, genre.seventh + (mood?.seventhMod ?? 0)));
    tokens = tokens.map((t) => maybeAddSeventh(t, prob, req.rng));
    tokens = applyFinishing(tokens, sec.type, req.keyMode);
    state.prevEndToken = tokens[tokens.length - 1];
    results.push(tokens);
  }
  return results;
}

/**
 * テンプレエンジンの generate 実装(候補からrngで選ぶ)。
 * チューザ注入化に伴い Promise を返す。呼び出し側は await すること(engine.js契約どおり)。
 */
export function generateProgression(req) {
  return generateProgressionWith(req, (ctx, candidates) => pick(candidates, req.rng));
}

/* トークン列 → songのsectionオブジェクト(LeadSheetが消費する形+新設tokens) */
export function buildSongSection(sec, tokens, keyIndex, keyMode) {
  const scale = keyMode === "minor" ? MINOR_SCALE : MAJOR_SCALE;
  const moodDef = sec.moodId ? MOODS.find((m) => m.id === sec.moodId) : null;
  return {
    type: sec.type,
    bars: sec.bars,
    moodId: sec.moodId ?? null,
    moodAccent: moodDef?.accent ?? null,
    label: SECTION_TYPES.find((t) => t.id === sec.type)?.label ?? sec.type,
    tokens,
    chords: tokens.map((t) => tokenToChord(t, keyIndex, scale)),
  };
}
