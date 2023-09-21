import { NextRequest, NextResponse } from "next/server";

// TODO: Finish writing upload api

export async function POST(request: NextRequest, response: NextResponse) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
  const folderId: string | null = data.get("folderId") as string | null;
}
