# コード進行生成エンジン実装プラン(テンプレート+置換方式)— 実行手順書

実装担当への指示書。**このファイルの情報だけで実装を完遂できる**ように、コード・データ・テストケースを全て記載している。コードブロックは設計済みの完成形なので原則そのまま使用し、逸脱する場合は各節の「意図」を守ること。

## 0. 背景と決定事項

- アプリの中核機能「ジャンル×ムードからのコード進行自動生成」が完全未実装。[src/App.jsx](src/App.jsx) に空スタブ4つ: `generate`(L53) / `makeStructure`(L55) / `addSection`(L69) / `regenerateSection`(L79)
- **方式**: テンプレート+置換(ユーザー合意済み)。ローマ数字トークンのテンプレをタグと接続で選択し、音楽理論ルールでランダム置換
- **拡張性要件**: 将来 Transformers.js(ONNX)の LM エンジンを追加するため、エンジンを非同期対応インターフェースで抽象化する
- **メジャー/マイナー両対応**、1小節1コード維持、**依存ライブラリ追加禁止**、**Math.random 使用禁止**(rng注入で決定的に)
- 音声再生(usePlayback)・sus4/dim/aug 対応・LMエンジン実装自体は**スコープ外**
- 注: usePlayback.js は正常(過去の「破損」報告は誤り)。**触らないこと**

### 既存APIの前提知識(変更禁止、そのまま使う)

`src/lib/chordTheory.js`:
- トークン文法: `^(b)?(I..VII|i..vii)(M7|7)?(/(b)?(数字))?$`。大文字=メジャー、小文字=マイナー、`b`=フラット借用、`/`=分数。例: `IV`, `vi7`, `bVII`, `V7`, `IVM7`, `IV/V`
- `parseToken(token)` → `{degree(0-6), flat, minor, ext, bassDegree, bassFlat}`(不正トークンは degree:0 に静かにフォールバックする点に注意)
- `tokenToChord(token, keyIndex, scale)` → `{name, degreeLabel, rootPc, minor, ext, bassPc}`。scale は `MAJOR_SCALE` か `MINOR_SCALE`
- `maybeAddSeventh(token, prob, rng)` → ext/flat/スラッシュ付きはスキップ。minor→`7`、V→`7`、他→`M7` を確率probで付加
- `pick(arr, rng)` → `arr[Math.floor(rng() * arr.length)]`

`src/data/musicData.js`: `NOTE_NAMES`, `MAJOR_SCALE`, `MINOR_SCALE`(ナチュラルマイナー), `MOODS`(10種 `{id,label,accent,accentSoft,tempoMod,seventhMod}`), `GENRES`(14種 `{id,label,tempo,seventh}`), `SECTION_TYPES`(11種 `{id,label}`)

`App.jsx` の状態: `structure: [{type, bars, moodId}]`(入力プラン)と `song`(生成結果)は別物。song の形:
```js
{ genreLabel, moodLabel, tempo, keyIndex, keyMode,
  sections: [{ type, bars, moodId, moodAccent, label, tokens /*新設*/, chords: [chordObj×bars] }] }
```
LeadSheet.jsx が消費するフィールド: `label`, `moodAccent`(null可・ランプ色), `moodId`, `bars`, `chords[].name/.degreeLabel/.octave`。`onAddSection(newType, newBars)` と**引数付き**で呼ばれる(LeadSheet.jsx:172)。bars のUI範囲は **1〜16**。

### マイナーキーのトークン規約(重要)

マイナーは `MINOR_SCALE`(ナチュラルマイナー)経由で変換されるため、**度数はナチュラルマイナー基準で b を付けない**: Am なら `i VI III VII` = Am F C G。和声的短音階のドミナントは `V7`(Am なら E7 に正しく変換される)。`ii`(本来ディミニッシュ)は文法で表現できないため**マイナーでは使わない**(`ii–V–i` の代わりに `iv7–V7–i`)。

### 環境・検証コマンド

node v18.19.1 / npm 9.2.0 導入済み。初回に `npm install`。各ステップ後に `npx vitest run` を実行し green を確認してから次へ進む。テストは既存スタイル([src/lib/__tests__/chordTheory.test.js](src/lib/__tests__/chordTheory.test.js))踏襲: 純関数+決定的rng、jsdom不使用。

(任意・ユーザー要望) 実装開始時にこのプラン全文を `docs/implementation-plan.md` としてリポジトリに保存する。

---

## Step 1: `src/lib/rng.js`(新規)

