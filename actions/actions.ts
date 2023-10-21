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

// export const getLinks = async () => {
//   const userId = (await getSession()) as unknown as string;

//   const links = await prisma.chat.findMany({
//     where: {
//       userId: userId,
//     },
//     include: {
//       file: true,
//     },
//   });

//   return links;
// };

// export const getSpecificLink = async (chatId: string) => {
//   const link = await prisma.chat.findUnique({
//     where: {
//       id: chatId,
//     },
//     include: {
//       file: true,
//     },
//   });

//   return link;
// };

export const addLink = async (formData: FormData) => {
  const userId = (await getSession()) as unknown as string;
  const title = formData.get("title") as string;

  const addedLink = await prisma.chat.create({
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
    addedLink,
  };
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

  return folders;
};

export const addFile = async (formData: FormData, math: boolean = false) => {
  const userId = (await getSession()) as unknown as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  let content = formData.get("content") as string;

  console.log("This is the name of the file:", name);

  if (math) {
    try {
      const res = await fetch("http://localhost:3000/api/extract-equations", {
        method: "POST",
        body: JSON.stringify({ prompt: content }),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const extractedEquations = await res.json();
      content = extractedEquations;
    } catch (error) {
      console.error("Error extracting equations:", error);
    }
  }

  const addedFile = await prisma.file.create({
    data: {
      name,
      type,
      content,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  revalidatePath("/ai-tutor");
  return {
    addedFile,
  };
};
