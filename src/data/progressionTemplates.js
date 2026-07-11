/* コード進行テンプレートDB。
   tokens は chordTheory.js のローマ数字文法に完全準拠(テストで検証)。
   文法上 sus4/dim/aug/m7b5 は表現不可のため不使用。マイナーの ii も dim になるため不使用。
   マイナーはナチュラルマイナー度数(bなし)で書き、和声的短音階のドミナントは V7 で表す。 */

export const GENRE_FAMILIES = {
  jpop: ["pop"], anison: ["pop"], rock: ["rock", "pop"], ballad: ["soft", "pop"],
  citypop: ["jazzy", "soul"], edm: ["loop", "pop"], jazz: ["jazzy"],
  metal: ["heavy"], metalcore: ["heavy"], punk: ["rock", "loop"],
  lofi: ["jazzy", "soul"], rnb: ["soul"], blues: ["blues"], bossa: ["jazzy"],
};

/* SECTION_TYPES の id → 生成上の役割。musicData.js は変更しない */
export const SECTION_ROLES = {
  intro: "intro", a: "verse", b: "build", prechorus: "build", chorus: "chorus",
  c: "bridge", bridge: "bridge", solo: "inst", inter: "inst",
  breakdown: "break", outro: "outro",
};

export const PROGRESSION_TEMPLATES = [
  // ---- major ----
  { id: "royal-road", mode: "major", tokens: ["IVM7", "V7", "iii7", "vi"], genres: ["jpop", "anison"], tags: ["pop"], moods: ["wistful", "emo", "bright"], roles: ["chorus", "build"] },
  { id: "canon", mode: "major", tokens: ["I", "V", "vi", "iii", "IV", "I", "IV", "V"], tags: ["pop", "soft"], moods: ["calm", "bright", "wistful", "happy"], roles: ["verse", "chorus", "outro"] },
  { id: "komuro", mode: "major", tokens: ["vi", "IV", "V", "I"], genres: ["jpop", "edm", "anison"], tags: ["pop", "loop"], moods: ["emo", "wistful", "epic"], roles: ["chorus", "build"] },
  { id: "axis", mode: "major", tokens: ["I", "V", "vi", "IV"], genres: ["punk"], tags: ["pop", "rock", "loop"], moods: ["bright", "happy", "emo", "epic"], roles: ["chorus", "verse"] },
  { id: "axis-sad", mode: "major", tokens: ["vi", "IV", "I", "V"], tags: ["pop", "loop"], moods: ["wistful", "emo", "dreamy"], roles: ["verse", "chorus", "build"] },
  { id: "doo-wop", mode: "major", tokens: ["I", "vi", "IV", "V"], tags: ["pop", "soft"], moods: ["happy", "calm", "bright"], roles: ["verse", "intro", "outro"] },
  { id: "two-five-one", mode: "major", tokens: ["ii7", "V7", "IM7", "IM7"], genres: ["jazz", "bossa"], tags: ["jazzy"], moods: ["chic", "calm"], roles: ["intro", "outro", "inst", "verse"] },
  { id: "rhythm-turnaround", mode: "major", tokens: ["IM7", "vi7", "ii7", "V7"], genres: ["jazz"], tags: ["jazzy", "soul"], moods: ["chic", "happy"], roles: ["verse", "intro", "inst"] },
  { id: "just-the-two-of-us", mode: "major", tokens: ["IVM7", "III7", "vi7", "I7"], genres: ["citypop", "lofi", "rnb"], tags: ["jazzy", "soul"], moods: ["chic", "dreamy", "calm"], roles: ["verse", "chorus", "inst"] },
  { id: "citypop-lift", mode: "major", tokens: ["IM7", "vi7", "IVM7", "V7"], genres: ["citypop", "rnb"], tags: ["soul", "jazzy", "soft"], moods: ["chic", "dreamy", "calm"], roles: ["verse", "chorus", "intro"] },
  { id: "mixo-rock", mode: "major", tokens: ["I", "bVII", "IV", "I"], genres: ["rock", "metal"], tags: ["rock", "heavy"], moods: ["aggressive", "bright", "epic"], roles: ["chorus", "verse", "inst"] },
  { id: "hard-mixture", mode: "major", tokens: ["I", "bIII", "IV", "I"], tags: ["heavy", "rock"], moods: ["dark", "aggressive"], roles: ["verse", "inst", "break"] },
  { id: "blues-12", mode: "major", tokens: ["I7", "I7", "I7", "I7", "IV7", "IV7", "I7", "I7", "V7", "IV7", "I7", "V7"], genres: ["blues"], tags: ["blues"], moods: ["happy", "calm", "aggressive"], roles: ["verse", "chorus", "inst"] },
  { id: "blues-turnaround", mode: "major", tokens: ["I7", "IV7", "I7", "V7"], genres: ["blues"], tags: ["blues", "rock"], moods: ["happy", "aggressive"], roles: ["intro", "outro", "inst"] },
  { id: "descending-ballad", mode: "major", tokens: ["I", "V/vii", "vi", "I/V", "IV", "I/iii", "ii7", "V7"], genres: ["ballad"], tags: ["soft", "pop"], moods: ["wistful", "calm", "dreamy"], roles: ["verse", "build"] },
  { id: "ohdou-plain", mode: "major", tokens: ["IV", "V", "iii", "vi"], genres: ["jpop", "anison", "rock"], tags: ["pop", "rock"], moods: ["emo", "wistful", "epic"], roles: ["chorus", "build"] },
  { id: "prechorus-climb", mode: "major", tokens: ["ii7", "iii7", "IV", "V"], tags: ["pop", "soft", "soul"], moods: ["bright", "emo", "epic"], roles: ["build"] },
  { id: "vamp-two", mode: "major", tokens: ["IM7", "IVM7"], tags: ["soul", "jazzy", "soft", "loop"], moods: ["dreamy", "calm", "chic"], roles: ["intro", "inst", "verse"] },
  { id: "gospel-turn", mode: "major", tokens: ["IM7", "I7", "IVM7", "iv"], genres: ["rnb", "lofi"], tags: ["soul", "jazzy"], moods: ["chic", "dreamy", "wistful"], roles: ["verse", "build", "outro"] },
  { id: "epic-mixolydian", mode: "major", tokens: ["I", "V", "bVII", "IV"], tags: ["rock", "heavy", "pop"], moods: ["epic", "aggressive", "bright"], roles: ["chorus", "bridge", "inst"] },
  { id: "sunshine-loop", mode: "major", tokens: ["I", "IV", "V", "IV"], tags: ["pop", "loop", "rock"], moods: ["happy", "bright"], roles: ["verse", "chorus", "intro"] },
  { id: "plagal-out", mode: "major", tokens: ["IV", "V", "I", "I"], tags: ["pop", "rock", "soft", "loop", "jazzy", "soul", "heavy", "blues"], moods: [], roles: ["outro", "intro"] },
  { id: "mario-cadence", mode: "major", tokens: ["bVI", "bVII", "I", "I"], tags: ["rock", "heavy", "pop"], moods: ["epic", "dark", "bright"], roles: ["bridge", "break", "outro"] },
  { id: "neapolitan-chug", mode: "major", tokens: ["I", "I", "bII", "I"], genres: ["metal", "metalcore"], tags: ["heavy"], moods: ["aggressive", "dark"], roles: ["break", "inst"] },
  // ---- minor(ナチュラルマイナー度数 + 和声的短音階のドミナントは V7)----
  { id: "aeolian-anthem", mode: "minor", tokens: ["i", "VI", "III", "VII"], genres: ["edm", "anison"], tags: ["pop", "rock", "loop"], moods: ["emo", "dark", "wistful", "epic"], roles: ["chorus", "verse"] },
  { id: "aeolian-drive", mode: "minor", tokens: ["i", "VII", "VI", "VII"], genres: ["metal", "metalcore", "punk"], tags: ["rock", "heavy", "loop"], moods: ["aggressive", "dark", "epic"], roles: ["verse", "chorus", "inst"] },
  { id: "andalusian", mode: "minor", tokens: ["i", "VII", "VI", "V7"], tags: ["pop", "rock", "jazzy"], moods: ["dark", "epic", "wistful"], roles: ["build", "bridge", "verse"] },
  { id: "minor-lift", mode: "minor", tokens: ["VI", "VII", "i", "i"], tags: ["pop", "loop", "rock"], moods: ["epic", "emo", "dark"], roles: ["chorus", "bridge", "intro"] },
  { id: "minor-two-five", mode: "minor", tokens: ["iv7", "V7", "i7", "i7"], genres: ["jazz", "bossa"], tags: ["jazzy"], moods: ["chic", "dark", "calm"], roles: ["intro", "outro", "verse", "inst"] },
  { id: "lament-line", mode: "minor", tokens: ["i", "i/VII", "VI", "V7"], genres: ["ballad"], tags: ["soft", "pop"], moods: ["wistful", "dark", "epic", "calm"], roles: ["verse", "build"] },
  { id: "minor-cadence-push", mode: "minor", tokens: ["iv", "iv", "V7", "V7"], tags: ["pop", "soft", "rock", "heavy", "jazzy", "soul", "loop", "blues"], moods: [], roles: ["build"] },
  { id: "minor-sweep", mode: "minor", tokens: ["i", "iv", "VI", "V7"], tags: ["pop", "soft"], moods: ["epic", "wistful", "emo"], roles: ["chorus", "bridge"] },
  { id: "phrygian-chug", mode: "minor", tokens: ["i", "bII", "i", "VII"], genres: ["metal", "metalcore"], tags: ["heavy"], moods: ["aggressive", "dark"], roles: ["break", "inst", "verse"] },
  { id: "dark-soul-loop", mode: "minor", tokens: ["i7", "iv7", "i7", "V7"], genres: ["lofi", "rnb", "citypop"], tags: ["soul", "jazzy"], moods: ["dark", "chic", "dreamy", "calm"], roles: ["verse", "inst", "intro"] },
  { id: "minor-blues-12", mode: "minor", tokens: ["i7", "i7", "i7", "i7", "iv7", "iv7", "i7", "i7", "V7", "iv7", "i7", "V7"], genres: ["blues"], tags: ["blues"], moods: ["dark", "calm", "aggressive"], roles: ["verse", "inst", "chorus"] },
];
