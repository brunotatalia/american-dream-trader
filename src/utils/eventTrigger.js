import eventsDatabase from '@/data/eventsDatabase'

import { pickWeighted } from './randomizers'

/**
 * Check if a historical event should trigger on a given date
 */
export function checkHistoricalEvents(currentDateString) {
  const currentDate = new Date(currentDateString).toISOString().split('T')[0]

  return eventsDatabase.filter((event) => {
    if (!event.date) return false
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
    const marketEvents = eventsDatabase.filter((e) =>
      ['market', 'market_event', 'market_crash', 'technology_boom'].includes(e.type) && !e.date
    )
    if (marketEvents.length > 0) {
      const weightedEvents = marketEvents.map((e) => ({
        value: e,
        weight: (e.probability ?? 0.1) * 100,
      }))
      const event = pickWeighted(weightedEvents)
      if (event) events.push(event)
    }
  }

  // Economic/policy events (2% chance daily)
  if (Math.random() < 0.02) {
    const policyEvents = eventsDatabase.filter((e) =>
      ['personal', 'policy', 'real_estate_boom'].includes(e.type) && !e.date
    )
    if (policyEvents.length > 0) {
      const weightedEvents = policyEvents.map((e) => ({
        value: e,
        weight: (e.probability ?? 0.1) * 100,
      }))
      const event = pickWeighted(weightedEvents)
      if (event) events.push(event)
    }
  }

  // Opportunity events (1% chance daily)
  if (Math.random() < 0.01) {
    const opportunityEvents = eventsDatabase.filter((e) =>
      ['opportunity'].includes(e.type) && !e.date
    )
    if (opportunityEvents.length > 0) {
      const weightedEvents = opportunityEvents.map((e) => ({
        value: e,
        weight: (e.probability ?? 0.1) * 100,
      }))
      const event = pickWeighted(weightedEvents)
      if (event) events.push(event)
    }
  }

  return events
}

/**
 * Apply event impacts to game state
 */
export function applyEventImpact(event, { marketStore, playerStore, notificationStore }) {
  const { impact, description, name } = event
  if (!impact) {
    // Event with no impact - just notify
    notificationStore.getState().addToast({
      title: name ?? 'Event',
      description: description ?? '',
      variant: 'info',
      duration: 6000,
    })
    return
  }

  const isNegative = (impact.stocks ?? 0) < 0 || impact.jobLoss

  // Notify player
  notificationStore.getState().addToast({
    title: name ?? 'Event',
    description: description ?? '',
    variant: isNegative ? 'danger' : 'info',
    duration: 6000,
  })

  // Apply stock market impact
  if (impact.stocks) {
    const assets = marketStore.getState().assets
    const updatedAssets = {}

    Object.entries(assets).forEach(([symbol, asset]) => {
      const price = asset.currentPrice ?? asset.initialPrice ?? 0
      if (price > 0) {
        updatedAssets[symbol] = {
          ...asset,
          currentPrice: price * (1 + impact.stocks),
        }
      }
    })

    if (Object.keys(updatedAssets).length > 0) {
      marketStore.getState().setAssets({ ...assets, ...updatedAssets })
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

