// 現在の学習フェーズ（📖学習 / 🧠テスト）を示すバナーコンポーネント
import { useAppContext } from '../../hooks/AppContext'
import styles from './PhaseBanner.module.css'

export function PhaseBanner(): React.ReactElement {
  const { state } = useAppContext()
  const isTest = state.phase === 'test'

  return (
    <div className={styles.banner}>
      <span className={`${styles.pill} ${isTest ? styles.test : ''}`}>
        {isTest ? '🧠 テスト' : '📖 学習'}
      </span>
      <span className={styles.label}>
        {isTest ? 'タップして答えを確認し、自己採点してください' : '問題と答えを確認してください'}
      </span>
    </div>
  )
}
