import { useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Chart from '@/components/ui/Chart'
import Modal from '@/components/ui/Modal'
import Table from '@/components/ui/Table'
import Tabs from '@/components/ui/Tabs'
import { useMarket } from '@/hooks/useMarket'
import { useNotifications } from '@/hooks/useNotifications'
import { useTrading } from '@/hooks/useTrading'
import { formatCurrency } from '@/utils/formatters'
import { executeBuyOrder, executeSellOrder } from '@/utils/tradingEngine'

import CommoditiesPanel from './CommoditiesPanel'

export default function TradingHub() {
  const { assetsList, lastUpdated } = useMarket()
  const { portfolio, cashAvailable, market, player } = useTrading()
  const { notify } = useNotifications()
  
  const [activeTab, setActiveTab] = useState('stocks')
  
  // Log when component re-renders with new data
  console.log('📈 TradingHub render:', { 
    assetsCount: assetsList.length, 
    lastUpdated: lastUpdated ? new Date(lastUpdated).toLocaleString() : 'never',
    samplePrice: assetsList[0]?.currentPrice 
  })

  const [tradeModal, setTradeModal] = useState({ isOpen: false, asset: null, action: null })
  const [quantity, setQuantity] = useState(1)

  const openBuyModal = (asset) => {
    setTradeModal({ isOpen: true, asset, action: 'buy' })
    setQuantity(1)
  }

  const openSellModal = (asset) => {
    setTradeModal({ isOpen: true, asset, action: 'sell' })
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
        symbol: asset.symbol ?? asset.id,
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
        symbol: asset.symbol ?? asset.id,
        quantity,
        price,
        player,
        portfolio,
      })

      if (result.success) {
        const profitText = result.profit > 0 ? `Profit: ${formatCurrency(result.profit)}` : `Loss: ${formatCurrency(Math.abs(result.profit))}`
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

  const stockAssets = assetsList.filter((a) => a.sector && a.symbol)

  const TABS = [
    { id: 'stocks', label: 'Stocks' },
    { id: 'commodities', label: 'Commodities' },
    { id: 'options', label: 'Options (Soon)' },
  ]

  return (
    <div className="grid gap-4">
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
          {lastUpdated && (
            <p className="text-xs text-text-tertiary">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>

      {activeTab === 'commodities' && <CommoditiesPanel />}

      {activeTab === 'options' && (
        <Card>
          <CardHeader>
            <CardTitle>Options Trading</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-text-tertiary">
            Call and Put options with Greeks calculation will be added in Phase 3 Sprint 3.3.
          </CardContent>
        </Card>
      )}

      {activeTab === 'stocks' && (
        <>
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              data={stockAssets.slice(0, 12).map((asset) => ({
                label: asset.symbol ?? asset.name,
                value: asset.currentPrice ?? asset.initialPrice ?? 0,
              }))}
              dataKey="value"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Buying Power</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-text-secondary">
            <p className="font-display text-2xl text-text-primary">{formatCurrency(cashAvailable)}</p>
            <p className="text-text-tertiary">
              Available cash after reserving margin and pending orders.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Available Stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              columns={[
                { accessor: 'symbol', title: 'Symbol' },
                { accessor: 'name', title: 'Name' },
                { accessor: 'sector', title: 'Sector' },
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
              data={stockAssets}
              keyField="symbol"
            />
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(portfolio.positions).length === 0 ? (
              <p className="text-sm text-text-tertiary">No open positions. Buy stocks to start building your portfolio.</p>
            ) : (
              <Table
                columns={[
                  { accessor: 'symbol', title: 'Symbol' },
                  { accessor: 'quantity', title: 'Shares' },
                  {
                    accessor: 'averagePrice',
                    title: 'Avg Cost',
                    render: (row) => formatCurrency(row.averagePrice ?? 0),
                  },
                  {
                    accessor: 'currentPrice',
                    title: 'Current',
                    render: (row) => formatCurrency(row.currentPrice ?? 0),
                  },
                  {
                    accessor: 'pnl',
                    title: 'P&L',
                    render: (row) => {
                      const pnl = (row.currentPrice - row.averagePrice) * row.quantity
                      const color = pnl >= 0 ? 'text-market-bullish' : 'text-market-bearish'
                      return <span className={color}>{formatCurrency(pnl)}</span>
                    },
                  },
                  {
                    accessor: 'actions',
                    title: 'Actions',
                    render: (row) => (
                      <Button size="sm" variant="danger" onClick={() => openSellModal(row)}>
                        Sell
                      </Button>
                    ),
                  },
                ]}
                data={Object.keys(portfolio.positions).map((symbol) => {
                  const position = portfolio.positions[symbol]
                  const marketAsset = market.getAsset(symbol)
                  return {
                    symbol,
                    ...position,
                    currentPrice: marketAsset?.currentPrice ?? position.currentPrice ?? position.averagePrice,
                  }
                })}
              />
            )}
          </CardContent>
        </Card>
      </section>

      <Modal
        isOpen={tradeModal.isOpen}
        onClose={closeModal}
        title={`${tradeModal.action === 'buy' ? 'Buy' : 'Sell'} ${tradeModal.asset?.name ?? tradeModal.asset?.symbol ?? ''}`}
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
                <p className="text-text-tertiary">Symbol</p>
                <p className="font-semibold text-text-primary">{tradeModal.asset.symbol ?? tradeModal.asset.id}</p>
              </div>
              <div>
                <p className="text-text-tertiary">Price</p>
                <p className="font-semibold text-text-primary">
                  {formatCurrency(tradeModal.asset.currentPrice ?? tradeModal.asset.initialPrice ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-text-tertiary">Sector</p>
                <p className="font-semibold text-text-primary">{tradeModal.asset.sector ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-text-tertiary">Volatility</p>
                <p className="font-semibold text-text-primary">{((tradeModal.asset.volatility ?? 0) * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div>
              <label htmlFor="quantity-input" className="mb-2 block text-sm font-medium text-text-secondary">
                Quantity
              </label>
              <input
                id="quantity-input"
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
        </>
      )}
    </div>
  )
}

