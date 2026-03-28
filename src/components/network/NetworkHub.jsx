import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, UserPlus, MessageSquare, Lock, Star, Heart, Briefcase,
  GraduationCap, Lightbulb, ChevronRight, Clock, Trash2,
} from 'lucide-react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import Modal from '@/components/ui/Modal'
import { useNetworkStore } from '@/stores/networkStore'
import { useNotificationStore } from '@/stores/notificationStore'
import networkDatabase from '@/data/networkDatabase'
import { useEra } from '@/hooks/useEra'

const CATEGORY_CONFIG = {
  mentor: { label: 'Mentor', icon: GraduationCap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  professional: { label: 'Professional', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  social: { label: 'Social', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-400/10' },
}

const TABS = [
  { id: 'network', label: 'My Network' },
  { id: 'tips', label: 'Tips' },
  { id: 'discover', label: 'Discover' },
]

export default function NetworkHub() {
  const [activeTab, setActiveTab] = useState('network')
  const [selectedContact, setSelectedContact] = useState(null)

  const contacts = useNetworkStore((s) => s.contacts)
  const unlockedContacts = useNetworkStore((s) => s.unlockedContacts)
  const pendingTips = useNetworkStore((s) => s.pendingTips)
  const interactWithContact = useNetworkStore((s) => s.interactWithContact)
  const dismissTip = useNetworkStore((s) => s.dismissTip)
  const addToast = useNotificationStore((s) => s.addToast)
  const { eraData } = useEra()

  const allContacts = eraData
    ? networkDatabase.filter((c) => !c.eraAvailability || c.eraAvailability.includes(eraData.id))
    : networkDatabase

  const myContacts = allContacts.filter((c) => unlockedContacts.includes(c.id))
  const lockedContacts = allContacts.filter((c) => !unlockedContacts.includes(c.id))

  const networkPower = Object.values(contacts).reduce((sum, c) => sum + c.trustLevel, 0)

  const handleInteract = (contactId) => {
    interactWithContact(contactId)
    const contact = contacts[contactId]
    addToast({
      title: 'Connection Strengthened',
      description: `Your relationship with ${contact?.name ?? 'contact'} grew stronger.`,
      variant: 'success',
    })
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Network & Connections</CardTitle>
              <p className="text-sm text-text-tertiary">Build relationships that open doors to opportunities.</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-tertiary">Network Power</p>
              <p className="font-display text-xl text-accent-info">{networkPower}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        </CardContent>
      </Card>

      {/* Network Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="py-3 text-center">
            <Users className="mx-auto mb-1 h-5 w-5 text-accent-primary" />
            <p className="font-display text-xl text-text-primary">{myContacts.length}</p>
            <p className="text-xs text-text-tertiary">Contacts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <Lightbulb className="mx-auto mb-1 h-5 w-5 text-accent-warning" />
            <p className="font-display text-xl text-text-primary">{pendingTips.length}</p>
            <p className="text-xs text-text-tertiary">Pending Tips</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <Lock className="mx-auto mb-1 h-5 w-5 text-text-disabled" />
            <p className="font-display text-xl text-text-primary">{lockedContacts.length}</p>
            <p className="text-xs text-text-tertiary">To Discover</p>
          </CardContent>
        </Card>
      </div>

      {activeTab === 'network' && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {myContacts.length === 0 ? (
            <Card className="md:col-span-2 xl:col-span-3">
              <CardContent className="py-8 text-center">
                <UserPlus className="mx-auto mb-3 h-10 w-10 text-text-disabled" />
                <p className="text-sm text-text-tertiary">No contacts yet. Check the Discover tab to see who you can meet.</p>
              </CardContent>
            </Card>
          ) : (
            myContacts.map((contact, idx) => {
              const catCfg = CATEGORY_CONFIG[contact.category] ?? CATEGORY_CONFIG.social
              const CatIcon = catCfg.icon
              const trustLevel = contacts[contact.id]?.trustLevel ?? 0

              return (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="h-full">
                    <CardContent className="flex h-full flex-col py-4">
                      <div className="mb-3 flex items-start gap-3">
                        <div className={`rounded-full p-2 ${catCfg.bg}`}>
                          <CatIcon className={`h-5 w-5 ${catCfg.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-text-primary">{contact.name}</p>
                          <p className={`text-xs ${catCfg.color}`}>{contact.title}</p>
                        </div>
                      </div>
                      <p className="mb-3 text-xs text-text-tertiary line-clamp-2">{contact.description}</p>

                      {/* Trust Level */}
                      <div className="mb-3">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-text-disabled">Trust Level</span>
                          <span className="text-accent-primary">{trustLevel}/100</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-background-secondary">
                          <motion.div
                            className="h-full rounded-full bg-accent-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${trustLevel}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-auto">
                        <Button
                          size="sm"
                          variant="primary"
                          className="w-full"
                          onClick={() => handleInteract(contact.id)}
                        >
                          <MessageSquare className="mr-1 h-3 w-3" /> Interact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="grid gap-3">
          {pendingTips.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Lightbulb className="mx-auto mb-3 h-10 w-10 text-text-disabled" />
                <p className="text-sm text-text-tertiary">No pending tips. Build relationships to receive valuable insights.</p>
              </CardContent>
            </Card>
          ) : (
            pendingTips.map((tip) => (
              <motion.div key={tip.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="border-accent-warning/20">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="mt-0.5 h-5 w-5 text-accent-warning" />
                        <div>
                          <p className="text-xs text-accent-warning">{tip.source ?? 'Contact'}</p>
                          <p className="mt-1 text-sm text-text-primary">{tip.content}</p>
                          <p className="mt-1 text-xs text-text-disabled">
                            <Clock className="mr-1 inline h-3 w-3" />
                            {new Date(tip.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => dismissTip(tip.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}

      {activeTab === 'discover' && (
        <div className="grid gap-3">
          {lockedContacts.map((contact, idx) => {
            const catCfg = CATEGORY_CONFIG[contact.category] ?? CATEGORY_CONFIG.social
            const CatIcon = catCfg.icon
            const condition = contact.unlockCondition ?? {}
            const conditionText = Object.entries(condition)
              .map(([key, value]) => {
                if (key === 'minNetWorth') return `Net worth: ${value.toLocaleString()}`
                if (key === 'minTradingSkill') return `Trading skill: ${value}`
                if (key === 'minProperties') return `Own ${value} property`
                if (key === 'minBusinesses') return `Own ${value} business`
                if (key === 'minEducation') return `Complete 1 course`
                if (key === 'minReputation') return `Reputation: ${value}`
                if (key === 'minSavings') return `Savings: $${value}`
                if (key === 'minJobPerformance') return `Job performance: ${value}`
                if (key === 'minAge') return `Age: ${value}+`
                return `${key}: ${value}`
              })
              .join(', ')

            return (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Card className="opacity-60">
                  <CardContent className="py-3">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 ${catCfg.bg}`}>
                        <Lock className={`h-4 w-4 ${catCfg.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-text-primary">{contact.name}</p>
                        <p className="text-xs text-text-tertiary">{contact.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-accent-warning">
                          {conditionText || 'Available from start'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
