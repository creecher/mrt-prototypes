# Strategy 3: Responsive Table with Mobile Detail Panel
### Claude Code Build Guide — Material React Table V3

> **This is the revised definitive build guide.** Updated to match the approved mockup design. Key changes from the previous version: rows are collapsed by default (user taps to expand), breakpoint is XS+SM only (below `md` / 900px), expand chevron is on the right of each row, all touch targets are minimum 44px, and the detail panel has no left border accent.

---

## What You're Building

### XS + SM (below 900px — phones and small tablets)

Based on the three states in the approved mockup:

**Closed state** — all rows collapsed by default
- Single visible column: task name, truncated with ellipsis
- Each row has a checkbox on the far left and a right-pointing chevron `›` on the far right
- Rows start collapsed — user must tap a row or its chevron to open it
- Row height is ~52px minimum for touch friendliness

**Open state** — one row expanded
- Tapping a row expands it in place; all other rows remain collapsed
- The chevron rotates from `›` to `∨`
- A detail panel slides open beneath the row showing: Task type, Due date, Assignee, Status
- Each field is on its own full-width row — label left (fixed ~90px), value right (flex)
- Detail panel has a plain white background — no coloured left border accent
- Status renders as a full-width rounded pill (dot + label + up/down chevron) that opens a dropdown to change status

**Open Selected state** — row expanded and checked
- Checkbox is filled/checked
- Header checkbox shows indeterminate (dash) when some but not all rows are selected
- Selected row has a subtle background tint
- Bulk action bar appears above the table when any row is selected

### MD and above (900px+)
- Full MRT table with all columns visible
- Status column renders as a MUI `Chip`
- Expand chevron visible (right side)
- Detail panels collapsed by default

---

## UX Rules — Read Before Building

These are non-negotiable, derived directly from the approved mockup:

1. **Rows are collapsed by default.** Do NOT set `state.expanded: true`. Pass `state.expanded: {}` so the user controls expansion by tapping individual rows.
2. **Expand chevron is on the RIGHT.** Use `positionExpandColumn: 'last'` to override MRT's default left-side placement.
3. **Checkbox is on the LEFT.** MRT default — do not reorder.
4. **Checkbox = bulk selection only.** It does not mark a task complete or change status.
5. **All tap targets are minimum 44px.** Apply padding to checkbox and chevron cells so the interactive area is always at least 44×44px.
6. **Breakpoint is `theme.breakpoints.down('md')`** — applies to xs and sm (0–899px). Above 899px shows the full desktop table.
7. **Status changes via the status pill.** The pill in the detail panel opens a dropdown. Selecting an option updates the row and closes the menu.
8. **Detail panel has no left border accent.** Background is white, matching the card surface.
9. **Status state is managed locally** with `useState`. In production, replace `setData` with an API mutation.

---

## Visual Specification from Mockup

### Page layout
- White card container with `border-radius: 12px`, sitting inside a soft lavender/purple gradient page background
- Top bar: hamburger icon | "LB Recup" title with document icon | user avatar (right)
- "Case status" section above tasks: bold label + "Pending" badge pill + edit icon
- Tasks section header: list icon + "Tasks" bold label + black "+ Add" button right-aligned
- Full-width "All" filter dropdown below the section header
- Toolbar row: rounded search input (flex: 1) + filter icon button + columns icon button

### Task row anatomy (mobile)
```
[ ☐ 44px ] [ Task name — truncated ellipsis, flex:1, font 14px/500 ] [ › 44px ]
```
- Minimum row height: `52px`
- Checkbox cell: `minWidth: 44px`, centered, padding expands hit area to 44px
- Chevron cell: `minWidth: 44px`, centered, padding expands hit area to 44px, rotates 90° when open
- Column header: same structure — checkbox left, "Task ↕" sort label, no chevron header cell content needed

