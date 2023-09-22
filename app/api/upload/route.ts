import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/utils/authenticateRequest";

// TODO: Finish writing upload api

export async function POST(request: NextRequest) {
  const user = await authenticateRequest(request);
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
  const folderId: string | null = data.get("folderId") as string | null;

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const userId = user.id;

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const createdFile = await prisma.file.create({
    data: {
      name: file.name,
      type: file.type,
      content: buffer,
      userId: userId,
      folderId: folderId, // Put the file in this folder
    },
  });

  return NextResponse.json(
    { createdFile },
    {
      status: 200,
    }
  );
}
