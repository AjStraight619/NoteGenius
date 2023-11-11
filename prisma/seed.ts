import { hash } from "bcrypt";
import { prisma } from "../lib/prisma";

async function main() {
  // Clear database

  // Create a hashed password for Alex
  const alexPassword = await hash("test", 10);

  // Create a new user named "Alex" with password "test"
  const alex = await prisma.user.create({
    data: {
      email: "test@prisma.io",
      password: alexPassword,
      name: "Alex",
    },
  });

  // ... (Omitting the creation of tags, folders, and files for brevity)

  // Create some chats for Alex
  const chats = [];
  for (let i = 0; i < 5; i++) {
    const chatTitle = "Chat " + (i + 1).toString();
    const newChat = await prisma.chat.create({
      data: {
        title: chatTitle,
        userId: alex.id,
        files: {
          create: [
            {
              name: `File for ${chatTitle}`,
              content: `Content for file in ${chatTitle}`,
              type: "TEXT",
              userId: alex.id,
            },
          ],
        },
      },
    });
    chats.push(newChat);
    // ... (Omitting the creation of chat messages for brevity)
  }

  // No need to create separate links, files are directly associated with chats
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
