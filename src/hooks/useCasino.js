import { useMemo, useState } from 'react'

import casinoConfig from '@/config/casinoConfig'

export function useCasino() {
  const [activeGameId, setActiveGameId] = useState(casinoConfig.games[0]?.id ?? null)

  const activeGame = useMemo(
    () => casinoConfig.games.find((game) => game.id === activeGameId) ?? null,
    [activeGameId],
  )

  return {
    games: casinoConfig.games,
    houseEdge: casinoConfig.houseEdge,
    activeGame,
    setActiveGame: setActiveGameId,
  }
}
