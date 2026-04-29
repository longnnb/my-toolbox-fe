import { Link as RouterLink, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

const tabs = [
  { to: '/bookmarks', label: 'Bookmarks' },
  { to: '/habits', label: 'Habits Tracker' },
  { to: '/library', label: 'Library' },
] as const

function Navigation() {
  const { pathname } = useLocation()
  const activeTab = tabs.find((t) => pathname.startsWith(t.to))?.to ?? false

  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Toolbar sx={{ gap: 3 }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          My Toolbox
        </Typography>
        <Tabs value={activeTab} textColor="primary" indicatorColor="primary">
          {tabs.map((t) => (
            <Tab
              key={t.to}
              value={t.to}
              label={t.label}
              component={RouterLink}
              to={t.to}
            />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
