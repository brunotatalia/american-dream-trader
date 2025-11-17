import { useEffect } from 'react'

import realEstateDatabase from '@/data/realEstateDatabase'
import { useEra } from '@/hooks/useEra'
import { useAchievementStore } from '@/stores/achievementStore'
import { useGameStore } from '@/stores/gameStore'
import { useMarketStore } from '@/stores/marketStore'
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
    if (!eraData) {
      console.warn('⚠️ Game loop: No era data')
      return
    }

    // Allow day 0 to run once for initial setup, then skip until day 1+
    if (daysPassed === 0) {
      console.log('⏭️ Game loop: Day 0 - skipping updates')
      return
    }

    console.log(`🔄 Game loop running for day ${daysPassed}`)

    // Get stores
    const marketStore = useMarketStore
    const playerStore = usePlayerStore
    const notificationStore = useNotificationStore
    const realEstateStore = useRealEstateStore
    const achievementStore = useAchievementStore
    const portfolioStore = usePortfolioStore

    // Update market prices
    const currentAssets = marketStore.getState().assets
    
    // Safety check: don't update if market is empty
    if (!currentAssets || Object.keys(currentAssets).length === 0) {
      console.warn('⚠️ Game loop: Market not initialized yet, skipping price update')
      return
    }
    
    console.log(`📊 Day ${daysPassed}: Updating prices for ${Object.keys(currentAssets).length} assets`)
    const updatedAssets = updateMarketPrices(currentAssets, eraData.marketVolatilityModifier)
    
    // Log a sample price change with more detail
    const sampleSymbol = Object.keys(updatedAssets)[0]
    const oldAsset = currentAssets[sampleSymbol]
    const newAsset = updatedAssets[sampleSymbol]
    console.log(`📈 Sample ${sampleSymbol}:`)
    console.log(`   Old: $${oldAsset?.currentPrice?.toFixed(2)} (change: ${oldAsset?.priceChangePercent?.toFixed(2)}%)`)
    console.log(`   New: $${newAsset?.currentPrice?.toFixed(2)} (change: ${newAsset?.priceChangePercent?.toFixed(2)}%)`)
    console.log(`   Volatility: ${oldAsset?.volatility}, Trend: ${oldAsset?.trend}`)
    
    // Verify prices actually changed
    const pricesChanged = oldAsset?.currentPrice !== newAsset?.currentPrice
    console.log(`   Prices changed: ${pricesChanged ? '✓ YES' : '✗ NO - PROBLEM!'}`)
    
    marketStore.getState().setAssets(updatedAssets)
    console.log('✅ Market prices updated, store notified')
    
    // Verify store was updated
    const storeAssets = marketStore.getState().assets
    const storePrice = storeAssets[sampleSymbol]?.currentPrice
    console.log(`   Store verification: $${storePrice?.toFixed(2)}`)
    if (storePrice !== newAsset?.currentPrice) {
      console.error('🚨 STORE NOT UPDATED! Price mismatch!')
    }

    // Check for historical events
    const historicalEvents = checkHistoricalEvents(currentDate)
    historicalEvents.forEach((event) => {
      applyEventImpact(event, { marketStore, playerStore, notificationStore })
    })

    // Trigger random events
    const randomEvents = triggerRandomEvents()
    randomEvents.forEach((event) => {
      applyEventImpact(event, { marketStore, playerStore, notificationStore })
    })

    // Monthly: collect rent, appreciate properties, update market listings, and apply savings interest
    if (daysPassed > 0 && daysPassed % 30 === 0) {
      const ownedProperties = realEstateStore.getState().ownedProperties
      const rent = collectRent(ownedProperties)

      if (rent > 0) {
        playerStore.getState().adjustCash(rent, 'rental_income')
        
        // Track for achievements
        achievementStore.getState().incrementStat('totalRentCollected', rent)
        
        notificationStore.getState().addToast({
          title: 'Rent Collected',
          description: `You received $${rent.toFixed(2)} in rental income.`,
          variant: 'success',
        })
      }

      // Appreciate owned properties
      const appreciated = appreciateProperties(ownedProperties)
      Object.entries(appreciated).forEach(([id, property]) => {
        realEstateStore.getState().updateProperty(id, property)
      })

      // Update market listing prices for available properties
      console.log(`🏠 Month ${Math.floor(daysPassed / 30)}: Updating real estate market prices`)
      const economicGrowth = eraData.marketVolatilityModifier * 0.08 // Base 8% annual growth adjusted by era
      let propertiesUpdated = 0
      
      realEstateDatabase.forEach((property) => {
        // Skip if property is already owned
        if (ownedProperties[property.id]) return
        
        const monthlyGrowth = economicGrowth / 12
        const randomFactor = 1 + (Math.random() - 0.5) * 0.03 // +/- 1.5%
        
        const currentPrice = realEstateStore.getState().getMarketPrice(property.id, property.price)
        const currentRent = realEstateStore.getState().getMarketRent(property.id, property.monthlyRent)
        
        const newPrice = Math.round(currentPrice * (1 + monthlyGrowth * randomFactor))
        const newRent = Math.round(currentRent * (1 + monthlyGrowth * randomFactor))
        
        realEstateStore.getState().updateMarketListing(property.id, newPrice, newRent)
        propertiesUpdated++
        
        // Log first property as sample
        if (propertiesUpdated === 1) {
          console.log(`🏡 Sample: ${property.type} $${currentPrice} → $${newPrice}`)
        }
      })
      
      console.log(`✅ Updated ${propertiesUpdated} real estate listings`)

      // Apply savings interest (3.5% APY, compounded monthly)
      const currentSavings = playerStore.getState().savings
      if (currentSavings > 0) {
        const monthlyRate = 0.035 / 12
        const interest = currentSavings * monthlyRate
        playerStore.getState().setSavings(currentSavings + interest)
        playerStore.getState().adjustCash(0, 'savings_interest') // Just for tracking
        
        // Track for achievements
        achievementStore.getState().incrementStat('totalInterestEarned', interest)
        
        if (interest > 1) {
          notificationStore.getState().addToast({
            title: 'Interest Earned',
            description: `Your savings earned $${interest.toFixed(2)} in interest.`,
            variant: 'success',
          })
        }
      }
    }

    // Update achievement stats
    const currentCash = playerStore.getState().cash
    const currentSavings = playerStore.getState().savings
    const ownedPropertiesCount = Object.keys(realEstateStore.getState().ownedProperties).length
    const portfolioValue = Object.values(portfolioStore.getState().positions).reduce(
      (sum, pos) => sum + (pos.quantity * pos.currentPrice || 0),
      0
    )
    const netWorth = currentCash + currentSavings + portfolioValue

    // Update max values for achievements
    if (currentCash > achievementStore.getState().stats.maxCash) {
      achievementStore.getState().updateStat('maxCash', currentCash)
    }
    if (netWorth > achievementStore.getState().stats.maxNetWorth) {
      achievementStore.getState().updateStat('maxNetWorth', netWorth)
    }
    if (currentSavings > achievementStore.getState().stats.maxSavings) {
      achievementStore.getState().updateStat('maxSavings', currentSavings)
    }
    
    // Update days survived
    achievementStore.getState().updateStat('daysSurvived', daysPassed)
    achievementStore.getState().updateStat('propertiesOwned', ownedPropertiesCount)
    
    // Track net worth at 30 days for speed run achievement
    if (daysPassed === 30) {
      achievementStore.getState().updateStat('netWorthAt30Days', netWorth)
    }
    
    // Check if survived 1929 crash (October 24, 1929)
    const gameDate = new Date(currentDate)
    if (gameDate.getFullYear() === 1929 && gameDate.getMonth() === 9 && gameDate.getDate() >= 24 && netWorth > 0) {
      achievementStore.getState().updateStat('survivedCrash1929', true)
    }

    // Check achievements (do this once per day, not every loop)
    checkAchievements(achievementStore.getState().stats, {
      netWorth,
      daysPassed,
      currentDate: gameDate,
    })

    // Future: Update portfolio positions with new market prices, recalculate P&L
  }, [daysPassed, monthsPassed, currentDate, eraData])
}


