import { Bell, HelpCircle, Pause, Play, RotateCcw, Settings } from 'lucide-react'
import { useState } from 'react'

import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { useEra } from '@/hooks/useEra'
import { useGameState } from '@/hooks/useGameState'
import { useNotifications } from '@/hooks/useNotifications'
import { usePlayer } from '@/hooks/usePlayer'
import { useTime } from '@/hooks/useTime'
import { useGameStore } from '@/stores/gameStore'
import { useMarketStore } from '@/stores/marketStore'
import { usePlayerStore } from '@/stores/playerStore'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { useRealEstateStore } from '@/stores/realEstateStore'
import { formatCurrency } from '@/utils/formatters'

export default function TopBar({ onShowTutorial }) {
  const { formattedDate } = useGameState()
  const { eraData } = useEra()
  const { netWorth } = usePlayer()
  const { toasts } = useNotifications()
  const { isPaused, timeSpeed, togglePause, setTimeSpeed } = useTime()
  const [showSettings, setShowSettings] = useState(false)

  const handleReset = () => {
    if (!confirm('⚠️ Reset ALL progress and start fresh?\n\nThis will:\n- Clear all saved data\n- Reset to era selection\n- Cannot be undone\n\nContinue?')) {
      return
    }

    // Clear all stores
    useGameStore.getState().resetGame()
    usePlayerStore.getState().adjustCash(-usePlayerStore.getState().cash, 'reset')
    useMarketStore.getState().resetMarket()
    usePortfolioStore.getState().resetPortfolio()
    useRealEstateStore.getState().resetProperties()

    // Clear localStorage
    localStorage.clear()

    // Reload
    window.location.reload()
  }

  return (
    <header className="flex items-center justify-between border-b border-white/5 bg-background-secondary/80 px-6 py-4 backdrop-blur-lg">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Net Worth</p>
          <p className="font-display text-2xl text-text-primary">{formatCurrency(netWorth)}</p>
        </div>
        {eraData && (
          <div className="hidden rounded-lg border border-accent-primary/30 bg-accent-primary/10 px-3 py-1 lg:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-primary">
              {eraData.name}
            </p>
          </div>
        )}
      </div>
      <div className="hidden items-center gap-6 md:flex">
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Game Date</p>
          <p className="font-semibold text-text-secondary">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={togglePause}>
            {isPaused ? (
              <span className="flex items-center gap-2">
                <Play className="h-4 w-4" /> Resume
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Pause className="h-4 w-4" /> Pause
              </span>
            )}
          </Button>
          <select
            aria-label="Time speed"
            className="rounded-lg border border-white/10 bg-background-tertiary px-3 py-2 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            value={timeSpeed}
            onChange={(event) => setTimeSpeed(event.target.value)}
          >
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div>
        <button type="button" className="relative rounded-full border border-white/10 p-2 text-text-secondary hover:text-text-primary">
          <Bell className="h-5 w-5" />
          {toasts.length ? (
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-accent-danger" />
          ) : null}
        </button>
        <button
          type="button"
          onClick={onShowTutorial}
          className="rounded-full border border-white/10 p-2 text-text-secondary hover:text-text-primary"
          title="Show Tutorial"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setShowSettings(true)}
          className="rounded-full border border-white/10 p-2 text-text-secondary hover:text-text-primary"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Game Settings"
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-background-tertiary/40 p-4">
            <p className="text-sm font-semibold text-text-primary">Reset Progress</p>
            <p className="mt-1 text-sm text-text-secondary">
              Clear all saved data and start fresh from era selection.
            </p>
            <Button
              variant="danger"
              size="sm"
              onClick={handleReset}
              className="mt-3 gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Game
            </Button>
          </div>

          <div className="rounded-lg border border-white/10 bg-background-tertiary/40 p-4">
            <p className="text-sm font-semibold text-text-primary">Quick Fix</p>
            <p className="mt-1 text-sm text-text-secondary">
              If you see $NaN prices, your market data is corrupted. Reset fixes this.
            </p>
          </div>
        </div>
      </Modal>
    </header>
  )
}


