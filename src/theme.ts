import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  colorSchemes: {
    light: true,
    dark: true,
  },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
})

export default theme
