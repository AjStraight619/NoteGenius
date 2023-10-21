import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Clear database
  await prisma.chatMessage.deleteMany({});
  await prisma.chat.deleteMany({});
  await prisma.refinedFile.deleteMany({});
  await prisma.file.deleteMany({});
  await prisma.folder.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.passwordResetToken.deleteMany({});

  // Create a hashed password for Alex
  const alexPassword = await hash("test", 10);

  // Create a new user named "Alex" with password "test"
  const alex = await prisma.user.create({
    data: {
      email: "alex@prisma.io",
      password: alexPassword,
      name: "Alex",
    },
  });

  // Create the tags: Math, Reading, Science
  const tags = await Promise.all(
    ["Math", "Reading", "Science"].map((tagName) =>
      prisma.tag.create({
        data: {
          name: tagName,
        },
      })
    )
  );

  // Create folders named A, C, E, ... (skipping every other letter)
  const folders = [];
  for (let i = 65; i <= 80; i += 2) {
    const folderTitle = "Folder " + String.fromCharCode(i);

    const folder = await prisma.folder.create({
      data: {
        name: folderTitle,
        userId: alex.id,
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
        },
      },
    });
    folders.push(folder);
  }

  // Create files for Alex's folders
  const fileContents = [
    "This is content of file 1",
    "Content for the second file",
    "Another file's content here",
    "Yet another file's text content",
    "Final file content for testing",
  ];

  const fileTypes = ["TEXT", "TEXT", "TEXT", "TEXT", "TEXT"];

  const files = [];
  for (let i = 0; i < folders.length && i < fileContents.length; i++) {
    const file = await prisma.file.create({
      data: {
        name: `File ${i + 1}`,
        content: fileContents[i],
        type: fileTypes[i],
        folderId: folders[i].id,
        userId: alex.id,
      },
    });
    files.push(file);
  }

  // Create some chats for Alex
  const chats = [];
  for (let i = 0; i < 5; i++) {
    const chatTitle = "Chat " + i.toString();

    const newChat = await prisma.chat.create({
      data: {
        title: chatTitle,
        userId: alex.id,
      },
    });
    chats.push(newChat);

    // Create some chat messages for each chat
    for (let j = 0; j < 10; j++) {
      const messageContent = "Message " + j.toString();
      let role;

      if (j % 2 === 0) {
        role = "user";
      } else {
        role = "assistant";
      }

      await prisma.chatMessage.create({
        data: {
          content: messageContent,
          chatId: newChat.id,
          role: role,
        },
      });
    }
  }

  for (let i = 0; i < files.length; i++) {
    if (chats[i]) {
      await prisma.file.update({
        where: { id: files[i].id },
        data: { chatId: chats[i].id },
      });
    }
  }

  //   // Create some links connecting files to chats
  //   for (let i = 0; i < chats.length && i < files.length; i++) {
  //     await prisma.link.create({
  //       data: {
  //         chatId: chats[i].id,
  //         fileId: files[i].id,
  //       },
  //     });
  //   }
  // }

  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
