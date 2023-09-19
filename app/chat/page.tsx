import Chat from "@/components/component/chat/chat";
import ChatLog from "@/components/component/chatlog/chatlog";
// export const runtime = "edge";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { type User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// get chat messsages if there is a session and user exists

//TODO: Can't fetch in this file for some reason but can in folders?

const getChats = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
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
  console.log("Here are the chats: ", chats);
  return <Chat chats={chats} />;
};

export default ChatPage;
