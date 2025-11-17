const economicIndicators = {
  gdpGrowth: {
    current: 0.03,
    impact: {
      stocks: 0.5,
      realEstate: 0.3,
      commodities: 0.2,
    },
  },
  unemployment: {
    current: 0.05,
    impact: {
      wages: -0.4,
      consumerSpending: -0.6,
    },
  },
  inflation: {
    current: 0.02,
    impact: {
      savings: -1,
      wages: 0.7,
      commodities: 0.8,
    },
  },
  interestRates: {
    current: 0.05,
    impact: {
      bonds: -0.9,
      realEstate: -0.6,
      loans: 1,
    },
  },
}

export default economicIndicators
