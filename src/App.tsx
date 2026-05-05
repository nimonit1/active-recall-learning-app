// アプリルートコンポーネント。AppProviderでコンテキストを提供し、画面状態に応じたレイアウトを制御する
import { AppProvider, useAppContext } from './hooks/AppContext'
import { LoaderOverlay } from './components/LoaderOverlay/LoaderOverlay'
import { Header } from './components/Header/Header'
import { PhaseBanner } from './components/PhaseBanner/PhaseBanner'
import { TabBar } from './components/TabBar/TabBar'
import { SettingsBar } from './components/SettingsBar/SettingsBar'
import { ScorePanel } from './components/ScorePanel/ScorePanel'
import { Card } from './components/Card/Card'
import { Navigation } from './components/Navigation/Navigation'
import { ChunkDoneOverlay } from './components/ChunkDoneOverlay/ChunkDoneOverlay'
import { AllDoneOverlay } from './components/AllDoneOverlay/AllDoneOverlay'
import type { Data } from './types'
import styles from './App.module.css'

function AppContent(): React.ReactElement {
  const { state, dispatch } = useAppContext()

  function handleLoad(data: Data): void {
    dispatch({ type: 'LOAD_DATA', payload: data })
  }

  if (state.screen === 'loader') {
    return <LoaderOverlay onLoad={handleLoad} />
  }

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <PhaseBanner />
        <TabBar />
        <SettingsBar />
        <ScorePanel />
        {state.screen === 'session' && (
          <>
            <Card />
            <Navigation />
          </>
        )}
        {state.screen === 'chunkDone' && <ChunkDoneOverlay />}
        {state.screen === 'allDone' && <AllDoneOverlay />}
      </main>
    </div>
  )
}

export default function App(): React.ReactElement {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
