import {
  getChats,
  getFolders,
  getLinks,
  getMostRecentChatMessages,
} from "@/actions/actions";
import SideBarAITutor from "@/components/component/ai-tutor/side-bar/SideBarAITutor";
import { ChatWithMessages } from "@/types/otherTypes";

const ChatPage = async () => {
  const mostRecentChat =
    (await getMostRecentChatMessages()) as ChatWithMessages;

  let chats;
  let folders;
  let links;

  chats = await getChats();
  links = await getLinks();
  folders = await getFolders();

  console.log("These are the folders fromt the db", folders);

  return (
    <SideBarAITutor
      chats={chats}
      mostRecentChat={mostRecentChat}
      folders={folders}
    />
  );
};

export default ChatPage;
