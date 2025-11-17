import { RotateCcw } from 'lucide-react'

import Button from '@/components/ui/Button'
import { useGameStore } from '@/stores/gameStore'
import { useMarketStore } from '@/stores/marketStore'
import { usePlayerStore } from '@/stores/playerStore'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { useRealEstateStore } from '@/stores/realEstateStore'

export default function ResetButton() {
  const handleReset = () => {
    if (!confirm('Reset all progress and start fresh? This cannot be undone.')) {
      return
    }

    // Clear all stores
    useGameStore.getState().resetGame()
    usePlayerStore.getState().adjustCash(-usePlayerStore.getState().cash, 'reset')
    useMarketStore.getState().resetMarket()
    usePortfolioStore.getState().resetPortfolio()
    useRealEstateStore.getState().resetProperties()

    // Clear localStorage completely
    localStorage.clear()

    // Reload page
    window.location.reload()
  }

  return (
    <Button variant="danger" size="sm" onClick={handleReset} className="gap-2">
      <RotateCcw className="h-4 w-4" />
      Reset Game
    </Button>
  )
}

