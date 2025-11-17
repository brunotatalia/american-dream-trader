# American Dream Trader - Changelog

## v0.2.0 - Roaring Twenties Complete (2025-11-11)

### 🎮 Major Features

#### Fully Playable Roaring Twenties Era (1920-1929)
- **Era Selection System**: Beautiful modal with detailed era profiles
- **Welcome Screen**: Contextual introduction to each era with economic backdrop
- **Interactive Tutorial**: 6-step guided tour (can be replayed from help button)
- **Time Management**: Pause/Resume and speed controls (Slow/Normal/Fast)
- **Persistent State**: All progress auto-saved to localStorage

### 💼 Jobs & Mini-Games

#### 5 Working Mini-Games
1. **Assembly Line** (Factory Worker, Dock Worker)
   - 30-second color-matching challenge
   - Performance bonuses up to +25%
   - Base pay: $25-32

2. **Typing Challenge** (Secretary)
   - 60-second WPM test
   - Accuracy and speed tracking
   - Base pay: $40

3. **Calculator** (Bank Teller, Accountant)
   - 45-second math quiz
   - Addition, subtraction, multiplication
   - Base pay: $38-50

4. **Delivery Route** (Delivery Driver, Bootleg Runner)
   - 40-second route optimization
   - Visual map with efficiency scoring
   - Base pay: $20-55

5. **Construction** (Construction Worker)
   - 35-second block stacking
   - Penalty for mistakes
   - Base pay: $25-28

#### Jobs Database
- 10 Roaring Twenties professions
- Blue collar, white collar, and gig categories
- Experience gain system
- Era-specific availability filtering

### 📈 Trading System

#### Stocks (20 Companies)
- General Motors, Ford, Chrysler
- US Steel, Bethlehem Steel
- AT&T, RCA, GE, Westinghouse
- DuPont, Anaconda Copper
- Woolworth, Sears Roebuck
- Standard Oil, Gulf Oil
- Pennsylvania Railroad, Pullman
- Pfizer, National Biscuit

**Features:**
- Real-time price simulation
- Buy/Sell orders with modals
- Portfolio tracking with live P&L
- Transaction history
- Price change indicators (% and color-coded)
- $10 commission per trade

#### Commodities (10+ Items)
- **Agriculture**: Wheat ($1.45), Corn ($0.82), Cotton ($12.50), Coffee ($0.22)
- **Energy**: Crude Oil ($1.88), Coal ($4.20)
- **Metals**: Gold ($20.67), Silver ($0.58), Copper ($0.14)
- **Livestock**: Cattle ($8.50), Hogs ($7.20)

**Features:**
- Tabbed interface (Stocks / Commodities / Options)
- Full buy/sell functionality
- Historical 1920s pricing
- Sector-based categorization

### 🏠 Real Estate

#### 15+ Properties Available
- **Residential**: Studios ($5K), Apartments ($8-15K), Townhouses ($18K), Homes ($12-35K)
- **Commercial**: Retail ($50K), Offices ($75K), Warehouses ($40K)
- **Premium**: Estates ($120-150K), Beachfront ($200K)

**Features:**
- Down payment system (20-30%)
- Mortgage calculation (6% interest, 30-year terms)
- Monthly rent collection (auto-triggered)
- Property appreciation (monthly updates)
- Detailed property modals with all metrics
- Tenant reliability simulation (85% payment rate)

### 🎰 Casino Games

#### 3 Fully Playable Games
1. **Slot Machine**
   - 3-reel classic with 5 symbols
   - Weighted probabilities
   - Payouts up to 100x
   - Minimum bet: $5

2. **European Roulette**
   - 37-number wheel (0-36)
   - 9 bet types (Red/Black, Even/Odd, Dozens, etc.)
   - Proper payouts (1:1 to 2:1)
   - 2.7% house edge
   - Minimum bet: $10

3. **Blackjack**
   - Standard rules (dealer stands on 17)
   - Hit/Stand decisions
   - Blackjack pays 3:2
   - Visual card display with suits
   - Minimum bet: $10

### ⚙️ Game Systems

