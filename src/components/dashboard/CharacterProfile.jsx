import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Heart,
  Smile,
  Zap,
  Star,
  Briefcase,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Pencil,
  Check,
  X,
  Shield,
} from 'lucide-react'
import { useState } from 'react'

import { Card, CardContent } from '@/components/ui/Card'
import { useEducationStore } from '@/stores/educationStore'
import { useGameStore } from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'
import { formatCurrency } from '@/utils/formatters'

const LIFE_STAGES = [
  { label: 'Struggling', minWorth: -Infinity, maxWorth: 500, color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30' },
  { label: 'Getting By', minWorth: 500, maxWorth: 5000, color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/30' },
  { label: 'Comfortable', minWorth: 5000, maxWorth: 50000, color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/30' },
  { label: 'Wealthy', minWorth: 50000, maxWorth: 500000, color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30' },
  { label: 'Tycoon', minWorth: 500000, maxWorth: Infinity, color: 'text-purple-400', bg: 'bg-purple-500/20 border-purple-500/30' },
]

const EDUCATION_LABELS = {
  HIGH_SCHOOL_DIPLOMA: 'High School',
  COMMUNITY_COLLEGE_FINANCE: 'Community College (Finance)',
  COMMUNITY_COLLEGE_BUSINESS: 'Community College (Business)',
  BACHELORS_ECONOMICS: "Bachelor's (Economics)",
  BACHELORS_BUSINESS: "Bachelor's (Business)",
  MBA: 'MBA',
  CFA_CERTIFICATION: 'CFA',
  PHD_ECONOMICS: 'PhD (Economics)',
  REAL_ESTATE_LICENSE: 'Real Estate License',
  TRADE_SCHOOL: 'Trade School',
}

function getLifeStage(netWorth) {
  return LIFE_STAGES.find((s) => netWorth >= s.minWorth && netWorth < s.maxWorth) || LIFE_STAGES[0]
}

function getStatColor(value) {
  if (value > 70) return '#10b981'
  if (value >= 40) return '#f59e0b'
  return '#ef4444'
}

function getStatBgClass(value) {
  if (value > 70) return 'bg-emerald-500'
  if (value >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

function StatBar({ icon: Icon, label, value, delay = 0 }) {
  const color = getStatColor(value)
  const bgClass = getStatBgClass(value)

  return (
    <div className="group">
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon size={14} style={{ color }} />
          <span className="text-xs font-medium text-text-secondary">{label}</span>
        </div>
        <motion.span
          className="text-xs font-bold"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
        >
          {value}
        </motion.span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-background-primary/60">
        <motion.div
          className={`h-full rounded-full ${bgClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          style={{ boxShadow: `0 0 8px ${color}40` }}
        />
      </div>
    </div>
  )
}

export default function CharacterProfile({ netWorth = 0 }) {
  const profile = usePlayerStore((s) => s.profile)
  const setProfile = usePlayerStore((s) => s.setProfile)
  const activeJob = usePlayerStore((s) => s.activeJob)
  const skills = usePlayerStore((s) => s.skills)
  const incomePerDay = usePlayerStore((s) => s.incomePerDay)
  const expensesPerDay = usePlayerStore((s) => s.expensesPerDay)
  const daysPassed = useGameStore((s) => s.daysPassed)

  const completedEducation = useEducationStore((s) => s.completedEducation) || []

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(profile?.name || 'Player One')
  const [editTitle, setEditTitle] = useState(profile?.title || 'Dreamer')

  const lifeStats = {
    health: 100,
    happiness: 70,
    energy: 100,
    reputation: Math.min(100, Math.floor((skills?.trading || 0) + (skills?.jobPerformance || 0) + (skills?.realEstate || 0))),
  }

  const lifeStage = getLifeStage(netWorth)
  const age = 18 + Math.floor(daysPassed / 365)
  const monthlyIncome = incomePerDay * 30
  const monthlyExpenses = expensesPerDay * 30

  const highestEducation = completedEducation.length > 0
    ? completedEducation[completedEducation.length - 1]
    : 'HIGH_SCHOOL_DIPLOMA'

  const topSkills = Object.entries(skills || {})
    .filter(([, val]) => val > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)

  const handleSaveEdit = () => {
    setProfile({ name: editName, title: editTitle })
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditName(profile?.name || 'Player One')
    setEditTitle(profile?.title || 'Dreamer')
    setIsEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-accent-primary/10 bg-gradient-to-br from-background-elevated/80 via-background-elevated/60 to-accent-primary/5">
        <CardContent className="p-0">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-accent-primary via-purple-500 to-pink-500" />

          <div className="grid gap-6 p-6 lg:grid-cols-[280px_1fr_280px]">
            {/* Left: Avatar & Identity */}
            <div className="flex flex-col items-center gap-4 lg:border-r lg:border-white/5 lg:pr-6">
              {/* Avatar circle */}
              <motion.div
                className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-accent-primary/40 bg-gradient-to-br from-accent-primary/20 to-purple-500/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <User size={40} className="text-accent-primary" />
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-background-elevated text-xs font-bold text-text-primary ring-2 ring-accent-primary/30">
                  {age}
                </div>
              </motion.div>

              {/* Name & Title */}
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="editing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex w-full flex-col items-center gap-2"
                  >
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-lg border border-accent-primary/30 bg-background-primary/60 px-3 py-1.5 text-center font-display text-lg font-bold text-text-primary outline-none focus:border-accent-primary"
                      maxLength={24}
                    />
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-background-primary/60 px-3 py-1 text-center text-sm text-text-secondary outline-none focus:border-accent-primary/50"
                      maxLength={32}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="rounded-lg bg-accent-success/20 p-1.5 text-accent-success transition-colors hover:bg-accent-success/30"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="rounded-lg bg-accent-danger/20 p-1.5 text-accent-danger transition-colors hover:bg-accent-danger/30"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="display"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="group flex items-center gap-2">
                      <h2 className="font-display text-xl font-bold text-text-primary">
                        {profile?.name || 'Player One'}
                      </h2>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="rounded p-1 text-text-tertiary opacity-0 transition-all hover:bg-white/5 hover:text-text-secondary group-hover:opacity-100"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                    <p className="text-sm italic text-text-tertiary">
                      {profile?.title || 'Dreamer'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Life Stage Badge */}
              <motion.div
                className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${lifeStage.bg} ${lifeStage.color}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, delay: 0.2 }}
              >
                {lifeStage.label}
              </motion.div>

              {/* Job & Education */}
              <div className="mt-2 flex w-full flex-col gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-background-primary/40 px-3 py-2">
                  <Briefcase size={14} className="shrink-0 text-accent-primary" />
                  <span className="truncate text-xs text-text-secondary">
                    {activeJob || 'Unemployed'}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-background-primary/40 px-3 py-2">
                  <GraduationCap size={14} className="shrink-0 text-purple-400" />
                  <span className="truncate text-xs text-text-secondary">
                    {EDUCATION_LABELS[highestEducation] || highestEducation}
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Life Stats */}
            <div className="flex flex-col gap-4">
              <h3 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                <Shield size={14} />
                Life Stats
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <StatBar icon={Heart} label="Health" value={lifeStats.health} delay={0} />
                <StatBar icon={Smile} label="Happiness" value={lifeStats.happiness} delay={0.1} />
                <StatBar icon={Zap} label="Energy" value={lifeStats.energy} delay={0.2} />
                <StatBar icon={Star} label="Reputation" value={lifeStats.reputation} delay={0.3} />
              </div>

              {/* Skills summary */}
              {topSkills.length > 0 && (
                <div className="mt-2">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                    Active Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {topSkills.map(([skill, value]) => (
                      <motion.span
                        key={skill}
                        className="rounded-lg border border-white/5 bg-background-primary/50 px-3 py-1 text-xs text-text-secondary"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <span className="capitalize">{skill}</span>
                        <span className="ml-1.5 font-bold text-accent-primary">
                          Lv.{Math.floor(value)}
                        </span>
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Monthly Finances */}
            <div className="flex flex-col gap-4 lg:border-l lg:border-white/5 lg:pl-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                Monthly Finances
              </h3>

              {/* Income */}
              <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/5 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-emerald-400" />
                    <span className="text-xs text-text-secondary">Income</span>
                  </div>
                  <span className="font-display text-sm font-bold text-emerald-400">
                    {formatCurrency(monthlyIncome)}
                  </span>
                </div>
              </div>

              {/* Expenses */}
              <div className="rounded-lg border border-red-500/10 bg-red-500/5 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown size={14} className="text-red-400" />
                    <span className="text-xs text-text-secondary">Expenses</span>
                  </div>
                  <span className="font-display text-sm font-bold text-red-400">
                    {formatCurrency(monthlyExpenses)}
                  </span>
                </div>
              </div>

              {/* Cash Flow */}
              <div className="rounded-lg border border-accent-primary/10 bg-accent-primary/5 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-text-secondary">Cash Flow</span>
                  <span
                    className={`font-display text-sm font-bold ${
                      monthlyIncome - monthlyExpenses >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {monthlyIncome - monthlyExpenses >= 0 ? '+' : ''}
                    {formatCurrency(monthlyIncome - monthlyExpenses)}
                  </span>
                </div>
              </div>

              {/* Income vs Expenses Bar */}
              <div className="mt-auto">
                <div className="mb-1 text-xs text-text-tertiary">Income vs Expenses</div>
                <div className="flex h-3 overflow-hidden rounded-full bg-background-primary/60">
                  {monthlyIncome + monthlyExpenses > 0 ? (
                    <>
                      <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(monthlyIncome / (monthlyIncome + monthlyExpenses)) * 100}%`,
                        }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                      <motion.div
                        className="h-full bg-red-500"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(monthlyExpenses / (monthlyIncome + monthlyExpenses)) * 100}%`,
                        }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      />
                    </>
                  ) : (
                    <div className="h-full w-full bg-background-tertiary/40" />
                  )}
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-text-tertiary">
                  <span className="text-emerald-400">Income</span>
                  <span className="text-red-400">Expenses</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
