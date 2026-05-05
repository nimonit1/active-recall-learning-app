// Fisher-Yatesシャッフル関数のユニットテスト
import { describe, it, expect } from 'vitest'
import { fisherYates } from '../../src/utils/shuffle'

describe('fisherYates', () => {
  it('同じ要素を含む配列を返す', () => {
    const original = [1, 2, 3, 4, 5]
    const result = fisherYates([...original])
    expect(result.sort((a, b) => a - b)).toEqual(original)
  })

  it('元の配列をインプレースで変更して返す', () => {
    const arr = [1, 2, 3]
    const result = fisherYates(arr)
    expect(result).toBe(arr)
  })

  it('空配列を渡すと空配列を返す', () => {
    expect(fisherYates([])).toEqual([])
  })

  it('要素が1つの配列をそのまま返す', () => {
    expect(fisherYates(['a'])).toEqual(['a'])
  })
})
