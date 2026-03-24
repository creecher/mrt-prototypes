import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import theme from './theme/theme'
import AppShell from './components/AppShell'
import BreakpointToggle from './components/BreakpointToggle'
import { STRATEGIES } from './routes'
import './App.css'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to={STRATEGIES[0].path} replace />} />
            {STRATEGIES.map((s) => (
              <Route key={s.id} path={s.path} element={s.element} />
            ))}
          </Routes>
        </AppShell>
      </HashRouter>
      <BreakpointToggle />
    </ThemeProvider>
  )
}
