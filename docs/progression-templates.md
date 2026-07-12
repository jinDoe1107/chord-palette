# コード進行テンプレート一覧

アプリが内蔵するコード進行テンプレートと関連マスタデータの一覧。

- データソース:
  - `src/data/progressionTemplates.js` — `PROGRESSION_TEMPLATES`(テンプレート本体)、`GENRE_FAMILIES`(ジャンル→タグ)、`SECTION_ROLES`(セクション→役割)
  - `src/data/musicData.js` — `GENRES` / `MOODS` / `SECTION_TYPES`
  - `src/data/structureRecipes.js` — `GENRE_FAMILY` / `FAMILY_RECIPES`(曲構成レシピ)
- **注意**: このドキュメントは手動生成。上記データを変更した際は本ファイルも更新すること。

## 1. コード進行テンプレート一覧(全200件)

| 名称 (id) | 小節数 | モード | ジャンル | タグ | ムード | 役割 | コード進行 |
|---|---|---|---|---|---|---|---|
| 王道進行 (royal-road) | 4 | メジャー | J-POP, アニソン, フューチャーベース | pop | 切ない, エモい, 明るい | サビ, Bメロ | IVM7 - V7 - iii7 - vi |
| カノン進行 (canon) | 8 | メジャー | −(汎用) | pop, soft | 落ち着いた, 明るい, 切ない, 懐かしい, 前向き | Aメロ, サビ, アウトロ | I - V - vi - iii - IV - I - IV - V |
| 小室進行 (komuro) | 4 | メジャー | J-POP, EDM, アニソン, K-POP | pop, loop | エモい, 切ない, 疾走感 | サビ, Bメロ | vi - IV - V - I |
| ポップパンク進行 (axis) | 4 | メジャー | パンク, エモ | pop, rock, loop | 明るい, エモい, 前向き, 疾走感 | サビ, Aメロ | I - V - vi - IV |
| アクシス(vi始まり) (axis-sad) | 4 | メジャー | −(汎用) | pop, loop | 切ない, エモい, 悲しい | Aメロ, サビ, Bメロ | vi - IV - I - V |
| 50s進行 (doo-wop) | 4 | メジャー | −(汎用) | pop, soft | 明るい, 落ち着いた, 懐かしい | Aメロ, イントロ, アウトロ | I - vi - IV - V |
| ツーファイブワン (two-five-one) | 4 | メジャー | ジャズ, ボサノバ | jazzy | おしゃれ, 落ち着いた | イントロ, アウトロ, ソロ・間奏, Aメロ | ii7 - V7 - IM7 - IM7 |
| 循環進行(1-6-2-5) (rhythm-turnaround) | 4 | メジャー | ジャズ, ソウル | jazzy, soul | おしゃれ, 明るい, 懐かしい | Aメロ, イントロ, ソロ・間奏 | IM7 - vi7 - ii7 - V7 |
| 丸サ進行 (just-the-two-of-us) | 4 | メジャー | シティポップ, lo-fi hip hop, R&B, ネオソウル | jazzy, soul | おしゃれ, ロマンチック, 落ち着いた | Aメロ, サビ, ソロ・間奏 | IVM7 - III7 - vi7 - I7 |
| シティポップ・リフト (citypop-lift) | 4 | メジャー | シティポップ, R&B, ソウル | soul, jazzy, soft | おしゃれ, ロマンチック, 懐かしい, 落ち着いた | Aメロ, サビ, イントロ | IM7 - vi7 - IVM7 - V7 |
| ミクソリディアン・ロック (mixo-rock) | 4 | メジャー | ロック, メタル, カントリー | rock, heavy | 怒り, 明るい, 疾走感 | サビ, Aメロ, ソロ・間奏 | I - bVII - IV - I |
| ハード・ミクスチャー (hard-mixture) | 4 | メジャー | −(汎用) | heavy, rock | ダーク, 怒り, ミステリアス | Aメロ, ソロ・間奏, ブレイクダウン | I - bIII - IV - I |
| 12小節ブルース (blues-12) | 12 | メジャー | ブルース | blues | 明るい, 落ち着いた, 怒り, 懐かしい | Aメロ, サビ, ソロ・間奏 | I7 - I7 - I7 - I7 - IV7 - IV7 - I7 - I7 - V7 - IV7 - I7 - V7 |
| ブルース・ターンアラウンド (blues-turnaround) | 4 | メジャー | ブルース, カントリー | blues, rock | 明るい, 怒り, 懐かしい | イントロ, アウトロ, ソロ・間奏 | I7 - IV7 - I7 - V7 |
| 下降ベース・バラード (descending-ballad) | 8 | メジャー | バラード, フォーク | soft, pop | 切ない, 落ち着いた, 悲しい, ロマンチック | Aメロ, Bメロ | I - V/vii - vi - I/V - IV - I/iii - ii7 - V7 |
| 王道進行(三和音) (ohdou-plain) | 4 | メジャー | J-POP, アニソン, ロック | pop, rock | エモい, 切ない, 前向き | サビ, Bメロ | IV - V - iii - vi |
| プリコーラス・クライム (prechorus-climb) | 4 | メジャー | −(汎用) | pop, soft, soul | 明るい, エモい, 前向き | Bメロ | ii7 - iii7 - IV - V |
| 2コード・ヴァンプ (vamp-two) | 2 | メジャー | −(汎用) | soul, jazzy, soft, loop | ロマンチック, 落ち着いた, おしゃれ | イントロ, ソロ・間奏, Aメロ | IM7 - IVM7 |
| ゴスペル・ターン (gospel-turn) | 4 | メジャー | R&B, lo-fi hip hop, ソウル, ネオソウル | soul, jazzy | おしゃれ, ロマンチック, 切ない, 懐かしい | Aメロ, Bメロ, アウトロ | IM7 - I7 - IVM7 - iv |
| エピック・ミクソリディアン (epic-mixolydian) | 4 | メジャー | −(汎用) | rock, heavy, pop | 疾走感, 怒り, 明るい, 前向き | サビ, Cメロ・ブリッジ, ソロ・間奏 | I - V - bVII - IV |
| サンシャイン・ループ (sunshine-loop) | 4 | メジャー | −(汎用) | pop, loop, rock | 明るい, 前向き, 疾走感 | Aメロ, サビ, イントロ | I - IV - V - IV |
| 終止アウトロ (plagal-out) | 4 | メジャー | −(汎用) | 全タグ | −(汎用) | アウトロ, イントロ | IV - V - I - I |
| マリオ終止 (mario-cadence) | 4 | メジャー | −(汎用) | rock, heavy, pop | ダーク, 明るい, 前向き | Cメロ・ブリッジ, ブレイクダウン, アウトロ | bVI - bVII - I - I |
| ナポリタン・チャグ (neapolitan-chug) | 4 | メジャー | メタル, メタルコア, ポストハードコア | heavy | 怒り, ダーク, ミステリアス | ブレイクダウン, ソロ・間奏 | I - I - bII - I |
| ミクスチャー・アンセム (mixture-anthem) | 4 | メジャー | ロック, メタル, ポストハードコア | rock, heavy | 怒り, ダーク, 疾走感 | サビ, Aメロ, ソロ・間奏 | I - bVII - bVI - bVII |
| ポップロック・クライム (pop-rock-climb) | 4 | メジャー | ロック, エモ, J-POP | rock, pop | 明るい, 前向き, 懐かしい | Aメロ, Bメロ, サビ | I - iii - IV - V |
| グランジ・ループ (grunge-loop) | 4 | メジャー | ロック, パンク | rock, heavy, loop | ダーク, 怒り, ミステリアス | Aメロ, ソロ・間奏 | I - bIII - bVII - IV |
| パンク・ドライブ (punk-drive) | 4 | メジャー | パンク, ロック, エモ | rock, loop | 疾走感, 明るい, 怒り | Aメロ, サビ, イントロ | I - V - IV - V |
| エモ・リフト (emo-lift) | 4 | メジャー | エモ, パンク, ロック | rock, pop | エモい, 切ない, 前向き | サビ, Aメロ, Bメロ | IV - I - V - vi |
| ダブル・プラガル (double-plagal) | 4 | メジャー | ロック, カントリー | rock, pop, blues | 明るい, 懐かしい, 前向き | アウトロ, サビ, ソロ・間奏 | bVII - IV - I - I |
| ヘヴィ・ミクスチャー・クライム (heavy-mixture-climb) | 4 | メジャー | メタル, メタルコア | heavy | ダーク, 怒り, ミステリアス | ソロ・間奏, ブレイクダウン, Aメロ | I - bIII - IV - bVI |
| パワーバラード(8小節) (power-ballad-8) | 8 | メジャー | ロック, エモ, バラード | rock, soft, pop | エモい, 前向き, 切ない, 懐かしい | サビ, Aメロ | I - V - vi - IV - I - V - IV - V |
| ミクソリディアン・ヴァンプ (mixo-vamp) | 2 | メジャー | ロック, パンク, カントリー | rock, loop, blues | 疾走感, 明るい, 怒り | イントロ, ソロ・間奏, Aメロ | I - bVII |
| 下降ポップロック (descending-pop-rock) | 4 | メジャー | ロック, J-POP, エモ | rock, pop, soft | 切ない, 懐かしい, 前向き | Aメロ, Bメロ | I - V/vii - vi - IV |
| ガレージロック (garage-rock) | 4 | メジャー | ロック, ブルース, パンク | rock, blues | 怒り, 明るい, 懐かしい | Aメロ, ソロ・間奏, サビ | I7 - bIII7 - IV7 - I7 |
| ポストロック・グロウ (post-rock-glow) | 8 | メジャー | エモ, ロック | rock, soft, pop | 落ち着いた, 前向き, 切ない, 懐かしい | イントロ, Aメロ, アウトロ | IM7 - V - vi7 - IVM7 - IM7 - V - ii7 - IVM7 |
| ファンク・ヴァンプ (funk-vamp) | 4 | メジャー | ファンク, ヒップホップ, ソウル | soul, loop, blues | 明るい, おしゃれ, 疾走感 | Aメロ, ソロ・間奏, イントロ | I7 - I7 - IV7 - I7 |
| lo-fi ステップス (lofi-steps) | 4 | メジャー | lo-fi hip hop, ヒップホップ, ネオソウル, シティポップ | jazzy, soul, loop | 落ち着いた, おしゃれ, 懐かしい | Aメロ, イントロ, アウトロ | IVM7 - iii7 - ii7 - IM7 |
| フェーディング・ライト (fading-light) | 4 | メジャー | −(汎用) | soft, pop | 悲しい, 切ない, 懐かしい, ロマンチック | Aメロ, Cメロ・ブリッジ, アウトロ | I - IV - iv - I |
| ナポリタン・フロート (neapolitan-float) | 2 | メジャー | −(汎用) | jazzy, heavy, soft | ミステリアス, ダーク, おしゃれ | イントロ, Cメロ・ブリッジ, ブレイクダウン | IM7 - bIIM7 |
| 循環ブリッジ(6-2-5-1) (circle-bridge) | 4 | メジャー | ジャズ, J-POP, ソウル | jazzy, pop, soul | おしゃれ, 落ち着いた, 前向き | Cメロ・ブリッジ, Bメロ, Aメロ | vi7 - ii7 - V7 - IM7 |
| バックドア・ツーファイブ (backdoor-two-five) | 4 | メジャー | ジャズ, ソウル, ネオソウル | jazzy, soul | おしゃれ, 懐かしい, 落ち着いた | Aメロ, アウトロ, ソロ・間奏 | iv7 - bVII7 - IM7 - IM7 |
| ゴスペル・ウォークアップ (gospel-walkup) | 4 | メジャー | ソウル, R&B, バラード | soul, soft | ロマンチック, 懐かしい, 前向き | Aメロ, Bメロ, アウトロ | I - I/iii - IV - iv |
| 循環進行(3-6-2-5) (three-six-two-five) | 4 | メジャー | ジャズ, ボサノバ, シティポップ | jazzy | おしゃれ, ロマンチック, 落ち着いた | Aメロ, ソロ・間奏, イントロ | iii7 - VI7 - ii7 - V7 |
| サンセット・クルーズ (sunset-cruise) | 4 | メジャー | シティポップ, ファンク, R&B | soul, jazzy | ロマンチック, おしゃれ, 懐かしい | サビ, Aメロ | IM7 - III7 - vi7 - V7 |
| ソウル・ステップス (soul-steps) | 4 | メジャー | ネオソウル, R&B, lo-fi hip hop | soul, jazzy | 落ち着いた, ロマンチック, おしゃれ | Aメロ, イントロ | IM7 - vi7 - ii7 - IVM7 |
| リフト・リゾルブ (lift-resolve) | 4 | メジャー | J-POP, アニソン, K-POP | pop | 明るい, エモい, 前向き | サビ, Bメロ | IV - V - vi - I |
| 小室進行(8小節プッシュ) (komuro-push-8) | 8 | メジャー | アニソン, J-POP, EDM | pop, loop | 疾走感, エモい, 切ない | サビ | vi - IV - V - I - vi - IV - V - V |
| フューチャー・ループ (future-loop) | 4 | メジャー | EDM, フューチャーベース, K-POP | pop, loop | 明るい, エモい, 疾走感 | サビ, Bメロ | vi - I - V - IV |
| 王道進行(8小節解決) (royal-road-8) | 8 | メジャー | J-POP, アニソン | pop, soft | 切ない, エモい, 前向き | サビ, Bメロ | IVM7 - V7 - iii7 - vi7 - ii7 - V7 - IM7 - IM7 |
| ドリーム・グライド (dream-glide) | 4 | メジャー | フューチャーベース, EDM, シティポップ | pop, jazzy, loop | ロマンチック, 明るい, 落ち着いた | Aメロ, イントロ | IM7 - V - IVM7 - V |
| キャンプファイア (campfire) | 4 | メジャー | フォーク, カントリー, バラード | soft, pop, blues | 落ち着いた, 懐かしい, 明るい | Aメロ, イントロ, アウトロ | I - IV - I - V |
| 8小節ブルース (blues-8) | 8 | メジャー | ブルース, カントリー, ロック | blues | 明るい, 懐かしい, 落ち着いた | Aメロ, ソロ・間奏 | I7 - IV7 - I7 - I7 - IV7 - IV7 - I7 - V7 |
| アーメン終止 (amen-soft-out) | 4 | メジャー | ソウル, バラード, フォーク | soft, soul, pop | 落ち着いた, 懐かしい, 前向き | アウトロ | IV - iv - I - I |
| ミクスチャー・ブリッジ (mixture-bridge) | 4 | メジャー | −(汎用) | pop, rock, soft | ミステリアス, 切ない, 前向き | Cメロ・ブリッジ, Bメロ | bVI - IV - V - V |
| トニック・ペダル (tonic-pedal) | 2 | メジャー | −(汎用) | pop, soft, rock, loop | 落ち着いた, 明るい, 前向き | イントロ, アウトロ | I - IV/I |
| AORグライド (aor-glide) | 4 | メジャー | シティポップ, フューチャーベース | jazzy, soul, pop | おしゃれ, 落ち着いた, ミステリアス | Aメロ, イントロ | IM7 - bVIIM7 - IVM7 - IM7 |
| 王道進行(サブドミナントマイナー) (royal-road-sdm) | 4 | メジャー | J-POP, シティポップ, アニソン | pop, jazzy | 切ない, ロマンチック, 悲しい | サビ, Bメロ, Aメロ | IVM7 - iv7 - iii7 - vi7 |
| モダンポップ・ループ (modern-pop-loop) | 4 | メジャー | K-POP, J-POP, EDM | pop, loop | 明るい, おしゃれ, 前向き | Aメロ, サビ | I - V - ii7 - IV |
| ドッペルドミナント (dominant-approach) | 4 | メジャー | ジャズ, カントリー, ブルース | jazzy, blues, pop | 明るい, おしゃれ, 懐かしい | Bメロ, アウトロ, ソロ・間奏 | II7 - V7 - I - I |
| アクシス・ターン (axis-turn) | 4 | メジャー | J-POP, K-POP, EDM | pop, loop | 明るい, エモい, 前向き | サビ, Aメロ | V - vi - IV - I |
| ジェントル・ディセント (gentle-descent) | 4 | メジャー | バラード, フォーク, J-POP | soft, pop | 落ち着いた, 切ない, ロマンチック | Aメロ, イントロ | I - iii - vi - IV |
| レトロ・ツー(II7) (beatles-two) | 4 | メジャー | ロック, カントリー, フォーク | rock, pop, blues | 明るい, 懐かしい, 前向き | Aメロ, サビ | I - II7 - IV - I |
| クリープ・アーク (creep-arc) | 4 | メジャー | ロック, エモ, バラード | rock, soft, pop | 切ない, 悲しい, エモい, ミステリアス | Aメロ, サビ | I - III7 - IV - iv |
| アイスクリーム・チェンジ (ice-cream-changes) | 4 | メジャー | ジャズ, ソウル, J-POP | pop, jazzy, soft | 懐かしい, 明るい, ロマンチック | Aメロ, イントロ, ソロ・間奏 | I - vi - ii7 - V7 |
| ダイアトニック・ステアズ (diatonic-stairs) | 4 | メジャー | ネオソウル, R&B, lo-fi hip hop | jazzy, soul | 落ち着いた, おしゃれ, 前向き | イントロ, Aメロ, Bメロ | IM7 - ii7 - iii7 - IVM7 |
| ポップ・アーチ (pop-arch) | 4 | メジャー | J-POP, K-POP, アニソン | pop | 明るい, 前向き, エモい | Aメロ, サビ | I - IV - vi - V |
| モーダル・リフト (modal-lift) | 4 | メジャー | ロック, カントリー, パンク | rock, pop | 前向き, 明るい, 疾走感 | サビ, Bメロ | I - bVII - IV - V |
| 王道進行(III7) (royal-road-dominant) | 4 | メジャー | J-POP, アニソン | pop | エモい, 切ない, 疾走感 | サビ, Bメロ | IV - V - III7 - vi |
| 偽終止プッシュ (deceptive-push) | 4 | メジャー | J-POP, アニソン, EDM | pop, loop | エモい, 切ない, 前向き | Bメロ, サビ | IV - V - vi - vi |
| シルキー・ステップス (silky-steps) | 4 | メジャー | ネオソウル, シティポップ, R&B | soul, jazzy | ロマンチック, おしゃれ, 落ち着いた | Aメロ, サビ | IM7 - IVM7 - iii7 - vi7 |
| ドミナント・ペダル (dominant-pedal) | 2 | メジャー | ジャズ, ソウル, シティポップ | jazzy, soul | おしゃれ, ミステリアス | イントロ, Bメロ | IV/V - V7 |
| 1-4-2-5ターン (two-four-turn) | 4 | メジャー | J-POP, フォーク, ソウル | pop, soft, jazzy | 明るい, 落ち着いた, 懐かしい | Aメロ, イントロ, アウトロ | I - IV - ii7 - V7 |
| ダイアトニック・サークル(3-6-2-5) (diatonic-circle) | 4 | メジャー | ジャズ, ボサノバ, シティポップ | jazzy | おしゃれ, 落ち着いた, 懐かしい | Aメロ, ソロ・間奏, イントロ | iii7 - vi7 - ii7 - V7 |
| 借用ループ(bVI-bVII) (borrowed-loop) | 4 | メジャー | ロック, メタル, EDM | rock, heavy, loop | ダーク, 前向き, 怒り | サビ, ソロ・間奏, ブレイクダウン | I - bVI - bVII - I |
| イージー・ループ (easy-loop) | 4 | メジャー | J-POP, フォーク, カントリー | pop, soft, loop | 明るい, 落ち着いた, 前向き | Aメロ, イントロ | I - V - vi - V |
| 12小節ブルース(クイックチェンジ) (blues-12-quick) | 12 | メジャー | ブルース, ロック, カントリー | blues | 明るい, 怒り, 懐かしい | Aメロ, ソロ・間奏, サビ | I7 - IV7 - I7 - I7 - IV7 - IV7 - I7 - I7 - V7 - IV7 - I7 - V7 |
| ソフト・サイクル (soft-cycle) | 4 | メジャー | バラード, J-POP, フォーク | soft, pop | 切ない, 落ち着いた, 懐かしい | Aメロ, Bメロ | I - vi - iii - IV |
| ビタースイート・アーク (bittersweet-arc) | 4 | メジャー | J-POP, バラード, シティポップ | pop, soft, jazzy | 切ない, 悲しい, ロマンチック | Aメロ, サビ, アウトロ | I - iii - IV - iv |
| 4-5-1-6ループ (four-five-one-six) | 4 | メジャー | J-POP, アニソン, K-POP | pop, loop | エモい, 明るい, 切ない | サビ, Bメロ | IV - V - I - vi |
| 2-5-3-6(ダイアトニック) (two-five-three-six) | 4 | メジャー | J-POP, シティポップ, ジャズ | pop, jazzy | おしゃれ, 切ない, 落ち着いた | Aメロ, Bメロ | ii7 - V7 - iii7 - vi7 |
| 2-5-3-6(VI7) (jpop-turnaround-loop) | 4 | メジャー | J-POP, アニソン, シティポップ | pop, jazzy | エモい, おしゃれ, 切ない | Bメロ, サビ, Aメロ | ii7 - V7 - iii7 - VI7 |
| グランド・アセント(8小節) (grand-ascent-8) | 8 | メジャー | J-POP, アニソン, バラード | pop, soft | 前向き, 明るい, エモい | サビ, Cメロ・ブリッジ | I - ii7 - iii7 - IV - V - vi - V7 - I |
| ヘヴィ・ヴァンプ (heavy-vamp) | 2 | メジャー | メタル, ロック, ダブステップ | heavy, rock, loop | 怒り, ダーク | イントロ, ブレイクダウン, ソロ・間奏 | I - bIII |
| フル・ケーデンス (full-cadence) | 4 | メジャー | フォーク, カントリー, パンク | pop, soft, rock, blues | 明るい, 落ち着いた, 懐かしい | Aメロ, アウトロ, イントロ | I - IV - V - I |
| ロックンロール・ターン (rock-n-roll-turn) | 4 | メジャー | ロック, パンク, ブルース | rock, blues, loop | 明るい, 疾走感, 懐かしい | Aメロ, サビ, ソロ・間奏 | I - V - IV - I |
| ミクソリディアン・ケーデンス (mixo-cadence) | 4 | メジャー | ロック, カントリー, フォーク | rock, pop, blues | 懐かしい, 明るい, 落ち着いた | アウトロ, Aメロ | I - IV - bVII - I |
| アンセム・リゾルブ(8小節) (anthem-resolve-8) | 8 | メジャー | J-POP, ロック, EDM | pop, rock | 前向き, エモい, 明るい | サビ, アウトロ | I - V - vi - IV - ii7 - V7 - I - I |
| メロウ・サイクル (mellow-cycle) | 4 | メジャー | シティポップ, lo-fi hip hop, ボサノバ | jazzy, soul, soft | 落ち着いた, おしゃれ, ロマンチック | Aメロ, イントロ | IM7 - iii7 - vi7 - V7 |
| サブドミナントマイナー終止 (minor-plagal-cadence) | 4 | メジャー | バラード, ジャズ, アニソン | soft, pop, jazzy | 悲しい, 切ない, 前向き | アウトロ, Bメロ | iv - V7 - I - I |
| フリジアン・メジャーヴァンプ (phrygian-major-vamp) | 2 | メジャー | メタル, メタルコア, ダブステップ | heavy, loop | 怒り, ダーク, ミステリアス | イントロ, ブレイクダウン | I - bII |
| アリーナ・ビルド(8小節) (arena-build-8) | 8 | メジャー | ロック, メタル, エモ | rock, heavy, pop | 前向き, 怒り, 疾走感 | Aメロ, Bメロ | I - I - IV - IV - vi - vi - IV - V |
| セブンス・ヴァンプ (seventh-vamp) | 2 | メジャー | ファンク, ブルース, ロック | blues, soul, loop | 明るい, 怒り, おしゃれ | イントロ, Aメロ, ソロ・間奏 | I7 - IV7 |
| サブドミナントマイナー・プッシュ (sdm-push) | 4 | メジャー | J-POP, バラード, シティポップ | pop, soft, jazzy | 切ない, 悲しい, エモい | Bメロ | ii7 - iv - V7 - V7 |
| デイブレイク・ケーデンス (daybreak-cadence) | 4 | メジャー | ボサノバ, ジャズ, フォーク | jazzy, soft | 明るい, 落ち着いた, 前向き | Aメロ, イントロ, アウトロ | IM7 - IVM7 - V7 - IM7 |
| ツーコード・リフト (two-chord-lift) | 2 | メジャー | ネオソウル, R&B, ヒップホップ | soul, jazzy, loop | おしゃれ, 落ち着いた, ロマンチック | イントロ, Aメロ, ソロ・間奏 | IM7 - ii7 |
| ポップ・フォーム(16小節) (pop-form-16) | 16 | メジャー | J-POP, アニソン | pop, soft | 明るい, エモい, 前向き, 切ない | サビ, Aメロ | I - V - vi - IV - I - V - vi - IV - IV - V - iii - vi - ii7 - V7 - I - I |
| ビルド・ディセンド (build-descend) | 4 | メジャー | J-POP, EDM, バラード | pop, soft | エモい, 切ない, 前向き | Bメロ, Aメロ | vi - IV - ii7 - V7 |
| ハーフ・クローズ (half-close) | 4 | メジャー | バラード, J-POP, フォーク | soft, pop | 切ない, 落ち着いた, ロマンチック | Aメロ, Bメロ | I - V/vii - vi - V |
| ブギー・ターン (boogie-turn) | 4 | メジャー | ブルース, ロック, カントリー | blues, rock | 怒り, 明るい, 懐かしい | ソロ・間奏, Aメロ, サビ | I7 - bVII7 - IV7 - I7 |
| エオリアン・アンセム (aeolian-anthem) | 4 | マイナー | EDM, アニソン, K-POP, フューチャーベース | pop, rock, loop | エモい, ダーク, 切ない, 疾走感 | サビ, Aメロ | i - VI - III - VII |
| エオリアン・ドライブ (aeolian-drive) | 4 | マイナー | メタル, メタルコア, パンク, ポストハードコア | rock, heavy, loop | 怒り, ダーク, 疾走感 | Aメロ, サビ, ソロ・間奏 | i - VII - VI - VII |
| アンダルシア進行 (andalusian) | 4 | マイナー | −(汎用) | pop, rock, jazzy | ダーク, ミステリアス, 切ない | Bメロ, Cメロ・ブリッジ, Aメロ | i - VII - VI - V7 |
| マイナー・リフト (minor-lift) | 4 | マイナー | −(汎用) | pop, loop, rock | エモい, ダーク, 前向き | サビ, Cメロ・ブリッジ, イントロ | VI - VII - i - i |
| マイナー・ツーファイブ (minor-two-five) | 4 | マイナー | ジャズ, ボサノバ | jazzy | おしゃれ, ダーク, 落ち着いた, ミステリアス, 懐かしい | イントロ, アウトロ, Aメロ, ソロ・間奏 | iv7 - V7 - i7 - i7 |
| ラメントバス (lament-line) | 4 | マイナー | バラード, フォーク | soft, pop | 切ない, ダーク, 悲しい, 落ち着いた | Aメロ, Bメロ | i - i/VII - VI - V7 |
| ドミナント・プッシュ (minor-cadence-push) | 4 | マイナー | −(汎用) | 全タグ | −(汎用) | Bメロ | iv - iv - V7 - V7 |
| マイナー・スイープ (minor-sweep) | 4 | マイナー | −(汎用) | pop, soft | 切ない, エモい, 悲しい | サビ, Cメロ・ブリッジ | i - iv - VI - V7 |
| フリジアン・チャグ (phrygian-chug) | 4 | マイナー | メタル, メタルコア, ポストハードコア, ダブステップ | heavy | 怒り, ダーク, ミステリアス | ブレイクダウン, ソロ・間奏, Aメロ | i - bII - i - VII |
| ダーク・ソウル・ループ (dark-soul-loop) | 4 | マイナー | lo-fi hip hop, R&B, シティポップ, ヒップホップ, ネオソウル | soul, jazzy | ダーク, おしゃれ, ロマンチック, 落ち着いた | Aメロ, ソロ・間奏, イントロ | i7 - iv7 - i7 - V7 |
| 12小節マイナーブルース (minor-blues-12) | 12 | マイナー | ブルース | blues | ダーク, 落ち着いた, 怒り, 悲しい | Aメロ, ソロ・間奏, サビ | i7 - i7 - i7 - i7 - iv7 - iv7 - i7 - i7 - V7 - iv7 - i7 - V7 |
| ギャロップ・ラン (gallop-run) | 4 | マイナー | メタル, パンク, メタルコア | heavy, rock, loop | 疾走感, 怒り, ダーク | Aメロ, サビ, ソロ・間奏 | i - i - VI - VII |
| フリジアン・ドロップ (phrygian-drop) | 4 | マイナー | メタル, メタルコア, ダブステップ | heavy | ダーク, 怒り, ミステリアス | ブレイクダウン, ソロ・間奏 | i - bII - VII - i |
| ハーフタイム・ブレイクダウン (breakdown-half) | 4 | マイナー | メタルコア, ポストハードコア, ダブステップ | heavy, loop | 怒り, ダーク | ブレイクダウン | i - i - bII - bII |
| エオリアン・ケーデンス (aeolian-cadence) | 4 | マイナー | パンク, ロック, エモ | rock, pop, loop | エモい, ダーク, 疾走感 | サビ, Aメロ, アウトロ | i - VI - VII - i |
| マイナー・ターンアラウンド (minor-turnaround) | 4 | マイナー | −(汎用) | pop, soft, rock | 悲しい, 切ない, ダーク | Aメロ, Bメロ, アウトロ | i - VI - iv - V7 |
| フリジアン・ヴァンプ (phrygian-vamp) | 2 | マイナー | メタル, メタルコア, ポストハードコア | heavy, loop | ダーク, 怒り, ミステリアス | イントロ, ブレイクダウン, ソロ・間奏 | i - bII |
| エモ・マイナーリフト (emo-minor-lift) | 4 | マイナー | エモ, ポストハードコア, メタルコア | rock, heavy, pop | エモい, 前向き, 切ない | サビ, Bメロ | VI - III - VII - i |
| エオリアン・ポップループ (aeolian-pop-loop) | 4 | マイナー | ロック, エモ, ポストハードコア | rock, pop, loop, heavy | エモい, ダーク, 前向き, 切ない | Aメロ, サビ | i - III - VII - VI |
| マイナー・エピック(8小節) (minor-epic-8) | 8 | マイナー | メタル, ポストハードコア, アニソン | heavy, rock, pop | ダーク, エモい, 疾走感 | サビ, Bメロ | i - VI - III - VII - i - VI - iv - V7 |
| ニューメタル・グルーヴ (nu-metal-groove) | 4 | マイナー | メタル, メタルコア, ダブステップ | heavy, loop | 怒り, ダーク | Aメロ, ブレイクダウン | i - iv - i - bII |
| マイナー・ソロラン (minor-solo-run) | 4 | マイナー | パンク, メタル, ロック | rock, heavy | 疾走感, 怒り, ダーク | ソロ・間奏, Cメロ・ブリッジ | i - VII - iv - V7 |
| ドリアン・ヴァンプ (dorian-vamp) | 2 | マイナー | ファンク, ヒップホップ, ソウル, ネオソウル | soul, loop, jazzy | 明るい, おしゃれ, 落ち着いた | Aメロ, ソロ・間奏, イントロ | i7 - IV7 |
| 枯葉進行 (autumn-leaves) | 8 | マイナー | ジャズ, ボサノバ | jazzy | 懐かしい, 切ない, おしゃれ, ロマンチック | Aメロ, サビ, ソロ・間奏 | iv7 - VII7 - IIIM7 - VIM7 - iv7 - V7 - i7 - i7 |
| ピカルディ終止 (picardy-close) | 4 | マイナー | −(汎用) | soft, pop, jazzy | 前向き, 懐かしい, 落ち着いた | アウトロ | iv - V7 - I - I |
| マイナー・ソウルリフト (minor-soul-lift) | 4 | マイナー | R&B, ネオソウル, ヒップホップ | soul, jazzy | 明るい, おしゃれ, 前向き | サビ, Bメロ, Aメロ | VIM7 - VII7 - i7 - i7 |
| ファンク・ストラット (funk-strut) | 4 | マイナー | ファンク, ヒップホップ, ソウル | soul, loop | おしゃれ, 疾走感, 明るい | Aメロ, ソロ・間奏 | i7 - iv7 - i7 - IV7 |
| マイナー・ランウェイ (minor-runway) | 4 | マイナー | K-POP, EDM, ダブステップ | pop, loop | おしゃれ, ダーク, 疾走感 | Aメロ, サビ | i - VII - VI - III |
| EDMマイナーリフト (edm-minor-lift) | 4 | マイナー | EDM, フューチャーベース, ダブステップ | loop, pop | エモい, 疾走感, ダーク | Bメロ, サビ | VI - VII - i - VII |
| ナイト・ドライブ (night-drive) | 4 | マイナー | ヒップホップ, ダブステップ, EDM | loop, soul, heavy | ダーク, ミステリアス, 疾走感 | Aメロ, ソロ・間奏 | i - iv - VI - VII |
| マイナー・キャンプファイア (minor-campfire) | 4 | マイナー | フォーク, バラード | soft, pop | 悲しい, 落ち着いた, 懐かしい | Aメロ, イントロ | i - iv - i - V7 |
| マイナー・フロート (minor-float) | 4 | マイナー | −(汎用) | soft, jazzy, pop | ミステリアス, ロマンチック, 切ない | Cメロ・ブリッジ, イントロ | VIM7 - V7 - VIM7 - V7 |
| マイナー・ペダル (minor-pedal) | 2 | マイナー | −(汎用) | rock, heavy, loop | ダーク, ミステリアス, 落ち着いた | イントロ, ブレイクダウン | i - iv/i |
| スロウ・バーン (slow-burn) | 4 | マイナー | ソウル, R&B, バラード | soul, jazzy, soft | ロマンチック, ダーク, 切ない | Aメロ, サビ | i7 - VIM7 - iv7 - V7 |
| トラップ・スライド (trap-slide) | 2 | マイナー | ヒップホップ, ダブステップ | loop, heavy, soul | ダーク, ミステリアス, おしゃれ | Aメロ, イントロ, ブレイクダウン | i - VI |
| マイナー・オデッセイ(8小節) (minor-odyssey-8) | 8 | マイナー | アニソン, バラード | pop, soft, rock | 悲しい, エモい, ダーク, 切ない | Aメロ, サビ | i - iv - VII - III - VI - iv - V7 - i |
| マイナー・ライズ (minor-rise) | 4 | マイナー | EDM, K-POP, アニソン | pop, loop, rock | エモい, 前向き, 疾走感 | サビ, Bメロ | i - III - VI - VII |
| エオリアン・プッシュ (aeolian-push) | 4 | マイナー | EDM, アニソン, ロック | pop, rock, loop | エモい, 疾走感, ダーク | Bメロ, サビ | i - VI - VII - VII |
| マイナー・ドライブ (minor-drive-two) | 4 | マイナー | パンク, メタル, ロック | rock, heavy, loop | 疾走感, 怒り, ダーク | Aメロ, ソロ・間奏 | i - i - VII - VII |
| モーダル・マイナーヴァンプ (modal-minor-vamp) | 2 | マイナー | フォーク, ロック | soft, rock, loop | ミステリアス, 落ち着いた, ダーク | イントロ, Aメロ | i - v |
| ソフト・エオリアンラン (soft-aeolian-run) | 4 | マイナー | フォーク, ロック, EDM | soft, rock, pop | ミステリアス, 切ない, 前向き | Aメロ, Bメロ | i - v - VI - VII |
| メランコリー・ループ (melancholy-loop) | 4 | マイナー | バラード, フォーク, エモ | soft, pop, rock | 悲しい, 切ない, 懐かしい | Aメロ, サビ | i - III - VII - iv |
| サブトニック・ヴァンプ (subtonic-vamp) | 2 | マイナー | ロック, EDM, パンク | rock, loop | 疾走感, ダーク, エモい | イントロ, ソロ・間奏, Aメロ | i - VII |
| シーソー・ループ (see-saw-loop) | 4 | マイナー | lo-fi hip hop, ヒップホップ, EDM | loop, soul, pop | 落ち着いた, ダーク, おしゃれ | Aメロ, イントロ | i - VI - i - VII |
| オールドフォーク・ケーデンス (old-folk-cadence) | 4 | マイナー | フォーク, カントリー | soft, pop | 懐かしい, 落ち着いた, 悲しい | Aメロ, アウトロ | i - iv - v - i |
| マイナー4-7ループ (minor-four-seven) | 4 | マイナー | ロック, フォーク, ブルース | rock, pop, blues | 懐かしい, ダーク, 落ち着いた | Aメロ, サビ | i - iv - VII - i |
| フリジアン・ケーデンス (phrygian-cadence) | 4 | マイナー | メタル, ダブステップ | heavy | ダーク, ミステリアス, 怒り | Aメロ, ブレイクダウン | i - bII - iv - i |
| ナポリ終止 (neapolitan-cadence) | 4 | マイナー | バラード, ジャズ | soft, jazzy | 悲しい, ミステリアス, ロマンチック | Bメロ, アウトロ, Aメロ | iv - bII - V7 - i |
| フリジアン・ドミナントターン (phrygian-dominant-turn) | 4 | マイナー | メタル, ジャズ | heavy, jazzy | ミステリアス, 怒り, ダーク | Aメロ, ソロ・間奏 | i - bII - V7 - i |
| マイナー・ドミナントヴァンプ (minor-dominant-vamp) | 2 | マイナー | バラード, フォーク, ジャズ | soft, pop, jazzy | 悲しい, 切ない, ダーク | イントロ, Aメロ, Bメロ | i - V7 |
| マイナー偽終止 (minor-deception) | 4 | マイナー | バラード, アニソン | soft, pop | 悲しい, エモい, 切ない | Aメロ, Bメロ | i - V7 - VI - iv |
| マイナー・フルケーデンス (minor-full-cadence) | 4 | マイナー | フォーク, バラード, ジャズ | soft, pop, jazzy | 悲しい, 落ち着いた, 懐かしい | Aメロ, アウトロ | i - iv - V7 - i |
| マイナー6-5クローズ (minor-six-five) | 4 | マイナー | バラード, フォーク | soft, pop | 切ない, 悲しい, ロマンチック | Aメロ, アウトロ | i - VI - V7 - i |
| ラメントバス(転回形) (lament-inversion) | 4 | マイナー | バラード, ジャズ | soft, jazzy | 悲しい, 切ない, ロマンチック | Aメロ, Bメロ | i - i/VII - iv/VI - V7 |
| アンダルシア進行(8小節) (andalusian-8) | 8 | マイナー | フォーク, ロック | soft, rock | ダーク, ミステリアス, 懐かしい | Aメロ, ソロ・間奏 | i - i - VII - VII - VI - VI - V7 - V7 |
| マイナー循環(1-4-7-3) (minor-circle-four) | 4 | マイナー | ジャズ, ボサノバ, lo-fi hip hop | jazzy | おしゃれ, 懐かしい, 落ち着いた | Aメロ, ソロ・間奏 | i7 - iv7 - VII7 - IIIM7 |
| ジャズマイナー・ターン (jazz-minor-turn) | 4 | マイナー | ジャズ, ボサノバ | jazzy | おしゃれ, ダーク, ロマンチック | Aメロ, イントロ, ソロ・間奏 | iv7 - V7 - i7 - VIM7 |
| アンダルシア(セブンス) (andalusian-seventh) | 4 | マイナー | ジャズ, シティポップ, ボサノバ | jazzy, soul | おしゃれ, ミステリアス, ダーク | Aメロ, ソロ・間奏 | i7 - VII7 - VIM7 - V7 |
| フリジアン・ジャズヴァンプ (phrygian-jazz-vamp) | 2 | マイナー | ジャズ, ネオソウル, lo-fi hip hop | jazzy, soul | ミステリアス, おしゃれ, ダーク | イントロ, ソロ・間奏, Cメロ・ブリッジ | i7 - bIIM7 |
| スモーキー・ヴァンプ (smoky-vamp) | 2 | マイナー | ジャズ, lo-fi hip hop, ヒップホップ | jazzy, soul, loop | ダーク, おしゃれ, 落ち着いた | イントロ, Aメロ, ソロ・間奏 | i7 - v7 |
| ディープ・ヴァンプ (deep-vamp) | 2 | マイナー | R&B, ヒップホップ, ネオソウル | soul, loop, jazzy | ダーク, ロマンチック, 落ち着いた | イントロ, Aメロ | i7 - iv7 |
| ペンデュラム・ソウル (pendulum-soul) | 4 | マイナー | ソウル, R&B, ブルース | soul, jazzy, blues | ダーク, ロマンチック, 懐かしい | Aメロ, サビ | iv7 - i7 - iv7 - V7 |
| トラップ・ナイト (trap-night) | 4 | マイナー | ヒップホップ, ダブステップ, EDM | loop, heavy | ダーク, ミステリアス, 怒り | Aメロ, ブレイクダウン | i - bII - VI - VII |
| lo-fiマイナーサークル (lofi-minor-circle) | 4 | マイナー | lo-fi hip hop, ジャズ, ネオソウル | jazzy, soul | 落ち着いた, 懐かしい, おしゃれ | Aメロ, イントロ | i7 - VIM7 - IIIM7 - VII7 |
| レラティブ・フォール (relative-fall) | 4 | マイナー | シティポップ, lo-fi hip hop, R&B | jazzy, soul | 懐かしい, 切ない, おしゃれ | Aメロ, アウトロ | IIIM7 - VII7 - i7 - i7 |
| サード・スタック (third-stack) | 4 | マイナー | ジャズ, ネオソウル | jazzy, soul | おしゃれ, ミステリアス, ロマンチック | Aメロ, Cメロ・ブリッジ | i7 - IIIM7 - VIM7 - V7 |
| エピック・スウェル (epic-swell) | 4 | マイナー | EDM, アニソン, メタル | pop, rock, loop | エモい, ダーク, 前向き | Bメロ, サビ | VI - III - i - VII |
| リフト・ヴァンプ (lift-vamp) | 2 | マイナー | EDM, フューチャーベース, アニソン | loop, pop | エモい, 前向き, 疾走感 | Bメロ, イントロ | VI - VII |
| クール・ドリフト (cool-drift) | 4 | マイナー | K-POP, R&B, EDM | pop, soul, loop | おしゃれ, ダーク, 切ない | Aメロ, サビ | i - VI - iv - VII |
| ハーフタイム・スウェイ (half-time-sway) | 4 | マイナー | ヒップホップ, lo-fi hip hop, ダブステップ | loop, soul, heavy | ダーク, 落ち着いた, ミステリアス | Aメロ, ブレイクダウン, イントロ | i - i - iv - iv |
| フォルス・ブライト (false-bright) | 4 | マイナー | K-POP, EDM, アニソン | pop, loop | 明るい, エモい, 前向き | サビ, Bメロ | VI - VII - III - III |
| フェード・ダウン (fade-down) | 4 | マイナー | バラード, エモ, ロック | soft, rock, pop | 切ない, 悲しい, ダーク | Aメロ, アウトロ | i - VII - VI - iv |
| フリジアン・プラガル (phrygian-plagal) | 4 | マイナー | メタル, メタルコア, ポストハードコア | heavy | ダーク, 怒り, ミステリアス | Aメロ, ブレイクダウン, ソロ・間奏 | i - iv - bII - i |
| クロマチック・サラウンド (chromatic-surround) | 4 | マイナー | メタル, メタルコア | heavy | 怒り, ミステリアス, ダーク | ソロ・間奏, ブレイクダウン | i - VII - bII - i |
| ソンバー・ターン (somber-turn) | 4 | マイナー | バラード, フォーク, アニソン | soft, pop | 悲しい, 切ない, 懐かしい | Aメロ, サビ | i - VI - III - iv |
| マイナーポップ・ケーデンス (minor-pop-cadence) | 4 | マイナー | アニソン, K-POP, J-POP | pop, soft | エモい, 悲しい, 前向き | Bメロ, サビ | VI - iv - i - V7 |
| ダブル・ケーデンス (double-cadence-minor) | 4 | マイナー | フォーク, ジャズ | soft, jazzy, pop | 落ち着いた, 悲しい, 懐かしい | アウトロ, Aメロ | iv - i - V7 - i |
| フリジアン・ディセント (phrygian-descent) | 4 | マイナー | メタル, フォーク | heavy, jazzy | ミステリアス, ダーク, 怒り | Bメロ, ソロ・間奏, Cメロ・ブリッジ | iv - III - bII - i |
| エオリアン・ストーリー(8小節) (aeolian-story-8) | 8 | マイナー | ロック, アニソン, エモ | rock, pop | エモい, 切ない, ダーク | Aメロ, サビ | i - VII - VI - VII - i - VII - VI - V7 |
| ベルベット・スイープ (velvet-sweep) | 4 | マイナー | R&B, ソウル, ジャズ | soul, jazzy | ロマンチック, ダーク, おしゃれ | サビ, Aメロ | i7 - iv7 - VIM7 - V7 |
| 12小節マイナーブルース(ソウル) (minor-blues-12-soul) | 12 | マイナー | ブルース, ソウル | blues, soul | ダーク, 懐かしい, 落ち着いた, 悲しい | Aメロ, ソロ・間奏 | i7 - iv7 - i7 - i7 - iv7 - iv7 - i7 - i7 - VI7 - V7 - i7 - V7 |
| マイナー・ドッペルドミナント (minor-dominant-approach) | 4 | マイナー | ジャズ, ボサノバ | jazzy | おしゃれ, ミステリアス, ダーク | Bメロ, アウトロ, ソロ・間奏 | II7 - V7 - i - i |
| レラティブ・リフト (relative-lift) | 4 | マイナー | EDM, K-POP, フューチャーベース | pop, loop | 明るい, エモい, 前向き | サビ, Aメロ | i - VI - VII - III |
| ドリアン・カラー (dorian-color) | 4 | マイナー | ファンク, ロック | soul, rock, jazzy | おしゃれ, ミステリアス, 落ち着いた | Aメロ, ソロ・間奏 | i - III - IV - VI |
| ラテンロック・ループ (latin-rock-loop) | 4 | マイナー | ロック, ファンク | rock, soul, loop | 疾走感, おしゃれ, 明るい | Aメロ, ソロ・間奏, サビ | i - IV - i - VII |
| マイナー・バックドアクローズ (minor-backdoor-close) | 4 | マイナー | ジャズ, lo-fi hip hop, R&B | jazzy, soul | 落ち着いた, おしゃれ, ダーク | アウトロ, Aメロ | iv - VII - i - i |
| ラメント・リフト (lament-lift) | 4 | マイナー | ロック, バラード, エモ | rock, soft, pop | エモい, 切ない, 前向き | Aメロ, Bメロ | i - i/VII - VI - VII |
| トレーラー・ビルド(8小節) (trailer-build-8) | 8 | マイナー | メタル, EDM, アニソン | heavy, rock, pop | ダーク, 怒り, エモい, 疾走感 | Bメロ, サビ | i - VI - III - VII - iv - VI - V7 - V7 |
| プッシュ・ヴァンプ (push-vamp) | 2 | マイナー | −(汎用) | 全タグ | −(汎用) | Bメロ | iv - V7 |
| フォークダンス(8小節) (folk-dance-8) | 8 | マイナー | フォーク | soft, pop | 懐かしい, 悲しい, 疾走感 | Aメロ, サビ, ソロ・間奏 | i - V7 - i - V7 - VI - iv - V7 - i |
| レラティブ・スパイラル (relative-spiral) | 4 | マイナー | エモ, ロック, アニソン | rock, pop | エモい, 切ない, ダーク | サビ, Bメロ | III - VI - VII - i |
| マイナー・アーチ (minor-arch) | 4 | マイナー | バラード, シティポップ | soft, pop, jazzy | 切ない, ロマンチック, ミステリアス | Aメロ, Cメロ・ブリッジ | i - III - VI - iv |
| ドリアン・ケーデンス (dorian-cadence) | 4 | マイナー | ファンク, ネオソウル, ジャズ | soul, jazzy | おしゃれ, 明るい, ミステリアス | Aメロ, Bメロ | i7 - IV7 - VIM7 - V7 |
| ダーク・ロマンス (dark-romance) | 4 | マイナー | ジャズ, バラード | jazzy, soft | ロマンチック, ミステリアス, ダーク | Aメロ, Cメロ・ブリッジ | i - bII - VI - V7 |
| クラウド・ヴァンプ (cloud-vamp) | 2 | マイナー | lo-fi hip hop, ネオソウル, フューチャーベース | jazzy, soul, loop | 落ち着いた, ロマンチック, 切ない | イントロ, Aメロ | VIM7 - i7 |
| マイナー・フォーム(16小節) (minor-form-16) | 16 | マイナー | アニソン, EDM | pop, rock, loop | エモい, ダーク, 疾走感, 前向き | サビ, Aメロ | i - VI - III - VII - i - VI - III - VII - iv - VI - i - VII - iv - iv - V7 - V7 |
| シャドウ・ドリフト (shadow-drift) | 4 | マイナー | ダブステップ, メタルコア, ヒップホップ | heavy, loop | ダーク, ミステリアス, 怒り | Aメロ, ブレイクダウン | i - iv - VI - bII |
| マイナーサークル・ドリフト (minor-circle-drift) | 4 | マイナー | ジャズ, ボサノバ, シティポップ | jazzy | 懐かしい, おしゃれ, 落ち着いた | Aメロ, ソロ・間奏, イントロ | i7 - VII7 - IIIM7 - VIM7 |
| レラティブ・ヴァンプ (relative-vamp) | 2 | マイナー | lo-fi hip hop, フォーク, エモ | soft, loop, pop | 切ない, 落ち着いた, 懐かしい | イントロ, Aメロ | i - III |
| ドーン・リフト (dawn-lift) | 4 | マイナー | フューチャーベース, EDM, アニソン | pop, loop | 前向き, エモい, 明るい | サビ, Bメロ | VI - VII - i - III |

