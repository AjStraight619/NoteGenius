import { Flex } from "@radix-ui/themes";

// export const runtime = "edge";
import SideBarAITutor from "@/components/side-bar/SideBarAITutor";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { type User } from "@prisma/client";
import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";
const getChatsItems = async () => {
  const session = await getServerSession(authOptions);
  let chats, folders;

  if (!session) {
    redirect("/api/auth/signin");
  } else {
    const user = session.user as User;

    if (user && user.id) {
      const userId = user.id;
      try {
        chats = await prisma.chat.findMany({
          where: {
            userId: userId,
          },
          include: {
            chatMessages: true,
          },
        });

        folders = await prisma.folder.findMany({
          where: {
            userId: userId,
          },
          include: {
            files: true,
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        console.log("This is the chats", chats);
        return {
          chats: chats,
          folders: folders,
        };
      }
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
      <SideBarAITutor chats={chats} folders={folders} />
    </Flex>
  );
};

export default ChatPage;
