// アプリヘッダー。タイトルとチャンク進捗バーを表示する
import { useAppContext } from '../../hooks/AppContext'
import styles from './Header.module.css'

export function Header(): React.ReactElement {
  const { state } = useAppContext()
  const { data, deck, chunkStart, chunkSize } = state

  // 現在チャンク末尾位置を進捗として表示する
  const done = Math.min(chunkStart + chunkSize, deck.length)
  const pct = deck.length > 0 ? Math.round((done / deck.length) * 100) : 0

  return (
    <header className={styles.header}>
      <h1>
        {data?.meta.title ?? '学習アプリ'}
        {data?.meta.subtitle ? <span className={styles.subtitle}> | {data.meta.subtitle}</span> : null}
      </h1>
      <div className={styles.pbar}>
        <div className={styles.pbarFill} style={{ width: `${pct}%` }} />
      </div>
      <p className={styles.pbarLabel}>{deck.length > 0 ? `${done} / ${deck.length}` : ''}</p>
    </header>
  )
}
