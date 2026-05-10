# DESIGN_DETAILS.md — 設計補足資料

## 技術選定の根拠

### React Context + useReducer（Reduxを使わない理由）

アプリの状態は `AppState` 1つで完結しており、非同期処理もない（データ取得はローダー画面の限定的な処理のみ）。Reduxはミドルウェア・DevTools等の追加コストが発生するため、標準APIの useReducer + createContext で十分と判断した。

### CSS Modules（Tailwindを使わない理由）

バニラJS版のCSSカスタムプロパティ（`--blue`, `--orange` 等）をそのまま活用できるため、CSS Modulesを採用した。Tailwindは既存デザインシステムの書き直しが必要になり、移行コストが高い。

### Vitest（Jestを使わない理由）

Viteプロジェクトとの統合が最も自然で設定が最小限。Jestは `jest.config.ts` + `babel.config.ts` 等の追加設定が必要。

---

## チャンク管理ロジックの詳細

### `results` 配列

`deck` と並列で管理される `Result[]`（`null | true | false`）。  
- `null` — 未採点  
- `true` — 正解  
- `false` — 不正解

教科フィルター変更・セッション再開始時は全要素を `null` にリセットする。

### チャンク末尾インデックス（exclusive）

```typescript
const end = Math.min(chunkStart + chunkSize, deck.length)
```

これを `calcChunkEnd` として Reducer 内のヘルパー関数で一元管理している。

### `RETRY_CHUNK_NG` の実装

チャンク内の不正解カードを deck に再挿入する操作：

```
deck = [...deck[0..chunkStart], ...wrongCards, ...deck[end..]]
results = [...results[0..chunkStart], ...nulls, ...results[end..]]
```

これにより、不正解カードは「現在チャンクの先頭」から再出題される。チャンクサイズを超える場合は次のチャンクに溢れる設計。

### `allDone` 遷移タイミング

最後のカードへの `JUDGE` アクション時点で `end >= deck.length` を検出し、`screen: 'allDone'` に直接遷移する。`chunkDone` 画面を経由しない点が重要（原本のバニラJS版 `showChunkDone()` 内での `showAllDone()` 直接呼び出しに相当）。

---

## LoaderOverlay の内蔵問題集

`import.meta.glob('../assets/data/*.json')` で `src/assets/data/` 内の全JSONを遅延ロードする。Viteはビルド時にglobパターンを解決し、各ファイルを動的インポートとしてバンドルする。

```typescript
const modules = import.meta.glob<{ default: unknown }>('../assets/data/*.json')
for (const [path, loader] of Object.entries(modules)) {
  const mod = await loader()
  // mod.default にJSONの内容が入る
}
```

各JSONは `validateData()` でスキーマ検証し、合格したもののみ画面に表示する。不正なファイルはコンソール警告のみでユーザーには見せない。

---

## ファイルロードの優先順位

1. ファイルドロップ/ファイル選択 → `loadFromFile(file)` → `FileReader` API
2. 内蔵問題集リストを選択 → `import.meta.glob` で遅延ロード済みのデータを使用

---

## GitHub Actions バリデーション

`scripts/validate-questions.mjs` は Node.js 標準モジュールのみで実装（追加依存なし）。検証ロジックは `src/utils/dataLoader.ts` の `validateData` に加え、`cards[].subject` が `subjects[].id` に含まれるかの整合性チェックも行う。

`GITHUB_STEP_SUMMARY` 環境変数が存在する場合（GitHub Actions環境）、検証結果をMarkdownテーブルとしてStep Summaryに書き込む。1件でも失敗すると `process.exit(1)` でワークフローを停止し、以降のビルド・デプロイステップは実行されない。
