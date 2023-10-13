import { Chat } from "@/types/otherTypes";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Box, Flex } from "@radix-ui/themes";

type ChatProps = {
  chats: Chat[] | undefined;
  selectedChat: Chat | null;
  onDeleteChat: (chatId: string) => void;
  onEditChat: (chatId: string) => void;
  onSelectChat: (chat: Chat) => void;
};

const ChatView = ({
  chats,
  selectedChat,
  onDeleteChat,
  onEditChat,
  onSelectChat,
}: ChatProps) => {
  const getChatStyle = (chat: Chat) => {
    return chat === selectedChat
      ? "truncate bg-blue-100 p-2 rounded"
      : "truncate bg-gray-100 p-2 rounded";
  };
  return (
    <>
      <Flex direction={"column"} grow={"1"} gap={"2"}>
        {Array.isArray(chats) && chats.length > 0 ? (
          <Box className="flex flex-col space-y-2 p-3">
            {chats?.map((chat) => (
              <Box
                key={chat.id}
                className={getChatStyle(chat) + "hover: cursor-pointer"}
                pr={"3"}
                onClick={() => onSelectChat(chat)}
              >
                <Flex direction={"row"} gap={"1"} justify={"between"}>
                  {chat.title || "Untitled Chat"}

                  <Flex direction={"row"} gap={"2"}>
                    <Pencil1Icon
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditChat(chat.id);
                      }}
                    />
                    <TrashIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                    />
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Box>
        ) : null}
      </Flex>
    </>
  );
};

export default ChatView;
