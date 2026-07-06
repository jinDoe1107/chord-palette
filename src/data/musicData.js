export const NOTE_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
export const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
export const MINOR_SCALE = [0, 2, 3, 5, 7, 8, 10]; // natural minor (Aeolian)
export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

/* Moods: how to choose (filter tags, tempo & 7th modifiers, UI accent) */
export const MOODS = [
  { id: "bright", label: "明るい", accent: "#D98E2B", accentSoft: "#F7E8CF", tempoMod: 1.08, seventhMod: 0 },
  { id: "wistful", label: "切ない", accent: "#5B6ECC", accentSoft: "#E1E5F8", tempoMod: 0.88, seventhMod: 0.05 },
  { id: "chic", label: "おしゃれ", accent: "#2E8F8C", accentSoft: "#DCEEED", tempoMod: 0.97, seventhMod: 0.35 },
  { id: "emo", label: "エモい", accent: "#B84E92", accentSoft: "#F3DEEC", tempoMod: 1.12, seventhMod: 0.05 },
  { id: "calm", label: "落ち着いた", accent: "#5E9C6F", accentSoft: "#E0EEE4", tempoMod: 0.78, seventhMod: 0.15 },
  { id: "aggressive", label: "アグレッシブ", accent: "#C0392B", accentSoft: "#F4DCD8", tempoMod: 1.18, seventhMod: -0.1 },
  { id: "dark", label: "ダーク", accent: "#5A4B8A", accentSoft: "#E4E0F0", tempoMod: 0.92, seventhMod: 0 },
  { id: "happy", label: "ハッピー", accent: "#E2634E", accentSoft: "#F9E2DC", tempoMod: 1.1, seventhMod: 0 },
  { id: "dreamy", label: "ドリーミー", accent: "#8A7FD6", accentSoft: "#EAE7F9", tempoMod: 0.82, seventhMod: 0.3 },
  { id: "epic", label: "エピック", accent: "#3A6EA8", accentSoft: "#DDE8F4", tempoMod: 1.05, seventhMod: 0.05 },
];

/* Genres: the harmonic vocabulary (pools), base tempo, base 7th rate.
   Each progression unit is tagged with the moods it fits. */
