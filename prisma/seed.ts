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

  // Create some chats for Alex with Math Responses
  for (let i = 0; i < 5; i++) {
    const chatTitle = "Chat " + (i + 1).toString();

    // Create chat
    const newChat = await prisma.chat.create({
      data: {
        title: chatTitle,
        userId: alex.id,
        // Add files and math responses to chat
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
        mathResponses: {
          create: [
            {
              inputString: `x^2 + ${i}y = 1`, // Simple equation with i as variable
              userId: alex.id,
              response: JSON.stringify({
                queryresult: {
                  success: true,
                  pods: [
                    {
                      title: "Result",
                      subpods: [{ plaintext: `Result for x^2 + ${i}y = 1` }],
                    },
                  ],
                },
              }),
            },
          ],
        },
      },
    });

    // Adding system message to chat
    await prisma.chatMessage.create({
      data: {
        role: "System",
        content: `Correct answers for ${chatTitle} have been added.`,
        chatId: newChat.id,
      },
    });

    // ... (Omitting other data creation for brevity)
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
