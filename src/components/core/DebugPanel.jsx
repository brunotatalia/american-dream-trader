import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useEra } from '@/hooks/useEra'
import { useGameState } from '@/hooks/useGameState'
import { useMarket } from '@/hooks/useMarket'
import { usePlayer } from '@/hooks/usePlayer'
import { useGameStore } from '@/stores/gameStore'

export default function DebugPanel() {
  const { eraData, currentEra } = useEra()
  const { currentDate, daysPassed, isPaused, timeSpeed } = useGameState()
  const { assetsList, assets } = useMarket()
  const { cash } = usePlayer()
  const advanceDay = useGameStore((state) => state.advanceDay)
  const togglePause = useGameStore((state) => state.togglePause)

  if (!eraData) {
    return (
      <Card className="border-red-500/50 bg-red-500/10">
        <CardHeader>
          <CardTitle className="text-red-400">⚠️ Debug: No Era Selected</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-text-secondary">
          <p>Current era: {currentEra || 'null'}</p>
          <p>Era data: {eraData ? 'exists' : 'missing'}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-accent-info/50 bg-accent-info/10">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-accent-info">🔍 Debug Panel</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => advanceDay()}>
            +1 Day
          </Button>
          <Button size="sm" variant="ghost" onClick={() => togglePause()}>
            {isPaused ? 'Unpause' : 'Pause'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-text-tertiary">Era:</p>
          <p className="font-semibold text-text-primary">{eraData.name}</p>
        </div>
        <div>
          <p className="text-text-tertiary">Current Date:</p>
          <p className="font-semibold text-text-primary">{new Date(currentDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-text-tertiary">Days Passed:</p>
          <p className="font-semibold text-text-primary">{daysPassed}</p>
        </div>
        <div>
          <p className="text-text-tertiary">Time Status:</p>
          <p className={`font-semibold ${isPaused ? 'text-red-400' : 'text-green-400'}`}>
            {isPaused ? '⏸️ PAUSED' : '▶️ RUNNING'} ({timeSpeed})
          </p>
        </div>
        <div>
          <p className="text-text-tertiary">Cash:</p>
          <p className="font-semibold text-text-primary">${cash}</p>
        </div>
        <div>
          <p className="text-text-tertiary">Assets in Market:</p>
          <p className="font-semibold text-text-primary">{Object.keys(assets || {}).length}</p>
        </div>
        <div>
          <p className="text-text-tertiary">Assets List:</p>
          <p className="font-semibold text-text-primary">{assetsList.length}</p>
        </div>
        <div>
          <p className="text-text-tertiary">Sample Prices:</p>
          <div className="space-y-1 text-xs">
            {assetsList.slice(0, 3).map((asset) => (
              <div key={asset.symbol || asset.id} className="font-mono">
                {asset.symbol || asset.id}: ${asset.currentPrice?.toFixed(2) || asset.initialPrice?.toFixed(2) || 'NaN'}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

