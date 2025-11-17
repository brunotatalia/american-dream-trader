import { CreditCard, DollarSign, PiggyBank, TrendingUp } from 'lucide-react'
import { useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Tabs from '@/components/ui/Tabs'
import { usePlayer } from '@/hooks/usePlayer'
import { useNotificationStore } from '@/stores/notificationStore'
import { usePlayerStore } from '@/stores/playerStore'
import { formatCurrency } from '@/utils/formatters'

import InterestCalculator from './InterestCalculator'
import LoanApplication from './LoanApplication'
import SavingsAccount from './SavingsAccount'

export default function BankingHub() {
  const { cash, savings } = usePlayer()
  const [activeTab, setActiveTab] = useState('savings')
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')

  const adjustCash = usePlayerStore((state) => state.adjustCash)
  const setSavings = usePlayerStore((state) => state.setSavings)
  const addToast = useNotificationStore((state) => state.addToast)

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) {
      addToast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to deposit.',
        variant: 'error',
      })
      return
    }

    if (amount > cash) {
      addToast({
        title: 'Insufficient Funds',
        description: 'You don\'t have enough cash to deposit.',
        variant: 'error',
      })
      return
    }

    adjustCash(-amount, 'savings_deposit')
    setSavings(savings + amount)
    addToast({
      title: 'Deposit Successful',
      description: `Deposited ${formatCurrency(amount)} to savings.`,
      variant: 'success',
    })
    setDepositAmount('')
    setShowDepositModal(false)
  }

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      addToast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to withdraw.',
        variant: 'error',
      })
      return
    }

    if (amount > savings) {
      addToast({
        title: 'Insufficient Savings',
        description: 'You don\'t have enough in savings to withdraw.',
        variant: 'error',
      })
      return
    }

    adjustCash(amount, 'savings_withdrawal')
    setSavings(savings - amount)
    addToast({
      title: 'Withdrawal Successful',
      description: `Withdrew ${formatCurrency(amount)} from savings.`,
      variant: 'success',
    })
    setWithdrawAmount('')
    setShowWithdrawModal(false)
  }

  const tabs = [
    { id: 'savings', label: 'Savings Account', icon: PiggyBank },
    { id: 'loans', label: 'Loans', icon: CreditCard },
    { id: 'calculator', label: 'Interest Calculator', icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4" />
              Cash on Hand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-text-primary">{formatCurrency(cash)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <PiggyBank className="h-4 w-4" />
              Savings Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent-success">{formatCurrency(savings)}</p>
            <p className="mt-1 text-xs text-text-tertiary">Earning 3.5% APY</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              Total Liquid Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-text-primary">{formatCurrency(cash + savings)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Banking Services */}
      <Card>
        <CardHeader>
          <CardTitle>Banking Services</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <div className="mt-6">
            {activeTab === 'savings' && (
              <SavingsAccount
                savings={savings}
                onDeposit={() => setShowDepositModal(true)}
                onWithdraw={() => setShowWithdrawModal(true)}
              />
            )}
            {activeTab === 'loans' && <LoanApplication />}
            {activeTab === 'calculator' && <InterestCalculator />}
          </div>
        </CardContent>
      </Card>

      {/* Deposit Modal */}
      <Modal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        title="Deposit to Savings"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowDepositModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDeposit}>
              Deposit
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Available cash: {formatCurrency(cash)}
          </p>
          <div>
            <label htmlFor="deposit-amount" className="block text-sm font-medium text-text-primary">
              Amount to Deposit
            </label>
            <input
              id="deposit-amount"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-background-tertiary px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="0.00"
              step="0.01"
              min="0"
              max={cash}
            />
          </div>
          <p className="text-xs text-text-tertiary">
            Your savings earn 3.5% annual interest, compounded monthly.
          </p>
        </div>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Withdraw from Savings"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowWithdrawModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleWithdraw}>
              Withdraw
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Savings balance: {formatCurrency(savings)}
          </p>
          <div>
            <label htmlFor="withdraw-amount" className="block text-sm font-medium text-text-primary">
              Amount to Withdraw
            </label>
            <input
              id="withdraw-amount"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-background-tertiary px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="0.00"
              step="0.01"
              min="0"
              max={savings}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
