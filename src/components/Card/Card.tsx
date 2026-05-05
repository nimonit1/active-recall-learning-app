// フラッシュカードコンポーネント。学習フェーズでは答えを表示し、テストフェーズでは自己採点を行う
import { useAppContext } from '../../hooks/AppContext'
import styles from './Card.module.css'

export function Card(): React.ReactElement {
  const { state, dispatch } = useAppContext()
  const { phase, deck, chunkStart, studyIdx, testIdx, testRevealed } = state

  const currentIdx = chunkStart + (phase === 'study' ? studyIdx : testIdx)
  const card = deck[currentIdx]

  if (!card) return <></>

  const isStudy = phase === 'study'

  /** テストフェーズでカードをタップしたら答えを表示する */
  function handleCardClick(): void {
    if (!isStudy && !testRevealed) dispatch({ type: 'REVEAL_ANSWER' })
  }

  function handleJudge(correct: boolean): void {
    dispatch({ type: 'JUDGE', payload: correct })
  }

  const cardClass = [
    styles.card,
    isStudy ? styles.cardStudy : styles.cardTest,
    isStudy ? styles.answered : '',
    !isStudy && testRevealed ? styles.revealed : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.wrap}>
      <div className={cardClass} onClick={handleCardClick}>
        <div className={styles.qWrap}>
          <p className={styles.secLabel}>{card.section}</p>
          <p className={styles.qLabel}>QUESTION</p>
          <p className={styles.qText}>{card.question}</p>
        </div>
        <div className={`${styles.answerBlock} ${isStudy || testRevealed ? styles.show : ''}`}>
          <p className={styles.aLabel}>ANSWER</p>
          <p className={styles.aVal}>{card.answer}</p>
        </div>
      </div>

      {/* テストフェーズ：答え未表示時のフリップヒント */}
      {!isStudy && !testRevealed && (
        <p className={styles.flipHint}>👆 タップして答えを確認</p>
      )}

      {/* テストフェーズ：答え表示後の自己採点ボタン */}
      {!isStudy && testRevealed && (
        <div className={styles.judgeRow}>
          <button
            className={`${styles.jbtn} ${styles.ng}`}
            onClick={(e) => { e.stopPropagation(); handleJudge(false) }}
          >
            <span>❌</span>
            <span className={styles.jbtnLbl}>もう一度</span>
          </button>
          <button
            className={`${styles.jbtn} ${styles.ok}`}
            onClick={(e) => { e.stopPropagation(); handleJudge(true) }}
          >
            <span>✅</span>
            <span className={styles.jbtnLbl}>正解！</span>
          </button>
        </div>
      )}
    </div>
  )
}
