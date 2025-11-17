import { useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useNotifications } from '@/hooks/useNotifications'
import { usePlayerStore } from '@/stores/playerStore'
import { formatCurrency } from '@/utils/formatters'

const SUITS = ['♠', '♥', '♦', '♣']
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

function createDeck() {
  const deck = []
  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      deck.push({ rank, suit })
    })
  })
  return deck.sort(() => Math.random() - 0.5)
}

function getHandValue(hand) {
  let total = 0
  let aces = 0

  hand.forEach((card) => {
    if (card.rank === 'A') {
      aces += 1
      total += 11
    } else if (['J', 'Q', 'K'].includes(card.rank)) {
      total += 10
    } else {
      total += parseInt(card.rank, 10)
    }
  })

  // Adjust for aces if over 21
  while (total > 21 && aces > 0) {
    total -= 10
    aces -= 1
  }

  return total
}

export default function Blackjack() {
  const { notify } = useNotifications()
  const adjustCash = usePlayerStore((state) => state.adjustCash)
  const cash = usePlayerStore((state) => state.cash)

  const [betAmount, setBetAmount] = useState(10)
  const [gameState, setGameState] = useState('betting') // betting, playing, dealerTurn, finished
  const [deck, setDeck] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [message, setMessage] = useState('')

  const playerValue = getHandValue(playerHand)
  const dealerValue = getHandValue(dealerHand)

  const handleDeal = () => {
    if (cash < betAmount) {
      notify({ title: 'Insufficient Funds', description: 'You need more cash to play.', variant: 'danger' })
      return
    }

    adjustCash(-betAmount, 'blackjack_bet')

    const newDeck = createDeck()
    const pHand = [newDeck.pop(), newDeck.pop()]
    const dHand = [newDeck.pop(), newDeck.pop()]

    setDeck(newDeck)
    setPlayerHand(pHand)
    setDealerHand(dHand)
    setGameState('playing')
    setMessage('')

    // Check for blackjack
    if (getHandValue(pHand) === 21) {
      const winnings = Math.floor(betAmount * 2.5) // 3:2 payout
      adjustCash(winnings, 'blackjack_win')
      setMessage(`Blackjack! You won ${formatCurrency(winnings)}!`)
      setGameState('finished')
      notify({ title: 'Blackjack!', description: `Won ${formatCurrency(winnings)}`, variant: 'success' })
    }
  }

  const handleHit = () => {
    const newDeck = [...deck]
    const newCard = newDeck.pop()
    const newHand = [...playerHand, newCard]

    setDeck(newDeck)
    setPlayerHand(newHand)

    const newValue = getHandValue(newHand)
    if (newValue > 21) {
      setMessage(`Bust! You lost ${formatCurrency(betAmount)}.`)
      setGameState('finished')
      notify({ title: 'Bust!', description: 'You went over 21', variant: 'danger' })
    }
  }

  const handleStand = () => {
    setGameState('dealerTurn')

    // Dealer draws to 17
    let dHand = [...dealerHand]
    let dDeck = [...deck]

    while (getHandValue(dHand) < 17) {
      dHand.push(dDeck.pop())
    }

    setDealerHand(dHand)
    setDeck(dDeck)

    const dValue = getHandValue(dHand)
    const pValue = getHandValue(playerHand)

    setTimeout(() => {
      if (dValue > 21) {
        const winnings = betAmount * 2
        adjustCash(winnings, 'blackjack_win')
        setMessage(`Dealer busts! You won ${formatCurrency(winnings)}!`)
        notify({ title: 'Dealer Bust!', description: `Won ${formatCurrency(winnings)}`, variant: 'success' })
      } else if (dValue > pValue) {
        setMessage(`Dealer wins ${dValue} to ${pValue}. You lost ${formatCurrency(betAmount)}.`)
        notify({ title: 'Dealer Wins', variant: 'danger' })
      } else if (pValue > dValue) {
        const winnings = betAmount * 2
        adjustCash(winnings, 'blackjack_win')
        setMessage(`You win ${pValue} to ${dValue}! Won ${formatCurrency(winnings)}!`)
        notify({ title: 'You Win!', description: `Won ${formatCurrency(winnings)}`, variant: 'success' })
      } else {
        adjustCash(betAmount, 'blackjack_push')
        setMessage(`Push! ${pValue} to ${dValue}. Bet returned.`)
        notify({ title: 'Push', description: 'Bet returned', variant: 'info' })
      }

      setGameState('finished')
    }, 1500)
  }

  const handleNewGame = () => {
    setGameState('betting')
    setPlayerHand([])
    setDealerHand([])
    setMessage('')
  }

  const CardComponent = ({ card, hidden = false }) => (
    <div
      className={`flex h-24 w-16 items-center justify-center rounded-lg border-2 ${
        hidden
          ? 'border-white/20 bg-gradient-to-br from-blue-600 to-blue-800'
          : 'border-white/30 bg-white text-gray-900'
      } text-2xl font-bold shadow-lg`}
    >
      {hidden ? '🂠' : `${card.rank}${card.suit}`}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blackjack</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {gameState === 'betting' && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">Place your bet and try to beat the dealer to 21!</p>

            <div>
              <label htmlFor="blackjack-bet" className="mb-2 block text-sm font-medium text-text-secondary">
                Bet Amount
              </label>
              <input
                id="blackjack-bet"
                type="number"
                min="10"
                step="10"
                value={betAmount}
                onChange={(e) => setBetAmount(parseInt(e.target.value, 10) || 10)}
                className="w-full rounded-lg border border-white/10 bg-background-tertiary px-4 py-2 text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
              />
            </div>

            <Button variant="success" size="lg" onClick={handleDeal} disabled={cash < betAmount} className="w-full">
              Deal ({formatCurrency(betAmount)})
            </Button>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'dealerTurn' || gameState === 'finished') && (
          <div className="space-y-6">
            {/* Dealer hand */}
            <div>
              <p className="mb-2 text-sm uppercase tracking-wider text-text-tertiary">
                Dealer {gameState !== 'playing' ? `(${dealerValue})` : ''}
              </p>
              <div className="flex gap-2">
                {dealerHand.map((card, idx) => (
                  <CardComponent key={idx} card={card} hidden={gameState === 'playing' && idx === 1} />
                ))}
              </div>
            </div>

            {/* Player hand */}
            <div>
              <p className="mb-2 text-sm uppercase tracking-wider text-text-tertiary">You ({playerValue})</p>
              <div className="flex gap-2">
                {playerHand.map((card, idx) => (
                  <CardComponent key={idx} card={card} />
                ))}
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className="rounded-lg border border-white/10 bg-background-tertiary/60 p-4 text-center">
                <p className="font-semibold text-text-primary">{message}</p>
              </div>
            )}

            {/* Actions */}
            {gameState === 'playing' && (
              <div className="flex gap-3">
                <Button variant="primary" size="lg" onClick={handleHit} className="flex-1">
                  Hit
                </Button>
                <Button variant="secondary" size="lg" onClick={handleStand} className="flex-1">
                  Stand
                </Button>
              </div>
            )}

            {gameState === 'finished' && (
              <Button variant="primary" size="lg" onClick={handleNewGame} className="w-full">
                New Game
              </Button>
            )}
          </div>
        )}

        <div className="rounded-lg border border-white/10 bg-background-tertiary/40 p-4 text-xs text-text-tertiary">
          <p>
            <strong>Rules:</strong> Dealer stands on 17. Blackjack pays 3:2.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
