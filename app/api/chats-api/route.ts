import { prisma } from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { type User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });
  } else {
    const user = session.user as User;
    if (user && user.id) {
      const userId = user.id;
      const chatLogs = await prisma.chat.findMany({
        where: {
          userId: userId,
        },
      });
      return new NextResponse(JSON.stringify({ chatLogs }));
    }
  }

  return new NextResponse(JSON.stringify({ error: "unknown error" }), {
    status: 500,
  });
}