```js
/* シード付き決定的乱数(mulberry32)。Math.randomはプロジェクト方針で不使用。 */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed() {
  return crypto.getRandomValues(new Uint32Array(1))[0]; // Node18/ブラウザ両対応
}
```

**テスト** `src/lib/__tests__/rng.test.js`:
- 同一シード(123)の2インスタンスが最初の5値で完全一致
- 全値が `>= 0 && < 1`
- シード1と2で最初の値が異なる
- `randomSeed()` が 0〜2^32−1 の整数

## Step 2: `src/lib/chordTheory.js` に1関数追加(既存コード変更禁止)

```js
export function isValidToken(token) {
  return TOKEN_RE.test(token);
}
```

既存テストファイルに追加: `isValidToken("IVM7")`/`("bVII7")`/`("IV/V")` が true、`("H7")`/`("sus4")`/`("")` が false。

## Step 3: `src/data/progressionTemplates.js`(新規・テンプレDB)

以下を**そのまま**実装する。スキーマ: `{ id, mode, tokens, genres?, tags, moods, roles }`。`genres`=看板ジャンル(GENRESのid・強一致)、`tags`=ジャンルファミリー、`moods`=相性ムード(空=汎用)、`roles`=得意セクション役割。

```js
/* コード進行テンプレートDB。
   tokens は chordTheory.js のローマ数字文法に完全準拠(テストで検証)。
   文法上 sus4/dim/aug/m7b5 は表現不可のため不使用。マイナーの ii も dim になるため不使用。 */

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
```

**テスト** `src/lib/__tests__/progressionTemplates.test.js`:
- 全テンプレの全 tokens が `isValidToken` を通過
- `tokens.length` が 2〜16、`mode` が major/minor、`id` が全体で一意
- `roles` の各値 ∈ `new Set(Object.values(SECTION_ROLES))`、`moods` ⊆ MOODSのid、`genres` ⊆ GENRESのid
- **カバレッジ保証**: 各mode×各ジャンル(14)について、`tpl.genres?.includes(g) || tpl.tags.some(t => GENRE_FAMILIES[g].includes(t))` を満たすテンプレが1件以上
- 各modeにテンプレが1件以上(選択フォールバックの前提)

## Step 4: `src/lib/substitutions.js`(新規・置換エンジン)

```js
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
 * - 候補列挙順 = SUB_RULES の配列順(swapは to の並び順で展開、secondaryDominantは末尾に追加)
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
```

**テスト** `src/lib/__tests__/substitutions.test.js`:
- `getSpice("jpop","bright")` → `{prob:0.15, maxTier:1}` / `getSpice("jazz","chic")` → `{prob:0.5, maxTier:3}` / `getSpice("blues","chic")` → maxTier 2
- **Tierゲート**: `applySubstitutions(["I","IV","V","I","I","IV","V","I"], {mode:"major", spice:{prob:1,maxTier:1}}, mulberry32(42))` の全出力が `{"I","ii","iii","IV","V","vi"}` の部分集合(bで始まるトークン・`7`付きが出ない)
- **カデンツ保護**: 同入力で `spice:{prob:1,maxTier:3}` でも `out[6] === "V"`(Vにtier1ルール無し)かつ `out[7] ∈ {"I","vi","iii"}`
- **決定的トレース**(仕様通りなら必ずこうなる): `applySubstitutions(["III","vi","I","I"], {mode:"major", spice:{prob:1,maxTier:3}}, () => 0)` → `["III7","vi","I","vi"]`
  (b0: 候補=[III7(secDom, 次のviが対象)] → 採用+次ロック / b1: ロックでスキップ / b2: ガード帯tier1で I→vi 候補先頭だが直前小節"vi"と同一で見送り / b3: I→vi 採用=偽終止)
- **マイナー妥当性**: `applySubstitutions(["i","iv","V7","i"], {mode:"minor", spice:{prob:1,maxTier:3}}, mulberry32(7))` の全出力が `isValidToken` 通過
- **決定性**: 同一シードで2回呼んで結果一致
- `tokenFunction`: `("V","major")→"D"`, `("IV/V","major")→"D"`, `("bVII","major")→"D"`, `("vi","major")→"T"`, `("bII","minor")→"S"`, `("VII","minor")→"D"`

## Step 5: `src/lib/generateProgression.js`(新規・本体)

