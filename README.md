# American Dream Trader

American Dream Trader is a browser-based historical economic simulation game. This repository contains the rebuilt foundation of the application using React 19, Vite, Tailwind CSS, and Zustand. The goal is to deliver an offline-first experience with rich simulation systems that span employment, trading, real estate, banking, and entertainment venues.

## Tech Stack

- React 19 with React Router v7
- Vite 7 for bundling and dev tooling
- Tailwind CSS 3.4 with custom design tokens
- Zustand for state management with persistence
- Framer Motion, Recharts, Lucide React for UI polish
- Vitest + Testing Library for automated tests
- ESLint (flat config) + Prettier for code quality

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server (http://localhost:5173 by default)
npm run dev

# Run tests
npm test

# Lint and format
npm run lint
npm run format
```

> **Note**: React Router v7 and Vite 7 target Node 20+. The current environment is Node 18, so you may see `EBADENGINE` warnings during install. Upgrade Node when possible to ensure full compatibility.

## Project Structure

```
src/
├── components/
│   ├── core/              # Layout shell (TopBar, Sidebar, BottomNav)
│   ├── dashboard/         # Dashboard widgets and cards
│   ├── jobs/              # Jobs hub and mini-game stubs
│   ├── trading/           # Trading hub and future panels
│   ├── real-estate/       # Property management UI
│   ├── banking/           # Banking and loans UI
│   ├── casino/            # Casino experiences
│   └── ui/                # Design system primitives (Button, Card, etc.)
├── config/                # Game configuration modules
├── constants/             # Shared constants for time, UI, finance
├── data/                  # Embedded game datasets
├── hooks/                 # Zustand-powered hooks (game, player, market, etc.)
├── stores/                # Zustand stores with persistence
├── styles/                # Global Tailwind styles and theme variables
├── test/                  # Vitest setup
└── utils/                 # Financial/math helpers, save-game manager, etc.
```

## Current Status: Roaring Twenties Era PLAYABLE! 🎉

### What Works Right Now

✅ **Complete Roaring Twenties Experience (1920-1929)**
- Era selection with rich historical context
- Interactive tutorial and welcome screens
- Working time system with pause/speed controls
- 10 era-specific jobs with 2 playable mini-games (Assembly Line, Typing)
- 20+ stocks with real-time price simulation
- 13 commodities across agriculture, energy, metals, livestock
- 15+ real estate properties with purchase/rent/appreciation mechanics
- Slot machine casino game (fully functional)
- Toast notification system with success/error feedback
- Persistent state (all progress saved to localStorage)

✅ **Operational Game Systems**
- Market price simulator (geometric Brownian motion + economic indicators)
- Trading engine (buy/sell orders, portfolio P&L, transaction history)
- Real estate engine (purchases, mortgages, rent collection, appreciation)
- Event system (historical + random events with impacts)
- Game loop (daily updates, monthly rent, event triggers)

✅ **Professional UI/UX**
- Apple-inspired design system
- Responsive layouts (mobile/tablet/desktop)
- Interactive modals, tables, charts
- Smooth animations and transitions
- Accessible keyboard navigation

### How to Play

```bash
npm run dev
# Open http://localhost:5173
# Select "The Roaring Twenties"
# Complete tutorial (or skip)
# Start working jobs, trading stocks, buying property!
```

**Pro Tips:**
- Start with jobs to build capital
- Buy GM stock early (it's bullish in the 1920s)
- Save for a Brooklyn apartment ($5,000)
- Watch out for Black Thursday in October 1929!

## Next Steps

### Immediate Priorities
- Add remaining mini-games (Calculator, Delivery, Construction)
- Implement Roulette and Blackjack
- Add achievement system and skill progression
- Expand random events variety
- Create more visual feedback for market movements

### Future Eras
- Replicate Roaring Twenties blueprint for remaining 5 eras
- Era transition mechanics
- Cross-era progression and legacy systems

See `ROARING_TWENTIES_COMPLETE.md` for detailed feature breakdown.

## License

This project is proprietary and intended for internal development of the American Dream Trader experience.
