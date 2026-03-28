import { useEffect } from 'react'

import { getTimeSpeedInterval, useGameStore } from '@/stores/gameStore'

export function useTime({ autoStart = false } = {}) {
  const timeSpeed = useGameStore((state) => state.timeSpeed)
  const isPaused = useGameStore((state) => state.isPaused)
  const setTimeSpeed = useGameStore((state) => state.setTimeSpeed)
  const togglePause = useGameStore((state) => state.togglePause)
  const advanceDay = useGameStore((state) => state.advanceDay)
  const setPaused = useGameStore((state) => state.setPaused)

  useEffect(() => {
    if (autoStart) {
      setPaused(false)
    }
  }, [autoStart, setPaused])

  useEffect(() => {
    if (isPaused) return

    const intervalDuration = getTimeSpeedInterval(timeSpeed, isPaused)
    if (!intervalDuration) return

    const interval = window.setInterval(() => {
      advanceDay()
    }, intervalDuration)

    return () => {
      window.clearInterval(interval)
    }
  }, [advanceDay, isPaused, timeSpeed])

  return {
    timeSpeed,
    isPaused,
    setTimeSpeed,
    togglePause,
    advanceDay,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
  }
}
