import {
  Folder,
  Chat as PrismaChat,
  ChatMessage as PrismaChatMessage,
  File as PrismaFile,
} from "@prisma/client";

export type SortableItem = {
  id: string;
  name: string;
  content?: string;
  createdAt: Date;
  isRefined?: boolean;
};

export interface ChatMessage extends PrismaChatMessage {}

export interface Chat extends PrismaChat {
  chatMessages: ChatMessage[];
}

export type ChatWithMessages = Chat & { chatMessages: ChatMessage[] };
export type FolderWithFiles = Folder & { files: PrismaFile[] };

export type FileAction =
  | { type: "ADD_FILE"; payload: UIFile[] }
  | { type: "REMOVE_FILE"; payload: { id: string } }
  | { type: "UPDATE_FILE"; payload: UIFile }
  | { type: "PROCESSING_FILE"; payload: boolean };

export type FileState = {
  files: UIFile[];
  processing: boolean;
};

export type UIFile = PrismaFile & {
  processing?: boolean;
  file?: File;
  folderName?: string;
};
