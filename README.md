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
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run lint     # ESLint
npm test         # ユニットテスト
npm run preview  # ビルド済みアプリのプレビュー
```

## 機能

- **教科フィルター** — 全教科または特定教科に絞り込み
- **2フェーズ学習** — 学習（確認）→ テスト（自己採点）
- **チャンク学習** — 1セット3〜15枚で区切って学習（デフォルト6枚）
- **シャッフル** — カードをランダム順で出題
- **不正解再試行** — セット内・全体の不正解カードだけ再挑戦

## 問題データの形式

`src/assets/data/questions.json` を差し替えることで任意の問題セットを使用できる。ローダー画面でJSONファイルをドロップしてもよい。

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