#### Market Simulation Engine
- **Price Movement**: Geometric Brownian motion algorithm
- **Economic Factors**: GDP, unemployment, inflation correlation
- **Mean Reversion**: Prevents infinite price drift
- **Era Volatility**: Adjustable multiplier (1.3x for Roaring Twenties)
- **Daily Updates**: All prices recalculate automatically
- **History Tracking**: 1 year of price data stored per asset

#### Event System
- **Historical Events**: Date-triggered (Black Thursday Oct 24, 1929)
- **Random Events**: Daily probability rolls for market/personal/opportunity
- **Impact Application**: Stocks, real estate, jobs all affected
- **Toast Notifications**: Immediate player feedback

#### Game Loop
- Runs on every game day advance
- Updates market prices across all assets
- Checks for historical events
- Triggers random events
- Collects rent monthly
- Appreciates properties monthly
- No performance impact (optimized selectors)

### 🎨 UI/UX Improvements

#### Navigation & Layout
- Responsive sidebar (desktop) and bottom nav (mobile)
- Era badge in TopBar
- Help button to replay tutorial
- Toast notification container
- Smooth page transitions

#### Components Enhanced
- **Dashboard**: Portfolio breakdown, era card, days survived counter
- **Trading Hub**: Tabbed interface, interactive tables, buy/sell modals
- **Jobs Hub**: Era-filtered jobs, mini-game launcher, earnings feedback
- **Real Estate Hub**: Property listings, purchase modals, portfolio view
- **Casino Hub**: Game selector tabs, individual game components

#### Design Polish
- Color-coded P&L (green/red for gains/losses)
- Loading states and spinners
- Empty state messaging
- Form validation feedback
- Hover effects and transitions
- Accessibility improvements

### 🔧 Technical Improvements

#### Code Quality
- ESLint flat config with React/import/a11y plugins
- Prettier formatting enforced
- All imports alphabetized and grouped
- No lint warnings or errors
- Proper component composition

#### Performance
- Zustand selectors prevent unnecessary re-renders
- Memoized calculations in hooks
- Efficient price update batching
- LocalStorage persistence optimized

#### Data Architecture
- 20+ stocks with full metadata
- 10+ commodities with historical prices
- 15+ properties with rental/appreciation data
- 10 jobs with mini-game mappings
- Event database with impacts
- All data embedded (no API calls)

### 📱 Platform Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (responsive design)
- ✅ Works 100% offline after initial load

### 🐛 Bug Fixes

- Fixed missing default exports for Table and Tabs
- Added prices to all commodities
- Fixed import ordering for ESLint
- Removed unused variables
- Added proper JSX parsing to ESLint config
- Fixed portfolio value calculation in Dashboard

### 📚 Documentation

- Updated README with play instructions
- Created ROARING_TWENTIES_COMPLETE.md
- Added inline code comments
- Documented game mechanics in DEVELOPMENT.md

---

## v0.1.0 - Foundation (2025-11-11)

### Initial Release
- Project scaffolding with Vite + React 19
- Tailwind CSS 3.4 with custom theme
- Zustand state management setup
- React Router v7 navigation
- Component library (Button, Card, Modal, etc.)
- Basic folder structure
- ESLint + Prettier configuration
- Vitest testing framework

---

## What's Next

### Phase 2 Priorities
- [ ] Add remaining mini-games (Word Scramble, Rhythm, Negotiation)
- [ ] Implement Poker and Horse Racing
- [ ] Create achievement system
- [ ] Add skill progression trees
- [ ] Expand random events variety

### Phase 3 - Additional Eras
- [ ] Great Depression (1930-1939)
- [ ] Post-WWII Boom (1945-1959)
- [ ] Turbulent 70s (1970-1979)
- [ ] Dot-Com Era (1995-2000)
- [ ] Modern Era (2010-2020)

### Phase 4 - Advanced Features
- [ ] Options trading with Greeks
- [ ] Leverage and margin system
- [ ] Loan application and credit score
- [ ] Business ownership
- [ ] Multiplayer leaderboards (optional)

---

**Total Lines of Code:** ~6,000+  
**Components Built:** 50+  
**Data Entries:** 100+  
**Mini-Games:** 5 playable  
**Casino Games:** 3 playable

