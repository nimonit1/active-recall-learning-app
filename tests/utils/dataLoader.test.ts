// JSONデータバリデーション関数のユニットテスト
import { describe, it, expect } from 'vitest'
import { validateData } from '../../src/utils/dataLoader'

const validRaw = {
  meta: { title: 'テスト', subtitle: '', version: '1.0' },
  subjects: [{ id: 's1', label: '教科1', color: '#000' }],
  cards: [{ id: 'c1', subject: 's1', section: 'セクション', question: '問題', answer: '答え' }],
}

describe('validateData', () => {
  it('有効なデータをそのまま返す', () => {
    expect(() => validateData(validRaw)).not.toThrow()
    expect(validateData(validRaw)).toBe(validRaw)
  })

  it('nullを渡すとエラーをスロー', () => {
    expect(() => validateData(null)).toThrow('データが不正です')
  })

  it('文字列を渡すとエラーをスロー', () => {
    expect(() => validateData('invalid')).toThrow()
  })

  it('subjectsが配列でない場合にエラーをスロー', () => {
    expect(() => validateData({ ...validRaw, subjects: 'not-array' })).toThrow()
  })

  it('cardsが配列でない場合にエラーをスロー', () => {
    expect(() => validateData({ ...validRaw, cards: null })).toThrow()
  })

  it('metaが欠けている場合にエラーをスロー', () => {
    const { meta: _meta, ...rest } = validRaw
    expect(() => validateData(rest)).toThrow()
  })
})
