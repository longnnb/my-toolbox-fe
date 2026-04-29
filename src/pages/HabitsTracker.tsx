import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

function HabitsTracker() {
  return (
    <Stack spacing={2}>
      <Typography variant="h3" component="h1">
        Habits Tracker
      </Typography>
      <Typography color="text.secondary">
        Track daily habits and keep your streaks alive.
      </Typography>
    </Stack>
  )
}

export default HabitsTracker