## 2. 表記の凡例

### コード進行(ローマ数字度数)

- 1トークン = 1小節。大文字=メジャーコード、小文字=マイナーコード
- `M7` = メジャーセブンス、`7` = セブンス、`/x` = 分数コード(ベース音を度数で指定)、`b` = 半音下(借用和音・モーダルインターチェンジ)
- マイナーのテンプレートはナチュラルマイナー度数(bなし)で表記し、和声的短音階のドミナントは `V7` で表す
- 文法上 sus4 / dim / aug / m7b5 は表現不可のため不使用(`progressionTemplates.js` 冒頭コメントより)

### 列の意味

- **ジャンル**: テンプレートが直接マッチするジャンル(`genres`)。`−(汎用)` は指定なし=タグ経由でマッチ
- **タグ**: ジャンルとのマッチングに使う構成ファミリー(pop / rock / soft / jazzy / soul / loop / heavy / blues)。「全タグ」= 8タグすべて
- **ムード**: 適合ムード(`moods`)。`−(汎用)` はムードを問わない
- **役割**: 使われるセクションの役割(`roles`)。表示は イントロ=intro / Aメロ=verse / Bメロ=build(Bメロ・プリコーラス) / サビ=chorus / Cメロ・ブリッジ=bridge / ソロ・間奏=inst / ブレイクダウン=break / アウトロ=outro

