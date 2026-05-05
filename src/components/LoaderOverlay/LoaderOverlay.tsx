// JSONファイルの読み込み画面。ファイル選択・ドラッグ&ドロップ・デフォルトデータ使用に対応
import { useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { loadFromFile, validateData } from '../../utils/dataLoader'
import type { Data } from '../../types'
import defaultDataJson from '../../assets/data/questions.json'
import styles from './LoaderOverlay.module.css'

interface Props {
  onLoad: (data: Data) => void
}

export function LoaderOverlay({ onLoad }: Props): React.ReactElement {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

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

  /** ビルド済みデフォルトデータを直接使用する */
  function useDefault(): void {
    try {
      onLoad(validateData(defaultDataJson))
    } catch {
      setError('デフォルトデータの読み込みに失敗しました')
    }
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
      <button className={styles.defaultBtn} onClick={useDefault}>
        デフォルトデータを使用
      </button>
    </div>
  )
}