export const GENRES = [
  {
    id: "jpop", label: "J-POP", tempo: 122, seventh: 0.15,
    pools: {
      chorus: [
        { p: ["I", "V", "vi", "IV"], moods: ["bright", "emo", "happy", "epic"] },
        { p: ["IV", "V", "iii", "vi"], moods: ["wistful", "emo", "calm", "epic"] },
        { p: ["vi", "IV", "V", "I"], moods: ["wistful", "emo", "aggressive", "epic"] },
        { p: ["IV", "V", "I", "vi"], moods: ["bright", "happy"] },
        { p: ["IVM7", "V7", "iii7", "vi7"], moods: ["chic", "dreamy"] },
      ],
      verse: [
        { p: ["I", "IV", "I", "V"], moods: ["bright", "calm", "happy"] },
        { p: ["vi", "IV", "I", "V"], moods: ["wistful", "emo", "epic"] },
        { p: ["I", "vi", "IV", "V"], moods: ["bright", "chic", "happy"] },
        { p: ["IM7", "vi7", "ii7", "V7"], moods: ["chic", "calm", "dreamy"] },
      ],
      bridge: [
        { p: ["ii", "iii", "IV", "V"], moods: ["bright", "emo", "wistful", "epic", "happy"] },
        { p: ["IV", "iii", "ii", "V"], moods: ["wistful", "calm", "dreamy"] },
        { p: ["ii7", "V7", "iii7", "vi7"], moods: ["chic", "dreamy"] },
      ],
    },
  },
  {
    id: "rock", label: "ロック", tempo: 142, seventh: 0.05,
    pools: {
      chorus: [
        { p: ["I", "bVII", "IV", "I"], moods: ["bright", "emo", "aggressive", "happy"] },
        { p: ["vi", "IV", "I", "V"], moods: ["emo", "wistful", "aggressive", "epic"] },
        { p: ["I", "V", "IV", "IV"], moods: ["bright", "calm", "happy"] },
        { p: ["I", "bIII", "IV", "I"], moods: ["emo", "wistful", "chic", "dark", "aggressive"] },
      ],
      verse: [
        { p: ["I", "I", "IV", "IV"], moods: ["bright", "calm", "happy"] },
        { p: ["vi", "vi", "IV", "V"], moods: ["wistful", "emo", "dark", "epic"] },
        { p: ["I", "bVII", "I", "bVII"], moods: ["bright", "emo", "chic", "aggressive"] },
      ],
      bridge: [
        { p: ["IV", "IV", "V", "V"], moods: ["bright", "calm", "chic", "epic", "happy"] },
        { p: ["vi", "IV", "V", "V"], moods: ["emo", "wistful", "aggressive", "epic"] },
        { p: ["bVI", "bVII", "I", "I"], moods: ["emo", "epic", "aggressive", "bright"] },
      ],
    },
  },
  {
    id: "ballad", label: "バラード", tempo: 74, seventh: 0.35,
    pools: {
      chorus: [
        { p: ["I", "V", "vi", "iii", "IV", "I", "IV", "V"], moods: ["wistful", "calm", "bright", "epic"] }, // カノン進行
        { p: ["IV", "V", "iii", "vi"], moods: ["wistful", "emo", "epic"] },
        { p: ["vi", "IV", "I", "V"], moods: ["wistful", "emo", "epic"] },
        { p: ["IM7", "IVM7", "V7", "IM7"], moods: ["calm", "chic", "bright", "dreamy", "happy"] },
      ],
      verse: [
        { p: ["I", "iii", "IV", "V"], moods: ["bright", "calm", "wistful", "happy"] },
        { p: ["I", "V", "vi", "IV"], moods: ["wistful", "emo", "bright", "epic"] },
        { p: ["IM7", "iii7", "IVM7", "V7"], moods: ["chic", "calm", "dreamy"] },
      ],
      bridge: [
        { p: ["IV", "iii", "ii", "V"], moods: ["wistful", "calm", "bright", "chic", "dreamy"] },
        { p: ["IV", "iv", "iii", "vi"], moods: ["emo", "wistful", "dark"] }, // 借用iv
        { p: ["vi", "ii", "IV", "V"], moods: ["wistful", "calm", "epic", "bright"] },
      ],
    },
  },
  {
    id: "citypop", label: "シティポップ", tempo: 102, seventh: 0.9,
    pools: {
      chorus: [
        { p: ["IVM7", "III7", "vi7", "V7"], moods: ["chic", "wistful", "emo", "dreamy"] }, // III7 = セカンダリードミナント
        { p: ["IVM7", "V7", "iii7", "vi7"], moods: ["chic", "bright", "calm", "dreamy", "happy"] },
        { p: ["IM7", "IVM7", "iii7", "vi7"], moods: ["calm", "bright", "dreamy", "happy"] },
      ],
      verse: [
        { p: ["IM7", "vi7", "ii7", "V7"], moods: ["chic", "calm", "bright", "dreamy", "happy"] },
        { p: ["iii7", "vi7", "ii7", "V7"], moods: ["chic", "wistful", "emo", "dark", "dreamy"] },
        { p: ["IVM7", "iii7", "ii7", "V7"], moods: ["chic", "calm", "dreamy", "bright", "happy"] },
      ],
      bridge: [
        { p: ["ii7", "V7", "IM7", "vi7"], moods: ["chic", "bright", "calm", "dreamy", "happy"] },
        { p: ["IVM7", "iii7", "vi7", "V7"], moods: ["wistful", "emo", "chic", "dreamy", "dark"] },
        { p: ["iii7", "VI7", "ii7", "V7"], moods: ["chic", "emo", "wistful", "dark"] },
      ],
    },
  },
  {
    id: "edm", label: "EDM", tempo: 126, seventh: 0.05,
    pools: {
      chorus: [
        { p: ["vi", "IV", "I", "V"], moods: ["emo", "wistful", "aggressive", "epic"] },
        { p: ["I", "V", "vi", "IV"], moods: ["bright", "emo", "happy", "epic"] },
        { p: ["IV", "V", "vi", "vi"], moods: ["wistful", "emo", "chic", "dark"] },
        { p: ["I", "IV", "vi", "V"], moods: ["bright", "calm", "chic", "happy"] },
      ],
      verse: [
        { p: ["vi", "vi", "IV", "IV"], moods: ["wistful", "emo", "chic", "dreamy", "dark", "aggressive"] },
        { p: ["I", "I", "IV", "IV"], moods: ["bright", "calm", "happy", "dreamy"] },
        { p: ["IV", "IV", "vi", "vi"], moods: ["wistful", "chic", "dreamy", "dark", "emo"] },
      ],
      bridge: [
        { p: ["IV", "V", "vi", "V"], moods: ["emo", "wistful", "bright", "chic", "calm", "aggressive", "dark", "happy", "dreamy", "epic"] },
        { p: ["vi", "IV", "I", "I"], moods: ["emo", "wistful", "epic", "calm"] },
        { p: ["IV", "IV", "vi", "V"], moods: ["bright", "happy", "aggressive", "chic", "dreamy"] },
      ],
    },
  },
  {
    id: "jazz", label: "ジャズ", tempo: 96, seventh: 1.0,
    pools: {
      chorus: [
        { p: ["ii7", "V7", "IM7", "IM7"], moods: ["bright", "calm", "chic", "happy", "dreamy"] },
        { p: ["IM7", "vi7", "ii7", "V7"], moods: ["bright", "calm", "dreamy"] },
        { p: ["iii7", "VI7", "ii7", "V7"], moods: ["chic", "wistful", "emo", "dark"] }, // VI7 = セカンダリードミナント
      ],
      verse: [
        { p: ["IM7", "vi7", "ii7", "V7"], moods: ["bright", "calm", "chic", "dreamy", "happy"] },
        { p: ["ii7", "V7", "iii7", "VI7"], moods: ["chic", "emo", "wistful", "dark"] },
        { p: ["iii7", "vi7", "ii7", "V7"], moods: ["chic", "wistful", "dark", "dreamy"] },
      ],
      bridge: [
        { p: ["IVM7", "bVII7", "IM7", "IM7"], moods: ["chic", "calm", "bright", "dreamy"] }, // バックドア
        { p: ["ii7", "V7", "iii7", "vi7"], moods: ["wistful", "emo", "chic", "dark"] },
        { p: ["IM7", "VI7", "ii7", "V7"], moods: ["bright", "calm", "chic", "happy"] },
      ],
    },
  },
  {
    id: "metal", label: "メタル", tempo: 158, seventh: 0,
    pools: {
      chorus: [
        { p: ["i", "bVI", "bVII", "i"], moods: ["emo", "bright", "aggressive", "epic", "dark"] },
        { p: ["i", "bVII", "bVI", "bVII"], moods: ["emo", "wistful", "aggressive", "dark"] },
        { p: ["i", "bVI", "bIII", "bVII"], moods: ["bright", "emo", "calm", "epic", "aggressive"] },
        { p: ["i", "bII", "i", "bII"], moods: ["emo", "chic", "dark", "aggressive"] }, // フリジアン
      ],
      verse: [
        { p: ["i", "i", "bVI", "bVII"], moods: ["emo", "bright", "calm", "aggressive", "epic"] },
        { p: ["i", "bIII", "bVII", "i"], moods: ["wistful", "emo", "dark", "aggressive"] },
        { p: ["i", "i", "bII", "i"], moods: ["chic", "emo", "wistful", "dark", "aggressive"] },
      ],
      bridge: [
        { p: ["bVI", "bVII", "i", "i"], moods: ["emo", "wistful", "bright", "epic", "aggressive"] },
        { p: ["iv", "bVI", "V", "V"], moods: ["wistful", "calm", "chic", "dark"] }, // ハーモニックマイナー的なV
        { p: ["i", "bVII", "bVI", "V"], moods: ["emo", "aggressive", "dark", "epic"] },
      ],
    },
  },
  {
    id: "metalcore", label: "メタルコア", tempo: 150, seventh: 0,
    pools: {
      chorus: [
        { p: ["i", "bVI", "bIII", "bVII"], moods: ["emo", "wistful", "bright", "epic", "aggressive"] }, // メロディックな開けたサビ
        { p: ["bVI", "bVII", "i", "i"], moods: ["emo", "wistful", "epic", "dark", "aggressive"] },
        { p: ["i", "bVII", "bVI", "V"], moods: ["emo", "chic", "calm", "aggressive", "dark"] },
      ],
      verse: [
        { p: ["i", "i", "i", "bII"], moods: ["emo", "chic", "aggressive", "dark"] }, // チャグ+フリジアン
        { p: ["i", "bII", "bIII", "bII"], moods: ["emo", "wistful", "dark", "aggressive"] },
        { p: ["i", "i", "bVI", "bVI"], moods: ["wistful", "calm", "bright", "dark"] },
      ],
      bridge: [
        { p: ["i", "i", "bII", "bII"], moods: ["emo", "chic", "wistful", "aggressive", "dark"] }, // ブレイクダウン
        { p: ["i", "bVI", "i", "bII"], moods: ["bright", "calm", "emo", "dark", "aggressive"] },
        { p: ["bVI", "bVI", "i", "i"], moods: ["dark", "emo", "wistful", "calm"] },
      ],
    },
  },
  {
    id: "punk", label: "パンク", tempo: 180, seventh: 0,
    pools: {
      chorus: [
        { p: ["I", "IV", "V", "V"], moods: ["bright", "aggressive", "happy"] },
        { p: ["I", "V", "vi", "IV"], moods: ["bright", "emo", "happy", "epic"] },
        { p: ["vi", "IV", "I", "V"], moods: ["emo", "wistful", "aggressive", "epic"] },
        { p: ["I", "IV", "I", "V"], moods: ["bright", "calm", "chic", "happy"] },
      ],
      verse: [
        { p: ["I", "I", "IV", "V"], moods: ["bright", "calm", "happy", "aggressive"] },
        { p: ["I", "bVII", "IV", "I"], moods: ["emo", "chic", "bright", "aggressive"] },
        { p: ["I", "V", "I", "V"], moods: ["bright", "emo", "wistful", "aggressive", "happy"] },
      ],
      bridge: [
        { p: ["IV", "IV", "I", "I"], moods: ["bright", "calm", "chic", "happy"] },
        { p: ["IV", "V", "vi", "V"], moods: ["emo", "wistful", "aggressive", "epic"] },
        { p: ["vi", "vi", "IV", "V"], moods: ["emo", "wistful", "aggressive", "dark"] },
      ],
    },
  },
  {
    id: "lofi", label: "lo-fi hip hop", tempo: 78, seventh: 0.95,
    pools: {
      chorus: [
        { p: ["ii7", "V7", "IM7", "vi7"], moods: ["chic", "calm", "dreamy"] },
        { p: ["IVM7", "iii7", "ii7", "IM7"], moods: ["calm", "chic", "bright", "dreamy", "happy"] },
        { p: ["iii7", "vi7", "ii7", "V7"], moods: ["wistful", "chic", "emo", "dark", "dreamy"] },
      ],
      verse: [
        { p: ["IM7", "vi7", "IVM7", "V7"], moods: ["calm", "bright", "wistful", "dreamy", "happy"] },
        { p: ["IM7", "iii7", "vi7", "ii7"], moods: ["chic", "calm", "emo", "dreamy", "dark"] },
        { p: ["ii7", "V7", "iii7", "vi7"], moods: ["chic", "wistful", "dreamy", "dark"] },
      ],
      bridge: [
        { p: ["IVM7", "iii7", "vi7", "V7"], moods: ["wistful", "emo", "chic", "dreamy", "dark"] },
        { p: ["ii7", "iii7", "IVM7", "V7"], moods: ["calm", "bright", "chic", "dreamy", "happy"] },
        { p: ["vi7", "ii7", "IVM7", "V7"], moods: ["calm", "chic", "dreamy", "emo", "happy"] },
      ],
    },
  },
  {
    id: "rnb", label: "R&B", tempo: 88, seventh: 0.95,
    pools: {
      chorus: [
        { p: ["vi7", "ii7", "V7", "IM7"], moods: ["chic", "calm", "dreamy"] },
        { p: ["IVM7", "iii7", "vi7", "ii7"], moods: ["wistful", "chic", "emo", "dreamy", "dark"] },
        { p: ["IM7", "III7", "vi7", "V7"], moods: ["emo", "chic", "bright", "happy"] }, // III7 = セカンダリードミナント
      ],
      verse: [
        { p: ["IM7", "vi7", "IVM7", "iii7"], moods: ["calm", "bright", "wistful", "dreamy", "happy"] },
        { p: ["ii7", "iii7", "IVM7", "iii7"], moods: ["chic", "calm", "emo", "dreamy"] },
        { p: ["IVM7", "iii7", "ii7", "V7"], moods: ["chic", "calm", "dreamy", "bright", "happy"] },
      ],
      bridge: [
        { p: ["IVM7", "V7", "iii7", "vi7"], moods: ["wistful", "emo", "bright", "dreamy", "epic"] },
        { p: ["ii7", "V7", "IM7", "VI7"], moods: ["chic", "calm", "dreamy", "happy"] }, // VI7 = セカンダリードミナント
        { p: ["iii7", "VI7", "ii7", "V7"], moods: ["emo", "chic", "dark", "dreamy"] },
      ],
    },
  },
  {
    id: "blues", label: "ブルース", tempo: 100, seventh: 1.0,
    pools: {
      chorus: [
        { p: ["I7", "IV7", "I7", "V7"], moods: ["bright", "emo", "chic", "happy", "aggressive"] },
        { p: ["I7", "IV7", "I7", "I7"], moods: ["calm", "bright", "happy"] },
        { p: ["V7", "IV7", "I7", "V7"], moods: ["emo", "wistful", "chic", "aggressive", "dark"] }, // ターンアラウンド
      ],
      verse: [
        { p: ["I7", "I7", "I7", "I7"], moods: ["calm", "chic", "happy"] }, // 静的シャッフル
        { p: ["I7", "IV7", "I7", "I7"], moods: ["bright", "emo", "wistful", "happy", "aggressive"] },
        { p: ["I7", "I7", "IV7", "IV7"], moods: ["bright", "calm", "happy", "aggressive"] },
      ],
      bridge: [
        { p: ["IV7", "IV7", "I7", "I7"], moods: ["bright", "calm", "chic", "happy"] },
        { p: ["V7", "IV7", "I7", "I7"], moods: ["emo", "wistful", "aggressive", "dark"] },
        { p: ["I7", "V7", "IV7", "I7"], moods: ["bright", "emo", "chic", "happy", "aggressive"] },
      ],
    },
  },
  {
    id: "bossa", label: "ボサノバ", tempo: 84, seventh: 1.0,
    pools: {
      chorus: [
        { p: ["IM7", "II7", "ii7", "V7"], moods: ["chic", "bright", "happy", "dreamy"] }, // II7 = イパネマ風
        { p: ["IM7", "ii7", "V7", "IM7"], moods: ["calm", "bright", "dreamy", "happy"] },
        { p: ["ii7", "V7", "IM7", "VI7"], moods: ["chic", "wistful", "emo", "dreamy"] },
      ],
      verse: [
        { p: ["IM7", "IM7", "ii7", "V7"], moods: ["calm", "bright", "chic", "dreamy", "happy"] },
        { p: ["iii7", "VI7", "ii7", "V7"], moods: ["wistful", "emo", "chic", "dark", "dreamy"] },
        { p: ["IM7", "vi7", "ii7", "V7"], moods: ["calm", "bright", "chic", "dreamy", "happy"] },
      ],
      bridge: [
        { p: ["IVM7", "bVII7", "IM7", "VI7"], moods: ["chic", "calm", "bright", "dreamy"] }, // バックドア
        { p: ["ii7", "V7", "iii7", "vi7"], moods: ["wistful", "emo", "dark", "dreamy"] },
        { p: ["ii7", "bII7", "IM7", "IM7"], moods: ["chic", "dreamy", "calm", "wistful"] }, // トライトーン代理
      ],
    },
  },
  {
    id: "anison", label: "アニソン", tempo: 148, seventh: 0.2,
    pools: {
      chorus: [
        { p: ["IV", "V", "iii", "vi"], moods: ["emo", "wistful", "epic"] }, // 王道進行
        { p: ["vi", "IV", "V", "I"], moods: ["emo", "bright", "aggressive", "epic"] }, // 小室進行
        { p: ["I", "V", "vi", "IV"], moods: ["bright", "calm", "happy", "epic"] },
        { p: ["IV", "V", "vi", "I"], moods: ["bright", "chic", "wistful", "happy"] },
      ],
      verse: [
        { p: ["I", "V", "vi", "iii"], moods: ["wistful", "calm", "chic", "epic"] },
        { p: ["vi", "IV", "I", "V"], moods: ["emo", "wistful", "aggressive", "epic"] },
        { p: ["I", "IV", "V", "I"], moods: ["bright", "calm", "happy"] },
      ],
      bridge: [
        { p: ["ii", "iii", "IV", "V"], moods: ["bright", "emo", "wistful", "chic", "epic", "happy"] },
        { p: ["bVI", "bVII", "I", "I"], moods: ["emo", "bright", "calm", "epic", "aggressive"] }, // 半音上昇の高揚感
        { p: ["IV", "V", "iii", "VI7"], moods: ["emo", "wistful", "epic", "chic"] }, // 王道進行×セカンダリードミナント
      ],
    },
  },
];

/* Section types. `end` forces the section's final bar to that token
   (V7 = push into the chorus, I = final resolution). */
export const SECTION_TYPES = [
  { id: "intro", label: "イントロ", role: "chorus" },
  { id: "a", label: "Aメロ", role: "verse" },
  { id: "b", label: "Bメロ", role: "bridge", end: "V7" },
  { id: "prechorus", label: "プレコーラス", role: "bridge", end: "V7" },
  { id: "chorus", label: "サビ", role: "chorus" },
  { id: "c", label: "Cメロ", role: "bridge" },
  { id: "bridge", label: "ブリッジ", role: "bridge" },
  { id: "solo", label: "ソロ", role: "chorus" },
  { id: "inter", label: "間奏", role: "verse" },
  { id: "breakdown", label: "ブレイクダウン", role: "verse" },
  { id: "outro", label: "アウトロ", role: "chorus", end: "I" },
];

export const DEFAULT_STRUCTURE = [
  { type: "intro", bars: 2 },
  { type: "a", bars: 8 },
  { type: "b", bars: 8 },
  { type: "chorus", bars: 8 },
];
