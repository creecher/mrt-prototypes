import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
} from 'material-react-table'
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { TASK_DATA, STATUS_COLORS, TASK_TYPE_CHIP_STYLES } from '../data/taskData'
import RightSidebar from '../components/RightSidebar'
import FiltersDrawer from '../components/FiltersDrawer'
import BulkEditActionBar from '../components/BulkEditActionBar'
import BulkEditDrawer from '../components/BulkEditDrawer'
import './DetailPanelPage.css'

const TOOLBAR_CONTROL_BG = 'var(--mui-palette-background-paperElevation3, white)'
const TOOLBAR_CONTROL_RADIUS = '8px'
const TOOLBAR_CONTROL_SHADOW =
  '0px 0px 0px 1px var(--mui-palette-component-input-dividerDefault, rgba(20,0,53,0.15)), 0px 1px 3px 0px rgba(33,31,38,0.1), 0px 1px 2px -1px rgba(33,31,38,0.1)'
const SHADOW_EDGE_GUTTER = '2px'
const TABLE_CARD_SHADOW =
  '0 0 0 1px rgba(32, 0, 56, 0.10), 0 1px 3px 0 rgba(33, 31, 38, 0.10), 0 1px 2px -1px rgba(33, 31, 38, 0.10)'

// ── Status config ────────────────────────────────────────────────────────────
const STATUSES = [
  { key: 'Not started', label: 'Not started', color: '#E24B4A', chipColor: 'default' },
  { key: 'In progress', label: 'In progress', color: '#378ADD', chipColor: 'info' },
  { key: 'Completed', label: 'Completed', color: '#3B6D11', chipColor: 'success' },
  { key: 'Blocked', label: 'Blocked', color: '#888888', chipColor: 'warning' },
]
function getStatus(key) {
  return STATUSES.find((s) => s.key === key)
}

function FaSearchIcon() {
  return (
    <i
      className="fa-regular fa-search"
      style={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)' }}
    />
  )
}

function FaCloseIcon() {
  return (
    <i
      className="fa-solid fa-xmark"
      style={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)' }}
    />
  )
}

function FaViewColumnIcon() {
  return (
    <i
      className="fa-regular fa-columns-3"
      style={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)' }}
    />
  )
}

/** MRT passes `style` with rotate + transition for expand/collapse — must forward. */
function FaExpandMoreIcon({ style, ...rest }) {
  return (
    <i
      className="fa-regular fa-angle-down"
      aria-hidden
      style={{
        fontSize: 18,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'currentColor',
        ...style,
      }}
      {...rest}
    />
  )
}

/** MRT expand-all header control uses `KeyboardDoubleArrowDownIcon`; forwards rotate + transition. */
function FaExpandAllIcon({ style, ...rest }) {
  return (
    <i
      className="fa-regular fa-arrows-up-down"
      aria-hidden
      style={{
        fontSize: 18,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'currentColor',
        ...style,
      }}
      {...rest}
    />
  )
}

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
}

function isOverdue(dateStr) {
  return new Date(dateStr + 'T00:00:00') < new Date()
}

