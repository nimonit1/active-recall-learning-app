// 最終結果画面。全カードの正答率・絵文字フィードバックと再挑戦ボタンを表示する
import { useAppContext } from '../../hooks/AppContext'
import { useScore } from '../../hooks/useScore'
import styles from './AllDoneOverlay.module.css'

/** 正答率に応じた絵文字フィードバックを返す */
function getEmoji(pct: number): string {
  if (pct === 100) return '🎊'
  if (pct >= 80) return '👏'
  if (pct >= 60) return '📖'
  return '💪'
}

export function AllDoneOverlay(): React.ReactElement {
  const { state, dispatch } = useAppContext()
  const { correct, wrong, total, percentage } = useScore(state.results)

  return (
    <div className={styles.box}>
      <p className={styles.emoji}>{getEmoji(percentage)}</p>
      <p className={styles.title}>お疲れさまでした！</p>
      <p className={styles.pct}>{percentage}%</p>
      <p className={styles.detail}>
        正解 {correct} 問 ／ 不正解 {wrong} 問 ／ 全 {total} 問
      </p>
      <div className={styles.btns}>
        <button
          className={`${styles.btn} ${styles.retryNg}`}
          disabled={wrong === 0}
          onClick={() => dispatch({ type: 'RESTART_NG' })}
        >
          ❌ 不正解だけもう一度
        </button>
        <button
          className={`${styles.btn} ${styles.restartAll}`}
          onClick={() => dispatch({ type: 'RESTART_ALL' })}
        >
          🔄 全問最初から
        </button>
      </div>
    </div>
  )
}
