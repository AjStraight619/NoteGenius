import React from "react";
import {
  Box,
  Flex,
  TextArea,
  Text,
  ScrollArea,
  IconButton,
} from "@radix-ui/themes";

import Chat from "@/components/component/chat/chat";
import ChatLog from "@/components/component/chatlog/chatlog";
// export const runtime = "edge";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { type User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import SideBarAITutor from "@/components/side-bar/SideBarAITutor";

import { redirect } from "next/navigation";
const getChatsItems = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  } else {
    const user = session.user as User;

    if (user && user.id) {
      const userId = user.id;
      const chats = await prisma.chat.findMany({
        where: {
          userId: userId,
        },
        include: {
          chatMessages: true,
        },
      });

      const folders = await prisma.folder.findMany({
        where: {
          userId: userId,
        },
        include: {
          files: true,
        },
      });
      return {
        chats: chats,
        folders: folders,
      };
    }
  }
  return null;
};

const ChatPage = async () => {
  const chatItems = await getChatsItems();
  let chats;
  let folders;
  if (chatItems !== null) {
    ({ chats, folders } = chatItems);
  }

  return (
    <Flex direction="row">
      <Box>
        <SideBarAITutor chats={chats} folders={folders} />
      </Box>
      <Flex width={"100%"} grow={"1"} display={"flex"} direction={"column"}>
        <Chat />
      </Flex>
    </Flex>
  );
};

export default ChatPage;
