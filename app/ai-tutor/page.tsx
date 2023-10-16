import { getChats, getMostRecentChatMessages } from "@/actions/actions";
import SideBarAITutor from "@/components/side-bar/SideBarAITutor";
import { ChatWithMessages } from "@/types/otherTypes";
import { Flex } from "@radix-ui/themes";

const ChatPage = async () => {
  const mostRecentChat =
    (await getMostRecentChatMessages()) as ChatWithMessages;

  let chats;
  let folders;

  chats = await getChats();

  return (
    <Flex direction="row">
      <SideBarAITutor
        chats={chats}
        mostRecentChat={mostRecentChat}
        folders={folders}
      />
    </Flex>
  );
};

export default ChatPage;
