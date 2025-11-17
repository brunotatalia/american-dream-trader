import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AchievementsHub from '@/components/achievements/AchievementsHub'
import BankingHub from '@/components/banking/BankingHub'
import CasinoHub from '@/components/casino/CasinoHub'
import EraSelector from '@/components/core/EraSelector'
import GameLayout from '@/components/core/GameLayout'
import Tutorial from '@/components/core/Tutorial'
import WelcomeScreen from '@/components/core/WelcomeScreen'
import Dashboard from '@/components/dashboard/Dashboard'
import JobsHub from '@/components/jobs/JobsHub'
import RealEstateHub from '@/components/real-estate/RealEstateHub'
import TradingHub from '@/components/trading/TradingHub'
import { useEra } from '@/hooks/useEra'

function App() {
  const { isEraSelected } = useEra()
  const [showEraSelector, setShowEraSelector] = useState(!isEraSelected)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    // Show welcome screen after era is selected
    if (isEraSelected && !showWelcome) {
      const hasSeenWelcome = localStorage.getItem('adt-welcome-seen')
      if (!hasSeenWelcome) {
        setShowWelcome(true)
      }
    }
  }, [isEraSelected, showWelcome])

  const handleWelcomeDismiss = () => {
    localStorage.setItem('adt-welcome-seen', 'true')
    setShowWelcome(false)

    // Show tutorial if first time
    const hasSeenTutorial = localStorage.getItem('adt-tutorial-seen')
    if (!hasSeenTutorial) {
      setShowTutorial(true)
    }
  }

  const handleTutorialComplete = () => {
    localStorage.setItem('adt-tutorial-seen', 'true')
    setShowTutorial(false)
  }

  return (
    <BrowserRouter>
      <EraSelector isOpen={showEraSelector} onClose={() => setShowEraSelector(false)} />
      {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}
      <Routes>
        <Route element={<GameLayout />}>
          <Route
            index
            element={showWelcome ? <WelcomeScreen onDismiss={handleWelcomeDismiss} /> : <Dashboard />}
          />
          <Route path="trading" element={<TradingHub />} />
          <Route path="jobs" element={<JobsHub />} />
          <Route path="real-estate" element={<RealEstateHub />} />
          <Route path="banking" element={<BankingHub />} />
          <Route path="casino" element={<CasinoHub />} />
          <Route path="achievements" element={<AchievementsHub />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
