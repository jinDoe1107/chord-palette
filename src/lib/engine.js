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
