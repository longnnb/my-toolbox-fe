import { useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import type { Folder } from '../types'

type Values = {
  title: string
  url: string
  description: string
  tags: string[]
  folderId: string | null
}

type Props = {
  open: boolean
  mode: 'add' | 'edit'
  folders: Folder[]
  tagSuggestions: string[]
  initial: Values
  onCancel: () => void
  onSubmit: (values: Values) => void
}

const isValidUrl = (s: string): boolean => {
  try {
    new URL(s)
    return true
  } catch {
    return false
  }
}

function BookmarkDialog({
  open,
  mode,
  folders,
  tagSuggestions,
  initial,
  onCancel,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<Values>(() => initial)
  const [touched, setTouched] = useState(false)

  const titleError = touched && !values.title.trim()
  const urlError = touched && !isValidUrl(values.url.trim())
  const canSubmit = values.title.trim() && isValidUrl(values.url.trim())

  const handleSubmit = () => {
    setTouched(true)
    if (!canSubmit) return
    onSubmit(values)
  }

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Add bookmark' : 'Edit bookmark'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Title"
            value={values.title}
            onChange={(e) => setValues({ ...values, title: e.target.value })}
            error={titleError}
            helperText={titleError ? 'Required' : ' '}
            fullWidth
          />
          <TextField
            label="URL"
            value={values.url}
            onChange={(e) => setValues({ ...values, url: e.target.value })}
            error={urlError}
            helperText={
              urlError ? 'Enter a valid URL (e.g. https://example.com)' : ' '
            }
            placeholder="https://"
            fullWidth
          />
          <TextField
            label="Description (optional)"
            value={values.description}
            onChange={(e) =>
              setValues({ ...values, description: e.target.value })
            }
            multiline
            minRows={2}
            fullWidth
          />
          <Autocomplete
            multiple
            freeSolo
            options={tagSuggestions}
            value={values.tags}
            onChange={(_, next) =>
              setValues({
                ...values,
                tags: next.map((t) => t.trim().toLowerCase()).filter(Boolean),
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Tags" placeholder="Add tag" />
            )}
          />
          <TextField
            select
            label="Folder"
            value={values.folderId ?? ''}
            onChange={(e) =>
              setValues({ ...values, folderId: e.target.value || null })
            }
            fullWidth
          >
            <MenuItem value="">(Top level)</MenuItem>
            {folders.map((f) => (
              <MenuItem key={f.id} value={f.id}>
                {f.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {mode === 'add' ? 'Add' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BookmarkDialog
export type { Values as BookmarkDialogValues }
