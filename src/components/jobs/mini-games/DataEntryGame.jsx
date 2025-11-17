import { useEffect, useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

// Stock ticker symbols and prices from the 1920s
const STOCK_TICKERS = [
  'GM', 'FORD', 'GE', 'US STEEL', 'RADIO', 'AT&T', 'DUPONT', 'EASTMAN',
  'STANDARD OIL', 'BOEING', 'CURTISS', 'WOOLWORTH', 'SEARS', 'GOODYEAR'
]

function generateTradeEntry() {
  const ticker = STOCK_TICKERS[Math.floor(Math.random() * STOCK_TICKERS.length)]
  const action = Math.random() > 0.5 ? 'BUY' : 'SELL'
  const quantity = Math.floor(Math.random() * 900) + 100 // 100-999
  const price = (Math.random() * 400 + 50).toFixed(2) // $50-$450
  
  return {
    ticker,
    action,
    quantity,
    price,
  }
}

export default function DataEntryGame({ onComplete, basePay = 52 }) {
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds
  const [currentEntry, setCurrentEntry] = useState(null)
  const [userInput, setUserInput] = useState({ ticker: '', action: '', quantity: '', price: '' })
  const [currentField, setCurrentField] = useState('ticker')
  const [entriesCompleted, setEntriesCompleted] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isGameActive, setIsGameActive] = useState(true)

  // Initialize first entry
  useEffect(() => {
    setCurrentEntry(generateTradeEntry())
  }, [])

  // Timer countdown
  useEffect(() => {
    if (!isGameActive || timeLeft <= 0) {
      if (timeLeft === 0) endGame()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isGameActive])

  const handleFieldSubmit = () => {
    if (!currentEntry) return

    const fields = ['ticker', 'action', 'quantity', 'price']
    const currentIndex = fields.indexOf(currentField)
    const currentValue = userInput[currentField].toUpperCase()
    const expectedValue = String(currentEntry[currentField]).toUpperCase()

    // Check if current field is correct
    if (currentValue !== expectedValue) {
      setMistakes(mistakes + 1)
      setFeedback(`✗ Incorrect ${currentField}! Expected: ${expectedValue}`)
      
      setTimeout(() => {
        setFeedback('')
        // Move to next field anyway
        if (currentIndex < fields.length - 1) {
          setCurrentField(fields[currentIndex + 1])
        } else {
          // Entry complete, generate new one
          setCurrentEntry(generateTradeEntry())
          setUserInput({ ticker: '', action: '', quantity: '', price: '' })
          setCurrentField('ticker')
        }
      }, 1000)
      return
    }

    // Field is correct
    if (currentIndex < fields.length - 1) {
      // Move to next field
      setCurrentField(fields[currentIndex + 1])
      setFeedback(`✓ ${currentField} correct!`)
      setTimeout(() => setFeedback(''), 300)
    } else {
      // All fields completed!
      const points = 200 + (timeLeft * 3) // Bonus for speed
      setScore(score + points)
      setEntriesCompleted(entriesCompleted + 1)
      setFeedback('✓ Entry Complete!')
      
      setTimeout(() => {
        setCurrentEntry(generateTradeEntry())
        setUserInput({ ticker: '', action: '', quantity: '', price: '' })
        setCurrentField('ticker')
        setFeedback('')
      }, 500)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleFieldSubmit()
    }
  }

  const endGame = () => {
    setIsGameActive(false)
    
    // Calculate performance
    const totalFields = entriesCompleted * 4 + mistakes
    const accuracy = totalFields > 0 ? (entriesCompleted * 4) / totalFields : 0
    const performanceMultiplier = Math.max(0.5, accuracy)
    const earnings = Math.round(basePay * performanceMultiplier)

    onComplete({
      success: true,
      earnings,
      score: entriesCompleted,
      mistakes,
      accuracy,
    })
  }

  if (!isGameActive) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shift Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center">
            <p className="text-2xl font-bold text-accent-success">Entries Processed: {entriesCompleted}</p>
            <p className="text-text-secondary">Mistakes: {mistakes}</p>
            <p className="text-text-secondary">Final Score: {score}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentEntry) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Entry - Wall Street Trading Clerk</CardTitle>
        <p className="text-sm text-text-tertiary">
          Process trade orders accurately and quickly on the busy NYSE floor!
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Timer and Stats */}
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-background-tertiary p-4">
            <div>
              <p className="text-xs text-text-tertiary">Time Remaining</p>
              <p className={`text-2xl font-bold ${timeLeft <= 15 ? 'text-accent-danger' : 'text-accent-primary'}`}>
                {timeLeft}s
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Entries</p>
              <p className="text-2xl font-bold text-accent-success">{entriesCompleted}</p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Mistakes</p>
              <p className="text-2xl font-bold text-accent-danger">{mistakes}</p>
            </div>
          </div>

          {/* Trade Order Card */}
          <div className="rounded-lg border-2 border-accent-primary/30 bg-gradient-to-br from-yellow-50 to-amber-100 p-6 dark:from-yellow-900/20 dark:to-amber-900/20">
            <div className="mb-3 flex items-center justify-between border-b border-amber-800/20 pb-2">
              <p className="font-mono text-xs font-semibold text-amber-900 dark:text-amber-200">
                NYSE TRADE ORDER #{String(entriesCompleted + 1).padStart(4, '0')}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">PRIORITY: URGENT</p>
            </div>
            
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-amber-800 dark:text-amber-300">TICKER:</span>
                <span className="text-xl font-bold text-amber-950 dark:text-amber-100">{currentEntry.ticker}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-800 dark:text-amber-300">ACTION:</span>
                <span className={`text-xl font-bold ${currentEntry.action === 'BUY' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {currentEntry.action}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-800 dark:text-amber-300">QUANTITY:</span>
                <span className="text-xl font-bold text-amber-950 dark:text-amber-100">{currentEntry.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-800 dark:text-amber-300">PRICE:</span>
                <span className="text-xl font-bold text-amber-950 dark:text-amber-100">${currentEntry.price}</span>
              </div>
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-text-primary">
              Enter field: <span className="text-accent-primary uppercase">{currentField}</span>
            </p>
            
            <input
              type="text"
              value={userInput[currentField]}
              onChange={(e) => setUserInput({ ...userInput, [currentField]: e.target.value })}
              onKeyPress={handleKeyPress}
              className="w-full rounded-lg border-2 border-accent-primary bg-background-tertiary px-4 py-3 text-center text-xl font-semibold uppercase tracking-wider text-text-primary focus:border-accent-success focus:outline-none focus:ring-2 focus:ring-accent-success/50"
              placeholder={`TYPE ${currentField.toUpperCase()} HERE`}
              autoFocus
              autoComplete="off"
            />

            {/* Feedback */}
            {feedback && (
              <p className={`text-center text-sm font-semibold ${feedback.includes('✓') ? 'text-accent-success' : 'text-accent-danger'}`}>
                {feedback}
              </p>
            )}

            <Button onClick={handleFieldSubmit} variant="primary" className="w-full" disabled={!userInput[currentField]}>
              Submit Field
            </Button>
          </div>

          {/* Instructions */}
          <div className="rounded-lg border border-accent-info/20 bg-accent-info/5 p-3 text-xs text-text-secondary">
            <p className="font-semibold text-accent-info">Trading Floor Rules:</p>
            <ul className="mt-1 space-y-1">
              <li>• Enter each field exactly as shown on the order</li>
              <li>• Press Enter or click Submit to move to next field</li>
              <li>• Speed and accuracy both matter for your commission</li>
              <li>• Mistakes will reduce your pay</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

