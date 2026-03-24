import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import './BulkEditActionBar.css'

export default function BulkEditActionBar({ selectedCount, onClose }) {
  const [exiting, setExiting] = useState(false)
  const [lastNonZeroCount, setLastNonZeroCount] = useState(0)
  const prevForExit = useRef(0)

  /* eslint-disable react-hooks/set-state-in-effect -- exit animation + count label synced from selection */
  useLayoutEffect(() => {
    const prev = prevForExit.current
    if (selectedCount > 0) {
      setExiting(false)
      setLastNonZeroCount(selectedCount)
    } else if (prev > 0) {
      setExiting(true)
    }
    prevForExit.current = selectedCount
  }, [selectedCount])
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleAnimationEnd = useCallback((e) => {
    if (e.target !== e.currentTarget) return
    // Don’t gate on `exiting` — a stale closure can skip cleanup. Name + target are enough.
    if (!e.animationName.includes('bulk-edit-bar-exit')) return
    setExiting(false)
  }, [])

  const showBar = selectedCount > 0 || exiting
  const countShown =
    selectedCount > 0 ? selectedCount : lastNonZeroCount

  if (!showBar) return null

  return (
    <div
      className={`bulk-edit-bar${exiting ? ' bulk-edit-bar--exiting' : ''}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <button
        type="button"
        className="bulk-edit-bar__close-btn"
        onClick={onClose}
        aria-label="Close bulk edit"
      >
        <i className="fa-regular fa-xmark" />
      </button>
      <span className="bulk-edit-bar__count">
        {countShown} selected
      </span>
      <div className="bulk-edit-bar__buttons">
        {/* Assign to dropdown */}
        <button type="button" className="bulk-edit-bar__dropdown-btn">
          <span className="bulk-edit-bar__dropdown-label">Assign to</span>
          <i className="fa-solid fa-angles-up-down bulk-edit-bar__dropdown-icon" />
        </button>

        {/* Status dropdown */}
        <button type="button" className="bulk-edit-bar__dropdown-btn">
          <span className="bulk-edit-bar__dropdown-label">Status</span>
          <i className="fa-solid fa-angles-up-down bulk-edit-bar__dropdown-icon" />
        </button>

        {/* Date range field */}
        <div className="bulk-edit-bar__date-field">
          <span className="bulk-edit-bar__date-placeholder">mm/dd/yyyy &nbsp;-&nbsp; mm/dd/yyyy</span>
          <span className="bulk-edit-bar__date-icon">
            <i className="fa-regular fa-calendar" />
          </span>
        </div>

        {/* Delete button */}
        <button type="button" className="bulk-edit-bar__delete-btn">
          <i className="fa-regular fa-trash-can" />
          <span>Delete</span>
        </button>

        {/* Save edits button */}
        <button type="button" className="bulk-edit-bar__save-btn">
          Save edits
        </button>
      </div>
    </div>
  )
}
