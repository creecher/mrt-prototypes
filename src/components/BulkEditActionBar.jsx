import './BulkEditActionBar.css'

export default function BulkEditActionBar({ selectedCount, onClose }) {
  return (
    <div className="bulk-edit-bar">
      <button
        type="button"
        className="bulk-edit-bar__close-btn"
        onClick={onClose}
        aria-label="Close bulk edit"
      >
        <i className="fa-regular fa-xmark" />
      </button>
      <span className="bulk-edit-bar__count">
        {selectedCount} selected
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
