/* コード進行テンプレートDB。
   tokens は chordTheory.js のローマ数字文法に完全準拠(テストで検証)。
   文法上 sus4/dim/aug/m7b5 は表現不可のため不使用。マイナーの ii も dim になるため不使用。
   マイナーはナチュラルマイナー度数(bなし)で書き、和声的短音階のドミナントは V7 で表す。 */

export const GENRE_FAMILIES = {
  jpop: ["pop"], anison: ["pop"], kpop: ["pop", "loop"],
  rock: ["rock", "pop"], punk: ["rock", "loop"], emo: ["rock", "pop"],
  ballad: ["soft", "pop"], folk: ["soft", "pop"], country: ["pop", "blues"],
  citypop: ["jazzy", "soul"], lofi: ["jazzy", "soul"],
  rnb: ["soul"], soul: ["soul", "jazzy"], neosoul: ["soul", "jazzy"],
  funk: ["soul", "loop"], hiphop: ["loop", "soul"],
  edm: ["loop", "pop"], dubstep: ["loop", "heavy"], futurebass: ["pop", "jazzy"],
  jazz: ["jazzy"], bossa: ["jazzy"], blues: ["blues"],
  metal: ["heavy"], metalcore: ["heavy"], posthardcore: ["heavy", "rock"],
};

/* SECTION_TYPES の id → 生成上の役割。musicData.js は変更しない */
export const SECTION_ROLES = {
  intro: "intro", a: "verse", b: "build", prechorus: "build", chorus: "chorus",
  c: "bridge", bridge: "bridge", solo: "inst", inter: "inst",
  breakdown: "break", outro: "outro",
};

