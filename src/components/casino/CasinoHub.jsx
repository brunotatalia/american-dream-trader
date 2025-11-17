import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import { useCasino } from '@/hooks/useCasino'

import Blackjack from './Blackjack'
import Roulette from './Roulette'
import SlotMachine from './SlotMachine'

const GAME_COMPONENTS = {
  slots: SlotMachine,
  roulette: Roulette,
  blackjack: Blackjack,
}

export default function CasinoHub() {
  const { games, activeGame, setActiveGame } = useCasino()

  const GameComponent = activeGame ? GAME_COMPONENTS[activeGame.id] : null

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Casino Games</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs tabs={games.map((game) => ({ id: game.id, label: game.name }))} activeTab={activeGame?.id} onChange={setActiveGame} />
          <div className="mt-6 rounded-lg border border-white/5 bg-background-tertiary/50 p-4 text-sm text-text-secondary">
            {activeGame ? (
              <>
                <p className="font-semibold text-text-primary">{activeGame.name}</p>
                <p className="mt-1 text-text-tertiary">{activeGame.description}</p>
                <p className="mt-2">Minimum Bet: ${activeGame.minimumBet}</p>
              </>
            ) : (
              <p>Select a game to preview its rules and payouts.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {GameComponent ? (
        <GameComponent />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Game Preview</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-text-tertiary">
            {activeGame?.name} gameplay will be available soon. Other casino games (Roulette, Blackjack, Poker, Horse Racing) are planned for future phases.
          </CardContent>
        </Card>
      )}
    </div>
  )
}

