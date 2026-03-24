import ColumnHidingPage from './pages/ColumnHidingPage'

/**
 * Strategy registry — single source of truth for sidebar nav + router.
 * Add a new strategy: one entry here + one page component.
 */
export const STRATEGIES = [
  {
    id: 'column-hiding',
    path: '/strategy/column-hiding',
    label: 'Strategy 1: Column Hiding by Breakpoint',
    shortLabel: 'Column Hiding',
    icon: 'fa-regular fa-columns-3',
    element: <ColumnHidingPage />,
  },
]