export const PROGRESSION_TEMPLATES = [
  // ---- major ----
  { id: "royal-road", mode: "major", tokens: ["IVM7", "V7", "iii7", "vi"], genres: ["jpop", "anison", "futurebass"], tags: ["pop"], moods: ["wistful", "emo", "bright"], roles: ["chorus", "build"] },
  { id: "canon", mode: "major", tokens: ["I", "V", "vi", "iii", "IV", "I", "IV", "V"], tags: ["pop", "soft"], moods: ["calm", "bright", "wistful", "nostalgic", "hopeful"], roles: ["verse", "chorus", "outro"] },
  { id: "komuro", mode: "major", tokens: ["vi", "IV", "V", "I"], genres: ["jpop", "edm", "anison", "kpop"], tags: ["pop", "loop"], moods: ["emo", "wistful", "speedy"], roles: ["chorus", "build"] },
  { id: "axis", mode: "major", tokens: ["I", "V", "vi", "IV"], genres: ["punk", "emo"], tags: ["pop", "rock", "loop"], moods: ["bright", "emo", "hopeful", "speedy"], roles: ["chorus", "verse"] },
  { id: "axis-sad", mode: "major", tokens: ["vi", "IV", "I", "V"], tags: ["pop", "loop"], moods: ["wistful", "emo", "sad"], roles: ["verse", "chorus", "build"] },
  { id: "doo-wop", mode: "major", tokens: ["I", "vi", "IV", "V"], tags: ["pop", "soft"], moods: ["bright", "calm", "nostalgic"], roles: ["verse", "intro", "outro"] },
  { id: "two-five-one", mode: "major", tokens: ["ii7", "V7", "IM7", "IM7"], genres: ["jazz", "bossa"], tags: ["jazzy"], moods: ["chic", "calm"], roles: ["intro", "outro", "inst", "verse"] },
  { id: "rhythm-turnaround", mode: "major", tokens: ["IM7", "vi7", "ii7", "V7"], genres: ["jazz", "soul"], tags: ["jazzy", "soul"], moods: ["chic", "bright", "nostalgic"], roles: ["verse", "intro", "inst"] },
  { id: "just-the-two-of-us", mode: "major", tokens: ["IVM7", "III7", "vi7", "I7"], genres: ["citypop", "lofi", "rnb", "neosoul"], tags: ["jazzy", "soul"], moods: ["chic", "romantic", "calm"], roles: ["verse", "chorus", "inst"] },
  { id: "citypop-lift", mode: "major", tokens: ["IM7", "vi7", "IVM7", "V7"], genres: ["citypop", "rnb", "soul"], tags: ["soul", "jazzy", "soft"], moods: ["chic", "romantic", "nostalgic", "calm"], roles: ["verse", "chorus", "intro"] },
  { id: "mixo-rock", mode: "major", tokens: ["I", "bVII", "IV", "I"], genres: ["rock", "metal", "country"], tags: ["rock", "heavy"], moods: ["aggressive", "bright", "speedy"], roles: ["chorus", "verse", "inst"] },
  { id: "hard-mixture", mode: "major", tokens: ["I", "bIII", "IV", "I"], tags: ["heavy", "rock"], moods: ["dark", "aggressive", "mysterious"], roles: ["verse", "inst", "break"] },
  { id: "blues-12", mode: "major", tokens: ["I7", "I7", "I7", "I7", "IV7", "IV7", "I7", "I7", "V7", "IV7", "I7", "V7"], genres: ["blues"], tags: ["blues"], moods: ["bright", "calm", "aggressive", "nostalgic"], roles: ["verse", "chorus", "inst"] },
  { id: "blues-turnaround", mode: "major", tokens: ["I7", "IV7", "I7", "V7"], genres: ["blues", "country"], tags: ["blues", "rock"], moods: ["bright", "aggressive", "nostalgic"], roles: ["intro", "outro", "inst"] },
  { id: "descending-ballad", mode: "major", tokens: ["I", "V/vii", "vi", "I/V", "IV", "I/iii", "ii7", "V7"], genres: ["ballad", "folk"], tags: ["soft", "pop"], moods: ["wistful", "calm", "sad", "romantic"], roles: ["verse", "build"] },
  { id: "ohdou-plain", mode: "major", tokens: ["IV", "V", "iii", "vi"], genres: ["jpop", "anison", "rock"], tags: ["pop", "rock"], moods: ["emo", "wistful", "hopeful"], roles: ["chorus", "build"] },
  { id: "prechorus-climb", mode: "major", tokens: ["ii7", "iii7", "IV", "V"], tags: ["pop", "soft", "soul"], moods: ["bright", "emo", "hopeful"], roles: ["build"] },
  { id: "vamp-two", mode: "major", tokens: ["IM7", "IVM7"], tags: ["soul", "jazzy", "soft", "loop"], moods: ["romantic", "calm", "chic"], roles: ["intro", "inst", "verse"] },
  { id: "gospel-turn", mode: "major", tokens: ["IM7", "I7", "IVM7", "iv"], genres: ["rnb", "lofi", "soul", "neosoul"], tags: ["soul", "jazzy"], moods: ["chic", "romantic", "wistful", "nostalgic"], roles: ["verse", "build", "outro"] },
  { id: "epic-mixolydian", mode: "major", tokens: ["I", "V", "bVII", "IV"], tags: ["rock", "heavy", "pop"], moods: ["speedy", "aggressive", "bright", "hopeful"], roles: ["chorus", "bridge", "inst"] },
  { id: "sunshine-loop", mode: "major", tokens: ["I", "IV", "V", "IV"], tags: ["pop", "loop", "rock"], moods: ["bright", "hopeful", "speedy"], roles: ["verse", "chorus", "intro"] },
  { id: "plagal-out", mode: "major", tokens: ["IV", "V", "I", "I"], tags: ["pop", "rock", "soft", "loop", "jazzy", "soul", "heavy", "blues"], moods: [], roles: ["outro", "intro"] },
  { id: "mario-cadence", mode: "major", tokens: ["bVI", "bVII", "I", "I"], tags: ["rock", "heavy", "pop"], moods: ["dark", "bright", "hopeful"], roles: ["bridge", "break", "outro"] },
  { id: "neapolitan-chug", mode: "major", tokens: ["I", "I", "bII", "I"], genres: ["metal", "metalcore", "posthardcore"], tags: ["heavy"], moods: ["aggressive", "dark", "mysterious"], roles: ["break", "inst"] },
  // ---- minor(ナチュラルマイナー度数 + 和声的短音階のドミナントは V7)----
  { id: "aeolian-anthem", mode: "minor", tokens: ["i", "VI", "III", "VII"], genres: ["edm", "anison", "kpop", "futurebass"], tags: ["pop", "rock", "loop"], moods: ["emo", "dark", "wistful", "speedy"], roles: ["chorus", "verse"] },
  { id: "aeolian-drive", mode: "minor", tokens: ["i", "VII", "VI", "VII"], genres: ["metal", "metalcore", "punk", "posthardcore"], tags: ["rock", "heavy", "loop"], moods: ["aggressive", "dark", "speedy"], roles: ["verse", "chorus", "inst"] },
  { id: "andalusian", mode: "minor", tokens: ["i", "VII", "VI", "V7"], tags: ["pop", "rock", "jazzy"], moods: ["dark", "mysterious", "wistful"], roles: ["build", "bridge", "verse"] },
  { id: "minor-lift", mode: "minor", tokens: ["VI", "VII", "i", "i"], tags: ["pop", "loop", "rock"], moods: ["emo", "dark", "hopeful"], roles: ["chorus", "bridge", "intro"] },
  { id: "minor-two-five", mode: "minor", tokens: ["iv7", "V7", "i7", "i7"], genres: ["jazz", "bossa"], tags: ["jazzy"], moods: ["chic", "dark", "calm", "mysterious", "nostalgic"], roles: ["intro", "outro", "verse", "inst"] },
  { id: "lament-line", mode: "minor", tokens: ["i", "i/VII", "VI", "V7"], genres: ["ballad", "folk"], tags: ["soft", "pop"], moods: ["wistful", "dark", "sad", "calm"], roles: ["verse", "build"] },
  { id: "minor-cadence-push", mode: "minor", tokens: ["iv", "iv", "V7", "V7"], tags: ["pop", "soft", "rock", "heavy", "jazzy", "soul", "loop", "blues"], moods: [], roles: ["build"] },
  { id: "minor-sweep", mode: "minor", tokens: ["i", "iv", "VI", "V7"], tags: ["pop", "soft"], moods: ["wistful", "emo", "sad"], roles: ["chorus", "bridge"] },
  { id: "phrygian-chug", mode: "minor", tokens: ["i", "bII", "i", "VII"], genres: ["metal", "metalcore", "posthardcore", "dubstep"], tags: ["heavy"], moods: ["aggressive", "dark", "mysterious"], roles: ["break", "inst", "verse"] },
  { id: "dark-soul-loop", mode: "minor", tokens: ["i7", "iv7", "i7", "V7"], genres: ["lofi", "rnb", "citypop", "hiphop", "neosoul"], tags: ["soul", "jazzy"], moods: ["dark", "chic", "romantic", "calm"], roles: ["verse", "inst", "intro"] },
  { id: "minor-blues-12", mode: "minor", tokens: ["i7", "i7", "i7", "i7", "iv7", "iv7", "i7", "i7", "V7", "iv7", "i7", "V7"], genres: ["blues"], tags: ["blues"], moods: ["dark", "calm", "aggressive", "sad"], roles: ["verse", "inst", "chorus"] },
];
