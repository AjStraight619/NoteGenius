"use client";
import AddChatDialog from "@/components/component/ai-tutor/add-chat/AddChatDialog";
import Chats from "@/components/component/ai-tutor/chat/Chats";
import ChatView from "@/components/component/ai-tutor/views/ChatView";
import Links from "@/components/component/ai-tutor/views/LinkView";
import Sidebar from "@/components/side-bar/Sidebar";
import { useChatSelection } from "@/hooks/useChatSelection";
import useInitialMessages from "@/hooks/useInitialMessages";
import {
  Chat,
  ChatFileLink,
  ChatWithMessages,
  FolderWithFiles,
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
import { useRouter } from "next/navigation";
import {
  experimental_useOptimistic as useOptimistic,
  useReducer,
  useState,
} from "react";
import SideBarToggle from "../../sidebar-buttons/SideBarToggle";

import { useFileSelection } from "@/hooks/useFileSelection";
// import useManageData from "@/hooks/useManageData";
import { FileAction, FileState } from "@/types/otherTypes";
import FileView from "../views/FileView";
import FolderDropDown from "../views/FolderDropDown";

type sideBarAITutorProps = {
  chats: Chat[] | undefined;
  folders: FolderWithFiles[] | undefined;
  mostRecentChat: ChatWithMessages | undefined;
  files: UIFile[] | undefined;
  mostRecentFile: UIFile | undefined;
  links: ChatFileLink | undefined;
};

function reducer(state: FileState, action: FileAction): FileState {
  console.log("Called dispatch for adding a file, this is the state", state);
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
    case "ADD_LINK":
      return {
        ...state,
        links: [...state.links, action.payload],
      };
    case "REMOVE_LINK":
      return {
        ...state,
        links: state.links.filter(
          (link) =>
            link.chatId !== action.payload.chatId ||
            link.fileId !== action.payload.fileId
        ),
      };
    case "UPDATE_LINK":
      return {
        ...state,
        links: state.links.map((link) =>
          link.chatId === action.payload.oldLink.chatId &&
          link.fileId === action.payload.oldLink.fileId
            ? action.payload.newLink
            : link
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
  mostRecentFile,
  links,
}: sideBarAITutorProps) => {
  const router = useRouter();
  const [view, setView] = useState("chats");

  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<
    FolderWithFiles | undefined
  >(undefined);
  const { selectedChat, selectChat } = useChatSelection(chats, mostRecentChat);
  const { selectedFile, selectFile } = useFileSelection(files, mostRecentFile);
  // const { manageData } = useManageData();

  console.log("These are the current folders", folders);
  const filesInFolders = folders?.map((folder) => folder.files) || [];
  console.log("These are the files in folders", filesInFolders);

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

  console.log("These are the links", links);

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
              {selectedFolder?.name || "Select Folder"}
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
            <Links
              selectedFile={selectedFile}
              selectedChat={selectedChat}
              dispatch={dispatch}
              links={links}
              files={files}
              chats={chats}
            />
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

          {/* <SearchFolders
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            view={view}
            setView={setView}
          /> */}

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
            initialMessages={initialMessages || mostRecentChat}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            addOptimisticFiles={addOptimisticFiles}
            state={state.files}
            dispatch={dispatch}
            optimisticFiles={optimisticFiles}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default SideBarAITutor;
