import { useState } from 'react'

import Button from '@/components/ui/Button'
import { usePlayer } from '@/hooks/usePlayer'
import { useNotificationStore } from '@/stores/notificationStore'
import { usePlayerStore } from '@/stores/playerStore'
import { formatCurrency, formatPercent } from '@/utils/formatters'

export default function LoanApplication() {
  const { cash, savings } = usePlayer()
  const [loanAmount, setLoanAmount] = useState('')
  const [loanTerm, setLoanTerm] = useState('12')
  
  const adjustCash = usePlayerStore((state) => state.adjustCash)
  const addToast = useNotificationStore((state) => state.addToast)

  const interestRate = 0.08 // 8% APR for personal loans in 1920s
  const monthlyRate = interestRate / 12
  const termMonths = parseInt(loanTerm)
  const principal = parseFloat(loanAmount) || 0

  // Calculate monthly payment
  const monthlyPayment = principal > 0 && termMonths > 0
    ? (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
      (Math.pow(1 + monthlyRate, termMonths) - 1)
    : 0

  const totalRepayment = monthlyPayment * termMonths
  const totalInterest = totalRepayment - principal

  // Simple credit score based on net worth
  const netWorth = cash + savings
  const creditScore = Math.min(850, Math.max(300, 500 + (netWorth / 100)))
  const maxLoanAmount = netWorth * 2 // Can borrow up to 2x net worth

  const handleApplyLoan = () => {
    if (!principal || principal <= 0) {
      addToast({
        title: 'Invalid Amount',
        description: 'Please enter a valid loan amount.',
        variant: 'error',
      })
      return
    }

    if (principal > maxLoanAmount) {
      addToast({
        title: 'Loan Too Large',
        description: `Based on your net worth, you can borrow up to ${formatCurrency(maxLoanAmount)}.`,
        variant: 'error',
      })
      return
    }

    // Approve loan
    adjustCash(principal, 'loan_disbursement')
    addToast({
      title: 'Loan Approved!',
      description: `${formatCurrency(principal)} has been deposited to your account. Pay ${formatCurrency(monthlyPayment)}/month for ${termMonths} months.`,
      variant: 'success',
    })

    // TODO: Track loan in player store for repayment
    setLoanAmount('')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-background-tertiary/40 p-6">
        <h3 className="text-lg font-semibold text-text-primary">Personal Loan Application</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Borrow money for investments, emergencies, or business opportunities.
        </p>

        {/* Credit Score */}
        <div className="mt-6 rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-tertiary">Your Credit Score</p>
              <p className="mt-1 text-2xl font-bold text-text-primary">{Math.round(creditScore)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-tertiary">Max Loan Amount</p>
              <p className="mt-1 text-2xl font-bold text-accent-primary">{formatCurrency(maxLoanAmount)}</p>
            </div>
          </div>
        </div>

        {/* Loan Form */}
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="loan-amount" className="block text-sm font-medium text-text-primary">
              Loan Amount
            </label>
            <input
              id="loan-amount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-background-secondary px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="0.00"
              step="100"
              min="0"
              max={maxLoanAmount}
            />
          </div>

          <div>
            <label htmlFor="loan-term" className="block text-sm font-medium text-text-primary">
              Loan Term
            </label>
            <select
              id="loan-term"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-background-secondary px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              <option value="6">6 months</option>
              <option value="12">12 months</option>
              <option value="24">24 months</option>
              <option value="36">36 months</option>
            </select>
          </div>

          <div className="rounded-lg border border-white/10 bg-background-secondary p-4">
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Interest Rate:</span>
                <span className="font-semibold text-text-primary">{formatPercent(interestRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Monthly Payment:</span>
                <span className="font-semibold text-text-primary">{formatCurrency(monthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Total Interest:</span>
                <span className="font-semibold text-accent-warning">{formatCurrency(totalInterest)}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2">
                <span className="font-semibold text-text-primary">Total Repayment:</span>
                <span className="font-semibold text-text-primary">{formatCurrency(totalRepayment)}</span>
              </div>
            </div>
          </div>

          <Button 
            variant="primary" 
            onClick={handleApplyLoan} 
            className="w-full"
            disabled={!principal || principal > maxLoanAmount}
          >
            Apply for Loan
          </Button>
        </div>
      </div>

      {/* Warning */}
      <div className="rounded-lg border border-accent-warning/30 bg-accent-warning/5 p-4">
        <h4 className="text-sm font-semibold text-accent-warning">⚠️ Loan Warning</h4>
        <p className="mt-2 text-xs text-text-secondary">
          Loans must be repaid monthly. Missed payments will damage your credit score and may result in asset seizure.
          Only borrow what you can afford to repay.
        </p>
      </div>
    </div>
  )
}