```js
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

export function selectTemplate(ctx, rng, state) {
  const pool = PROGRESSION_TEMPLATES.filter((t) => t.mode === ctx.mode); // ハードフィルタはmodeのみ=空にならない
  const scored = pool.map((t) => ({ t, s: scoreTemplate(t, ctx) }));
  const max = Math.max(...scored.map((x) => x.s));
  let candidates = scored.filter((x) => x.s >= max - 2).map((x) => x.t);
  if (candidates.length >= 2 && state.prevTemplateId) {
    const filtered = candidates.filter((t) => t.id !== state.prevTemplateId); // 直前セクションと同テンプレ回避
    if (filtered.length > 0) candidates = filtered;
  }
  return pick(candidates, rng);
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
 * エンジン本体(engine.jsのProgressionEngine契約の実装)。
 * req = { genreId, moodId, keyIndex, keyMode, bpm, sections, rng }
 * sections[i] = { type, bars, moodId, fixedTokens } — fixedTokens非nullは維持(文脈のみ提供)
 * 戻り値: セクションと同順のトークン配列の配列(result[i].length === sections[i].bars)
 * 曲内一貫性: 同一typeのセクションは同じテンプレを再利用(置換は毎回再抽選)=テーマと変奏
 */
export function generateProgression(req) {
  const genre = GENRES.find((g) => g.id === req.genreId);
  const results = [];
  const state = { byType: {}, prevTemplateId: null, prevEndToken: null };
  req.sections.forEach((sec, i) => {
    if (sec.fixedTokens) {
      results.push(sec.fixedTokens);
      state.prevEndToken = sec.fixedTokens[sec.fixedTokens.length - 1] ?? null;
      state.prevTemplateId = null;
      return;
    }
    const effMoodId = sec.moodId ?? req.moodId;
    const mood = MOODS.find((m) => m.id === effMoodId) ?? MOODS.find((m) => m.id === req.moodId);
    const ctx = {
      mode: req.keyMode, genreId: req.genreId, moodId: effMoodId,
      role: SECTION_ROLES[sec.type] ?? "verse", bars: sec.bars,
      prevEndToken: state.prevEndToken,
      nextStartToken: req.sections[i + 1]?.fixedTokens?.[0] ?? null,
    };
    const tpl = state.byType[sec.type] ?? selectTemplate(ctx, req.rng, state);
    state.byType[sec.type] = tpl;
    state.prevTemplateId = tpl.id;
    let tokens = fitTemplateToBars(tpl.tokens, sec.bars);
    tokens = applySubstitutions(tokens, { mode: req.keyMode, spice: getSpice(req.genreId, effMoodId) }, req.rng);
    const prob = Math.min(1, Math.max(0, genre.seventh + (mood?.seventhMod ?? 0)));
    tokens = tokens.map((t) => maybeAddSeventh(t, prob, req.rng));
    tokens = applyFinishing(tokens, sec.type, req.keyMode);
    state.prevEndToken = tokens[tokens.length - 1];
    results.push(tokens);
  });
  return results;
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
```

**テスト** `src/lib/__tests__/generateProgression.test.js`:
- `fitTemplateToBars`: `(["I","V","vi","IV"],8)` → 2回タイル / `(["I","V","vi","IV"],6)` → `["I","V","vi","IV","I","IV"]` / `(blues12トークン,8)` → 先頭7個+`"V7"` / `(["IM7","IVM7"],1)` → `["IM7"]` / `(x,x.length)` → 同一
- `selectTemplate({mode:"major",genreId:"jazz",moodId:"chic",role:"verse",bars:4,prevEndToken:null,nextStartToken:null}, ()=>0, {byType:{},prevTemplateId:null})` の戻り値が `tags` に `"jazzy"` を含むか `genres` に `"jazz"` を含む
- E2E(major): sections=[intro4, a8, b8, chorus8, outro4]、jpop×wistful、keyIndex0、`mulberry32(7)` → 各 `result[i].length` が bars と一致 / 全トークン `isValidToken` / b の末尾 `"V7"` / outro の末尾 `"I"` / 同シード再実行で完全一致
- E2E(minor): keyMode:"minor"、metal×aggressive、sections=[a8, b8, chorus8, outro4] → 全トークン妥当 / b末尾 `"V7"` / outro末尾 `"i"`
- **fixedTokensエコー**: 全セクションが fixedTokens 持ちのとき、`rng: () => { throw new Error("rng must not be called") }` でも例外なく元の配列がそのまま返る
- **曲内一貫性**: sections=[chorus8, a8, chorus8] で `result[0]` と `result[2]` の元テンプレが同一であること(置換で差異は出得るため、シードを固定し、応答が「異なるテンプレ由来」でないことを`state`公開かトークン先頭一致などで確認。簡便には chorus を2つ並べ、`applySubstitutions` が働かない spice になるよう genreId:"jpop", moodId:"bright"(prob0.15)+シード選定で置換ゼロのケースを使い完全一致を確認)
- エンジン契約: Step 6 の `templateEngine.generate(req)` を `await` して同形状

