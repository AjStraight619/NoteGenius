import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";

export async function POST(req: NextRequest) {
  const pdfParser = new (PDFParser as any)(null, 1);
  const formData = await req.formData();
  const file: File | null = formData.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, message: "No file specified" });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const parsedText = await new Promise<string>((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData: any) => {
      console.error(errData.parserError);
      reject(new Error("PDF parsing error"));
    });

    pdfParser.on("pdfParser_dataReady", () => {
      const textContent = (pdfParser as any).getRawTextContent();
      resolve(textContent);
    });

    // Trigger parsing with buffer
    pdfParser.parseBuffer(buffer);
  });

  return NextResponse.json({ success: true, parsedText });
}
