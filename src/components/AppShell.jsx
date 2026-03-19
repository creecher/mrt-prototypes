import { useState, useEffect, useRef, useCallback } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import './AppShell.css'

export default function AppShell({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(() => window.matchMedia('(min-width: 1536px)').matches)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('home')
  const [suppressTransition, setSuppressTransition] = useState(false)
  const wasMobileRef = useRef(window.matchMedia('(max-width: 899px)').matches)

  // Auto-collapse/expand based on breakpoint, suppress transitions on mobile crossover
  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 899px)')
    const xlQuery = window.matchMedia('(min-width: 1536px)')

    const handleMobileChange = (e) => {
      if (e.matches) {
        // Entering mobile: close drawer and suppress transition to prevent flash
        setMobileOpen(false)
        setSuppressTransition(true)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setSuppressTransition(false))
        })
      } else {
        // Leaving mobile: auto-set expanded based on xl breakpoint
        setSidebarExpanded(xlQuery.matches)
        setSuppressTransition(true)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setSuppressTransition(false))
        })
      }
      wasMobileRef.current = e.matches
    }

    const handleXlChange = (e) => {
      // Only adjust when not in mobile mode
      if (!mobileQuery.matches) {
        setSidebarExpanded(e.matches)
      }
    }

    mobileQuery.addEventListener('change', handleMobileChange)
    xlQuery.addEventListener('change', handleXlChange)

    return () => {
      mobileQuery.removeEventListener('change', handleMobileChange)
      xlQuery.removeEventListener('change', handleXlChange)
    }
  }, [])

  const handleToggleExpanded = useCallback(() => setSidebarExpanded(prev => !prev), [])
  const handleCloseMobile = useCallback(() => setMobileOpen(false), [])
  const handleMenuClick = useCallback(() => setMobileOpen(prev => !prev), [])

  return (
    <div className={`app-shell ${sidebarExpanded ? 'app-shell--expanded' : 'app-shell--collapsed'} ${suppressTransition ? 'app-shell--no-transition' : ''}`}>
      <Sidebar
        expanded={sidebarExpanded}
        onToggleExpanded={handleToggleExpanded}
        mobileOpen={mobileOpen}
        onCloseMobile={handleCloseMobile}
        suppressTransition={suppressTransition}
        activeItem={activeItem}
        onNavigate={setActiveItem}
      />
      <Header onMenuClick={handleMenuClick} />
      <main className="app-shell__content">
        <div className="app-shell__surface">
          {children}
        </div>
      </main>
    </div>
  )
}
