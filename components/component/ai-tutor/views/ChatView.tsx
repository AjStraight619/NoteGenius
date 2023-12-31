import { Chat } from "@/types/otherTypes";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Box, Flex } from "@radix-ui/themes";

type ActionType = "CREATE" | "UPDATE" | "DELETE" | null;

type ChatProps = {
  chats: Chat[] | undefined;
  selectedChatId: string | undefined;
  onSelectChat: (id: string) => void;
};

const ChatView = ({ chats, selectedChatId, onSelectChat }: ChatProps) => {
  // const handleChatAction = (actionType: ActionType, chatId: string) => {
  //   manageData(actionType, { type: "chat", id: chatId });
  // };

  return (
    <>
      {Array.isArray(chats) && chats.length > 0 ? (
        <Box className="flex flex-col space-y-2">
          {chats?.map((chat) => (
            <Box
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`p-2 flex justify-between items-center cursor-pointer rounded 
                  ${
                    chat.id === selectedChatId
                      ? "rounded-2 bg-gray-5"
                      : "hover:bg-gray-3 rounded-2"
                  }`}
            >
              <Box className="flex-grow relative mr-4 max-w-[175px]">
                <Box className="whitespace-nowrap overflow-hidden">
                  {chat.title || "Untitled Chat"}
                </Box>
                {chat.id === selectedChatId && <Box />}
              </Box>
              <Box className="w-10 flex-shrink-0 flex justify-end">
                {selectedChatId === chat.id ? (
                  <Flex direction={"row"} gap={"2"}>
                    <Pencil1Icon
                      onClick={(e) => {
                        e.stopPropagation();
                        // handleChatAction("UPDATE", chat.id);
                      }}
                    />
                    <TrashIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        // handleChatAction("DELETE", chat.id);
                      }}
                    />
                  </Flex>
                ) : null}
              </Box>
            </Box>
          ))}
        </Box>
      ) : null}
    </>
  );
};

export default ChatView;
