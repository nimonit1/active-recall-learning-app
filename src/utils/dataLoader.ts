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

/** src/assets/data/ 内の全JSONを自動検出してロード。スキーマ不正のファイルはスキップ */
export async function loadBuiltinDecks(): Promise<{ filename: string; data: Data }[]> {
  const modules = import.meta.glob<{ default: unknown }>('../assets/data/*.json')
  const results: { filename: string; data: Data }[] = []
  for (const [path, loader] of Object.entries(modules)) {
    try {
      const mod = await loader()
      const data = validateData(mod.default)
      const filename = path.split('/').pop() ?? path
      results.push({ filename, data })
    } catch (e) {
      console.warn(`[loadBuiltinDecks] スキーマ不正のためスキップ: ${path}`, e)
    }
  }
  return results
}
