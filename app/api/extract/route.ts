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

// console.log(request);
// const user = await authenticateRequest(request as NextRequest);
// try {
//   if (!user) {
//     return NextResponse.json(
//       { error: "Unauthorized" },
//       {
//         status: 401,
//       }
//     );
//   }

//   const data = await request.formData();
//   const file: File | null = data.get("file") as unknown as File;
//   console.log(file);
//   const folderId: string | null = data.get("folderId") as string | null;
//   const extracted = data.get("extracted") === "true";
//   let content: Buffer | string;

//   const userId = user.id;

//   if (!file) {
//     return NextResponse.json({ error: "File not found" }, { status: 404 });
//   }

//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);
//   content = buffer;

//   if (file.type === "application/pdf" && extracted) {
//     // Extract content from PDF
//     const extractedContent = await pdf(buffer);
//     content = extractedContent.text;
//   }

//   const createdFile = await prisma.file.create({
//     data: {
//       name: file.name,
//       type: file.type,
//       content: Buffer.from(content),
//       userId: userId,
//       folderId: folderId, // Put the file in this folder
//     },
//   });

//   return NextResponse.json(
//     { createdFile },
//     {
//       status: 200,
//     }
//   );
// } catch (error) {
//   return NextResponse.json(
//     { error: error || "Internal Server Error" },
//     { status: 500 }
//   );
// }
