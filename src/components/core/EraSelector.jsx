import { useState } from 'react'

import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { useEra } from '@/hooks/useEra'
import { useGameStore } from '@/stores/gameStore'
import { useMarketStore } from '@/stores/marketStore'
import { usePlayerStore } from '@/stores/playerStore'
import { initializeMarket } from '@/utils/initializeMarket'

export default function EraSelector({ isOpen, onClose }) {
  const { allEras, setCurrentEra } = useEra()
  const adjustCash = usePlayerStore((state) => state.adjustCash)
  const setAssets = useMarketStore((state) => state.setAssets)
  const setDate = useGameStore((state) => state.setDate)
  const [selectedEraId, setSelectedEraId] = useState(allEras[0]?.id ?? null)

  const handleStartGame = () => {
    const selectedEra = allEras.find((era) => era.id === selectedEraId)
    if (!selectedEra) return

    console.log('🎮 Starting game with era:', selectedEra.name)

    // Set era
    setCurrentEra(selectedEraId)

    // Set starting date for era
    const startDate = new Date(`${selectedEra.startYear}-01-01T00:00:00.000Z`)
    setDate(startDate)
    console.log('📅 Set date to:', startDate.toLocaleDateString())

    // Initialize player capital
    adjustCash(selectedEra.startingCapital, 'era_start')
    console.log('💰 Set starting capital:', selectedEra.startingCapital)

    // Initialize market with era-appropriate assets
    const initialAssets = initializeMarket(selectedEraId)
    console.log('📊 Initialized market with', Object.keys(initialAssets).length, 'assets')
    console.log('Sample assets:', Object.entries(initialAssets).slice(0, 3).map(([sym, a]) => `${sym}: $${a.currentPrice}`))
    setAssets(initialAssets)

    onClose?.()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      title="Choose Your Era"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="primary" size="lg" onClick={handleStartGame}>
            Start Game
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          Select a historical period to begin your journey toward the American Dream. Each era offers unique
          challenges, opportunities, and economic conditions.
        </p>
        <div className="space-y-3">
          {allEras.map((era) => (
            <button
              key={era.id}
              type="button"
              onClick={() => setSelectedEraId(era.id)}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                selectedEraId === era.id
                  ? 'border-accent-primary bg-accent-primary/10'
                  : 'border-white/10 bg-background-tertiary/40 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-lg font-semibold text-text-primary">{era.name}</p>
                  <p className="mt-1 text-sm text-text-tertiary">{era.description}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
                    <span>
                      <strong>Years:</strong> {era.startYear}–{era.endYear}
                    </span>
                    <span>
                      <strong>Starting Capital:</strong> ${era.startingCapital.toLocaleString()}
                    </span>
                    <span>
                      <strong>Market Volatility:</strong> {era.marketVolatilityModifier}x
                    </span>
                  </div>
                  {era.keyEvents && era.keyEvents.length > 0 && (
                    <div className="mt-2 text-xs text-text-tertiary">
                      <strong>Key Events:</strong> {era.keyEvents.join(', ')}
                    </div>
                  )}
                </div>
                {selectedEraId === era.id && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-primary">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}

