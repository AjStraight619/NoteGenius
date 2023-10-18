"use client";
import AddChatDialog from "@/components/component/ai-tutor/add-chat/AddChatDialog";
import Chats from "@/components/component/ai-tutor/chat/Chats";
import ChatView from "@/components/component/ai-tutor/views/ChatView";
import FolderView from "@/components/component/ai-tutor/views/FolderView";
import SearchFolders from "@/components/component/search/SearchFolders";
import Sidebar from "@/components/side-bar/Sidebar";
import { useChatSelection } from "@/hooks/useChatSelection";

import useInitialMessages from "@/hooks/useInitialMessages";
import {
  Chat,
  ChatWithMessages,
  FolderWithFiles,
  UIFile,
} from "@/types/otherTypes";
import { ChatBubbleIcon, Link1Icon, StackIcon } from "@radix-ui/react-icons";
import { Box, Flex, IconButton } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import {
  experimental_useOptimistic as useOptimistic,
  useReducer,
  useState,
} from "react";
import SideBarToggle from "../../sidebar-buttons/SideBarToggle";

import { FileAction, FileState } from "@/types/otherTypes";

type sideBarAITutorProps = {
  chats: Chat[] | undefined;
  folders: FolderWithFiles[] | undefined;
  mostRecentChat: ChatWithMessages | undefined;
  files: UIFile[] | undefined;
};

function reducer(state: FileState, action: FileAction): FileState {
  switch (action.type) {
    case "ADD_FILE":
      return {
        ...state,
        files: [...state.files, ...action.payload],
      };
    case "REMOVE_FILE":
      return {
        ...state,
        files: state.files.filter((file) => file.id !== action.payload.id),
      };
    case "UPDATE_FILE":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.id ? action.payload : file
        ),
      };
    case "PROCESSING_FILE":
      return {
        ...state,
        processing: action.payload,
      };
    default:
      return state;
  }
}

const SideBarAITutor = ({
  chats,
  mostRecentChat,
  folders,
  files,
}: sideBarAITutorProps) => {
  const router = useRouter();
  const [view, setView] = useState("chats");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const { selectedChat, selectChat } = useChatSelection(chats, mostRecentChat);

  const initialState: any = { files: [], processing: false };
  const [state, dispatch] = useReducer(reducer, initialState);

  const filenames =
    folders?.map((folder) => folder.files.map((file) => file.name)).flat() ||
    [];

  const { initialMessages } = useInitialMessages({
    chatId: selectedChat?.id,
    messages: selectedChat,
  });

  const [optimisticChats, addOptimisticChats] = useOptimistic(
    chats,
    (state: ChatWithMessages[] = [], newChat: ChatWithMessages) => {
      return [newChat, ...state];
    }
  );

  const [optimisticFiles, addOptimisticFiles] = useOptimistic(
    filenames,
    (state: string[] = [], newFile: string) => {
      return [newFile, ...state];
    }
  );

  // const [optimisticUploads, addOptimisticUploads] = useOptimistic();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleDeleteChat = async (chatId: string) => {
    const res = await fetch(`/api/users-chats?chatId=${chatId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    router.refresh();
    console.log("This is the data returned from the delete request", data);
  };

  const handleEditChat = async (chatId: string) => {};

  return (
    <Flex
      direction={"row"}
      style={{ backgroundColor: "transparent" }}
      position={"relative"}
    >
      <SideBarToggle
        toggleSidebar={toggleSidebar}
        isSideBarOpen={isSidebarOpen}
      />
      <Sidebar isSidebarOpen={isSidebarOpen}>
        <AddChatDialog
          chats={chats}
          addOptimisticChats={addOptimisticChats}
          optimisticChats={optimisticChats}
        />

        <SearchFolders
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          view={view}
          setView={setView}
        />

        <Flex direction={"row"} justify="center" gap="5">
          <IconButton variant="ghost">
            <ChatBubbleIcon width={"25px"} height={"25px"} />
          </IconButton>
          <IconButton variant="ghost">
            <Link1Icon width={"25px"} height={"25px"} />
          </IconButton>
          <IconButton variant="ghost">
            <StackIcon width={"25px"} height={"25px"} />
          </IconButton>
        </Flex>

        <Box className="flex-grow overflow-y-auto">
          {view === "chats" ? (
            <ChatView
              chats={optimisticChats}
              selectedChatId={selectedChat?.id || undefined}
              onDeleteChat={handleDeleteChat}
              onEditChat={handleEditChat}
              onSelectChat={selectChat}
            />
          ) : (
            <FolderView />
          )}
        </Box>
      </Sidebar>
      <Flex grow={"1"} direction={"column"} position={"relative"}>
        <Chats
          key={selectedChat?.id || mostRecentChat?.id}
          selectedChatId={selectedChat?.id || mostRecentChat?.id}
          initialMessages={initialMessages || mostRecentChat}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          addOptimisticFiles={addOptimisticFiles}
          state={state.files}
          dispatch={dispatch}
        />
      </Flex>
    </Flex>
  );
};

export default SideBarAITutor;
