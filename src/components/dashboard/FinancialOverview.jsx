import { motion } from 'framer-motion'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  CircleDollarSign,
} from 'lucide-react'
import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { usePlayerStore } from '@/stores/playerStore'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { formatCurrency } from '@/utils/formatters'

const INCOME_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
const EXPENSE_COLORS = ['#ef4444', '#f97316', '#ec4899', '#6366f1']
const PORTFOLIO_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-background-elevated px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-text-primary">{payload[0].name}</p>
      <p className="text-text-secondary">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

function MiniPieChart({ data, colors, title, icon: Icon, emptyLabel = 'No data' }) {
  const hasData = data.some((d) => d.value > 0)

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 flex items-center gap-2">
        <Icon size={14} className="text-text-tertiary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          {title}
        </span>
      </div>
      {hasData ? (
        <>
          <div className="h-[140px] w-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.filter((d) => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {data
                    .filter((d) => d.value > 0)
                    .map((entry, i) => (
                      <Cell key={entry.name} fill={colors[i % colors.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
            {data
              .filter((d) => d.value > 0)
              .map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-1">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: colors[i % colors.length] }}
                  />
                  <span className="text-[10px] text-text-tertiary">{entry.name}</span>
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className="flex h-[140px] w-[140px] items-center justify-center">
          <span className="text-xs text-text-tertiary/50">{emptyLabel}</span>
        </div>
      )}
    </div>
  )
}

export default function FinancialOverview({ netWorth = 0, previousNetWorth = 0 }) {
  const incomePerDay = usePlayerStore((s) => s.incomePerDay)
  const expensesPerDay = usePlayerStore((s) => s.expensesPerDay)
  const portfolio = usePortfolioStore((s) => s.positions)

  const monthlyIncome = incomePerDay * 30
  const monthlyExpenses = expensesPerDay * 30
  const cashFlow = monthlyIncome - monthlyExpenses
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0
  const netWorthChange = netWorth - previousNetWorth
  const netWorthTrend = netWorthChange >= 0 ? 'up' : 'down'

  // Estimate income sources
  const jobIncome = monthlyIncome * 0.85
  const investmentIncome = monthlyIncome * 0.1
  const rentalIncome = monthlyIncome * 0.05
  const otherIncome = 0

  const incomeData = [
    { name: 'Employment', value: Math.max(0, jobIncome) },
    { name: 'Investments', value: Math.max(0, investmentIncome) },
    { name: 'Rental', value: Math.max(0, rentalIncome) },
    { name: 'Other', value: Math.max(0, otherIncome) },
  ]

  // Estimate expense categories
  const housingExpense = monthlyExpenses * 0.35
  const foodExpense = monthlyExpenses * 0.25
  const transportExpense = monthlyExpenses * 0.2
  const otherExpense = monthlyExpenses * 0.2

  const expenseData = [
    { name: 'Housing', value: Math.max(0, housingExpense) },
    { name: 'Food', value: Math.max(0, foodExpense) },
    { name: 'Transport', value: Math.max(0, transportExpense) },
    { name: 'Other', value: Math.max(0, otherExpense) },
  ]

  // Portfolio allocation
  const portfolioEntries = Object.entries(portfolio)
  const portfolioData = useMemo(() => {
    if (portfolioEntries.length === 0) return []
    return portfolioEntries.map(([symbol, pos]) => ({
      name: symbol,
      value: Math.abs((pos.quantity || 0) * (pos.avgPrice || 0)),
    }))
  }, [portfolioEntries])

  // Cash flow chart data
  const cashFlowData = [
    { name: 'Income', income: monthlyIncome, expenses: 0 },
    { name: 'Expenses', income: 0, expenses: monthlyExpenses },
    { name: 'Net', income: Math.max(0, cashFlow), expenses: Math.max(0, -cashFlow) },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleDollarSign size={18} className="text-accent-primary" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Net Worth Hero */}
          <div className="rounded-xl border border-accent-primary/10 bg-gradient-to-r from-accent-primary/5 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
                  Net Worth
                </p>
                <motion.p
                  className="mt-1 font-display text-3xl font-bold text-text-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {formatCurrency(netWorth)}
                </motion.p>
              </div>
              <div
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold ${
                  netWorthTrend === 'up'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {netWorthTrend === 'up' ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                {formatCurrency(Math.abs(netWorthChange))}
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <MiniPieChart
              data={incomeData}
              colors={INCOME_COLORS}
              title="Income Sources"
              icon={TrendingUp}
              emptyLabel="No income yet"
            />
            <MiniPieChart
              data={expenseData}
              colors={EXPENSE_COLORS}
              title="Expense Breakdown"
              icon={TrendingDown}
              emptyLabel="No expenses"
            />
            <MiniPieChart
              data={portfolioData}
              colors={PORTFOLIO_COLORS}
              title="Portfolio Allocation"
              icon={Wallet}
              emptyLabel="No investments"
            />
          </div>

          {/* Cash Flow Bar */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Monthly Cash Flow
              </span>
              <span
                className={`text-sm font-bold ${
                  cashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {cashFlow >= 0 ? '+' : ''}
                {formatCurrency(cashFlow)}
              </span>
            </div>
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData} barGap={4}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Savings Rate */}
          <div className="rounded-xl border border-white/5 bg-background-primary/40 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PiggyBank size={16} className="text-accent-primary" />
                <span className="text-sm text-text-secondary">Monthly Savings Rate</span>
              </div>
              <span
                className={`font-display text-lg font-bold ${
                  savingsRate > 20
                    ? 'text-emerald-400'
                    : savingsRate > 0
                      ? 'text-yellow-400'
                      : 'text-red-400'
                }`}
              >
                {savingsRate.toFixed(1)}%
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-background-tertiary/60">
              <motion.div
                className={`h-full rounded-full ${
                  savingsRate > 20
                    ? 'bg-emerald-500'
                    : savingsRate > 0
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
