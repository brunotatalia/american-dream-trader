import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useRealEstate } from '@/hooks/useRealEstate'

export default function PropertyDetails({ propertyId }) {
  const { ownedProperties } = useRealEstate()
  const property = propertyId ? ownedProperties[propertyId] : null

  if (!property) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-text-tertiary">
          Select a property to review mortgage, rent, and maintenance information.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{property.type}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-text-secondary">
        <p>Location: {property.location}</p>
        <p>Current Value: ${property.currentValue}</p>
        <p>Monthly Rent: ${property.monthlyRent}</p>
        <p>Maintenance: {property.maintenance * 100}%</p>
      </CardContent>
    </Card>
  )
}