## Step 6: `src/lib/engine.js`(新規・将来のLMモードの差し込み口)

```js
import { generateProgression } from "./generateProgression.js";

/**
 * 生成エンジンの契約。将来 Transformers.js(ONNX Runtime Web)のLMエンジンを
 * 同じ契約で実装し、App.jsx の `const engine = templateEngine;` を差し替えるだけで載せ替え可能にする。
 *
 * @typedef {Object} EngineSection
 * @property {string} type            SECTION_TYPESのid
 * @property {number} bars            1..16(1小節1コード)
 * @property {?string} moodId         セクション個別ムード(null=曲全体の設定を使用)
 * @property {?string[]} fixedTokens  非null=このセクションは生成せず維持(前後の文脈として使う)
 *
 * @typedef {Object} EngineRequest
 * @property {string} genreId
 * @property {string} moodId
 * @property {number} keyIndex        0..11(テンプレエンジンはキー非依存だがLMは使ってよい)
 * @property {"major"|"minor"} keyMode
 * @property {number} bpm
 * @property {EngineSection[]} sections
 * @property {() => number} rng       唯一の乱数源(シード済み)
 *
 * @typedef {Object} ProgressionEngine
 * @property {string} id
 * @property {string} label
 * @property {(onProgress?: (loaded: number, total: number) => void) => Promise<void>} [init]
 *           任意・冪等。LMエンジンのモデルダウンロード用。テンプレエンジンには無い
 * @property {(req: EngineRequest) => string[][] | Promise<string[][]>} generate
 *           セクションと同順・同数のローマ数字トークン列。result[i].length === sections[i].bars。
 *           fixedTokens セクションはそのまま返す。呼び出し側は常に await すること
 */

/** @type {ProgressionEngine} */
export const templateEngine = {
  id: "template",
  label: "テンプレート",
  generate: generateProgression, // 同期実装だが契約上は Promise も可
};
```

## Step 7: `src/lib/structurePreset.js`(新規・おまかせ曲構成)

```js
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
```

**テスト** `src/lib/__tests__/structurePreset.test.js`:
- bpm ∈ {60, 90, 107, 122, 150, 180} それぞれで: 先頭 `intro`・末尾 `outro` / 全typeがSECTION_TYPESのid / barsが偶数かつ2〜16 / `|songDurationSeconds(合計, bpm) − 240| <= 45`
- bpm 150 で `solo` を含む(FAST形)、bpm 107 で含まない
- 同一bpmで2回呼んで同一結果(決定的)

## Step 8: `src/App.jsx` の4スタブ実装

追加import(既存importに追記):
```js
import { templateEngine } from "./lib/engine.js";
import { mulberry32, randomSeed } from "./lib/rng.js";
import { buildSongSection } from "./lib/generateProgression.js";
import { buildStandardStructure } from "./lib/structurePreset.js";
```
モジュールスコープ(コンポーネント外)に: `const engine = templateEngine;`

4スタブを以下に置換:

```jsx
const runEngine = async (sections, key, tempo) => {
  if (engine.init) await engine.init(); // テンプレ版はno-op。LMエンジン時にモデルDL+進捗UIを繋ぐ
  return engine.generate({
    genreId, moodId, keyIndex: key.keyIndex, keyMode: key.keyMode,
    bpm: tempo, sections, rng: mulberry32(randomSeed()), // 実行毎に新シード
  });
};

const generate = async () => {
  if (structure.length === 0) return;
  stop();
  const sections = structure.map((s) => ({ type: s.type, bars: s.bars, moodId: s.moodId ?? null, fixedTokens: null }));
  const tokenSections = await runEngine(sections, { keyIndex, keyMode }, bpm);
  setSong({
    genreLabel: genre.label, moodLabel: mood.label, tempo: bpm, keyIndex, keyMode,
    sections: structure.map((s, i) => buildSongSection(s, tokenSections[i], keyIndex, keyMode)),
  });
};

const makeStructure = () => setStructure(buildStandardStructure(bpm));

const addSection = async (type, bars) => { // LeadSheet.jsx:172 が (newType, newBars) を渡す
  const newSec = { type, bars, moodId: null };
  setStructure((prev) => [...prev, newSec]);
  if (!song) return; // シート未生成なら構成のみ追加(既存の慣習)
  stop();
  const sections = [
    ...song.sections.map((s) => ({ type: s.type, bars: s.bars, moodId: s.moodId ?? null, fixedTokens: s.tokens ?? null })),
    { ...newSec, fixedTokens: null },
  ];
  const tokenSections = await runEngine(sections, song, song.tempo);
  setSong((prev) => prev && {
    ...prev,
    sections: [...prev.sections, buildSongSection(newSec, tokenSections[tokenSections.length - 1], prev.keyIndex, prev.keyMode)],
  });
};

const regenerateSection = async (si) => {
  if (!song) return;
  stop();
  const sections = song.sections.map((s, i) => ({
    type: s.type, bars: s.bars, moodId: s.moodId ?? null,
    fixedTokens: i === si ? null : s.tokens ?? null,
  }));
  const tokenSections = await runEngine(sections, song, song.tempo);
  setSong((prev) => prev && {
    ...prev,
    sections: prev.sections.map((sec, i) =>
      i === si ? buildSongSection(sec, tokenSections[si], prev.keyIndex, prev.keyMode) : sec),
  });
};
```

