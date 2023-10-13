import { Chat } from "@/types/otherTypes";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Box, Flex } from "@radix-ui/themes";

type ChatProps = {
  chats: Chat[] | undefined;
};

const ChatView = ({ chats }: ChatProps) => {
  return (
    <>
      <Flex direction={"column"} grow={"1"} gap={"2"}>
        {Array.isArray(chats) && chats.length > 0 ? (
          <Box className="flex flex-col space-y-2 p-3">
            {chats?.map((chat, index) => (
              <Box
                key={index}
                className="truncate bg-gray-100 p-2 rounded"
                pr={"3"}
              >
                <Flex direction={"row"} gap={"1"} justify={"between"}>
                  {chat.title || "Untitled Chat"}

                  <Flex direction={"row"} gap={"2"}>
                    <Pencil1Icon />
                    <TrashIcon />
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Box>
        ) : (
          <div>No chats available</div>
        )}
      </Flex>
    </>
  );
};

export default ChatView;
