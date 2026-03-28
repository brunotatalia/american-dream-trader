import { motion } from 'framer-motion'
import {
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Home,
  Building2,
  GraduationCap,
  Users,
  Trophy,
  Flame,
  BarChart3,
} from 'lucide-react'
import { useMemo } from 'react'

import { Card, CardContent } from '@/components/ui/Card'
import { useAchievementStore } from '@/stores/achievementStore'
import { useEducationStore } from '@/stores/educationStore'
import { useGameStore } from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { useRealEstateStore } from '@/stores/realEstateStore'
import { formatCurrency } from '@/utils/formatters'
import { simulatePortfolioValue } from '@/utils/marketSimulator'

const EDUCATION_LABELS = {
  HIGH_SCHOOL_DIPLOMA: 'High School',
  COMMUNITY_COLLEGE_FINANCE: 'CC Finance',
  COMMUNITY_COLLEGE_BUSINESS: 'CC Business',
  BACHELORS_ECONOMICS: "Bachelor's Econ",
  BACHELORS_BUSINESS: "Bachelor's Biz",
  MBA: 'MBA',
  CFA_CERTIFICATION: 'CFA',
  PHD_ECONOMICS: 'PhD Econ',
  REAL_ESTATE_LICENSE: 'RE License',
  TRADE_SCHOOL: 'Trade School',
}

function StatCard({ icon: Icon, label, value, subtitle, trend, trendValue, color, delay = 0 }) {
  const iconColor = color || 'text-accent-primary'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="group relative overflow-hidden border-white/5 transition-all duration-300 hover:border-white/10 hover:shadow-lg hover:shadow-black/30">
        <CardContent className="p-4">
          {/* Subtle glow on hover */}
          <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-accent-primary/5 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />

          <div className="flex items-start justify-between">
            <div className={`rounded-lg bg-background-primary/50 p-2 ${iconColor}`}>
              <Icon size={16} />
            </div>
            {trend && (
              <div
                className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  trend === 'up'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {trendValue}
              </div>
            )}
          </div>

          <motion.p
            className="mt-3 font-display text-xl font-bold text-text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {value}
          </motion.p>

          <p className="mt-1 text-xs text-text-tertiary">{label}</p>

          {subtitle && (
            <p className="mt-0.5 text-[10px] text-text-tertiary/60">{subtitle}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function QuickStats({ netWorth = 0 }) {
  const incomePerDay = usePlayerStore((s) => s.incomePerDay)
  const expensesPerDay = usePlayerStore((s) => s.expensesPerDay)
  const dailyBalanceDelta = incomePerDay - expensesPerDay
  const daysPassed = useGameStore((s) => s.daysPassed)
  const portfolio = usePortfolioStore((s) => s.positions)
  const ownedProperties = useRealEstateStore((s) => s.ownedProperties)

  const unlockedAchievements = useAchievementStore((s) => s.unlockedAchievements)
  const achievementCount = Object.keys(unlockedAchievements || {}).length
  const completedEducation = useEducationStore((s) => s.completedEducation) || []

  const portfolioValue = useMemo(() => simulatePortfolioValue(portfolio), [portfolio])

  const monthlyIncome = incomePerDay * 30
  const monthlyExpenses = expensesPerDay * 30
  const cashFlow = monthlyIncome - monthlyExpenses
  const propertiesCount = Object.keys(ownedProperties).length
  const positionsCount = Object.keys(portfolio).length

  const age = 18 + Math.floor(daysPassed / 365)

  const highestEducation = completedEducation.length > 0
    ? completedEducation[completedEducation.length - 1]
    : 'HIGH_SCHOOL_DIPLOMA'

  // Financial freedom progress = passive income / expenses
  // For now, approximate passive income as a small fraction
  const passiveIncome = portfolioValue * 0.0004 + propertiesCount * 20 // rough estimate
  const financialFreedomPct = monthlyExpenses > 0
    ? Math.min(100, (passiveIncome * 30 / monthlyExpenses) * 100)
    : 0

  const stats = [
    {
      icon: Calendar,
      label: 'Days Survived / Age',
      value: `Day ${daysPassed}`,
      subtitle: `Age ${age}`,
      color: 'text-cyan-400',
    },
    {
      icon: DollarSign,
      label: 'Net Worth',
      value: formatCurrency(netWorth),
      trend: dailyBalanceDelta >= 0 ? 'up' : 'down',
      trendValue: formatCurrency(Math.abs(dailyBalanceDelta)) + '/day',
      color: 'text-emerald-400',
    },
    {
      icon: TrendingUp,
      label: 'Monthly Income',
      value: formatCurrency(monthlyIncome),
      subtitle: formatCurrency(incomePerDay) + '/day',
      color: 'text-green-400',
    },
    {
      icon: TrendingDown,
      label: 'Monthly Expenses',
      value: formatCurrency(monthlyExpenses),
      subtitle: formatCurrency(expensesPerDay) + '/day',
      color: 'text-red-400',
    },
    {
      icon: BarChart3,
      label: 'Cash Flow',
      value: (cashFlow >= 0 ? '+' : '') + formatCurrency(cashFlow),
      subtitle: 'Monthly net',
      trend: cashFlow >= 0 ? 'up' : 'down',
      trendValue: cashFlow >= 0 ? 'Positive' : 'Negative',
      color: cashFlow >= 0 ? 'text-emerald-400' : 'text-red-400',
    },
    {
      icon: Wallet,
      label: 'Portfolio Value',
      value: formatCurrency(portfolioValue),
      subtitle: `${positionsCount} position${positionsCount !== 1 ? 's' : ''}`,
      color: 'text-blue-400',
    },
    {
      icon: Home,
      label: 'Properties Owned',
      value: String(propertiesCount),
      subtitle: propertiesCount > 0 ? 'Generating rent' : 'None yet',
      color: 'text-amber-400',
    },
    {
      icon: Building2,
      label: 'Businesses Running',
      value: '0',
      subtitle: 'Coming soon',
      color: 'text-purple-400',
    },
    {
      icon: GraduationCap,
      label: 'Education Level',
      value: EDUCATION_LABELS[highestEducation] || 'High School',
      subtitle: `${completedEducation.length} completed`,
      color: 'text-indigo-400',
    },
    {
      icon: Users,
      label: 'Network Size',
      value: '0',
      subtitle: 'Coming soon',
      color: 'text-pink-400',
    },
    {
      icon: Trophy,
      label: 'Achievements',
      value: String(achievementCount),
      subtitle: 'Unlocked',
      color: 'text-yellow-400',
    },
    {
      icon: Flame,
      label: 'Financial Freedom',
      value: `${financialFreedomPct.toFixed(1)}%`,
      subtitle: 'Passive income / expenses',
      color: financialFreedomPct >= 100 ? 'text-emerald-400' : 'text-orange-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index * 0.05} />
      ))}
    </div>
  )
}
