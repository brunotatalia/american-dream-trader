import { useMemo } from 'react'

import { useMarketStore } from '@/stores/marketStore'
import { usePlayerStore } from '@/stores/playerStore'
import { usePortfolioStore } from '@/stores/portfolioStore'

export function useTrading() {
  const market = useMarketStore()
  const portfolio = usePortfolioStore()
  const player = usePlayerStore()

  return useMemo(
    () => ({
      market,
      portfolio,
      player,
      cashAvailable: Math.max(0, player.cash - portfolio.cashReserved),
      hasActivePositions: Object.keys(portfolio.positions).length > 0,
    }),
    [market, player, portfolio],
  )
}
