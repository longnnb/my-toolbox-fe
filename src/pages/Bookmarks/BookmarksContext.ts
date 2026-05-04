import { createContext, useContext } from 'react'
import type { Bookmark, Folder, StoreState } from './types'

export type AddFolderInput = { name: string; parentId: string | null }

export type AddBookmarkInput = {
  title: string
  url: string
  description?: string
  tags: string[]
  folderId: string | null
}

export type UpdateBookmarkPatch = Partial<
  Pick<Bookmark, 'title' | 'url' | 'description' | 'tags' | 'folderId'>
>

export type BookmarksApi = {
  folders: Folder[]
  bookmarks: Bookmark[]
  addFolder: (input: AddFolderInput) => Folder
  renameFolder: (id: string, name: string) => void
  moveFolder: (id: string, parentId: string | null) => void
  deleteFolder: (id: string) => void
  addBookmark: (input: AddBookmarkInput) => Bookmark
  updateBookmark: (id: string, patch: UpdateBookmarkPatch) => void
  moveBookmark: (id: string, folderId: string | null) => void
  deleteBookmark: (id: string) => void
  replaceAll: (state: StoreState) => void
}

export const BookmarksContext = createContext<BookmarksApi | null>(null)

export function useBookmarks(): BookmarksApi {
  const ctx = useContext(BookmarksContext)
  if (!ctx) {
    throw new Error('useBookmarks must be used within <BookmarksProvider>')
  }
  return ctx
}
