# ギターサンプル音源

コード進行の再生に使うギターの録音サンプル(mp3)です。

## 出典・ライセンス（帰属表示）

これらの mp3 は **FluidR3_GM** サウンドフォントを1音ずつ書き出したものです。

- 音源: **FluidR3_GM** — 作者 **Frank Wen**
- ライセンス: **Creative Commons Attribution 3.0 (CC BY 3.0)** — https://creativecommons.org/licenses/by/3.0/
- 取得元: [gleitz/midi-js-soundfonts](https://github.com/gleitz/midi-js-soundfonts)（`gh-pages` ブランチ, `FluidR3_GM/`。同リポジトリが FluidR3_GM を CC BY 3.0 と明記）
- 変更点: gleitz による mp3 化（音単位に分割）、本リポジトリでは 3 音色 × C1〜C6 の範囲のみを同梱

> 注: 取得元リポジトリの `LICENSE.txt`（MIT, © 2012 Benjamin Gleitzman）は**リポジトリのコード/ツール**に対するもので、上記の**音データ本体には FluidR3_GM の CC BY 3.0 が適用**されます。

CC BY 3.0 は商用利用・再配布・改変を許諾しますが、**上記の帰属表示（作者名・ライセンス・出典・変更の明示）を保持する**ことが条件です。アプリで音源を配布・公開する際は、クレジット表記（例: フッターや About 画面）に上記を残してください。

### 使用音色（ディレクトリ名 = FluidR3_GM の音色名）

- `electric_guitar_clean/` … クリーン
- `overdriven_guitar/` … クランチ
- `distortion_guitar/` … ディストーション

各音色 C1〜C6（MIDI 24〜84）の 61 音、計 183 ファイル。ファイル名はフラット表記（例: `Db4.mp3`）。

## 再取得

```bash
npm run samples
```

`scripts/download-samples.mjs` が不足分のみを取得します（既存ファイルはスキップ＝冪等）。
