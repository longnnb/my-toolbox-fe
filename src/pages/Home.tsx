import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

function Home() {
  return (
    <Stack spacing={2}>
      <Typography variant="h3" component="h1">
        My Toolbox
      </Typography>
      <Typography color="text.secondary">
        A personal collection of small tools. Pick one from the nav above.
      </Typography>
    </Stack>
  )
}

export default Home
