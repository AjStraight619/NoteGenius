"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/utils/getSession";
import { revalidatePath } from "next/cache";
const userId = (await getSession()) as unknown as string;
export const addChat = async (formData: FormData) => {
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

// export const addLink = async (formData: FormData) => {
//   const userId = (await getSession()) as unknown as string;
//   const title = formData.get("title") as string;

//   const addedLink = await prisma.chat.create({
//     data: {
//       title,
//       user: {
//         connect: {
//           id: userId,
//         },
//       },
//     },
//   });

//   revalidatePath("/'ai-tutor'");
//   return {
//     addedLink,
//   };
// };

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

// export const addFile = async (formData: FormData, math: boolean = false) => {
//   const userId = (await getSession()) as unknown as string;
//   const name = formData.get("name") as string;
//   const type = formData.get("type") as string;
//   let content = formData.get("content") as string;

//   console.log("This is the name of the file:", name);

//   if (math) {
//     try {
//       const res = await fetch("http://localhost:3000/api/extract-equations", {
//         method: "POST",
//         body: JSON.stringify({ prompt: content }),
//       });
//       if (!res.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const extractedEquations = await res.json();
//       content = extractedEquations;
//     } catch (error) {
//       console.error("Error extracting equations:", error);
//     }
//   }

//   const addedFile = await prisma.file.create({
//     data: {
//       name,
//       type,
//       content,
//       user: {
//         connect: {
//           id: userId,
//         },
//       },
//     },
//   });

//   revalidatePath("/ai-tutor");
//   return {
//     addedFile,
//   };
// };

export const addFile = async (formData: FormData) => {
  const userId = (await getSession()) as unknown as string;

  // Assume you have a way to get the count of files being uploaded
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
    // Handle the error, e.g., by returning an error response or re-throwing the error
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

  return file;
};

// get all chats that are linked with files

export const getAllChatsWithFiles = async () => {
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

  return links;
};
