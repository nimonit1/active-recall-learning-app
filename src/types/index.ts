// アクティブリコール学習アプリで使用する型・インターフェース定義をまとめたモジュール

/** 教科情報 */
export interface Subject {
  id: string
  label: string
  color: string
}

/** フラッシュカード1枚分のデータ */
export interface Card {
  id: string
  subject: string
  section: string
  question: string
  answer: string
}

/** questions.jsonのメタ情報 */
export interface DataMeta {
  title: string
  subtitle: string
  version: string
}

/** questions.json全体の型 */
export interface Data {
  meta: DataMeta
  subjects: Subject[]
  cards: Card[]
}

/** 学習フェーズ */
export type Phase = 'study' | 'test'

/** カード1枚の採点結果（null=未採点） */
export type Result = null | true | false

/** 現在表示中の画面 */
export type Screen = 'loader' | 'session' | 'chunkDone' | 'allDone'

/** アプリ全体の状態 */
export interface AppState {
  data: Data | null
  /** 現在の教科フィルタで絞り込まれたカード一覧 */
  deck: Card[]
  /** deck と並列に対応する採点結果配列 */
  results: Result[]
  /** 現在チャンクの開始インデックス */
  chunkStart: number
  /** 1チャンクあたりのカード枚数（3〜15） */
  chunkSize: number
  phase: Phase
  studyIdx: number
  testIdx: number
  testRevealed: boolean
  currentSubject: string
  screen: Screen
}

/** Reducerに送出するアクション */
export type AppAction =
  | { type: 'LOAD_DATA'; payload: Data }
  | { type: 'SET_SUBJECT'; payload: string }
  | { type: 'START_SESSION'; payload: { shuffle: boolean } }
  | { type: 'GO_STUDY'; payload: number }
  | { type: 'START_TEST' }
  | { type: 'REVEAL_ANSWER' }
  | { type: 'JUDGE'; payload: boolean }
  | { type: 'NEXT_CHUNK' }
  | { type: 'RETRY_CHUNK_NG' }
  | { type: 'RESTART_NG' }
  | { type: 'RESTART_ALL' }
  | { type: 'CHANGE_CHUNK_SIZE'; payload: number }