// ── Status pill with inline select (mobile detail panel) ─────────────────────
function StatusPill({ statusKey, onStatusChange }) {
  const selected = getStatus(statusKey) ?? STATUSES[0]

  return (
    <FormControl
      size="small"
      sx={{ flex: 1, minWidth: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <Select
        value={selected.key}
        onChange={(e) => onStatusChange(e.target.value)}
        IconComponent={() => (
          <i
            className="fa-regular fa-angles-up-down"
            style={{
              fontSize: 12,
              color: 'var(--mui-palette-text-secondary)',
              marginRight: 10,
              pointerEvents: 'none',
            }}
          />
        )}
        renderValue={(value) => {
          const item = getStatus(value) ?? selected
          return (
            <span className="detail-panel-page__status-pill-value">
              <span
                className="detail-panel-page__status-dot"
                style={{ backgroundColor: item.color }}
              />
              <span className="detail-panel-page__status-pill-label">{item.label}</span>
            </span>
          )
        }}
        MenuProps={{
          disableScrollLock: true,
          PaperProps: {
            sx: {
              mt: 0.5,
              borderRadius: '8px',
              border: '0.5px solid var(--mui-palette-divider)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
            },
          },
        }}
        sx={{
          borderRadius: '8px',
          backgroundColor: 'var(--mui-palette-background-paperElevation3, white)',
          boxShadow:
            '0px 0px 0px 1px var(--mui-palette-component-input-dividerDefault, rgba(20,0,53,0.15)), 0px 1px 3px 0px rgba(33,31,38,0.1), 0px 1px 2px -1px rgba(33,31,38,0.1)',
          minHeight: 28,
          height: 28,
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
            padding: '4px 30px 4px 8px',
          },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
        }}
      >
        {STATUSES.map((st) => (
          <MenuItem key={st.key} value={st.key}>
            <span className="detail-panel-page__status-pill-value">
              <span
                className="detail-panel-page__status-dot"
                style={{ backgroundColor: st.color }}
              />
              <span className="detail-panel-page__status-pill-label">{st.label}</span>
            </span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

// ── Mobile detail panel card ─────────────────────────────────────────────────
const CARD_FIELDS = [
  { key: 'taskType', label: 'Task type', type: 'badge' },
  { key: 'dueDate', label: 'Due date', type: 'dueDate' },
  { key: 'assignees', label: 'Assignee', type: 'assignees' },
  { key: 'taskStatus', label: 'Status', type: 'status' },
]

function MobileDetailPanel({ row, onStatusChange }) {
  const data = row.original
  return (
    <Box className="detail-panel-page__detail-card">
      {CARD_FIELDS.map(({ key, label, type }) => (
        <Box key={key} className="detail-panel-page__detail-row">
          <Typography
            variant="body2"
            className="detail-panel-page__detail-label"
          >
            {label}
          </Typography>

          <div className="detail-panel-page__detail-data">
            {type === 'badge' && (
              <span
                className="detail-panel-page__chip"
                style={{
                  backgroundColor: TASK_TYPE_CHIP_STYLES[data[key]]?.bg || '#FAF0C8',
                  color: TASK_TYPE_CHIP_STYLES[data[key]]?.color || '#7A5C00',
                  border: `1px solid ${TASK_TYPE_CHIP_STYLES[data[key]]?.borderColor || 'transparent'}`,
                }}
              >
                <i
                  className={TASK_TYPE_CHIP_STYLES[data[key]]?.icon || 'fa-solid fa-file'}
                  style={{ fontSize: 12 }}
                />
                <span className="detail-panel-page__chip-text">{data[key]}</span>
              </span>
            )}

            {type === 'dueDate' && (
              <span
                className={`detail-panel-page__date ${isOverdue(data.dueDate) ? 'detail-panel-page__date--overdue' : ''}`}
              >
                {formatDate(data[key])}
                {isOverdue(data.dueDate) && <i className="fa-solid fa-alarm-clock" />}
              </span>
            )}

            {type === 'assignees' && (
              <AvatarGroup
                max={3}
                className="detail-panel-page__assignees-group"
                sx={{
                  '& .MuiAvatar-root': {
                    width: 28,
                    height: 28,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    bgcolor: 'var(--mui-palette-accent-plum-3)',
                    color: 'var(--mui-palette-accent-plum-11)',
                    border: '1.5px solid white',
                    boxSizing: 'border-box',
                  },
                }}
              >
                {data.assignees.map((name) => (
                  <Avatar key={name}>{getInitials(name)}</Avatar>
                ))}
              </AvatarGroup>
            )}

            {type === 'status' && (
              <StatusPill
                statusKey={data.taskStatus}
                onStatusChange={(newKey) => onStatusChange(data.id, newKey)}
              />
            )}
          </div>
        </Box>
      ))}
    </Box>
  )
}

// ── Page tabs ────────────────────────────────────────────────────────────────
const PAGE_TABS = [
  { value: 'tasks', icon: 'fa-regular fa-list-check', label: 'Tasks' },
  { value: 'notes', icon: 'fa-regular fa-memo-pad', label: 'Notes' },
  { value: 'documents', icon: 'fa-regular fa-files', label: 'Documents' },
  { value: 'outgoing-referrals', icon: 'fa-regular fa-phone-arrow-up-right', label: 'Outgoing referrals' },
  { value: 'team', icon: 'fa-regular fa-people-group', label: 'Team' },
]

// ── Main component ───────────────────────────────────────────────────────────
export default function DetailPanelPage() {
  const theme = useTheme()
  const isCompactToolbar = useMediaQuery('(max-width: 1199px)')
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isMobileBulkEdit = useMediaQuery(theme.breakpoints.down('md'))

  // isCompact drives mobile detail panel vs full desktop table
  const isCompact = useMediaQuery(theme.breakpoints.down('md'))

  const [data, setData] = useState(TASK_DATA)
  const [expanded, setExpanded] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [tabValue, setTabValue] = useState('all')
  const [activeTab, setActiveTab] = useState('tasks')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [filterTaskTypes, setFilterTaskTypes] = useState([])
  const [filterAssignees, setFilterAssignees] = useState([])
  const [filterStatuses, setFilterStatuses] = useState([])

  const taskTypeOptions = useMemo(() => [...new Set(data.map((r) => r.taskType))], [data])
  const assigneeOptions = useMemo(() => [...new Set(data.flatMap((r) => r.assignees))].sort(), [data])
  const statusOptions = useMemo(() => ['Not started', 'In progress'], [])

  const activeFilterCount = [filterTaskTypes, filterAssignees, filterStatuses].filter((a) => a.length > 0).length
  const selectedCount = Object.keys(rowSelection).length
  const handleClearSelection = useCallback(() => setRowSelection({}), [])

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (filterTaskTypes.length && !filterTaskTypes.includes(row.taskType)) return false
      if (filterAssignees.length && !row.assignees.some((a) => filterAssignees.includes(a))) return false
      if (filterStatuses.length && !filterStatuses.includes(row.taskStatus)) return false
      return true
    })
  }, [data, filterTaskTypes, filterAssignees, filterStatuses])

  const handleResetFilters = useCallback(() => {
    setFilterTaskTypes([])
    setFilterAssignees([])
    setFilterStatuses([])
  }, [])

  function handleStatusChange(taskId, newStatusKey) {
    setData((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, taskStatus: newStatusKey } : task))
    )
  }

  // Fade indicators for scrollable tabs
  const scrollerRef = useRef(null)
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(false)

  const updateFades = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setShowLeftFade(el.scrollLeft > 0)
    setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    updateFades()
    el.addEventListener('scroll', updateFades, { passive: true })
    window.addEventListener('resize', updateFades)
    return () => {
      el.removeEventListener('scroll', updateFades)
      window.removeEventListener('resize', updateFades)
    }
  }, [updateFades, isMobile])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'task',
        header: 'Task',
        enableHiding: false,
        size: isCompact ? 140 : 221,
        minSize: isCompact ? 0 : 160,
        grow: true,
        Cell: ({ cell }) => (
          <span className="detail-panel-page__task-name">
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'taskType',
        header: 'Task type',
        size: 221,
        Cell: ({ cell, row }) => {
          const style = TASK_TYPE_CHIP_STYLES[row.original.taskType] || TASK_TYPE_CHIP_STYLES['Recup Referral Coordinator']
          return (
            <span
              className="detail-panel-page__chip"
              style={{
                backgroundColor: style.bg,
                color: style.color,
                border: `1px solid ${style.borderColor || 'transparent'}`,
              }}
            >
              <i className={style.icon} style={{ fontSize: 12 }} />
              {cell.getValue()}
            </span>
          )
        },
      },
      {
        accessorKey: 'dueDate',
        header: 'Due date',
        size: 221,
        Cell: ({ cell }) => {
          const value = cell.getValue()
          const overdue = isOverdue(value)
          return (
            <span className={`detail-panel-page__date ${overdue ? 'detail-panel-page__date--overdue' : ''}`}>
              {overdue && <i className="fa-solid fa-alarm-clock" />}
              {formatDate(value)}
            </span>
          )
        },
      },
      {
        accessorKey: 'assignees',
        header: 'Assignee',
        size: 221,
        enableSorting: false,
        Cell: ({ cell }) => {
          const assignees = cell.getValue()
          return (
            <div className="detail-panel-page__assignees-cell">
              <AvatarGroup
                max={3}
                className="detail-panel-page__assignees-group"
                sx={{
                  '& .MuiAvatar-root': {
                    width: 28,
                    height: 28,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    bgcolor: 'var(--mui-palette-accent-plum-3)',
                    color: 'var(--mui-palette-accent-plum-11)',
                    border: '1px solid var(--mui-palette-accent-plum-6)',
                    boxSizing: 'border-box',
                  },
                }}
              >
                {assignees.map((name) => (
                  <Avatar key={name}>{getInitials(name)}</Avatar>
                ))}
              </AvatarGroup>
            </div>
          )
        },
      },
      {
        accessorKey: 'taskStatus',
        header: 'Task status',
        size: 221,
        Cell: ({ cell }) => {
          const raw = cell.getValue()
          const value = raw === 'In progress' ? 'In progress' : 'Not started'
          const color = STATUS_COLORS[value]
          return (
            <Button
              type="button"
              variant="outlined"
              size="small"
              tabIndex={-1}
              disableRipple
              className="detail-panel-page__status-button"
              endIcon={
                <i
                  className="fa-regular fa-angles-up-down"
                  style={{ fontSize: 12, color: 'var(--mui-palette-text-secondary)' }}
                />
              }
              sx={{
                fontFamily: 'Figtree, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.12px',
                textTransform: 'none',
                borderColor: 'transparent',
                backgroundColor: TOOLBAR_CONTROL_BG,
                color: 'var(--mui-palette-text-primary)',
                borderRadius: TOOLBAR_CONTROL_RADIUS,
                padding: '4px 12px',
                minWidth: 0,
                width: '100%',
                maxWidth: '100%',
                lineHeight: '20px',
                height: 28,
                justifyContent: 'flex-start',
                boxShadow: TOOLBAR_CONTROL_SHADOW,
                pointerEvents: 'none',
                '& .MuiButton-endIcon': { marginLeft: 'auto' },
                '&:hover': {
                  borderColor: 'transparent',
                  backgroundColor: TOOLBAR_CONTROL_BG,
                  boxShadow: TOOLBAR_CONTROL_SHADOW,
                },
              }}
            >
              <span className="detail-panel-page__status-leading">
                <span
                  className="detail-panel-page__status-dot"
                  style={{ backgroundColor: color }}
                />
                <span className="detail-panel-page__status-label">{value}</span>
              </span>
            </Button>
          )
        },
      },
    ],
    [isCompact]
  )

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    layoutMode: 'grid',
    enableRowSelection: true,
    initialState: {
      showGlobalFilter: true,
    },
    icons: {
      SearchIcon: FaSearchIcon,
      CloseIcon: FaCloseIcon,
      ViewColumnIcon: FaViewColumnIcon,
      ExpandMoreIcon: FaExpandMoreIcon,
      KeyboardDoubleArrowDownIcon: FaExpandAllIcon,
    },
    muiSearchTextFieldProps: {
      InputProps: {
        startAdornment: (
          <InputAdornment position="start">
            <i
              className="fa-regular fa-search"
              style={{
                fontSize: 14,
                color: 'var(--mui-palette-text-secondary)',
                marginRight: 2,
              }}
            />
          </InputAdornment>
        ),
        endAdornment: null,
      },
    },
    state: {
      columnVisibility: {
        taskType: !isCompact,
        dueDate: !isCompact,
        assignees: !isCompact,
        taskStatus: !isCompact,
      },
      rowSelection,
      expanded,
    },
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,

    // Detail panel — only visible at XS/SM (below 900px)
    enableExpanding: isCompact,
    renderDetailPanel: isCompact
      ? ({ row }) => (
          <MobileDetailPanel row={row} onStatusChange={handleStatusChange} />
        )
      : false,
    positionExpandColumn: 'last',
    displayColumnDefOptions: {
      'mrt-row-select': {
        size: isCompact ? 36 : 60,
        minSize: isCompact ? 36 : 44,
        maxSize: isCompact ? 36 : 70,
        grow: false,
      },
      'mrt-row-expand': {
        size: isCompact ? 36 : 70,
        minSize: isCompact ? 36 : 44,
        maxSize: isCompact ? 36 : 80,
        grow: false,
      },
    },
    muiExpandButtonProps: {
      sx: {
        borderRadius: '8px',
        color: 'text.secondary',
        p: isCompact ? '6px' : '10px',
        margin: 0,
        '&:hover': {
          backgroundColor: 'action.hover',
          color: 'text.secondary',
        },
      },
    },
    muiExpandAllButtonProps: {
      sx: {
        borderRadius: '8px',
        color: 'text.secondary',
        p: isCompact ? '6px' : '10px',
        margin: 0,
        '&:hover': {
          backgroundColor: 'action.hover',
          color: 'text.secondary',
        },
      },
    },

    // Touch-friendly sizing
    muiTableBodyRowProps: ({ row, isDetailPanel }) => ({
      sx: (theme) => ({
        // Collapse the detail panel spacer row when not expanded
        ...(isDetailPanel && !row.getIsExpanded() && {
          display: 'none',
        }),
        backgroundColor: '#FFF',
        boxShadow: 'none',
        cursor: isCompact ? 'pointer' : 'default',
        '&:hover > td': {
          backgroundColor: isDetailPanel ? '#FFF' : theme.palette.action.hover,
        },
        '&:hover td:after': {
          backgroundColor: 'transparent',
          opacity: 0,
        },
        '&.Mui-selected': {
          boxShadow: 'none',
          backgroundColor: '#FFF',
        },
        '&.Mui-selected > td': {
          backgroundColor: isDetailPanel ? '#FFF' : theme.palette.action.selected,
        },
        '&.Mui-selected:hover > td': {
          backgroundColor: isDetailPanel ? '#FFF' : theme.palette.action.selected,
        },
        '&.Mui-selected td:after': {
          backgroundColor: 'transparent',
          opacity: 0,
          boxShadow: 'none',
        },
        '&:last-child td': {
          borderBottom: 'none',
        },
        ...(isDetailPanel && {
          cursor: 'default',
          pointerEvents: 'auto',
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          overflow: 'hidden',
          '& > td': {
            minWidth: 0,
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            flex: '1 1 auto',
          },
        }),
      }),
    }),

    muiTableBodyCellProps: ({ column }) => ({
      sx: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: '20px',
        color: 'var(--mui-palette-text-primary)',
        height: 48,
        padding: '0 16px',
        borderBottom: '1px solid var(--mui-palette-divider)',
        ...(column.id === 'mrt-row-select' && {
          width: isCompact ? 52 : 44,
          minWidth: isCompact ? 52 : 44,
          maxWidth: isCompact ? 52 : 44,
          paddingLeft: '16px',
          paddingRight: isCompact ? 0 : '16px',
          textAlign: 'center',
          '& .MuiCheckbox-root': { padding: isCompact ? '6px' : '10px' },
        }),
        ...(column.id === 'mrt-row-expand' && {
          width: isCompact ? 52 : 44,
          minWidth: isCompact ? 52 : 44,
          maxWidth: isCompact ? 52 : 44,
          paddingLeft: isCompact ? 0 : '16px',
          paddingRight: '16px',
          textAlign: 'center',
          overflow: 'visible',
          '& .MuiIconButton-root': { padding: isCompact ? '6px' : '10px', margin: 0 },
        }),
        ...(column.id === 'task' && isCompact && {
          minWidth: 0,
          overflow: 'hidden',
        }),
      },
    }),

    renderTopToolbar: () => (
      <CustomToolbar
        table={table}
        tabValue={tabValue}
        onTabChange={setTabValue}
        isCompactToolbar={isCompactToolbar}
        onFiltersOpen={() => setFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
      />
    ),
    enableBottomToolbar: false,
    positionToolbarAlertBanner: 'none',
    enableGlobalFilter: true,
    enableSorting: true,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enablePagination: false,
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingInline: SHADOW_EDGE_GUTTER,
        overflow: 'visible',
        minWidth: 0,
        maxWidth: '100%',
      },
    },
    muiTableContainerProps: {
      className: 'detail-panel-page__table-scroll',
      sx: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        maxWidth: '100%',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '0 4px 5px',
      },
    },
    muiTableProps: {
      sx: {
        borderCollapse: 'separate',
        borderSpacing: 0,
        width: '100%',
        tableLayout: 'fixed',
      },
    },
    muiTableHeadRowProps: {
      sx: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    },
    muiTableBodyProps: {
      sx: {
        backgroundColor: '#FFF',
        borderRadius: '12px',
        boxShadow: TABLE_CARD_SHADOW,
        overflow: 'hidden',
      },
    },
    muiTableHeadCellProps: ({ column }) => ({
      sx: {
        fontWeight: 600,
        fontSize: '0.875rem',
        letterSpacing: 0,
        lineHeight: '20px',
        color: 'var(--mui-palette-text-secondary)',
        backgroundColor: 'transparent',
        height: 44,
        padding: '0 16px',
        borderBottom: 'none',
        textTransform: 'none',
        ...(column.id === 'mrt-row-select' && {
          width: isCompact ? 52 : 44,
          minWidth: isCompact ? 52 : 44,
          maxWidth: isCompact ? 52 : 44,
          paddingLeft: '16px',
          paddingRight: isCompact ? 0 : '16px',
          textAlign: 'center',
        }),
        ...(column.id === 'mrt-row-expand' && {
          width: isCompact ? 52 : 44,
          minWidth: isCompact ? 52 : 44,
          maxWidth: isCompact ? 52 : 44,
          paddingLeft: isCompact ? 0 : '16px',
          paddingRight: '16px',
          textAlign: 'center',
          overflow: 'visible',
        }),
        ...(column.id === 'task' && isCompact && {
          minWidth: 0,
          overflow: 'hidden',
        }),
      },
    }),
    muiSelectCheckboxProps: {
      sx: {
        padding: '0 16px',
      },
    },
  })

  const fadeClass = showLeftFade && showRightFade
    ? 'detail-panel-page__tabs-scroller--fade-both'
    : showLeftFade
      ? 'detail-panel-page__tabs-scroller--fade-left'
      : showRightFade
        ? 'detail-panel-page__tabs-scroller--fade-right'
        : ''

  return (
    <div className="detail-panel-page">
      <div className="detail-panel-page__main">
        <Typography variant="h4" component="h1" color="text.primary" className="detail-panel-page__page-h1" sx={{ margin: 0 }}>
          Detail Panel
        </Typography>

        {isMobile ? (
          <div className="detail-panel-page__page-section-select-shell">
            <FormControl fullWidth size="small" className="detail-panel-page__page-section-select">
              <InputLabel id="dp-page-section-label" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
                Section
              </InputLabel>
              <Select
                labelId="dp-page-section-label"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                IconComponent={() => (
                  <i
                    className="fa-solid fa-chevron-down"
                    style={{
                      fontSize: 12,
                      color: 'var(--mui-palette-text-secondary)',
                      marginRight: 12,
                    }}
                  />
                )}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: TOOLBAR_CONTROL_BG,
                  boxShadow: TOOLBAR_CONTROL_SHADOW,
                  minHeight: 36,
                  height: 36,
                  '& .MuiSelect-select': {
                    fontFamily: 'Figtree, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 600,
                    lineHeight: '24px',
                    color: 'var(--mui-palette-text-primary)',
                    padding: '6px 36px 6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                  '&.Mui-focused': {
                    boxShadow: 'none',
                    outline: '2px solid rgba(33, 31, 38, 0.9)',
                    outlineOffset: '1px',
                  },
                }}
              >
                {PAGE_TABS.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    <i className={t.icon} style={{ fontSize: 16, marginRight: 8 }} />
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        ) : (
          <div className="detail-panel-page__tabs-bar">
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons={false}
              TabIndicatorProps={{ sx: { backgroundColor: 'text.primary', height: 2 } }}
              sx={{
                minHeight: 36,
                '& .MuiTabs-flexContainer': { gap: 0 },
                '& .MuiTab-root': {
                  position: 'relative',
                  minHeight: 36,
                  padding: '0 8px',
                  textTransform: 'none',
                  fontFamily: 'Figtree, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 600,
                  lineHeight: '24px',
                  color: 'text.secondary',
                  '&.Mui-selected': { color: 'text.primary' },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 2,
                    backgroundColor: (theme) => theme.palette.divider,
                    opacity: 0,
                    pointerEvents: 'none',
                  },
                  '&:hover:not(.Mui-selected)::after': { opacity: 1 },
                },
              }}
              slotProps={{
                scroller: {
                  ref: scrollerRef,
                  className: `detail-panel-page__tabs-scroller ${fadeClass}`,
                },
              }}
            >
              {PAGE_TABS.map((t) => (
                <Tab
                  key={t.value}
                  value={t.value}
                  label={
                    <span className="detail-panel-page__tab-label">
                      <i className={t.icon} />
                      {t.label}
                    </span>
                  }
                />
              ))}
            </Tabs>
          </div>
        )}

        {activeTab === 'tasks' ? (
          <div className="detail-panel-page__table-container">
            <MaterialReactTable table={table} />
          </div>
        ) : (
          <div className="detail-panel-page__tab-placeholder">
            {PAGE_TABS.find((t) => t.value === activeTab)?.label}
          </div>
        )}
      </div>
      <RightSidebar />
      <FiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filterTaskTypes={filterTaskTypes}
        setFilterTaskTypes={setFilterTaskTypes}
        taskTypeOptions={taskTypeOptions}
        filterAssignees={filterAssignees}
        setFilterAssignees={setFilterAssignees}
        assigneeOptions={assigneeOptions}
        filterStatuses={filterStatuses}
        setFilterStatuses={setFilterStatuses}
        statusOptions={statusOptions}
        activeFilterCount={activeFilterCount}
        onReset={handleResetFilters}
      />
      {!isMobileBulkEdit && (
        <BulkEditActionBar selectedCount={selectedCount} onClose={handleClearSelection} />
      )}
      {isMobileBulkEdit && (
        <BulkEditDrawer
          open={selectedCount > 0}
          selectedCount={selectedCount}
          onClose={handleClearSelection}
        />
      )}
    </div>
  )
}

