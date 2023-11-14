import {
  getAllChatsWithFiles,
  getChats,
  getFolders,
  getMathResponses,
  getMostRecentChatMessages,
  getMostRecentFile,
} from "@/actions/actions";
import ChatComponent from "@/components/component/chat/ChatComponent";
import { ChatWithMessages, Link, UIFile } from "@/types/otherTypes";
import { getSession } from "@/utils/getSession";
import { redirect } from "next/navigation";
import { ChatSelectionProvider } from "../contexts/ChatSelectionProvider";
import { FileProvider } from "../contexts/FileSelectionProvider";

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
  const mathResponses = await getMathResponses();
  const filesWithFolderInfo: UIFile[] | undefined = folders?.flatMap((folder) =>
    folder.files.map((file) => ({
      ...file,
      folderName: folder.name,
    }))
  );

  return (
    <ChatSelectionProvider chats={chats} initialChat={mostRecentChat}>
      <FileProvider>
        <div className="overflow-hidden flex h-full w-full relative z-0">
          <ChatComponent
            chats={chats}
            folders={folders}
            mostRecentChat={mostRecentChat}
            files={filesWithFolderInfo}
            mostRecentFile={mostRecentFile}
            links={links}
          />
        </div>
      </FileProvider>
    </ChatSelectionProvider>
  );
};

export default ChatPage;

const transformToLinks = (chats: ChatWithMessages[]): Link[] => {
  return chats.flatMap((chat) =>
    chat.files.map((file) => ({
      id: `${chat.id}-${file.id}`,
      chatId: chat.id,
      fileId: file.id,
      chat,
      file,
    }))
  );
};
