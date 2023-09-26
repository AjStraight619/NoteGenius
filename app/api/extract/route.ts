import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file: File | null = formData.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: "No file provided." });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const pdfParser = new PDFParser();

  // Promisify the parsing process
  const parsePDF = (pdfBuffer: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: any) =>
        reject(errData.parserError)
      );
      pdfParser.on("pdfParser_dataReady", (pdfData) => resolve(pdfData));

      pdfParser.parseBuffer(pdfBuffer);
    });
  };

  try {
    const pdfData = await parsePDF(buffer);
    return NextResponse.json({ success: true, data: pdfData });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to parse PDF." });
  }
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
