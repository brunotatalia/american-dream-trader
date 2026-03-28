import { useMemo } from 'react'

import { useLifeStore } from '@/stores/lifeStore'

export function useLife() {
  const lifestyle = useLifeStore((state) => state.lifestyle)
  const health = useLifeStore((state) => state.health)
  const happiness = useLifeStore((state) => state.happiness)
  const energy = useLifeStore((state) => state.energy)
  const reputation = useLifeStore((state) => state.reputation)
  const age = useLifeStore((state) => state.age)
  const relationships = useLifeStore((state) => state.relationships)
  const activeEvents = useLifeStore((state) => state.activeEvents)
  const eventHistory = useLifeStore((state) => state.eventHistory)
  const lifeLog = useLifeStore((state) => state.lifeLog)
  const milestones = useLifeStore((state) => state.milestones)

  const monthlyExpenses = useMemo(
    () => useLifeStore.getState().getMonthlyExpenses(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lifestyle],
  )

  const lifeStage = useMemo(() => {
    if (reputation >= 80) return { label: 'Tycoon', color: 'text-yellow-400' }
    if (reputation >= 60) return { label: 'Wealthy', color: 'text-accent-success' }
    if (reputation >= 40) return { label: 'Comfortable', color: 'text-accent-primary' }
    if (reputation >= 20) return { label: 'Getting By', color: 'text-text-secondary' }
    return { label: 'Struggling', color: 'text-accent-danger' }
  }, [reputation])

  return {
    lifestyle,
    health,
    happiness,
    energy,
    reputation,
    age,
    relationships,
    activeEvents,
    eventHistory,
    lifeLog,
    milestones,
    monthlyExpenses,
    lifeStage,
    setLifestyle: useLifeStore.getState().setLifestyle,
    adjustHealth: useLifeStore.getState().adjustHealth,
    adjustHappiness: useLifeStore.getState().adjustHappiness,
    adjustEnergy: useLifeStore.getState().adjustEnergy,
    triggerEvent: useLifeStore.getState().triggerEvent,
    resolveEvent: useLifeStore.getState().resolveEvent,
    dismissEvent: useLifeStore.getState().dismissEvent,
    addLifeLogEntry: useLifeStore.getState().addLifeLogEntry,
    addMilestone: useLifeStore.getState().addMilestone,
  }
}