## 3. ジャンル一覧(全25件)

テンポ・セブンス率は `GENRES`、テンプレタグは `GENRE_FAMILIES`、構成ファミリーは `GENRE_FAMILY` より。

| ジャンル | id | 基準テンポ(BPM) | セブンス率 | テンプレタグ | 構成ファミリー |
|---|---|---|---|---|---|
| J-POP | jpop | 122 | 0.15 | pop | jpop |
| シティポップ | citypop | 102 | 0.9 | jazzy, soul | groove |
| K-POP | kpop | 120 | 0.2 | pop, loop | jpop |
| EDM | edm | 126 | 0.05 | loop, pop | edm |
| ダブステップ | dubstep | 140 | 0 | loop, heavy | edm |
| フューチャーベース | futurebass | 150 | 0.7 | pop, jazzy | edm |
| ソウル | soul | 92 | 0.85 | soul, jazzy | groove |
| ネオソウル | neosoul | 78 | 1.0 | soul, jazzy | groove |
| ファンク | funk | 104 | 0.9 | soul, loop | groove |
| R&B | rnb | 88 | 0.95 | soul | groove |
| ヒップホップ | hiphop | 92 | 0.5 | loop, soul | groove |
| lo-fi hip hop | lofi | 78 | 0.95 | jazzy, soul | groove |
| ボサノバ | bossa | 84 | 1.0 | jazzy | jazz |
| ロック | rock | 142 | 0.05 | rock, pop | rock |
| パンク | punk | 180 | 0 | rock, loop | rock |
| メタル | metal | 158 | 0 | heavy | metal |
| メタルコア | metalcore | 150 | 0 | heavy | metal |
| ポストハードコア | posthardcore | 155 | 0 | heavy, rock | metal |
| エモ | emo | 138 | 0.1 | rock, pop | rock |
| フォーク | folk | 96 | 0.1 | soft, pop | ballad |
| カントリー | country | 112 | 0.1 | pop, blues | rock |
| ジャズ | jazz | 96 | 1.0 | jazzy | jazz |
| ブルース | blues | 100 | 1.0 | blues | blues |
| バラード | ballad | 74 | 0.35 | soft, pop | ballad |
| アニソン | anison | 148 | 0.2 | pop | jpop |

