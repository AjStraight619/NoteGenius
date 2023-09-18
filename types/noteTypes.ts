export type Note = {
  id: string;
  title: string;
  content: string | null;
  isRefined: boolean;
  createdAt: Date;
  updatedAt: Date;
  folderId: string;
};

export type RefinedNote = {
  id: string;
  original: string;
  refined: string | null;
  createdAt: Date;
  updatedAt: Date;
  folderId: string;
  userId: string;
  noteId: string;
};

export type Folder = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  notes: Note[]; // New: adding the relationship
  refinedNotes: RefinedNote[]; // New: adding the relationship
};
