export type SortableItem = {
  id: string;
  name: string;
  content?: string;
  createdAt: Date;
  isRefined?: boolean;
};

import {
  Chat as PrismaChat,
  ChatMessage as PrismaChatMessage,
} from "@prisma/client";

export interface ChatMessage extends PrismaChatMessage {}

export interface Chat extends PrismaChat {
  chatMessages: ChatMessage[];
}
