import { useState, useEffect } from 'react'
import './BreakpointToggle.css'

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

export default function BreakpointToggle() {
  const [width, setWidth] = useState(window.innerWidth)
  const [active, setActive] = useState(() => getBreakpoint(window.innerWidth))

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      setWidth(w)
      setActive(getBreakpoint(w))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="bp-toggle" role="status" aria-label="Current breakpoint">
      {BREAKPOINTS.map(bp => (
        <span
          key={bp.label}
          className={`bp-toggle__pill ${active === bp.label ? 'bp-toggle__pill--active' : ''}`}
        >
          {bp.label}
        </span>
      ))}
      <span className="bp-toggle__width">{width}px</span>
    </div>
  )
}
