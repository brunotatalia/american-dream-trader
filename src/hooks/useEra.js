import { useMemo } from 'react'

import historicalPeriods from '@/data/historicalPeriods'
import { useGameStore } from '@/stores/gameStore'

export function useEra() {
  const currentEra = useGameStore((state) => state.currentEra)
  const setCurrentEra = useGameStore((state) => state.setCurrentEra)

  const eraData = useMemo(() => {
    if (!currentEra) return null
    return historicalPeriods.find((era) => era.id === currentEra) ?? null
  }, [currentEra])

  return {
    currentEra,
    eraData,
    setCurrentEra,
    allEras: historicalPeriods,
    isEraSelected: currentEra !== null,
  }
}

