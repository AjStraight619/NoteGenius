import { ImageAnnotatorClient } from "@google-cloud/vision";
import { NextRequest, NextResponse } from "next/server";
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  const client = new ImageAnnotatorClient({
    keyFilename: process.env.GCP_SERVICE_ACCOUNT_PATH,
  });

  try {
    const formData = await req.formData();
    const file: any = formData.get("image");

    if (!file) {
      return new NextResponse(
        JSON.stringify({
          error: "No image file provided or invalid image file path",
        }),
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // if file is heic convert it to jpeg before returning parsed text from google vision

    if (
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif")
    ) {
      console.log("File is of type heic");
      const result = await cloudinary.uploader.upload(
        "data:image/jpeg;base64," + inputBuffer.toString("base64"),
        {
          format: "jpg",
        }
      );

      const jpegUrl = result.secure_url;
      const [visionResult] = await client.textDetection(jpegUrl);
      const detections = visionResult.textAnnotations;
      const detectedText = detections?.[0]?.description || "";

      return NextResponse.json({ detectedText, jpegUrl });
    } else {
      const [visionResult] = await client.textDetection(inputBuffer);
      const detections = visionResult.textAnnotations;
      const detectedText = detections?.[0]?.description || "";
      return NextResponse.json({ detectedText });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        error: `Failed to process image: ${error || "unknown error"}`,
      }),
      { status: 500 }
    );
  }
}
