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

  for (let i = 0; i < 10; i++) {
    const folderTitle = "Folder " + i.toString();

    // Create a folder and store the returned folder object
    const folder = await prisma.folder.create({
      data: {
        name: folderTitle,
        userId: alice.id,
      },
    });

    // Create 5 notes for each folder
    for (let j = 0; j < 5; j++) {
      const noteTitle = "Note " + j.toString();

      await prisma.note.create({
        data: {
          name: noteTitle,
          content: "This is content of note " + noteTitle,
          folderId: folder.id, // Associate note with folder
        },
      });
    }
  }

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
