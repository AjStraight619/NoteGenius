"use client";
import { useState } from "react";
import type { Chat, Folder } from "@prisma/client";

import {
  Box,
  Flex,
  TextArea,
  Text,
  ScrollArea,
  IconButton,
} from "@radix-ui/themes";

import {
  FilePlusIcon,
  ChatBubbleIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import SearchFolders from "../component/search/SearchFolders";
import FolderView from "../component/ai-tutor/FolderView";
import ChatView from "../component/ai-tutor/ChatView";

type SideBarAITutorProps = {
  chats: Chat[] | undefined;
  folders: Folder[] | undefined;
};

const SideBarAITutor = ({ chats, folders }: SideBarAITutorProps) => {
  const [view, setView] = useState("chats");
  const [searchTerm, setSearchTerm] = useState("");

  console.log("These are the chats", chats);
  console.log("These are the folders", folders);

  return (
    <Box className="w-64 h-screen bg-gray-100 border-r border-gray-300 flex flex-col justify-start p-4">
      <Flex direction={"row"} justify="center">
        <IconButton style={{ backgroundColor: "transparent" }}>
          <FilePlusIcon
            style={{ width: "25px", height: "25px", color: "white" }}
          />
        </IconButton>
        <IconButton style={{ backgroundColor: "transparent" }} ml={"5"}>
          <ChatBubbleIcon
            style={{ width: "25px", height: "25px", color: "white" }}
          />
        </IconButton>
        <IconButton style={{ backgroundColor: "transparent" }} ml={"5"}>
          <HamburgerMenuIcon
            style={{ width: "25px", height: "25px", color: "white" }}
          />
        </IconButton>
      </Flex>
      <Box pt={"3"}>
        <SearchFolders
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          view={view}
          setView={setView}
        />
      </Box>

      <Box className="flex-grow overflow-y-auto">
        {view === "chats" ? <ChatView /> : <FolderView />}
      </Box>
    </Box>
  );
};

export default SideBarAITutor;
