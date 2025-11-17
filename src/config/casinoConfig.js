const casinoConfig = {
  houseEdge: 0.05,
  games: [
    {
      id: 'slots',
      name: 'Slot Machine',
      description: 'Classic three reel slot machine with themed payouts.',
      minimumBet: 5,
    },
    {
      id: 'roulette',
      name: 'Roulette',
      description: 'European roulette wheel with inside and outside bets.',
      minimumBet: 10,
    },
    {
      id: 'blackjack',
      name: 'Blackjack',
      description: 'Beat the dealer without busting in this strategy classic.',
      minimumBet: 10,
    },
  ],
}

export default casinoConfig
