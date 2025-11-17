import eventsDatabase from '@/data/eventsDatabase'

import { pickWeighted } from './randomizers'

/**
 * Check if a historical event should trigger on a given date
 */
export function checkHistoricalEvents(currentDateString) {
  const currentDate = new Date(currentDateString).toISOString().split('T')[0]

  return eventsDatabase.filter((event) => {
    if (event.type !== 'historical') return false
    return event.date === currentDate
  })
}

/**
 * Trigger random events based on probability
 */
export function triggerRandomEvents() {
  const events = []

  // Market events (5% chance daily)
  if (Math.random() < 0.05) {
    const marketEvents = eventsDatabase.filter((e) => e.type === 'market' && e.probability)
    if (marketEvents.length > 0) {
      const weightedEvents = marketEvents.map((e) => ({
        value: e,
        weight: e.probability * 100,
      }))
      const event = pickWeighted(weightedEvents)
      events.push(event)
    }
  }

  // Personal events (2% chance daily)
  if (Math.random() < 0.02) {
    const personalEvents = eventsDatabase.filter((e) => e.type === 'personal' && e.probability)
    if (personalEvents.length > 0) {
      const weightedEvents = personalEvents.map((e) => ({
        value: e,
        weight: e.probability * 100,
      }))
      const event = pickWeighted(weightedEvents)
      events.push(event)
    }
  }

  // Opportunity events (1% chance daily)
  if (Math.random() < 0.01) {
    const opportunityEvents = eventsDatabase.filter((e) => e.type === 'opportunity' && e.probability)
    if (opportunityEvents.length > 0) {
      const weightedEvents = opportunityEvents.map((e) => ({
        value: e,
        weight: e.probability * 100,
      }))
      const event = pickWeighted(weightedEvents)
      events.push(event)
    }
  }

  return events
}

/**
 * Apply event impacts to game state
 */
export function applyEventImpact(event, { marketStore, playerStore, notificationStore }) {
  const { impact, description, name } = event

  // Notify player
  notificationStore.getState().addToast({
    title: name,
    description,
    variant: impact.stocks < 0 || impact.jobLoss ? 'danger' : 'info',
    duration: 6000,
  })

  // Apply stock market impact
  if (impact.stocks) {
    const assets = marketStore.getState().assets
    const updatedAssets = {}

    Object.entries(assets).forEach(([symbol, asset]) => {
      if (asset.sector === 'stocks' || asset.category === 'stocks') {
        updatedAssets[symbol] = {
          ...asset,
          currentPrice: asset.currentPrice * (1 + impact.stocks),
        }
      }
    })

    if (Object.keys(updatedAssets).length > 0) {
      marketStore.setState({ assets: { ...assets, ...updatedAssets } })
    }
  }

  // Apply real estate impact
  if (impact.realEstate) {
    // Future: update real estate values
  }

  // Apply job loss chance
  if (impact.jobs && Math.random() < Math.abs(impact.jobs)) {
    playerStore.getState().setActiveJob(null)
    notificationStore.getState().addToast({
      title: 'Job Lost',
      description: 'Economic turmoil has forced you out of your current position.',
      variant: 'danger',
    })
  }
}

