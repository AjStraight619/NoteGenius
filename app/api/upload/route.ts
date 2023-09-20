import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
}
