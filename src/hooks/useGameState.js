import { useMemo } from 'react'

import { useGameStore } from '@/stores/gameStore'

export function useGameState() {
  const state = useGameStore()

  return useMemo(() => {
    const currentDate = new Date(state.currentDate)

    return {
      ...state,
      currentDate,
      formattedDate: currentDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }
  }, [state])
}
