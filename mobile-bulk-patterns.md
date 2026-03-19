# Mobile bulk actions on card views: a complete pattern guide

**A sticky bottom action bar combined with an explicit "Select" mode toggle is the strongest pattern for mobile bulk actions on card-based data tables.** This approach — used by Gmail, Apple Mail, Google Drive, and Outlook — keeps actions in the thumb zone, avoids the discoverability problems of hidden gestures, and scales to complex action types like assignment pickers and status changes. The research below synthesizes patterns from 12+ major apps, WCAG 2.2 accessibility standards, Material Design and Apple HIG guidelines, and React component library capabilities into a practical implementation blueprint.

Your current floating bar pattern fails on mobile for three interconnected reasons: it obscures cards, checkboxes create competing tap zones on narrow cards, and the bar likely violates WCAG tap-target minimums. Each of these has well-established solutions.

---

## Where the bulk action bar should live on mobile

**The bottom sticky bar is the dominant production pattern and the right default choice.** Gmail, Google Sheets, Microsoft Outlook, Apple Mail, and Todoist all anchor bulk actions at or near the bottom of the viewport on mobile. This works because the bottom third of the screen sits in the natural thumb zone for one-handed use — users don't have to reach across a 6.7-inch display to hit "Delete."

Three positioning options exist, each with a clear use case:

- **Bottom sticky bar** (recommended default): Fixed to viewport bottom, persistent while scrolling. Best for 2–4 primary actions. Slides up with a `translateY` animation when selection count > 0. This is what you should use for delete/archive and as a launching point for more complex actions.
- **Contextual top bar** (Material Design CAB): Replaces/transforms the existing header to show `[✕ close] [count] [action icons] [⋮ overflow]`. Gmail Android does this. Strong for apps already following Material Design, but **ergonomically poor on phones over 5.5 inches** because it forces upward reaches. Note that iOS convention places toolbars at the bottom — Apple HIG explicitly states "In iOS, a toolbar appears at the bottom of a screen."
- **Bottom sheet**: Slides up as a modal drawer for complex sub-flows. Best reserved for actions requiring sub-selection (tag picker, assignee search, status list) rather than as the primary action surface. Overkill for simple delete/archive.

**The strongest hybrid approach**: use a slim bottom sticky bar for the selection count and 2–3 primary action buttons, with a "More" overflow that opens a bottom sheet for secondary or complex actions. This gives zero-tap access to frequent actions and one-tap access to everything else.

### Tap target sizes: the exact numbers

WCAG 2.2 introduced a critical new criterion. **WCAG 2.5.8 (Target Size Minimum, AA) requires 24 × 24 CSS pixels minimum**, with at least 24px spacing from adjacent targets if undersized. **WCAG 2.5.5 (Target Size Enhanced, AAA) requires 44 × 44 CSS pixels** — matching Apple's HIG recommendation. Material Design goes further at **48 × 48 dp with 8dp gaps**.

For a bulk action bar containing 3–5 buttons, target **48 × 48px per button with 8–12px gaps** to satisfy all three guidelines simultaneously. On screens narrower than 360px, switch to icon-only buttons (hiding text labels) while maintaining the 48px touch target via padding around a 24px icon.

---

## Selection should be a distinct mode, not always-visible checkboxes

**Always-visible checkboxes on mobile cards are an anti-pattern.** Material Design explicitly advises against it: "Avoid persistently displaying checkboxes as part of each item." On a narrow mobile card, a 44px checkbox creates a competing tap zone — users intending to open a card's detail view accidentally select it, and vice versa. The checkbox also consumes scarce horizontal space on every card, even though selection is a secondary action used perhaps 5% of the time.

The industry has converged on two entry points into a **distinct selection mode**, often offered together:

