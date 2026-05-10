// デプロイ前バリデーション: src/assets/data/ 内の全JSONファイルのスキーマ検証
import { readFileSync, readdirSync, appendFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', 'src', 'assets', 'data')

/**
 * スキーマ検証（src/utils/dataLoader.ts の validateData 相当）
 * - meta / subjects / cards の存在確認
 * - cards[].subject が subjects[].id のいずれかであることを確認
 */
function validate(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('データが不正です')
  if (!raw.meta || !Array.isArray(raw.subjects) || !Array.isArray(raw.cards)) {
    throw new Error('meta / subjects / cards フィールドが必要です')
  }
  const subjectIds = new Set(raw.subjects.map((s) => s.id))
  const invalidCards = raw.cards.filter((c) => !subjectIds.has(c.subject))
  if (invalidCards.length > 0) {
    const ids = invalidCards.map((c) => c.id).slice(0, 3).join(', ')
    throw new Error(`不正な subject 値を持つカードが ${invalidCards.length} 件あります: ${ids}`)
  }
}

const files = readdirSync(dataDir).filter((f) => f.endsWith('.json'))

if (files.length === 0) {
  console.log('src/assets/data/ にJSONファイルが見つかりませんでした。')
  process.exit(0)
}

const results = []

for (const filename of files) {
  const filepath = join(dataDir, filename)
  try {
    const raw = JSON.parse(readFileSync(filepath, 'utf-8'))
    validate(raw)
    const cardCount = raw.cards.length
    console.log(`✅ ${filename} — ${cardCount} 枚`)
    results.push({ filename, ok: true, detail: `${cardCount} 枚` })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error(`❌ ${filename} — ${msg}`)
    results.push({ filename, ok: false, detail: msg })
  }
}

// GitHub Actions Step Summary にMarkdownテーブルを書き込む
const summaryPath = process.env.GITHUB_STEP_SUMMARY
if (summaryPath) {
  const rows = results
    .map(({ filename, ok, detail }) =>
      `| \`${filename}\` | ${ok ? '✅ 合格' : '❌ 失敗'} | ${detail} |`
    )
    .join('\n')
  const summary = [
    '## 問題JSONバリデーション結果',
    '',
    '| ファイル | 結果 | 詳細 |',
    '|---------|------|------|',
    rows,
    '',
  ].join('\n')
  appendFileSync(summaryPath, summary)
}

const failed = results.filter((r) => !r.ok)
if (failed.length > 0) {
  console.error(`\n${failed.length} ファイルが検証に失敗しました。`)
  process.exit(1)
}

console.log(`\n全 ${results.length} ファイルの検証に合格しました。`)
