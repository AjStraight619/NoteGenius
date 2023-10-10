import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/utils/authenticateRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await authenticateRequest(req);
  if (!user) {
    return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });
  }
  const requestBody = await req.json();
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
