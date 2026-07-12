/* ジャンル→構成ファミリーの対応。未定義は "jpop" にフォールバック */
export const GENRE_FAMILY = {
  jpop: "jpop", anison: "jpop", kpop: "jpop",
  rock: "rock", punk: "rock", emo: "rock", country: "rock",
  ballad: "ballad", folk: "ballad",
  citypop: "groove", lofi: "groove", rnb: "groove",
  soul: "groove", neosoul: "groove", funk: "groove", hiphop: "groove",
  edm: "edm", dubstep: "edm", futurebass: "edm",
  jazz: "jazz", bossa: "jazz",
  blues: "blues",
  metal: "metal", metalcore: "metal", posthardcore: "metal",
};

/*
 * ファミリー別レシピ。structurePreset.js の builder が解釈する。値は [type, 基準小節数]。
 *  head      : 曲頭に必ず置く列
 *  unit      : 1コーラス分の中核。目標尺から逆算した回数だけくり返す(structurePreset.js側で計算)
 *  connector : unit間に挟むセクション(null可)
 *  options   : finale前に確率pで挿入する候補。minTempoで速い曲限定にできる
 *  finale    : 最後の山(ラスサビ等)
 *  tail      : 曲尾に必ず置く列
 */
export const FAMILY_RECIPES = {
  jpop: {
    head: [["intro", 4]],
    unit: [["a", 8], ["b", 8], ["chorus", 8]],
    connector: ["inter", 4],
    options: [
      { section: ["solo", 8], p: 0.4, minTempo: 135 },
      { section: ["c", 8], p: 0.7 },
    ],
    finale: [["chorus", 8]],
    tail: [["outro", 4]],
  },
  rock: {
    head: [["intro", 4]],
    unit: [["a", 8], ["chorus", 8]],
    connector: ["inter", 4],
    options: [
      { section: ["solo", 8], p: 0.7 },
      { section: ["b", 8], p: 0.4 },
      { section: ["c", 8], p: 0.3 },
    ],
    finale: [["chorus", 8]],
    tail: [["outro", 4]],
  },
  ballad: {
    head: [["intro", 4]],
    unit: [["a", 8], ["prechorus", 4], ["chorus", 8]],
    connector: null,
    options: [
      { section: ["bridge", 8], p: 0.6 },
      { section: ["c", 8], p: 0.3 },
    ],
    finale: [["chorus", 8]],
    tail: [["outro", 4]],
  },
  groove: {
    head: [["intro", 4]],
    unit: [["a", 8], ["chorus", 8]],
    connector: null,
    options: [
      { section: ["b", 8], p: 0.5 },
      { section: ["bridge", 8], p: 0.4 },
    ],
    finale: [["chorus", 8]],
    tail: [["outro", 4]],
  },
  edm: {
    head: [["intro", 8]],
    unit: [["a", 8], ["b", 4], ["chorus", 8]], // a=verse, b=build, chorus=drop
    connector: ["breakdown", 8],
    options: [{ section: ["solo", 8], p: 0.3 }],
    finale: [["chorus", 8]],
    tail: [["outro", 8]],
  },
  jazz: {
    head: [["intro", 4]],
    unit: [["a", 8], ["b", 8], ["a", 8]], // AABA head
    connector: null,
    options: [
      { section: ["solo", 16], p: 0.9 },
      { section: ["solo", 16], p: 0.5 },
    ],
    finale: [["a", 8]],
    tail: [["outro", 4]],
  },
  blues: {
    head: [["intro", 4]],
    unit: [["a", 12]], // 12小節ブルース
    connector: null,
    options: [
      { section: ["solo", 12], p: 0.9 },
      { section: ["solo", 12], p: 0.5 },
    ],
    finale: [["a", 12]],
    tail: [["outro", 4]],
  },
  metal: {
    head: [["intro", 8]],
    unit: [["a", 8], ["b", 8], ["chorus", 8]],
    connector: ["inter", 4],
    options: [
      { section: ["breakdown", 8], p: 0.7 },
      { section: ["solo", 8], p: 0.8 },
      { section: ["c", 8], p: 0.3 },
    ],
    finale: [["chorus", 8]],
    tail: [["outro", 4]],
  },
};
