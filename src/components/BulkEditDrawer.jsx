import { useCallback, useEffect, useRef, useState } from 'react'
import './BulkEditActionBar.css'

export default function BulkEditDrawer({ open, selectedCount, onClose }) {
  const [exiting, setExiting] = useState(false)
  const [lastNonZeroCount, setLastNonZeroCount] = useState(0)
  const prevOpenForExit = useRef(false)

  /* eslint-disable react-hooks/set-state-in-effect -- sheet exit animation + count synced from props */
  useEffect(() => {
    if (open) {
      setExiting(false)
      setLastNonZeroCount(selectedCount)
    } else if (prevOpenForExit.current) {
      setExiting(true)
    }
    prevOpenForExit.current = open
  }, [open, selectedCount])
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleAnimationEnd = useCallback((e) => {
    if (e.target !== e.currentTarget) return
    if (!e.animationName.includes('bulk-edit-drawer-slide-down')) return
    setExiting(false)
  }, [])

  const visible = open || exiting
  if (!visible) return null

  const drawerClass = exiting
    ? 'bulk-edit-drawer bulk-edit-drawer--exiting'
    : 'bulk-edit-drawer bulk-edit-drawer--entering'

  const countShown = selectedCount > 0 ? selectedCount : lastNonZeroCount

  return (
    <div className={drawerClass} onAnimationEnd={handleAnimationEnd}>
      {/* Header */}
      <div className="bulk-edit-drawer__header">
        <h2 className="bulk-edit-drawer__title">
          {countShown} Selected
        </h2>
        <button
          type="button"
          className="bulk-edit-drawer__close-btn"
          onClick={onClose}
          aria-label="Close bulk edit"
        >
          <i className="fa-regular fa-xmark" />
        </button>
      </div>

      {/* Fields */}
      <div className="bulk-edit-drawer__fields">
        {/* Assign to */}
        <div className="bulk-edit-drawer__field">
          <label className="bulk-edit-drawer__label">Assign to</label>
          <div className="bulk-edit-drawer__input">
            <span className="bulk-edit-drawer__input-text">Select assignees</span>
            <i className="fa-solid fa-angles-up-down bulk-edit-drawer__input-icon" />
          </div>
        </div>

        {/* Status */}
        <div className="bulk-edit-drawer__field">
          <label className="bulk-edit-drawer__label">Status</label>
          <div className="bulk-edit-drawer__input">
            <span className="bulk-edit-drawer__input-text">Select statuses</span>
            <i className="fa-solid fa-angles-up-down bulk-edit-drawer__input-icon" />
          </div>
        </div>

        {/* Date range */}
        <div className="bulk-edit-drawer__field">
          <label className="bulk-edit-drawer__label">Date range</label>
          <div className="bulk-edit-drawer__input bulk-edit-drawer__input--date">
            <span className="bulk-edit-drawer__input-text">mm/dd/yyyy &nbsp;-&nbsp; mm/dd/yyyy</span>
            <span className="bulk-edit-drawer__date-addon">
              <i className="fa-regular fa-calendar" />
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bulk-edit-drawer__actions">
        <button type="button" className="bulk-edit-drawer__delete-btn">
          <i className="fa-regular fa-trash-can" />
          <span>Delete</span>
        </button>
        <button type="button" className="bulk-edit-drawer__save-btn">
          Save edits
        </button>
      </div>
    </div>
  )
}
