"use client";
import { useChatSelectionContext } from "@/app/contexts/ChatSelectionProvider";
import AddChatDialog from "@/components/component/ai-tutor/add-chat/AddChatDialog";
import ChatView from "@/components/component/ai-tutor/views/ChatView";
import Links from "@/components/component/ai-tutor/views/LinkView";
import Sidebar from "@/components/side-bar/Sidebar";
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
import { SetStateAction, useState } from "react";
import SideBarToggle from "../../sidebar-buttons/SideBarToggle";
import FileView from "../views/FileView";
import FolderDropDown from "../views/FolderDropDown";

import { useFileSelection } from "@/hooks/useFileSelection";
import { ScrollArea } from "@radix-ui/react-scroll-area";

type sideBarAITutorProps = {
  chats: ChatWithMessages[] | undefined;
  folders: FolderWithFiles[] | undefined;
  mostRecentChat: ChatWithMessages | undefined;
  files: UIFile[] | undefined;
  mostRecentFile: UIFile | undefined;
  links: Link[] | undefined;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  addOptimisticChats: (newChat: ChatWithMessages) => void;
  optimisticChats: ChatWithMessages[] | undefined;
  selectedFolder: FolderWithFiles | undefined;
  setSelectedFolder: React.Dispatch<
    SetStateAction<FolderWithFiles | undefined>
  >;
};

export type SelectChatProps = {
  title: string;
  id: string;
};

const SideBarAITutor = ({
  chats,
  folders,
  files,
  mostRecentFile,
  links,
  isSidebarOpen,
  toggleSidebar,
  addOptimisticChats,
  optimisticChats,
  selectedFolder,
  setSelectedFolder,
}: sideBarAITutorProps) => {
  const [view, setView] = useState("chats");
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedChat, selectChat } = useChatSelectionContext();
  const { selectFile, selectedFile } = useFileSelection(files, mostRecentFile);

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
      <ScrollArea style={{ height: "calc[(100% - 40px)]" }}>
        <Flex direction={"row"}>
          {!isSidebarOpen ? (
            <SideBarToggle
              toggleSidebar={toggleSidebar}
              isSideBarOpen={isSidebarOpen}
              className="absolute top-2.5 left-2.5"
            />
          ) : null}

          <Sidebar isSidebarOpen={isSidebarOpen}>
            <Flex
              direction={"row"}
              align={"center"}
              justify={"center"}
              gap={"3"}
            >
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
                  className="hover:cursor-pointer"
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
                    className="hover:cursor-pointer"
                  />
                </IconButton>
              </Tooltip>
            </Flex>

            <Box width={"100%"} mb={"8"} pb={"8"}>
              {sideBarOptionsView()}
            </Box>
          </Sidebar>
        </Flex>
      </ScrollArea>
    </>
  );
};

export default SideBarAITutor;
