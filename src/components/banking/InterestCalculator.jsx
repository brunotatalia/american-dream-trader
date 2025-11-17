import { useState } from 'react'

import { formatCurrency, formatPercent } from '@/utils/formatters'

export default function InterestCalculator() {
  const [principal, setPrincipal] = useState('1000')
  const [rate, setRate] = useState('3.5')
  const [time, setTime] = useState('5')
  const [compoundFrequency, setCompoundFrequency] = useState('12')

  const p = parseFloat(principal) || 0
  const r = parseFloat(rate) / 100 || 0
  const t = parseFloat(time) || 0
  const n = parseFloat(compoundFrequency) || 1

  // Compound interest formula: A = P(1 + r/n)^(nt)
  const finalAmount = p * Math.pow(1 + r / n, n * t)
  const totalInterest = finalAmount - p

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-background-tertiary/40 p-6">
        <h3 className="text-lg font-semibold text-text-primary">Compound Interest Calculator</h3>
        <p className="mt-2 text-sm text-text-secondary">
          See how your savings or investments can grow over time with compound interest.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="calc-principal" className="block text-sm font-medium text-text-primary">
              Initial Amount ($)
            </label>
            <input
              id="calc-principal"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-background-secondary px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              step="100"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="calc-rate" className="block text-sm font-medium text-text-primary">
              Annual Interest Rate (%)
            </label>
            <input
              id="calc-rate"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-background-secondary px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              step="0.1"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label htmlFor="calc-time" className="block text-sm font-medium text-text-primary">
              Time Period (years)
            </label>
            <input
              id="calc-time"
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-background-secondary px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              step="1"
              min="0"
              max="50"
            />
          </div>

          <div>
            <label htmlFor="calc-compound" className="block text-sm font-medium text-text-primary">
              Compound Frequency
            </label>
            <select
              id="calc-compound"
              value={compoundFrequency}
              onChange={(e) => setCompoundFrequency(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-background-secondary px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              <option value="1">Annually</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
              <option value="365">Daily</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-6">
            <div className="grid gap-4">
              <div>
                <p className="text-xs text-text-tertiary">Final Amount</p>
                <p className="mt-1 text-3xl font-bold text-accent-primary">{formatCurrency(finalAmount)}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                <div>
                  <p className="text-xs text-text-tertiary">Initial Investment</p>
                  <p className="mt-1 text-lg font-semibold text-text-primary">{formatCurrency(p)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">Total Interest Earned</p>
                  <p className="mt-1 text-lg font-semibold text-accent-success">{formatCurrency(totalInterest)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-background-secondary p-4">
            <p className="text-xs text-text-tertiary">Return on Investment</p>
            <p className="mt-1 text-xl font-bold text-text-primary">
              {p > 0 ? formatPercent(totalInterest / p) : '0%'}
            </p>
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="rounded-lg border border-accent-primary/30 bg-accent-primary/5 p-4">
        <h4 className="text-sm font-semibold text-accent-primary">💡 The Power of Compound Interest</h4>
        <p className="mt-2 text-xs text-text-secondary">
          Albert Einstein allegedly called compound interest "the eighth wonder of the world." 
          Money earns interest, and that interest earns interest, creating exponential growth over time.
        </p>
      </div>
    </div>
  )
}
