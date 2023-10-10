import { Box, Flex } from "@radix-ui/themes";

import Chats from "@/components/component/chat/chat";
// export const runtime = "edge";
import SideBarAITutor from "@/components/side-bar/SideBarAITutor";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { type User } from "@prisma/client";
import { getServerSession } from "next-auth";

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
  let chatMessages;
  if (chatItems !== null) {
    ({ chats, folders } = chatItems);
  }

  return (
    <Flex direction="row">
      <Box>
        <SideBarAITutor chats={chats} folders={folders} />
      </Box>
      <Flex width={"100%"} grow={"1"} display={"flex"} direction={"column"}>
        <Chats />
      </Flex>
    </Flex>
  );
};

export default ChatPage;
