import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2, TrendingUp, Users, Star, DollarSign, AlertTriangle,
  ChevronUp, Briefcase, Rocket, Factory, Store,
} from 'lucide-react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import Modal from '@/components/ui/Modal'
import { useBusinessStore } from '@/stores/businessStore'
import { usePlayerStore } from '@/stores/playerStore'
import { useNotificationStore } from '@/stores/notificationStore'
import businessDatabase from '@/data/businessDatabase'
import { useEra } from '@/hooks/useEra'
import { useGameStore } from '@/stores/gameStore'
import { formatCurrency } from '@/utils/formatters'

const CATEGORY_CONFIG = {
  street: { label: 'Street Level', icon: Store, color: 'text-green-400', bg: 'bg-green-400/10' },
  small: { label: 'Small Business', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  medium: { label: 'Medium Enterprise', icon: Building2, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  large: { label: 'Large Corporation', icon: Factory, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
}

const RISK_LABELS = ['Very Low', 'Low', 'Medium', 'High', 'Very High']

const TABS = [
  { id: 'start', label: 'Start a Business' },
  { id: 'my', label: 'My Businesses' },
  { id: 'ideas', label: 'Business Ideas' },
]

export default function BusinessHub() {
  const [activeTab, setActiveTab] = useState('start')
  const [selectedBiz, setSelectedBiz] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')

  const ownedBusinesses = useBusinessStore((s) => s.ownedBusinesses)
  const totalBusinessIncome = useBusinessStore((s) => s.totalBusinessIncome)
  const startBusiness = useBusinessStore((s) => s.startBusiness)
  const closeBusiness = useBusinessStore((s) => s.closeBusiness)
  const upgradeBusiness = useBusinessStore((s) => s.upgradeBusiness)
  const hireEmployee = useBusinessStore((s) => s.hireEmployee)
  const cash = usePlayerStore((s) => s.cash)
  const adjustCash = usePlayerStore((s) => s.adjustCash)
  const daysPassed = useGameStore((s) => s.daysPassed)
  const addToast = useNotificationStore((s) => s.addToast)
  const { eraData } = useEra()

  const availableBusinesses = eraData
    ? businessDatabase.filter((b) => !b.eraAvailability || b.eraAvailability.includes(eraData.id))
    : businessDatabase

  const filteredBusinesses = filterCategory === 'all'
    ? availableBusinesses
    : availableBusinesses.filter((b) => b.category === filterCategory)

  const handleStart = (biz) => {
    if (cash < biz.startupCost) {
      addToast({ title: 'Insufficient Funds', description: `You need ${formatCurrency(biz.startupCost)} to start this business.`, variant: 'danger' })
      return
    }
    adjustCash(-biz.startupCost, `start_business_${biz.id}`)
    startBusiness(biz, daysPassed)
    addToast({ title: 'Business Started!', description: `You opened ${biz.name}! Good luck!`, variant: 'success' })
    setSelectedBiz(null)
  }

  const handleClose = (ownedId, name) => {
    const recovered = closeBusiness(ownedId)
    adjustCash(recovered, `close_business`)
    addToast({ title: 'Business Closed', description: `${name} closed. Recovered ${formatCurrency(recovered)}.`, variant: 'warning' })
  }

  const handleUpgrade = (ownedId, name) => {
    const cost = 500
    if (cash < cost) {
      addToast({ title: 'Insufficient Funds', description: `You need ${formatCurrency(cost)} to upgrade.`, variant: 'danger' })
      return
    }
    adjustCash(-cost, `upgrade_business`)
    upgradeBusiness(ownedId)
    addToast({ title: 'Business Upgraded!', description: `${name} upgraded to the next level.`, variant: 'success' })
  }

  const handleHire = (ownedId, name) => {
    const cost = 100
    if (cash < cost) {
      addToast({ title: 'Insufficient Funds', description: `You need ${formatCurrency(cost)} for hiring costs.`, variant: 'danger' })
      return
    }
    adjustCash(-cost, `hire_employee`)
    hireEmployee(ownedId)
    addToast({ title: 'Employee Hired!', description: `New employee at ${name}. Revenue boosted.`, variant: 'success' })
  }

  const ownedCount = Object.keys(ownedBusinesses).length

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Business Empire</CardTitle>
              <p className="text-sm text-text-tertiary">Start, manage, and scale businesses to build passive income.</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-tertiary">Total Business Income</p>
              <p className="font-display text-xl text-accent-success">{formatCurrency(totalBusinessIncome)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        </CardContent>
      </Card>

      {activeTab === 'start' && (
        <>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={filterCategory === 'all' ? 'primary' : 'ghost'}
              onClick={() => setFilterCategory('all')}
            >All</Button>
            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
              <Button
                key={key}
                size="sm"
                variant={filterCategory === key ? 'primary' : 'ghost'}
                onClick={() => setFilterCategory(key)}
              >
                {cfg.label}
              </Button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredBusinesses.map((biz, idx) => {
              const catCfg = CATEGORY_CONFIG[biz.category] ?? CATEGORY_CONFIG.street
              const CatIcon = catCfg.icon
              const canAfford = cash >= biz.startupCost

              return (
                <motion.div
                  key={biz.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Card className="h-full">
                    <CardContent className="flex h-full flex-col py-4">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-lg p-2 ${catCfg.bg}`}>
                            <CatIcon className={`h-4 w-4 ${catCfg.color}`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary">{biz.name}</p>
                            <p className={`text-xs ${catCfg.color}`}>{catCfg.label}</p>
                          </div>
                        </div>
                      </div>
                      <p className="mb-3 text-xs text-text-tertiary line-clamp-2">{biz.description}</p>
                      <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-text-disabled">Startup</p>
                          <p className="font-semibold text-text-primary">{formatCurrency(biz.startupCost)}</p>
                        </div>
                        <div>
                          <p className="text-text-disabled">Revenue/mo</p>
                          <p className="font-semibold text-accent-success">
                            {formatCurrency(biz.monthlyRevenue.min)}-{formatCurrency(biz.monthlyRevenue.max)}
                          </p>
                        </div>
                        <div>
                          <p className="text-text-disabled">Expenses/mo</p>
                          <p className="font-semibold text-accent-danger">{formatCurrency(biz.monthlyExpenses)}</p>
                        </div>
                        <div>
                          <p className="text-text-disabled">Risk</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={`h-1.5 w-3 rounded-full ${i < biz.riskLevel ? 'bg-accent-danger' : 'bg-background-secondary'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <Button
                          size="sm"
                          variant={canAfford ? 'success' : 'ghost'}
                          className="w-full"
                          disabled={!canAfford}
                          onClick={() => setSelectedBiz(biz)}
                        >
                          {canAfford ? `Start (${formatCurrency(biz.startupCost)})` : 'Not enough funds'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </>
      )}

      {activeTab === 'my' && (
        <div className="grid gap-4">
          {ownedCount === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Building2 className="mx-auto mb-3 h-10 w-10 text-text-disabled" />
                <p className="text-sm text-text-tertiary">No businesses yet. Start your first venture!</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(ownedBusinesses).map(([id, biz]) => (
              <Card key={id}>
                <CardContent className="py-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-text-primary">{biz.name}</p>
                      <p className="text-xs capitalize text-text-tertiary">{biz.category} business</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-accent-primary/10 px-2 py-1">
                      <Star className="h-3 w-3 text-accent-primary" />
                      <span className="text-xs font-semibold text-accent-primary">Level {biz.level}</span>
                    </div>
                  </div>
                  <div className="mb-3 grid grid-cols-3 gap-3 text-xs">
                    <div className="rounded-lg border border-white/5 bg-background-tertiary/40 p-2 text-center">
                      <p className="text-text-disabled">Total Revenue</p>
                      <p className="font-semibold text-accent-success">{formatCurrency(biz.totalRevenue)}</p>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-background-tertiary/40 p-2 text-center">
                      <p className="text-text-disabled">Employees</p>
                      <p className="font-semibold text-text-primary">{biz.employees}</p>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-background-tertiary/40 p-2 text-center">
                      <p className="text-text-disabled">Expenses/mo</p>
                      <p className="font-semibold text-accent-danger">{formatCurrency(biz.monthlyExpenses)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="primary" onClick={() => handleUpgrade(id, biz.name)} disabled={biz.level >= 5}>
                      <ChevronUp className="mr-1 h-3 w-3" /> Upgrade ($500)
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleHire(id, biz.name)}>
                      <Users className="mr-1 h-3 w-3" /> Hire ($100)
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleClose(id, biz.name)}>
                      Close Business
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'ideas' && (
        <Card>
          <CardHeader>
            <CardTitle>Business Ideas</CardTitle>
            <p className="text-sm text-text-tertiary">Locked businesses you can aspire to. Build your skills and capital!</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableBusinesses
                .filter((b) => b.startupCost > cash)
                .slice(0, 8)
                .map((biz) => {
                  const catCfg = CATEGORY_CONFIG[biz.category] ?? CATEGORY_CONFIG.street
                  return (
                    <div key={biz.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-background-tertiary/30 px-4 py-3 opacity-60">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{biz.name}</p>
                        <p className="text-xs text-text-tertiary">{biz.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-accent-danger">{formatCurrency(biz.startupCost)}</p>
                        <p className="text-xs text-text-disabled">Need {formatCurrency(biz.startupCost - cash)} more</p>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirm Start Modal */}
      <Modal
        isOpen={!!selectedBiz}
        onClose={() => setSelectedBiz(null)}
        title={`Start ${selectedBiz?.name ?? ''}?`}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setSelectedBiz(null)}>Cancel</Button>
            <Button variant="success" onClick={() => selectedBiz && handleStart(selectedBiz)}>
              Start Business ({formatCurrency(selectedBiz?.startupCost ?? 0)})
            </Button>
          </div>
        }
      >
        {selectedBiz && (
          <div className="space-y-3">
            <p className="text-sm text-text-secondary">{selectedBiz.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-text-tertiary">Startup Cost</p>
                <p className="font-semibold text-text-primary">{formatCurrency(selectedBiz.startupCost)}</p>
              </div>
              <div>
                <p className="text-text-tertiary">Monthly Revenue</p>
                <p className="font-semibold text-accent-success">
                  {formatCurrency(selectedBiz.monthlyRevenue.min)}-{formatCurrency(selectedBiz.monthlyRevenue.max)}
                </p>
              </div>
              <div>
                <p className="text-text-tertiary">Monthly Expenses</p>
                <p className="font-semibold text-accent-danger">{formatCurrency(selectedBiz.monthlyExpenses)}</p>
              </div>
              <div>
                <p className="text-text-tertiary">Risk Level</p>
                <p className="font-semibold text-accent-warning">{RISK_LABELS[selectedBiz.riskLevel - 1]}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
