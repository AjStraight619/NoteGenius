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

  const { content } = await req.json();

  const chat = await prisma.chat.create({
    data: {
      title: content.title,
      content: content,
      userId: userId,
    },
  });

  return NextResponse.json({ chat });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No valid session provided" });
  }
  const user = session.user as User;
  if (!user) {
    return NextResponse.json({ error: "Invalid user provided" });
  }
  const userId = user.id;
  const { content } = await req.json();

  const chat = await prisma.chat.update({
    where: {
      id: content.id,
    },
    data: {
      title: content.title,
      content: content,
      userId: userId,
    },
  });
}

export async function DELETE() {}