// ── Custom toolbar (reused pattern from other strategies) ────────────────────
function CustomToolbar({ table, tabValue, onTabChange, isCompactToolbar, onFiltersOpen, activeFilterCount }) {
  return (
    <div
      className={
        isCompactToolbar
          ? 'detail-panel-page__toolbar-wrapper detail-panel-page__toolbar-wrapper--compact'
          : 'detail-panel-page__toolbar-wrapper'
      }
      style={{ paddingLeft: 0, paddingRight: 0 }}
    >
      <div className="detail-panel-page__header">
        <h2 className="detail-panel-page__title">
          <span className="detail-panel-page__title-avatar" aria-hidden="true">
            <i className="fa-solid fa-list-check detail-panel-page__title-avatar-icon" />
          </span>
          <span className="detail-panel-page__title-text">Tasks</span>
        </h2>
        <div className="detail-panel-page__header-buttons">
          <Button
            variant="contained"
            size="small"
            disableElevation
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px',
              letterSpacing: '0.14px',
              textTransform: 'none',
              borderRadius: '12px',
              height: 36,
              padding: '8px 12px',
              minWidth: 'auto',
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' },
              '&:active': { boxShadow: 'none' },
              '& .MuiButton-startIcon': { marginRight: '4px' },
            }}
            startIcon={<i className="fa-regular fa-plus detail-panel-page__add-icon" />}
          >
            Add
          </Button>
        </div>
      </div>

      <div className="detail-panel-page__toolbar-grouping-row" style={{ paddingLeft: 0, paddingRight: 0 }}>
        {isCompactToolbar ? (
          <FormControl size="small" className="detail-panel-page__toolbar-grouping-select">
            <Select
              value={tabValue}
              onChange={(event) => onTabChange(event.target.value)}
              IconComponent={() => (
                <i
                  className="fa-solid fa-chevron-down"
                  style={{
                    fontSize: 12,
                    color: 'var(--mui-palette-text-secondary)',
                    marginRight: 8,
                  }}
                />
              )}
              sx={{
                borderRadius: TOOLBAR_CONTROL_RADIUS,
                backgroundColor: TOOLBAR_CONTROL_BG,
                boxShadow: TOOLBAR_CONTROL_SHADOW,
                minHeight: 28,
                height: 28,
                '& .MuiSelect-select': {
                  fontFamily: 'Figtree, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.12px',
                  lineHeight: '20px',
                  color: 'var(--mui-palette-text-primary)',
                  padding: '4px 32px 4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                '&.Mui-focused': {
                  boxShadow: 'none',
                  outline: '2px solid rgba(33, 31, 38, 0.9)',
                  outlineOffset: '1px',
                },
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="groups">Groups</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <ToggleButtonGroup
            value={tabValue}
            exclusive
            onChange={(_, val) => val && onTabChange(val)}
            size="small"
            sx={{
              backgroundColor: TOOLBAR_CONTROL_BG,
              borderRadius: TOOLBAR_CONTROL_RADIUS,
              padding: '2px',
              gap: 0,
              minHeight: '28px',
              height: '28px',
              boxShadow: TOOLBAR_CONTROL_SHADOW,
              '& .MuiToggleButtonGroup-grouped': {
                border: 'none',
                borderRadius: '8px !important',
                padding: '2px 8px',
                fontFamily: 'Figtree, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.12px',
                textTransform: 'none',
                gap: '4px',
                lineHeight: '20px',
                color: 'var(--mui-palette-text-secondary)',
                backgroundColor: 'transparent',
                minHeight: '24px',
                height: '24px',
                '&.Mui-selected': {
                  backgroundColor: 'var(--mui-palette-accent-mauve-5)',
                  color: 'var(--mui-palette-text-primary)',
                },
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
            }}
          >
            <ToggleButton value="groups">Groups</ToggleButton>
            <ToggleButton value="all">All</ToggleButton>
          </ToggleButtonGroup>
        )}
      </div>

      <div className="detail-panel-page__toolbar">
        <div className="detail-panel-page__toolbar-search">
          <MRT_GlobalFilterTextField table={table} />
        </div>
        <div className="detail-panel-page__toolbar-filters">
          {isCompactToolbar && (
            <Badge
              variant="dot"
              invisible={activeFilterCount === 0}
              overlap="circular"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: 'var(--mui-palette-text-primary, rgba(2, 0, 10, 0.88))',
                  width: 8,
                  height: 8,
                  minWidth: 8,
                  borderRadius: '50%',
                  top: 2,
                  right: 2,
                },
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={onFiltersOpen}
                sx={{
                  border: '1px solid transparent',
                  backgroundColor: TOOLBAR_CONTROL_BG,
                  borderRadius: TOOLBAR_CONTROL_RADIUS,
                  height: 28,
                  width: 28,
                  minWidth: 'auto',
                  padding: 0,
                  color: 'var(--mui-palette-text-secondary)',
                  boxShadow: TOOLBAR_CONTROL_SHADOW,
                  '&:hover': { backgroundColor: TOOLBAR_CONTROL_BG },
                }}
              >
                <i className="fa-regular fa-filters" style={{ fontSize: 12 }} />
              </Button>
            </Badge>
          )}
          {!isCompactToolbar && (
            <Button
              variant="outlined"
              size="small"
              endIcon={<i className="fa-regular fa-angles-up-down" style={{ fontSize: 12, color: 'var(--mui-palette-text-secondary)' }} />}
              sx={{
                fontFamily: 'Figtree, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12px',
                textTransform: 'none', borderColor: 'transparent', backgroundColor: TOOLBAR_CONTROL_BG,
                color: 'var(--mui-palette-text-primary)', borderRadius: TOOLBAR_CONTROL_RADIUS,
                padding: '4px 12px', minWidth: 'auto', lineHeight: '20px', height: 28,
                boxShadow: TOOLBAR_CONTROL_SHADOW,
                '&:hover': { borderColor: 'transparent', backgroundColor: TOOLBAR_CONTROL_BG, boxShadow: TOOLBAR_CONTROL_SHADOW },
                '& .MuiButton-endIcon': { marginLeft: '6px' },
              }}
            >
              Task type
            </Button>
          )}
          {!isCompactToolbar && (
            <Button
              variant="outlined"
              size="small"
              endIcon={<i className="fa-regular fa-angles-up-down" style={{ fontSize: 12, color: 'var(--mui-palette-text-secondary)' }} />}
              sx={{
                fontFamily: 'Figtree, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12px',
                textTransform: 'none', borderColor: 'transparent', backgroundColor: TOOLBAR_CONTROL_BG,
                color: 'var(--mui-palette-text-primary)', borderRadius: TOOLBAR_CONTROL_RADIUS,
                padding: '4px 12px', minWidth: 'auto', lineHeight: '20px', height: 28,
                boxShadow: TOOLBAR_CONTROL_SHADOW,
                '&:hover': { borderColor: 'transparent', backgroundColor: TOOLBAR_CONTROL_BG, boxShadow: TOOLBAR_CONTROL_SHADOW },
                '& .MuiButton-endIcon': { marginLeft: '6px' },
              }}
            >
              Assignee
            </Button>
          )}
          {!isCompactToolbar && (
            <Button
              variant="outlined"
              size="small"
              endIcon={<i className="fa-regular fa-angles-up-down" style={{ fontSize: 12, color: 'var(--mui-palette-text-secondary)' }} />}
              sx={{
                fontFamily: 'Figtree, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12px',
                textTransform: 'none', borderColor: 'transparent', backgroundColor: TOOLBAR_CONTROL_BG,
                color: 'var(--mui-palette-text-primary)', borderRadius: TOOLBAR_CONTROL_RADIUS,
                padding: '4px 12px', minWidth: 'auto', lineHeight: '20px', height: 28,
                boxShadow: TOOLBAR_CONTROL_SHADOW,
                '&:hover': { borderColor: 'transparent', backgroundColor: TOOLBAR_CONTROL_BG, boxShadow: TOOLBAR_CONTROL_SHADOW },
                '& .MuiButton-endIcon': { marginLeft: '6px' },
              }}
            >
              Status
            </Button>
          )}
          <MRT_ShowHideColumnsButton
            table={table}
            size="small"
            sx={{
              border: '1px solid transparent',
              backgroundColor: TOOLBAR_CONTROL_BG,
              borderRadius: TOOLBAR_CONTROL_RADIUS,
              height: 28,
              width: 28,
              minWidth: 'auto',
              padding: 0,
              color: 'var(--mui-palette-text-secondary)',
              boxShadow: TOOLBAR_CONTROL_SHADOW,
              '&:hover': { backgroundColor: TOOLBAR_CONTROL_BG },
            }}
          />
          {!isCompactToolbar && (
            <Button
              variant="text"
              size="small"
              disabled
              sx={{
                fontFamily: 'Figtree, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12px',
                textTransform: 'none', color: 'var(--mui-palette-text-secondary)',
                borderRadius: '12px', padding: '4px 12px', minWidth: 'auto', lineHeight: '20px', height: 28,
                opacity: 1,
                '&.Mui-disabled': { color: 'var(--mui-palette-text-secondary)', opacity: 1 },
                '&:hover': { backgroundColor: 'transparent' },
              }}
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
