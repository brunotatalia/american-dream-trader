const gameConfig = {
  metadata: {
    name: 'American Dream Trader',
    version: '0.1.0',
  },
  time: {
    speeds: {
      slow: { label: 'Slow', multiplier: 1, intervalMs: 60000 },
      normal: { label: 'Normal', multiplier: 2, intervalMs: 30000 },
      fast: { label: 'Fast', multiplier: 5, intervalMs: 12000 },
    },
  },
  banking: {
    accounts: [
      {
        id: 'savings-basic',
        name: 'Basic Savings',
        interestRate: 0.02,
        compounding: 'monthly',
        minimumBalance: 100,
      },
      {
        id: 'savings-premium',
        name: 'Premium Savings',
        interestRate: 0.03,
        compounding: 'monthly',
        minimumBalance: 5000,
      },
    ],
  },
}

export default gameConfig
