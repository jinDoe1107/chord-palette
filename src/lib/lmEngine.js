/* AIアシスト(選択器)エンジン。
   LLMにトークンを生成させず、採点済みテンプレ候補(listTemplateCandidates)から
   1つ選ばせるだけ=出力は常に既存パイプラインの正当なトークン(構造上壊れない)。
   モデルは初回のみHF Hub CDNからダウンロードされ、ブラウザにキャッシュされる。 */
import { generateProgressionWith } from "./generateProgression.js";
import { pick } from "./chordTheory.js";
import { GENRES, MOODS, NOTE_NAMES } from "../data/musicData.js";

const MODEL_ID = "onnx-community/Qwen2.5-0.5B-Instruct";

let generatorPromise = null; // モデルロードの冪等化(init契約)

async function loadGenerator(onProgress) {
  const { pipeline } = await import("@huggingface/transformers"); // 動的import=メインバンドルを肥大させない
  const device = typeof navigator !== "undefined" && navigator.gpu ? "webgpu" : "wasm";
  return pipeline("text-generation", MODEL_ID, {
    dtype: "q4",
    device,
    progress_callback: (p) => {
      if (p.status === "progress" && onProgress) onProgress(p.loaded ?? 0, p.total ?? 0);
    },
  });
}

/* Fisher–Yates。位置バイアス(小型LLMは先頭を選びがち)の乱数化 + 押すたびの変化に使う */
function shuffleWithRng(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* プロンプトは英語(小型モデルは英語指示が最も安定)。ヒントは日本語のまま埋め込む(Qwenは日本語可読) */
export function buildSelectionPrompt(req, ctx, candidates) {
  const genre = GENRES.find((g) => g.id === req.genreId)?.label ?? req.genreId;
  const mood = MOODS.find((m) => m.id === ctx.moodId)?.label ?? ctx.moodId;
  const lines = [
    "You are a music arranger. Pick the best chord progression for one section of a song.",
    `Song: genre=${genre}, mood=${mood}, key=${NOTE_NAMES[req.keyIndex]} ${req.keyMode}, bpm=${req.bpm}.`,
    `Section: ${ctx.role} (${ctx.bars} bars).`,
  ];
  if (ctx.prevEndToken) lines.push(`The previous section ends on: ${ctx.prevEndToken}.`);
  if (req.hint) lines.push(`User request (Japanese): ${req.hint}`);
  if (ctx.hint) lines.push(`Request for this section (Japanese): ${ctx.hint}`);
  lines.push("Candidates (roman numeral progressions):");
  candidates.forEach((t, i) => lines.push(`${i + 1}. ${t.tokens.join(" ")}`));
  lines.push("Answer with only the number of the best candidate.");
  return lines.join("\n");
}

/* 応答から 1..count の番号を取り出す。妥当でなければ null(=フォールバック) */
export function parseSelection(text, count) {
  const m = String(text).match(/\d+/);
  if (!m) return null;
  const n = Number(m[0]);
  return n >= 1 && n <= count ? n - 1 : null;
}

/**
 * generateProgressionWith に渡すチューザを作る。
 * generator は Transformers.js の text-generation パイプライン互換:
 *   await generator(messages, opts) -> [{ generated_text: [...messages, {role:"assistant", content}] }]
 * テストではフェイク generator を注入する。
 */
export function makeLlmChooser(req, generator) {
  return async (ctx, candidates) => {
    if (!ctx.ai) return pick(candidates, req.rng); // AIオフのセクションは従来のランダム選択
    if (candidates.length === 1) return candidates[0]; // LLM呼び出し不要
    const shuffled = shuffleWithRng(candidates, req.rng); // シード決定的な並び=押すたびに変化
    try {
      const prompt = buildSelectionPrompt(req, ctx, shuffled);
      const out = await generator([{ role: "user", content: prompt }], {
        max_new_tokens: 5,
        do_sample: false, // 貪欲=同一入力なら同一選択
      });
      const text = out[0].generated_text.at(-1).content;
      const idx = parseSelection(text, shuffled.length);
      if (idx != null) return shuffled[idx];
    } catch {
      /* モデル呼び出し失敗はフォールバックへ */
    }
    return shuffled[0]; // シャッフル済み先頭=実質従来のランダム選択
  };
}

/** @type {import("./engine.js").ProgressionEngine} */
export const lmSelectorEngine = {
  id: "lm-selector",
  label: "AIアシスト",
  async init(onProgress) {
    if (!generatorPromise) {
      generatorPromise = loadGenerator(onProgress).catch((e) => {
        generatorPromise = null; // 失敗時は再試行可能に
        throw e;
      });
    }
    await generatorPromise;
  },
  async generate(req) {
    if (!generatorPromise) generatorPromise = loadGenerator();
    const generator = await generatorPromise;
    return generateProgressionWith(req, makeLlmChooser(req, generator));
  },
};
