import { useMemo } from 'react'

import { usePlayerStore } from '@/stores/playerStore'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { useRealEstateStore } from '@/stores/realEstateStore'

export function usePlayer() {
  const state = usePlayerStore()
  const positions = usePortfolioStore((s) => s.positions)
  const ownedProperties = useRealEstateStore((s) => s.ownedProperties)

  return useMemo(() => {
    const portfolioValue = Object.values(positions).reduce(
      (sum, pos) => sum + ((pos.quantity || 0) * (pos.currentPrice || pos.averagePrice || 0)),
      0,
    )
    const realEstateValue = Object.values(ownedProperties).reduce(
      (sum, prop) => sum + (prop.currentValue || 0),
      0,
    )

    return {
      ...state,
      netWorth: state.cash + state.savings + portfolioValue + realEstateValue,
      portfolioValue,
      realEstateValue,
      dailyBalanceDelta: state.incomePerDay - state.expensesPerDay,
    }
  }, [state, positions, ownedProperties])
}
