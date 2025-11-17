import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { useGameLoop } from '@/hooks/useGameLoop'

import BottomNav from './BottomNav'
import Sidebar from './Sidebar'
import ToastContainer from './ToastContainer'
import TopBar from './TopBar'
import Tutorial from './Tutorial'

export default function GameLayout() {
  // Run game loop (market updates, events, etc.)
  useGameLoop()

  const [showTutorial, setShowTutorial] = useState(false)

  return (
    <div className="flex min-h-screen bg-background-secondary text-text-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar onShowTutorial={() => setShowTutorial(true)} />
        <main className="relative flex-1 overflow-y-auto px-4 pb-20 pt-6 md:px-8 md:pb-6">
          <div className="mx-auto flex w-full max-w-content flex-col gap-6">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
      <ToastContainer />
      {showTutorial && <Tutorial onComplete={() => setShowTutorial(false)} />}
    </div>
  )
}

