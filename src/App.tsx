import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Navigation from './components/Navigation'

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />
      <Container component="main" maxWidth="lg" sx={{ py: 5, flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  )
}

export default App
