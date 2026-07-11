import { songDurationSeconds } from "./duration.js";

/* 標準形(bpm<140)と速い曲用(bpm>=140: ソロ+ラスサビ追加)。値は基準小節数 */
const BASE_STANDARD = [
  ["intro", 4], ["a", 8], ["b", 8], ["chorus", 8], ["inter", 4],
  ["a", 8], ["b", 8], ["chorus", 8], ["c", 8], ["chorus", 8], ["outro", 4],
];
const BASE_FAST = [
  ["intro", 4], ["a", 8], ["b", 8], ["chorus", 8], ["inter", 4],
  ["a", 8], ["b", 8], ["chorus", 8], ["solo", 8], ["c", 8], ["chorus", 8], ["chorus", 8], ["outro", 4],
];
const FACTORS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const clampBars = (n) => Math.min(16, Math.max(2, Math.round(n / 2) * 2)); // 偶数・UI範囲内

/* 現在のBPMで約 targetSeconds(既定4分)になる構成を返す。rng不使用=決定的 */
export function buildStandardStructure(bpm, targetSeconds = 240) {
  const base = bpm >= 140 ? BASE_FAST : BASE_STANDARD;
  let best = null;
  for (const f of FACTORS) {
    const sections = base.map(([type, bars]) => ({ type, bars: clampBars(bars * f), moodId: null }));
    const total = sections.reduce((sum, s) => sum + s.bars, 0);
    const diff = Math.abs(songDurationSeconds(total, bpm) - targetSeconds);
    if (!best || diff < best.diff) best = { sections, diff };
  }
  return best.sections;
}
