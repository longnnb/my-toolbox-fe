import { useState } from 'react'
import type { MouseEvent } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PublicIcon from '@mui/icons-material/Public'
import type { Bookmark, Folder } from '../types'

type Props = {
  bookmark: Bookmark
  folders: Folder[]
  onEdit: () => void
  onMove: () => void
  onDelete: () => void
}

const faviconUrl = (url: string): string | null => {
  try {
    const host = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${host}&sz=32`
  } catch {
    return null
  }
}

const hostname = (url: string): string => {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function BookmarkRow({ bookmark, onEdit, onMove, onDelete }: Props) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [iconBroken, setIconBroken] = useState(false)
  const favicon = faviconUrl(bookmark.url)

  const openMenu = (e: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(e.currentTarget)
  }
  const closeMenu = () => setMenuAnchor(null)

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        alignItems: 'flex-start',
        px: 1.5,
        py: 1,
        borderRadius: 1,
        '&:hover': { bgcolor: 'action.hover' },
        '&:hover .row-actions': { opacity: 1 },
      }}
    >
      <Box
        sx={{
          width: 24,
          height: 24,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 0.25,
        }}
      >
        {favicon && !iconBroken ? (
          <Box
            component="img"
            src={favicon}
            alt=""
            width={16}
            height={16}
            onError={() => setIconBroken(true)}
          />
        ) : (
          <PublicIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        )}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
          <Link
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              fontWeight: 500,
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {bookmark.title}
          </Link>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {hostname(bookmark.url)}
          </Typography>
        </Stack>

        {bookmark.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.25,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {bookmark.description}
          </Typography>
        )}

        {bookmark.tags.length > 0 && (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ mt: 0.5, flexWrap: 'wrap' }}
            useFlexGap
          >
            {bookmark.tags.map((t) => (
              <Chip key={t} label={t} size="small" variant="outlined" />
            ))}
          </Stack>
        )}
      </Box>

      <IconButton
        size="small"
        className="row-actions"
        sx={{ opacity: 0, alignSelf: 'center' }}
        onClick={openMenu}
        aria-label={`Actions for ${bookmark.title}`}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            closeMenu()
            onEdit()
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu()
            onMove()
          }}
        >
          <ListItemIcon>
            <DriveFileMoveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move to…</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu()
            onDelete()
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default BookmarkRow
