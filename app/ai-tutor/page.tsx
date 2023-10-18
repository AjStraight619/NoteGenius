import {
  getChats,
  getFolders,
  getMostRecentChatMessages,
} from "@/actions/actions";
import SideBarAITutor from "@/components/component/ai-tutor/side-bar/SideBarAITutor";
import { ChatWithMessages, UIFile } from "@/types/otherTypes";

const ChatPage = async () => {
  const mostRecentChat =
    (await getMostRecentChatMessages()) as ChatWithMessages;

  let chats;
  let folders;
  let links;

  chats = await getChats();
  folders = await getFolders();

  const filesWithFolderInfo: UIFile[] | undefined = folders?.flatMap((folder) =>
    folder.files.map((file) => ({
      ...file,
      folderName: folder.name,
    }))
  );

  console.log("These are the files related to a folder", filesWithFolderInfo);

  return (
    <SideBarAITutor
      chats={chats}
      mostRecentChat={mostRecentChat}
      folders={folders}
      files={filesWithFolderInfo}
    />
  );
};

export default ChatPage;
