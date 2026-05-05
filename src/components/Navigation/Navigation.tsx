// 学習フェーズのカード前後移動ナビゲーション。最後のカードで「テスト開始」ボタンを表示する
import { useAppContext } from '../../hooks/AppContext'
import styles from './Navigation.module.css'

export function Navigation(): React.ReactElement {
  const { state, dispatch } = useAppContext()
  const { phase, chunkStart, chunkSize, deck, studyIdx, testIdx } = state

  // テストフェーズ中はナビを非表示
  if (phase === 'test') return <></>

  const chunkLen = Math.min(chunkStart + chunkSize, deck.length) - chunkStart
  const isLast = studyIdx === chunkLen - 1

  // カード番号はテストフェーズ中も参照できるよう testIdx も考慮
  const displayIdx = phase === 'study' ? studyIdx : testIdx

  return (
    <div className={styles.navRow}>
      <button
        className={styles.nbtn}
        disabled={displayIdx === 0}
        onClick={() => dispatch({ type: 'GO_STUDY', payload: -1 })}
      >
        ◀ 前へ
      </button>
      <span className={styles.navCt}>{displayIdx + 1} / {chunkLen}</span>
      {isLast ? (
        <button
          className={`${styles.nbtn} ${styles.startTest}`}
          onClick={() => dispatch({ type: 'START_TEST' })}
        >
          テスト開始 →
        </button>
      ) : (
        <button
          className={styles.nbtn}
          onClick={() => dispatch({ type: 'GO_STUDY', payload: 1 })}
        >
          次へ ▶
        </button>
      )}
    </div>
  )
}
