import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Heart, Shield, Zap, Star, Home, UtensilsCrossed, Car, Shirt, Tv, Activity,
  Clock, ChevronRight, AlertTriangle, CheckCircle2,
} from 'lucide-react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import Modal from '@/components/ui/Modal'
import { useLifeStore } from '@/stores/lifeStore'
import { usePlayerStore } from '@/stores/playerStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatCurrency } from '@/utils/formatters'

const HOUSING_TIERS = [
  { id: 'homeless', label: 'Homeless', cost: 0, description: 'Sleep on the streets. Harsh but free.', icon: '🏚️' },
  { id: 'shared_room', label: 'Shared Room', cost: 30, description: 'A bed in a shared boarding house.', icon: '🛏️' },
  { id: 'studio', label: 'Studio Apartment', cost: 60, description: 'Your own small space. Privacy at last.', icon: '🏠' },
  { id: 'one_bedroom', label: 'One Bedroom', cost: 120, description: 'A proper apartment with a bedroom.', icon: '🏡' },
  { id: 'nice_apartment', label: 'Nice Apartment', cost: 250, description: 'A well-furnished apartment in a good area.', icon: '🏢' },
  { id: 'house', label: 'House', cost: 500, description: 'A real house with a yard. The American Dream.', icon: '🏘️' },
  { id: 'luxury_home', label: 'Luxury Home', cost: 1200, description: 'A beautiful home that impresses everyone.', icon: '🏰' },
  { id: 'mansion', label: 'Mansion', cost: 3000, description: 'The pinnacle of residential living.', icon: '🏛️' },
]

const FOOD_TIERS = [
  { id: 'starving', label: 'Starving', cost: 0, description: 'No food budget. Dangerous for health.' },
  { id: 'street_food', label: 'Street Food', cost: 15, description: 'Cheap eats from vendors.' },
  { id: 'basic_groceries', label: 'Basic Groceries', cost: 30, description: 'Simple home cooking.' },
  { id: 'good_diet', label: 'Good Diet', cost: 60, description: 'Balanced meals with variety.' },
  { id: 'healthy_organic', label: 'Healthy Organic', cost: 100, description: 'Premium ingredients for optimal health.' },
  { id: 'fine_dining', label: 'Fine Dining', cost: 250, description: 'Restaurant meals. Great for networking.' },
]

const TRANSPORT_TIERS = [
  { id: 'walking', label: 'Walking', cost: 0, description: 'Free but limits your job range.' },
  { id: 'public_transit', label: 'Public Transit', cost: 10, description: 'Buses and streetcars.' },
  { id: 'used_car', label: 'Used Car', cost: 40, description: 'Freedom to go anywhere.' },
  { id: 'nice_car', label: 'Nice Car', cost: 100, description: 'A respectable automobile.' },
  { id: 'luxury_car', label: 'Luxury Car', cost: 250, description: 'Turn heads wherever you go.' },
]

const STAT_CONFIG = [
  { key: 'health', label: 'Health', icon: Heart, color: 'from-red-500 to-red-400', textColor: 'text-red-400' },
  { key: 'happiness', label: 'Happiness', icon: Star, color: 'from-yellow-500 to-yellow-400', textColor: 'text-yellow-400' },
  { key: 'energy', label: 'Energy', icon: Zap, color: 'from-blue-500 to-blue-400', textColor: 'text-blue-400' },
  { key: 'reputation', label: 'Reputation', icon: Shield, color: 'from-purple-500 to-purple-400', textColor: 'text-purple-400' },
]

const TABS = [
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'events', label: 'Events' },
  { id: 'story', label: 'Life Story' },
  { id: 'stats', label: 'Stats' },
]

