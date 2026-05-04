export type Folder = {
  id: string
  name: string
  parentId: string | null
  createdAt: number
}

export type Bookmark = {
  id: string
  title: string
  url: string
  description?: string
  tags: string[]
  folderId: string | null
  createdAt: number
  updatedAt: number
}

export type StoreState = {
  version: 1
  folders: Folder[]
  bookmarks: Bookmark[]
}

export const ALL_FOLDERS_ID = '__all__'
