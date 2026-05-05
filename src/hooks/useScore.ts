// results配列から正解・不正解・残りの件数を集計するフック
import { useMemo } from 'react'
import type { Result } from '../types'

export interface ScoreStats {
  correct: number
  wrong: number
  remaining: number
  total: number
  /** 採点済みカードに対する正答率（0〜100） */
  percentage: number
}

/** resultsをメモ化して集計する */
export function useScore(results: Result[]): ScoreStats {
  return useMemo(() => {
    const correct = results.filter((r) => r === true).length
    const wrong = results.filter((r) => r === false).length
    const remaining = results.filter((r) => r === null).length
    const answered = correct + wrong
    const percentage = answered > 0 ? Math.round((correct / answered) * 100) : 0
    return { correct, wrong, remaining, total: results.length, percentage }
  }, [results])
}
