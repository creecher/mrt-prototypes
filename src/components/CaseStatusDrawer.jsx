import { Drawer, useMediaQuery } from '@mui/material'
import './CaseStatusDrawer.css'

const TIMELINE_ENTRIES = [
  {
    status: 'Intake',
    date: '5/14/2025,',
    time: '2:14:10 PM',
    updatedBy: 'Jonathan S',
    created: '2/14/2025, 2:14:11 PM',
    isLatest: true,
  },
  {
    status: 'Accepted',
    date: '5/14/2025,',
    time: '2:14:10 PM',
    updatedBy: 'Jonathan S',
    created: '2/14/2025, 2:14:11 PM',
    isLatest: false,
  },
]

const OTHER_REFERRALS = [
  { name: 'LB - Enhanced Care Management (ECM)', status: 'In review', variant: 'in-review' },
  { name: 'LB - Behavioral Health', status: 'Accepted', variant: 'accepted' },
]

export default function CaseStatusDrawer({ open, onClose }) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const slideMs = reduceMotion ? { enter: 1, exit: 1 } : { enter: 280, exit: 220 }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      transitionDuration={slideMs}
      SlideProps={{
        easing: reduceMotion
          ? { enter: 'linear', exit: 'linear' }
          : {
              enter: 'cubic-bezier(0.22, 1, 0.36, 1)',
              exit: 'cubic-bezier(0.4, 0, 1, 1)',
            },
      }}
      PaperProps={{
        className: 'case-status-drawer',
      }}
    >
      {/* Drawer Header */}
      <div className="case-status-drawer__header">
        <h2 className="case-status-drawer__header-title">Case status</h2>
      </div>

      {/* Content Surface */}
      <div className="case-status-drawer__content">
        {/* Section header with icon */}
        <div className="case-status-drawer__section-header">
          <div className="case-status-drawer__section-avatar">
            <i className="fa-solid fa-folder-open" />
          </div>
          <h3 className="case-status-drawer__section-title">Case status</h3>
        </div>

        {/* Current status card */}
        <div className="case-status-drawer__status-card">
          <div className="case-status-drawer__status-icon">
            <i className="fa-solid fa-circle-check" />
          </div>
          <span className="case-status-drawer__status-label">Pending</span>
          <div className="case-status-drawer__status-edit">
            <i className="fa-regular fa-pen-to-square" />
          </div>
        </div>

        {/* Service status history */}
        <div className="case-status-drawer__history">
          <div className="case-status-drawer__history-header">
            <h4 className="case-status-drawer__history-title">Service status history</h4>
            <div className="case-status-drawer__history-toggle">
              <i className="fa-regular fa-angle-up" />
            </div>
          </div>

          <div className="case-status-drawer__timeline">
            {TIMELINE_ENTRIES.map((entry, i) => (
              <div className="case-status-drawer__timeline-entry" key={i}>
                {/* Track */}
                <div className="case-status-drawer__timeline-track">
                  {entry.isLatest ? (
                    <div className="case-status-drawer__timeline-icon">
                      <i className="fa-solid fa-circle-check" />
                    </div>
                  ) : (
                    <div className="case-status-drawer__timeline-icon case-status-drawer__timeline-icon--small">
                      <i className="fa-solid fa-circle-check" />
                    </div>
                  )}
                  {i < TIMELINE_ENTRIES.length - 1 && (
                    <div className="case-status-drawer__timeline-line" />
                  )}
                </div>

                {/* Content */}
                <div className="case-status-drawer__timeline-content">
                  <div className="case-status-drawer__timeline-status-row">
                    <span className="case-status-drawer__timeline-status-name">{entry.status}</span>
                    <div className="case-status-drawer__timeline-more">
                      <i className="fa-regular fa-ellipsis" />
                    </div>
                  </div>
                  <div className="case-status-drawer__timeline-log">
                    <div className="case-status-drawer__timeline-log-row">
                      <span>{entry.date}</span>
                      <span>{entry.time}</span>
                    </div>
                    <div className="case-status-drawer__timeline-log-row">
                      <span>Updated by:</span>
                      <span>{entry.updatedBy}</span>
                    </div>
                    <div className="case-status-drawer__timeline-log-row">
                      <span>Created:</span>
                      <span>{entry.created}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other referrals */}
        <div className="case-status-drawer__referrals">
          <h4 className="case-status-drawer__referrals-title">Other referrals</h4>
          {OTHER_REFERRALS.map((ref) => (
            <div className="case-status-drawer__referral-item" key={ref.name}>
              <div className="case-status-drawer__referral-program">
                <i className="fa-regular fa-folder-heart" />
                <span>{ref.name}</span>
              </div>
              <span className={`case-status-drawer__referral-chip case-status-drawer__referral-chip--${ref.variant}`}>
                {ref.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="case-status-drawer__footer">
        <button type="button" className="case-status-drawer__btn-cancel" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="case-status-drawer__btn-update">
          Update status
        </button>
      </div>
    </Drawer>
  )
}
