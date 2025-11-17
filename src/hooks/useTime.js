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
    console.log('⏰ useTime effect:', { isPaused, timeSpeed })
    
    if (isPaused) {
      console.log('⏸️ Time is paused')
      return
    }

    const intervalDuration = getTimeSpeedInterval(timeSpeed, isPaused)
    console.log('⏱️ Setting interval for', intervalDuration, 'ms')
    
    if (!intervalDuration) {
      console.warn('⚠️ No interval duration, time won\'t advance')
      return
    }

    const interval = window.setInterval(() => {
      console.log('⏩ Advancing day...')
      advanceDay()
    }, intervalDuration)

    return () => {
      console.log('🛑 Clearing time interval')
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
