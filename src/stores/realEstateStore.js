import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const persistConfig = {
  name: 'adt-real-estate-store',
  partialize: (state) => ({
    ownedProperties: state.ownedProperties,
    propertyEvents: state.propertyEvents,
    marketListings: state.marketListings,
  }),
}

export const useRealEstateStore = create(
  persist(
    (set, get) => ({
      ownedProperties: {},
      propertyEvents: [],
      marketListings: {}, // Dynamic market prices by property ID
      addProperty: (property) =>
        set((state) => ({
          ownedProperties: {
            ...state.ownedProperties,
            [property.id]: property,
          },
        })),
      updateProperty: (propertyId, updates) =>
        set((state) => ({
          ownedProperties: {
            ...state.ownedProperties,
            [propertyId]: {
              ...(state.ownedProperties[propertyId] || {}),
              ...updates,
            },
          },
        })),
      removeProperty: (propertyId) =>
        set((state) => {
          const ownedProperties = { ...state.ownedProperties }
          delete ownedProperties[propertyId]
          return { ownedProperties }
        }),
      updateMarketListing: (propertyId, price, rent) =>
        set((state) => ({
          marketListings: {
            ...state.marketListings,
            [propertyId]: { price, rent, lastUpdated: Date.now() },
          },
        })),
      getMarketPrice: (propertyId, defaultPrice) => {
        const listing = get().marketListings[propertyId]
        return listing ? listing.price : defaultPrice
      },
      getMarketRent: (propertyId, defaultRent) => {
        const listing = get().marketListings[propertyId]
        return listing ? listing.rent : defaultRent
      },
      logEvent: (event) =>
        set((state) => ({
          propertyEvents: [event, ...state.propertyEvents].slice(0, 100),
        })),
      resetProperties: () => set({ ownedProperties: {}, propertyEvents: [], marketListings: {} }),
    }),
    persistConfig,
  ),
)
