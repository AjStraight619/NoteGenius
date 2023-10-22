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

  revalidatePath("/ai-tutor");
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
  revalidatePath("/ai-tutor");

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
      files: true,
    },
  });
  revalidatePath("/ai-tutor");

  return chats;
};

export const getFolders = async () => {
  const userId = (await getSession()) as unknown as string;
  const folders = await prisma.folder.findMany({
    where: {
      userId: userId,
    },
    include: {
      files: true,
    },
  });

  revalidatePath("/ai-tutor");

  return folders;
};

export const addFile = async (formData: FormData) => {
  const userId = (await getSession()) as unknown as string;
  const fileCount = Number(formData.get("fileCount"));
  const fileCreationPromises = [];

  for (let i = 0; i < fileCount; i++) {
    const name = formData.get(`files[${i}].name`) as string;
    const type = formData.get(`files[${i}].type`) as string;
    const content = formData.get(`files[${i}].content`) as string;
    const folderId = formData.get(`files[${i}].folderId`) as string;
    const math = formData.get(`files[${i}].math`) === "true";

    const fileCreationPromise = prisma.file.create({
      data: {
        name,
        type,
        content,
        math,
        folder: {
          connect: {
            id: folderId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    fileCreationPromises.push(fileCreationPromise);
  }

  try {
    const addedFiles = await Promise.all(fileCreationPromises);
    revalidatePath("/ai-tutor");
    return {
      addedFiles,
    };
  } catch (error) {
    console.error("Error adding files:", error);
    throw error;
  }
};

export const getMostRecentFile = async () => {
  const userId = (await getSession()) as unknown as string;
  const file = await prisma.file.findFirst({
    where: {
      userId: userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      folder: true,
    },
  });

  revalidatePath("/ai-tutor");
  return file;
};

export const getAllChatsWithFiles = async () => {
  const userId = (await getSession()) as unknown as string;
  const links = await prisma.link.findMany({
    where: {
      AND: [{ chat: { userId: userId } }],
    },
    include: {
      chat: {
        include: {
          chatMessages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
      file: true,
    },
  });

  revalidatePath("/ai-tutor");

  return links;
};
