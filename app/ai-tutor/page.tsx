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
const getChats = async () => {
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
      return chats;
    }
    return null;
  }
};

const ChatPage = async () => {
  const chats = await getChats();

  return (
    <>
      <SideBarAITutor />
      <Chat chats={chats} />
    </>
  );
};

export default ChatPage;
