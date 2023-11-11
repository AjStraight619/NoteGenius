import {
  getAllChatsWithFiles,
  getChats,
  getFolders,
  getMostRecentChatMessages,
  getMostRecentFile,
} from "@/actions/actions";
import SideBarAITutor from "@/components/component/ai-tutor/side-bar/SideBarAITutor";
import { ChatWithMessages, Link, UIFile } from "@/types/otherTypes";
import { getSession } from "@/utils/getSession";
import { redirect } from "next/navigation";
import { ChatSelectionProvider } from "../contexts/ChatSelectionProvider";

const ChatPage = async () => {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const mostRecentChat =
    (await getMostRecentChatMessages()) as ChatWithMessages;
  const mostRecentFile = (await getMostRecentFile()) as UIFile;

  let chats;
  let folders;
  chats = await getChats();
  folders = await getFolders();
  const chatsWithFiles = await getAllChatsWithFiles();
  const links = transformToLinks(chatsWithFiles);
  console.log("links", links);

  const filesWithFolderInfo: UIFile[] | undefined = folders?.flatMap((folder) =>
    folder.files.map((file) => ({
      ...file,
      folderName: folder.name,
    }))
  );

  return (
    <ChatSelectionProvider chats={chats} initialChat={mostRecentChat}>
      <SideBarAITutor
        chats={chats}
        mostRecentChat={mostRecentChat}
        folders={folders}
        files={filesWithFolderInfo}
        mostRecentFile={mostRecentFile}
        links={links}
      />
    </ChatSelectionProvider>
  );
};

export default ChatPage;

const transformToLinks = (chats: ChatWithMessages[]): Link[] => {
  return chats.flatMap((chat) =>
    chat.files.map((file) => ({
      id: `${chat.id}-${file.id}`, // Create a composite ID, for example
      chatId: chat.id,
      fileId: file.id,
      chat,
      file,
    }))
  );
};
