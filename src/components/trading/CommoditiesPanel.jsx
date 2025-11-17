import { useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Table from '@/components/ui/Table'
import commoditiesDatabase from '@/data/commoditiesDatabase'
import { useMarket } from '@/hooks/useMarket'
import { useNotifications } from '@/hooks/useNotifications'
import { useTrading } from '@/hooks/useTrading'
import { formatCurrency } from '@/utils/formatters'
import { executeBuyOrder, executeSellOrder } from '@/utils/tradingEngine'

export default function CommoditiesPanel() {
  const { assetsList } = useMarket()
  const { portfolio, market, player } = useTrading()
  const { notify } = useNotifications()

  const [tradeModal, setTradeModal] = useState({ isOpen: false, asset: null, action: null })
  const [quantity, setQuantity] = useState(1)

  // Flatten commodities into tradable list
  const allCommodities = Object.values(commoditiesDatabase)
    .flat()
    .map((commodity) => {
      const marketData = assetsList.find((a) => a.id === commodity.id || a.symbol === commodity.id)
      return {
        ...commodity,
        ...marketData,
        currentPrice: marketData?.currentPrice ?? commodity.initialPrice,
      }
    })

  const openBuyModal = (asset) => {
    setTradeModal({ isOpen: true, asset, action: 'buy' })
    setQuantity(1)
  }

  const closeModal = () => {
    setTradeModal({ isOpen: false, asset: null, action: null })
    setQuantity(1)
  }

  const handleExecuteTrade = () => {
    const { asset, action } = tradeModal

    if (!asset || !quantity || quantity <= 0) {
      notify({ title: 'Invalid Order', description: 'Please enter a valid quantity.', variant: 'danger' })
      return
    }

    const price = asset.currentPrice ?? asset.initialPrice

    if (action === 'buy') {
      const result = executeBuyOrder({
        symbol: asset.id,
        quantity,
        price,
        player,
        portfolio,
        market,
      })

      if (result.success) {
        notify({ title: 'Order Executed', description: result.message, variant: 'success' })
        closeModal()
      } else {
        notify({ title: 'Order Failed', description: result.error, variant: 'danger' })
      }
    } else if (action === 'sell') {
      const result = executeSellOrder({
        symbol: asset.id,
        quantity,
        price,
        player,
        portfolio,
      })

      if (result.success) {
        const profitText =
          result.profit > 0
            ? `Profit: ${formatCurrency(result.profit)}`
            : `Loss: ${formatCurrency(Math.abs(result.profit))}`
        notify({
          title: 'Order Executed',
          description: `${result.message}. ${profitText}`,
          variant: result.profit > 0 ? 'success' : 'warning',
        })
        closeModal()
      } else {
        notify({ title: 'Order Failed', description: result.error, variant: 'danger' })
      }
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Commodities Market</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            columns={[
              { accessor: 'name', title: 'Commodity' },
              { accessor: 'unit', title: 'Unit' },
              { accessor: 'sector', title: 'Category' },
              {
                accessor: 'currentPrice',
                title: 'Price',
                render: (row) => formatCurrency(row.currentPrice ?? row.initialPrice ?? 0),
              },
              {
                accessor: 'priceChange',
                title: 'Change',
                render: (row) => {
                  const change = row.priceChange ?? 0
                  const changePercent = row.priceChangePercent ?? 0
                  const color = change >= 0 ? 'text-market-bullish' : 'text-market-bearish'
                  return (
                    <span className={color}>
                      {change >= 0 ? '+' : ''}
                      {changePercent.toFixed(2)}%
                    </span>
                  )
                },
              },
              {
                accessor: 'actions',
                title: 'Actions',
                render: (row) => (
                  <Button size="sm" variant="primary" onClick={() => openBuyModal(row)}>
                    Buy
                  </Button>
                ),
              },
            ]}
            data={allCommodities}
            keyField="id"
          />
        </CardContent>
      </Card>

      <Modal
        isOpen={tradeModal.isOpen}
        onClose={closeModal}
        title={`${tradeModal.action === 'buy' ? 'Buy' : 'Sell'} ${tradeModal.asset?.name ?? ''}`}
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant={tradeModal.action === 'buy' ? 'success' : 'danger'} onClick={handleExecuteTrade}>
              {tradeModal.action === 'buy' ? 'Buy' : 'Sell'}
            </Button>
          </div>
        }
      >
        {tradeModal.asset && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-text-tertiary">Commodity</p>
                <p className="font-semibold text-text-primary">{tradeModal.asset.name}</p>
              </div>
              <div>
                <p className="text-text-tertiary">Price per {tradeModal.asset.unit}</p>
                <p className="font-semibold text-text-primary">
                  {formatCurrency(tradeModal.asset.currentPrice ?? tradeModal.asset.initialPrice ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-text-tertiary">Category</p>
                <p className="font-semibold capitalize text-text-primary">{tradeModal.asset.sector ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-text-tertiary">Volatility</p>
                <p className="font-semibold text-text-primary">
                  {((tradeModal.asset.volatility ?? 0) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {tradeModal.asset.narrative && (
              <div className="rounded-lg border border-white/5 bg-background-tertiary/40 p-3">
                <p className="text-sm text-text-secondary">{tradeModal.asset.narrative}</p>
              </div>
            )}

            <div>
              <label htmlFor="commodity-quantity" className="mb-2 block text-sm font-medium text-text-secondary">
                Quantity ({tradeModal.asset.unit}s)
              </label>
              <input
                id="commodity-quantity"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-lg border border-white/10 bg-background-tertiary px-4 py-2 text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
              />
            </div>

            <div className="rounded-lg border border-white/5 bg-background-tertiary/40 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-tertiary">Total Cost</span>
                <span className="font-display text-lg text-text-primary">
                  {formatCurrency(
                    quantity * (tradeModal.asset.currentPrice ?? tradeModal.asset.initialPrice ?? 0) +
                      (tradeModal.action === 'buy' ? 10 : -10),
                  )}
                </span>
              </div>
              <p className="mt-2 text-xs text-text-tertiary">Includes $10 commission fee</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

