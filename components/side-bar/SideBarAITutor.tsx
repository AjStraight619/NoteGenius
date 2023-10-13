"use client";
import Chats from "@/components/component/chat/chat";
import { Chat } from "@/types/otherTypes";
import type { Folder } from "@prisma/client";
import { type ChatMessage } from "@prisma/client";
import {
  ChatBubbleIcon,
  FilePlusIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import { Box, Flex, IconButton } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import ChatView from "../component/ai-tutor/ChatView";
import FolderView from "../component/ai-tutor/FolderView";
import SearchFolders from "../component/search/SearchFolders";

const SideBarAITutor = ({
  chats,
  folders,
}: {
  chats: Chat[] | undefined;
  folders: Folder[] | undefined;
}) => {
  const [view, setView] = useState("chats");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    undefined
  );
  const [currentChatMessage, setCurrentChatMessage] = useState<
    ChatMessage[] | undefined
  >(undefined);

  // Grab the latest chat to display to the user
  useEffect(() => {
    const earliestDate = chats?.reduce((earliest, chat) => {
      return chat.updatedAt < earliest ? chat.updatedAt : earliest;
    }, new Date());
    const mostRecentChat =
      chats?.find((chat) => chat.updatedAt === earliestDate) ?? null;
    setCurrentChat(mostRecentChat);
    // Extract and set chatMessages from the most recent chat
    setSelectedChatId(mostRecentChat?.id);
    const { chatMessages } = mostRecentChat ?? {};
    setCurrentChatMessage(chatMessages);
  }, []);

  const { chatMessages } = currentChat ?? {};
  console.log("These are the most recent chat messages", chatMessages);

  if (chatMessages) {
    for (let i = 0; i < chatMessages.length; i++) {
      console.log(chatMessages[i].content);
    }
  } else {
    console.log("no chat messages");
  }

  return (
    <>
      <Box
        position={"sticky"}
        top={"0"}
        className="w-64 h-screen bg-gray-100 border-r border-gray-300 flex flex-col justify-start p-4"
      >
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
          {view === "chats" ? <ChatView chats={chats} /> : <FolderView />}
        </Box>
      </Box>
      <Flex width={"100%"} grow={"1"} display={"flex"} direction={"column"}>
        <Chats
          selectedChatId={selectedChatId}
          currentChatMessage={currentChatMessage}
        />
      </Flex>
    </>
  );
};

export default SideBarAITutor;
