import { useMemo } from 'react'

import realEstateDatabase from '@/data/realEstateDatabase'
import { useRealEstateStore } from '@/stores/realEstateStore'

export function useRealEstate() {
  // Subscribe to specific store values to ensure re-renders
  const ownedProperties = useRealEstateStore((state) => state.ownedProperties)
  const marketListings = useRealEstateStore((state) => state.marketListings)
  const propertyEvents = useRealEstateStore((state) => state.propertyEvents)
  const addProperty = useRealEstateStore((state) => state.addProperty)
  const updateProperty = useRealEstateStore((state) => state.updateProperty)
  const removeProperty = useRealEstateStore((state) => state.removeProperty)
  const updateMarketListing = useRealEstateStore((state) => state.updateMarketListing)
  const getMarketPrice = useRealEstateStore((state) => state.getMarketPrice)
  const getMarketRent = useRealEstateStore((state) => state.getMarketRent)
  const logEvent = useRealEstateStore((state) => state.logEvent)
  const resetProperties = useRealEstateStore((state) => state.resetProperties)

  return useMemo(
    () => {
      // Apply dynamic market prices to available properties
      const availableProperties = realEstateDatabase.map((property) => {
        const marketPrice = getMarketPrice(property.id, property.price)
        const marketRent = getMarketRent(property.id, property.monthlyRent)
        
        return {
          ...property,
          price: marketPrice,
          monthlyRent: marketRent,
        }
      })

      return {
        ownedProperties,
        marketListings,
        propertyEvents,
        addProperty,
        updateProperty,
        removeProperty,
        updateMarketListing,
        getMarketPrice,
        getMarketRent,
        logEvent,
        resetProperties,
        availableProperties,
        ownedPropertiesList: Object.values(ownedProperties || {}),
      }
    },
    [ownedProperties, marketListings, propertyEvents, addProperty, updateProperty, removeProperty, updateMarketListing, getMarketPrice, getMarketRent, logEvent, resetProperties],
  )
}
