import {
  Folder,
  Link,
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

export type UIFile = PrismaFile & {
  content?: string;
  processing?: boolean;
  file?: File;
  folderName?: string;
};

export type ChatWithMessages = Chat & { chatMessages: ChatMessage[] };
export type FolderWithFiles = Folder & { files: UIFile[] };

export type FileState = {
  files: UIFile[];
  processing: boolean;
  links: Link[];
};

export type FileAction =
  | { type: "ADD_FILE"; payload: UIFile[] }
  | { type: "REMOVE_FILE"; payload: { id: string } }
  | { type: "UPDATE_FILE"; payload: UIFile }
  | { type: "PROCESSING_FILE"; payload: boolean }
  | { type: "ADD_LINK"; payload: Link }
  | { type: "REMOVE_LINK"; payload: { chatId: string; fileId: string } }
  | { type: "UPDATE_LINK"; payload: { oldLink: Link; newLink: Link } };

export type ChatFileLink = {
  id: string; // id of the link
  chatId: string;
  fileId: string;
  chat: Chat & {
    chatMessages: ChatMessage[];
  };
  file: UIFile;
}[];

export const ActionTypes = {
  ADD_FILE: "ADD_FILE",
  REMOVE_FILE: "REMOVE_FILE",
  UPDATE_FILE: "UPDATE_FILE",
  ADD_LINK: "ADD_LINK",
  REMOVE_LINK: "REMOVE_LINK",
  UPDATE_LINK: "UPDATE_LINK",
  PROCESSING_FILE: "PROCESSING_FILE",
} as const;

export type StateType = {
  files: UIFile[];
  links: Link[];
  processing: boolean;
};

export type ActionPayloads = {
  ADD_FILE: { files: UIFile[] };
  REMOVE_FILE: { id: string };
  UPDATE_FILE: UIFile;
  ADD_LINK: Link;
  REMOVE_LINK: { chatId: string; fileId: string };
  UPDATE_LINK: { oldLink: Link; newLink: Link };
  PROCESSING_FILE: boolean;
};

export type Action<K extends keyof ActionPayloads> = {
  type: K;
  payload: ActionPayloads[K];
};
