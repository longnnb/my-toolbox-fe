import { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import BookmarksProvider from './BookmarksProvider'
import BookmarkList from './components/BookmarkList'
import FolderTree from './components/FolderTree'
import ImportExportMenu from './components/ImportExportMenu'

function BookmarksInner() {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography variant="h3" component="h1">
            Bookmarks
          </Typography>
          <Typography color="text.secondary">
            Save and organize websites you want to keep.
          </Typography>
        </Box>
        <ImportExportMenu />
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '280px 1fr' },
          minHeight: 600,
          overflow: 'hidden',
        }}
      >
        <FolderTree
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
        />
        <BookmarkList selectedFolderId={selectedFolderId} />
      </Paper>
    </Stack>
  )
}

function Bookmarks() {
  return (
    <BookmarksProvider>
      <BookmarksInner />
    </BookmarksProvider>
  )
}

export default Bookmarks
