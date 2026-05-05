// JSONデータの読み込みとスキーマバリデーション処理
import type { Data } from '../types'

/** 必須フィールドの存在確認によるスキーマバリデーション */
export function validateData(raw: unknown): Data {
  if (!raw || typeof raw !== 'object') throw new Error('データが不正です')
  const obj = raw as Record<string, unknown>
  if (!obj.meta || !Array.isArray(obj.subjects) || !Array.isArray(obj.cards)) {
    throw new Error('meta / subjects / cards フィールドが必要です')
  }
  return raw as Data
}

/** FileReaderによるローカルJSONファイルの読み込み */
export function loadFromFile(file: File): Promise<Data> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        resolve(validateData(JSON.parse(e.target?.result as string)))
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'))
    reader.readAsText(file)
  })
}
