# MRT Responsive Prototype — Build Plan

## Context

This is a design prototype app to demo responsive table behavior. Arron will iteratively hand off Figma links for each piece of the UI. The app needs an app shell (sidebar nav + header + content area) with a breakpoint toggle overlay for testing responsive behavior across MUI breakpoints. Font Awesome icons (Regular + Solid) are used throughout. Code quality is "good enough to demo" — not production.

---

## Phase 1: App Shell Foundation

**Goal:** Replace the current smoke-test App.jsx with a CSS Grid app shell (sidebar + header + main content area).

### Files to create/modify:
- `index.html` — Add Font Awesome kit script tag
- `src/App.jsx` — Rewrite as app shell with CSS Grid layout
- `src/App.css` — Replace with app shell grid styles
- `src/components/AppShell.jsx` — Main layout wrapper (grid container)
- `src/components/AppShell.css` — Grid layout: sidebar | header / sidebar | content
- `src/components/Header.jsx` — Top bar placeholder (area: header)
- `src/components/Header.css` — Header styles

### Layout structure:
```
┌──────────┬──────────────────────────────┐
│          │         Header               │
│ Sidebar  ├──────────────────────────────┤
│  Nav     │                              │
│          │       Main Content           │
│          │                              │
└──────────┴──────────────────────────────┘
```

### CSS Grid approach:
```css
.app-shell {
  display: grid;
  height: 100vh;
  grid-template-areas:
    "sidebar header"
    "sidebar content";
  grid-template-rows: 56px 1fr;
  grid-template-columns: 260px 1fr;
}
```

### Mobile behavior:
- Below `md` (900px): sidebar collapses off-screen, hamburger in header toggles it as overlay
- Sidebar uses `position: fixed` + `transform: translateX(-100%)` on mobile

---

## Phase 2: Sidebar Navigation

**Goal:** Build sidebar nav component, ready to receive Figma designs.

### Files to create:
- `src/components/Sidebar.jsx` — Sidebar navigation component
- `src/components/Sidebar.css` — Sidebar styles (expanded, collapsed, mobile drawer states)

### Structure:
- Top: Logo / app name area
- Middle: Scrollable nav items (Font Awesome icons + labels)
- Bottom: User/settings area (placeholder)
- Nav items use `<button>` or `<a>` with Font Awesome `<i>` icons
- Placeholder nav items until Figma designs arrive:
  - Dashboard (`fa-solid fa-gauge`)
  - Reports (`fa-regular fa-file-lines`)
  - Tables (`fa-solid fa-table`)
  - Settings (`fa-solid fa-gear`)

### States:
- **Expanded** (desktop): 260px wide, icons + labels
- **Mobile drawer**: Fixed overlay with backdrop, slides from left

### Accessibility:
- `<nav aria-label="Main navigation">`
- `aria-current="page"` on active item
- Mobile drawer: focus trap, Escape to close, backdrop click to close

---

## Phase 3: Breakpoint Toggle Overlay

**Goal:** Floating overlay in bottom-right corner to resize the content viewport for breakpoint testing.

### Files to create:
- `src/components/BreakpointToggle.jsx` — Floating toggle UI
- `src/components/BreakpointToggle.css` — Positioning + styles

### MUI default breakpoints:
| Label | Width |
|-------|-------|
| xs | 0px (full reset) |
| sm | 600px |
| md | 900px |
| lg | 1200px |
| xl | 1536px |

### Approach:
- Fixed position bottom-right, floats above everything (`z-index: 9999`)
- Row of small pill buttons, one per breakpoint
- Clicking a breakpoint wraps the app content in a `max-width` container centered on screen with a visible border/frame, simulating that viewport width
- "Full" button resets to natural width
- Active breakpoint is visually highlighted
- The sidebar + header stay at natural width — only the **main content area** gets constrained (since that's what we're testing table responsiveness in)
- Alternative: constrain the entire app shell using `width` on a wrapper div so sidebar responsive behavior is also testable
- Uses CSS constraint approach (not `window.resizeTo()` which is unreliable)

### Design:
- Semi-transparent dark background pill bar
- Small text labels (xs, sm, md, lg, xl, Full)
- Current breakpoint highlighted with accent color
- Compact — doesn't interfere with content

---

## Phase 4: Figma Integration Workflow

**Goal:** Establish the pattern for receiving Figma designs and applying them.

### Workflow per Figma handoff:
1. Arron shares a Figma link
2. Claude uses `figma-console` MCP tools to read the design
3. Extract colors, spacing, typography from the design
4. Map Figma tokens to existing `palette.js` theme values
5. Implement the component matching the Figma layout
6. Iterate based on feedback

### Design token usage:
- Colors: reference `palette.js` values via MUI `theme.palette.*`
- Use `sx` prop or CSS with `var(--mui-palette-*)` CSS variables (since `cssVariables: true` is enabled in theme)

---

## Phase 5: Table Prototypes (Future)

**Goal:** The main content area will house responsive table experiments.

### Planned prototypes:
- **A: Column Hiding** — Progressive column visibility based on container width
- **B: Column Pinning** — Sticky first column with horizontal scroll
- **C: Card View** — Table transforms to stacked cards on mobile

Each prototype will be a separate route/view selectable from the sidebar nav. TanStack Table / MRT handles the table logic; responsive behavior is the focus.

---

## Implementation Order

1. Font Awesome in `index.html`
2. `AppShell` + CSS Grid layout
3. `Header` placeholder
4. `Sidebar` with placeholder nav items
5. `BreakpointToggle` overlay
6. Wire it all together in `App.jsx`
7. Await first Figma link for sidebar refinement

---

## Verification

- `npm run dev` — app loads with sidebar + header + content area
- Sidebar nav items visible with Font Awesome icons
- Breakpoint toggle appears bottom-right
- Clicking breakpoints constrains the layout to that width
- Below 900px: sidebar collapses, hamburger menu works
- Deploy with `npm run deploy` to verify on GitHub Pages
