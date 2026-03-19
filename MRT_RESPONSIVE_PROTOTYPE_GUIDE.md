# MRT Responsive Table Prototype — Claude Code Setup Guide

> Hand this file to Claude Code. It contains everything needed to scaffold, build, and deploy responsive Material React Table prototypes to GitHub Pages.

---

## Project Goal

Build a Vite + React app with Material React Table that demonstrates responsive table patterns (column hiding, column pinning, card/stack view on mobile). Deploy to GitHub Pages so the team can review on any device via a shared URL.

---

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| `vite` | ^5.x | Build tool & dev server |
| `react` | ^18.x | UI framework |
| `react-dom` | ^18.x | DOM renderer |
| `material-react-table` | ^3.x | Table library (MRT V3) |
| `@mui/material` | ^6.x | MUI V6 component library (required by MRT V3) |
| `@mui/icons-material` | ^6.x | MUI icons (required by MRT) |
| `@mui/x-date-pickers` | ^7.x | Date pickers (required by MRT) |
| `@emotion/react` | ^11.x | CSS-in-JS engine for MUI |
| `@emotion/styled` | ^11.x | Styled components for MUI |
| `gh-pages` | ^6.x | GitHub Pages deployment CLI |

---

## Prerequisites

Before starting, confirm these are installed:

```bash
node --version   # Need 18.x or higher
npm --version    # Need 9.x or higher
git --version    # Any recent version
```

You also need:
- A GitHub account with a repository created (can be empty)
- Your repo URL ready, e.g. `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`

---

## Step 1 — Scaffold the Vite + React App

```bash
npm create vite@latest mrt-responsive-prototype -- --template react
cd mrt-responsive-prototype
```

---

## Step 2 — Install All Dependencies

Run this single command to install everything at once:

```bash
npm install material-react-table @mui/material @mui/x-date-pickers @mui/icons-material @emotion/react @emotion/styled
```

Then install the deployment tool as a dev dependency:

```bash
npm install --save-dev gh-pages
```

---

## Step 3 — Configure Vite for GitHub Pages

GitHub Pages serves the site from a subdirectory path like `/YOUR_REPO_NAME/`. Vite needs to know this so asset paths resolve correctly.

Open `vite.config.js` and replace the contents with:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/YOUR_REPO_NAME/', // 👈 Replace with your actual repo name
})
```

> **Important:** The `base` value must exactly match your GitHub repository name, including correct casing.

---

## Step 4 — Configure package.json for Deployment

Open `package.json` and make these two changes:

**1. Add the `homepage` field** (top level, alongside `"name"`):

```json
"homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME",
```

**2. Add deploy scripts** inside the `"scripts"` block:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

---

## Step 5 — Wire Up the GitHub Remote

If you created the repo on GitHub but haven't connected it yet:

```bash
git init                        # only if not already a git repo
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git add .
git commit -m "Initial scaffold"
git branch -M main
git push -u origin main
```

---

## Step 6 — Replace src/App.jsx with Your First Prototype

Delete the Vite boilerplate and paste in a working prototype. See the **Prototype Templates** section below for ready-to-paste code.

Also clear out `src/App.css` and `src/index.css` (or just delete their contents) to avoid style conflicts with MUI.

---

## Step 7 — Run Locally

```bash
npm run dev
```

Open `http://localhost:5173` in your browser. Resize the window to test responsive behaviour — or use browser DevTools device emulation (F12 → toggle device toolbar).

---

## Step 8 — Deploy to GitHub Pages

When you're ready to share a URL with the team:

```bash
npm run deploy
```

This runs the build then pushes the `dist/` folder to a `gh-pages` branch on your repo. GitHub automatically serves that branch.

**Your live URL will be:**
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME
```

It usually goes live within 1–2 minutes. You can check the deployment status at:
`https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/settings/pages`

> **Note:** The first deploy may require you to enable GitHub Pages in your repo settings. Go to **Settings → Pages → Source** and set it to **Deploy from branch: `gh-pages`**.

---

## Step 9 — Iterate and Re-deploy

Each time you want to share an updated prototype:

```bash
npm run deploy
```

That's it. The `predeploy` script runs the build automatically before pushing.

---

## Prototype Templates

These are three copy-paste ready prototypes covering the main responsive strategies. Swap them into `src/App.jsx` one at a time.

---

### Prototype A — Column Hiding by Breakpoint

The simplest win. Secondary columns are hidden on mobile using MUI's `useMediaQuery`. Users can still toggle columns via the built-in toolbar button.

```jsx
import { useMemo } from 'react'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { useMediaQuery, CssBaseline } from '@mui/material'