### Detail panel anatomy (mobile)
```
Task type   [ Recup Referral Coordinator badge ]
Due date    [ 6/7/2025 🔔 ]
Assignee    [ avatar stack ]
Status      [ ● In progress   ⌃⌄  ]
```
- Each field: `minHeight: 44px`, `display: flex`, `alignItems: center`
- Label column: `minWidth: 90px`, `flexShrink: 0`, `fontSize: 13px`, `fontWeight: 500`
- Value column: `flex: 1`
- Thin `0.5px` divider between each field row (last row has none)
- Panel background: `background.paper` (white) — no left border, no coloured accent

### Task type badge
- Background: `#FAF0C8`, text: `#7A5C00`
- Small amber square dot: `8×8px`, `border-radius: 2px`, `background: #C49400`
- `fontSize: 11px`, `fontWeight: 500`, `padding: 2px 10px`, `border-radius: 20px`

### Due date
- Overdue: `color: #A32D2D`, `fontWeight: 500`, bell icon after the date
- Not overdue: `color: text.primary`, normal weight

### Assignee avatars
- Circular, `28×28px`, overlap with `margin-right: -8px`, `border: 2px solid white`
- Show max 3, then "+N" overflow label with `margin-left: 16px`

### Status pill
- Full width on the right side of its detail row
- `border: 1px solid divider`, `border-radius: 20px`, `padding: 6px 12px`, `minHeight: 36px`
- Left: coloured dot `8×8px, border-radius: 50%`
- Centre: status label `fontSize: 13px`, `flex: 1`
- Right: up/down chevron (two CSS triangles stacked, 3px gap)

### Checkbox states
- Unchecked: `border: 1.5px solid #ccc`, `border-radius: 4px`, white fill
- Checked: filled, white checkmark — match your existing app checkbox style
- Indeterminate header: dash icon in filled state (MUI default behaviour)
- Selected row: subtle background `rgba(0,0,0,0.03)`

---

## Breakpoint Setup

Use MUI's theme-aware helper. This is the single variable that drives all responsive behaviour — change it in one place to adjust both breakpoints.

```jsx
import { useMediaQuery, useTheme } from '@mui/material'

const theme = useTheme()
const isCompact = useMediaQuery(theme.breakpoints.down('md'))
// isCompact = true  → xs + sm (0–899px)  → mobile detail panel view
// isCompact = false → md and above        → full desktop table
```

> The variable is named `isCompact` rather than `isMobile` because this also applies to small tablets (SM breakpoint).

---

## Data Shape

```js
{
  id: 1,
  name: 'Upload all referral documents',   // always visible on mobile
  taskType: 'Recup Referral Coordinator',  // shown as yellow badge in panel
  dueDate: '6/7/2025',                     // red + bell icon if overdue
  overdue: true,                           // boolean — drives due date colour
  assignees: [
    { initials: 'AJ', colorClass: 'av1' },
    { initials: 'BS', colorClass: 'av2' },
  ],
  extraAssignees: null,                    // e.g. '+5' string, or null
  status: 'not_started',                  // key into STATUSES config
}
```

---

## Status Configuration

```js
const STATUSES = [
  { key: 'not_started', label: 'Not started', color: '#E24B4A', chipColor: 'default' },
  { key: 'in_progress', label: 'In progress', color: '#378ADD', chipColor: 'info'    },
  { key: 'completed',   label: 'Completed',   color: '#3B6D11', chipColor: 'success' },
  { key: 'blocked',     label: 'Blocked',     color: '#888888', chipColor: 'warning' },
]
function getStatus(key) { return STATUSES.find(s => s.key === key) }
```

---

## Avatar Colour Classes

Define in a `<style>` tag in the component or a `.module.css` file. Assign `colorClass` to each assignee — derive from user ID if pulling from an API: `'av' + ((userId % 5) + 1)`.

```css
.av1 { background: #B5D4F4; color: #0C447C; }
.av2 { background: #9FE1CB; color: #085041; }
.av3 { background: #F4C0D1; color: #72243E; }
.av4 { background: #CECBF6; color: #26215C; }
.av5 { background: #FAC775; color: #633806; }
```

