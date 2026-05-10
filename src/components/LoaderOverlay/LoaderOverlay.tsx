// JSONファイルの読み込み画面。ファイル選択・ドラッグ&ドロップ・内蔵問題集選択に対応
import { useRef, useState, useEffect } from 'react'
import type { DragEvent } from 'react'
import { loadFromFile, loadBuiltinDecks } from '../../utils/dataLoader'
import type { Data } from '../../types'
import styles from './LoaderOverlay.module.css'

interface Props {
  onLoad: (data: Data) => void
}

export function LoaderOverlay({ onLoad }: Props): React.ReactElement {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [builtinDecks, setBuiltinDecks] = useState<{ filename: string; data: Data }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  /** 内蔵問題集をマウント時に非同期ロード */
  useEffect(() => {
    void loadBuiltinDecks().then(setBuiltinDecks)
  }, [])

  /** ファイルを読み込んでonLoadに渡す */
  async function handleFile(file: File): Promise<void> {
    try {
      setError('')
      onLoad(await loadFromFile(file))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'ファイルの読み込みに失敗しました')
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0]
    if (file) void handleFile(file)
  }

  function onDrop(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) void handleFile(file)
  }

  return (
    <div className={styles.overlay}>
      <div
        className={`${styles.dropZone} ${dragging ? styles.dragging : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <div className={styles.icon}>📂</div>
        <p className={styles.label}>問題JSONファイルをここにドロップ</p>
        <p className={styles.sub}>または</p>
        <button className={styles.fileBtn} onClick={() => inputRef.current?.click()}>
          ファイルを選択
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".json"
          className={styles.hidden}
          onChange={onInputChange}
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
      {builtinDecks.length > 0 && (
        <div className={styles.builtinSection}>
          <p className={styles.builtinLabel}>内蔵問題集</p>
          <ul className={styles.builtinList}>
            {builtinDecks.map(({ filename, data }) => (
              <li key={filename}>
                <button
                  className={styles.builtinItem}
                  onClick={() => onLoad(data)}
                >
                  <span className={styles.builtinTitle}>{data.meta.title}</span>
                  {data.meta.subtitle && (
                    <span className={styles.builtinSub}>{data.meta.subtitle}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
