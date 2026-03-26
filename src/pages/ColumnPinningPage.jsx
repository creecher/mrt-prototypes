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
import './ColumnPinningPage.css'

const TOOLBAR_CONTROL_BG = 'var(--mui-palette-background-paperElevation3, white)'
const TOOLBAR_CONTROL_RADIUS = '8px'
const TOOLBAR_CONTROL_SHADOW =
  '0px 0px 0px 1px var(--mui-palette-component-input-dividerDefault, rgba(20,0,53,0.15)), 0px 1px 3px 0px rgba(33,31,38,0.1), 0px 1px 2px -1px rgba(33,31,38,0.1)'
const SHADOW_EDGE_GUTTER = '2px'

const TABLE_CARD_SHADOW =
  '0 0 0 1px rgba(32, 0, 56, 0.10), 0 1px 3px 0 rgba(33, 31, 38, 0.10), 0 1px 2px -1px rgba(33, 31, 38, 0.10)'


function FaSearchIcon() {
  return (
    <i
      className="fa-solid fa-search"
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

const PAGE_TABS = [
  { value: 'tasks', icon: 'fa-regular fa-list-check', label: 'Tasks' },
  { value: 'notes', icon: 'fa-regular fa-memo-pad', label: 'Notes' },
  { value: 'documents', icon: 'fa-regular fa-files', label: 'Documents' },
  { value: 'outgoing-referrals', icon: 'fa-regular fa-phone-arrow-up-right', label: 'Outgoing referrals' },
  { value: 'team', icon: 'fa-regular fa-people-group', label: 'Team' },
]

export default function ColumnPinningPage() {
  const theme = useTheme()
  const isCompactToolbar = useMediaQuery('(max-width: 1199px)')
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isMobileBulkEdit = useMediaQuery(theme.breakpoints.down('md'))

  const [rowSelection, setRowSelection] = useState({})
  const [tabValue, setTabValue] = useState('all')
  const [activeTab, setActiveTab] = useState('tasks')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [filterTaskTypes, setFilterTaskTypes] = useState([])
  const [filterAssignees, setFilterAssignees] = useState([])
  const [filterStatuses, setFilterStatuses] = useState([])

  const taskTypeOptions = useMemo(() => [...new Set(TASK_DATA.map((r) => r.taskType))], [])
  const assigneeOptions = useMemo(() => [...new Set(TASK_DATA.flatMap((r) => r.assignees))].sort(), [])
  const statusOptions = useMemo(() => ['Not started', 'In progress'], [])

  const activeFilterCount = [filterTaskTypes, filterAssignees, filterStatuses].filter((a) => a.length > 0).length
  const selectedCount = Object.keys(rowSelection).length
  const handleClearSelection = useCallback(() => setRowSelection({}), [])

  const filteredData = useMemo(() => {
    return TASK_DATA.filter((row) => {
      if (filterTaskTypes.length && !filterTaskTypes.includes(row.taskType)) return false
      if (filterAssignees.length && !row.assignees.some((a) => filterAssignees.includes(a))) return false
      if (filterStatuses.length && !filterStatuses.includes(row.taskStatus)) return false
      return true
    })
  }, [filterTaskTypes, filterAssignees, filterStatuses])

  const handleResetFilters = useCallback(() => {
    setFilterTaskTypes([])
    setFilterAssignees([])
    setFilterStatuses([])
  }, [])

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
        size: 250,
        grow: true,
        Cell: ({ cell }) => (
          <span className="column-pinning-page__task-name">
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'taskType',
        header: 'Task type',
        size: 221,
        Cell: () => {
          const style = TASK_TYPE_CHIP_STYLES['Recup Referral Coordinator']
          return (
            <span
              className="column-pinning-page__chip"
              style={{
                backgroundColor: style.bg,
                color: style.color,
                border: `1px solid ${style.borderColor || 'transparent'}`,
              }}
            >
              <i className={style.icon} style={{ fontSize: 12 }} />
              Recup Referral Coordinator
            </span>
          )
        },
      },
      {
        accessorKey: 'dueDate',
        header: 'Due date',
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue()
          const overdue = isOverdue(value)
          return (
            <span className={`column-pinning-page__date ${overdue ? 'column-pinning-page__date--overdue' : ''}`}>
              {overdue && <i className="fa-solid fa-alarm-clock" />}
              {formatDate(value)}
            </span>
          )
        },
      },
      {
        accessorKey: 'assignees',
        header: 'Assignee',
        size: 180,
        enableSorting: false,
        Cell: ({ cell }) => {
          const assignees = cell.getValue()
          return (
            <div className="column-pinning-page__assignees-cell">
              <AvatarGroup
                max={3}
                className="column-pinning-page__assignees-group"
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
        size: 180,
        Cell: ({ cell }) => {
          const raw = cell.getValue()
          const value =
            raw === 'In progress' ? 'In progress' : 'Not started'
          const color = STATUS_COLORS[value]
          return (
            <Button
              type="button"
              variant="outlined"
              size="small"
              tabIndex={-1}
              disableRipple
              className="column-pinning-page__status-button"
              endIcon={
                <i
                  className="fa-solid fa-angles-up-down"
                  style={{
                    fontSize: 12,
                    color: 'var(--mui-palette-text-secondary)',
                  }}
                />
              }
              sx={{
                fontFamily: 'Figtree, sans-serif',
                fontSize: '12px',
                fontStyle: 'normal',
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
                '& .MuiButton-endIcon': {
                  marginLeft: 'auto',
                },
                '&:hover': {
                  borderColor: 'transparent',
                  backgroundColor: TOOLBAR_CONTROL_BG,
                  boxShadow: TOOLBAR_CONTROL_SHADOW,
                },
              }}
            >
              <span className="column-pinning-page__status-leading">
                <span
                  className="column-pinning-page__status-dot"
                  style={{ backgroundColor: color }}
                />
                <span className="column-pinning-page__status-label">{value}</span>
              </span>
            </Button>
          )
        },
      },
    ],
    []
  )

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    enableRowSelection: true,
    enableColumnPinning: true,
    enableColumnOrdering: false,
    enableColumnResizing: false,
    enableStickyHeader: true,
    mrtTheme: {
      baseBackgroundColor: '#FFF',
      selectedRowBackgroundColor: '#EDECF0',
    },
    initialState: {
      showGlobalFilter: true,
      density: 'comfortable',
    },
    icons: {
      SearchIcon: FaSearchIcon,
      CloseIcon: FaCloseIcon,
      ViewColumnIcon: FaViewColumnIcon,
    },
    muiSearchTextFieldProps: {
      InputProps: {
        startAdornment: (
          <InputAdornment position="start">
            <i
              className="fa-solid fa-search"
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
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
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
    renderToolbarInternalActions: () => null,
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
        paddingInline: 0,
        overflow: 'visible',
        minWidth: 0,
        maxWidth: '100%',
      },
    },
    muiTableContainerProps: {
      className: 'column-pinning-page__table-scroll',
      sx: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        maxWidth: '100%',
        maxHeight: '70vh',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '0 0 5px',
      },
    },
    muiTableProps: {
      sx: {
        borderCollapse: 'separate',
        borderSpacing: 0,
        width: '100%',
        minWidth: 900,
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
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 600,
        fontSize: '0.875rem',
        letterSpacing: 0,
        lineHeight: '20px',
        color: 'var(--mui-palette-text-secondary)',
        height: 44,
        padding: '0 16px',
        borderBottom: 'none',
        textTransform: 'none',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: '20px',
        color: 'var(--mui-palette-text-primary)',
        height: 48,
        padding: '0 16px',
        borderBottom: '1px solid var(--mui-palette-divider)',
      },
    },
    muiTableBodyRowProps: {
      sx: {
        backgroundColor: '#FFF',
        boxShadow: 'none',
        '&:last-child td': {
          borderBottom: 'none',
        },
      },
    },
    muiSelectCheckboxProps: {
      sx: {
        padding: '0 16px',
      },
    },
  })

  const fadeClass = showLeftFade && showRightFade
    ? 'column-pinning-page__tabs-scroller--fade-both'
    : showLeftFade
      ? 'column-pinning-page__tabs-scroller--fade-left'
      : showRightFade
        ? 'column-pinning-page__tabs-scroller--fade-right'
        : ''

  return (
    <div className="column-pinning-page">
      <div className="column-pinning-page__main">
      <Typography variant="h4" component="h1" color="text.primary" className="column-pinning-page__page-h1" sx={{ margin: 0 }}>
        Column Pinning
      </Typography>

      {/* Page-level tabs */}
      {isMobile ? (
        <div className="column-pinning-page__page-section-select-shell">
        <FormControl fullWidth size="small" className="column-pinning-page__page-section-select">
          <InputLabel id="pinning-page-section-label" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            Section
          </InputLabel>
          <Select
            labelId="pinning-page-section-label"
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
        <div className="column-pinning-page__tabs-bar">
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons={false}
            TabIndicatorProps={{ sx: { backgroundColor: 'text.primary', height: 2 } }}
            sx={{
              minHeight: 36,
              '@media (hover: hover) and (pointer: fine)': {
                '& .MuiTab-root::after': {
                  transition: 'opacity 0.2s ease',
                },
              },
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
                '&:hover:not(.Mui-selected)::after': {
                  opacity: 1,
                },
              },
            }}
            slotProps={{
              scroller: {
                ref: scrollerRef,
                className: `column-pinning-page__tabs-scroller ${fadeClass}`,
              },
            }}
          >
            {PAGE_TABS.map((t) => (
              <Tab
                key={t.value}
                value={t.value}
                label={
                  <span className="column-pinning-page__tab-label">
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
        <div className="column-pinning-page__table-container">
          <MaterialReactTable table={table} />
        </div>
      ) : (
        <div className="column-pinning-page__tab-placeholder">
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

function CustomToolbar({ table, tabValue, onTabChange, isCompactToolbar, onFiltersOpen, activeFilterCount }) {
  return (
    <div
      className={
        isCompactToolbar
          ? 'column-pinning-page__toolbar-wrapper column-pinning-page__toolbar-wrapper--compact'
          : 'column-pinning-page__toolbar-wrapper'
      }
      style={{ paddingLeft: 0, paddingRight: 0 }}
    >
      {/* Row 1: Page header */}
      <div className="column-pinning-page__header">
        <h2 className="column-pinning-page__title">
          <span className="column-pinning-page__title-avatar" aria-hidden="true">
            <i className="fa-solid fa-thumbtack column-pinning-page__title-avatar-icon" />
          </span>
          <span className="column-pinning-page__title-text">Tasks</span>
        </h2>
        <div className="column-pinning-page__header-buttons">
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
              '& .MuiButton-startIcon': {
                marginRight: '4px',
              },
            }}
            startIcon={<i className="fa-regular fa-plus column-pinning-page__add-icon" />}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Row 2: All/Groups */}
      <div className="column-pinning-page__toolbar-grouping-row" style={{ paddingLeft: 0, paddingRight: 0 }}>
        {isCompactToolbar ? (
          <FormControl size="small" className="column-pinning-page__toolbar-grouping-select">
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
                  fontStyle: 'normal',
                  fontWeight: 600,
                  letterSpacing: '0.12px',
                  lineHeight: '20px',
                  color: 'var(--mui-palette-text-primary)',
                  padding: '4px 32px 4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
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
                fontStyle: 'normal',
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
            <ToggleButton value="groups">
              Groups
            </ToggleButton>
            <ToggleButton value="all">
              All
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </div>

      {/* Row 3: Search + filters */}
      <div className="column-pinning-page__toolbar">
        <div className="column-pinning-page__toolbar-search">
          <MRT_GlobalFilterTextField table={table} />
        </div>
        <div className="column-pinning-page__toolbar-filters">
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
            endIcon={
              <i
                className="fa-solid fa-angles-up-down"
                style={{ fontSize: 12, color: 'var(--mui-palette-text-secondary)' }}
              />
            }
            sx={{
              fontFamily: 'Figtree, sans-serif',
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 600,
              letterSpacing: '0.12px',
              textTransform: 'none',
              borderColor: 'transparent',
              backgroundColor: TOOLBAR_CONTROL_BG,
              color: 'var(--mui-palette-text-primary)',
              borderRadius: TOOLBAR_CONTROL_RADIUS,
              padding: '4px 12px',
              minWidth: 'auto',
              lineHeight: '20px',
              height: 28,
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
            endIcon={
              <i
                className="fa-solid fa-angles-up-down"
                style={{ fontSize: 12, color: 'var(--mui-palette-text-secondary)' }}
              />
            }
            sx={{
              fontFamily: 'Figtree, sans-serif',
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 600,
              letterSpacing: '0.12px',
              textTransform: 'none',
              borderColor: 'transparent',
              backgroundColor: TOOLBAR_CONTROL_BG,
              color: 'var(--mui-palette-text-primary)',
              borderRadius: TOOLBAR_CONTROL_RADIUS,
              padding: '4px 12px',
              minWidth: 'auto',
              lineHeight: '20px',
              height: 28,
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
            endIcon={
              <i
                className="fa-solid fa-angles-up-down"
                style={{ fontSize: 12, color: 'var(--mui-palette-text-secondary)' }}
              />
            }
            sx={{
              fontFamily: 'Figtree, sans-serif',
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 600,
              letterSpacing: '0.12px',
              textTransform: 'none',
              borderColor: 'transparent',
              backgroundColor: TOOLBAR_CONTROL_BG,
              color: 'var(--mui-palette-text-primary)',
              borderRadius: TOOLBAR_CONTROL_RADIUS,
              padding: '4px 12px',
              minWidth: 'auto',
              lineHeight: '20px',
              height: 28,
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
              fontFamily: 'Figtree, sans-serif',
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 600,
              letterSpacing: '0.12px',
              textTransform: 'none',
              color: 'var(--mui-palette-text-secondary)',
              borderRadius: '12px',
              padding: '4px 12px',
              minWidth: 'auto',
              lineHeight: '20px',
              height: 28,
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
