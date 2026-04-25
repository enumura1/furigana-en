# EN Gloss Reader

日本語のWebページを Chrome 内蔵の Gemini Nano (Prompt API) で英訳し、
英訳の中で CEFR B2 以上の難単語にだけ日本語訳をカッコ書きで併記する Chrome 拡張です。
英語学習者が普段読んでいる日本語記事を、難語で詰まらずに英語で読む練習に使えます。

> 例: 「アルゴリズムは顕著な収束性を示す」が、ページ上で
> 「The algorithm exhibits(示す) remarkable(注目に値する) convergence(収束) properties.」
> のように置換されます。

すべての処理は端末内 (Chrome 内蔵の Gemini Nano) で行われ、
**外部サーバとの通信は一切ありません。**詳細は [PRIVACY.md](./PRIVACY.md) を参照してください。

## 動作要件

- Google Chrome 140 以降 (デスクトップ版)
- Prompt API (Gemini Nano) が利用可能なデバイス
  - 22GB 以上のストレージ空き容量
  - 4GB 以上の VRAM (GPU 推奨)
  - メータリング接続でない安定した回線 (初回モデルダウンロード時)
- 詳細は Chrome 公式ドキュメント
  ([Prompt API](https://developer.chrome.com/docs/ai/prompt-api)) を参照

## インストール (開発版)

1. このリポジトリをクローンします。

   ```bash
   git clone https://github.com/enumura1/furigana-en.git
   ```

2. Chrome で `chrome://extensions/` を開き、右上の "デベロッパーモード" を有効化。
3. "パッケージ化されていない拡張機能を読み込む" を押し、クローンしたディレクトリ
   (`manifest.json` がある階層) を選択。
4. アドレスバー右の拡張アイコンをピン留めしておくと便利です。

## 使い方

1. 翻訳したい日本語ページを開く。
2. 拡張アイコンをクリックして popup を開く。
3. **このページで実行** を押すと、本文段落が英訳に置換され、難単語に日本語訳が付きます。
4. **元に戻す** を押すと原文に戻ります。
5. **自動実行** を ON にすると、以後ページ読み込み時に自動で翻訳します
   (重い処理なので注意)。

初回はモデルのダウンロードが走ることがあります。右上のバナーで進捗を確認できます。

## 既知の制限

- Chrome 140 未満、モバイル版、Prompt API 非対応端末では動作しません。
- `chrome://`、`about:`、`view-source:` などの内部ページでは実行できません。
- 段落単位で翻訳します。文をまたぐ参照や全体の論調までは保証されません。
- 800 文字を超える段落はスキップされます (コンソール warn)。
- LLM の出力には誤訳・誤抽出が含まれ得ます。学習補助用途にとどめてください。
- SPA の動的に追加されるコンテンツは現状取り扱いません (今後の課題)。

## テスト

`test/fixtures/` に手動確認用の HTML サンプルがあります。
利用方法は [test/fixtures/README.md](./test/fixtures/README.md) を参照してください。
特に `xss-attempt.html` でプロンプトインジェクションと XSS の安全性を確認できます。

## プライバシー

ページ本文・翻訳結果ともに外部送信せず、保存もしません。
詳細は [PRIVACY.md](./PRIVACY.md) を参照してください。

## ライセンス

MIT
