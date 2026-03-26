# CLAUDE.md — MRT Prototypes

## Project Overview

Vite + React prototype app demonstrating responsive table strategies using Material React Table (MRT). Deployed to GitHub Pages for team review on real devices.

**This is a prototype, not production code.** Favor speed and clarity over production-grade patterns.

## Tech Stack

- **Vite 8** — build tool & dev server
- **React 19** — UI framework (JSX, no TypeScript)
- **Material React Table v3** — table library
- **MUI v7** (`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`) — component library
- **Emotion** (`@emotion/react`, `@emotion/styled`) — CSS-in-JS for MUI
- **React Router DOM v7** — client-side routing via `HashRouter`
- **Font Awesome** — icons loaded via kit in `index.html`
- **gh-pages** — deployment to GitHub Pages

## Commands

```bash
npm run dev        # Start dev server (localhost:5173)
npm run build      # Production build → dist/
npm run lint       # ESLint
npm run deploy     # Build + deploy to GitHub Pages
```

## Architecture

### Routing

- `HashRouter` (required for GitHub Pages — no server-side routing)
- Route config lives in `src/routes.jsx` as `STRATEGIES` array
- Each strategy = `{ id, path, label, shortLabel, icon, element }`
- Add a new strategy: one entry in `STRATEGIES` + one page component

### Layout

- `App.jsx` → `ThemeProvider` + `HashRouter` + `AppShell` + `BreakpointToggle`
- `AppShell` — CSS Grid layout with sidebar, header, main content
- `Sidebar` — collapsible nav with strategy links + placeholder nav groups
- `BreakpointToggle` — floating overlay (bottom-right) for resizing viewport during testing

### Styling

- **CSS files per component** (e.g., `Header.css`, `Sidebar.css`, `AppShell.css`)
- MUI theme in `src/theme/theme.js` with custom palette from `src/theme/palette.js`
- Font: **Figtree** (loaded from Google Fonts in `index.html`)
- No Tailwind, no CSS modules — plain CSS + MUI `sx` prop

### Icons

- **Font Awesome** (not MUI icons) — use `<i className="fa-regular fa-xxx" />` or `fa-solid`
- Kit loaded via script tag in `index.html`
- Active nav items swap `fa-regular` → `fa-solid`

### Data

- Mock data in `src/data/taskData.js`
- No API calls in production build (Anthropic proxy in vite.config.js is dev-only)

## Key Conventions

- **JSX** files (`.jsx`), not TypeScript
- **Functional components** with hooks
- Components in `src/components/`, pages in `src/pages/`
- MUI breakpoints: mobile ≤ 899px, desktop ≥ 900px, xl ≥ 1536px (sidebar auto-expand)
- `useMemo` for MRT column definitions
- No tests — this is a throwaway prototype

## Deployment

- **GitHub Pages** at `https://creecher.github.io/mrt-prototypes`
- `base: '/mrt-prototypes/'` in `vite.config.js` (required for asset paths)
- Git remote: `git@github-personal:creecher/mrt-prototypes.git`

## File Structure

```
src/
├── main.jsx                 # Entry point
├── App.jsx                  # Root: theme + router + shell
├── App.css
├── index.css
├── routes.jsx               # Strategy registry (sidebar + router source of truth)
├── components/
│   ├── AppShell.jsx/.css    # CSS Grid layout shell
│   ├── Header.jsx/.css
│   ├── Sidebar.jsx/.css     # Collapsible nav
│   ├── BreakpointToggle.jsx/.css
│   ├── RightSidebar.jsx/.css
│   ├── FiltersDrawer.jsx/.css
│   ├── CaseStatusDrawer.jsx/.css
│   ├── BulkEditActionBar.jsx/.css
│   └── BulkEditDrawer.jsx
├── pages/
│   ├── ColumnHidingPage.jsx/.css   # Strategy 1
│   └── ColumnPinningPage.css       # Strategy 2 (in progress)
├── data/
│   └── taskData.js          # Mock task data + status colors
├── theme/
│   ├── theme.js             # MUI createTheme config
│   ├── palette.js           # Color tokens
│   ├── checkboxCheckedIcon.jsx
│   └── checkboxIndeterminateIcon.jsx
├── lib/
│   └── anthropic.js         # Dev-only API helper
└── assets/
    └── hero.png, vite.svg, react.svg
```
