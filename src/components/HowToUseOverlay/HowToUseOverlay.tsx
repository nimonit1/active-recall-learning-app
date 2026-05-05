// 使い方ページ。アクティブリコール学習法・アプリ操作手順・JSONの作り方を説明する全画面オーバーレイ
import { useAppContext } from '../../hooks/AppContext'
import styles from './HowToUseOverlay.module.css'

export function HowToUseOverlay(): React.ReactElement {
  const { dispatch } = useAppContext()

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        {/* ヘッダー */}
        <div className={styles.sheetHeader}>
          <span className={styles.sheetTitle}>📖 使い方</span>
          <button
            className={styles.closeBtn}
            onClick={() => dispatch({ type: 'CLOSE_HOW_TO_USE' })}
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {/* セクション1: アクティブリコールとは */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>🎯 アクティブリコールとは？</h2>
            <p className={styles.text}>
              「思い出そうとする行為」そのものが記憶を強化する学習法です。
              ただ読み返す（パッシブ学習）より、答えを隠して自分で引き出す（アクティブリコール）方が
              長期記憶に残りやすいことが多くの研究で示されています。
            </p>
            <div className={styles.compareBox}>
              <div className={styles.compareItem}>
                <span className={styles.compareBadge}>❌ 非効率</span>
                <span>教科書をただ読み返す・ノートを眺める</span>
              </div>
              <div className={styles.compareItem}>
                <span className={styles.compareBadge + ' ' + styles.ok}>✅ 効率的</span>
                <span>答えを隠して自分で思い出してから確認する</span>
              </div>
            </div>
          </section>

          {/* セクション2: アプリの操作手順 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>📱 アプリの使い方</h2>
            <ol className={styles.stepList}>
              <li className={styles.step}>
                <span className={styles.stepNum}>1</span>
                <div>
                  <strong>📖 学習フェーズ</strong>
                  <p>問題と答えをセットで確認します。「次へ」で1枚ずつ進み、内容をざっと把握しましょう。</p>
                </div>
              </li>
              <li className={styles.step}>
                <span className={styles.stepNum}>2</span>
                <div>
                  <strong>🧠 テストフェーズ</strong>
                  <p>答えが隠れた状態でカードが表示されます。<br />
                  カードをタップして答えを確認し、「✅ 正解」か「❌ もう一度」で自己採点します。</p>
                </div>
              </li>
              <li className={styles.step}>
                <span className={styles.stepNum}>3</span>
                <div>
                  <strong>🔁 セット完了・再挑戦</strong>
                  <p>1セット終了後に結果が表示されます。不正解だけ繰り返すことで効率よく定着させましょう。</p>
                </div>
              </li>
            </ol>
            <div className={styles.tipBox}>
              <strong>💡 便利な機能</strong>
              <ul className={styles.tipList}>
                <li>タブで教科を絞り込める</li>
                <li>「🔀 シャッフル」で出題順をランダムにできる</li>
                <li>「−／＋」でセット枚数を3〜15枚に調整できる</li>
              </ul>
            </div>
          </section>

          {/* セクション3: JSONの作り方 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>📝 問題JSONの作り方</h2>
            <p className={styles.text}>
              ローダー画面で自分で作ったJSONファイルを読み込むと、オリジナルの問題セットで学習できます。
            </p>
            <pre className={styles.code}>{`{
  "meta": {
    "title": "テストのタイトル",
    "subtitle": "サブタイトル",
    "version": "1.0"
  },
  "subjects": [
    { "id": "math", "label": "①数学", "color": "#EA8712" }
  ],
  "cards": [
    {
      "id": "m001",
      "subject": "math",
      "section": "二次方程式",
      "question": "x² - 5x + 6 = 0 を解け",
      "answer": "x = 2, 3"
    }
  ]
}`}</pre>
            <div className={styles.tipBox}>
              <strong>⚠️ 注意点</strong>
              <ul className={styles.tipList}>
                <li><code>cards[].subject</code> は <code>subjects[].id</code> と一致させる</li>
                <li>各カードの <code>id</code> は重複しない文字列にする</li>
                <li>ファイルはUTF-8で保存する</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
