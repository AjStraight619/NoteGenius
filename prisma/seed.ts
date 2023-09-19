import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Clear database
  await prisma.chatMessage.deleteMany({});
  await prisma.chat.deleteMany({});
  await prisma.refinedNote.deleteMany({});
  await prisma.note.deleteMany({});
  await prisma.folder.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.user.deleteMany({});

  // Create a hashed password
  const password = await hash("alice", 10);

  // Upsert user
  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      password,
      name: "Alice",
    },
  });

  // Create some tags
  const tags = await Promise.all(
    ["Work", "Personal", "Project", "Shopping"].map((tagName) =>
      prisma.tag.create({
        data: {
          name: tagName,
        },
      })
    )
  );

  // Create a folder and associate with tags
  for (let i = 0; i < 10; i++) {
    const folderTitle = "Folder " + i.toString();

    const folder = await prisma.folder.create({
      data: {
        name: folderTitle,
        userId: alice.id,
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
        },
      },
    });

    // Create 5 notes for each folder and associate with tags
    for (let j = 0; j < 5; j++) {
      const noteTitle = "Note " + j.toString();

      await prisma.note.create({
        data: {
          name: noteTitle,
          content: "This is content of note " + noteTitle,
          folderId: folder.id,
          tags: {
            connect: tags.map((tag) => ({ id: tag.id })),
          },
        },
      });
    }
  }

  // Create some chats for Alice
  for (let i = 0; i < 5; i++) {
    const chatTitle = "Chat " + i.toString();
    const chatContent = "This is content of chat " + chatTitle;

    const newChat = await prisma.chat.create({
      data: {
        title: chatTitle,
        content: chatContent,
        userId: alice.id,
      },
    });

    // Create some chat messages for each chat
    for (let j = 0; j < 10; j++) {
      const messageContent = "Message " + j.toString();

      await prisma.chatMessage.create({
        data: {
          content: messageContent,
          chatId: newChat.id,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
