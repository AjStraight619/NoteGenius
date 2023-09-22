import { Tag } from "@prisma/client";
import { Folder } from "@prisma/client";

export type FolderSidebarProps = {
  folders?: Folder[] | null;
  updateFolders?: any;
};

export type IndividualFolder = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isStarred: boolean | null;
  tags?: Tag[];
};

export type SplitScreenProps = {
  folders: Folder[] | null;
  updateFolders: any;
};
