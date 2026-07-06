import { SECTION_TYPES, MOODS, MAJOR_SCALE, MINOR_SCALE } from "../data/musicData.js";
import { pick, maybeAddSeventh, tokenToChord } from "./chordTheory.js";

/* Variation operators: functional substitutions & secondary dominants.
   Keys are plain diatonic tokens only, so borrowed (♭) / extended (7, M7) /
   minor-tonic (i) skeletons are automatically left untouched. */
const FUNCTIONAL_SUBS = {
  I: ["vi", "iii"], vi: ["I", "iii"], iii: ["I", "vi"], // トニック群
  IV: ["ii"], ii: ["IV"], // サブドミナント群
};
const SECONDARY_DOMINANTS = { ii: "VI7", iii: "VII7", IV: "I7", V: "II7", vi: "III7" };

function buildSection(section, genre, mood, seventhProb, rng) {
  const type = SECTION_TYPES.find((t) => t.id === section.type);
  const fullPool = genre.pools[type.role];
  const filtered = fullPool.filter((u) => u.moods.includes(mood.id));
  const pool = filtered.length > 0 ? filtered : fullPool; // fallback: ムード該当なしなら全プールから選ぶ

  const tokens = [];
  const blockStarts = [];
  let prevUnit = null;
  while (tokens.length < section.bars) {
    let unit = pick(pool, rng);
    // 連続同一ブロックのソフト回避: 直前と同じなら50%で一度だけ引き直す
    if (unit === prevUnit && pool.length > 1 && rng() < 0.5) unit = pick(pool, rng);
    prevUnit = unit;
    blockStarts.push(tokens.length);
    for (const t of unit.p) {
      if (tokens.length < section.bars) tokens.push(t);
    }
  }

  // 機能的代理置換（セクション先頭・最終小節は骨格保持のため除外）
  const subProb = 0.08 + genre.seventh * 0.1;
  for (let i = 1; i < tokens.length - 1; i++) {
    const subs = FUNCTIONAL_SUBS[tokens[i]];
    if (subs && rng() < subProb) tokens[i] = pick(subs, rng);
  }

  // ブロック境界でのセカンダリードミナント挿入（次ブロック頭のコードへ向かうV7/x）
  for (const b of blockStarts) {
    if (b === 0) continue;
    const secDom = SECONDARY_DOMINANTS[tokens[b]];
    if (secDom && rng() < 0.1) tokens[b - 1] = secDom;
  }

  // 分数コード化（スラッシュコードが様式に合うジャンルのみ・定番3パターン限定）
  // V7/IM7 などの拡張形も同機能なので対象に含める（置換後は分数トークンの三和音になる）
  // ブルースはV7の緊張感が様式の核なので対象外
  if (genre.seventh >= 0.15 && genre.id !== "blues") {
    for (let i = 1; i < tokens.length - 1; i++) {
      if (rng() >= 0.15) continue;
      const t = tokens[i];
      const nextRoot = tokens[i + 1].replace(/M?7$/, "");
      const isV = t === "V" || t === "V7";
      if (isV && nextRoot === "vi") tokens[i] = "V/vii"; // ベース下行 ド→シ→ラ
      else if (isV) tokens[i] = "IV/V"; // 柔らかいドミナント（V9sus的）
      else if ((t === "I" || t === "IM7") && (nextRoot === "IV" || nextRoot === "ii")) tokens[i] = "I/iii"; // ベース上行 ミ→ファ
    }
  }

  // セクション種類による末尾強制（SECTION_TYPES.end: V7=サビへの推進力, I=解決）
  if (type.end && tokens.length >= 1) tokens[tokens.length - 1] = type.end;

  return tokens.map((t) => maybeAddSeventh(t, seventhProb, rng));
}

/**
 * Generate chords for a single structure section (used both by generateSong and by
 * appending a new section to an already-generated song without touching the rest).
 * @param {{type: string, bars: number, moodId?: string}} section
 * @param {object} genre - an entry from GENRES
 * @param {object} mood - an entry from MOODS (used when the section has no moodId)
 * @param {number} keyIndex - 0-11, index into NOTE_NAMES
 * @param {object} [options]
 * @param {"major"|"minor"} [options.keyMode]
 * @param {() => number} [rng]
 */
export function generateSectionData(section, genre, mood, keyIndex, options = {}, rng = Math.random) {
  const { keyMode = "major" } = options;
  const scale = keyMode === "minor" ? MINOR_SCALE : MAJOR_SCALE;
  const sectionMood = (section.moodId && MOODS.find((m) => m.id === section.moodId)) || mood;
  const seventhProb = Math.min(1, genre.seventh + sectionMood.seventhMod);
  const tokens = buildSection(section, genre, sectionMood, seventhProb, rng);
  return {
    ...section,
    label: SECTION_TYPES.find((t) => t.id === section.type).label,
    moodLabel: sectionMood.label,
    moodAccent: sectionMood.accent,
    chords: tokens.map((t) => tokenToChord(t, keyIndex, scale)),
  };
}

/**
 * Generate a full song's chord progressions from a structure, genre, and mood.
 * Each section may override the mood via `section.moodId` (falls back to the overall mood).
 * @param {Array<{type: string, bars: number, moodId?: string}>} structure
 * @param {object} genre - an entry from GENRES
 * @param {object} mood - an entry from MOODS (used where a section has no moodId)
 * @param {number} keyIndex - 0-11, index into NOTE_NAMES
 * @param {object} [options]
 * @param {"major"|"minor"} [options.keyMode] - scale used to map scale degrees to pitches
 * @param {number} [options.bpm] - overrides the genre×mood tempo when set
 * @param {() => number} [rng] - random number generator, defaults to Math.random
 */
export function generateSong(structure, genre, mood, keyIndex, options = {}, rng = Math.random) {
  const { bpm } = options;
  const sections = structure.map((section) => generateSectionData(section, genre, mood, keyIndex, options, rng));
  const tempo = bpm ? Math.round(bpm) : Math.round(genre.tempo * mood.tempoMod);
  return { genreLabel: genre.label, moodLabel: mood.label, tempo, sections, keyIndex, keyMode: options.keyMode || "major" };
}
