# DESIGN.md — アクティブリコール学習アプリ 設計書

## 1. 背景

`temp/active_recall_engine.html` としてバニラJSで動作するアクティブリコール学習ツールが存在した。単一ファイルで機能的には完成していたが、今後の機能追加・保守性向上のために React/TypeScript に移行することにした。

## 2. 目的

既存のバニラJS版と同等の機能をReactコンポーネントに分割・移行し、型安全性と保守性を確保する。

## 3. 目標

- 既存の学習フロー（学習フェーズ→テストフェーズ→チャンク完了→最終結果）を完全に再現する
- TypeScript strict モードで型エラーゼロを維持する
- ユニットテストでロジック（シャッフル・バリデーション）の正確性を保証する

## 4. 前提・制約

- スコープは既存機能の移行のみ（localStorage永続化・統計ダッシュボード等は対象外）
- 問題データのスキーマ（questions.json）は変更しない
- モバイルファースト、最大幅560pxのレイアウトを維持する

## 5. 結論

React Context + useReducer による状態管理を採用。コンポーネントは責務ごとに10個に分割し、CSS Modules でスコープ付きスタイルを適用する。

## 6. リスク・課題

| 項目 | 内容 |
|------|------|
| 進捗の永続化なし | ページリロードで進捗がリセットされる（バニラJS版から変更なし） |
| 問題データのバリデーション | 最小限のバリデーションのみ。不正なJSONは汎用エラーメッセージを表示 |

## 7. 詳細設計

### コンポーネント構成

```
App
├── LoaderOverlay（screen === 'loader'）
└── session/chunkDone/allDone 時
    ├── Header（タイトル・進捗バー・❓ボタン）
    ├── main
    │   ├── PhaseBanner（フェーズ表示）
    │   ├── TabBar（教科フィルター）
    │   ├── SettingsBar（チャンクサイズ・シャッフル）
    │   ├── ScorePanel（正解・不正解・残り）
    │   ├── Card + Navigation（screen === 'session'）
    │   ├── ChunkDoneOverlay（screen === 'chunkDone'）
    │   └── AllDoneOverlay（screen === 'allDone'）
    └── HowToUseOverlay（screen === 'howToUse'、全画面オーバーレイ）
```

### 状態管理

`AppContext.tsx` で `AppState` を `useReducer` で管理。`AppAction` の各アクションが状態遷移を定義する。

```
screen: 'loader' → 'session' → 'chunkDone' → 'session' → ... → 'allDone'
                       ↕ OPEN/CLOSE_HOW_TO_USE
                   'howToUse'（prevScreen に戻り先を保存）
```

### デザインシステム

CSSカスタムプロパティ（`src/index.css`）で色・影・角丸を一元管理。

| 変数 | 値 | 用途 |
|------|----|------|
| `--blue` | `#00809e` | ヘッダー・タブ・ボタン |
| `--orange` | `#ea8712` | プログレスバー・アクセント |
| `--green` | `#2da55e` | 正解フィードバック |
| `--red` | `#e03030` | 不正解フィードバック |
