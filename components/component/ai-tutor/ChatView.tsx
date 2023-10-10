import { Chat } from "@/types/otherTypes";
import { Box, Flex } from "@radix-ui/themes";

type ChatProps = {
  chats: Chat[] | undefined;
};

const ChatView = ({ chats }: ChatProps) => {
  return (
    <Flex direction={"column"} grow={"1"} gap={"2"}>
      <Box p={"3"}>
        {chats?.map((chat, index) => (
          <div key={index}>
            {chat.title} - {chat.content}
          </div>
        ))}
      </Box>
    </Flex>
  );
};

export default ChatView;
