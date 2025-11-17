const eventsDatabase = [
  // Roaring Twenties timeline events
  {
    id: 'PROHIBITION_CRACKDOWN',
    date: '1920-01-17',
    type: 'policy',
    era: 'ROARING_TWENTIES',
    impact: {
      speakeasyProfit: 0.2,
      policingCost: 0.1,
      jobs: -0.05,
    },
    durationDays: 90,
    description: 'Volstead Act enforcement begins. Legit bars decline while speakeasy profits surge.',
  },
  {
    id: 'FLORIDA_LAND_BOOM',
    date: '1925-03-01',
    type: 'real_estate_boom',
    era: 'ROARING_TWENTIES',
    impact: {
      realEstate: 0.18,
      insuranceCost: 0.05,
      constructionJobs: 0.12,
    },
    durationDays: 365,
    description:
      'Florida real estate frenzy sends property values soaring before speculation catches up.',
  },
  {
    id: 'STOCK_POOL_SCANDAL',
    date: '1928-08-15',
    type: 'market_event',
    era: 'ROARING_TWENTIES',
    impact: {
      stocks: 0.07,
      marginRequirements: 0.05,
    },
    durationDays: 30,
    description:
      'Insider stock pools manipulate prices upward; short-term gains followed by investigations.',
  },
  {
    id: 'RADIO_CRAZE',
    date: '1927-11-23',
    type: 'technology_boom',
    era: 'ROARING_TWENTIES',
    impact: {
      stocks: 0.06,
      consumerSpending: 0.08,
    },
    durationDays: 120,
    description:
      'Radio ownership explodes across America, boosting electronics manufacturers and advertisers.',
  },
  {
    id: 'BLACK_THURSDAY',
    date: '1929-10-24',
    type: 'market_crash',
    era: 'ROARING_TWENTIES',
    impact: {
      stocks: -0.28,
      realEstate: -0.12,
      jobs: -0.18,
      bankSolvency: -0.15,
    },
    durationDays: 45,
    description: 'Markets plunge as panic selling begins. Credit dries up and brokers call margins.',
  },
  {
    id: 'BLACK_TUESDAY',
    date: '1929-10-29',
    type: 'market_crash',
    era: 'ROARING_TWENTIES',
    impact: {
      stocks: -0.32,
      consumerSpending: -0.16,
      bankSolvency: -0.2,
    },
    durationDays: 60,
    description:
      'The crash accelerates; investors capitulate and huge volumes overwhelm the NYSE ticker.',
  },
  {
    id: 'GI_BILL',
    date: '1944-06-22',
    type: 'policy',
    era: 'POST_WAR',
    impact: {
      realEstateDemand: 0.15,
      education: 0.2,
    },
    description: 'GI Bill opens new educational and housing opportunities.',
  },
]

export default eventsDatabase
