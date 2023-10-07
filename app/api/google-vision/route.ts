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

    console.log("File recieved in req", file);

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const result = await cloudinary.uploader.upload(
      "data:image/jpeg;base64," + inputBuffer.toString("base64"),
      {
        format: "jpg",
      }
    );

    console.log("result from cloudinary", result);

    const jpegUrl = result.secure_url;

    const [visionResult] = await client.textDetection(jpegUrl);
    const detections = visionResult.textAnnotations;
    const detectedText = detections?.[0]?.description || "";

    const gptResponse = await fetch("http://localhost:3000/api/refine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: detectedText, initialInput: "" }),
    });

    const refinedNotes = await gptResponse.json();

    const combinedResponse = {
      vision: detections,
      gpt: refinedNotes,
    };

    return NextResponse.json(combinedResponse);
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
