import { useNavigate } from 'react-router-dom'

import DebugPanel from '@/components/core/DebugPanel'
import PriceMonitor from '@/components/core/PriceMonitor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Chart from '@/components/ui/Chart'
import { useEra } from '@/hooks/useEra'
import { useGameState } from '@/hooks/useGameState'
import { useMarket } from '@/hooks/useMarket'
import { usePlayer } from '@/hooks/usePlayer'
import { useAchievementStore } from '@/stores/achievementStore'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { useRealEstateStore } from '@/stores/realEstateStore'
import { formatCurrency } from '@/utils/formatters'
import { simulatePortfolioValue } from '@/utils/marketSimulator'

export default function Dashboard() {
  const navigate = useNavigate()
  const { cash, savings, dailyBalanceDelta } = usePlayer()
  const { assetsList } = useMarket()
  const { formattedDate, daysPassed } = useGameState()
  const { eraData } = useEra()
  const portfolio = usePortfolioStore((state) => state.positions)
  const realEstate = useRealEstateStore((state) => state.ownedProperties)
  const achievements = useAchievementStore((state) => state.unlockedAchievements)

  const portfolioValue = simulatePortfolioValue(portfolio)
  const realEstateValue = Object.values(realEstate).reduce((sum, prop) => sum + (prop.currentValue || prop.price), 0)

  const totalNetWorth = cash + savings + portfolioValue + realEstateValue

  return (
    <div className="grid gap-6">
      <DebugPanel />
      
      {/* Price Monitor - Shows real-time price updates */}
      <PriceMonitor />
      
      {/* Show warning if prices are corrupted */}
      {assetsList.some((a) => isNaN(a.currentPrice)) && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="py-4">
            <p className="text-sm font-semibold text-red-400">
              ⚠️ Market data corrupted. Please clear localStorage and restart:
            </p>
            <code className="mt-2 block text-xs text-text-tertiary">
              Open Console (F12) → Type: localStorage.clear() → Refresh page
            </code>
          </CardContent>
        </Card>
      )}
      {eraData && (
        <Card className="border-accent-primary/20 bg-gradient-to-r from-accent-primary/10 to-transparent">
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm uppercase tracking-wider text-text-tertiary">Current Era</p>
              <p className="font-display text-2xl font-semibold text-accent-primary">{eraData.name}</p>
              <p className="mt-1 text-sm text-text-secondary">{eraData.description}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-tertiary">Days Survived</p>
              <p className="font-display text-3xl text-text-primary">{daysPassed}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Net Worth</CardTitle>
            <p className="text-sm text-text-tertiary">As of {formattedDate}</p>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl">{formatCurrency(totalNetWorth)}</p>
            <p className="mt-2 text-sm text-text-secondary">
              Daily change: {formatCurrency(dailyBalanceDelta)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Liquidity</CardTitle>
            <p className="text-sm text-text-tertiary">Cash + Savings</p>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-display text-2xl">{formatCurrency(cash + savings)}</p>
            <div className="flex items-center justify-between text-sm text-text-secondary">
              <span>Cash</span>
              <span>{formatCurrency(cash)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-text-secondary">
              <span>Savings</span>
              <span>{formatCurrency(savings)}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
            <p className="text-sm text-text-tertiary">Investments</p>
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl">{formatCurrency(portfolioValue)}</p>
            <p className="mt-2 text-sm text-text-secondary">
              {Object.keys(portfolio).length} positions
            </p>
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Market Pulse</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              data={assetsList.slice(0, 10).map((asset) => ({
                label: asset.symbol ?? asset.name,
                value: asset.currentPrice ?? asset.initialPrice ?? 0,
              }))}
              dataKey="value"
            />
          </CardContent>
        </Card>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-background-tertiary/40 px-4 py-3">
              <span className="text-sm text-text-secondary">💵 Cash</span>
              <span className="font-semibold text-text-primary">{formatCurrency(cash)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-background-tertiary/40 px-4 py-3">
              <span className="text-sm text-text-secondary">🏦 Savings</span>
              <span className="font-semibold text-text-primary">{formatCurrency(savings)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-background-tertiary/40 px-4 py-3">
              <span className="text-sm text-text-secondary">📈 Stocks & Commodities</span>
              <span className="font-semibold text-text-primary">{formatCurrency(portfolioValue)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-background-tertiary/40 px-4 py-3">
              <span className="text-sm text-text-secondary">🏠 Real Estate</span>
              <span className="font-semibold text-text-primary">{formatCurrency(realEstateValue)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-accent-primary/20 bg-accent-primary/10 px-4 py-3">
              <span className="text-sm font-semibold text-accent-primary">💰 Total Net Worth</span>
              <span className="font-display text-xl text-accent-primary">{formatCurrency(totalNetWorth)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Player Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-background-tertiary/40 px-4 py-3">
              <span className="text-sm text-text-secondary">⏰ Days Survived</span>
              <span className="font-semibold text-text-primary">{daysPassed} days</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-background-tertiary/40 px-4 py-3">
              <span className="text-sm text-text-secondary">📊 Stock Positions</span>
              <span className="font-semibold text-text-primary">{Object.keys(portfolio).length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-background-tertiary/40 px-4 py-3">
              <span className="text-sm text-text-secondary">🏘️ Properties Owned</span>
              <span className="font-semibold text-text-primary">{Object.keys(realEstate).length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-background-tertiary/40 px-4 py-3">
              <span className="text-sm text-text-secondary">🏆 Achievements</span>
              <span className="font-semibold text-text-primary">{Object.keys(achievements).length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-accent-success/20 bg-accent-success/10 px-4 py-3">
              <span className="text-sm font-semibold text-accent-success">📈 Daily Change</span>
              <span className={`font-semibold ${dailyBalanceDelta >= 0 ? 'text-accent-success' : 'text-accent-danger'}`}>
                {dailyBalanceDelta >= 0 ? '+' : ''}{formatCurrency(dailyBalanceDelta)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investment Opportunities</CardTitle>
            <p className="text-sm text-text-tertiary">Explore all ways to grow your wealth</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => navigate(action.path)}
                  className="group flex items-center justify-between rounded-lg border border-white/5 bg-background-tertiary/60 px-4 py-3 text-left transition-all hover:border-accent-primary/50 hover:bg-accent-primary/5 hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-text-primary">{action.title}</p>
                    <p className="text-xs text-text-tertiary mt-1">{action.description}</p>
                  </div>
                  <span className="ml-3 text-xl opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                    →
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

const QUICK_ACTIONS = [
  {
    id: 'open-jobs',
    title: '💼 Find a Job',
    description: 'Secure steady income with new opportunities.',
    cta: 'Explore Jobs',
    path: '/jobs',
  },
  {
    id: 'market-watch',
    title: '📈 Trade Stocks',
    description: 'Buy and sell stocks from 20+ companies.',
    cta: 'Open Trading',
    path: '/trading',
  },
  {
    id: 'commodities',
    title: '🌾 Trade Commodities',
    description: 'Invest in gold, oil, wheat, and more.',
    cta: 'View Commodities',
    path: '/trading',
  },
  {
    id: 'property-scout',
    title: '🏠 Buy Real Estate',
    description: 'Build wealth through property ownership.',
    cta: 'Browse Properties',
    path: '/real-estate',
  },
  {
    id: 'banking',
    title: '🏦 Banking Services',
    description: 'Save money and earn 3.5% interest.',
    cta: 'Open Account',
    path: '/banking',
  },
  {
    id: 'casino',
    title: '🎰 Try Your Luck',
    description: 'Casino games (high risk, high reward).',
    cta: 'Enter Casino',
    path: '/casino',
  },
]
