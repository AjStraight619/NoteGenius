import SideBarAITutor from "@/components/side-bar/SideBarAITutor";
import { Flex } from "@radix-ui/themes";

// export const runtime = "edge";

import { getChats, getMostRecentChatMessages } from "@/actions/actions";
import { ChatWithMessages } from "@/types/otherTypes";

const ChatPage = async () => {
  const mostRecentChat =
    (await getMostRecentChatMessages()) as ChatWithMessages;

  let chats;
  let folders;

  chats = await getChats();

  for (let i = 0; i < chats.length; i++) {
    console.log(chats[i].chatMessages);
  }

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
