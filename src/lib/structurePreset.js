import { songDurationSeconds } from "./duration.js";
import { GENRE_FAMILY, FAMILY_RECIPES } from "../data/structureRecipes.js";

const FACTORS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const clampBars = (n) => Math.min(16, Math.max(2, Math.round(n / 2) * 2)); // 偶数・UI範囲内
const mk = ([type, bars]) => ({ type, bars, moodId: null });

const MIN_UNIT_REPEATS = 1;
const MAX_UNIT_REPEATS = 24; // 安全弁(極端なbpm/尺の組み合わせでも暴走しない)

const sumBars = (list) => list.reduce((sum, [, bars]) => sum + bars, 0);
const barsForSeconds = (seconds, bpm) => (seconds * bpm) / 240; // songDurationSecondsの逆関数

function expectedOptionBars(recipe, tempo) {
  return (recipe.options || []).reduce((sum, opt) => {
    if (opt.minTempo && tempo < opt.minTempo) return sum;
    return sum + opt.section[1] * opt.p;
  }, 0);
}

/* 目標尺から反復回数を逆算し、乱数で±1のばらつきを加える(毎回ランダムの一部) */
function unitCountFor(recipe, tempo, targetSeconds, rng) {
  const unitBars = sumBars(recipe.unit) + (recipe.connector ? recipe.connector[1] : 0);
  const fixedBars = sumBars(recipe.head) + sumBars(recipe.finale) + sumBars(recipe.tail)
    + expectedOptionBars(recipe, tempo);
  const desiredBars = barsForSeconds(targetSeconds, tempo);
  const raw = Math.round((desiredBars - fixedBars) / unitBars);
  const jitter = Math.round((rng() - 0.5) * 2); // -1 / 0 / +1
  return Math.min(MAX_UNIT_REPEATS, Math.max(MIN_UNIT_REPEATS, raw + jitter));
}

/* レシピと乱数から素の構成(スケール前)を組み立てる */
function assemble(recipe, tempo, targetSeconds, rng) {
  const out = [];
  recipe.head.forEach((s) => out.push(mk(s)));
  const units = unitCountFor(recipe, tempo, targetSeconds, rng);
  for (let i = 0; i < units; i++) {
    recipe.unit.forEach((s) => out.push(mk(s)));
    if (recipe.connector && i < units - 1) out.push(mk(recipe.connector));
  }
  (recipe.options || []).forEach((opt) => {
    if (opt.minTempo && tempo < opt.minTempo) return;
    if (rng() < opt.p) out.push(mk(opt.section));
  });
  recipe.finale.forEach((s) => out.push(mk(s)));
  recipe.tail.forEach((s) => out.push(mk(s)));
  return out;
}

/* 既存踏襲: targetに最も近づく係数で小節数を微調整(決定的) */
function scaleToTarget(sections, bpm, targetSeconds) {
  let best = null;
  for (const f of FACTORS) {
    const scaled = sections.map((s) => ({ ...s, bars: clampBars(s.bars * f) }));
    const total = scaled.reduce((sum, s) => sum + s.bars, 0);
    const diff = Math.abs(songDurationSeconds(total, bpm) - targetSeconds);
    if (!best || diff < best.diff) best = { scaled, diff };
  }
  return best.scaled;
}

/*
 * ジャンルと尺に応じた曲構成を生成する。rng が異なれば構成が変わる(毎回ランダム)。
 * @param {{bpm:number, genreId?:string, targetSeconds?:number, rng?:()=>number}} opts
 *   rng 未注入時は中央値固定で決定的にフォールバック(Math.randomは使わない)。
 */
export function buildStandardStructure({ bpm, genreId = "jpop", targetSeconds = 240, rng } = {}) {
  const r = rng || (() => 0.5);
  const recipe = FAMILY_RECIPES[GENRE_FAMILY[genreId] || "jpop"] || FAMILY_RECIPES.jpop;
  const raw = assemble(recipe, bpm, targetSeconds, r);
  return scaleToTarget(raw, bpm, targetSeconds);
}
