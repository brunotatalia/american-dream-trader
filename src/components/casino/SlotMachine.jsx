import { useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useNotifications } from '@/hooks/useNotifications'
import { usePlayerStore } from '@/stores/playerStore'
import { formatCurrency } from '@/utils/formatters'

const SYMBOLS = ['🍒', '🍋', '⭐', '💎', '7️⃣']
const PAYOUTS = {
  '🍒🍒🍒': 10,
  '🍋🍋🍋': 15,
  '⭐⭐⭐': 25,
  '💎💎💎': 50,
  '7️⃣7️⃣7️⃣': 100,
}

const SYMBOL_WEIGHTS = {
  '🍒': 0.35,
  '🍋': 0.30,
  '⭐': 0.20,
  '💎': 0.10,
  '7️⃣': 0.05,
}

function pickSymbol() {
  const rand = Math.random()
  let cumulative = 0

  for (const [symbol, weight] of Object.entries(SYMBOL_WEIGHTS)) {
    cumulative += weight
    if (rand <= cumulative) return symbol
  }

  return SYMBOLS[0]
}

export default function SlotMachine() {
  const { notify } = useNotifications()
  const adjustCash = usePlayerStore((state) => state.adjustCash)
  const cash = usePlayerStore((state) => state.cash)

  const [reels, setReels] = useState(['🍒', '🍒', '🍒'])
  const [betAmount, setBetAmount] = useState(5)
  const [isSpinning, setIsSpinning] = useState(false)

  const handleSpin = () => {
    if (cash < betAmount) {
      notify({ title: 'Insufficient Funds', description: 'You need more cash to play.', variant: 'danger' })
      return
    }

    setIsSpinning(true)
    adjustCash(-betAmount, 'slots_bet')

    // Spin animation
    setTimeout(() => {
      const newReels = [pickSymbol(), pickSymbol(), pickSymbol()]
      setReels(newReels)
      setIsSpinning(false)

      // Check for win
      const reelString = newReels.join('')
      const payout = PAYOUTS[reelString]

      if (payout) {
        const winnings = betAmount * payout
        adjustCash(winnings, 'slots_win')
        notify({
          title: 'Winner!',
          description: `You won ${formatCurrency(winnings)} with a ${payout}x payout!`,
          variant: 'success',
        })
      } else {
        notify({
          title: 'No Match',
          description: 'Try again!',
          variant: 'info',
        })
      }
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Slot Machine</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center gap-4">
          {reels.map((symbol, idx) => (
            <div
              key={idx}
              className={`flex h-24 w-24 items-center justify-center rounded-xl border-2 border-white/10 bg-background-elevated text-5xl shadow-lg ${
                isSpinning ? 'animate-spin' : ''
              }`}
            >
              {symbol}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="bet-amount" className="mb-2 block text-sm font-medium text-text-secondary">
              Bet Amount
            </label>
            <input
              id="bet-amount"
              type="number"
              min="5"
              step="5"
              value={betAmount}
              onChange={(e) => setBetAmount(parseInt(e.target.value, 10) || 5)}
              disabled={isSpinning}
              className="w-full rounded-lg border border-white/10 bg-background-tertiary px-4 py-2 text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 disabled:opacity-50"
            />
          </div>

          <Button
            variant="success"
            size="lg"
            onClick={handleSpin}
            disabled={isSpinning || cash < betAmount}
            className="w-full"
          >
            {isSpinning ? 'Spinning...' : `Spin (${formatCurrency(betAmount)})`}
          </Button>
        </div>

        <div className="rounded-lg border border-white/10 bg-background-tertiary/40 p-4">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-tertiary">Payouts</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
            {Object.entries(PAYOUTS).map(([combo, multiplier]) => (
              <div key={combo} className="flex items-center justify-between">
                <span>{combo}</span>
                <span className="font-semibold text-accent-success">{multiplier}x</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
