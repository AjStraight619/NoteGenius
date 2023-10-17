export type SortableItem = {
  id: string;
  name: string;
  content?: string;
  createdAt: Date;
  isRefined?: boolean;
};

import {
  Folder,
  Chat as PrismaChat,
  ChatMessage as PrismaChatMessage,
  File as PrismaFile,
} from "@prisma/client";

export interface ChatMessage extends PrismaChatMessage {}

export interface Chat extends PrismaChat {
  chatMessages: ChatMessage[];
}

export type ChatWithMessages = Chat & { chatMessages: ChatMessage[] };
export type FolderWithFiles = Folder & { files: PrismaFile[] };
