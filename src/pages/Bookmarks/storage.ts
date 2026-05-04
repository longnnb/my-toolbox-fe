import type { Bookmark, Folder, StoreState } from './types'

const STORAGE_KEY = 'bookmarks:v1'

const emptyStore = (): StoreState => ({
  version: 1,
  folders: [],
  bookmarks: [],
})

const isFolder = (x: unknown): x is Folder => {
  if (!x || typeof x !== 'object') return false
  const f = x as Record<string, unknown>
  return (
    typeof f.id === 'string' &&
    typeof f.name === 'string' &&
    (f.parentId === null || typeof f.parentId === 'string') &&
    typeof f.createdAt === 'number'
  )
}

const isBookmark = (x: unknown): x is Bookmark => {
  if (!x || typeof x !== 'object') return false
  const b = x as Record<string, unknown>
  return (
    typeof b.id === 'string' &&
    typeof b.title === 'string' &&
    typeof b.url === 'string' &&
    Array.isArray(b.tags) &&
    b.tags.every((t) => typeof t === 'string') &&
    (b.folderId === null || typeof b.folderId === 'string') &&
    typeof b.createdAt === 'number' &&
    typeof b.updatedAt === 'number'
  )
}

const isStore = (x: unknown): x is StoreState => {
  if (!x || typeof x !== 'object') return false
  const s = x as Record<string, unknown>
  return (
    s.version === 1 &&
    Array.isArray(s.folders) &&
    s.folders.every(isFolder) &&
    Array.isArray(s.bookmarks) &&
    s.bookmarks.every(isBookmark)
  )
}

export const loadStore = (): StoreState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw)
    if (!isStore(parsed)) return emptyStore()
    return parsed
  } catch {
    return emptyStore()
  }
}

export const saveStore = (state: StoreState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const exportJson = (state: StoreState): string =>
  JSON.stringify(state, null, 2)

export const importJson = (text: string): StoreState => {
  const parsed = JSON.parse(text)
  if (!isStore(parsed)) {
    throw new Error('Invalid bookmarks file: schema mismatch')
  }
  return parsed
}
