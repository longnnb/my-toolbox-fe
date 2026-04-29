import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

function Library() {
  return (
    <Stack spacing={2}>
      <Typography variant="h3" component="h1">
        Library
      </Typography>
      <Typography color="text.secondary">
        Your reading board: books, articles, and notes.
      </Typography>
    </Stack>
  )
}

export default Library
