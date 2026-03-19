import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme/theme'
import AppShell from './components/AppShell'
import BreakpointToggle from './components/BreakpointToggle'
import ColumnHidingPage from './pages/ColumnHidingPage'
import './App.css'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppShell>
        <ColumnHidingPage />
      </AppShell>
      <BreakpointToggle />
    </ThemeProvider>
  )
}