export default function LifeHub() {
  const [activeTab, setActiveTab] = useState('lifestyle')
  const [upgradeModal, setUpgradeModal] = useState({ isOpen: false, category: null })

  const lifestyle = useLifeStore((s) => s.lifestyle)
  const health = useLifeStore((s) => s.health)
  const happiness = useLifeStore((s) => s.happiness)
  const energy = useLifeStore((s) => s.energy)
  const reputation = useLifeStore((s) => s.reputation)
  const age = useLifeStore((s) => s.age)
  const activeEvents = useLifeStore((s) => s.activeEvents)
  const lifeLog = useLifeStore((s) => s.lifeLog)
  const setLifestyle = useLifeStore((s) => s.setLifestyle)
  const resolveEvent = useLifeStore((s) => s.resolveEvent)
  const dismissEvent = useLifeStore((s) => s.dismissEvent)
  const getMonthlyExpenses = useLifeStore((s) => s.getMonthlyExpenses)
  const cash = usePlayerStore((s) => s.cash)
  const addToast = useNotificationStore((s) => s.addToast)

  const expenses = getMonthlyExpenses()
  const stats = { health, happiness, energy, reputation }

  const handleUpgrade = (category, tierId) => {
    setLifestyle(category, tierId)
    setUpgradeModal({ isOpen: false, category: null })
    addToast({ title: 'Lifestyle Updated', description: `Your ${category} has been changed.`, variant: 'success' })
  }

  const getTierOptions = (category) => {
    switch (category) {
      case 'housing': return HOUSING_TIERS
      case 'food': return FOOD_TIERS
      case 'transport': return TRANSPORT_TIERS
      default: return []
    }
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Life Management</CardTitle>
          <p className="text-sm text-text-tertiary">Manage your lifestyle, respond to life events, and track your story.</p>
        </CardHeader>
        <CardContent>
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        </CardContent>
      </Card>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {STAT_CONFIG.map((stat) => {
          const Icon = stat.icon
          const value = stats[stat.key]
          return (
            <Card key={stat.key}>
              <CardContent className="py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${stat.textColor}`} />
                  <span className="text-xs text-text-tertiary">{stat.label}</span>
                  <span className={`ml-auto text-sm font-semibold ${stat.textColor}`}>{Math.round(value)}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-background-secondary">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {activeTab === 'lifestyle' && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Housing */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-accent-primary" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Housing</p>
                    <p className="text-xs text-text-tertiary capitalize">{lifestyle.housing.replace(/_/g, ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-accent-warning">{formatCurrency(expenses.housing)}/mo</span>
                  <Button size="sm" variant="ghost" onClick={() => setUpgradeModal({ isOpen: true, category: 'housing' })}>
                    Change <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Food */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UtensilsCrossed className="h-5 w-5 text-accent-success" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Food</p>
                    <p className="text-xs text-text-tertiary capitalize">{lifestyle.food.replace(/_/g, ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-accent-warning">{formatCurrency(expenses.food)}/mo</span>
                  <Button size="sm" variant="ghost" onClick={() => setUpgradeModal({ isOpen: true, category: 'food' })}>
                    Change <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transport */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-accent-info" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Transport</p>
                    <p className="text-xs text-text-tertiary capitalize">{lifestyle.transport.replace(/_/g, ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-accent-warning">{formatCurrency(expenses.transport)}/mo</span>
                  <Button size="sm" variant="ghost" onClick={() => setUpgradeModal({ isOpen: true, category: 'transport' })}>
                    Change <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Summary */}
          <Card className="border-accent-warning/20 bg-accent-warning/5">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-primary">Total Monthly Expenses</p>
                  <p className="text-xs text-text-tertiary">Housing + Food + Transport + Other</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl text-accent-warning">{formatCurrency(expenses.total)}</p>
                  <p className="text-xs text-text-tertiary">per month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="grid gap-4">
          {activeEvents.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Activity className="mx-auto mb-3 h-10 w-10 text-text-disabled" />
                <p className="text-sm text-text-tertiary">No active events. Life is peaceful... for now.</p>
              </CardContent>
            </Card>
          ) : (
            activeEvents.map((event) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-accent-warning/30">
                  <CardContent className="py-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-accent-warning" />
                          <p className="font-semibold text-text-primary">{event.name}</p>
                        </div>
                        <p className="mt-1 text-sm text-text-secondary">{event.description}</p>
                      </div>
                      <span className="rounded-full bg-accent-warning/20 px-2 py-1 text-xs capitalize text-accent-warning">
                        {event.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {event.choices?.map((choice) => (
                        <Button
                          key={choice.id}
                          size="sm"
                          variant="primary"
                          onClick={() => {
                            const outcome = resolveEvent(event.id, choice.id)
                            if (outcome?.cash) {
                              usePlayerStore.getState().adjustCash(outcome.cash, `event_${event.id}`)
                            }
                            addToast({ title: event.name, description: `You chose: ${choice.label}`, variant: 'info' })
                          }}
                        >
                          {choice.label}
                        </Button>
                      ))}
                      <Button size="sm" variant="ghost" onClick={() => dismissEvent(event.id)}>
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}

      {activeTab === 'story' && (
        <Card>
          <CardHeader>
            <CardTitle>Your Life Story</CardTitle>
            <p className="text-sm text-text-tertiary">A journal of your journey through the American Dream.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[...lifeLog].reverse().map((entry, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 rounded-lg border border-white/5 bg-background-tertiary/40 px-4 py-3"
                >
                  <div className="mt-1">
                    {entry.type === 'milestone' ? (
                      <CheckCircle2 className="h-4 w-4 text-accent-success" />
                    ) : entry.type === 'birthday' ? (
                      <Star className="h-4 w-4 text-yellow-400" />
                    ) : (
                      <Clock className="h-4 w-4 text-text-disabled" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-text-primary">{entry.entry}</p>
                    <p className="mt-1 text-xs text-text-disabled">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'stats' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Vital Statistics</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {STAT_CONFIG.map((stat) => {
                const Icon = stat.icon
                const value = stats[stat.key]
                const barColor = value > 70 ? 'bg-accent-success' : value > 40 ? 'bg-accent-warning' : 'bg-accent-danger'
                return (
                  <div key={stat.key}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${stat.textColor}`} />
                        <span className="text-sm text-text-secondary">{stat.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-text-primary">{Math.round(value)}/100</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-background-secondary">
                      <motion.div
                        className={`h-full rounded-full ${barColor}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Personal Info</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-background-tertiary/40 px-4 py-3">
                <span className="text-sm text-text-secondary">Age</span>
                <span className="font-semibold text-text-primary">{age}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-background-tertiary/40 px-4 py-3">
                <span className="text-sm text-text-secondary">Monthly Expenses</span>
                <span className="font-semibold text-accent-warning">{formatCurrency(expenses.total)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-background-tertiary/40 px-4 py-3">
                <span className="text-sm text-text-secondary">Cash Available</span>
                <span className="font-semibold text-accent-success">{formatCurrency(cash)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upgrade Modal */}
      <Modal
        isOpen={upgradeModal.isOpen}
        onClose={() => setUpgradeModal({ isOpen: false, category: null })}
        title={`Change ${upgradeModal.category ? upgradeModal.category.charAt(0).toUpperCase() + upgradeModal.category.slice(1) : ''}`}
      >
        <div className="space-y-2">
          {upgradeModal.category && getTierOptions(upgradeModal.category).map((tier) => {
            const isActive = lifestyle[upgradeModal.category] === tier.id
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => handleUpgrade(upgradeModal.category, tier.id)}
                className={`w-full rounded-lg border p-3 text-left transition-all ${
                  isActive
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-white/10 bg-background-tertiary/40 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {tier.icon && `${tier.icon} `}{tier.label}
                    </p>
                    <p className="text-xs text-text-tertiary">{tier.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-accent-warning">
                    {tier.cost === 0 ? 'Free' : `${formatCurrency(tier.cost)}/mo`}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </Modal>
    </div>
  )
}
