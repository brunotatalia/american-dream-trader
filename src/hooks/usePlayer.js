import { useMemo } from 'react'

import { usePlayerStore } from '@/stores/playerStore'

export function usePlayer() {
  const state = usePlayerStore()

  return useMemo(() => ({
    ...state,
    netWorth: state.cash + state.savings,
    dailyBalanceDelta: state.incomePerDay - state.expensesPerDay,
  }), [state])
}
