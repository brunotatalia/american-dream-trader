import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const persistConfig = {
  name: 'adt-life-store',
  partialize: (state) => ({
    lifestyle: state.lifestyle,
    health: state.health,
    happiness: state.happiness,
    energy: state.energy,
    reputation: state.reputation,
    age: state.age,
    relationships: state.relationships,
    activeEvents: state.activeEvents,
    eventHistory: state.eventHistory,
    lifeLog: state.lifeLog,
    milestones: state.milestones,
  }),
}

export const useLifeStore = create(
  persist(
    (set, get) => ({
      lifestyle: {
        housing: 'shared_room',
        food: 'basic_groceries',
        transport: 'walking',
        insurance: false,
        clothing: 'basic',
        entertainment: 'none',
      },
      health: 100,
      happiness: 70,
      energy: 100,
      reputation: 0,
      age: 18,
      relationships: {
        partner: null,
        children: 0,
        friends: [],
      },
      activeEvents: [],
      eventHistory: [],
      lifeLog: [
        { date: new Date().toISOString(), entry: 'Arrived in America with a dream and determination.', type: 'milestone' },
      ],
      milestones: [],

      setLifestyle: (category, tier) =>
        set((state) => ({
          lifestyle: { ...state.lifestyle, [category]: tier },
        })),

      adjustHealth: (amount) =>
        set((state) => ({
          health: Math.max(0, Math.min(100, state.health + amount)),
        })),

      adjustHappiness: (amount) =>
        set((state) => ({
          happiness: Math.max(0, Math.min(100, state.happiness + amount)),
        })),

      adjustEnergy: (amount) =>
        set((state) => ({
          energy: Math.max(0, Math.min(100, state.energy + amount)),
        })),

      adjustReputation: (amount) =>
        set((state) => ({
          reputation: Math.max(0, Math.min(100, state.reputation + amount)),
        })),

      ageUp: () =>
        set((state) => ({
          age: state.age + 1,
          lifeLog: [
            ...state.lifeLog,
            { date: new Date().toISOString(), entry: `Turned ${state.age + 1} years old.`, type: 'birthday' },
          ].slice(-200),
        })),

      triggerEvent: (event) =>
        set((state) => ({
          activeEvents: [...state.activeEvents, { ...event, triggeredAt: Date.now() }],
        })),

      resolveEvent: (eventId, choiceId) => {
        const state = get()
        const event = state.activeEvents.find((e) => e.id === eventId)
        if (!event) return

        const choice = event.choices?.find((c) => c.id === choiceId)
        const outcome = choice?.outcome ?? event.defaultOutcome ?? {}

        set({
          activeEvents: state.activeEvents.filter((e) => e.id !== eventId),
          eventHistory: [
            ...state.eventHistory,
            { ...event, resolvedAt: Date.now(), chosenOption: choiceId },
          ].slice(-100),
          health: Math.max(0, Math.min(100, state.health + (outcome.health ?? 0))),
          happiness: Math.max(0, Math.min(100, state.happiness + (outcome.happiness ?? 0))),
          reputation: Math.max(0, Math.min(100, state.reputation + (outcome.reputation ?? 0))),
        })

        return outcome
      },

      dismissEvent: (eventId) =>
        set((state) => ({
          activeEvents: state.activeEvents.filter((e) => e.id !== eventId),
          eventHistory: [
            ...state.eventHistory,
            { id: eventId, resolvedAt: Date.now(), dismissed: true },
          ].slice(-100),
        })),

      addLifeLogEntry: (entry) =>
        set((state) => ({
          lifeLog: [
            ...state.lifeLog,
            { date: new Date().toISOString(), ...entry },
          ].slice(-200),
        })),

      addMilestone: (milestone) =>
        set((state) => {
          if (state.milestones.some((m) => m.id === milestone.id)) return state
          return {
            milestones: [...state.milestones, { ...milestone, achievedAt: Date.now() }],
            lifeLog: [
              ...state.lifeLog,
              { date: new Date().toISOString(), entry: milestone.description, type: 'milestone' },
            ].slice(-200),
          }
        }),

      applyDailyEffects: () =>
        set((state) => {
          let energyRegen = 20
          let happinessChange = 0
          let healthChange = 0

          // Housing effects
          if (state.lifestyle.housing === 'homeless') {
            healthChange -= 2
            happinessChange -= 3
          } else if (state.lifestyle.housing === 'mansion') {
            happinessChange += 1
          }

          // Food effects
          if (state.lifestyle.food === 'starving') {
            healthChange -= 3
            energyRegen -= 10
          } else if (state.lifestyle.food === 'healthy_organic') {
            healthChange += 0.5
            energyRegen += 5
          }

          // Entertainment
          if (state.lifestyle.entertainment === 'regular') {
            happinessChange += 1
          }

          return {
            energy: Math.min(100, state.energy + energyRegen),
            health: Math.max(0, Math.min(100, state.health + healthChange)),
            happiness: Math.max(0, Math.min(100, state.happiness + happinessChange)),
          }
        }),

      getMonthlyExpenses: () => {
        const { lifestyle } = get()
        const HOUSING_COSTS = {
          homeless: 0, shared_room: 30, studio: 60, one_bedroom: 120,
          nice_apartment: 250, house: 500, luxury_home: 1200, mansion: 3000,
        }
        const FOOD_COSTS = {
          starving: 0, street_food: 15, basic_groceries: 30, good_diet: 60,
          healthy_organic: 100, fine_dining: 250,
        }
        const TRANSPORT_COSTS = {
          walking: 0, public_transit: 10, used_car: 40, nice_car: 100, luxury_car: 250,
        }
        const housing = HOUSING_COSTS[lifestyle.housing] ?? 30
        const food = FOOD_COSTS[lifestyle.food] ?? 30
        const transport = TRANSPORT_COSTS[lifestyle.transport] ?? 0
        const insurance = lifestyle.insurance ? 30 : 0
        const clothing = lifestyle.clothing === 'professional' ? 25 : lifestyle.clothing === 'designer' ? 100 : 5
        const entertainment = lifestyle.entertainment === 'regular' ? 25 : lifestyle.entertainment === 'premium' ? 50 : 0

        return { housing, food, transport, insurance, clothing, entertainment, total: housing + food + transport + insurance + clothing + entertainment }
      },

      resetLife: () =>
        set({
          lifestyle: { housing: 'shared_room', food: 'basic_groceries', transport: 'walking', insurance: false, clothing: 'basic', entertainment: 'none' },
          health: 100, happiness: 70, energy: 100, reputation: 0, age: 18,
          relationships: { partner: null, children: 0, friends: [] },
          activeEvents: [], eventHistory: [], milestones: [],
          lifeLog: [{ date: new Date().toISOString(), entry: 'Arrived in America with a dream and determination.', type: 'milestone' }],
        }),
    }),
    persistConfig,
  ),
)
