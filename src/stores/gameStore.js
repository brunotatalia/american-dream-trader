import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const INITIAL_DATE = '1925-01-01T00:00:00.000Z'

const SPEED_CONFIG = {
  slow: { label: 'Slow', multiplier: 1, interval: 60000 },
  normal: { label: 'Normal', multiplier: 2, interval: 30000 },
  fast: { label: 'Fast', multiplier: 5, interval: 12000 },
}

const persistConfig = {
  name: 'adt-game-store',
  partialize: (state) => ({
    currentDate: state.currentDate,
    currentEra: state.currentEra,
    daysPassed: state.daysPassed,
    timeSpeed: state.timeSpeed,
    isPaused: state.isPaused,
  }),
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      currentDate: INITIAL_DATE,
      currentEra: null,
      timeSpeed: 'normal',
      isPaused: true,
      daysPassed: 0,
      weeksPassed: 0,
      monthsPassed: 0,
      yearsPassed: 0,
      speedConfig: SPEED_CONFIG,
      setCurrentEra: (eraId) => set({ currentEra: eraId }),
      setTimeSpeed: (speed) => {
        if (!SPEED_CONFIG[speed]) return
        set({ timeSpeed: speed, isPaused: false })
      },
      togglePause: () => set((state) => ({
        isPaused: !state.isPaused,
      })),
      setPaused: (isPaused) => set({ isPaused }),
      setDate: (date) => set({ currentDate: date.toISOString() }),
      resetGame: () => set({
        currentDate: INITIAL_DATE,
        currentEra: null,
        timeSpeed: 'normal',
        isPaused: true,
        daysPassed: 0,
        weeksPassed: 0,
        monthsPassed: 0,
        yearsPassed: 0,
      }),
      advanceDay: () => {
        const { currentDate, daysPassed, weeksPassed, monthsPassed, yearsPassed } = get()
        const nextDate = new Date(currentDate)
        nextDate.setDate(nextDate.getDate() + 1)

        const newDays = daysPassed + 1
        const newWeeks = newDays % 7 === 0 ? weeksPassed + 1 : weeksPassed
        const newMonths = newDays % 30 === 0 ? monthsPassed + 1 : monthsPassed
        const newYears = newDays % 365 === 0 ? yearsPassed + 1 : yearsPassed

        set({
          currentDate: nextDate.toISOString(),
          daysPassed: newDays,
          weeksPassed: newWeeks,
          monthsPassed: newMonths,
          yearsPassed: newYears,
        })
      },
    }),
    persistConfig,
  ),
)

export const getTimeSpeedInterval = (speedKey, isPaused = false) =>
  isPaused ? 0 : SPEED_CONFIG[speedKey]?.interval ?? 0

// Expose for debugging
if (typeof window !== 'undefined') {
  window.useGameStore = useGameStore
}
