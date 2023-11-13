"use client";
import AddChatDialog from "@/components/component/ai-tutor/add-chat/AddChatDialog";
import Chats from "@/components/component/ai-tutor/chat/Chats";
import ChatView from "@/components/component/ai-tutor/views/ChatView";
import Links from "@/components/component/ai-tutor/views/LinkView";
import Sidebar from "@/components/side-bar/Sidebar";
import useInitialMessages from "@/hooks/useInitialMessages";
import {
  ChatWithMessages,
  FolderWithFiles,
  Link,
  UIFile,
} from "@/types/otherTypes";
import { ChatBubbleIcon, Link1Icon } from "@radix-ui/react-icons";
import {
  Box,
  Flex,
  IconButton,
  Separator,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import {
  useEffect,
  experimental_useOptimistic as useOptimistic,
  useState,
} from "react";
import SideBarToggle from "../../sidebar-buttons/SideBarToggle";

// import useManageData from "@/hooks/useManageData";
import { useChatSelectionContext } from "@/app/contexts/ChatSelectionProvider";
import FileView from "../views/FileView";
import FolderDropDown from "../views/FolderDropDown";

import { useFileContext } from "@/app/contexts/FileSelectionProvider";
import { useFileSelection } from "@/hooks/useFileSelection";

type sideBarAITutorProps = {
  chats: ChatWithMessages[] | undefined;
  folders: FolderWithFiles[] | undefined;
  mostRecentChat: ChatWithMessages | undefined;
  files: UIFile[] | undefined;
  mostRecentFile: UIFile | undefined;
  links: Link[] | undefined;
};

export type SelectChatProps = {
  title: string;
  id: string;
};

const SideBarAITutor = ({
  chats,
  mostRecentChat,
  folders,
  files,
  mostRecentFile,
  links,
}: sideBarAITutorProps) => {
  const [view, setView] = useState("chats");

  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<
    FolderWithFiles | undefined
  >(undefined);
  const { selectedChat, selectChat } = useChatSelectionContext();

  const { state, dispatch } = useFileContext();

  const { initialMessages } = useInitialMessages({
    chatId: selectedChat?.id,
    messages: selectedChat,
  });

  useEffect(() => {
    console.log("component sidebar ai-tutor re rendered re rendered");
  }, []);

  const { selectFile, selectedFile } = useFileSelection(files, mostRecentFile);

  const [optimisticChats, addOptimisticChats] = useOptimistic(
    chats,
    (state: ChatWithMessages[] = [], newChat: ChatWithMessages) => {
      return [newChat, ...state];
    }
  );

  const [optimisticFiles, addOptimisticFiles] = useOptimistic(
    files,
    (state: UIFile[] = [], newFile: UIFile) => {
      return [newFile, ...state];
    }
  );

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  function sideBarOptionsView() {
    switch (view) {
      case "files":
        return (
          <>
            <Text size={"1"} color="gray">
              {selectedFolder?.name || "Select Folderr"}
            </Text>
            <Box width={"100%"} pb={"2"}>
              <Separator size={"4"} />
            </Box>
            <FileView
              selectedFolder={selectedFolder}
              selectedFileId={selectedFile?.id || undefined}
              onSelectFile={selectFile}
            />
          </>
        );
      case "links":
        return (
          <>
            <Text size={"1"} color="gray">
              Links
            </Text>
            <Box width={"100%"} pb={"2"}>
              <Separator size={"4"} />
            </Box>
            <Links links={links} files={files} chats={chats} />
          </>
        );
      default:
        return (
          <>
            <Text size={"1"} color="gray">
              Chats
            </Text>
            <Box width={"100%"} pb={"2"}>
              <Separator size={"4"} />
            </Box>
            <ChatView
              chats={optimisticChats}
              selectedChatId={selectedChat?.id || undefined}
              onSelectChat={selectChat}
            />
          </>
        );
    }
  }

  return (
    <>
      <Flex direction={"row"}>
        {!isSidebarOpen ? (
          <SideBarToggle
            toggleSidebar={toggleSidebar}
            isSideBarOpen={isSidebarOpen}
            className="absolute top-2.5 left-2.5"
          />
        ) : null}

        <Sidebar isSidebarOpen={isSidebarOpen}>
          <Flex direction={"row"} align={"center"} justify={"center"} gap={"3"}>
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

          <Flex direction={"row"} justify="center" gap="3">
            <Tooltip content="View Chats">
              <IconButton
                variant="ghost"
                mr={"3"}
                onClick={() => setView("chats")}
              >
                <ChatBubbleIcon width={"25px"} height={"25px"} />
              </IconButton>
            </Tooltip>
            <FolderDropDown
              setSelectedFolder={setSelectedFolder}
              folders={folders}
              setView={setView}
            />
            <Tooltip content="Chats linked with files">
              <IconButton variant="ghost">
                <Link1Icon
                  width={"25px"}
                  height={"25px"}
                  onClick={() => setView("links")}
                />
              </IconButton>
            </Tooltip>
          </Flex>

          <Box className="overflow-y-auto" width={"100%"}>
            {sideBarOptionsView()}
          </Box>
        </Sidebar>

        <Flex grow={"1"} direction={"column"} position={"relative"}>
          <Chats
            key={selectedChat?.id || mostRecentChat?.id}
            folders={folders}
            selectedChatId={selectedChat?.id || mostRecentChat?.id}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
            initialMessages={initialMessages || mostRecentChat}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            addOptimisticFiles={addOptimisticFiles}
            optimisticFiles={optimisticFiles}
            links={links}
            chats={optimisticChats}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default SideBarAITutor;
