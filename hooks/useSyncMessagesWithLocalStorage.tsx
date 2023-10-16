import { Message } from "ai/react";
import { useEffect } from "react";
const useSyncMessagesWithLocalStorage = (
  selectedChatId: string | undefined,
  messages: Message[]
) => {
  useEffect(() => {
    if (selectedChatId && messages) {
      localStorage.setItem(
        `chatMessages_${selectedChatId}`,
        JSON.stringify(messages)
      );
    }
  }, [selectedChatId, messages]);
};

export default useSyncMessagesWithLocalStorage;
