import { useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useNotifications } from '@/hooks/useNotifications'
import { usePlayerStore } from '@/stores/playerStore'
import { formatCurrency } from '@/utils/formatters'

const NUMBERS = Array.from({ length: 37 }, (_, i) => i) // 0-36
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]

const BET_TYPES = {
  red: { label: 'Red', payout: 1, check: (num) => RED_NUMBERS.includes(num) },
  black: { label: 'Black', payout: 1, check: (num) => BLACK_NUMBERS.includes(num) },
  even: { label: 'Even', payout: 1, check: (num) => num !== 0 && num % 2 === 0 },
  odd: { label: 'Odd', payout: 1, check: (num) => num !== 0 && num % 2 === 1 },
  low: { label: '1-18', payout: 1, check: (num) => num >= 1 && num <= 18 },
  high: { label: '19-36', payout: 1, check: (num) => num >= 19 && num <= 36 },
  dozen1: { label: '1st 12', payout: 2, check: (num) => num >= 1 && num <= 12 },
  dozen2: { label: '2nd 12', payout: 2, check: (num) => num >= 13 && num <= 24 },
  dozen3: { label: '3rd 12', payout: 2, check: (num) => num >= 25 && num <= 36 },
}

export default function Roulette() {
  const { notify } = useNotifications()
  const adjustCash = usePlayerStore((state) => state.adjustCash)
  const cash = usePlayerStore((state) => state.cash)

  const [betAmount, setBetAmount] = useState(10)
  const [selectedBet, setSelectedBet] = useState(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState(null)

  const handleSpin = () => {
    if (!selectedBet) {
      notify({ title: 'No Bet Selected', description: 'Choose a bet type first.', variant: 'warning' })
      return
    }

    if (cash < betAmount) {
      notify({ title: 'Insufficient Funds', description: 'You need more cash to play.', variant: 'danger' })
      return
    }

    setIsSpinning(true)
    adjustCash(-betAmount, 'roulette_bet')

    // Spin animation
    setTimeout(() => {
      const winningNumber = NUMBERS[Math.floor(Math.random() * NUMBERS.length)]
      const betType = BET_TYPES[selectedBet]
      const isWin = betType.check(winningNumber)

      setResult(winningNumber)
      setIsSpinning(false)

      if (isWin) {
        const winnings = betAmount * (betType.payout + 1) // bet back + payout
        adjustCash(winnings, 'roulette_win')
        notify({
          title: `Winner! ${winningNumber}`,
          description: `You won ${formatCurrency(winnings)} on ${betType.label}!`,
          variant: 'success',
        })
      } else {
        notify({
          title: `${winningNumber} - No Win`,
          description: `Better luck next spin!`,
          variant: 'info',
        })
      }

      setTimeout(() => setResult(null), 3000)
    }, 2000)
  }

  const getNumberColor = (num) => {
    if (num === 0) return 'bg-green-600'
    if (RED_NUMBERS.includes(num)) return 'bg-red-600'
    return 'bg-gray-900'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>European Roulette</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Result display */}
        {result !== null && (
          <div className="animate-fadeInScale rounded-xl border-2 border-accent-success bg-accent-success/10 p-6 text-center">
            <p className="mb-2 text-sm uppercase tracking-wider text-text-tertiary">Winning Number</p>
            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold text-white ${getNumberColor(result)}`}
            >
              {result}
            </div>
          </div>
        )}

        {/* Wheel visualization */}
        <div className="flex items-center justify-center">
          <div
            className={`flex h-32 w-32 items-center justify-center rounded-full border-4 border-white/20 bg-gradient-to-br from-red-600 via-gray-900 to-green-600 text-4xl font-bold text-white shadow-2xl ${
              isSpinning ? 'animate-spin' : ''
            }`}
          >
            {isSpinning ? '🎰' : result ?? '0'}
          </div>
        </div>

        {/* Betting grid */}
        <div className="space-y-4">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-tertiary">Outside Bets</p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {Object.entries(BET_TYPES).map(([key, bet]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedBet(key)}
                  disabled={isSpinning}
                  className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all disabled:opacity-50 ${
                    selectedBet === key
                      ? 'border-accent-primary bg-accent-primary/20 text-accent-primary'
                      : 'border-white/10 bg-background-tertiary text-text-secondary hover:border-white/30'
                  }`}
                >
                  <div>{bet.label}</div>
                  <div className="mt-1 text-xs text-text-tertiary">{bet.payout + 1}:1</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="roulette-bet" className="mb-2 block text-sm font-medium text-text-secondary">
              Bet Amount
            </label>
            <input
              id="roulette-bet"
              type="number"
              min="10"
              step="10"
              value={betAmount}
              onChange={(e) => setBetAmount(parseInt(e.target.value, 10) || 10)}
              disabled={isSpinning}
              className="w-full rounded-lg border border-white/10 bg-background-tertiary px-4 py-2 text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 disabled:opacity-50"
            />
          </div>

          <Button
            variant="success"
            size="lg"
            onClick={handleSpin}
            disabled={isSpinning || cash < betAmount || !selectedBet}
            className="w-full"
          >
            {isSpinning ? 'Spinning...' : `Spin (${formatCurrency(betAmount)})`}
          </Button>
        </div>

        <div className="rounded-lg border border-white/10 bg-background-tertiary/40 p-4 text-xs text-text-tertiary">
          <p>
            <strong>House Edge:</strong> 2.7% (European, single zero)
          </p>
          <p className="mt-1">Selected bet: {selectedBet ? BET_TYPES[selectedBet].label : 'None'}</p>
        </div>
      </CardContent>
    </Card>
  )
}
