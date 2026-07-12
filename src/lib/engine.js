import { generateProgression } from "./generateProgression.js";
import { lmSelectorEngine } from "./lmEngine.js";

/**
 * 生成エンジンの契約。App.jsx は ENGINES から選んだエンジンを使う。
 *
 * @typedef {Object} EngineSection
 * @property {string} type            SECTION_TYPESのid
 * @property {number} bars            1..16(1小節1コード)
 * @property {?string} moodId         セクション個別ムード(null=曲全体の設定を使用)
 * @property {?boolean} [ai]          セクション個別のAIアシスト(true=AIエンジンがLLMで選択。テンプレエンジンは無視)
 * @property {?string} [hint]         セクション個別のAIヒント(AIエンジン用。テンプレエンジンは無視)
 * @property {?string[]} fixedTokens  非null=このセクションは生成せず維持(前後の文脈として使う)
 *
 * @typedef {Object} EngineRequest
 * @property {string} genreId
 * @property {string} moodId
 * @property {number} keyIndex        0..11(テンプレエンジンはキー非依存だがLMは使ってよい)
 * @property {"major"|"minor"} keyMode
 * @property {number} bpm
 * @property {?string} [hint]         自由記述ヒント(AIエンジン用。テンプレエンジンは無視)
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
  generate: generateProgression,
};

/** UIに提示するエンジン一覧 */
export const ENGINES = [templateEngine, lmSelectorEngine];
