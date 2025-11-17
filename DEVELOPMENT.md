# Development Notes

This document tracks implementation details and conventions for the American Dream Trader rebuild.

## Architecture Overview

- **State Management**: Zustand stores live in `src/stores/`. Each store uses the `persist` middleware to sync critical slices into `localStorage`. Hooks inside `src/hooks/` provide memoized selectors and domain-specific helpers.
- **Routing**: React Router v7 powers navigation. `App.jsx` defines a layout route with `GameLayout` (TopBar + Sidebar + BottomNav) and child routes for each game pillar.
- **Styling & Theming**: Tailwind CSS is configured with design tokens aligned to the Apple-inspired spec. Global styles live in `src/styles/globals.css` and `themes.css` to support future light/dark theming.
- **Data**: Historical and configuration data is embedded under `src/data/` and `src/config/`. These modules export plain JS payloads to keep the project offline-first.
- **Utilities**: Reusable calculations, formatters, and the save-game manager are in `src/utils/`.

## Time System (Phase 1.2 Roadmap)

- `useGameStore` exposes `advanceDay`, `setTimeSpeed`, and `togglePause`.
- `useTime` hook sets up the interval loop and exposes helpers for UI controls.
- Future steps: emit domain events (markets, jobs, properties) within `advanceDay` and integrate event dispatchers.

## Persistence Strategy

- Each store defines a `partialize` policy to avoid bloated saves.
- `SaveGameManager` provides manual save slot support. Integrate this with a future save/load UI and periodic auto-save.

## Testing

- Vitest is configured with a `jsdom` environment via `vite.config.js` and `src/test/setupTests.js`.
- Add targeted tests alongside components and hooks (`*.test.jsx/js`).

## Coding Standards

- Use named exports for data/config modules.
- Favor composition in components, keeping domain logic inside hooks/stores.
- Keep files ASCII-only unless dealing with localized content.
- Run `npm run lint` and `npm run format` before committing significant changes.

## Outstanding Tasks

- Replace placeholder components with gameplay implementations (see roadmap).
- Expand datasets with complete historical details for all eras.
- Add animation presets (Framer Motion) and micro-interactions to key components.
- Implement notification surface using `Toast` component and `useNotifications` store.
- Evaluate adding Storybook or Ladle for UI component development.
