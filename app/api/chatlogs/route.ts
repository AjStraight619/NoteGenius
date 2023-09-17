import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "@/utils/authOptions";
import { type User } from "@prisma/client";

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
      return NextResponse.json({ chatLogs });
    }
  }
}
