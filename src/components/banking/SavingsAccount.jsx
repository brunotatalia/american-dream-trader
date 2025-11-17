import Button from '@/components/ui/Button'
import { formatCurrency, formatPercent } from '@/utils/formatters'

export default function SavingsAccount({ cash, savings, onDeposit, onWithdraw }) {
  const savingsRate = 0.035 // 3.5% APY in 1920s
  const monthlyInterest = savings * (savingsRate / 12)
  const projectedYearlyInterest = savings * savingsRate

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-background-tertiary/40 p-6">
        <h3 className="text-lg font-semibold text-text-primary">High-Yield Savings Account</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Earn {formatPercent(savingsRate)} annual interest on your savings, compounded monthly. 
          Your money is safe and accessible anytime.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-background-secondary p-4">
            <p className="text-xs uppercase tracking-wider text-text-tertiary">Current Balance</p>
            <p className="mt-1 text-2xl font-bold text-text-primary">{formatCurrency(savings)}</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-background-secondary p-4">
            <p className="text-xs uppercase tracking-wider text-text-tertiary">Monthly Interest</p>
            <p className="mt-1 text-2xl font-bold text-accent-success">{formatCurrency(monthlyInterest)}</p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-tertiary">Projected Annual Interest</p>
              <p className="mt-1 text-lg font-semibold text-accent-primary">
                {formatCurrency(projectedYearlyInterest)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-tertiary">Effective APY</p>
              <p className="mt-1 text-lg font-semibold text-accent-primary">{formatPercent(savingsRate)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="primary" onClick={onDeposit} className="flex-1">
            Deposit
          </Button>
          <Button variant="secondary" onClick={onWithdraw} className="flex-1" disabled={savings === 0}>
            Withdraw
          </Button>
        </div>
      </div>

      {/* Account Benefits */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-text-primary">Account Benefits</h4>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="text-accent-success">✓</span>
            <span>No minimum balance required</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-success">✓</span>
            <span>Interest compounded monthly and paid automatically</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-success">✓</span>
            <span>Unlimited withdrawals with no penalties</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-success">✓</span>
            <span>FDIC insured (up to $2,500 in 1920s dollars)</span>
          </li>
        </ul>
      </div>

      {/* Quick Tips */}
      <div className="rounded-lg border border-accent-warning/30 bg-accent-warning/5 p-4">
        <h4 className="text-sm font-semibold text-accent-warning">💡 Savings Tip</h4>
        <p className="mt-2 text-xs text-text-secondary">
          Keep 3-6 months of expenses in your savings account for emergencies. 
          The interest earned helps preserve your purchasing power against inflation.
        </p>
      </div>
    </div>
  )
}
