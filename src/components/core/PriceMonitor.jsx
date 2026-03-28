import { useEffect, useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useEra } from '@/hooks/useEra'
import { useGameStore } from '@/stores/gameStore'
import { useMarket } from '@/hooks/useMarket'
import { useMarketStore } from '@/stores/marketStore'
import { useRealEstate } from '@/hooks/useRealEstate'
import { formatCurrency } from '@/utils/formatters'
import { updateMarketPrices } from '@/utils/marketSimulator'

/**
 * Debug component to monitor price changes in real-time
 * Shows a few sample assets and their prices updating
 */
export default function PriceMonitor() {
  const { assetsList, lastUpdated, updateTrigger, assets } = useMarket()
  const { availableProperties } = useRealEstate()
  const { eraData } = useEra()
  const daysPassed = useGameStore((state) => state.daysPassed)
  const isPaused = useGameStore((state) => state.isPaused)
  const advanceDay = useGameStore((state) => state.advanceDay)
  const setAssets = useMarketStore((state) => state.setAssets)
  const [renderCount, setRenderCount] = useState(0)

  // Track re-renders
  useEffect(() => {
    setRenderCount((prev) => prev + 1)
  }, [assetsList, availableProperties, updateTrigger])
  
  const handleForceUpdate = () => {
    advanceDay()
  }

  const handleFixPrices = () => {
    if (!assets || Object.keys(assets).length === 0) return

    const updatedAssets = updateMarketPrices(assets, eraData?.marketVolatilityModifier || 1.2)
    setAssets(updatedAssets)
  }

  const sampleStocks = assetsList.slice(0, 3)
  const sampleProperty = availableProperties[0]

  return (
    <Card className="border-accent-info/30 bg-accent-info/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent-info">
          📊 Price Monitor (Debug)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-text-tertiary">Game Day</p>
            <p className="font-semibold text-text-primary">{daysPassed}</p>
          </div>
          <div>
            <p className="text-text-tertiary">Time Status</p>
            <p className={`font-semibold ${isPaused ? 'text-accent-warning' : 'text-accent-success'}`}>
              {isPaused ? '⏸️ PAUSED' : '▶️ RUNNING'}
            </p>
          </div>
          <div>
            <p className="text-text-tertiary">Render Count</p>
            <p className="font-semibold text-text-primary">{renderCount}</p>
          </div>
          <div>
            <p className="text-text-tertiary">Last Market Update</p>
            <p className="font-semibold text-text-primary">
              {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
            </p>
          </div>
        </div>

        {/* Sample Stock Prices */}
        <div>
          <p className="mb-2 text-xs font-semibold text-text-primary">Sample Stock Prices:</p>
          <div className="space-y-1">
            {sampleStocks.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between rounded bg-background-elevated p-2 text-xs">
                <span className="font-semibold text-text-primary">{stock.symbol}</span>
                <span className="font-mono text-text-secondary">{formatCurrency(stock.currentPrice)}</span>
                <span className={`font-semibold ${stock.priceChangePercent >= 0 ? 'text-accent-success' : 'text-accent-danger'}`}>
                  {stock.priceChangePercent >= 0 ? '+' : ''}{stock.priceChangePercent?.toFixed(2) || 0}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Real Estate */}
        {sampleProperty && (
          <div>
            <p className="mb-2 text-xs font-semibold text-text-primary">Sample Property:</p>
            <div className="rounded bg-background-elevated p-2 text-xs">
              <p className="font-semibold text-text-primary">{sampleProperty.type}</p>
              <p className="text-text-tertiary">{sampleProperty.location}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-text-secondary">Price:</span>
                <span className="font-mono font-semibold text-text-primary">{formatCurrency(sampleProperty.price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Rent:</span>
                <span className="font-mono font-semibold text-text-primary">{formatCurrency(sampleProperty.monthlyRent)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Test Buttons */}
        <div className="space-y-2">
          <Button onClick={handleFixPrices} variant="success" className="w-full">
            🔧 FIX STUCK PRICES NOW!
          </Button>
          <Button onClick={handleForceUpdate} variant="primary" className="w-full">
            🔄 Force Update (Advance 1 Day)
          </Button>
          <p className="mt-2 text-xs text-text-tertiary text-center">
            Update Trigger: {updateTrigger} | Render Count: {renderCount}
          </p>
        </div>

        {/* Instructions */}
        <div className="rounded border border-accent-warning/30 bg-accent-warning/10 p-2 text-xs">
          <p className="font-semibold text-accent-warning">Troubleshooting:</p>
          <ul className="mt-1 space-y-1 text-text-secondary">
            <li>• If prices show 0% → You need to <strong>Reset Game</strong></li>
            <li>• Click Settings (⚙️) → Reset Game</li>
            <li>• Then select era again and prices will update properly</li>
            <li>• Or click "Force Update" button above to test</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

