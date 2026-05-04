import { useState } from 'react'
import type { MouseEvent } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import AddIcon from '@mui/icons-material/Add'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { useBookmarks } from '../BookmarksContext'
import { ALL_FOLDERS_ID } from '../types'
import type { Folder } from '../types'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import FolderDialog from './FolderDialog'

type Props = {
  selectedFolderId: string | null
  onSelectFolder: (id: string | null) => void
}

type DialogState =
  | { kind: 'closed' }
  | { kind: 'add'; parentId: string | null }
  | { kind: 'rename'; folder: Folder }
  | { kind: 'move'; folder: Folder }

function buildChildrenMap(folders: Folder[]) {
  const map = new Map<string | null, Folder[]>()
  for (const f of folders) {
    const arr = map.get(f.parentId) ?? []
    arr.push(f)
    map.set(f.parentId, arr)
  }
  for (const arr of map.values()) {
    arr.sort((a, b) => a.name.localeCompare(b.name))
  }
  return map
}

function FolderTree({ selectedFolderId, onSelectFolder }: Props) {
  const { folders, bookmarks, addFolder, renameFolder, moveFolder, deleteFolder } =
    useBookmarks()

  const [menu, setMenu] = useState<{ anchor: HTMLElement; folder: Folder } | null>(
    null,
  )
  const [dialog, setDialog] = useState<DialogState>({ kind: 'closed' })
  const [confirmDelete, setConfirmDelete] = useState<Folder | null>(null)

  const childrenMap = buildChildrenMap(folders)

  const renderFolder = (f: Folder) => {
    const children = childrenMap.get(f.id) ?? []
    return (
      <TreeItem
        key={f.id}
        itemId={f.id}
        label={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0.25,
              pr: 0.5,
              '&:hover .folder-actions': { opacity: 1 },
            }}
          >
            <Box
              component="span"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {f.name}
            </Box>
            <IconButton
              size="small"
              className="folder-actions"
              sx={{ opacity: 0, ml: 1 }}
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation()
                setMenu({ anchor: e.currentTarget, folder: f })
              }}
              aria-label={`Folder actions for ${f.name}`}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      >
        {children.map(renderFolder)}
      </TreeItem>
    )
  }

  const topLevel = childrenMap.get(null) ?? []
  const selected = selectedFolderId ?? ALL_FOLDERS_ID

  const handleSelect = (_: unknown, itemIds: unknown) => {
    const id =
      typeof itemIds === 'string'
        ? itemIds
        : Array.isArray(itemIds) && typeof itemIds[0] === 'string'
          ? itemIds[0]
          : null
    if (id === null || id === ALL_FOLDERS_ID) {
      onSelectFolder(null)
    } else {
      onSelectFolder(id)
    }
  }

  const closeMenu = () => setMenu(null)

  const onDeleteConfirmed = () => {
    if (!confirmDelete) return
    if (selectedFolderId === confirmDelete.id) onSelectFolder(null)
    deleteFolder(confirmDelete.id)
    setConfirmDelete(null)
  }

  const folderBookmarkCount = (id: string) =>
    bookmarks.filter((b) => b.folderId === id).length

  return (
    <Stack
      sx={{
        borderRight: 1,
        borderColor: 'divider',
        height: '100%',
        minHeight: 600,
      }}
    >
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
        <SimpleTreeView
          selectedItems={selected}
          onSelectedItemsChange={handleSelect}
          defaultExpandedItems={[ALL_FOLDERS_ID]}
        >
          <TreeItem itemId={ALL_FOLDERS_ID} label="All Bookmarks">
            {topLevel.map(renderFolder)}
          </TreeItem>
        </SimpleTreeView>
      </Box>
      <Divider />
      <Box sx={{ p: 1 }}>
        <Button
          size="small"
          fullWidth
          startIcon={<AddIcon />}
          onClick={() =>
            setDialog({ kind: 'add', parentId: selectedFolderId })
          }
        >
          New folder
        </Button>
      </Box>

      <Menu
        anchorEl={menu?.anchor ?? null}
        open={Boolean(menu)}
        onClose={closeMenu}
      >
        <MenuItem
          onClick={() => {
            if (menu) setDialog({ kind: 'add', parentId: menu.folder.id })
            closeMenu()
          }}
        >
          <ListItemIcon>
            <CreateNewFolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>New subfolder</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menu) setDialog({ kind: 'rename', folder: menu.folder })
            closeMenu()
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menu) setDialog({ kind: 'move', folder: menu.folder })
            closeMenu()
          }}
        >
          <ListItemIcon>
            <DriveFileMoveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move to…</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menu) setConfirmDelete(menu.folder)
            closeMenu()
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {dialog.kind === 'add' && (
        <FolderDialog
          key={`add-${dialog.parentId ?? 'root'}`}
          open
          mode="add"
          folders={folders}
          initial={{ parentId: dialog.parentId }}
          onCancel={() => setDialog({ kind: 'closed' })}
          onSubmit={({ name, parentId }) => {
            addFolder({ name, parentId })
            setDialog({ kind: 'closed' })
          }}
        />
      )}

      {dialog.kind === 'rename' && (
        <FolderDialog
          key={`rename-${dialog.folder.id}`}
          open
          mode="edit"
          folders={folders}
          initial={{
            name: dialog.folder.name,
            parentId: dialog.folder.parentId,
            selfId: dialog.folder.id,
          }}
          onCancel={() => setDialog({ kind: 'closed' })}
          onSubmit={({ name, parentId }) => {
            renameFolder(dialog.folder.id, name)
            if (parentId !== dialog.folder.parentId) {
              moveFolder(dialog.folder.id, parentId)
            }
            setDialog({ kind: 'closed' })
          }}
        />
      )}

      {dialog.kind === 'move' && (
        <FolderDialog
          key={`move-${dialog.folder.id}`}
          open
          mode="edit"
          folders={folders}
          initial={{
            name: dialog.folder.name,
            parentId: dialog.folder.parentId,
            selfId: dialog.folder.id,
          }}
          onCancel={() => setDialog({ kind: 'closed' })}
          onSubmit={({ parentId }) => {
            moveFolder(dialog.folder.id, parentId)
            setDialog({ kind: 'closed' })
          }}
        />
      )}

      <ConfirmDeleteDialog
        open={confirmDelete !== null}
        title="Delete folder?"
        message={
          confirmDelete
            ? (() => {
                const count = folderBookmarkCount(confirmDelete.id)
                const subCount = (childrenMap.get(confirmDelete.id) ?? []).length
                if (count === 0 && subCount === 0) {
                  return `Delete "${confirmDelete.name}"?`
                }
                const parts: string[] = []
                if (count > 0) parts.push(`${count} bookmark${count === 1 ? '' : 's'}`)
                if (subCount > 0)
                  parts.push(`${subCount} subfolder${subCount === 1 ? '' : 's'}`)
                return `Delete "${confirmDelete.name}"? This will also delete ${parts.join(' and ')} inside.`
              })()
            : ''
        }
        onCancel={() => setConfirmDelete(null)}
        onConfirm={onDeleteConfirmed}
      />
    </Stack>
  )
}

export default FolderTree