// Replace this with your real data
const SAMPLE_DATA = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', department: 'Engineering', joined: '2022-03-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active', department: 'Design', joined: '2021-07-22' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive', department: 'Marketing', joined: '2023-01-10' },
  { id: 4, name: 'Dan Brown', email: 'dan@example.com', role: 'Editor', status: 'Active', department: 'Engineering', joined: '2020-11-05' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'Active', department: 'HR', joined: '2019-06-30' },
]

const COLUMNS = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'department', header: 'Department' },
  { accessorKey: 'joined', header: 'Date Joined' },
]

export default function App() {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const isTablet = useMediaQuery('(max-width: 960px)')

  const columns = useMemo(() => COLUMNS, [])

  const table = useMaterialReactTable({
    columns,
    data: SAMPLE_DATA,
    state: {
      columnVisibility: {
        email: !isMobile,
        department: !isMobile,
        joined: !isTablet,
      },
    },
  })

  return (
    <>
      <CssBaseline />
      <div style={{ padding: '1rem' }}>
        <h2 style={{ fontFamily: 'sans-serif' }}>Prototype A — Column Hiding</h2>
        <MaterialReactTable table={table} />
      </div>
    </>
  )
}
```

---

### Prototype B — Column Pinning + Horizontal Scroll

The identifier column stays fixed on the left while additional columns scroll horizontally. Works well on tablet.

```jsx
import { useMemo } from 'react'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { CssBaseline } from '@mui/material'

const SAMPLE_DATA = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', department: 'Engineering', joined: '2022-03-15', lastLogin: '2024-01-10' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active', department: 'Design', joined: '2021-07-22', lastLogin: '2024-01-08' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive', department: 'Marketing', joined: '2023-01-10', lastLogin: '2023-12-15' },
  { id: 4, name: 'Dan Brown', email: 'dan@example.com', role: 'Editor', status: 'Active', department: 'Engineering', joined: '2020-11-05', lastLogin: '2024-01-11' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'Active', department: 'HR', joined: '2019-06-30', lastLogin: '2024-01-09' },
]

const COLUMNS = [
  { accessorKey: 'name', header: 'Name', size: 160 },
  { accessorKey: 'email', header: 'Email', size: 220 },
  { accessorKey: 'role', header: 'Role', size: 120 },
  { accessorKey: 'status', header: 'Status', size: 100 },
  { accessorKey: 'department', header: 'Department', size: 150 },
  { accessorKey: 'joined', header: 'Date Joined', size: 130 },
  { accessorKey: 'lastLogin', header: 'Last Login', size: 130 },
]

export default function App() {
  const columns = useMemo(() => COLUMNS, [])

  const table = useMaterialReactTable({
    columns,
    data: SAMPLE_DATA,
    enableColumnPinning: true,
    enableStickyHeader: true,
    initialState: {
      columnPinning: { left: ['name'] },
    },
    muiTableContainerProps: {
      sx: { maxHeight: '70vh' },
    },
  })

  return (
    <>
      <CssBaseline />
      <div style={{ padding: '1rem' }}>
        <h2 style={{ fontFamily: 'sans-serif' }}>Prototype B — Column Pinning</h2>
        <MaterialReactTable table={table} />
      </div>
    </>
  )
}
```

---

### Prototype C — Card View on Mobile (Detail Panel Pattern)

The most modern feel. On mobile, most columns are hidden and each row auto-expands into a full card. On desktop, standard table view.

```jsx
import { useMemo } from 'react'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { Box, Typography, Chip, CssBaseline, useMediaQuery } from '@mui/material'

const SAMPLE_DATA = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', department: 'Engineering', joined: '2022-03-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active', department: 'Design', joined: '2021-07-22' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive', department: 'Marketing', joined: '2023-01-10' },
  { id: 4, name: 'Dan Brown', email: 'dan@example.com', role: 'Editor', status: 'Active', department: 'Engineering', joined: '2020-11-05' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'Active', department: 'HR', joined: '2019-06-30' },
]

const COLUMNS = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'department', header: 'Department' },
  { accessorKey: 'joined', header: 'Date Joined' },
]

