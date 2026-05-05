// チャンクサイズの変更・シャッフル再開始・通常再開始を行う設定バーコンポーネント
import { useAppContext } from '../../hooks/AppContext'
import styles from './SettingsBar.module.css'

export function SettingsBar(): React.ReactElement {
  const { state, dispatch } = useAppContext()

  return (
    <div className={styles.bar}>
      <div className={styles.chunkCtrl}>
        <button
          className={styles.chunkBtn}
          onClick={() => dispatch({ type: 'CHANGE_CHUNK_SIZE', payload: -1 })}
          aria-label="セット枚数を減らす"
        >
          −
        </button>
        <span className={styles.chunkVal}>{state.chunkSize}</span>
        <button
          className={styles.chunkBtn}
          onClick={() => dispatch({ type: 'CHANGE_CHUNK_SIZE', payload: 1 })}
          aria-label="セット枚数を増やす"
        >
          ＋
        </button>
        <span className={styles.chunkLabel}>枚/セット</span>
      </div>
      <button
        className={styles.ctrlBtn}
        onClick={() => dispatch({ type: 'START_SESSION', payload: { shuffle: true } })}
      >
        🔀 シャッフル
      </button>
      <button
        className={styles.ctrlBtn}
        onClick={() => dispatch({ type: 'START_SESSION', payload: { shuffle: false } })}
      >
        🔄 最初から
      </button>
    </div>
  )
}
