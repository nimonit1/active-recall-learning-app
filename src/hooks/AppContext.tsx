// アプリ全体の状態管理コンテキスト・Reducer・Providerを定義するモジュール
import { createContext, useContext, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { AppState, AppAction, Result } from '../types'
import { fisherYates } from '../utils/shuffle'

const initialState: AppState = {
  data: null,
  deck: [],
  results: [],
  chunkStart: 0,
  chunkSize: 6,
  phase: 'study',
  studyIdx: 0,
  testIdx: 0,
  testRevealed: false,
  currentSubject: 'all',
  screen: 'loader',
  prevScreen: 'loader',
}

/** 現在チャンクの末尾インデックス（exclusive）を算出するヘルパー */
function calcChunkEnd(state: AppState): number {
  return Math.min(state.chunkStart + state.chunkSize, state.deck.length)
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_DATA': {
      const deck = [...action.payload.cards]
      return {
        ...state,
        data: action.payload,
        deck,
        results: deck.map((): Result => null),
        chunkStart: 0,
        currentSubject: 'all',
        phase: 'study',
        studyIdx: 0,
        testIdx: 0,
        testRevealed: false,
        screen: 'session',
      }
    }

    case 'SET_SUBJECT': {
      const allCards = state.data?.cards ?? []
      const deck =
        action.payload === 'all'
          ? [...allCards]
          : allCards.filter((c) => c.subject === action.payload)
      return {
        ...state,
        currentSubject: action.payload,
        deck,
        results: deck.map((): Result => null),
        chunkStart: 0,
        phase: 'study',
        studyIdx: 0,
        testIdx: 0,
        testRevealed: false,
        screen: 'session',
      }
    }

    case 'START_SESSION': {
      const allCards = state.data?.cards ?? []
      let deck =
        state.currentSubject === 'all'
          ? [...allCards]
          : allCards.filter((c) => c.subject === state.currentSubject)
      if (action.payload.shuffle) deck = fisherYates(deck)
      return {
        ...state,
        deck,
        results: deck.map((): Result => null),
        chunkStart: 0,
        phase: 'study',
        studyIdx: 0,
        testIdx: 0,
        testRevealed: false,
        screen: 'session',
      }
    }

    case 'GO_STUDY': {
      const len = calcChunkEnd(state) - state.chunkStart
      const next = Math.max(0, Math.min(state.studyIdx + action.payload, len - 1))
      return { ...state, studyIdx: next }
    }

    case 'START_TEST':
      return { ...state, phase: 'test', testIdx: 0, testRevealed: false }

    case 'REVEAL_ANSWER':
      return { ...state, testRevealed: true }

    case 'JUDGE': {
      const newResults = [...state.results]
      newResults[state.chunkStart + state.testIdx] = action.payload
      const end = calcChunkEnd(state)
      const nextIdx = state.testIdx + 1
      // チャンク内の全カードを採点済みになったら画面遷移
      if (nextIdx >= end - state.chunkStart) {
        const screen = end >= state.deck.length ? 'allDone' : 'chunkDone'
        return { ...state, results: newResults, testIdx: nextIdx, screen }
      }
      return { ...state, results: newResults, testIdx: nextIdx, testRevealed: false }
    }

    case 'NEXT_CHUNK': {
      const end = calcChunkEnd(state)
      return { ...state, chunkStart: end, phase: 'study', studyIdx: 0, testIdx: 0, testRevealed: false, screen: 'session' }
    }

    case 'RETRY_CHUNK_NG': {
      const end = calcChunkEnd(state)
      const chunkCards = state.deck.slice(state.chunkStart, end)
      const chunkResults = state.results.slice(state.chunkStart, end)
      const wrongCards = chunkCards.filter((_, i) => chunkResults[i] === false)
      const newDeck = [...state.deck.slice(0, state.chunkStart), ...wrongCards, ...state.deck.slice(end)]
      const newResults: Result[] = [
        ...state.results.slice(0, state.chunkStart),
        ...wrongCards.map((): Result => null),
        ...state.results.slice(end),
      ]
      return { ...state, deck: newDeck, results: newResults, phase: 'study', studyIdx: 0, testIdx: 0, testRevealed: false, screen: 'session' }
    }

    case 'RESTART_NG': {
      const wrongCards = state.deck.filter((_, i) => state.results[i] === false)
      return {
        ...state,
        deck: wrongCards,
        results: wrongCards.map((): Result => null),
        chunkStart: 0,
        phase: 'study',
        studyIdx: 0,
        testIdx: 0,
        testRevealed: false,
        screen: 'session',
      }
    }

    case 'RESTART_ALL': {
      const allCards = state.data?.cards ?? []
      const deck =
        state.currentSubject === 'all'
          ? [...allCards]
          : allCards.filter((c) => c.subject === state.currentSubject)
      return {
        ...state,
        deck,
        results: deck.map((): Result => null),
        chunkStart: 0,
        phase: 'study',
        studyIdx: 0,
        testIdx: 0,
        testRevealed: false,
        screen: 'session',
      }
    }

    case 'CHANGE_CHUNK_SIZE':
      return { ...state, chunkSize: Math.max(3, Math.min(15, state.chunkSize + action.payload)) }

    case 'OPEN_HOW_TO_USE':
      // howToUse は loader 以外から開かれる想定だが型上 NonHelpScreen を保証するため as を使用
      return { ...state, prevScreen: state.screen as AppState['prevScreen'], screen: 'howToUse' }

    case 'CLOSE_HOW_TO_USE':
      return { ...state, screen: state.prevScreen }

    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextValue | null>(null)

/** アプリ全体に状態を提供するContextProvider */
export function AppProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

/** AppContextの値を取得するフック */
export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
