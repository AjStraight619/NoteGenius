import { getChats, getMostRecentChatMessages } from "@/actions/actions";
import SideBarAITutor from "@/components/side-bar/SideBarAITutor";
import { ChatWithMessages } from "@/types/otherTypes";

const ChatPage = async () => {
  const mostRecentChat =
    (await getMostRecentChatMessages()) as ChatWithMessages;

  let chats;
  let folders;

  chats = await getChats();

  return (
    <SideBarAITutor
      chats={chats}
      mostRecentChat={mostRecentChat}
      folders={folders}
    />
  );
};

export default ChatPage;
