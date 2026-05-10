# アクティブリコール学習アプリ

アクティブリコール方式のフラッシュカード学習Webアプリ。中学3年生1学期中間テストの問題集をJSONファイルで管理し、ブラウザ上で学習・自己採点ができる。

## 技術スタック

| 項目 | 内容 |
|------|------|
| UI | React 18 |
| 型 | TypeScript (strict) |
| ビルド | Vite |
| CSS | CSS Modules |
| テスト | Vitest + @testing-library/react |

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開く。

## 開発コマンド

```bash
npm run dev               # 開発サーバー起動
npm run build             # 本番ビルド
npm run lint              # ESLint
npm test                  # ユニットテスト
npm run preview           # ビルド済みアプリのプレビュー
npm run validate:questions  # 問題JSONファイルのスキーマ検証
```

## 機能

- **教科フィルター** — 全教科または特定教科に絞り込み
- **2フェーズ学習** — 学習（確認）→ テスト（自己採点）
- **チャンク学習** — 1セット3〜15枚で区切って学習（デフォルト6枚）
- **シャッフル** — カードをランダム順で出題
- **不正解再試行** — セット内・全体の不正解カードだけ再挑戦
- **使い方ページ** — ヘッダーの❓ボタンからアクティブリコール学習法・操作手順・JSONの作り方を確認できる

## 問題データの管理

`src/assets/data/` に `.json` ファイルを置くだけで、アプリ起動時のローダー画面に「内蔵問題集」として自動的に一覧表示される。ファイル名は任意。表示名はJSON内の `meta.title` が使われる。

ローダー画面でJSONファイルをドロップ・選択することも可能（上書き読み込み）。

スキーマ不正のファイルは一覧から除外される（コンソールに警告が出る）。

### スキーマ検証

```bash
npm run validate:questions
```

`src/assets/data/` 内の全JSONを検証し、合否と枚数をコンソールに出力する。GitHub Actionsのデプロイ時にも自動で実行され、失敗があるとデプロイが止まる。

### JSONフォーマット

```json
{
  "meta": { "title": "タイトル", "subtitle": "サブタイトル", "version": "1.0" },
  "subjects": [
    { "id": "subject_id", "label": "表示名", "color": "#HEX" }
  ],
  "cards": [
    { "id": "c001", "subject": "subject_id", "section": "セクション名", "question": "問題文", "answer": "答え" }
  ]
}
```
