import achievementsDatabase from '@/data/achievementsDatabase'
import { useAchievementStore } from '@/stores/achievementStore'
import { useNotificationStore } from '@/stores/notificationStore'

/**
 * Check all achievements and unlock any that meet requirements
 */
export function checkAchievements(stats, currentGameState = {}) {
  const achievementStore = useAchievementStore.getState()
  const notificationStore = useNotificationStore.getState()
  const newlyUnlocked = []

  achievementsDatabase.forEach((achievement) => {
    // Skip if already unlocked
    if (achievementStore.isUnlocked(achievement.id)) return

    // Check if requirements are met
    if (checkRequirement(achievement.requirement, stats, currentGameState)) {
      const wasUnlocked = achievementStore.unlockAchievement(achievement.id, achievement)
      
      if (wasUnlocked) {
        newlyUnlocked.push(achievement)
        
        // Show notification
        notificationStore.addToast({
          title: `🏆 Achievement Unlocked!`,
          description: `${achievement.icon} ${achievement.title} - ${achievement.points} points`,
          variant: 'success',
          duration: 5000,
        })
      }
    }
  })

  return newlyUnlocked
}

/**
 * Check if a single requirement is met
 */
function checkRequirement(requirement, stats, gameState) {
  const { type, value, days } = requirement

  switch (type) {
    // Wealth
    case 'cash':
      return stats.maxCash >= value
    case 'netWorth':
      return stats.maxNetWorth >= value
    case 'savings':
      return stats.maxSavings >= value

    // Trading
    case 'trades':
      return stats.totalTrades >= value
    case 'tradesInDay':
      return stats.tradesInCurrentDay >= value
    case 'singleTradeProfit':
      return stats.bestSingleTradeProfit >= value
    case 'sectorsOwned':
      return stats.sectorsOwned.length >= value

    // Real Estate
    case 'propertiesOwned':
      return stats.propertiesOwned >= value
    case 'totalRentCollected':
      return stats.totalRentCollected >= value

    // Employment
    case 'jobsCompleted':
      return stats.jobsCompleted >= value
    case 'masterLevel':
      return stats.masterLevelsReached >= value
    case 'perfectJob':
      return stats.perfectJobsCompleted >= value
    case 'allMiniGames':
      return stats.miniGamesCompleted.length >= value

    // Casino
    case 'slotWin':
      return stats.bestSlotWin >= value
    case 'casinoWinnings':
      return stats.totalCasinoWinnings >= value
    case 'blackjackNatural':
      return stats.blackjackNaturals >= value
    case 'rouletteWins':
      return stats.rouletteWins >= value

    // Banking
    case 'interestEarned':
      return stats.totalInterestEarned >= value

    // Survival
    case 'daysSurvived':
      return stats.daysSurvived >= value
    case 'surviveCrash1929':
      return stats.survivedCrash1929 && stats.maxNetWorth > 0

    // Special
    case 'ragsToRiches':
      return stats.startingNetWorth <= 100 && stats.maxNetWorth >= value
    case 'speedRun':
      return stats.netWorthAt30Days >= value && stats.daysSurvived >= days
    case 'allAchievements':
      const unlockedCount = useAchievementStore.getState().getUnlockedCount()
      return unlockedCount >= achievementsDatabase.length - 1 // Minus the completionist itself

    default:
      console.warn(`Unknown achievement requirement type: ${type}`)
      return false
  }
}

/**
 * Get achievement progress for display
 */
export function getAchievementProgress(achievement, stats) {
  const { type, value } = achievement.requirement
  let current = 0

  switch (type) {
    case 'cash': current = stats.maxCash; break
    case 'netWorth': current = stats.maxNetWorth; break
    case 'savings': current = stats.maxSavings; break
    case 'trades': current = stats.totalTrades; break
    case 'tradesInDay': current = stats.tradesInCurrentDay; break
    case 'singleTradeProfit': current = stats.bestSingleTradeProfit; break
    case 'sectorsOwned': current = stats.sectorsOwned.length; break
    case 'propertiesOwned': current = stats.propertiesOwned; break
    case 'totalRentCollected': current = stats.totalRentCollected; break
    case 'jobsCompleted': current = stats.jobsCompleted; break
    case 'masterLevel': current = stats.masterLevelsReached; break
    case 'perfectJob': current = stats.perfectJobsCompleted; break
    case 'allMiniGames': current = stats.miniGamesCompleted.length; break
    case 'slotWin': current = stats.bestSlotWin; break
    case 'casinoWinnings': current = stats.totalCasinoWinnings; break
    case 'blackjackNatural': current = stats.blackjackNaturals; break
    case 'rouletteWins': current = stats.rouletteWins; break
    case 'interestEarned': current = stats.totalInterestEarned; break
    case 'daysSurvived': current = stats.daysSurvived; break
    default: current = 0
  }

  const percent = Math.min(100, (current / value) * 100)
  return { current, max: value, percent }
}