**The "Select" button** (Apple's canonical pattern) provides maximum discoverability. Apple Mail, iOS Files, Apple Photos, and Todoist all place an "Edit" or "Select" button in the navigation bar. Tapping it transitions the entire UI: checkboxes animate in on each card, the header transforms, and card taps now toggle selection instead of navigating. A "Done" button exits the mode. This pattern requires two taps to begin selecting (button → first item) but eliminates any confusion about what tapping a card does.

**Long-press** (Google's canonical pattern) offers a faster entry for power users. Gmail, Google Drive, Google Photos, and Outlook all use long-press on any item to instantly enter selection mode and select that item. Subsequent items are selected with a single tap. The tradeoff is discoverability — there is no visual indicator that long-press does anything until the user tries it.

**The recommended approach for a web app: offer both.** Place a "Select" text button in the top bar (or behind a `⋮` overflow menu if space is tight), and also support long-press as an undocumented accelerator. This satisfies both novice and power users.

### What the major apps actually do

| App | Entry to selection mode | Additional selections | Checkbox location | Bulk actions location |
|-----|------------------------|----------------------|-------------------|---------------------|
| **Gmail** | Long-press OR tap sender avatar | Single tap | Overlays sender avatar (left) | Top contextual bar |
| **Apple Mail** | "Edit" button (top right) | Tap circular radio buttons | Left side (hidden until Edit mode) | Bottom toolbar |
| **Google Drive** | Long-press | Single tap | Overlays file thumbnail | Top contextual bar |
| **Outlook** | Long-press OR tap avatar circle | Single tap; long-press + drag for range | Left circle (dual-purpose) | Bottom-right toolbar |
| **iOS Files** | "Select" button | Single tap | Left circles (hidden until Select) | Bottom toolbar |
| **Todoist** | Long-press context menu OR menu → "Select tasks" | Single tap (highlight change) | No separate checkbox; background highlight | Bottom toolbar |

**Notably absent from mobile**: Notion, Airtable, Linear, and Trello offer **no multi-select on mobile at all**. These desktop-first products have not solved the problem — which confirms that mobile bulk selection is genuinely hard and worth getting right. Asana only shipped iOS multi-select in mid-2024 after years of user requests.

---

## How each action type should work from the bulk bar

The three action categories require fundamentally different interaction flows. Cramming them all into identical buttons is a mistake — each needs a UI pattern matched to its complexity.

### Delete and archive: act first, offer undo

**The undo snackbar pattern is the gold standard for bulk delete/archive on mobile.** Gmail popularized this: the action executes immediately, items vanish with animation, and a snackbar appears at the bottom for ~8 seconds reading "X conversations archived — Undo." This is faster than a confirmation dialog (one tap vs. two), less disruptive, and works because these operations are almost always reversible (items go to trash/archive for 30 days).

Reserve confirmation dialogs exclusively for **permanent, irreversible bulk deletions** — say, purging items from trash or deleting shared resources that affect other users. Use `role="alertdialog"` for accessibility and require an explicit "Delete permanently" button (never just "OK"). For the confirmation dialog, Cloudscape (AWS) recommends stating consequences clearly with a warning alert and never using a popover.

Visually, place the delete button in **red/destructive color** and position it at the far right of the action bar or behind the overflow menu to reduce accidental taps. Always pair the icon with a text label on mobile — a lone trash icon is ambiguous.

### Assign and tag: bottom sheet with searchable list

When the user taps "Assign" or "Tag" from the bulk bar, open a **modal bottom sheet** containing a search input at top, a scrollable list of options with checkboxes (for tags) or radio buttons (for single assignee), and an "Apply" button at bottom. This provides the space needed for long lists, keeps context visible behind the scrim, and matches the mental model of picking from a catalog.

For **mixed state** (selected items have different existing assignments), show tags in three states: ✓ (all items have it), indeterminate dash (some items), and empty (no items). Tapping an indeterminate tag should apply it to all selected items. For assignees, display "Multiple assignees" as a placeholder and let the new selection replace all. A summary line like "3 assigned to Alice, 2 to Bob" helps users understand the current state before acting.

For the tag picker specifically, use a **chip/badge UI** for selected tags with ✕ to remove, search-as-you-type filtering, and a "Create new tag" option at the bottom when no match is found. The `Command` component from shadcn/ui (based on cmdk) is ideal for this searchable list pattern.

### Status changes: short bottom sheet with large tap targets

**A short bottom sheet with 3–6 status options as large, tappable rows** is the cleanest pattern. Each row should include a colored dot or icon indicating the status, the status name, and the full row should be tappable (not just the text). For 2–3 statuses, a segmented control can work, but it breaks down with more options.

When selected items have mixed statuses, show the distribution at the top of the sheet: "3 Open, 2 In Progress, 1 Done." Apply the change immediately on tap (no "Apply" button needed for single-select). Show an undo snackbar after the change completes.

---

## Preventing the bar from covering card content

A `position: fixed; bottom: 0` bar is removed from document flow, so the list doesn't know it exists. The last 1–3 cards will be hidden behind it unless you compensate. Three CSS techniques solve this:

**Dynamic bottom padding** is the most reliable approach. When the selection count crosses from 0 to 1 (bar appears), add padding to the list container equal to the bar height plus safe area insets plus breathing room:

```css
.card-list.has-bulk-actions {
  padding-bottom: calc(
    var(--bulk-bar-height, 64px)
    + env(safe-area-inset-bottom, 0px)
    + 16px
  );
  transition: padding-bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**`scroll-padding-bottom`** ensures that keyboard-focused items don't land behind the bar — critical for **WCAG 2.4.11 (Focus Not Obscured)**:

```css
.card-list.has-bulk-actions {
  scroll-padding-bottom: calc(var(--bulk-bar-height) + env(safe-area-inset-bottom, 0px));
}
```

**Safe area insets** handle the iOS home indicator (~34px on iPhone X and later) and must be paired with `viewport-fit=cover` in the meta tag:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

```css
.bulk-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 16px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
  min-height: 56px;
  z-index: 200;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.bulk-action-bar.visible {
  transform: translateY(0);
}
```

If your app has **bottom navigation tabs**, either stack the bulk bar above them (`bottom: calc(56px + env(safe-area-inset-bottom))`) or **replace** the bottom nav content with bulk actions while selection is active — Gmail and Google Drive both use this replacement pattern for a cleaner result. Hide any FAB during selection mode with `transform: scale(0)` to prevent z-index collisions.

Also handle the virtual keyboard: when a search input inside a bottom sheet is focused, the keyboard can take 60% of the screen. Use `@media (max-height: 500px)` to collapse or reposition the bar when the keyboard is likely open.

---

## The recommended React component stack

After evaluating eight libraries, **shadcn/ui + TanStack Table + Vaul** provides the most complete and customizable foundation for this specific problem.

**TanStack Table (React Table v8)** handles all selection logic as a headless library. Because it's completely UI-agnostic, the same `useReactTable` instance with `rowSelection` state powers both your desktop table and mobile card grid — you just render different markup:

```tsx
const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
const table = useReactTable({
  data, columns,
  state: { rowSelection },
  onRowSelectionChange: setRowSelection,
  enableRowSelection: true,
  getCoreRowModel: getCoreRowModel(),
});

// Responsive rendering with shared selection state
{isMobile ? <CardGrid table={table} /> : <DataTable table={table} />}
```

**shadcn/ui** provides the UI components: `Checkbox` (Radix-based, supports indeterminate state) for selection indicators, `Drawer` (Vaul-based) for mobile bottom sheets with snap points and touch gestures, `AlertDialog` for destructive confirmation, `Command` (cmdk-based) for searchable assign/tag pickers, and `Sonner` for undo toast notifications. All components inherit Radix's strong accessibility (ARIA roles, focus trapping, keyboard navigation).

**For maximum accessibility**, consider **React Aria's `GridList`** as an alternative to custom card rendering. It offers `selectionMode="multiple"` with `layout="grid"` for card grids, automatic touch-vs-pointer behavior adaptation (long-press to select on touch), and ARIA live region announcements for selection changes — all tested across screen readers and devices. The tradeoff is less styling flexibility than the headless approach.

| Concern | Recommended component |
|---------|---------------------|
| Selection state management | TanStack Table `rowSelection` |
| Card/table responsive switch | Custom, using shared TanStack Table instance |
| Mobile bottom sheet | Vaul (via shadcn `Drawer`) |
| Searchable picker (assign/tag) | cmdk (via shadcn `Command`) inside `Drawer` |
| Destructive confirmation | Radix AlertDialog (via shadcn `AlertDialog`) |
| Undo toast | Sonner (via shadcn) |
| Accessible grid selection | React Aria `GridList` with `layout="grid"` |

**PatternFly** (Red Hat) deserves mention as the only library with a dedicated bulk selection pattern supporting table, list, and card views out of the box — with three-state selection (none, partial, all) and a toolbar alert for selection count. It's opinionated and heavier, but it solves the entire problem in one package if its visual style fits your app.

---

## Conclusion: the complete pattern in sequence

The optimal mobile bulk action flow chains these patterns together. The user sees a clean card list with no checkboxes. They tap "Select" in the header (or long-press a card). Checkboxes animate in on each card's left edge, the header transforms to show a close button and selection count, and tapping cards now toggles selection. A slim sticky bottom bar slides up showing the count and 2–3 primary action buttons (Archive, Delete in red, and a "More" overflow). Tapping Archive executes immediately and shows an undo snackbar for 8 seconds. Tapping "More" opens a bottom sheet with Assign (searchable list), Tag (multi-select with chips), and Change Status (large tappable rows with color indicators). The list has dynamic bottom padding so no cards hide behind the bar, and all buttons meet the **48 × 48px** touch target with **8px gaps**.

This is not speculative design. It is a synthesis of patterns shipping today in Gmail, Apple Mail, Google Drive, and Outlook, built on WCAG 2.2 requirements and implementable with TanStack Table, shadcn/ui, and Vaul. The key insight across all the research: **mobile bulk actions succeed when selection is an explicit mode with dramatic visual feedback, actions live in the thumb zone, and complex sub-flows get their own surface (bottom sheet) rather than being crammed into a toolbar.**