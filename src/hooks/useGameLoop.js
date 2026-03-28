import { useEffect } from 'react'

import realEstateDatabase from '@/data/realEstateDatabase'
import lifeEventsDatabase from '@/data/lifeEventsDatabase'
import networkDatabase from '@/data/networkDatabase'
import { useEra } from '@/hooks/useEra'
import { useAchievementStore } from '@/stores/achievementStore'
import { useBusinessStore } from '@/stores/businessStore'
import { useEducationStore } from '@/stores/educationStore'
import { useGameStore } from '@/stores/gameStore'
import { useLifeStore } from '@/stores/lifeStore'
import { useMarketStore } from '@/stores/marketStore'
import { useNetworkStore } from '@/stores/networkStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { usePlayerStore } from '@/stores/playerStore'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { useRealEstateStore } from '@/stores/realEstateStore'
import { checkAchievements } from '@/utils/achievementChecker'
import { applyEventImpact, checkHistoricalEvents, triggerRandomEvents } from '@/utils/eventTrigger'
import { updateMarketPrices } from '@/utils/marketSimulator'
import { appreciateProperties, collectRent } from '@/utils/realEstateEngine'

/**
 * Hook that orchestrates daily game updates
 */
export function useGameLoop() {
  const daysPassed = useGameStore((state) => state.daysPassed)
  const monthsPassed = useGameStore((state) => state.monthsPassed)
  const currentDate = useGameStore((state) => state.currentDate)
  const { eraData } = useEra()

  useEffect(() => {
    if (!eraData) return
    if (daysPassed === 0) return

    // Get stores
    const marketStore = useMarketStore
    const playerStore = usePlayerStore
    const notificationStore = useNotificationStore
    const realEstateStore = useRealEstateStore
    const achievementStore = useAchievementStore
    const portfolioStore = usePortfolioStore
    const educationStore = useEducationStore
    const lifeStore = useLifeStore
    const businessStore = useBusinessStore
    const networkStore = useNetworkStore

    // === MARKET UPDATES ===
    const currentAssets = marketStore.getState().assets
    if (!currentAssets || Object.keys(currentAssets).length === 0) return

    const updatedAssets = updateMarketPrices(currentAssets, eraData.marketVolatilityModifier)
    marketStore.getState().setAssets(updatedAssets)

    // === HISTORICAL & RANDOM EVENTS ===
    const historicalEvents = checkHistoricalEvents(currentDate)
    historicalEvents.forEach((event) => {
      applyEventImpact(event, { marketStore, playerStore, notificationStore })
    })
    const randomEvents = triggerRandomEvents()
    randomEvents.forEach((event) => {
      applyEventImpact(event, { marketStore, playerStore, notificationStore })
    })

    // === EDUCATION PROGRESS ===
    try {
      const eduState = educationStore.getState()
      if (eduState.currentEducation) {
        eduState.progressStudy(daysPassed)
      }
    } catch (e) {
      // Education store may not be ready
    }

    // === LIFE DAILY EFFECTS ===
    try {
      lifeStore.getState().applyDailyEffects()
    } catch (e) {
      // Life store may not be ready
    }

    // === BUSINESS DAILY REVENUE ===
    try {
      const ownedBiz = businessStore.getState().ownedBusinesses
      let totalDailyBizRevenue = 0
      Object.keys(ownedBiz).forEach((id) => {
        const rev = businessStore.getState().collectDailyRevenue(id)
        totalDailyBizRevenue += rev
      })
      if (totalDailyBizRevenue > 0) {
        playerStore.getState().adjustCash(totalDailyBizRevenue, 'business_revenue')
      }
    } catch (e) {
      // Business store may not be ready
    }

    // === RANDOM LIFE EVENTS ===
    try {
      if (daysPassed % 3 === 0) {
        const activeEventIds = lifeStore.getState().activeEvents.map((e) => e.id)
        const eventHistoryIds = lifeStore.getState().eventHistory.map((e) => e.id)

        lifeEventsDatabase.forEach((event) => {
          if (event.probability <= 0) return
          if (activeEventIds.includes(event.id)) return
          if (eventHistoryIds.includes(event.id) && event.category === 'achievement') return

          if (Math.random() < event.probability) {
            lifeStore.getState().triggerEvent(event)
            notificationStore.getState().addToast({
              title: event.name,
              description: event.description,
              variant: event.category === 'disaster' ? 'danger' : event.category === 'opportunity' ? 'success' : 'warning',
            })
          }
        })
      }
    } catch (e) {
      // Life events may fail gracefully
    }

    // === NETWORK: CHECK UNLOCKS ===
    try {
      const netState = networkStore.getState()
      const playerState = playerStore.getState()
      const netWorth = playerState.cash + playerState.savings
      const skills = playerState.skills ?? {}
      const properties = Object.keys(realEstateStore.getState().ownedProperties).length
      const businesses = Object.keys(businessStore.getState().ownedBusinesses).length
      const education = educationStore.getState().completedEducation?.length ?? 0
      const lifeState = lifeStore.getState()

      // Auto-unlock contacts based on conditions
      networkDatabase.forEach((contact) => {
        if (netState.unlockedContacts.includes(contact.id)) return
        if (contact.eraAvailability && !contact.eraAvailability.includes(eraData.id)) return

        const cond = contact.unlockCondition ?? {}
        let meetsAll = true
        if (cond.minNetWorth && netWorth < cond.minNetWorth) meetsAll = false
        if (cond.minTradingSkill && (skills.trading ?? 0) < cond.minTradingSkill) meetsAll = false
        if (cond.minProperties && properties < cond.minProperties) meetsAll = false
        if (cond.minBusinesses && businesses < cond.minBusinesses) meetsAll = false
        if (cond.minEducation && education < cond.minEducation) meetsAll = false
        if (cond.minReputation && (lifeState.reputation ?? 0) < cond.minReputation) meetsAll = false
        if (cond.minSavings && (playerState.savings ?? 0) < cond.minSavings) meetsAll = false
        if (cond.minJobPerformance && (skills.jobPerformance ?? 0) < cond.minJobPerformance) meetsAll = false
        if (cond.minAge && (lifeState.age ?? 18) < cond.minAge) meetsAll = false

        if (meetsAll) {
          netState.unlockContact(contact)
          notificationStore.getState().addToast({
            title: 'New Contact!',
            description: `You met ${contact.name} - ${contact.title}`,
            variant: 'success',
          })
        }
      })
    } catch (e) {
      // Network unlocks may fail gracefully
    }

    // === MONTHLY UPDATES ===
    if (daysPassed > 0 && daysPassed % 30 === 0) {
      // Collect rent
      const ownedProperties = realEstateStore.getState().ownedProperties
      const rent = collectRent(ownedProperties)
      if (rent > 0) {
        playerStore.getState().adjustCash(rent, 'rental_income')
        achievementStore.getState().incrementStat('totalRentCollected', rent)
        notificationStore.getState().addToast({
          title: 'Rent Collected',
          description: `You received $${rent.toFixed(2)} in rental income.`,
          variant: 'success',
        })
      }

      // Appreciate properties
      const appreciated = appreciateProperties(ownedProperties)
      Object.entries(appreciated).forEach(([id, property]) => {
        realEstateStore.getState().updateProperty(id, property)
      })

      // Update market listing prices
      const economicGrowth = eraData.marketVolatilityModifier * 0.08
      realEstateDatabase.forEach((property) => {
        if (ownedProperties[property.id]) return
        const monthlyGrowth = economicGrowth / 12
        const randomFactor = 1 + (Math.random() - 0.5) * 0.03
        const currentPrice = realEstateStore.getState().getMarketPrice(property.id, property.price)
        const currentRent = realEstateStore.getState().getMarketRent(property.id, property.monthlyRent)
        const newPrice = Math.round(currentPrice * (1 + monthlyGrowth * randomFactor))
        const newRent = Math.round(currentRent * (1 + monthlyGrowth * randomFactor))
        realEstateStore.getState().updateMarketListing(property.id, newPrice, newRent)
      })

      // Savings interest
      const currentSavings = playerStore.getState().savings
      if (currentSavings > 0) {
        const monthlyRate = 0.035 / 12
        const interest = currentSavings * monthlyRate
        playerStore.getState().setSavings(currentSavings + interest)
        achievementStore.getState().incrementStat('totalInterestEarned', interest)
        if (interest > 1) {
          notificationStore.getState().addToast({
            title: 'Interest Earned',
            description: `Your savings earned $${interest.toFixed(2)} in interest.`,
            variant: 'success',
          })
        }
      }

      // Deduct monthly expenses
      try {
        const expenses = lifeStore.getState().getMonthlyExpenses()
        if (expenses.total > 0) {
          playerStore.getState().adjustCash(-expenses.total, 'monthly_expenses')
          notificationStore.getState().addToast({
            title: 'Monthly Expenses',
            description: `$${expenses.total.toFixed(2)} deducted for living costs.`,
            variant: 'warning',
          })
        }
      } catch (e) {
        // Life store may not be ready
      }

      // Business monthly expenses
      try {
        const ownedBiz = businessStore.getState().ownedBusinesses
        let totalBizExpenses = 0
        Object.values(ownedBiz).forEach((biz) => {
          totalBizExpenses += biz.monthlyExpenses
        })
        if (totalBizExpenses > 0) {
          playerStore.getState().adjustCash(-totalBizExpenses, 'business_expenses')
        }
      } catch (e) {
        // Business store may not be ready
      }
    }

    // === YEARLY UPDATES ===
    if (daysPassed > 0 && daysPassed % 365 === 0) {
      try {
        lifeStore.getState().ageUp()
      } catch (e) {
        // Life store may not be ready
      }
    }

    // === ACHIEVEMENT TRACKING ===
    const currentCash = playerStore.getState().cash
    const currentSavings = playerStore.getState().savings
    const ownedPropertiesCount = Object.keys(realEstateStore.getState().ownedProperties).length
    const portfolioValue = Object.values(portfolioStore.getState().positions).reduce(
      (sum, pos) => sum + (pos.quantity * pos.currentPrice || 0),
      0,
    )
    const netWorth = currentCash + currentSavings + portfolioValue

    if (currentCash > achievementStore.getState().stats.maxCash) {
      achievementStore.getState().updateStat('maxCash', currentCash)
    }
    if (netWorth > achievementStore.getState().stats.maxNetWorth) {
      achievementStore.getState().updateStat('maxNetWorth', netWorth)
    }
    if (currentSavings > achievementStore.getState().stats.maxSavings) {
      achievementStore.getState().updateStat('maxSavings', currentSavings)
    }

    achievementStore.getState().updateStat('daysSurvived', daysPassed)
    achievementStore.getState().updateStat('propertiesOwned', ownedPropertiesCount)

    if (daysPassed === 30) {
      achievementStore.getState().updateStat('netWorthAt30Days', netWorth)
    }

    const gameDate = new Date(currentDate)
    if (gameDate.getFullYear() === 1929 && gameDate.getMonth() === 9 && gameDate.getDate() >= 24 && netWorth > 0) {
      achievementStore.getState().updateStat('survivedCrash1929', true)
    }

    checkAchievements(achievementStore.getState().stats, {
      netWorth,
      daysPassed,
      currentDate: gameDate,
    })
  }, [daysPassed, monthsPassed, currentDate, eraData])
}
