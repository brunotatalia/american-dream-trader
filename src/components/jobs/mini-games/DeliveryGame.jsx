import { useEffect, useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const GAME_DURATION = 40 // seconds
const LOCATIONS = [
  { id: 1, name: 'Main St', x: 20, y: 20 },
  { id: 2, name: 'Oak Ave', x: 80, y: 30 },
  { id: 3, name: 'Park Rd', x: 50, y: 70 },
  { id: 4, name: 'Hill St', x: 10, y: 80 },
  { id: 5, name: 'River Dr', x: 90, y: 85 },
]

function calculateDistance(loc1, loc2) {
  const dx = loc1.x - loc2.x
  const dy = loc1.y - loc2.y
  return Math.sqrt(dx * dx + dy * dy)
}

function calculateOptimalRoute(locations) {
  // Simple greedy nearest-neighbor
  const route = [locations[0]]
  const remaining = locations.slice(1)

  while (remaining.length > 0) {
    const current = route[route.length - 1]
    let nearest = remaining[0]
    let nearestDist = calculateDistance(current, nearest)

    remaining.forEach((loc) => {
      const dist = calculateDistance(current, loc)
      if (dist < nearestDist) {
        nearest = loc
        nearestDist = dist
      }
    })

    route.push(nearest)
    remaining.splice(remaining.indexOf(nearest), 1)
  }

  return route
}

export default function DeliveryGame({ onComplete, basePay = 22 }) {
  const [gameState, setGameState] = useState('idle')
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION)
  const [deliveries, setDeliveries] = useState([])
  const [visitedLocations, setVisitedLocations] = useState([])
  const [totalDistance, setTotalDistance] = useState(0)

  useEffect(() => {
    if (gameState !== 'playing') return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1 || visitedLocations.length === deliveries.length) {
          setGameState('finished')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState, visitedLocations.length, deliveries.length])

  const handleStart = () => {
    // Shuffle locations for variety
    const shuffled = [...LOCATIONS].sort(() => Math.random() - 0.5).slice(0, 4)
    setDeliveries(shuffled)
    setVisitedLocations([])
    setTotalDistance(0)
    setGameState('playing')
    setTimeRemaining(GAME_DURATION)
  }

  const handleVisitLocation = (location) => {
    if (visitedLocations.includes(location.id)) return

    const newVisited = [...visitedLocations, location.id]
    setVisitedLocations(newVisited)

    // Calculate distance from last location
    if (newVisited.length > 1) {
      const lastLoc = deliveries.find((d) => d.id === newVisited[newVisited.length - 2])
      const dist = calculateDistance(lastLoc, location)
      setTotalDistance((d) => d + dist)
    }

    // Complete if all visited
    if (newVisited.length === deliveries.length) {
      setTimeout(() => setGameState('finished'), 500)
    }
  }

  const handleFinish = () => {
    const optimalRoute = calculateOptimalRoute(deliveries)
    let optimalDistance = 0
    for (let i = 1; i < optimalRoute.length; i += 1) {
      optimalDistance += calculateDistance(optimalRoute[i - 1], optimalRoute[i])
    }

    const efficiency = optimalDistance / totalDistance
    let multiplier = 1

    if (efficiency >= 0.95) multiplier = 1.25 // Near perfect route
    else if (efficiency >= 0.85) multiplier = 1.1 // Good route
    else if (efficiency >= 0.7) multiplier = 1 // Okay route
    else multiplier = 0.85 // Inefficient

    const earnings = Math.floor(basePay * multiplier)

    onComplete?.({
      success: true,
      earnings,
      deliveries: deliveries.length,
      efficiency,
      totalDistance,
      optimalDistance,
    })
  }

  if (gameState === 'idle') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delivery Driver - Route Planning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-text-secondary">
            Click delivery locations in the most efficient order. Shorter routes earn time bonuses!
          </p>
          <div className="space-y-2 text-sm text-text-tertiary">
            <p>
              <strong>Duration:</strong> {GAME_DURATION} seconds
            </p>
            <p>
              <strong>Base Pay:</strong> ${basePay}
            </p>
            <p>
              <strong>Bonus:</strong> +25% for optimal routing, +10% for efficient routing
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={handleStart}>
            Start Shift
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (gameState === 'finished') {
    const optimalRoute = calculateOptimalRoute(deliveries)
    let optimalDistance = 0
    for (let i = 1; i < optimalRoute.length; i += 1) {
      optimalDistance += calculateDistance(optimalRoute[i - 1], optimalRoute[i])
    }
    const efficiency = totalDistance > 0 ? optimalDistance / totalDistance : 1

    return (
      <Card>
        <CardHeader>
          <CardTitle>Shift Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-text-secondary">
              <strong>Deliveries:</strong> {visitedLocations.length} / {deliveries.length}
            </p>
            <p className="text-sm text-text-secondary">
              <strong>Route Efficiency:</strong> {(efficiency * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-text-secondary">
              <strong>Distance:</strong> {totalDistance.toFixed(1)} units (optimal: {optimalDistance.toFixed(1)})
            </p>
          </div>
          <Button variant="success" size="lg" onClick={handleFinish}>
            Collect Earnings
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Driver - Time: {timeRemaining}s</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-tertiary">
            Deliveries: {visitedLocations.length} / {deliveries.length}
          </span>
          <span className="text-text-tertiary">Distance: {totalDistance.toFixed(1)}</span>
        </div>

        <div className="relative h-80 rounded-lg border border-white/10 bg-background-elevated">
          {/* Simple map visualization */}
          {deliveries.map((location, idx) => {
            const isVisited = visitedLocations.includes(location.id)
            const visitOrder = visitedLocations.indexOf(location.id) + 1

            return (
              <button
                key={location.id}
                type="button"
                onClick={() => handleVisitLocation(location)}
                disabled={isVisited}
                style={{
                  position: 'absolute',
                  left: `${location.x}%`,
                  top: `${location.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-semibold transition-all ${
                  isVisited
                    ? 'border-accent-success bg-accent-success/20 text-accent-success'
                    : 'border-accent-primary bg-accent-primary/10 text-accent-primary hover:scale-110'
                }`}
              >
                {isVisited ? visitOrder : idx + 1}
              </button>
            )
          })}

          {/* Draw path lines */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {visitedLocations.map((locId, idx) => {
              if (idx === 0) return null
              const prevLoc = deliveries.find((d) => d.id === visitedLocations[idx - 1])
              const currLoc = deliveries.find((d) => d.id === locId)
              return (
                <line
                  key={`${prevLoc.id}-${currLoc.id}`}
                  x1={`${prevLoc.x}%`}
                  y1={`${prevLoc.y}%`}
                  x2={`${currLoc.x}%`}
                  y2={`${currLoc.y}%`}
                  stroke="rgba(59, 130, 246, 0.5)"
                  strokeWidth="2"
                />
              )
            })}
          </svg>
        </div>

        <p className="text-center text-xs text-text-tertiary">Click locations in order to complete deliveries</p>
      </CardContent>
    </Card>
  )
}
