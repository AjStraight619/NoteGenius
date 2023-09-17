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

  // Create a chat for Alice
  await Promise.all(
    [
      "Sample Chat",
      "Chat about Dogs",
      "News Discussion",
      "Project Updates",
      "Random Chat",
      "Weekend Plans",
    ].map((title) =>
      prisma.chat.create({
        data: {
          title: title,
          content: `This is a ${title.toLowerCase()}`,
          userId: alice.id,
          chatMessages: {
            create: [
              {
                content: `Hello, this is the first message in the ${title}.`,
              },
              {
                content: `And this is the second message in the ${title}.`,
              },
            ],
          },
        },
      })
    )
  );

  // ... (your other seed data like folders, notes, etc.)
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
