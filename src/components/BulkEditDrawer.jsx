import './BulkEditActionBar.css'

export default function BulkEditDrawer({ open, selectedCount, onClose }) {
  if (!open) return null

  return (
    <div className={`bulk-edit-drawer ${open ? 'bulk-edit-drawer--entering' : ''}`}>
      {/* Header */}
      <div className="bulk-edit-drawer__header">
        <h2 className="bulk-edit-drawer__title">
          {selectedCount} Selected
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