function CardRow({ row }) {
  const statusColor = row.original.status === 'Active' ? 'success' : 'default'
  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '110px 1fr', rowGap: 0.75 }}>
        {[
          ['Email', row.original.email],
          ['Role', row.original.role],
          ['Department', row.original.department],
          ['Date Joined', row.original.joined],
        ].map(([label, value]) => (
          <>
            <Typography key={label + '-label'} variant="body2" fontWeight={600} color="text.secondary">{label}</Typography>
            <Typography key={label + '-value'} variant="body2">{value}</Typography>
          </>
        ))}
        <Typography variant="body2" fontWeight={600} color="text.secondary">Status</Typography>
        <Box><Chip label={row.original.status} color={statusColor} size="small" /></Box>
      </Box>
    </Box>
  )
}

export default function App() {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const columns = useMemo(() => COLUMNS, [])

  const table = useMaterialReactTable({
    columns,
    data: SAMPLE_DATA,
    // On mobile: hide all columns except Name, show card via detail panel
    state: {
      columnVisibility: {
        email: !isMobile,
        role: !isMobile,
        status: !isMobile,
        department: !isMobile,
        joined: !isMobile,
      },
      // Auto-expand all rows on mobile so cards show immediately
      expanded: isMobile ? true : {},
    },
    renderDetailPanel: ({ row }) => <CardRow row={row} />,
    // Hide the expand toggle column on desktop — only needed on mobile
    displayColumnDefOptions: {
      'mrt-row-expand': {
        muiTableHeadCellProps: { sx: { display: isMobile ? 'table-cell' : 'none' } },
        muiTableBodyCellProps: { sx: { display: isMobile ? 'table-cell' : 'none' } },
      },
    },
  })

  return (
    <>
      <CssBaseline />
      <div style={{ padding: '1rem' }}>
        <h2 style={{ fontFamily: 'sans-serif' }}>Prototype C — Card View on Mobile</h2>
        <p style={{ fontFamily: 'sans-serif', color: '#666', fontSize: '14px' }}>
          Resize to under 600px wide (or use DevTools device emulation) to see the card layout.
        </p>
        <MaterialReactTable table={table} />
      </div>
    </>
  )
}
```

---

## Swapping In Your Real Data

Each prototype has a `SAMPLE_DATA` array and a `COLUMNS` array at the top of the file. To use your real table data:

1. Replace `SAMPLE_DATA` with your actual rows (or fetch from your API with `useState` + `useEffect`)
2. Update `COLUMNS` to match your field names — the `accessorKey` must match the property name in your data objects
3. For Prototype C's `CardRow` component, update the field labels/values array to match your columns

If your data comes from an API, add a fetch call like this at the top of the component:

```jsx
const [data, setData] = useState([])

useEffect(() => {
  fetch('https://your-api.com/endpoint')
    .then(res => res.json())
    .then(setData)
}, [])
```

Then pass `data` instead of `SAMPLE_DATA` into `useMaterialReactTable`.

---

## Troubleshooting

**Blank page after deploying to GitHub Pages**
- Check that `base` in `vite.config.js` exactly matches your repo name (case-sensitive)
- Wait 2–3 minutes and hard-refresh the page

**`gh-pages` command fails with permission error**
- Run `git remote -v` to confirm the remote is set correctly
- Make sure you have push access to the repo

**MUI styles look broken or unstyled**
- Make sure `@emotion/react` and `@emotion/styled` are installed — MUI requires both
- Ensure `CssBaseline` is rendered at the top of your component

**Column hiding doesn't react to window resize**
- `useMediaQuery` from `@mui/material` is reactive — it should update automatically
- If not, confirm you're importing from `@mui/material`, not a different package

**Cards don't show on mobile in Prototype C**
- Open DevTools (F12), click the device toggle icon, and select a phone size
- The breakpoint is `max-width: 600px` — try iPhone SE or similar

---

## File Structure After Setup

```
mrt-responsive-prototype/
├── public/
├── src/
│   ├── App.jsx          ← swap prototype code in here
│   ├── App.css          ← clear this out
│   ├── main.jsx         ← leave as-is
│   └── index.css        ← clear this out
├── index.html           ← leave as-is
├── vite.config.js       ← update base: '/YOUR_REPO_NAME/'
└── package.json         ← add homepage + deploy scripts
```

---

## Quick Reference — Key Commands

```bash
npm run dev        # Start local dev server at localhost:5173
npm run build      # Build for production (output goes to /dist)
npm run deploy     # Build + push to GitHub Pages
```
