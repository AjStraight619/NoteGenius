import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const filename = formData.get("filename") as unknown as string;
  const content = formData.get("content") as unknown as string;

  if (!filename || !content) {
    return NextResponse.json({ error: "Invalid filename or content" });
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const fontSize = 12;
  const textWidth = page.getWidth() - 100;
  const textHeight = page.getHeight() - 100;

  page.drawText(content, {
    x: 50, // 50 units from the left
    y: textHeight - fontSize, // Adjusted for font size
    size: fontSize,
    maxWidth: textWidth, // Ensures text doesn't go beyond page width
  });

  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
