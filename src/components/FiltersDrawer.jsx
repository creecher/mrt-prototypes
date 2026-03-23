import { Autocomplete, Avatar, Checkbox, Chip, Drawer, TextField } from '@mui/material'
import { TASK_TYPE_CHIP_STYLES, STATUS_COLORS } from '../data/taskData'
import './FiltersDrawer.css'

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function ChevronIcon(props) {
  return (
    <i
      className="fa-regular fa-chevrons-up-down"
      style={{
        fontSize: 14,
        color: 'var(--mui-palette-text-secondary)',
        pointerEvents: 'none',
      }}
      {...props}
    />
  )
}

export default function FiltersDrawer({
  open,
  onClose,
  filterTaskTypes,
  setFilterTaskTypes,
  taskTypeOptions,
  filterAssignees,
  setFilterAssignees,
  assigneeOptions,
  filterStatuses,
  setFilterStatuses,
  statusOptions,
  activeFilterCount,
  onReset,
}) {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: 'filters-drawer',
      }}
    >
      {/* Header */}
      <div className="filters-drawer__header">
        <div className="filters-drawer__title-row">
          <h2 className="filters-drawer__title">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="filters-drawer__badge">{activeFilterCount}</span>
          )}
        </div>
        <button type="button" className="filters-drawer__reset-btn" onClick={onReset}>
          Reset all
        </button>
        <button
          type="button"
          className="filters-drawer__close-btn"
          onClick={onClose}
          aria-label="Close filters"
        >
          <i className="fa-regular fa-xmark" />
        </button>
      </div>

      {/* Filter fields */}
      <div className="filters-drawer__body">
        {/* Task type — Autocomplete */}
        <div className="filters-drawer__field">
          <label className="filters-drawer__label">Task type</label>
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={taskTypeOptions}
            value={filterTaskTypes}
            onChange={(_, val) => setFilterTaskTypes(val)}
            popupIcon={<ChevronIcon />}
            renderOption={(props, option) => {
              const style = TASK_TYPE_CHIP_STYLES[option] || {}
              return (
                <li {...props} key={option} className="filters-drawer__option">
                  <span
                    className="filters-drawer__option-icon"
                    style={{ backgroundColor: style.bg, color: style.color }}
                  >
                    <i className={style.icon} style={{ fontSize: 12 }} />
                  </span>
                  <span className="filters-drawer__option-label">{option}</span>
                </li>
              )
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const style = TASK_TYPE_CHIP_STYLES[option] || {}
                const { key, ...tagProps } = getTagProps({ index })
                return (
                  <Chip
                    key={key}
                    label={option}
                    size="small"
                    icon={
                      <span
                        className="filters-drawer__chip-icon"
                        style={{ backgroundColor: style.bg, color: style.color }}
                      >
                        <i className={style.icon} style={{ fontSize: 10 }} />
                      </span>
                    }
                    deleteIcon={<i className="fa-regular fa-xmark" style={{ fontSize: 10 }} />}
                    className="filters-drawer__chip"
                    {...tagProps}
                    onDelete={tagProps.onDelete}
                  />
                )
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={filterTaskTypes.length === 0 ? 'Select task types' : ''}
                size="small"
              />
            )}
            className="filters-drawer__autocomplete"
          />
        </div>

        {/* Assignee — Autocomplete */}
        <div className="filters-drawer__field">
          <label className="filters-drawer__label">Assignee</label>
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={assigneeOptions}
            value={filterAssignees}
            onChange={(_, val) => setFilterAssignees(val)}
            popupIcon={<ChevronIcon />}
            renderOption={(props, option) => (
              <li {...props} key={option} className="filters-drawer__option">
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    bgcolor: 'var(--mui-palette-accent-plum-3)',
                    color: 'var(--mui-palette-accent-plum-11)',
                    border: '1px solid var(--mui-palette-accent-plum-6)',
                  }}
                >
                  {getInitials(option)}
                </Avatar>
                <span className="filters-drawer__option-label">{option}</span>
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index })
                return (
                  <Chip
                    key={key}
                    label={option}
                    size="small"
                    avatar={
                      <Avatar
                        sx={{
                          width: '20px !important',
                          height: '20px !important',
                          fontSize: '0.6rem !important',
                          fontWeight: 600,
                          bgcolor: 'var(--mui-palette-accent-plum-3)',
                          color: 'var(--mui-palette-accent-plum-11) !important',
                          border: '1px solid var(--mui-palette-accent-plum-6)',
                        }}
                      >
                        {getInitials(option)}
                      </Avatar>
                    }
                    deleteIcon={<i className="fa-regular fa-xmark" style={{ fontSize: 10 }} />}
                    className="filters-drawer__chip"
                    {...tagProps}
                    onDelete={tagProps.onDelete}
                  />
                )
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={filterAssignees.length === 0 ? 'Select assignees' : ''}
                size="small"
              />
            )}
            className="filters-drawer__autocomplete"
          />
        </div>

        {/* Status — Autocomplete with checkboxes */}
        <div className="filters-drawer__field">
          <label className="filters-drawer__label">Status</label>
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={statusOptions}
            value={filterStatuses}
            onChange={(_, val) => setFilterStatuses(val)}
            popupIcon={<ChevronIcon />}
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option} className="filters-drawer__option filters-drawer__option--status">
                <Checkbox
                  checked={selected}
                  size="small"
                  sx={{
                    padding: '2px',
                    '&.Mui-checked': { color: 'var(--mui-palette-text-primary)' },
                  }}
                />
                <span
                  className="filters-drawer__status-dot"
                  style={{ backgroundColor: STATUS_COLORS[option] }}
                />
                <span className="filters-drawer__option-label">{option}</span>
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index })
                return (
                  <Chip
                    key={key}
                    label={
                      <span className="filters-drawer__status-chip-label">
                        <span
                          className="filters-drawer__status-dot"
                          style={{ backgroundColor: STATUS_COLORS[option] }}
                        />
                        {option}
                      </span>
                    }
                    size="small"
                    deleteIcon={<i className="fa-regular fa-xmark" style={{ fontSize: 10 }} />}
                    className="filters-drawer__chip"
                    {...tagProps}
                    onDelete={tagProps.onDelete}
                  />
                )
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={filterStatuses.length === 0 ? 'Select statuses' : ''}
                size="small"
              />
            )}
            className="filters-drawer__autocomplete"
          />
        </div>
      </div>
    </Drawer>
  )
}
