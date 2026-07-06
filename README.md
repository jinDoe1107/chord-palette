# Chord Palette

ジャンル × ムードの組み合わせから、曲構成に沿ったコード進行を自動生成するフロントエンド完結のWebアプリ（プロトタイプ）。

## セットアップ

```bash
npm install
npm run dev
```

`http://localhost:5173` で開きます。

ビルド:

```bash
npm run build
npm run preview
```

## 技術構成

- React 18 + Vite
- 外部ライブラリなし（コード生成は自前ロジック、再生はWeb Audio API）
- Cloudflare Pages等の静的ホスティングにそのままデプロイ可能（`npm run build` の `dist/` を配信）

## ディレクトリ構成

```
src/
  data/
    musicData.js         ジャンル・ムード・曲構成セクションの定義データ
  lib/
    chordTheory.js        ローマ数字トークン ⇄ コードの変換、再生用周波数計算
    generateProgression.js ジャンル×ムードからコード進行を生成するロジック
  hooks/
    usePlayback.js         Web Audio APIでの再生を管理するフック
  components/
    StructureEditor.jsx    曲構成（セクション/小節数）の編集UI
    LeadSheet.jsx           生成されたコード進行の表示・再生・コピーUI
  App.jsx                  画面全体の組み立て
  App.css                  スタイル一式
```

## 設計メモ

- **ジャンル (`GENRES`)** が進行の「語彙」（プール）・基準テンポ・7th使用率を持つ
- **ムード (`MOODS`)** は語彙の「選び方」（プール内の進行にタグ付けされたムードでフィルタ）とテンポ・7th率の補正値を持つ
- 進行トークンはローマ数字記法（例: `IV`, `vi`, `bVII`, `V7`, `IVM7`）。`b`プレフィックスで借用和音、`7`/`M7`で7thコードを表現
- セクションの役割（`SECTION_TYPES`の`role`）ごとにプールを分けており、Bメロの最後は自動的にV7、アウトロの最後はIに寄せる仕上げ処理が入っている

## 今後の拡張候補（未実装）

- マイナーキー対応
- ピアノ/ギターの可視化（鍵盤・フレットボード）
- 分数コード、より多様な借用和音・代理コード
- ジャンルごとのリズムパターン・ボイシングを反映した再生音
- 生成結果の保存・履歴機能
