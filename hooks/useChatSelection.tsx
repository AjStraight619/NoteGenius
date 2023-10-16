import { ChatWithMessages } from "@/types/otherTypes";

import { useEffect, useState } from "react";

export const useChatSelection = (
  chats: ChatWithMessages[] | undefined,
  initialChat: ChatWithMessages | undefined
) => {
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    initialChat?.id
  );
  const [selectedChat, setSelectedChat] = useState<
    ChatWithMessages | undefined
  >(initialChat);

  useEffect(() => {
    if (selectedChatId) {
      const newSelectedChat = chats?.find((chat) => chat.id === selectedChatId);
      setSelectedChat(newSelectedChat);
    }
  }, [selectedChatId, chats]);

  const selectChat = (chatId: string | undefined) => {
    if (chatId !== selectedChatId) {
      setSelectedChatId(chatId);
    }
  };

  return {
    selectedChat,
    selectChat,
  };
};
