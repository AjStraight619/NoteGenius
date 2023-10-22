import {
  getAllChatsWithFiles,
  getChats,
  getFolders,
  getMostRecentChatMessages,
  getMostRecentFile,
} from "@/actions/actions";
import SideBarAITutor from "@/components/component/ai-tutor/side-bar/SideBarAITutor";
import { ChatWithMessages, UIFile } from "@/types/otherTypes";
import { getSession } from "@/utils/getSession";
import { redirect } from "next/navigation";

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
  let links;

  chats = await getChats();
  folders = await getFolders();
  links = await getAllChatsWithFiles();

  console.log("These are the chats with associated links", links);

  const filesWithFolderInfo: UIFile[] | undefined = folders?.flatMap((folder) =>
    folder.files.map((file) => ({
      ...file,
      folderName: folder.name,
    }))
  );

  // console.log("These are the files related to a folder", filesWithFolderInfo);

  return (
    <SideBarAITutor
      chats={chats}
      mostRecentChat={mostRecentChat}
      folders={folders}
      files={filesWithFolderInfo}
      mostRecentFile={mostRecentFile}
      links={links}
    />
  );
};

export default ChatPage;
