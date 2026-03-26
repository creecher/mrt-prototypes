import ColumnHidingPage from './pages/ColumnHidingPage'
import ColumnPinningPage from './pages/ColumnPinningPage'
import DetailPanelPage from './pages/DetailPanelPage'

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
  {
    id: 'column-pinning',
    path: '/strategy/column-pinning',
    label: 'Strategy 2: Horizontal Scroll + Column Pinning',
    shortLabel: 'Column Pinning',
    icon: 'fa-regular fa-thumbtack',
    element: <ColumnPinningPage />,
  },
  {
    id: 'detail-panel',
    path: '/strategy/detail-panel',
    label: 'Strategy 3: Responsive Detail Panel',
    shortLabel: 'Detail Panel',
    icon: 'fa-regular fa-rectangle-vertical-history',
    element: <DetailPanelPage />,
  },
]