---

## Full Component — `src/App.jsx`

```jsx
import { useMemo, useState, useRef, useEffect } from 'react'
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table'
import {
  Box,
  Chip,
  CssBaseline,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

// ─── Status config ──────────────────────────────────────────────────────────
const STATUSES = [
  { key: 'not_started', label: 'Not started', color: '#E24B4A', chipColor: 'default' },
  { key: 'in_progress', label: 'In progress', color: '#378ADD', chipColor: 'info'    },
  { key: 'completed',   label: 'Completed',   color: '#3B6D11', chipColor: 'success' },
  { key: 'blocked',     label: 'Blocked',     color: '#888888', chipColor: 'warning' },
]
function getStatus(key) { return STATUSES.find(s => s.key === key) }

// ─── Sample data — replace with your real data or API fetch ─────────────────
const INITIAL_DATA = [
  {
    id: 1,
    name: 'Upload all referral documents',
    taskType: 'Recup Referral Coordinator',
    dueDate: '6/7/2025',
    overdue: true,
    assignees: [{ initials: 'AJ', colorClass: 'av1' }, { initials: 'BS', colorClass: 'av2' }],
    extraAssignees: null,
    status: 'not_started',
  },
  {
    id: 2,
    name: 'Gain health plan/other payer authorisation',
    taskType: 'Recup Referral Coordinator',
    dueDate: '6/7/2025',
    overdue: true,
    assignees: [{ initials: 'CW', colorClass: 'av3' }],
    extraAssignees: null,
    status: 'not_started',
  },
  {
    id: 3,
    name: 'Gather and upload Referral Packet documents',
    taskType: 'Recup Referral Coordinator',
    dueDate: '6/7/2025',
    overdue: true,
    assignees: [{ initials: 'AJ', colorClass: 'av1' }, { initials: 'BS', colorClass: 'av2' }],
    extraAssignees: null,
    status: 'not_started',
  },
  {
    id: 4,
    name: 'Initiate Intake Task Group in coordination',
    taskType: 'Recup Referral Coordinator',
    dueDate: '6/7/2025',
    overdue: true,
    assignees: [
      { initials: 'AJ', colorClass: 'av1' },
      { initials: 'BS', colorClass: 'av2' },
      { initials: 'CW', colorClass: 'av3' },
    ],
    extraAssignees: '+5',
    status: 'in_progress',
  },
  {
    id: 5,
    name: "Gather client's status, specify care needs",
    taskType: 'Recup Referral Coordinator',
    dueDate: '6/14/2025',
    overdue: false,
    assignees: [{ initials: 'GD', colorClass: 'av4' }],
    extraAssignees: null,
    status: 'not_started',
  },
]

// ─── Avatar stack ────────────────────────────────────────────────────────────
function AvatarStack({ assignees, extraAssignees }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {assignees.slice(0, 3).map((a, i) => (
        <Box
          key={i}
          className={a.colorClass}
          sx={{
            width: 28, height: 28,
            borderRadius: '50%',
            border: '2px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 500,
            marginRight: '-8px',
            flexShrink: 0,
          }}
        >
          {a.initials}
        </Box>
      ))}
      {extraAssignees && (
        <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary', fontSize: 11 }}>
          {extraAssignees}
        </Typography>
      )}
    </Box>
  )
}

// ─── Status pill with inline dropdown ───────────────────────────────────────
function StatusPill({ taskId, statusKey, onStatusChange }) {
  const [open, setOpen] = useState(false)
  const pillRef = useRef(null)
  const s = getStatus(statusKey)

  useEffect(() => {
    function handleOutsideClick(e) {
      if (pillRef.current && !pillRef.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [open])

  return (
    <Box ref={pillRef} sx={{ position: 'relative', flex: 1 }}>
      {/* Pill button */}
      <Box
        onClick={(e) => { e.stopPropagation(); setOpen(prev => !prev) }}
        sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          border: '1px solid', borderColor: 'divider',
          borderRadius: '20px',
          px: 1.5, py: 0.75,
          minHeight: 36,
          cursor: 'pointer',
          userSelect: 'none',
          bgcolor: 'background.paper',
          '&:active': { bgcolor: 'action.hover' },
        }}
      >
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: s.color, flexShrink: 0 }} />
        <Typography variant="body2" sx={{ fontSize: 13, flex: 1 }}>{s.label}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', mr: 0.5 }}>
          <Box sx={{ width: 0, height: 0, borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderBottom: '4px solid #aaa' }} />
          <Box sx={{ width: 0, height: 0, borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderTop: '4px solid #aaa' }} />
        </Box>
      </Box>

      {/* Dropdown */}
      {open && (
        <Box
          sx={{
            position: 'absolute',
            top: 'calc(100% + 4px)', left: 0,
            zIndex: 1300,
            bgcolor: 'background.paper',
            border: '0.5px solid', borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
            minWidth: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {STATUSES.map((st, i) => (
            <Box
              key={st.key}
              onClick={() => { onStatusChange(taskId, st.key); setOpen(false) }}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.25,
                px: 1.5, py: 1,
                minHeight: 44,
                cursor: 'pointer',
                bgcolor: st.key === statusKey ? 'action.selected' : 'transparent',
                borderBottom: i < STATUSES.length - 1 ? '0.5px solid' : 'none',
                borderColor: 'divider',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: st.color, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ fontSize: 13, flex: 1 }}>{st.label}</Typography>
              {st.key === statusKey && (
                <Box component="svg" viewBox="0 0 14 14" fill="none" sx={{ width: 14, height: 14, flexShrink: 0 }}>
                  <path d="M2 7l4 4 6-7" stroke="#378ADD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

// ─── Detail panel card ───────────────────────────────────────────────────────
// CARD_FIELDS drives what appears in the panel and in what order.
// 'key' must match a field name in your data object.
const CARD_FIELDS = [
  { key: 'taskType',  label: 'Task type', type: 'badge'     },
  { key: 'dueDate',   label: 'Due date',  type: 'dueDate'   },
  { key: 'assignees', label: 'Assignee',  type: 'assignees' },
  { key: 'status',    label: 'Status',    type: 'status'    },
]

function MobileDetailPanel({ row, onStatusChange }) {
  return (
    // Plain white background — no left border accent per mockup
    <Box sx={{ bgcolor: 'background.paper', px: 2, pt: 0.5, pb: 1 }}>
      {CARD_FIELDS.map(({ key, label, type }) => (
        <Box
          key={key}
          sx={{
            display: 'flex',
            alignItems: 'center',
            minHeight: 44,
            gap: 1,
            borderBottom: '0.5px solid',
            borderColor: 'divider',
            '&:last-child': { borderBottom: 'none' },
          }}
        >
          {/* Fixed-width label column */}
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, fontSize: 13, minWidth: 90, flexShrink: 0 }}
          >
            {label}
          </Typography>

          {/* Task type badge */}
          {type === 'badge' && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, bgcolor: '#FAF0C8', color: '#7A5C00', fontSize: 11, fontWeight: 500, px: 1.25, py: 0.25, borderRadius: '20px' }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: '#C49400', flexShrink: 0 }} />
              {row.original[key]}
            </Box>
          )}

          {/* Due date */}
          {type === 'dueDate' && (
            <Typography variant="body2" sx={{ fontSize: 13, color: row.original.overdue ? '#A32D2D' : 'text.primary', fontWeight: row.original.overdue ? 500 : 400 }}>
              {row.original[key]}{row.original.overdue ? ' 🔔' : ''}
            </Typography>
          )}

          {/* Assignee avatars */}
          {type === 'assignees' && (
            <AvatarStack assignees={row.original.assignees} extraAssignees={row.original.extraAssignees} />
          )}

          {/* Status pill with dropdown */}
          {type === 'status' && (
            <StatusPill
              taskId={row.original.id}
              statusKey={row.original[key]}
              onStatusChange={onStatusChange}
            />
          )}
        </Box>
      ))}
    </Box>
  )
}

// ─── Bulk action bar ─────────────────────────────────────────────────────────
function BulkActionBar({ count, onClear }) {
  if (count === 0) return null
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#E6F1FB', border: '1px solid #B5D4F4', borderRadius: 1, px: 2, py: 1, mb: 1 }}>
      <Typography variant="body2" fontWeight={500} sx={{ color: '#0C447C', flex: 1 }}>
        {count} selected
      </Typography>
      <Box component="button" sx={{ fontSize: 12, fontWeight: 500, px: 1.5, py: 0.5, borderRadius: 1, border: '0.5px solid #85B7EB', bgcolor: '#fff', color: '#185FA5', cursor: 'pointer' }}>Edit</Box>
      <Box component="button" sx={{ fontSize: 12, fontWeight: 500, px: 1.5, py: 0.5, borderRadius: 1, border: '0.5px solid #F09595', bgcolor: '#fff', color: '#A32D2D', cursor: 'pointer' }}>Delete</Box>
      <Box component="button" onClick={onClear} sx={{ fontSize: 12, fontWeight: 500, px: 1.5, py: 0.5, borderRadius: 1, border: '0.5px solid #ccc', bgcolor: '#fff', color: '#666', cursor: 'pointer' }}>Clear</Box>
    </Box>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function App() {
  const theme = useTheme()

  // Single source of truth for the responsive breakpoint.
  // isCompact = true  → xs + sm (0–899px)
  // isCompact = false → md and above (900px+)
  const isCompact = useMediaQuery(theme.breakpoints.down('md'))

  const [data, setData] = useState(INITIAL_DATA)
  const [rowSelection, setRowSelection] = useState({})
  const selectedCount = Object.keys(rowSelection).length

  function handleStatusChange(taskId, newStatusKey) {
    setData(prev =>
      prev.map(task => task.id === taskId ? { ...task, status: newStatusKey } : task)
    )
    // Production: await updateTaskStatus(taskId, newStatusKey)
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Task',
        Cell: ({ row }) => (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              fontSize: 14,
              lineHeight: 1.3,
              // Compact: single line truncated — row has fixed height
              ...(isCompact && {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }),
            }}
          >
            {row.original.name}
          </Typography>
        ),
      },
      {
        accessorKey: 'taskType',
        header: 'Task type',
        Cell: ({ cell }) => (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, bgcolor: '#FAF0C8', color: '#7A5C00', fontSize: 11, fontWeight: 500, px: 1.25, py: 0.25, borderRadius: '20px' }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: '#C49400', flexShrink: 0 }} />
            {cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: 'dueDate',
        header: 'Due date',
        Cell: ({ row }) => (
          <Typography variant="body2" sx={{ color: row.original.overdue ? '#A32D2D' : 'text.primary', fontWeight: row.original.overdue ? 500 : 400 }}>
            {row.original.dueDate}{row.original.overdue ? ' 🔔' : ''}
          </Typography>
        ),
      },
      {
        accessorKey: 'assignees',
        header: 'Assignee',
        enableSorting: false,
        Cell: ({ row }) => (
          <AvatarStack assignees={row.original.assignees} extraAssignees={row.original.extraAssignees} />
        ),
      },
      {
        accessorKey: 'status',
        header: 'Task status',
        Cell: ({ cell }) => {
          const s = getStatus(cell.getValue())
          return <Chip label={s?.label} size="small" color={s?.chipColor || 'default'} variant="outlined" />
        },
      },
    ],
    [isCompact],
  )

  const table = useMaterialReactTable({
    columns,
    data,

    // ── Bulk row selection ───────────────────────────────────────────────
    enableRowSelection: true,
    state: {
      rowSelection,
      // Hide all columns except 'name' on xs+sm
      columnVisibility: {
        taskType:  !isCompact,
        dueDate:   !isCompact,
        assignees: !isCompact,
        status:    !isCompact,
      },
      // Rows collapsed by default — user taps to expand individual rows.
      // Do NOT change this to `expanded: true`.
      expanded: {},
    },
    onRowSelectionChange: setRowSelection,

    // ── Detail panel ─────────────────────────────────────────────────────
    renderDetailPanel: ({ row }) => (
      <MobileDetailPanel row={row} onStatusChange={handleStatusChange} />
    ),

    // ── Expand chevron on RIGHT — matches mockup ─────────────────────────
    positionExpandColumn: 'last',

    // ── Touch-friendly sizing ────────────────────────────────────────────
    // Minimum row height: 52px
    muiTableBodyRowProps: {
      sx: { minHeight: 52 },
    },
    // Checkbox cell: pad to 44px tap target
    // Chevron cell: pad to 44px tap target
    muiTableBodyCellProps: ({ column }) => ({
      sx: {
        ...(column.id === 'mrt-row-select' && {
          minWidth: 44,
          px: 0.5,
          '& .MuiCheckbox-root': { padding: '10px' },
        }),
        ...(column.id === 'mrt-row-expand' && {
          minWidth: 44,
          px: 0.5,
          '& .MuiIconButton-root': { padding: '10px' },
        }),
      },
    }),
    muiTableHeadCellProps: ({ column }) => ({
      sx: {
        ...(column.id === 'mrt-row-select' && { minWidth: 44, px: 0.5 }),
        ...(column.id === 'mrt-row-expand' && { minWidth: 44, px: 0.5 }),
      },
    }),

    // ── Search, sort, pagination ─────────────────────────────────────────
    enableGlobalFilter: true,
    enableSorting: true,
    enablePagination: true,
    initialState: {
      pagination: { pageSize: 10 },
    },
    positionGlobalFilter: 'left',
    muiSearchTextFieldProps: {
      placeholder: 'Search…',
      size: 'small',
    },

    // ── Bulk bar ─────────────────────────────────────────────────────────
    renderTopToolbarCustomActions: () => (
      <BulkActionBar
        count={selectedCount}
        onClear={() => setRowSelection({})}
      />
    ),
  })

  return (
    <>
      <style>{`
        .av1 { background: #B5D4F4; color: #0C447C; }
        .av2 { background: #9FE1CB; color: #085041; }
        .av3 { background: #F4C0D1; color: #72243E; }
        .av4 { background: #CECBF6; color: #26215C; }
        .av5 { background: #FAC775; color: #633806; }
      `}</style>
      <CssBaseline />
      <Box sx={{ p: { xs: 1, sm: 1.5, md: 2 } }}>
        <MaterialReactTable table={table} />
      </Box>
    </>
  )
}
```

---

## How Status Updates Work

```
User taps status pill
  → dropdown opens
  → user selects new status
  → onStatusChange(taskId, newKey) fires
  → setData() updates local state (optimistic)
  → pill re-renders with new colour and label
  → dropdown closes
```

To wire to a real API:

```js
async function handleStatusChange(taskId, newStatusKey) {
  const previousKey = data.find(t => t.id === taskId)?.status
  setData(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatusKey } : t))
  try {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatusKey }),
    })
  } catch (err) {
    setData(prev => prev.map(t => t.id === taskId ? { ...t, status: previousKey } : t))
    console.error('Status update failed', err)
  }
}
```

---

## Swapping In Your Real Data

**1. Update `INITIAL_DATA`** or fetch from an API:

```jsx
const [data, setData] = useState([])
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  fetch('/api/tasks')
    .then(res => res.json())
    .then(rows => { setData(rows); setIsLoading(false) })
}, [])

// In useMaterialReactTable add:
state: { ..., isLoading }   // MRT shows skeleton loader automatically
```

**2. Update `STATUSES`** — match your real status keys, labels, and colours.

**3. Update `CARD_FIELDS`** — controls what fields appear in the mobile detail panel. The `type` field drives the render:

| type | renders as |
|---|---|
| `'badge'` | yellow pill badge |
| `'dueDate'` | text, red + bell when `overdue: true` |
| `'assignees'` | avatar stack |
| `'status'` | tappable status pill with dropdown |

Add a new type by adding a conditional block inside `MobileDetailPanel`.

**4. Update `COLUMNS`** — `accessorKey` and `header` to match your fields. Everything except `name` is hidden on compact via `columnVisibility`.

**5. Update the breakpoint** if needed — `theme.breakpoints.down('md')` = below 900px. One line, everything else follows automatically.

---

## MRT Options Reference

| Option | What it does |
|---|---|
| `enableRowSelection: true` | Adds checkboxes for bulk selection |
| `state.rowSelection` | Controlled selection state |
| `onRowSelectionChange` | Fires on any checkbox change |
| `renderDetailPanel` | Content that expands beneath each row |
| `state.expanded: {}` | All rows collapsed — user taps to open |
| `positionExpandColumn: 'last'` | Moves expand chevron to the right side |
| `state.columnVisibility` | Hides/shows columns reactively |
| `muiTableBodyRowProps.sx.minHeight` | Sets minimum touch-friendly row height |
| `muiTableBodyCellProps` | Used to apply 44px padding to checkbox and chevron cells |
| `renderTopToolbarCustomActions` | Injects bulk action bar into the toolbar |

---

## Known Gotchas

**`positionExpandColumn: 'last'` — confirm header alignment**
MRT moves the column in both header and body. Visually verify the header row aligns with body rows after enabling this.

**Do not use `state.expanded: true`**
This forces all rows open and removes user control. `state.expanded: {}` is the correct value — it means no rows are expanded by default, and MRT handles individual row toggles internally from there.

**Checkbox padding vs. visual size**
Increasing padding to reach 44px tap target is correct — the checkbox renders at the same visual size but the interactive area is larger. Do not increase the MUI `size` prop on the checkbox itself, it would look oversized.

**`columns` useMemo dependency**
`isCompact` is referenced inside the `name` column Cell renderer. It must be in the `useMemo` dependency array: `useMemo(() => [...], [isCompact])`. Missing this causes the truncation style to stop updating on window resize.

**Status dropdown z-index**
Set to `1300` (MUI modal baseline). If your app shell has sticky elements above this, increase accordingly.

**Detail panel `<tr>` is always in the DOM**
MRT renders the panel row for every row regardless of expanded state. Fine for typical datasets. For 500+ rows consider `@tanstack/react-virtual`.

---

## Testing Checklist

- [ ] XS/SM: only Task column visible, name truncates with ellipsis
- [ ] XS/SM: all rows collapsed by default on load
- [ ] XS/SM: tapping a row expands it; chevron rotates to point down
- [ ] XS/SM: tapping an open row collapses it again
- [ ] XS/SM: expand chevron is on the RIGHT side of each row
- [ ] XS/SM: checkbox is on the LEFT side of each row
- [ ] XS/SM: checkbox and chevron tap targets are at least 44×44px
- [ ] XS/SM: detail panel shows Task type, Due date, Assignee, Status
- [ ] XS/SM: detail panel background is white with no left border accent
- [ ] XS/SM: each detail row is at least 44px tall
- [ ] XS/SM: tapping status pill opens dropdown with all status options
- [ ] XS/SM: selecting a status closes dropdown and updates pill immediately
- [ ] XS/SM: checking a row shows bulk bar; header checkbox goes indeterminate
- [ ] XS/SM: checking all rows fills header checkbox; unchecking all clears it
- [ ] XS/SM: "Clear" in bulk bar deselects all rows and hides the bar
- [ ] MD+: all columns visible, status renders as MUI Chip
- [ ] MD+: expand chevron on right, panels collapsed by default
- [ ] MD+: global search filters across all fields
- [ ] Dragging DevTools viewport past 900px switches views live
- [ ] Rotating a real device switches views live

---

## Deploy

```bash
npm run deploy
```

Live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`
