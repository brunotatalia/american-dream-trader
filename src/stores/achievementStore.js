import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const persistConfig = {
  name: 'adt-achievement-store',
  partialize: (state) => ({
    unlockedAchievements: state.unlockedAchievements,
    stats: state.stats,
    totalPoints: state.totalPoints,
  }),
}

export const useAchievementStore = create(
  persist(
    (set, get) => ({
      unlockedAchievements: {},
      stats: {
        // Wealth
        maxNetWorth: 0,
        maxCash: 0,
        
        // Trading
        totalTrades: 0,
        tradesInCurrentDay: 0,
        lastTradeDay: 0,
        bestSingleTradeProfit: 0,
        sectorsOwned: [],
        
        // Real Estate
        propertiesOwned: 0,
        totalRentCollected: 0,
        
        // Employment
        jobsCompleted: 0,
        masterLevelsReached: 0,
        perfectJobsCompleted: 0,
        miniGamesCompleted: [],
        
        // Casino
        bestSlotWin: 0,
        totalCasinoWinnings: 0,
        blackjackNaturals: 0,
        rouletteWins: 0,
        
        // Banking
        maxSavings: 0,
        totalInterestEarned: 0,
        
        // Survival
        daysSurvived: 0,
        survivedCrash1929: false,
        
        // Special
        startingNetWorth: 0,
        netWorthAt30Days: 0,
      },
      totalPoints: 0,

      // Unlock an achievement
      unlockAchievement: (achievementId, achievement) => {
        const { unlockedAchievements } = get()
        
        // Don't unlock twice
        if (unlockedAchievements[achievementId]) return false

        set({
          unlockedAchievements: {
            ...unlockedAchievements,
            [achievementId]: {
              ...achievement,
              unlockedAt: Date.now(),
            },
          },
          totalPoints: get().totalPoints + (achievement.points || 0),
        })

        return true
      },

      // Update stats
      updateStat: (statName, value) => {
        set((state) => ({
          stats: {
            ...state.stats,
            [statName]: value,
          },
        }))
      },

      // Increment stats
      incrementStat: (statName, amount = 1) => {
        set((state) => ({
          stats: {
            ...state.stats,
            [statName]: (state.stats[statName] || 0) + amount,
          },
        }))
      },

      // Record a trade
      recordTrade: (profit, sector, currentDay) => {
        const stats = get().stats
        const tradesInDay = stats.lastTradeDay === currentDay ? stats.tradesInCurrentDay + 1 : 1

        set((state) => ({
          stats: {
            ...state.stats,
            totalTrades: state.stats.totalTrades + 1,
            tradesInCurrentDay: tradesInDay,
            lastTradeDay: currentDay,
            bestSingleTradeProfit: Math.max(state.stats.bestSingleTradeProfit, profit),
            sectorsOwned: sector && !state.stats.sectorsOwned.includes(sector)
              ? [...state.stats.sectorsOwned, sector]
              : state.stats.sectorsOwned,
          },
        }))
      },

      // Record job completion
      recordJob: (jobId, performance) => {
        const stats = get().stats
        const miniGames = stats.miniGamesCompleted.includes(jobId)
          ? stats.miniGamesCompleted
          : [...stats.miniGamesCompleted, jobId]

        set((state) => ({
          stats: {
            ...state.stats,
            jobsCompleted: state.stats.jobsCompleted + 1,
            perfectJobsCompleted: performance >= 1.0 
              ? state.stats.perfectJobsCompleted + 1 
              : state.stats.perfectJobsCompleted,
            miniGamesCompleted: miniGames,
          },
        }))
      },

      // Record casino win
      recordCasinoWin: (amount, game) => {
        set((state) => ({
          stats: {
            ...state.stats,
            totalCasinoWinnings: state.stats.totalCasinoWinnings + amount,
            bestSlotWin: game === 'slots' ? Math.max(state.stats.bestSlotWin, amount) : state.stats.bestSlotWin,
            blackjackNaturals: game === 'blackjack' ? state.stats.blackjackNaturals + 1 : state.stats.blackjackNaturals,
            rouletteWins: game === 'roulette' ? state.stats.rouletteWins + 1 : state.stats.rouletteWins,
          },
        }))
      },

      // Check if achievement is unlocked
      isUnlocked: (achievementId) => {
        return !!get().unlockedAchievements[achievementId]
      },

      // Get unlocked count
      getUnlockedCount: () => {
        return Object.keys(get().unlockedAchievements).length
      },

      // Reset achievements
      resetAchievements: () => {
        set({
          unlockedAchievements: {},
          stats: {
            maxNetWorth: 0,
            maxCash: 0,
            totalTrades: 0,
            tradesInCurrentDay: 0,
            lastTradeDay: 0,
            bestSingleTradeProfit: 0,
            sectorsOwned: [],
            propertiesOwned: 0,
            totalRentCollected: 0,
            jobsCompleted: 0,
            masterLevelsReached: 0,
            perfectJobsCompleted: 0,
            miniGamesCompleted: [],
            bestSlotWin: 0,
            totalCasinoWinnings: 0,
            blackjackNaturals: 0,
            rouletteWins: 0,
            maxSavings: 0,
            totalInterestEarned: 0,
            daysSurvived: 0,
            survivedCrash1929: false,
            startingNetWorth: 0,
            netWorthAt30Days: 0,
          },
          totalPoints: 0,
        })
      },
    }),
    persistConfig,
  ),
)

