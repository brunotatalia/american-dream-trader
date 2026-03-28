import { lazy, Suspense, useEffect, useState } from 'react'
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

// New systems - lazy loaded
const EducationHub = lazy(() => import('@/components/education/EducationHub'))
const BusinessHub = lazy(() => import('@/components/business/BusinessHub'))
const LifeHub = lazy(() => import('@/components/life/LifeHub'))
const NetworkHub = lazy(() => import('@/components/network/NetworkHub'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent-primary border-t-transparent" />
        <p className="text-sm text-text-tertiary">Loading...</p>
      </div>
    </div>
  )
}

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
          <Route path="education" element={<Suspense fallback={<LoadingFallback />}><EducationHub /></Suspense>} />
          <Route path="business" element={<Suspense fallback={<LoadingFallback />}><BusinessHub /></Suspense>} />
          <Route path="real-estate" element={<RealEstateHub />} />
          <Route path="life" element={<Suspense fallback={<LoadingFallback />}><LifeHub /></Suspense>} />
          <Route path="network" element={<Suspense fallback={<LoadingFallback />}><NetworkHub /></Suspense>} />
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
