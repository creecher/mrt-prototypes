import { useEffect, useRef, useSyncExternalStore } from 'react'
import { NavLink } from 'react-router-dom'
import { STRATEGIES } from '../routes'
import './Sidebar.css'

const NAV_GROUPS = [
  {
    id: 'client-care',
    label: 'Client care',
    items: [
      { id: 'clients', label: 'Clients', icon: 'fa-regular fa-people-group' },
      { id: 'referrals', label: 'Referrals', icon: 'fa-regular fa-user-chart' },
      { id: 'cases', label: 'Cases', icon: 'fa-regular fa-folder-open' },
      { id: 'tasks', label: 'Tasks', icon: 'fa-regular fa-list-check' },
      { id: 'medical', label: 'Medical', icon: 'fa-regular fa-clipboard-medical' },
      { id: 'groups', label: 'Groups', icon: 'fa-regular fa-people-roof' },
      { id: 'appointments', label: 'Appointments', icon: 'fa-regular fa-calendar-check' },
      { id: 'outreach', label: 'Outreach', icon: 'fa-regular fa-phone-arrow-up' },
    ],
  },
  {
    id: 'beds',
    label: 'Beds',
    items: [
      { id: 'beds', label: 'Beds', icon: 'fa-regular fa-bed' },
    ],
  },
  {
    id: 'crisis-dispatch',
    label: 'Crisis dispatch',
    items: [
      { id: 'dispatch', label: 'Dispatch', icon: 'fa-regular fa-car' },
    ],
  },
  {
    id: 'team',
    label: 'Team',
    items: [
      { id: 'schedule', label: 'Schedule', icon: 'fa-regular fa-calendar-lines-pen' },
      { id: 'meetings', label: 'Meetings', icon: 'fa-regular fa-calendar' },
      { id: 'staff', label: 'Staff', icon: 'fa-regular fa-address-book' },
      { id: 'teams', label: 'Teams', icon: 'fa-regular fa-users-medical' },
      { id: 'reporting', label: 'Reporting', icon: 'fa-regular fa-chart-mixed' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    items: [
      { id: 'task-templates', label: 'Task templates', icon: 'fa-regular fa-list-check' },
      { id: 'sites', label: 'Sites', icon: 'fa-regular fa-buildings' },
    ],
  },
  {
    id: 'financial',
    label: 'Financial',
    items: [
      { id: 'billing', label: 'Billing', icon: 'fa-regular fa-file-invoice-dollar' },
    ],
  },
]

const mobileQuery = typeof window !== 'undefined' ? window.matchMedia('(max-width: 899px)') : null
const subscribeMobile = (cb) => { mobileQuery?.addEventListener('change', cb); return () => mobileQuery?.removeEventListener('change', cb) }
const getMobileSnapshot = () => mobileQuery?.matches ?? false

export default function Sidebar({ expanded, onToggleExpanded, mobileOpen, onCloseMobile, suppressTransition }) {
  const sidebarRef = useRef(null)
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot)
  // Mobile drawer always renders expanded (with labels), desktop uses the expanded prop
  const showExpanded = isMobile || expanded

  // Close mobile sidebar on Escape
  useEffect(() => {
    if (!mobileOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onCloseMobile()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [mobileOpen, onCloseMobile])

  // Focus first item when mobile sidebar opens
  useEffect(() => {
    if (!mobileOpen || !sidebarRef.current) return
    const focusable = Array.from(sidebarRef.current.querySelectorAll('button, a, [tabindex]'))
      .filter((el) => el instanceof HTMLElement && el.offsetParent !== null)
    if (focusable.length) focusable[0].focus()
  }, [mobileOpen])

  const handleNavClick = () => {
    if (mobileOpen) onCloseMobile()
  }

  return (
    <>
      <div
        className={`sidebar-backdrop ${mobileOpen ? 'sidebar-backdrop--visible' : ''}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside
        ref={sidebarRef}
        className={`sidebar ${showExpanded ? 'sidebar--expanded' : 'sidebar--collapsed'} ${mobileOpen ? 'sidebar--mobile-open' : ''} ${suppressTransition ? 'sidebar--no-transition' : ''}`}
      >
        {mobileOpen && (
          <button
            className="sidebar__close-btn"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}

        {/* Logo */}
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <i className="fa-solid fa-flask" />
          </div>
          {showExpanded && (
            <span className="sidebar__logo-text">App Name</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav" aria-label="Main navigation">
          {/* Top group: toggle + home */}
          <div className="sidebar__group">
            <button
              className={`sidebar__toggle-btn sidebar__nav-btn ${showExpanded ? 'sidebar__nav-btn--expanded' : 'sidebar__nav-btn--collapsed'}`}
              onClick={onToggleExpanded}
              aria-label={expanded ? 'Collapse menu' : 'Expand menu'}
            >
              <i className="fa-regular fa-sidebar" aria-hidden="true" />
            </button>
            <button
              className={`sidebar__nav-btn ${showExpanded ? 'sidebar__nav-btn--expanded' : 'sidebar__nav-btn--collapsed'}`}
              onClick={handleNavClick}
            >
              <i className="fa-regular fa-house" />
              {showExpanded && <span className="sidebar__nav-label">Home</span>}
            </button>
          </div>

          {/* Strategies */}
          <div className="sidebar__group">
            {showExpanded && (
              <div className="sidebar__group-header">
                <span className="sidebar__group-title">Strategies</span>
                <i className="fa-solid fa-angle-up sidebar__group-chevron" />
              </div>
            )}
            {STRATEGIES.map(strategy => (
              <NavLink
                key={strategy.id}
                to={strategy.path}
                className={({ isActive }) =>
                  `sidebar__nav-btn ${showExpanded ? 'sidebar__nav-btn--expanded' : 'sidebar__nav-btn--collapsed'} ${isActive ? 'sidebar__nav-btn--selected' : ''}`
                }
                onClick={() => { if (mobileOpen) onCloseMobile() }}
              >
                {({ isActive }) => (
                  <>
                    <i className={isActive ? strategy.icon.replace('fa-regular', 'fa-solid') : strategy.icon} />
                    {showExpanded && <span className="sidebar__nav-label">{strategy.shortLabel}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Nav groups */}
          {NAV_GROUPS.map(group => (
            <div key={group.id} className="sidebar__group">
              {showExpanded && (
                <div className="sidebar__group-header">
                  <span className="sidebar__group-title">{group.label}</span>
                  <i className="fa-solid fa-angle-up sidebar__group-chevron" />
                </div>
              )}
              {group.items.map(item => (
                <button
                  key={item.id}
                  className={`sidebar__nav-btn ${showExpanded ? 'sidebar__nav-btn--expanded' : 'sidebar__nav-btn--collapsed'}`}
                  onClick={handleNavClick}
                >
                  <i className={item.icon} />
                  {showExpanded && <span className="sidebar__nav-label">{item.label}</span>}
                </button>
              ))}
            </div>
          ))}

          {/* App settings */}
          <button
            className={`sidebar__nav-btn ${showExpanded ? 'sidebar__nav-btn--expanded' : 'sidebar__nav-btn--collapsed'}`}
            onClick={handleNavClick}
          >
            <i className="fa-regular fa-gear" />
            {showExpanded && <span className="sidebar__nav-label">App settings</span>}
          </button>
        </nav>
      </aside>
    </>
  )
}
