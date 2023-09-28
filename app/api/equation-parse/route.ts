import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file: File | null = formData.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        message: "No file specified",
      });
    }

    // Read the content of the text file
    const content = await file.text();

    // Use your regex to parse the content
    const regex =
      /\\\int\s*[a-zA-Z]+\s*dx|\\\frac{\s*d\s*}{\s*d[a-zA-Z]+\s*}\s*[a-zA-Z0-9,\s]+|\d+\.\d+\*[a-zA-Z0-9]+\*\w+\^\d+|\w+\^\d+\s*\*\s*\w+\^\d+|\w+\s*=\s*[a-zA-Z\s']+\b|\d+\.\d+\*[a-zA-Z0-9]+\^\d+|\w+\^\d+|\d+\s*[-+*^/]\s*\d+|\w+\s*[-+*^/]\s*\w+/g;

    const matches = content.match(new RegExp(regex, "g"));

    if (!matches || matches.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No equations found",
      });
    }

    return NextResponse.json({ success: true, equations: matches });
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { success: false, message: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
