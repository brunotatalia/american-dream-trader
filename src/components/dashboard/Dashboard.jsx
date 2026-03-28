import { motion } from 'framer-motion'
import {
  Briefcase,
  LineChart,
  Home,
  GraduationCap,
  Dices,
  Bell,
  ChevronRight,
  AlertTriangle,
  Clock,
} from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import DebugPanel from '@/components/core/DebugPanel'
import PriceMonitor from '@/components/core/PriceMonitor'
import CharacterProfile from '@/components/dashboard/CharacterProfile'
import FinancialOverview from '@/components/dashboard/FinancialOverview'
import MilestonesTimeline from '@/components/dashboard/MilestonesTimeline'
import QuickStats from '@/components/dashboard/QuickStats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useEra } from '@/hooks/useEra'
import { useGameState } from '@/hooks/useGameState'
import { useMarket } from '@/hooks/useMarket'
import { usePlayer } from '@/hooks/usePlayer'
import { useNotificationStore } from '@/stores/notificationStore'
import { usePlayerStore } from '@/stores/playerStore'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { simulatePortfolioValue } from '@/utils/marketSimulator'

const QUICK_ACTIONS = [
  {
    id: 'open-jobs',
    title: 'Find a Job',
    description: 'Secure steady income with new opportunities.',
    cta: 'Explore Jobs',
    path: '/jobs',
    icon: Briefcase,
    color: 'text-emerald-400',
    borderColor: 'hover:border-emerald-500/40',
  },
  {
    id: 'market-watch',
    title: 'Review Market',
    description: 'Track price movements and portfolio health.',
    cta: 'Open Trading',
    path: '/trading',
    icon: LineChart,
    color: 'text-blue-400',
    borderColor: 'hover:border-blue-500/40',
  },
  {
    id: 'property-scout',
    title: 'Scout Properties',
    description: 'Look for passive income through rentals.',
    cta: 'Browse Homes',
    path: '/real-estate',
    icon: Home,
    color: 'text-amber-400',
    borderColor: 'hover:border-amber-500/40',
  },
  {
    id: 'education',
    title: 'Get Educated',
    description: 'Unlock better careers and investment skills.',
    cta: 'View Courses',
    path: '/education',
    icon: GraduationCap,
    color: 'text-purple-400',
    borderColor: 'hover:border-purple-500/40',
  },
]

function RecentEventsPanel() {
  let toasts = []
  try {
    toasts = useNotificationStore.getState().toasts || []
  } catch {
    toasts = []
  }

  const recentEvents = toasts.slice(0, 8)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell size={18} className="text-accent-primary" />
          Recent Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentEvents.length > 0 ? (
          <div className="space-y-2">
            {recentEvents.map((event, index) => (
              <motion.div
                key={event.id || index}
                className="flex items-start gap-3 rounded-lg border border-white/5 bg-background-primary/30 px-3 py-2.5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="mt-0.5">
                  <Clock size={12} className="text-text-tertiary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-text-secondary">
                    {event.title || event.message || 'Event occurred'}
                  </p>
                  {(event.description || event.variant) && (
                    <p className="mt-0.5 truncate text-[10px] capitalize text-text-tertiary">
                      {event.description || event.variant}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell size={24} className="mb-2 text-text-tertiary/30" />
            <p className="text-sm text-text-tertiary">No recent events</p>
            <p className="mt-1 text-xs text-text-tertiary/50">
              Events will appear here as you play
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function QuickActionsPanel() {
  const navigate = useNavigate()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dices size={18} className="text-accent-primary" />
          Quick Actions
        </CardTitle>
        <p className="mt-1 text-sm text-text-tertiary">Jump into core activities</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {QUICK_ACTIONS.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.button
                key={action.id}
                type="button"
                onClick={() => navigate(action.path)}
                className={`group flex items-center gap-3 rounded-lg border border-white/5 bg-background-primary/30 px-4 py-3 text-left transition-all hover:bg-background-tertiary/40 ${action.borderColor}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.08 }}
                whileHover={{ x: 4 }}
              >
                <div className={`rounded-lg bg-background-tertiary/60 p-2 ${action.color}`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary">{action.title}</p>
                  <p className="truncate text-xs text-text-tertiary">{action.description}</p>
                </div>
                <ChevronRight
                  size={16}
                  className="shrink-0 text-text-tertiary transition-transform group-hover:translate-x-1 group-hover:text-text-secondary"
                />
              </motion.button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { cash, savings } = usePlayer()
  const { assetsList } = useMarket()
  const { formattedDate, daysPassed } = useGameState()
  const { eraData } = useEra()
  const portfolio = usePortfolioStore((state) => state.positions)
  const netWorthHistory = usePlayerStore((s) => s.netWorthHistory)

  const portfolioValue = useMemo(() => simulatePortfolioValue(portfolio), [portfolio])
  const totalNetWorth = cash + savings + portfolioValue

  // Estimate previous net worth from history
  const previousNetWorth = useMemo(() => {
    if (netWorthHistory && netWorthHistory.length > 1) {
      return netWorthHistory[netWorthHistory.length - 2]?.cash || totalNetWorth
    }
    return totalNetWorth
  }, [netWorthHistory, totalNetWorth])

  return (
    <div className="space-y-6">
      {/* Debug Panel - kept for development */}
      <DebugPanel />

      {/* Price Monitor */}
      <PriceMonitor />

      {/* Market data corruption warning */}
      {assetsList.some((a) => isNaN(a.currentPrice)) && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle size={18} className="shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-semibold text-red-400">
                Market data corrupted. Please clear localStorage and restart:
              </p>
              <code className="mt-1 block text-xs text-text-tertiary">
                Open Console (F12) → Type: localStorage.clear() → Refresh page
              </code>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Era Banner */}
      {eraData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-accent-primary/20 bg-gradient-to-r from-accent-primary/10 via-accent-primary/5 to-transparent">
            <CardContent className="flex items-center justify-between py-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
                  Current Era
                </p>
                <p className="font-display text-lg font-semibold text-accent-primary">
                  {eraData.name}
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">{eraData.description}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-text-tertiary">
                  {formattedDate}
                </p>
                <p className="font-display text-2xl font-bold text-text-primary">
                  Day {daysPassed}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Character Profile - Full Width */}
      <CharacterProfile netWorth={totalNetWorth} />

      {/* Quick Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <QuickStats netWorth={totalNetWorth} />
      </motion.div>

      {/* Bottom Row: Financial Overview + Right Panel */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Financial Overview */}
        <FinancialOverview netWorth={totalNetWorth} previousNetWorth={previousNetWorth} />

        {/* Right Column: Recent Events + Quick Actions */}
        <div className="flex flex-col gap-6">
          <RecentEventsPanel />
          <QuickActionsPanel />
        </div>
      </div>

      {/* Milestones Timeline - Full Width */}
      <MilestonesTimeline netWorth={totalNetWorth} />
    </div>
  )
}