設計意図(守ること):
- 再生成/追加は **`song.keyIndex`/`song.keyMode`** を使う(生成後にキーUIを変えても1セクションだけ別キーにしない)。genre/mood は現在のUI選択を使う
- 全生成系操作の前に `stop()`(既存 `reorderGeneratedSection` と同じ流儀)
- 手動編集(ChordPicker)後は `tokens` が実態とズレるが許容(接続採点の文脈にしか使わないため)。`s.tokens ?? null` で防御

**同時に入れる小修正**(既存バグ・任意だが推奨): `updateSectionSettings` は `moodId` をパッチしても `moodAccent` を更新しないためランプ表示が古くなる。song側パッチ時に `"moodId" in patch` なら `moodAccent: patch.moodId ? (MOODS.find((m) => m.id === patch.moodId)?.accent ?? null) : null` を追加する(`MOODS` はimport済み)。

## Step 9: README更新

- 設計メモを実装に合わせ現行化: テンプレDB+タグ選択+接続採点+Tier置換+仕上げ処理、エンジン契約(`src/lib/engine.js`)と将来のLMモード(Transformers.js)差し込み方針、マイナーキー対応済みであること
- ディレクトリ構成に新規ファイル(`rng.js`, `engine.js`, `substitutions.js`, `structurePreset.js`, `data/progressionTemplates.js`)を追記
- 「今後の拡張候補」から「マイナーキー対応」を削除

## Step 10: 最終検証

1. `npx vitest run` — 新規5スイート+既存 chordTheory.test.js が全green
2. `npm run build` — 成功
3. `npm run dev` で手動確認(チェックリスト):
   - [ ] 「✦ 曲構成を作成」(初期状態 J-POP×切ない bpm107)→ 11セクション・合計約4分表示
   - [ ] 「コード進行を生成」→ 全小節にコード表示。Bメロの最終小節がドミナント(C keyならG7)、アウトロ最終小節がトニック
   - [ ] LeadSheetの「↻ 再生成」→ 毎回結果が変わる
   - [ ] セクション個別の ↻ → そのセクションのみ変化、他は不変
   - [ ] 「＋ セクションを追加」(種類/小節数を指定)→ コード付きで末尾に追加
   - [ ] セクションのムード上書き(例: おしゃれ)→ 再生成でランプ色が変わり、テンションが増える
   - [ ] キーを Aマイナー、メタル×アグレッシブで生成 → `Am`,`G`,`F`,`E7` 系の表記(`i VII VI V7` 系)
   - [ ] ジャズ×おしゃれ → `M7`/`7` が大半に付く。パンク×明るい → ほぼトライアド
   - [ ] コードをクリック → ChordPicker での手動編集が従来どおり動作
   - [ ] 「⧉ コピー」→ ヘッダ+セクション毎のコード名テキスト

## やってはいけないこと

- `musicData.js` の既存exportの変更(SECTION_TYPESにrole追加なども不可 — roleは `progressionTemplates.js` の `SECTION_ROLES` に置く)
- `usePlayback.js`・`chordCatalog.js`・`suggestChords.js`・既存コンポーネントの変更(App.jsx の指定箇所を除く)
- `Math.random` の使用 / 依存パッケージの追加 / TypeScript化
- マイナーモードのテンプレ・置換ルールに `ii` や `bVII`(ナチュラルマイナーではただの `VII`)を混入させること
