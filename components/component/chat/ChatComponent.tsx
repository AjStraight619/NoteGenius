"use client";
import Chats from "@/components/component/ai-tutor/chat/Chats";
import SideBarAITutor from "@/components/component/ai-tutor/side-bar/SideBarAITutor";
import {
  ChatWithMessages,
  FolderWithFiles,
  Link,
  UIFile,
} from "@/types/otherTypes";
import { useEffect, useOptimistic, useState } from "react";

import useInitialMessages from "@/hooks/useInitialMessages";
import { useChatSelectionContext } from "../../../app/contexts/ChatSelectionProvider";
import { useFileContext } from "../../../app/contexts/FileSelectionProvider";

type ChatComponentProps = {
  chats: ChatWithMessages[] | undefined;
  folders: FolderWithFiles[] | undefined;
  mostRecentChat: ChatWithMessages | undefined;
  files: UIFile[] | undefined;
  mostRecentFile: UIFile | undefined;
  links: Link[] | undefined;
};

const ChatComponent = ({
  chats,
  folders,
  mostRecentChat,
  mostRecentFile,
  files,
  links,
}: ChatComponentProps) => {
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // Call handleResize initially in case the page loads on a small screen
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { selectChat, selectedChat } = useChatSelectionContext();
  const { state, dispatch } = useFileContext();

  const { initialMessages } = useInitialMessages({
    chatId: selectedChat?.id,
    messages: selectedChat,
  });

  const [selectedFolder, setSelectedFolder] = useState<
    FolderWithFiles | undefined
  >(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [optimisticFiles, addOptimisticFiles] = useOptimistic(
    files,
    (state: UIFile[] = [], newFile: UIFile) => {
      return [newFile, ...state];
    }
  );

  const [optimisticChats, addOptimisticChats] = useOptimistic(
    chats,
    (state: ChatWithMessages[] = [], newChat: ChatWithMessages) => {
      return [newChat, ...state];
    }
  );

  const handleResize = () => {
    if (window.innerWidth < 768) {
      // Adjust 768px as needed for your mobile breakpoint
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <SideBarAITutor
        chats={chats}
        folders={folders}
        mostRecentChat={mostRecentChat}
        files={files}
        mostRecentFile={mostRecentFile}
        links={links}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        addOptimisticChats={addOptimisticChats}
        optimisticChats={optimisticChats}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
      />
      <Chats
        selectedChatId={selectedChat?.id}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        initialMessages={initialMessages}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        addOptimisticFiles={addOptimisticFiles}
        folders={folders}
        optimisticFiles={optimisticFiles}
        links={links}
        chats={chats}
      />
    </>
  );
};

export default ChatComponent;
