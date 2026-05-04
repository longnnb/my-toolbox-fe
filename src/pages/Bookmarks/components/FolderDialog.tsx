import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import type { Folder } from '../types'

type Props = {
  open: boolean
  mode: 'add' | 'edit'
  folders: Folder[]
  /** id of the folder being edited (edit mode), or the default parent (add mode). null = top-level. */
  initial: { name?: string; parentId: string | null; selfId?: string }
  onCancel: () => void
  onSubmit: (values: { name: string; parentId: string | null }) => void
}

const collectDescendants = (folders: Folder[], rootId: string): Set<string> => {
  const result = new Set<string>([rootId])
  let added = true
  while (added) {
    added = false
    for (const f of folders) {
      if (f.parentId && result.has(f.parentId) && !result.has(f.id)) {
        result.add(f.id)
        added = true
      }
    }
  }
  return result
}

function FolderDialog({ open, mode, folders, initial, onCancel, onSubmit }: Props) {
  const [name, setName] = useState(() => initial.name ?? '')
  const [parentId, setParentId] = useState<string | null>(() => initial.parentId)

  const trimmed = name.trim()
  const disabledParents =
    mode === 'edit' && initial.selfId
      ? collectDescendants(folders, initial.selfId)
      : new Set<string>()

  const handleSubmit = () => {
    if (!trimmed) return
    onSubmit({ name: trimmed, parentId })
  }

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{mode === 'add' ? 'New folder' : 'Rename folder'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            select
            label="Parent folder"
            value={parentId ?? ''}
            onChange={(e) => setParentId(e.target.value || null)}
            fullWidth
          >
            <MenuItem value="">(Top level)</MenuItem>
            {folders.map((f) => (
              <MenuItem
                key={f.id}
                value={f.id}
                disabled={disabledParents.has(f.id)}
              >
                {f.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!trimmed}>
          {mode === 'add' ? 'Create' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FolderDialog
