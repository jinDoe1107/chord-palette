export const NOTE_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
export const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
export const MINOR_SCALE = [0, 2, 3, 5, 7, 8, 10]; // natural minor (Aeolian)
export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

/* Moods: how to choose (tempo modifier, UI accent) */
export const MOODS = [
  { id: "bright", label: "明るい", accent: "#D98E2B", accentSoft: "#F7E8CF", tempoMod: 1.08, seventhMod: 0 },
  { id: "sad", label: "悲しい", accent: "#6C7FA6", accentSoft: "#E3E7F1", tempoMod: 0.82, seventhMod: 0.1 },
  { id: "wistful", label: "切ない", accent: "#5B6ECC", accentSoft: "#E1E5F8", tempoMod: 0.88, seventhMod: 0.05 },
  { id: "chic", label: "おしゃれ", accent: "#2E8F8C", accentSoft: "#DCEEED", tempoMod: 0.97, seventhMod: 0.35 },
  { id: "aggressive", label: "怒り", accent: "#C0392B", accentSoft: "#F4DCD8", tempoMod: 1.18, seventhMod: -0.1 },
  { id: "calm", label: "落ち着いた", accent: "#5E9C6F", accentSoft: "#E0EEE4", tempoMod: 0.78, seventhMod: 0.15 },
  { id: "emo", label: "エモい", accent: "#B84E92", accentSoft: "#F3DEEC", tempoMod: 1.12, seventhMod: 0.05 },
  { id: "dark", label: "ダーク", accent: "#5A4B8A", accentSoft: "#E4E0F0", tempoMod: 0.92, seventhMod: 0 },
  { id: "nostalgic", label: "懐かしい", accent: "#A1794E", accentSoft: "#F0E7DA", tempoMod: 0.9, seventhMod: 0.25 },
  { id: "speedy", label: "疾走感", accent: "#3E8FB0", accentSoft: "#DCEBF2", tempoMod: 1.25, seventhMod: -0.05 },
  { id: "romantic", label: "ロマンチック", accent: "#C46B8F", accentSoft: "#F5E1E9", tempoMod: 0.85, seventhMod: 0.3 },
  { id: "mysterious", label: "ミステリアス", accent: "#557080", accentSoft: "#DFE8EC", tempoMod: 0.9, seventhMod: 0.15 },
  { id: "hopeful", label: "前向き", accent: "#7A9E45", accentSoft: "#EAF0DA", tempoMod: 1.02, seventhMod: 0.05 },
];

/* Genres: id/label for selection UI, tempo for BPM suggestion. */
export const GENRES = [
  { id: "jpop", label: "J-POP", tempo: 122, seventh: 0.15 },
  { id: "citypop", label: "シティポップ", tempo: 102, seventh: 0.9 },
  { id: "kpop", label: "K-POP", tempo: 120, seventh: 0.2 },
  { id: "edm", label: "EDM", tempo: 126, seventh: 0.05 },
  { id: "dubstep", label: "ダブステップ", tempo: 140, seventh: 0 },
  { id: "futurebass", label: "フューチャーベース", tempo: 150, seventh: 0.7 },
  { id: "soul", label: "ソウル", tempo: 92, seventh: 0.85 },
  { id: "neosoul", label: "ネオソウル", tempo: 78, seventh: 1.0 },
  { id: "funk", label: "ファンク", tempo: 104, seventh: 0.9 },
  { id: "rnb", label: "R&B", tempo: 88, seventh: 0.95 },
  { id: "hiphop", label: "ヒップホップ", tempo: 92, seventh: 0.5 },
  { id: "lofi", label: "lo-fi hip hop", tempo: 78, seventh: 0.95 },
  { id: "bossa", label: "ボサノバ", tempo: 84, seventh: 1.0 },
  { id: "rock", label: "ロック", tempo: 142, seventh: 0.05 },
  { id: "punk", label: "パンク", tempo: 180, seventh: 0 },
  { id: "metal", label: "メタル", tempo: 158, seventh: 0 },
  { id: "metalcore", label: "メタルコア", tempo: 150, seventh: 0 },
  { id: "posthardcore", label: "ポストハードコア", tempo: 155, seventh: 0 },
  { id: "emo", label: "エモ", tempo: 138, seventh: 0.1 },
  { id: "folk", label: "フォーク", tempo: 96, seventh: 0.1 },
  { id: "country", label: "カントリー", tempo: 112, seventh: 0.1 },
  { id: "jazz", label: "ジャズ", tempo: 96, seventh: 1.0 },
  { id: "blues", label: "ブルース", tempo: 100, seventh: 1.0 },
  { id: "ballad", label: "バラード", tempo: 74, seventh: 0.35 },
  { id: "anison", label: "アニソン", tempo: 148, seventh: 0.2 },
];

/* Section types: id/label used by the manual structure editor & section picker. */
export const SECTION_TYPES = [
  { id: "intro", label: "イントロ" },
  { id: "a", label: "Aメロ" },
  { id: "b", label: "Bメロ" },
  { id: "prechorus", label: "プリコーラス" },
  { id: "chorus", label: "サビ" },
  { id: "c", label: "Cメロ" },
  { id: "bridge", label: "ブリッジ" },
  { id: "solo", label: "ソロ" },
  { id: "inter", label: "間奏" },
  { id: "breakdown", label: "ブレイクダウン" },
  { id: "outro", label: "アウトロ" },
];

/* コピーボタンの出力テキスト専用の英語セクション名(表示用ラベルは日本語のまま維持) */
export const SECTION_TYPE_LABELS_EN = {
  intro: "Intro",
  a: "Verse 1",
  b: "Verse 2",
  prechorus: "Pre-Chorus",
  chorus: "Chorus",
  c: "Verse 3",
  bridge: "Bridge",
  solo: "Solo",
  inter: "Interlude",
  breakdown: "Breakdown",
  outro: "Outro",
};

/* 「おまかせ曲構成」の目標尺: 1分〜8分を30秒刻みで指定 */
export const LENGTH_RANGE = { min: 60, max: 480, step: 30, default: 240 };
