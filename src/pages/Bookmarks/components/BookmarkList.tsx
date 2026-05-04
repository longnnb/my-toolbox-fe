import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import { useBookmarks } from '../BookmarksContext'
import type { Bookmark } from '../types'
import BookmarkDialog from './BookmarkDialog'
import type { BookmarkDialogValues } from './BookmarkDialog'
import BookmarkRow from './BookmarkRow'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import SearchBar from './SearchBar'
import TagFilterBar from './TagFilterBar'

type Props = {
  selectedFolderId: string | null
}

type DialogState =
  | { kind: 'closed' }
  | { kind: 'add' }
  | { kind: 'edit'; bookmark: Bookmark }
  | { kind: 'move'; bookmark: Bookmark }

const folderName = (
  folders: { id: string; name: string }[],
  id: string | null,
): string => {
  if (id === null) return 'All Bookmarks'
  return folders.find((f) => f.id === id)?.name ?? 'All Bookmarks'
}

function BookmarkList({ selectedFolderId }: Props) {
  const {
    folders,
    bookmarks,
    addBookmark,
    updateBookmark,
    moveBookmark,
    deleteBookmark,
  } = useBookmarks()

  const [search, setSearch] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [dialog, setDialog] = useState<DialogState>({ kind: 'closed' })
  const [confirmDelete, setConfirmDelete] = useState<Bookmark | null>(null)
  const [moveTarget, setMoveTarget] = useState<string | null>(null)

  const inFolder =
    selectedFolderId === null
      ? bookmarks
      : bookmarks.filter((b) => b.folderId === selectedFolderId)

  const availableTags = Array.from(
    new Set(inFolder.flatMap((b) => b.tags)),
  ).sort()

  const query = search.trim().toLowerCase()
  const filtered = inFolder.filter((b) => {
    if (
      activeTags.length > 0 &&
      !activeTags.every((t) => b.tags.includes(t))
    ) {
      return false
    }
    if (!query) return true
    const haystack = [
      b.title,
      b.url,
      b.description ?? '',
      b.tags.join(' '),
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(query)
  })

  const sorted = [...filtered].sort((a, b) => b.updatedAt - a.updatedAt)

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  const tagSuggestions = Array.from(new Set(bookmarks.flatMap((b) => b.tags)))

  const initialAddValues: BookmarkDialogValues = {
    title: '',
    url: '',
    description: '',
    tags: [],
    folderId: selectedFolderId,
  }

  const initialEditValues = (b: Bookmark): BookmarkDialogValues => ({
    title: b.title,
    url: b.url,
    description: b.description ?? '',
    tags: b.tags,
    folderId: b.folderId,
  })

  const headerLabel = folderName(folders, selectedFolderId)

  return (
    <Stack sx={{ p: 2, gap: 2, minWidth: 0 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography variant="h6" component="h2" sx={{ minWidth: 0 }}>
          {headerLabel}
          <Typography
            component="span"
            variant="body2"
            color="text.secondary"
            sx={{ ml: 1 }}
          >
            ({inFolder.length})
          </Typography>
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialog({ kind: 'add' })}
        >
          Add bookmark
        </Button>
      </Stack>

      <SearchBar value={search} onChange={setSearch} />

      <TagFilterBar
        availableTags={availableTags}
        activeTags={activeTags}
        onToggleTag={toggleTag}
        onClear={() => setActiveTags([])}
      />

      {sorted.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
          {inFolder.length === 0
            ? 'No bookmarks here yet — click Add bookmark to start.'
            : 'No bookmarks match your search and filters.'}
        </Box>
      ) : (
        <Stack divider={<Box sx={{ borderTop: 1, borderColor: 'divider' }} />}>
          {sorted.map((b) => (
            <BookmarkRow
              key={b.id}
              bookmark={b}
              folders={folders}
              onEdit={() => setDialog({ kind: 'edit', bookmark: b })}
              onMove={() => {
                setMoveTarget(b.folderId)
                setDialog({ kind: 'move', bookmark: b })
              }}
              onDelete={() => setConfirmDelete(b)}
            />
          ))}
        </Stack>
      )}

      {dialog.kind === 'add' && (
        <BookmarkDialog
          open
          mode="add"
          folders={folders}
          tagSuggestions={tagSuggestions}
          initial={initialAddValues}
          onCancel={() => setDialog({ kind: 'closed' })}
          onSubmit={(v) => {
            addBookmark({
              title: v.title,
              url: v.url,
              description: v.description,
              tags: v.tags,
              folderId: v.folderId,
            })
            setDialog({ kind: 'closed' })
          }}
        />
      )}

      {dialog.kind === 'edit' && (
        <BookmarkDialog
          key={dialog.bookmark.id}
          open
          mode="edit"
          folders={folders}
          tagSuggestions={tagSuggestions}
          initial={initialEditValues(dialog.bookmark)}
          onCancel={() => setDialog({ kind: 'closed' })}
          onSubmit={(v) => {
            updateBookmark(dialog.bookmark.id, {
              title: v.title,
              url: v.url,
              description: v.description,
              tags: v.tags,
              folderId: v.folderId,
            })
            setDialog({ kind: 'closed' })
          }}
        />
      )}

      <Dialog
        open={dialog.kind === 'move'}
        onClose={() => setDialog({ kind: 'closed' })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Move bookmark</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Folder"
            value={moveTarget ?? ''}
            onChange={(e) => setMoveTarget(e.target.value || null)}
            fullWidth
            sx={{ mt: 1 }}
          >
            <MenuItem value="">(Top level)</MenuItem>
            {folders.map((f) => (
              <MenuItem key={f.id} value={f.id}>
                {f.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ kind: 'closed' })}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (dialog.kind !== 'move') return
              moveBookmark(dialog.bookmark.id, moveTarget)
              setDialog({ kind: 'closed' })
            }}
          >
            Move
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={confirmDelete !== null}
        title="Delete bookmark?"
        message={
          confirmDelete ? `Delete "${confirmDelete.title}"?` : ''
        }
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (!confirmDelete) return
          deleteBookmark(confirmDelete.id)
          setConfirmDelete(null)
        }}
      />
    </Stack>
  )
}

export default BookmarkList
