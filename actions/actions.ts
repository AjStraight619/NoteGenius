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

  revalidatePath("/ai-tutor");
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
      files: true,
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
    orderBy: {
      updatedAt: "desc",
    },
  });

  revalidatePath("/ai-tutor");

  return folders;
};

export const addFile = async (formData: FormData) => {
  const userId = (await getSession()) as unknown as string;

  if (!userId) throw new Error("No user session found.");

  const fileCount = Number(formData.get("fileCount"));
  const fileCreationPromises: Promise<any>[] = [];
  const chatId = formData.get("chatId") as string | null;

  for (let i = 0; i < fileCount; i++) {
    const name = formData.get(`files[${i}].name`) as string;
    const type = formData.get(`files[${i}].type`) as string;
    const content = formData.get(`files[${i}].content`) as string;
    let folderId = formData.get(`files[${i}].folderId`) as string | null;
    const math = formData.get(`files[${i}].math`) === "true";

    if (!folderId) {
      // Create a new folder and use the result directly
      const createdFolder = await prisma.folder.create({
        data: {
          name: "New Folder",
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      folderId = createdFolder.id;
    }

    console.log("folderId", folderId);

    const fileCreationPromise = prisma.file.create({
      data: {
        name,
        type,
        content,
        math,

        chats: chatId ? { connect: { id: chatId } } : undefined, // Only connect if chatId is not null
        folder: folderId ? { connect: { id: folderId } } : undefined, // Only connect if folderId is not null
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
    // Presumably, revalidatePath is a function you have defined elsewhere to refresh some data.
    revalidatePath("/ai-tutor");
    return {
      addedFiles,
    };
  } catch (error) {
    console.error("Error adding files:", error);
    throw new Error("Failed to add files.");
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
      chats: true,
    },
  });

  revalidatePath("/ai-tutor");
  return file;
};

export const addFolder = async (formData: FormData) => {
  const userId = (await getSession()) as unknown as string;
  const name = formData.get("name") as string;

  const addedFolder = await prisma.folder.create({
    data: {
      name,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  revalidatePath("/ai-tutor");
  return {
    addedFolder,
  };
};

export const getAllChatsWithFiles = async () => {
  const userId = (await getSession()) as unknown as string;
  const chats = await prisma.chat.findMany({
    where: {
      userId: userId,
    },
    include: {
      chatMessages: true, // Include chat messages
      files: true, // Include linked files
    },
  });

  revalidatePath("/ai-tutor");
  return chats;
};

export const getAllNotesWithFilesAndChats = async () => {
  const userId = (await getSession()) as unknown as string;
  const notes = await prisma.note.findMany({
    where: {
      userId: userId,
    },
    include: {
      files: true,
      chats: true,
    },
  });

  revalidatePath("/ai-tutor");
  return notes;
};

export const getMathResponses = async () => {
  const userId = (await getSession()) as unknown as string;
  const mathResponses = await prisma.mathResponse.findMany({
    where: {
      userId: userId,
    },
    include: {
      chat: true,
      file: true,
    },
  });

  console.log("mathResponses", mathResponses);

  revalidatePath("/ai-tutor");
  return mathResponses;
};
