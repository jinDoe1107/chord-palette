import { pick } from "./chordTheory.js";

/* Genre-appropriate "special" sections for the last third of the song. */
const SPECIAL_SECTIONS = {
  metal: ["solo", "breakdown"],
  metalcore: ["breakdown", "solo"],
  punk: ["solo", "c"],
  rock: ["solo", "bridge"],
  edm: ["breakdown", "c"],
  jazz: ["solo"],
  bossa: ["solo"],
  blues: ["solo"],
  lofi: ["inter", "breakdown"],
};
const DEFAULT_SPECIALS = ["c", "bridge", "solo"];

const sec = (type, bars) => ({ type, bars, moodId: null });

/**
 * Generate a randomized song structure targeting ~4 minutes at the given BPM.
 * In 4/4, bars = durationSec × bpm / 240, so a 4-minute song is about `bpm` bars.
 * Extends with whole verse blocks / final-chorus repeats so the order stays musical.
 * @param {object} genre - an entry from GENRES (used to pick genre-appropriate sections)
 * @param {number} bpm
 * @param {() => number} [rng]
 * @returns {Array<{type: string, bars: number, moodId: null}>}
 */
export function generateStructure(genre, bpm, rng = Math.random) {
  const targetBars = Math.round(bpm); // 4分 = 240秒 ÷ (240/bpm 秒/小節)
  const preType = rng() < 0.5 ? "b" : "prechorus";
  const special = pick(SPECIAL_SECTIONS[genre.id] || DEFAULT_SPECIALS, rng);

  const verseBlock = () => [sec("a", 8), sec(preType, pick([4, 8], rng)), sec("chorus", 8)];

  // 基本形: イントロ → 1番 → 間奏 → 2番 → 特殊セクション → ラスサビ → アウトロ
  const head = [sec("intro", pick([2, 4, 8], rng))];
  const middle = [...verseBlock(), sec("inter", pick([2, 4], rng)), ...verseBlock()];
  const tail = [sec(special, pick([4, 8], rng)), sec("chorus", 8), sec("outro", pick([2, 4], rng))];

  const total = () => [...head, ...middle, ...tail].reduce((sum, s) => sum + s.bars, 0);

  // 目標小節数まで音楽的な単位で拡張: 3番ブロック追加 or ラスサビ繰り返し（繰り返しは1回まで）
  let lastChorusRepeated = false;
  while (total() < targetBars - 6) {
    if (lastChorusRepeated || rng() < 0.6) {
      middle.push(sec("inter", pick([2, 4], rng)), ...verseBlock());
    } else {
      tail.splice(tail.length - 1, 0, sec("chorus", 8));
      lastChorusRepeated = true;
    }
  }

  const structure = [...head, ...middle, ...tail];

  // 超過分は前方の長いセクションから4小節ずつ縮める
  while (structure.reduce((sum, s) => sum + s.bars, 0) > targetBars + 6) {
    const i = structure.findIndex((s, j) => j > 0 && j < structure.length - 1 && s.bars > 4);
    if (i === -1) break;
    structure[i] = { ...structure[i], bars: structure[i].bars - 4 };
  }

  return structure;
}