セブンス率 = 生成時にセブンスコードを採用する基準確率(0〜1)。

## 4. ムード一覧(全13件)

| ムード | id | テンポ係数 | セブンス補正 |
|---|---|---|---|
| 明るい | bright | 1.08 | 0 |
| 悲しい | sad | 0.82 | +0.1 |
| 切ない | wistful | 0.88 | +0.05 |
| おしゃれ | chic | 0.97 | +0.35 |
| 怒り | aggressive | 1.18 | −0.1 |
| 落ち着いた | calm | 0.78 | +0.15 |
| エモい | emo | 1.12 | +0.05 |
| ダーク | dark | 0.92 | 0 |
| 懐かしい | nostalgic | 0.9 | +0.25 |
| 疾走感 | speedy | 1.25 | −0.05 |
| ロマンチック | romantic | 0.85 | +0.3 |
| ミステリアス | mysterious | 0.9 | +0.15 |
| 前向き | hopeful | 1.02 | +0.05 |

テンポ係数 = ジャンル基準テンポに掛ける倍率。セブンス補正 = セブンス率への加算値。UI配色(`accent` / `accentSoft`)は音楽的パラメータではないため省略。

## 5. セクション一覧(全11件)

| セクション | id | 生成上の役割 |
|---|---|---|
| イントロ | intro | intro |
| Aメロ | a | verse |
| Bメロ | b | build |
| プリコーラス | prechorus | build |
| サビ | chorus | chorus |
| Cメロ | c | bridge |
| ブリッジ | bridge | bridge |
| ソロ | solo | inst |
| 間奏 | inter | inst |
| ブレイクダウン | breakdown | break |
| アウトロ | outro | outro |

