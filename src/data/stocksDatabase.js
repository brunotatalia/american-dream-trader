const stocksDatabase = [
  // ═══════════════════════════════════════════════════════════════
  // ROARING TWENTIES EQUITIES
  // ═══════════════════════════════════════════════════════════════

  // Automotive
  { symbol: 'GM', name: 'General Motors', sector: 'Automotive', exchange: 'NYSE', initialPrice: 32, volatility: 0.17, trend: 'bullish', dividendYield: 0.025, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Automobile demand soars as production lines run nonstop.' },
  { symbol: 'FORD', name: 'Ford Motor Company', sector: 'Automotive', exchange: 'NYSE', initialPrice: 68, volatility: 0.16, trend: 'bullish', dividendYield: 0.03, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Model T and Model A dominate U.S. roads.' },
  { symbol: 'CHRYS', name: 'Chrysler Corporation', sector: 'Automotive', exchange: 'NYSE', initialPrice: 28, volatility: 0.22, trend: 'bullish', dividendYield: 0.015, eraAvailability: ['ROARING_TWENTIES'], narrative: 'New entrant challenges Ford and GM with stylish designs.' },
  { symbol: 'STUDE', name: 'Studebaker', sector: 'Automotive', exchange: 'NYSE', initialPrice: 22, volatility: 0.2, trend: 'bullish', dividendYield: 0.02, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Premium automobiles for the growing middle class.' },
  { symbol: 'GDYR', name: 'Goodyear Tire & Rubber', sector: 'Automotive', exchange: 'NYSE', initialPrice: 34, volatility: 0.18, trend: 'bullish', dividendYield: 0.025, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Every new car needs tires. Goodyear dominates the rubber market.' },

  // Materials & Steel
  { symbol: 'USST', name: 'United States Steel', sector: 'Materials', exchange: 'NYSE', initialPrice: 182, volatility: 0.19, trend: 'bullish', dividendYield: 0.02, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Steel demand from skyscrapers, railroads, and autos.' },
  { symbol: 'BETHSTL', name: 'Bethlehem Steel', sector: 'Materials', exchange: 'NYSE', initialPrice: 92, volatility: 0.18, trend: 'bullish', dividendYield: 0.03, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Shipbuilding and construction steel feed demand.' },
  { symbol: 'ANAC', name: 'Anaconda Copper', sector: 'Materials', exchange: 'NYSE', initialPrice: 74, volatility: 0.21, trend: 'cyclical', dividendYield: 0.035, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Copper demand tracks infrastructure and telephone expansion.' },
  { symbol: 'DUPONT', name: 'DuPont', sector: 'Materials', exchange: 'NYSE', initialPrice: 156, volatility: 0.13, trend: 'steady', dividendYield: 0.042, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Chemical innovations drive industrial expansion.' },
  { symbol: 'AMCAN', name: 'American Can Company', sector: 'Materials', exchange: 'NYSE', initialPrice: 55, volatility: 0.12, trend: 'steady', dividendYield: 0.035, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Canned food packaging grows with urbanization.' },

  // Technology & Communications
  { symbol: 'RCA', name: 'Radio Corporation of America', sector: 'Technology', exchange: 'NYSE', initialPrice: 84, volatility: 0.24, trend: 'bullish', dividendYield: 0, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Radio is the hottest new technology—stock rockets with every new listener.' },
  { symbol: 'ATTC', name: 'American Telephone & Telegraph', sector: 'Utilities', exchange: 'NYSE', initialPrice: 123, volatility: 0.12, trend: 'steady', dividendYield: 0.045, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Telephone adoption climbs steadily. Dependable dividend payer.' },
  { symbol: 'WUNION', name: 'Western Union', sector: 'Technology', exchange: 'NYSE', initialPrice: 88, volatility: 0.11, trend: 'steady', dividendYield: 0.04, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Telegraph monopoly generates steady profits despite radio competition.' },
  { symbol: 'KODAK', name: 'Eastman Kodak', sector: 'Technology', exchange: 'NYSE', initialPrice: 72, volatility: 0.15, trend: 'bullish', dividendYield: 0.03, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Photography becomes a consumer hobby. Film sales soar.' },
  { symbol: 'REMRAND', name: 'Remington Rand', sector: 'Technology', exchange: 'NYSE', initialPrice: 38, volatility: 0.14, trend: 'steady', dividendYield: 0.025, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Typewriters and office equipment for the modern workplace.' },

  // Industrials
  { symbol: 'GE', name: 'General Electric', sector: 'Industrials', exchange: 'NYSE', initialPrice: 95, volatility: 0.14, trend: 'bullish', dividendYield: 0.028, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Electrical appliances and power generation drive steady growth.' },
  { symbol: 'WESTING', name: 'Westinghouse Electric', sector: 'Industrials', exchange: 'NYSE', initialPrice: 78, volatility: 0.17, trend: 'bullish', dividendYield: 0.025, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Radio and electrical equipment manufacturing expands.' },
  { symbol: 'SINGER', name: 'Singer Manufacturing', sector: 'Industrials', exchange: 'NYSE', initialPrice: 60, volatility: 0.11, trend: 'steady', dividendYield: 0.04, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Sewing machines in every American home. Global manufacturing.' },
  { symbol: 'OTIS', name: 'Otis Elevator', sector: 'Industrials', exchange: 'NYSE', initialPrice: 42, volatility: 0.13, trend: 'bullish', dividendYield: 0.03, eraAvailability: ['ROARING_TWENTIES'], narrative: 'The skyscraper boom means every building needs elevators.' },
  { symbol: 'INTHVST', name: 'International Harvester', sector: 'Industrials', exchange: 'NYSE', initialPrice: 65, volatility: 0.14, trend: 'steady', dividendYield: 0.035, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Farm equipment giant mechanizing American agriculture.' },

  // Energy
  { symbol: 'STDOIL', name: 'Standard Oil of New Jersey', sector: 'Energy', exchange: 'NYSE', initialPrice: 42, volatility: 0.18, trend: 'bullish', dividendYield: 0.05, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Despite antitrust breakup, oil demand makes this a powerhouse.' },
  { symbol: 'GULFOIL', name: 'Gulf Oil', sector: 'Energy', exchange: 'NYSE', initialPrice: 36, volatility: 0.19, trend: 'bullish', dividendYield: 0.045, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Texas oil fields and gas stations proliferate nationwide.' },

  // Transportation
  { symbol: 'PENNRR', name: 'Pennsylvania Railroad', sector: 'Transportation', exchange: 'NYSE', initialPrice: 64, volatility: 0.12, trend: 'steady', dividendYield: 0.055, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Freight and passenger rail still dominates long-distance transport.' },
  { symbol: 'PULLMAN', name: 'Pullman Company', sector: 'Transportation', exchange: 'NYSE', initialPrice: 48, volatility: 0.14, trend: 'steady', dividendYield: 0.04, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Luxury sleeper cars serve transcontinental travelers.' },
  { symbol: 'UNPAC', name: 'Union Pacific Railroad', sector: 'Transportation', exchange: 'NYSE', initialPrice: 58, volatility: 0.13, trend: 'steady', dividendYield: 0.05, eraAvailability: ['ROARING_TWENTIES'], narrative: 'The western rail giant connecting the coasts.' },
  { symbol: 'PANAM', name: 'Pan American Airways', sector: 'Transportation', exchange: 'NYSE', initialPrice: 12, volatility: 0.3, trend: 'bullish', dividendYield: 0, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Commercial aviation is born. Speculative but the future of travel.' },

  // Consumer
  { symbol: 'NBCO', name: 'National Biscuit Company', sector: 'Consumer Staples', exchange: 'NYSE', initialPrice: 45, volatility: 0.11, trend: 'steady', dividendYield: 0.04, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Household staples remain reliable even in downturns.' },
  { symbol: 'WOOL', name: 'F.W. Woolworth', sector: 'Consumer Discretionary', exchange: 'NYSE', initialPrice: 52, volatility: 0.15, trend: 'bullish', dividendYield: 0.038, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Five-and-dime stores expand rapidly across America.' },
  { symbol: 'SEARS', name: 'Sears Roebuck', sector: 'Consumer Discretionary', exchange: 'NYSE', initialPrice: 38, volatility: 0.16, trend: 'bullish', dividendYield: 0.032, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Mail-order catalog giant expands into retail stores.' },
  { symbol: 'KO20', name: 'Coca-Cola Company', sector: 'Consumer Staples', exchange: 'NYSE', initialPrice: 28, volatility: 0.1, trend: 'bullish', dividendYield: 0.04, eraAvailability: ['ROARING_TWENTIES'], narrative: 'America\'s favorite soft drink. Syrup sales skyrocket.' },
  { symbol: 'PG20', name: 'Procter & Gamble', sector: 'Consumer Staples', exchange: 'NYSE', initialPrice: 35, volatility: 0.09, trend: 'steady', dividendYield: 0.045, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Soap and household goods. A defensive stock for cautious investors.' },
  { symbol: 'MWARD', name: 'Montgomery Ward', sector: 'Consumer Discretionary', exchange: 'NYSE', initialPrice: 40, volatility: 0.17, trend: 'bullish', dividendYield: 0.03, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Second-largest retail chain riding the consumer boom.' },
  { symbol: 'UFRUIT', name: 'United Fruit Company', sector: 'Consumer Staples', exchange: 'NYSE', initialPrice: 68, volatility: 0.15, trend: 'bullish', dividendYield: 0.035, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Banana imports and Latin American plantations generate huge profits.' },
  { symbol: 'CORNPRD', name: 'Corn Products Refining', sector: 'Consumer Staples', exchange: 'NYSE', initialPrice: 32, volatility: 0.11, trend: 'steady', dividendYield: 0.04, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Corn syrup and starch products for the food industry.' },

  // Healthcare
  { symbol: 'PFZER', name: 'Pfizer', sector: 'Healthcare', exchange: 'NYSE', initialPrice: 28, volatility: 0.14, trend: 'steady', dividendYield: 0.018, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Pharmaceutical innovation continues as public health spending rises.' },

  // Entertainment
  { symbol: 'WARNBR', name: 'Warner Bros', sector: 'Entertainment', exchange: 'NYSE', initialPrice: 20, volatility: 0.28, trend: 'bullish', dividendYield: 0, eraAvailability: ['ROARING_TWENTIES'], narrative: 'The Jazz Singer launches "talkies" - a revolution in entertainment.' },
  { symbol: 'RKOENT', name: 'RKO Pictures', sector: 'Entertainment', exchange: 'NYSE', initialPrice: 30, volatility: 0.25, trend: 'bullish', dividendYield: 0, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Hollywood dreams on screen. Movie studios are the new gold rush.' },

  // Finance
  { symbol: 'NATCITY', name: 'National City Bank', sector: 'Finance', exchange: 'NYSE', initialPrice: 90, volatility: 0.2, trend: 'bullish', dividendYield: 0.03, eraAvailability: ['ROARING_TWENTIES'], narrative: 'The biggest bank on Wall Street. Speculation fuel.' },
  { symbol: 'GSTRADE', name: 'Goldman Sachs Trading Corp', sector: 'Finance', exchange: 'NYSE', initialPrice: 105, volatility: 0.35, trend: 'bullish', dividendYield: 0, eraAvailability: ['ROARING_TWENTIES'], narrative: 'The infamous investment trust. Sky-high in 1928, worthless by 1930.' },
  { symbol: 'CHASE20', name: 'Chase National Bank', sector: 'Finance', exchange: 'NYSE', initialPrice: 75, volatility: 0.18, trend: 'bullish', dividendYield: 0.025, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Major banking institution serving Wall Street and industry.' },

  // Tobacco
  { symbol: 'AMTOB', name: 'American Tobacco', sector: 'Consumer Staples', exchange: 'NYSE', initialPrice: 55, volatility: 0.1, trend: 'steady', dividendYield: 0.05, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Lucky Strike and other brands make tobacco a cash cow.' },
  { symbol: 'LIGMYR', name: 'Liggett & Myers', sector: 'Consumer Staples', exchange: 'NYSE', initialPrice: 48, volatility: 0.09, trend: 'steady', dividendYield: 0.055, eraAvailability: ['ROARING_TWENTIES'], narrative: 'Chesterfield cigarettes. Recession-proof consumer demand.' },

  // Utilities
  { symbol: 'CONED', name: 'Consolidated Edison', sector: 'Utilities', exchange: 'NYSE', initialPrice: 45, volatility: 0.08, trend: 'steady', dividendYield: 0.055, eraAvailability: ['ROARING_TWENTIES'], narrative: 'New York City electrification means reliable, growing demand.' },

  // ═══════════════════════════════════════════════════════════════
  // GREAT DEPRESSION ERA (same companies, lower prices, bearish)
  // ═══════════════════════════════════════════════════════════════
  { symbol: 'USGOV', name: 'U.S. Government Bonds', sector: 'Government', exchange: 'NYSE', initialPrice: 100, volatility: 0.02, trend: 'steady', dividendYield: 0.035, eraAvailability: ['GREAT_DEPRESSION'], narrative: 'The safest investment during economic collapse. Low returns but zero risk.' },
  { symbol: 'GOLDMINE', name: 'Homestake Mining (Gold)', sector: 'Mining', exchange: 'NYSE', initialPrice: 80, volatility: 0.15, trend: 'bullish', dividendYield: 0.06, eraAvailability: ['GREAT_DEPRESSION'], narrative: 'Gold mining stocks surge as deflation increases gold\'s real value.' },
  { symbol: 'GM30', name: 'General Motors', sector: 'Automotive', exchange: 'NYSE', initialPrice: 8, volatility: 0.25, trend: 'bearish', dividendYield: 0, eraAvailability: ['GREAT_DEPRESSION'], narrative: 'Auto sales collapse. GM fights for survival.' },
  { symbol: 'USST30', name: 'United States Steel', sector: 'Materials', exchange: 'NYSE', initialPrice: 22, volatility: 0.28, trend: 'bearish', dividendYield: 0, eraAvailability: ['GREAT_DEPRESSION'], narrative: 'Construction halts. Steel mills sit idle.' },
  { symbol: 'RCA30', name: 'Radio Corporation of America', sector: 'Technology', exchange: 'NYSE', initialPrice: 3, volatility: 0.3, trend: 'bearish', dividendYield: 0, eraAvailability: ['GREAT_DEPRESSION'], narrative: 'From $100 to $3. The poster child of speculation gone wrong.' },
  { symbol: 'GE30', name: 'General Electric', sector: 'Industrials', exchange: 'NYSE', initialPrice: 12, volatility: 0.22, trend: 'bearish', dividendYield: 0.01, eraAvailability: ['GREAT_DEPRESSION'], narrative: 'Even the mighty GE suffers. Patient buyers will be rewarded.' },
  { symbol: 'KO30', name: 'Coca-Cola Company', sector: 'Consumer Staples', exchange: 'NYSE', initialPrice: 18, volatility: 0.12, trend: 'steady', dividendYield: 0.045, eraAvailability: ['GREAT_DEPRESSION'], narrative: 'People still drink Coca-Cola, even in hard times.' },
  { symbol: 'PG30', name: 'Procter & Gamble', sector: 'Consumer Staples', exchange: 'NYSE', initialPrice: 22, volatility: 0.1, trend: 'steady', dividendYield: 0.05, eraAvailability: ['GREAT_DEPRESSION'], narrative: 'Soap and necessities hold up better than luxuries.' },
  { symbol: 'ATTC30', name: 'AT&T', sector: 'Utilities', exchange: 'NYSE', initialPrice: 75, volatility: 0.12, trend: 'steady', dividendYield: 0.06, eraAvailability: ['GREAT_DEPRESSION'], narrative: 'Phone service is becoming essential. Dividends remain reliable.' },
  { symbol: 'WOOLW30', name: 'F.W. Woolworth', sector: 'Consumer Discretionary', exchange: 'NYSE', initialPrice: 25, volatility: 0.14, trend: 'steady', dividendYield: 0.04, eraAvailability: ['GREAT_DEPRESSION'], narrative: 'Five-and-dime stores thrive as consumers trade down.' },

  // ═══════════════════════════════════════════════════════════════
  // POST-WAR BOOM ERA
  // ═══════════════════════════════════════════════════════════════
  { symbol: 'GM50', name: 'General Motors', sector: 'Automotive', exchange: 'NYSE', initialPrice: 45, volatility: 0.12, trend: 'bullish', dividendYield: 0.04, eraAvailability: ['POST_WAR_BOOM'], narrative: 'Car culture defines postwar America. Every family wants a Chevy.' },
  { symbol: 'IBM', name: 'IBM', sector: 'Technology', exchange: 'NYSE', initialPrice: 35, volatility: 0.15, trend: 'bullish', dividendYield: 0.02, eraAvailability: ['POST_WAR_BOOM'], narrative: 'Computing machines revolutionize business. The future is digital.' },
  { symbol: 'DIS50', name: 'Walt Disney', sector: 'Entertainment', exchange: 'NYSE', initialPrice: 12, volatility: 0.2, trend: 'bullish', dividendYield: 0.01, eraAvailability: ['POST_WAR_BOOM'], narrative: 'Disneyland opens in 1955. Animation and theme parks create magic.' },
  { symbol: 'MCD', name: 'McDonald\'s', sector: 'Consumer Discretionary', exchange: 'NYSE', initialPrice: 8, volatility: 0.18, trend: 'bullish', dividendYield: 0, eraAvailability: ['POST_WAR_BOOM'], narrative: 'Fast food revolution begins. Golden arches spread across highways.' },
  { symbol: 'KO50', name: 'Coca-Cola', sector: 'Consumer Staples', exchange: 'NYSE', initialPrice: 40, volatility: 0.08, trend: 'bullish', dividendYield: 0.035, eraAvailability: ['POST_WAR_BOOM'], narrative: 'Global expansion makes Coca-Cola an American export icon.' },
  { symbol: 'XOM50', name: 'Standard Oil (Exxon)', sector: 'Energy', exchange: 'NYSE', initialPrice: 55, volatility: 0.14, trend: 'bullish', dividendYield: 0.04, eraAvailability: ['POST_WAR_BOOM'], narrative: 'Suburbia runs on gasoline. Oil companies print money.' },
  { symbol: 'GE50', name: 'General Electric', sector: 'Industrials', exchange: 'NYSE', initialPrice: 60, volatility: 0.12, trend: 'bullish', dividendYield: 0.03, eraAvailability: ['POST_WAR_BOOM'], narrative: 'Every suburban home filled with GE appliances.' },
  { symbol: 'BOING', name: 'Boeing', sector: 'Industrials', exchange: 'NYSE', initialPrice: 22, volatility: 0.18, trend: 'bullish', dividendYield: 0.015, eraAvailability: ['POST_WAR_BOOM'], narrative: 'Jet age begins. Commercial aviation takes off.' },

  // ═══════════════════════════════════════════════════════════════
  // MODERN ERA EQUITIES
  // ═══════════════════════════════════════════════════════════════
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', exchange: 'NASDAQ', initialPrice: 150, volatility: 0.22, trend: 'bullish', dividendYield: 0.01, eraAvailability: ['MODERN_ERA'], narrative: 'iPhone ecosystem dominates. The world\'s most valuable company.' },
  { symbol: 'MSFT', name: 'Microsoft', sector: 'Technology', exchange: 'NASDAQ', initialPrice: 280, volatility: 0.18, trend: 'bullish', dividendYield: 0.01, eraAvailability: ['MODERN_ERA'], narrative: 'Cloud computing and enterprise software. A tech behemoth.' },
  { symbol: 'GOOGL', name: 'Alphabet (Google)', sector: 'Technology', exchange: 'NASDAQ', initialPrice: 140, volatility: 0.2, trend: 'bullish', dividendYield: 0, eraAvailability: ['MODERN_ERA'], narrative: 'Search, advertising, and AI. Google is the internet.' },
  { symbol: 'AMZN', name: 'Amazon', sector: 'Technology', exchange: 'NASDAQ', initialPrice: 180, volatility: 0.24, trend: 'bullish', dividendYield: 0, eraAvailability: ['MODERN_ERA'], narrative: 'E-commerce and cloud services. Disrupting every industry.' },
  { symbol: 'TSLA', name: 'Tesla', sector: 'Automotive', exchange: 'NASDAQ', initialPrice: 250, volatility: 0.4, trend: 'bullish', dividendYield: 0, eraAvailability: ['MODERN_ERA'], narrative: 'Electric vehicles and clean energy. Extreme volatility, extreme potential.' },
  { symbol: 'META', name: 'Meta Platforms', sector: 'Technology', exchange: 'NASDAQ', initialPrice: 350, volatility: 0.28, trend: 'cyclical', dividendYield: 0, eraAvailability: ['MODERN_ERA'], narrative: 'Social media empire. Betting big on the metaverse.' },
  { symbol: 'NVDA', name: 'Nvidia', sector: 'Technology', exchange: 'NASDAQ', initialPrice: 800, volatility: 0.35, trend: 'bullish', dividendYield: 0.005, eraAvailability: ['MODERN_ERA'], narrative: 'AI chip dominance. The most important company in the AI revolution.' },
  { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Finance', exchange: 'NYSE', initialPrice: 195, volatility: 0.16, trend: 'bullish', dividendYield: 0.025, eraAvailability: ['MODERN_ERA'], narrative: 'America\'s largest bank. Too big to fail.' },
  { symbol: 'BAC', name: 'Bank of America', sector: 'Finance', exchange: 'NYSE', initialPrice: 35, volatility: 0.2, trend: 'steady', dividendYield: 0.025, eraAvailability: ['MODERN_ERA'], narrative: 'Consumer banking giant recovering from 2008 crisis.' },
  { symbol: 'V', name: 'Visa', sector: 'Finance', exchange: 'NYSE', initialPrice: 280, volatility: 0.15, trend: 'bullish', dividendYield: 0.008, eraAvailability: ['MODERN_ERA'], narrative: 'Every card swipe generates revenue. The toll bridge of payments.' },
  { symbol: 'MA', name: 'Mastercard', sector: 'Finance', exchange: 'NYSE', initialPrice: 440, volatility: 0.16, trend: 'bullish', dividendYield: 0.006, eraAvailability: ['MODERN_ERA'], narrative: 'Global payments network growing with cashless society.' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', exchange: 'NYSE', initialPrice: 155, volatility: 0.12, trend: 'steady', dividendYield: 0.03, eraAvailability: ['MODERN_ERA'], narrative: 'Healthcare conglomerate. A defensive dividend aristocrat.' },
  { symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', exchange: 'NYSE', initialPrice: 520, volatility: 0.15, trend: 'bullish', dividendYield: 0.015, eraAvailability: ['MODERN_ERA'], narrative: 'Health insurance giant in an aging America.' },
  { symbol: 'PFE_M', name: 'Pfizer', sector: 'Healthcare', exchange: 'NYSE', initialPrice: 28, volatility: 0.18, trend: 'steady', dividendYield: 0.04, eraAvailability: ['MODERN_ERA'], narrative: 'Big pharma. Vaccine windfall creates new investment opportunities.' },
  { symbol: 'XOM', name: 'ExxonMobil', sector: 'Energy', exchange: 'NYSE', initialPrice: 110, volatility: 0.2, trend: 'cyclical', dividendYield: 0.035, eraAvailability: ['MODERN_ERA'], narrative: 'Oil supermajor. Cash machine when oil prices are high.' },
  { symbol: 'CVX', name: 'Chevron', sector: 'Energy', exchange: 'NYSE', initialPrice: 155, volatility: 0.18, trend: 'cyclical', dividendYield: 0.035, eraAvailability: ['MODERN_ERA'], narrative: 'Integrated oil company with strong dividend history.' },
  { symbol: 'WMT', name: 'Walmart', sector: 'Consumer Discretionary', exchange: 'NYSE', initialPrice: 165, volatility: 0.12, trend: 'steady', dividendYield: 0.015, eraAvailability: ['MODERN_ERA'], narrative: 'The world\'s largest retailer. Everyday low prices.' },
  { symbol: 'KO', name: 'Coca-Cola', sector: 'Consumer Staples', exchange: 'NYSE', initialPrice: 60, volatility: 0.1, trend: 'steady', dividendYield: 0.03, eraAvailability: ['MODERN_ERA'], narrative: 'Warren Buffett\'s favorite. Global beverage empire.' },
  { symbol: 'PG', name: 'Procter & Gamble', sector: 'Consumer Staples', exchange: 'NYSE', initialPrice: 160, volatility: 0.1, trend: 'steady', dividendYield: 0.025, eraAvailability: ['MODERN_ERA'], narrative: 'Household brands everyone uses. Defensive dividend stock.' },
  { symbol: 'DIS', name: 'Walt Disney', sector: 'Entertainment', exchange: 'NYSE', initialPrice: 100, volatility: 0.2, trend: 'cyclical', dividendYield: 0, eraAvailability: ['MODERN_ERA'], narrative: 'Theme parks, streaming, Marvel, Star Wars. Entertainment empire.' },
  { symbol: 'NFLX', name: 'Netflix', sector: 'Entertainment', exchange: 'NASDAQ', initialPrice: 450, volatility: 0.3, trend: 'bullish', dividendYield: 0, eraAvailability: ['MODERN_ERA'], narrative: 'Streaming revolution. Growth stock with global ambitions.' },
  { symbol: 'HD', name: 'Home Depot', sector: 'Consumer Discretionary', exchange: 'NYSE', initialPrice: 350, volatility: 0.14, trend: 'bullish', dividendYield: 0.025, eraAvailability: ['MODERN_ERA'], narrative: 'Home improvement giant. Benefits from housing market strength.' },
  { symbol: 'COST', name: 'Costco', sector: 'Consumer Discretionary', exchange: 'NASDAQ', initialPrice: 720, volatility: 0.13, trend: 'bullish', dividendYield: 0.007, eraAvailability: ['MODERN_ERA'], narrative: 'Membership warehouse retail. Cult-like customer loyalty.' },
  { symbol: 'CRM', name: 'Salesforce', sector: 'Technology', exchange: 'NYSE', initialPrice: 260, volatility: 0.22, trend: 'bullish', dividendYield: 0, eraAvailability: ['MODERN_ERA'], narrative: 'Enterprise cloud CRM leader. Software as a service pioneer.' },
  { symbol: 'AMD', name: 'AMD', sector: 'Technology', exchange: 'NASDAQ', initialPrice: 170, volatility: 0.32, trend: 'bullish', dividendYield: 0, eraAvailability: ['MODERN_ERA'], narrative: 'Chip maker riding the AI wave alongside Nvidia.' },
  { symbol: 'BRK', name: 'Berkshire Hathaway', sector: 'Finance', exchange: 'NYSE', initialPrice: 380, volatility: 0.12, trend: 'bullish', dividendYield: 0, eraAvailability: ['MODERN_ERA'], narrative: 'Warren Buffett\'s conglomerate. The ultimate value investment.' },

  // Modern Era - Speculative/Meme
  { symbol: 'COIN', name: 'Coinbase', sector: 'Finance', exchange: 'NASDAQ', initialPrice: 200, volatility: 0.45, trend: 'cyclical', dividendYield: 0, eraAvailability: ['MODERN_ERA'], narrative: 'Crypto exchange. Rides the wild waves of cryptocurrency.' },
  { symbol: 'GME', name: 'GameStop', sector: 'Consumer Discretionary', exchange: 'NYSE', initialPrice: 25, volatility: 0.6, trend: 'cyclical', dividendYield: 0, eraAvailability: ['MODERN_ERA'], narrative: 'The original meme stock. Reddit vs Wall Street.' },
  { symbol: 'PLTR', name: 'Palantir', sector: 'Technology', exchange: 'NYSE', initialPrice: 22, volatility: 0.35, trend: 'bullish', dividendYield: 0, eraAvailability: ['MODERN_ERA'], narrative: 'Government AI and data analytics. Controversial but growing.' },
  { symbol: 'RIVN', name: 'Rivian', sector: 'Automotive', exchange: 'NASDAQ', initialPrice: 15, volatility: 0.45, trend: 'cyclical', dividendYield: 0, eraAvailability: ['MODERN_ERA'], narrative: 'Electric truck startup. High hopes, burning cash.' },
  { symbol: 'SOFI', name: 'SoFi Technologies', sector: 'Finance', exchange: 'NASDAQ', initialPrice: 10, volatility: 0.4, trend: 'bullish', dividendYield: 0, eraAvailability: ['MODERN_ERA'], narrative: 'Fintech disruptor. Digital banking for millennials.' },
]

export default stocksDatabase
