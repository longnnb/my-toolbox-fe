import { useRef, useState } from 'react'
import type { ChangeEvent, MouseEvent } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import DownloadIcon from '@mui/icons-material/Download'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import UploadIcon from '@mui/icons-material/Upload'
import { useBookmarks } from '../BookmarksContext'
import { exportJson, importJson } from '../storage'
import type { StoreState } from '../types'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'

function ImportExportMenu() {
  const { folders, bookmarks, replaceAll } = useBookmarks()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [pending, setPending] = useState<StoreState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const open = (e: MouseEvent<HTMLButtonElement>) => setAnchor(e.currentTarget)
  const close = () => setAnchor(null)

  const handleExport = () => {
    close()
    const data: StoreState = { version: 1, folders, bookmarks }
    const blob = new Blob([exportJson(data)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const today = new Date().toISOString().slice(0, 10)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookmarks-${today}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    close()
    fileInputRef.current?.click()
  }

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const text = await file.text()
      const parsed = importJson(text)
      setPending(parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import file')
    }
  }

  const confirmImport = () => {
    if (pending) replaceAll(pending)
    setPending(null)
  }

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<MoreHorizIcon />}
        onClick={open}
      >
        Backup
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
        <MenuItem onClick={handleExport}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export JSON</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleImportClick}>
          <ListItemIcon>
            <UploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Import JSON…</ListItemText>
        </MenuItem>
      </Menu>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        hidden
        onChange={handleFile}
      />

      <ConfirmDeleteDialog
        open={pending !== null}
        title="Replace all bookmarks?"
        message={
          pending
            ? `This will replace your current bookmarks with ${pending.bookmarks.length} bookmark(s) and ${pending.folders.length} folder(s) from the file. This cannot be undone.`
            : ''
        }
        confirmLabel="Replace"
        onCancel={() => setPending(null)}
        onConfirm={confirmImport}
      />

      <Snackbar
        open={error !== null}
        autoHideDuration={5000}
        onClose={() => setError(null)}
      >
        <Alert
          severity="error"
          onClose={() => setError(null)}
          variant="filled"
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ImportExportMenu
