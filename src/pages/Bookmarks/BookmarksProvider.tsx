import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  BookmarksContext,
  type AddBookmarkInput,
  type AddFolderInput,
  type BookmarksApi,
  type UpdateBookmarkPatch,
} from './BookmarksContext'
import { loadStore, saveStore } from './storage'
import type { Bookmark, Folder, StoreState } from './types'

const normalizeTags = (tags: string[]): string[] => {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of tags) {
    const t = raw.trim().toLowerCase()
    if (t && !seen.has(t)) {
      seen.add(t)
      out.push(t)
    }
  }
  return out
}

const collectDescendantFolderIds = (
  folders: Folder[],
  rootId: string,
): Set<string> => {
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

function BookmarksProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(loadStore)

  useEffect(() => {
    saveStore(state)
  }, [state])

  const addFolder = ({ name, parentId }: AddFolderInput): Folder => {
    const folder: Folder = {
      id: crypto.randomUUID(),
      name: name.trim(),
      parentId,
      createdAt: Date.now(),
    }
    setState((s) => ({ ...s, folders: [...s.folders, folder] }))
    return folder
  }

  const renameFolder = (id: string, name: string) => {
    setState((s) => ({
      ...s,
      folders: s.folders.map((f) =>
        f.id === id ? { ...f, name: name.trim() } : f,
      ),
    }))
  }

  const moveFolder = (id: string, parentId: string | null) => {
    if (id === parentId) return
    setState((s) => {
      const descendants = collectDescendantFolderIds(s.folders, id)
      if (parentId !== null && descendants.has(parentId)) return s
      return {
        ...s,
        folders: s.folders.map((f) => (f.id === id ? { ...f, parentId } : f)),
      }
    })
  }

  const deleteFolder = (id: string) => {
    setState((s) => {
      const doomed = collectDescendantFolderIds(s.folders, id)
      return {
        ...s,
        folders: s.folders.filter((f) => !doomed.has(f.id)),
        bookmarks: s.bookmarks.filter(
          (b) => b.folderId === null || !doomed.has(b.folderId),
        ),
      }
    })
  }

  const addBookmark = (input: AddBookmarkInput): Bookmark => {
    const now = Date.now()
    const bookmark: Bookmark = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      url: input.url.trim(),
      description: input.description?.trim() || undefined,
      tags: normalizeTags(input.tags),
      folderId: input.folderId,
      createdAt: now,
      updatedAt: now,
    }
    setState((s) => ({ ...s, bookmarks: [...s.bookmarks, bookmark] }))
    return bookmark
  }

  const updateBookmark = (id: string, patch: UpdateBookmarkPatch) => {
    setState((s) => ({
      ...s,
      bookmarks: s.bookmarks.map((b) => {
        if (b.id !== id) return b
        const next: Bookmark = { ...b, updatedAt: Date.now() }
        if (patch.title !== undefined) next.title = patch.title.trim()
        if (patch.url !== undefined) next.url = patch.url.trim()
        if (patch.description !== undefined) {
          next.description = patch.description.trim() || undefined
        }
        if (patch.tags !== undefined) next.tags = normalizeTags(patch.tags)
        if (patch.folderId !== undefined) next.folderId = patch.folderId
        return next
      }),
    }))
  }

  const moveBookmark = (id: string, folderId: string | null) => {
    updateBookmark(id, { folderId })
  }

  const deleteBookmark = (id: string) => {
    setState((s) => ({
      ...s,
      bookmarks: s.bookmarks.filter((b) => b.id !== id),
    }))
  }

  const replaceAll = (next: StoreState) => {
    setState(next)
  }

  const value: BookmarksApi = {
    folders: state.folders,
    bookmarks: state.bookmarks,
    addFolder,
    renameFolder,
    moveFolder,
    deleteFolder,
    addBookmark,
    updateBookmark,
    moveBookmark,
    deleteBookmark,
    replaceAll,
  }

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  )
}

export default BookmarksProvider
