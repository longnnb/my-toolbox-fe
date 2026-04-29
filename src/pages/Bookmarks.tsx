import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

function Bookmarks() {
  return (
    <Stack spacing={2}>
      <Typography variant="h3" component="h1">
        Bookmarks
      </Typography>
      <Typography color="text.secondary">
        Save and organize websites you want to keep.
      </Typography>
    </Stack>
  )
}

export default Bookmarks
