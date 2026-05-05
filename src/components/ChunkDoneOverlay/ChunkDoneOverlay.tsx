// チャンク（セット）完了画面。正解数・不正解数を表示し、次の行動を選択させる
import { useAppContext } from '../../hooks/AppContext'
import styles from './ChunkDoneOverlay.module.css'

export function ChunkDoneOverlay(): React.ReactElement {
  const { state, dispatch } = useAppContext()
  const { chunkStart, chunkSize, deck, results } = state

  const end = Math.min(chunkStart + chunkSize, deck.length)
  const chunkResults = results.slice(chunkStart, end)
  const correct = chunkResults.filter((r) => r === true).length
  const wrong = chunkResults.filter((r) => r === false).length
  const hasNext = end < deck.length

  return (
    <div className={styles.box}>
      <p className={styles.title}>セット完了！</p>
      <p className={styles.score}>
        {correct} / {chunkResults.length} 正解　|　❌ 不正解 {wrong} 問
      </p>
      <div className={styles.btns}>
        {wrong > 0 && (
          <button
            className={`${styles.btn} ${styles.retryNg}`}
            onClick={() => dispatch({ type: 'RETRY_CHUNK_NG' })}
          >
            ❌ 不正解だけもう一度
          </button>
        )}
        {hasNext ? (
          <button
            className={`${styles.btn} ${styles.next}`}
            onClick={() => dispatch({ type: 'NEXT_CHUNK' })}
          >
            次のセットへ →
          </button>
        ) : (
          <button
            className={`${styles.btn} ${styles.next}`}
            onClick={() => dispatch({ type: 'NEXT_CHUNK' })}
          >
            📊 結果を見る
          </button>
        )}
      </div>
    </div>
  )
}
