# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動（http://localhost:5173）
npm run build    # 本番ビルド（tsc -b && vite build）
npm run lint     # ESLintチェック
npm test         # Vitestでユニットテスト実行
npm run preview  # ビルド済みアプリのプレビュー
```

## アーキテクチャ

React 18 + TypeScript (strict) + Vite のSPA。`temp/active_recall_engine.html`（バニラJS版）をReactに移行したもの。

### 学習フロー（2フェーズ）

1. **📖 学習フェーズ** — 問題と答えをセットで1枚ずつ確認（Navigation で前後移動）
2. **🧠 テストフェーズ** — カードをタップして答えを表示→自己採点（✅正解 / ❌もう一度）

カードは「チャンク」（デフォルト6枚）単位で処理。チャンク完了後は `ChunkDoneOverlay`、全チャンク完了後は `AllDoneOverlay` を表示する。

### 状態管理（`src/hooks/AppContext.tsx`）

`AppState` + `AppAction` を `useReducer` で管理するコンテキスト。全コンポーネントは `useAppContext()` で読み取り・`dispatch` でアクションを送出する。

**主要画面遷移（`AppState.screen`）**

```
loader → session ⇄ chunkDone → session → ... → allDone
```

**主要アクション**

| アクション | 内容 |
|-----------|------|
| `LOAD_DATA` | JSONをロード、`session` 画面へ |
| `SET_SUBJECT` | 教科フィルター変更・セッション再開始 |
| `START_SESSION` | セッション再開始（シャッフル有無） |
| `GO_STUDY` | 学習フェーズの前後移動（±1） |
| `START_TEST` | テストフェーズ開始 |
| `REVEAL_ANSWER` | 答えを表示 |
| `JUDGE` | 採点記録・次カードへ。最終カードで `chunkDone` または `allDone` へ遷移 |
| `RETRY_CHUNK_NG` | チャンク内の不正解カードを先頭に挿入して再試行 |
| `RESTART_NG` | 全不正解カードのみで再試行 |
| `CHANGE_CHUNK_SIZE` | チャンクサイズ変更（3〜15） |

### 問題データ（`src/assets/data/questions.json`）

```json
{
  "meta": { "title": "...", "subtitle": "...", "version": "..." },
  "subjects": [{ "id": "shakai", "label": "①社会（歴史）", "color": "#00809E" }],
  "cards": [{ "id": "s001", "subject": "shakai", "section": "...", "question": "...", "answer": "..." }]
}
```

`cards[].subject` の値は `subjects[].id` と一致している必要がある。

### CSS

グローバルCSS変数（`--blue`, `--orange` 等）を `src/index.css` の `:root` で定義。各コンポーネントは CSS Modules（`*.module.css`）でこれらを参照する。

### テスト

`tests/utils/` にユーティリティ関数のユニットテスト。新しいユーティリティを追加した場合は対応するテストを `tests/` 以下に作成する。
