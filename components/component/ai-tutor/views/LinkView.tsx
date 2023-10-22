import { ChatFileLink, UIFile } from "@/types/otherTypes";
import { Chat } from "@prisma/client";
import { Box, DropdownMenu } from "@radix-ui/themes";

type LinksProps = {
  selectedFile: UIFile | undefined;
  selectedChat: Chat | undefined;
  links: ChatFileLink | undefined;
  files: UIFile[] | undefined;
  chats: Chat[] | undefined;
  dispatch: React.Dispatch<any>;
};

const LinkView = ({ links, files, chats, dispatch }: LinksProps) => {
  const getLinkedFiles = (chatId: string) => {
    return links?.filter((link) => link.chatId === chatId) || [];
  };

  return (
    <Box className="flex flex-col space-y-2">
      {chats?.map((chat) => (
        <Box key={chat.id}>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Box
                className={`p-2 flex justify-between items-center cursor-pointer rounded 
                  hover:bg-gray-3 rounded-2`}
              >
                <Box className="flex-grow relative mr-4 max-w-[175px]">
                  <Box className="whitespace-nowrap overflow-hidden">
                    {chat.title || "Untitled Chat"}
                  </Box>
                </Box>
              </Box>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <Box className="p-2">
                {getLinkedFiles(chat.id).map((link) => {
                  const file = files?.find((file) => file.id === link.fileId);
                  return (
                    <Box key={link.id} className="mb-2">
                      {file?.name || "Untitled File"}
                    </Box>
                  );
                })}
              </Box>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Box>
      ))}
    </Box>
  );
};

export default LinkView;
