import { useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Table from '@/components/ui/Table'
import { useEra } from '@/hooks/useEra'
import { useNotifications } from '@/hooks/useNotifications'
import { usePlayer } from '@/hooks/usePlayer'
import { useRealEstate } from '@/hooks/useRealEstate'
import { formatCurrency, formatPercent } from '@/utils/formatters'
import { purchaseProperty } from '@/utils/realEstateEngine'

export default function RealEstateHub() {
  const { availableProperties, ownedPropertiesList, addProperty } = useRealEstate()
  const { eraData } = useEra()
  const player = usePlayer()
  const { notify } = useNotifications()

  const [selectedProperty, setSelectedProperty] = useState(null)

  // Filter properties available in current era
  const eraProperties = eraData
    ? availableProperties.filter((prop) => !prop.eraAvailability || prop.eraAvailability.includes(eraData.id))
    : availableProperties

  const handlePurchase = () => {
    if (!selectedProperty) return

    const result = purchaseProperty({
      property: selectedProperty,
      player,
      realEstate: { addProperty },
      notify,
    })

    if (result.success) {
      setSelectedProperty(null)
    }
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Property Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          {ownedPropertiesList.length === 0 ? (
            <p className="text-sm text-text-tertiary">No properties yet. Browse available listings below.</p>
          ) : (
            <Table
              columns={[
                { accessor: 'type', title: 'Type' },
                { accessor: 'location', title: 'Location' },
                { accessor: 'currentValue', title: 'Value', render: (row) => formatCurrency(row.currentValue ?? row.price) },
                { accessor: 'monthlyRent', title: 'Rent', render: (row) => formatCurrency(row.monthlyRent) },
                {
                  accessor: 'monthlyPayment',
                  title: 'Mortgage',
                  render: (row) => formatCurrency(row.monthlyPayment ?? 0),
                },
              ]}
              data={ownedPropertiesList}
              keyField="id"
            />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Available Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            columns={[
              { accessor: 'type', title: 'Type' },
              { accessor: 'location', title: 'Location' },
              { accessor: 'price', title: 'Price', render: (row) => formatCurrency(row.price) },
              { accessor: 'monthlyRent', title: 'Rent', render: (row) => formatCurrency(row.monthlyRent) },
              { accessor: 'downPayment', title: 'Down', render: (row) => formatPercent(row.downPayment) },
              {
                accessor: 'actions',
                title: 'Actions',
                render: (row) => (
                  <Button size="sm" variant="primary" onClick={() => setSelectedProperty(row)}>
                    View
                  </Button>
                ),
              },
            ]}
            data={eraProperties}
            keyField="id"
          />
        </CardContent>
      </Card>

      <Modal
        isOpen={selectedProperty !== null}
        onClose={() => setSelectedProperty(null)}
        title={selectedProperty?.type ?? 'Property Details'}
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setSelectedProperty(null)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handlePurchase}>
              Purchase Property
            </Button>
          </div>
        }
      >
        {selectedProperty && (
          <div className="space-y-4">
            {/* Available Cash Display */}
            <div className="rounded-lg border-2 border-accent-success/30 bg-accent-success/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-accent-success">Available Cash</p>
                  <p className="mt-1 font-display text-2xl font-bold text-accent-success">
                    {formatCurrency(player.cash)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-tertiary">Buying Power</p>
                  <p className="text-sm text-text-secondary">Ready to invest</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-text-tertiary">Location</p>
                <p className="font-semibold text-text-primary">{selectedProperty.location}</p>
              </div>
              <div>
                <p className="text-text-tertiary">Purchase Price</p>
                <p className="font-semibold text-text-primary">{formatCurrency(selectedProperty.price)}</p>
              </div>
              <div>
                <p className="text-text-tertiary">Down Payment ({formatPercent(selectedProperty.downPayment)})</p>
                <p className="font-semibold text-text-primary">
                  {formatCurrency(selectedProperty.price * selectedProperty.downPayment)}
                </p>
              </div>
              <div>
                <p className="text-text-tertiary">Monthly Rent</p>
                <p className="font-semibold text-text-primary">{formatCurrency(selectedProperty.monthlyRent)}</p>
              </div>
              <div>
                <p className="text-text-tertiary">Annual Appreciation</p>
                <p className="font-semibold text-text-primary">{formatPercent(selectedProperty.appreciation)}</p>
              </div>
              <div>
                <p className="text-text-tertiary">Maintenance Cost</p>
                <p className="font-semibold text-text-primary">{formatPercent(selectedProperty.maintenance)} of value</p>
              </div>
            </div>

            <div className="rounded-lg border border-white/5 bg-background-tertiary/40 p-4">
              <p className="text-sm text-text-secondary">{selectedProperty.description}</p>
            </div>

            <div className="rounded-lg border border-white/5 bg-background-tertiary/40 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-tertiary">Cash Required</span>
                <span className="font-display text-lg text-text-primary">
                  {formatCurrency(selectedProperty.price * selectedProperty.downPayment)}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-tertiary">After Purchase</span>
                  <span className={`font-semibold ${
                    player.cash - (selectedProperty.price * selectedProperty.downPayment) >= 0
                      ? 'text-accent-success'
                      : 'text-accent-danger'
                  }`}>
                    {formatCurrency(player.cash - (selectedProperty.price * selectedProperty.downPayment))}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-xs text-text-tertiary">
                Monthly mortgage payment: {formatCurrency((selectedProperty.price - (selectedProperty.price * selectedProperty.downPayment)) * 0.06 / 12)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

