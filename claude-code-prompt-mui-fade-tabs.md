# Claude Code prompt — MUI fade + scroll tabs

## Task

Build a reusable `<ResponsiveTabs>` component that wraps MUI's `Tabs` with the **fade + scroll** responsive pattern. Replace MUI's default arrow scroll buttons with CSS gradient fade indicators on both ends of the tab list. The component must work for both horizontal (default) and vertical orientations, and collapse to a native `<Select>` on mobile.

---

## Requirements

### Core behaviour

- Use MUI `Tabs` with `variant="scrollable"` and `scrollButtons={false}` as the base
- Hide MUI's injected scroll button DOM entirely — do not render arrow buttons at any viewport width
- Apply a CSS `mask-image` (with `-webkit-` prefix) to the `.MuiTabs-scroller` element that fades the left and right edges when overflow is present
- The left fade must be invisible when scrolled to the start, and the right fade must be invisible when scrolled to the end — update dynamically on scroll
- On mobile (`max-width: 600px`), render a MUI `<Select>` instead of the tab bar — keep the tab panel rendering unchanged
- Support `orientation="vertical"` — on vertical, fades apply to top/bottom edges instead of left/right, and the mobile breakpoint collapses to a full-width stacked `<Select>` (same pattern)

### Props interface

```ts
interface ResponsiveTabsProps {
  tabs: { label: string; value: string; content: React.ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  fadeWidth?: number;       // px, default 40
  mobileBreakpoint?: number; // px, default 600
}
```

### Implementation notes

- Use `useRef` on the scroller element and a `scroll` event listener to track scroll position and update fade visibility
- Use `useResizeObserver` (or a `ResizeObserver` inside `useEffect`) to re-check overflow whenever the container resizes — this handles window resize and sidebar collapse transitions
- Use MUI's `useMediaQuery` hook for the mobile breakpoint check — do not use a CSS-only approach since we need to swap the rendered element
- Compute fade opacity as a boolean (fully visible or fully hidden) — do not animate the fade opacity, just toggle it cleanly
- The mask gradient should be: `linear-gradient(to right, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)` — adjust direction for vertical orientation
- When both edges have overflow, both fades are visible. When at start, left fade is hidden. When at end, right fade is hidden

### SCSS module (`ResponsiveTabs.module.scss`)

Create a companion SCSS module. Use `@use` (not `@import`). The module should:

- Define the fade mask as a Sass variable so `fadeWidth` can be passed in via a CSS custom property (`--fade-width: 40px`)
- Scope all overrides inside a `.root` class to avoid leaking into global MUI styles
- Include a `.scroller` class applied to the `.MuiTabs-scroller` slot using MUI's `slotProps` or `sx` — use the SCSS module class, not an inline `sx` string
- Add a `.selectFallback` class for the mobile `<Select>` that makes it full-width with consistent sizing

### Accessibility

- Preserve all MUI `Tabs` ARIA attributes — `role="tablist"`, `aria-selected`, keyboard arrow navigation
- The mobile `<Select>` must have a visually hidden `<label>` (use MUI's `InputLabel` with `sx={{ srOnly: true }}` or a CSS visually-hidden class) — do not use `aria-label` on the select itself as MUI's Select does not forward it reliably
- When orientation is vertical, ensure `aria-orientation="vertical"` is set on the `<Tabs>` element — MUI does this automatically when `orientation="vertical"` is passed

### File structure to create

```
src/
  components/
    ResponsiveTabs/
      ResponsiveTabs.tsx         ← main component
      ResponsiveTabs.module.scss ← scoped styles
      ResponsiveTabs.types.ts    ← exported prop types
      index.ts                   ← barrel export
      ResponsiveTabs.stories.tsx ← Storybook stories (if Storybook is present)
```


---

## Constraints

- MUI v5 or v6 (use whichever is already installed — check `package.json`)
- React 18+
- Do not install additional dependencies — use only what is already in `package.json`
- Do not use Tailwind — all styles go in the SCSS module
- Do not use `!important` in the SCSS — use MUI's `slotProps` or `.MuiTabs-root .MuiTabs-scroller` specificity to override defaults
- TypeScript strict mode — no `any`, all props fully typed

---

## Verification checklist

Before finishing, confirm:

- [ ] Arrow buttons are not rendered or visible at any viewport width
- [ ] Fades appear/disappear correctly when scrolling to start and end
- [ ] Keyboard navigation (arrow keys between tabs) still works
- [ ] `<Select>` renders at the configured mobile breakpoint and selecting an option updates the active tab panel
- [ ] Vertical orientation applies top/bottom fades, not left/right
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] No MUI prop-type warnings in console
