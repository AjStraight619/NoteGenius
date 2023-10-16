import { ChatWithMessages } from "@/types/otherTypes";
import { useEffect, useState } from "react";

type useInitialMessagesProps = {
  chatId: string | undefined;
  messages: ChatWithMessages | undefined;
};

const useInitialMessages = ({ chatId, messages }: useInitialMessagesProps) => {
  const [initialMessages, setInitialMessages] = useState<
    ChatWithMessages | undefined
  >(undefined);

  useEffect(() => {
    if (chatId && messages) {
      setInitialMessages(messages);
    }
  }, [chatId, messages]);

  return {
    initialMessages,
  };
};

export default useInitialMessages;
