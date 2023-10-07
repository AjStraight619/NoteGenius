import { ImageAnnotatorClient } from "@google-cloud/vision";
import { NextRequest, NextResponse } from "next/server";
import { Magick } from "node-magickwand";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import { join } from "path";

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

    // Write buffer to a temporary file
    const tempFilePath = join(tmpdir(), file.name);
    await fs.writeFile(tempFilePath, inputBuffer);

    const im = new Magick.Image();
    await im.readAsync(tempFilePath);

    if (
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif")
    ) {
      await im.magickAsync("JPEG");
    }

    // Write the converted image to a temporary file
    const tempOutputPath = join(tmpdir(), "output.jpg");
    await im.writeAsync(tempOutputPath);

    // Read the converted image back into a buffer
    const buffer = await fs.readFile(tempOutputPath);

    // Clean up the temporary files
    await fs.unlink(tempFilePath);
    await fs.unlink(tempOutputPath);

    // Pass the buffer to Google Cloud Vision
    const [result] = await client.textDetection(buffer);
    const detections = result.textAnnotations;
    const detectedText = detections?.[0]?.description || "";

    const gptResponse = await fetch("http://localhost:3000/api/refine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: detectedText, initialInput: "" }),
    });

    const refinedNotes = await gptResponse.json();

    // Combine the responses or handle them as needed
    const combinedResponse = {
      vision: detections,
      gpt: refinedNotes,
    };

    return NextResponse.json(refinedNotes);
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
