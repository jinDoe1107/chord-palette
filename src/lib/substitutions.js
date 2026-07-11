import { parseToken, pick } from "./chordTheory.js";

/* 置換ルール(データ)。文法上 sus4/dim/aug は扱えないため対象外。
   Tier1=同機能ダイアトニック / Tier2=セカンダリードミナント・モーダルインターチェンジ / Tier3=クロマチック */
export const SUB_RULES = [
  { tier: 1, mode: "major", kind: "swap", from: "I", to: ["vi", "iii"] },
  { tier: 1, mode: "major", kind: "swap", from: "vi", to: ["I"] },
  { tier: 1, mode: "major", kind: "swap", from: "IV", to: ["ii"] },
  { tier: 1, mode: "major", kind: "swap", from: "ii", to: ["IV"] },
  { tier: 1, mode: "major", kind: "swap", from: "iii", to: ["vi"] },
  { tier: 1, mode: "minor", kind: "swap", from: "i", to: ["VI"] },
  { tier: 1, mode: "minor", kind: "swap", from: "VI", to: ["i"] },
  { tier: 1, mode: "minor", kind: "swap", from: "iv", to: ["VI"] },
  // セカンダリードミナント: 対象コードの「前の小節」を丸ごと置換(挿入はしない=1小節1コード維持)
  { tier: 2, mode: "major", kind: "secondaryDominant", targets: { vi: "III7", ii: "VI7", V: "II7", IV: "I7", iii: "VII7" } },
  { tier: 2, mode: "minor", kind: "secondaryDominant", targets: { iv: "I7", V: "II7", VI: "III7", III: "VII7" } },
  { tier: 2, mode: "major", kind: "swap", from: "IV", to: ["iv"] },
  { tier: 2, mode: "major", kind: "swap", from: "V", to: ["bVII"] },
  { tier: 2, mode: "minor", kind: "swap", from: "iv", to: ["IV"] },
  { tier: 3, mode: "major", kind: "swap", from: "V7", to: ["bII7"] },
  { tier: 3, mode: "major", kind: "swap", from: "V", to: ["bII7"] },
  { tier: 3, mode: "major", kind: "swap", from: "vi", to: ["bVI"] },
  { tier: 3, mode: "minor", kind: "swap", from: "V7", to: ["bII7"] },
  { tier: 3, mode: "minor", kind: "swap", from: "iv", to: ["bII"] },
];

/* ムード×ジャンル → 置換確率と許可Tier */
const MOOD_SPICE = {
  bright: { prob: 0.15, maxTier: 1 }, happy: { prob: 0.15, maxTier: 1 },
  wistful: { prob: 0.2, maxTier: 2 }, emo: { prob: 0.25, maxTier: 2 },
  calm: { prob: 0.15, maxTier: 2 }, aggressive: { prob: 0.2, maxTier: 2 },
  dark: { prob: 0.25, maxTier: 2 }, epic: { prob: 0.2, maxTier: 2 },
  chic: { prob: 0.35, maxTier: 3 }, dreamy: { prob: 0.3, maxTier: 3 },
};
const JAZZY_GENRES = ["jazz", "bossa", "citypop", "lofi", "rnb"];
const HARD_GENRES = ["metal", "metalcore", "punk", "edm"];

export function getSpice(genreId, moodId) {
  const base = MOOD_SPICE[moodId] ?? { prob: 0.2, maxTier: 2 };
  let { prob, maxTier } = base;
  if (JAZZY_GENRES.includes(genreId)) { prob += 0.15; maxTier = 3; }
  else if (genreId === "blues") { prob -= 0.05; maxTier = Math.min(maxTier, 2); }
  else if (HARD_GENRES.includes(genreId)) prob -= 0.05;
  return { prob: Math.min(0.6, Math.max(0, prob)), maxTier };
}

/* トークンの和声機能 T/S/D。接続採点(generateProgression)で使用 */
export function tokenFunction(token, mode) {
  const p = parseToken(token);
  if (p.bassDegree === 4) return "D"; // IV/V などドミナントベースの分数はD帯
  if (p.flat) {
    const majorFlat = { 1: "D", 2: "T", 5: "S", 6: "D" }; // bII bIII bVI bVII
    const minorFlat = { 1: "S" }; // ナポリのbII
    return (mode === "minor" ? minorFlat : majorFlat)[p.degree] ?? "S";
  }
  return { 0: "T", 1: "S", 2: "T", 3: "S", 4: "D", 5: "T", 6: "D" }[p.degree];
}

/* セクション末尾のカデンツ保護幅 */
export function cadenceGuard(bars) {
  return bars >= 4 ? 2 : 1;
}

/**
 * 置換パス。左→右に1小節ずつ判定。決定的仕様(テストが依存):
 * - 候補列挙順 = SUB_RULES の配列順(swapは to の並び順で展開、secondaryDominantはその位置で追加)
 * - 候補が1つ以上あるとき rng() を1回だけ振り、< prob なら pick(candidates, rng)(=rng()もう1回)
 * - ガード帯(末尾 cadenceGuard 小節)は tier1 のみ許可
 * - 置換結果が直前小節(置換後)と同一なら見送り
 * - セカンダリードミナントを適用したら次の小節はロック(対象コードを保持)
 */
export function applySubstitutions(tokens, { mode, spice }, rng) {
  const out = [...tokens];
  const guardFrom = tokens.length - cadenceGuard(tokens.length);
  let lockNext = false;
  for (let b = 0; b < out.length; b++) {
    if (lockNext) { lockNext = false; continue; }
    const maxTier = b >= guardFrom ? 1 : spice.maxTier;
    const cur = out[b];
    const candidates = []; // { token, kind }
    for (const rule of SUB_RULES) {
      if (rule.mode !== mode || rule.tier > maxTier) continue;
      if (rule.kind === "swap") {
        if (rule.from === cur) rule.to.forEach((t) => candidates.push({ token: t, kind: "swap" }));
      } else {
        const next = out[b + 1];
        if (next == null || cur.includes("/") || cur.startsWith("b")) continue;
        if (next.includes("/") || next.startsWith("b")) continue;
        const target = rule.targets[next.replace(/M7$|7$/, "")];
        if (target && target !== cur) candidates.push({ token: target, kind: "secondaryDominant" });
      }
    }
    if (candidates.length === 0 || rng() >= spice.prob) continue;
    const chosen = pick(candidates, rng);
    if (chosen.token === out[b - 1]) continue;
    out[b] = chosen.token;
    if (chosen.kind === "secondaryDominant") lockNext = true;
  }
  return out;
}
