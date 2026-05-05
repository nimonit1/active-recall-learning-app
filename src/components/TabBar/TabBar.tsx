// 教科フィルタータブ。クリックすると対象教科のカードのみに絞り込む
import { useAppContext } from '../../hooks/AppContext'
import styles from './TabBar.module.css'

export function TabBar(): React.ReactElement {
  const { state, dispatch } = useAppContext()
  const { data, currentSubject } = state

  if (!data) return <></>

  function select(id: string): void {
    dispatch({ type: 'SET_SUBJECT', payload: id })
  }

  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tab} ${currentSubject === 'all' ? styles.active : ''}`}
        onClick={() => select('all')}
      >
        全教科
      </button>
      {data.subjects.map((s) => (
        <button
          key={s.id}
          className={`${styles.tab} ${currentSubject === s.id ? styles.active : ''}`}
          onClick={() => select(s.id)}
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}
