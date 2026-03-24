import { useState, useEffect } from 'react'
import './BreakpointToggle.css'

const STORAGE_KEY = 'bp-toggle-compact'

const BREAKPOINTS = [
  { label: 'xs', min: 0, max: 599 },
  { label: 'sm', min: 600, max: 899 },
  { label: 'md', min: 900, max: 1199 },
  { label: 'lg', min: 1200, max: 1535 },
  { label: 'xl', min: 1536, max: Infinity },
]

function getBreakpoint(width) {
  return BREAKPOINTS.find(bp => width >= bp.min && width <= bp.max)?.label ?? 'xs'
}

function readCompactPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writeCompactPreference(compact) {
  try {
    localStorage.setItem(STORAGE_KEY, compact ? '1' : '0')
  } catch {
    /* ignore */
  }
}

export default function BreakpointToggle() {
  const [width, setWidth] = useState(window.innerWidth)
  const [active, setActive] = useState(() => getBreakpoint(window.innerWidth))
  const [compact, setCompact] = useState(readCompactPreference)

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      setWidth(w)
      setActive(getBreakpoint(w))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleCompact = () => {
    setCompact((prev) => {
      const next = !prev
      writeCompactPreference(next)
      return next
    })
  }

  return (
    <div
      className={`bp-toggle ${compact ? 'bp-toggle--compact' : ''}`}
      role="status"
      aria-label="Current breakpoint"
      aria-live="polite"
    >
      {compact ? (
        <span className="bp-toggle__compact-row">
          <span className="bp-toggle__pill bp-toggle__pill--active">{active}</span>
          <span className="bp-toggle__width bp-toggle__width--compact">{width}px</span>
        </span>
      ) : (
        <>
          {BREAKPOINTS.map((bp) => (
            <span
              key={bp.label}
              className={`bp-toggle__pill ${active === bp.label ? 'bp-toggle__pill--active' : ''}`}
            >
              {bp.label}
            </span>
          ))}
          <span className="bp-toggle__width">{width}px</span>
        </>
      )}
      <button
        type="button"
        className="bp-toggle__minimize-btn"
        onClick={toggleCompact}
        aria-expanded={!compact}
        aria-label={compact ? 'Expand breakpoint view' : 'Minimize breakpoint view'}
      >
        <i
          className={`fa-solid ${compact ? 'fa-chevron-down' : 'fa-chevron-up'}`}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}
