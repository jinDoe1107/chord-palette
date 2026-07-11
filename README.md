# Chord Palette

ジャンル × ムードの組み合わせから、曲構成に沿ったコード進行を自動生成するフロントエンド完結のWebアプリ（プロトタイプ）。

## セットアップ

```bash
npm install
npm run dev
```

`http://localhost:5173` で開きます。

再生用のギター音源（mp3）はリポジトリに同梱済みなので、追加取得なしで再生できます。音源を取り直す場合のみ:

```bash
npm run samples   # public/samples/guitar/ に不足分だけ取得（冪等）
```

ビルド:

```bash
npm run build
npm run preview
```

## 技術構成

- React 18 + Vite
- 外部ライブラリなし（コード生成は自前ロジック、再生はWeb Audio API）
- 再生音は実ギターのサンプル音源（クリーン/クランチ/ディストーションの3音色）。ディストーションのみパワーコードでボイシング
- 音源は **FluidR3_GM**（作者 Frank Wen、**CC BY 3.0**）を [gleitz/midi-js-soundfonts](https://github.com/gleitz/midi-js-soundfonts) 経由で取得し `public/samples/guitar/` に同梱。**帰属表示が必要**（詳細・クレジット文面は同ディレクトリの README）
- Cloudflare Pages等の静的ホスティングにそのままデプロイ可能（`npm run build` の `dist/` を配信）

## ディレクトリ構成

```
src/
  data/
    musicData.js             ジャンル・ムード・曲構成セクションの定義データ
    progressionTemplates.js  コード進行テンプレートDB（タグ・役割・ジャンルファミリー）
  lib/
    chordTheory.js           ローマ数字トークン ⇄ コードの変換、構成音のMIDI/周波数計算
    chordCatalog.js          手動編集用のコード音質カタログ（構成音intervals）
    playbackCore.js          再生の純関数（小節秒・ステップ平坦化・音色別ボイシング）
    guitarTones.js           音色定義（clean/crunch/distortion ⇄ サンプル音色名）
    guitarSamples.js         MIDI ⇄ サンプルファイル名・音域クランプ・URL 組み立て
    generateProgression.js   テンプレ選択・小節充填・仕上げなど生成パイプライン本体
    substitutions.js         音楽理論ベースのランダム置換ルール（Tier制・カデンツ保護）
    engine.js                生成エンジンの契約（将来のLMエンジン差し込み口）
    structurePreset.js       「おまかせ曲構成」（約4分）の生成
    rng.js                   シード付き乱数（mulberry32）
  hooks/
    usePlayback.js           Web Audio API + サンプル音源での再生を管理するフック
  components/
    StructureEditor.jsx      曲構成（セクション/小節数）の編集UI
    LeadSheet.jsx            生成されたコード進行の表示・再生・コピーUI
  App.jsx                    画面全体の組み立て
  App.css                    スタイル一式
scripts/
  download-samples.mjs       ギター音源をpublic/samples/へ取得（npm run samples）
public/
  samples/guitar/            クリーン/クランチ/ディストーションのmp3（C1〜C6 × 3音色）
docs/
  guitar-playback-samples.md 再生機能（サンプル音源方式）の設計・実装記録
```

## 設計メモ

- 生成は**テンプレート+置換方式**: 実績あるコード進行テンプレ（王道進行・カノン進行など、メジャー/マイナー各セット）を骨格に使い、音楽理論ルールでランダムに一部を置き換える
- テンプレ（`data/progressionTemplates.js`）は `genres`（看板ジャンル）・`tags`（ジャンルファミリー）・`moods`・`roles`（セクション役割）で採点して選択。前セクション終端との**接続（T/S/D機能の遷移）も採点**し、継ぎ目の不自然さを抑える
- 同一タイプのセクション（例: サビ）は曲内で同じテンプレを再利用し、置換だけ再抽選（=テーマと変奏）
- **置換（`lib/substitutions.js`）はTier制**: Tier1=同機能ダイアトニック、Tier2=セカンダリードミナント・借用和音、Tier3=裏コード等。ムード×ジャンルから確率と許可Tierを決め、セクション末尾（カデンツ）は保護する
- 進行トークンはローマ数字記法（例: `IV`, `vi`, `bVII`, `V7`, `IVM7`, `IV/V`）。マイナーキーはナチュラルマイナー度数（`i VI III VII` など）+ 和声的短音階のドミナント `V7` で表現
- 仕上げ処理: Bメロ/プリコーラスの最後は自動的にV7、アウトロの最後はI（マイナーはi）に寄せる
- 生成の乱数は全てシード注入（`lib/rng.js`）で、同じシードなら同じ結果（テスト可能性のため）
- **生成エンジンは差し替え可能**（`lib/engine.js` の `ProgressionEngine` 契約）: `generate()` は非同期対応、`init(onProgress)` でモデルロードにも対応できるため、将来 Transformers.js（ONNX Runtime Web）による小型LMエンジンを「AIモード」として追加できる
- **再生**（`hooks/usePlayback.js`）: 1小節=1コードを実ギターのサンプルで発音。小節秒 `240/bpm/speed`、絶対時刻基準の setTimeout チェーンで累積ドリフトを防止し、速度・音色は次の小節から反映。停止は世代トークン + ゲインのランプダウンでクリックノイズを回避。再生ロジックの純関数部（`lib/playbackCore.js`・`lib/guitarSamples.js`）は vitest でテスト済み。詳細は `docs/guitar-playback-samples.md`

## 今後の拡張候補（未実装）

- Transformers.js（ONNX Runtime Web）による生成エンジンの追加（`engine.js` の契約に沿って実装）
- ピアノ/ギターの可視化（鍵盤・フレットボード）
- sus4/dim/aug などトークン文法の拡張
- ジャンルごとのリズムパターン・ボイシングを反映した再生音
- 生成結果の保存・履歴機能
