import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/utils/authenticateRequest";

export async function POST(request: NextRequest) {
  const user = await authenticateRequest(request);
  if (!user) {
    return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });
  }
  const requestBody = await request.json();
  console.log(requestBody);
  const { name } = requestBody;

  await prisma.folder.create({
    data: {
      userId: user.id,
      name: name,
    },
  });

  return new NextResponse(
    JSON.stringify({ success: true, message: "Folder successfully created" }),
    {
      status: 200,
    }
  );
}
