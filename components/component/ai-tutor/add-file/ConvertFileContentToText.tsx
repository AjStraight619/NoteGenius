import { ProcessImageResponse } from "@/types/fileTypes";
import {
  isDuplicateFile,
  isHEIC,
  isImageType,
  isPDF,
  readFileContent,
} from "@/utils/file-processing/fileProcessing";
import { useRef } from "react";
import { v4 as uuid } from "uuid";

import { FileAction, FolderWithFiles, UIFile } from "@/types/otherTypes";
import AddFileButton from "./AddFileButton";

type ConvertFileContentToTextProps = {
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  isProcessing: boolean;
  files: UIFile[] | undefined;
  dispatch: React.Dispatch<FileAction>;
  folders: FolderWithFiles[] | undefined;
};
export const ConvertFileToText = ({
  setIsProcessing,
  isProcessing,
  dispatch,
  files,
}: ConvertFileContentToTextProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefForm = useRef<HTMLFormElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles: UIFile[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        if (files && isDuplicateFile(file, files)) continue;

        let content = "";
        let jpegFile: File | null = null;

        if (isPDF(file)) {
          content = await extractTextFromPdf(file);
        } else if (isImageType(file)) {
          const result = await processImage(file, isHEIC(file));
          content = result.detectedText;
          if (result.jpegUrl) {
            const jpegResponse = await fetch(result.jpegUrl);
            const jpegBlob = await jpegResponse.blob();
            jpegFile = new File(
              [jpegBlob],
              file.name.replace(".heic", ".jpeg"),
              {
                type: "image/jpeg",
              }
            );
          }
        } else {
          content = await readFileContent(file);
        }

        selectedFiles.push({
          id: uuid(),
          name: file.name,
          content: content || null,
          type: jpegFile ? "image/jpeg" : null,
          s3Path: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          folderId: null,
          math: false,
          userId: "",
          chatId: "",
        });
      }
      dispatch({ type: "ADD_FILE", payload: selectedFiles });
    }
  };

  const processImage = async (
    file: File,
    isHEIC: boolean
  ): Promise<ProcessImageResponse> => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/google-vision", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const data = await response.json();

      setIsProcessing(false);

      return {
        detectedText: data.detectedText || "No text detected",
        jpegUrl: data.jpegUrl,
      };
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      throw error;
    }
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    console.log("Uploaded file:", file);

    const formData = new FormData();
    formData.append("file", file);

    // Log the content of the FormData to ensure the file has been appended correctly
    console.log("FormData contents:", [...formData.entries()]);

    let res: Response;
    try {
      res = await fetch("/api/pdf-parse", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
    }

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        "Server returned an error:",
        res.status,
        res.statusText,
        errorText
      );
      throw new Error(`Server Error: ${res.statusText} - ${errorText}`);
    }

    const textResponse = await res.text();
    console.log("Raw Text Response:", textResponse);

    let parsedData;
    try {
      parsedData = JSON.parse(textResponse);
    } catch (error) {
      console.error("Error parsing response as JSON:", error);
      throw new Error("Failed to parse server response");
    }

    console.log("Parsed Data:", parsedData);

    const parsedText = parsedData?.parsedText || "";

    return parsedText;
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
    fileInputRefForm.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        name="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <AddFileButton onClick={handleUploadButtonClick} />
    </>
  );
};
