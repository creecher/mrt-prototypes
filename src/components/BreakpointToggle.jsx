import { useState, useEffect } from 'react'
import './BreakpointToggle.css'

const STORAGE_KEY = 'bp-toggle-compact'

/** Hide the dev overlay on real phones/tablets; keep it on desktop (including DevTools device mode only when pointer stays fine). */
function isMobileDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  try {
    if (window.matchMedia('(pointer: coarse)').matches) return true
  } catch {
    /* ignore */
  }
  // iPadOS “desktop” Safari: Mac UA but touch screen
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true
  const ua = navigator.userAgent || ''
  if (/Mobi|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return true
  return false
}

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
  const [hideOnDevice, setHideOnDevice] = useState(() =>
    typeof window !== 'undefined' ? isMobileDevice() : false
  )
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )
  const [active, setActive] = useState(() =>
    typeof window !== 'undefined' ? getBreakpoint(window.innerWidth) : 'xs'
  )
  const [compact, setCompact] = useState(() =>
    typeof window !== 'undefined' ? readCompactPreference() : false
  )

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const syncDevice = () => setHideOnDevice(isMobileDevice())
    syncDevice()
    mq.addEventListener('change', syncDevice)
    return () => mq.removeEventListener('change', syncDevice)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      setWidth(w)
      setActive(getBreakpoint(w))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (hideOnDevice) return null

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
