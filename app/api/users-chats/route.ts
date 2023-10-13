import { prisma } from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidV4 } from "uuid";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No valid session provided" });
  }

  const user = session.user as User;

  if (!user) {
    return NextResponse.json({ error: "Invalid user provided" });
  }

  const userId = user.id;

  const chatId = req.nextUrl.searchParams.get("chatId");
  console.log("user id: " + userId, "chatId: " + chatId);
  if (!chatId) {
    return NextResponse.json({ error: "No chatId provided" });
  }

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      userId: userId, // Ensures the chat belongs to the authenticated user
    },
    include: {
      chatMessages: true,
    },
  });

  if (!chat) {
    return NextResponse.json({ error: "Chat not found or not authorized" });
  }

  return NextResponse.json({ chat });
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

      chatMessages: newMessages,
      userId: userId,
    },
  });

  return NextResponse.json({ chat });
}

export async function PUT(req: NextRequest) {
  console.log("This is the request body", req.body);

  // Get the session
  const session = await getServerSession(authOptions);

  // Validate the session
  if (!session) {
    return NextResponse.json({ error: "No valid session provided" });
  }

  // Get the user from the session
  const user = session.user as User;

  // Validate the user
  if (!user) {
    return NextResponse.json({ error: "Invalid user provided" });
  }

  // Get userId and request data
  const userId = user.id;
  console.log("current user id", userId);
  const { newMessages, chatId } = await req.json();
  console.log("this is the new messages object in the put method", newMessages);

  // Variable to hold the chat data
  let chat;

  // Check if chatId is provided
  if (chatId) {
    // Update existing chat with new messages
    for (let i = 0; i < newMessages.length; i++) {
      const message = newMessages[i].content;
      if (message) {
        await prisma.chatMessage.create({
          data: {
            content: message,
            chatId: chatId,
          },
        });
      }
    }
    // Fetch the updated chat data
    chat = await prisma.chat.findUnique({ where: { id: chatId } });
  } else {
    // Generate a new chatId only if needed
    const newChatId = uuidV4();

    let chatTitle = "Untitled Chat";
    // If there's no file title, generate a title from the first message of the chat.
    if (newMessages.length > 0) {
      // This is a simplistic example, you may want a more robust method to generate a meaningful title.
      chatTitle = newMessages[0].content.substring(0, 30); // Take the first 30 characters of the first message.
    }

    // No chatId provided, create a new chat and messages
    chat = await prisma.chat.create({
      data: {
        id: newChatId, // Specify the generated chatId
        title: chatTitle || "Untitles Chat",
        userId: userId,
        chatMessages: {
          create: newMessages.map((message: any) => ({
            content: message.content,
          })),
        },
      },
    });
  }

  // Respond with the chat data
  return new NextResponse(JSON.stringify({ chat }));
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No valid session provided" });
  }

  const user = session.user as User;

  if (!user) {
    return NextResponse.json({ error: "Invalid user provided" });
  }

  const userId = user.id;

  const chatId = req.nextUrl.searchParams.get("chatId");
  console.log("user id: " + userId, "chatId: " + chatId);
  if (!chatId) {
    return NextResponse.json({ error: "No chatId provided" });
  }

  const chatToDelete = await prisma.chat.delete({
    where: {
      id: chatId,
    },
  });

  return NextResponse.json({ chatToDelete });
}
