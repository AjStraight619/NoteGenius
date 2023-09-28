import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file: File | null = formData.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ error: "File not found" });
  }

  try {
    // Make an HTTP POST request to the Python API
    const pythonApiResponse = await axios.post(
      "http://127.0.0.1:5000/api/equations",
      {
        data: file,
      }
    );

    // Log the response from the Python API
    console.log("Response from Python API:", pythonApiResponse.data);

    // Extract the equations from the Python API response
    const equations = pythonApiResponse.data.equations;

    // Handle the equations or send them in the response
    return NextResponse.json({ equations });
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
