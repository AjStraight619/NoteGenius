"use client";
import Chats from "@/components/component/chat/Chats";
import { useChatSelection } from "@/hooks/useChatSelection";
import useInitialMessages from "@/hooks/useInitialMessages";
import { Chat, ChatWithMessages } from "@/types/otherTypes";
import type { Folder } from "@prisma/client";
import { ChatBubbleIcon, FilePlusIcon } from "@radix-ui/react-icons";
import { Box, Flex, IconButton } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { experimental_useOptimistic as useOptimistic, useState } from "react";
import AddChatDialog from "../add-chat/AddChatDialog";
import ChatView from "../component/ai-tutor/ChatView";
import FolderView from "../component/ai-tutor/FolderView";
import SearchFolders from "../component/search/SearchFolders";
import SideBarToggle from "../component/sidebar-buttons/SideBarToggle";
import Sidebar from "./SideBar";

type sideBarAITutorProps = {
  chats: Chat[] | undefined;
  folders: Folder[] | undefined;
  mostRecentChat: ChatWithMessages | undefined;
};

const SideBarAITutor = ({ chats, mostRecentChat }: sideBarAITutorProps) => {
  const router = useRouter();
  const [view, setView] = useState("chats");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { selectedChat, selectChat } = useChatSelection(chats, mostRecentChat);

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
    <>
      <Sidebar isSidebarOpen={isSidebarOpen}>
        <Flex gap={"2"}>
          <AddChatDialog
            chats={chats}
            addOptimisticChats={addOptimisticChats}
            optimisticChats={optimisticChats}
          />
          <SideBarToggle
            toggleSidebar={toggleSidebar}
            isSideBarOpen={isSidebarOpen}
          />
        </Flex>

        <SearchFolders
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          view={view}
          setView={setView}
        />

        <Flex direction={"row"} justify="center">
          <IconButton variant="ghost">
            <FilePlusIcon width={"25px"} height={"25px"} />
          </IconButton>
          <IconButton ml={"5"} variant="ghost">
            <ChatBubbleIcon width={"25px"} height={"25px"} />
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
      <Flex grow={"1"} display={"flex"} direction={"column"}>
        <Chats
          key={selectedChat?.id || mostRecentChat?.id}
          selectedChatId={selectedChat?.id || mostRecentChat?.id}
          initialMessages={initialMessages || mostRecentChat}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </Flex>
    </>
  );
};

export default SideBarAITutor;
