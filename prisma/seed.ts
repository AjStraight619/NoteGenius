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
  await prisma.passwordResetToken.deleteMany({}); // Assuming there's a PasswordResetToken model.
  await prisma.user.deleteMany({});

  // Create a hashed password for Alex
  const alexPassword = await hash("Alex", 10);

  // Create a new user named "Alex" with password "Alex"
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
  for (let i = 65; i <= 90; i += 2) {
    const folderTitle = "Folder " + String.fromCharCode(i);

    await prisma.folder.create({
      data: {
        name: folderTitle,
        userId: alex.id,
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
        },
      },
    });
  }

  // Create some chats for Alice
  for (let i = 0; i < 5; i++) {
    const chatTitle = "Chat " + i.toString();
    const chatContent = "This is content of chat " + chatTitle;

    const newChat = await prisma.chat.create({
      data: {
        title: chatTitle,
        content: chatContent,
        userId: alex.id,
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