生成上の役割は §1 の「役割」列とテンプレートを結びつけるキー(`SECTION_ROLES`)。

## 6. 曲構成レシピ(全8ファミリー)

「おまかせ曲構成」で使うファミリー別レシピ(`FAMILY_RECIPES`)。表記は「セクション名+小節数」。中核ユニットは目標尺から逆算した回数だけ繰り返され、オプションは確率 p でラスサビ前に挿入される。

| ファミリー | 曲頭 | 中核ユニット | つなぎ | オプション(確率) | ラスサビ | 曲尾 |
|---|---|---|---|---|---|---|
| jpop | イントロ4 | Aメロ8 → Bメロ8 → サビ8 | 間奏4 | ソロ8 (p=0.4, テンポ135以上), Cメロ8 (p=0.7) | サビ8 | アウトロ4 |
| rock | イントロ4 | Aメロ8 → サビ8 | 間奏4 | ソロ8 (p=0.7), Bメロ8 (p=0.4), Cメロ8 (p=0.3) | サビ8 | アウトロ4 |
| ballad | イントロ4 | Aメロ8 → プリコーラス4 → サビ8 | − | ブリッジ8 (p=0.6), Cメロ8 (p=0.3) | サビ8 | アウトロ4 |
| groove | イントロ4 | Aメロ8 → サビ8 | − | Bメロ8 (p=0.5), ブリッジ8 (p=0.4) | サビ8 | アウトロ4 |
| edm | イントロ8 | Aメロ8 → Bメロ4 → サビ8 (verse/build/drop) | ブレイクダウン8 | ソロ8 (p=0.3) | サビ8 | アウトロ8 |
| jazz | イントロ4 | Aメロ8 → Bメロ8 → Aメロ8 (AABA) | − | ソロ16 (p=0.9), ソロ16 (p=0.5) | Aメロ8 | アウトロ4 |
| blues | イントロ4 | Aメロ12 (12小節ブルース) | − | ソロ12 (p=0.9), ソロ12 (p=0.5) | Aメロ12 | アウトロ4 |
| metal | イントロ8 | Aメロ8 → Bメロ8 → サビ8 | 間奏4 | ブレイクダウン8 (p=0.7), ソロ8 (p=0.8), Cメロ8 (p=0.3) | サビ8 | アウトロ4 |
