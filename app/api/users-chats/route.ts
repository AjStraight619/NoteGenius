import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { User } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No valid session provided" });
  }
  const user = session.user as User;
  if (!user) {
    return NextResponse.json({ error: "Invalid user provided" });
  }
  const userId = user.id;

  const chats = await prisma.chat.findMany({
    where: {
      userId: userId,
    },
  });

  return NextResponse.json({ chats });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No valid session provided" });
  }
  const user = session.user as User;
  if (!user) {
    return NextResponse.json({ error: "Invalid user provided" });
  }
  const userId = user.id;

  const { newMessages } = await req.json();

  const chat = await prisma.chat.create({
    data: {
      title: newMessages.title,
      content: newMessages.content,
      chatMessages: newMessages,
      userId: userId,
    },
  });

  return NextResponse.json({ chat });
}

export async function PUT(req: NextRequest) {
  console.log("This is the request body", req.body);
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No valid session provided" });
  }
  const user = session.user as User;
  if (!user) {
    return NextResponse.json({ error: "Invalid user provided" });
  }
  const userId = user.id;
  console.log("current user id", userId);
  const { newMessages } = await req.json();

  console.log(newMessages.content);

  let chat;
  if (newMessages.chatId) {
    // If chatId is provided, we'll add a new message to the existing chat.
    chat = await prisma.chat.update({
      where: {
        id: newMessages.chatId,
      },
      data: {
        chatMessages: {
          create: {
            content: newMessages.content,
          },
        },
        title: "",
      },
    });
  } else {
    // If chatId is not provided, it's a new chat.
    // We'll create a new chat record and add the first message to it.
    chat = await prisma.chat.create({
      data: {
        title: "",
        userId: userId,
        content: newMessages.content,
        chatMessages: {
          create: {
            content: newMessages.content,
          },
        },
      },
    });
  }

  console.log("This is the chat from the server", chat);
  return new NextResponse(JSON.stringify({ chat }));
}

export async function DELETE() {}
