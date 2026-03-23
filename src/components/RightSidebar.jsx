import { useState } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import CaseStatusDrawer from './CaseStatusDrawer'
import './RightSidebar.css'

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

export default function RightSidebar() {
  const theme = useTheme()
  const isCompact = useMediaQuery('(max-width: 1199px)')
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (isCompact) {
    return (
      <aside className="right-sidebar right-sidebar--compact">
        <div className="right-sidebar__compact-contents">
          <div className="right-sidebar__compact-left">
            <div className="right-sidebar__header-avatar">
              <i className="fa-solid fa-folder-open" />
            </div>
            <h2 className="right-sidebar__compact-title">Case status</h2>
            <span className="right-sidebar__compact-chip">Pending</span>
          </div>
          {isXs ? (
            <button type="button" className="right-sidebar__update-btn right-sidebar__update-btn--icon-only" onClick={() => setDrawerOpen(true)}>
              <i className="fa-regular fa-pen-to-square" />
            </button>
          ) : (
            <button type="button" className="right-sidebar__update-btn" onClick={() => setDrawerOpen(true)}>
              <i className="fa-regular fa-pen-to-square" />
              <span>Update status</span>
            </button>
          )}
        </div>
        <CaseStatusDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </aside>
    )
  }

  return (
    <aside className="right-sidebar">
      {/* Header */}
      <div className="right-sidebar__header">
        <div className="right-sidebar__header-avatar">
          <i className="fa-solid fa-folder-open" />
        </div>
        <h2 className="right-sidebar__header-title">Case status</h2>
      </div>

      {/* Current status card */}
      <div className="right-sidebar__status-card">
        <div className="right-sidebar__status-icon">
          <i className="fa-solid fa-circle-check" />
        </div>
        <span className="right-sidebar__status-label">Pending</span>
        <div className="right-sidebar__status-edit">
          <i className="fa-regular fa-pen-to-square" />
        </div>
      </div>

      {/* Service status history */}
      <div className="right-sidebar__section">
        <div className="right-sidebar__section-header">
          <h3 className="right-sidebar__section-title">Service status history</h3>
          <div className="right-sidebar__section-toggle">
            <i className="fa-regular fa-angle-up" />
          </div>
        </div>

        <div className="right-sidebar__timeline">
          {TIMELINE_ENTRIES.map((entry, i) => (
            <div className="right-sidebar__timeline-entry" key={i}>
              {/* Track (icon + connecting line) */}
              <div className="right-sidebar__timeline-track">
                {entry.isLatest ? (
                  <div className="right-sidebar__timeline-icon">
                    <i className="fa-solid fa-circle-check" />
                  </div>
                ) : (
                  <div className="right-sidebar__timeline-icon right-sidebar__timeline-icon--small">
                    <i className="fa-solid fa-circle-check" />
                  </div>
                )}
                {i < TIMELINE_ENTRIES.length - 1 && (
                  <div className="right-sidebar__timeline-line" />
                )}
              </div>

              {/* Content */}
              <div className="right-sidebar__timeline-content">
                <div className="right-sidebar__timeline-status-row">
                  <span className="right-sidebar__timeline-status-name">{entry.status}</span>
                  <div className="right-sidebar__timeline-more">
                    <i className="fa-regular fa-ellipsis" />
                  </div>
                </div>
                <div className="right-sidebar__timeline-log">
                  <div className="right-sidebar__timeline-log-row">
                    <span>{entry.date}</span>
                    <span>{entry.time}</span>
                  </div>
                  <div className="right-sidebar__timeline-log-row">
                    <span>Updated by:</span>
                    <span>{entry.updatedBy}</span>
                  </div>
                  <div className="right-sidebar__timeline-log-row">
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
      <div className="right-sidebar__referrals">
        <h3 className="right-sidebar__referrals-title">Other referrals</h3>
        {OTHER_REFERRALS.map((ref) => (
          <div className="right-sidebar__referral-item" key={ref.name}>
            <div className="right-sidebar__referral-program">
              <i className="fa-regular fa-folder-heart" />
              <span>{ref.name}</span>
            </div>
            <span className={`right-sidebar__referral-chip right-sidebar__referral-chip--${ref.variant}`}>
              {ref.status}
            </span>
          </div>
        ))}
      </div>
    </aside>
  )
}
