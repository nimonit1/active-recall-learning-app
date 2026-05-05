// 正解・不正解・残り枚数をリアルタイムに表示するスコアパネル
import { useAppContext } from '../../hooks/AppContext'
import { useScore } from '../../hooks/useScore'
import styles from './ScorePanel.module.css'

export function ScorePanel(): React.ReactElement {
  const { state } = useAppContext()
  const { correct, wrong, remaining } = useScore(state.results)

  return (
    <div className={styles.panel}>
      <div className={styles.item}>
        <span className={styles.ico}>✅</span>
        <span className={styles.val}>{correct}</span>
        <span className={styles.lbl}>正解</span>
      </div>
      <div className={styles.item}>
        <span className={styles.ico}>❌</span>
        <span className={styles.val}>{wrong}</span>
        <span className={styles.lbl}>不正解</span>
      </div>
      <div className={styles.item}>
        <span className={styles.ico}>📋</span>
        <span className={styles.val}>{remaining}</span>
        <span className={styles.lbl}>残り</span>
      </div>
    </div>
  )
}
