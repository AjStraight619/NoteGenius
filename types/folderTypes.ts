export type Folder = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  // Note: the relationships like `user`, `notes`, and `refinedNotes` are omitted for simplicity
};

export type FolderSidebarProps = {
  folders?: Folder[] | null;
  updateFolders: (newFolders: Folder[]) => void;
};

export type FolderPageClientProps = {
  foldersToDisplay: Folder[] | null;
};
