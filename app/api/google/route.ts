import { ImageAnnotatorClient } from "@google-cloud/vision";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const client = new ImageAnnotatorClient({
    keyFilename: process.env.GCP_SERVICE_ACCOUNT_PATH,
  });

  try {
    const formData = await req.formData();
    const file: any = formData.get("image");
    console.log("Received file:", file);

    if (!file) {
      return new NextResponse(
        JSON.stringify({
          error: "No image file provided or invalid image file path",
        }),
        {
          status: 400,
        }
      );
    }

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Pass the buffer to Google Cloud Vision
    const [result] = await client.textDetection(buffer);
    const detections = result.textAnnotations;

    console.log("Text:");
    detections?.forEach((text) => console.log(text.description));

    return NextResponse.json(detections);
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        error: `Failed to process image: ${error || "unknown error"}`,
      }),
      {
        status: 500,
      }
    );
  }
}
