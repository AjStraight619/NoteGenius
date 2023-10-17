"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/utils/getSession";
import { revalidatePath } from "next/cache";

export const addChat = async (formData: FormData) => {
  const userId = (await getSession()) as unknown as string;
  const title = formData.get("title") as string;

  const addedChat = await prisma.chat.create({
    data: {
      title,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  revalidatePath("/'ai-tutor'");
  return {
    addedChat,
  };
};

export const deleteChat = async (chatId: string) => {
  const userId = (await getSession()) as unknown as string;

  const deletedChat = await prisma.chat.delete({
    where: {
      id: chatId,
      userId,
    },
  });

  revalidatePath("/chat");
  return {
    deletedChat,
  };
};

export const addChatMessage = async (
  chatId: string,
  messageContent: string
) => {
  const userId = (await getSession()) as unknown as string;

  const addedChatMessage = await prisma.chat.update({
    where: { id: chatId, userId },
    data: {
      chatMessages: {
        create: {
          content: messageContent,
          role: "user",
        },
      },
    },
  });

  return addedChatMessage;
};

export const getMostRecentChatMessages = async () => {
  const userId = (await getSession()) as unknown as string;

  const chat = await prisma.chat.findFirst({
    where: {
      userId: userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      chatMessages: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  revalidatePath("/ai-tutor");

  return chat;
};

export const getChats = async () => {
  const userId = (await getSession()) as unknown as string;

  const chats = await prisma.chat.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      chatMessages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return chats;
};
