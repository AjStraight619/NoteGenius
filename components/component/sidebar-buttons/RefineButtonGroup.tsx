"use client";

import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IconButton, Box, Flex, Dialog, Button, Grid } from "@radix-ui/themes";
import { UploadIcon, Cross2Icon } from "@radix-ui/react-icons";
import StackButton from "./StackButton";

export type FileProps = {
  id: string;
  file: File;
  content: string;
  name: string;
};

const RefineButtonGroup: React.FC<{
  selectedFile: FileProps | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileProps | null>>;
}> = ({ selectedFile, setSelectedFile }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileProps[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles: FileProps[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        if (isDuplicateFile(file, files)) continue;

        let content = "";
        if (isPDF(file)) {
          console.log("content in handleFileChange", content);
          content = await extractTextFromPdf(file);
        } else {
          content = await readFileContent(file);
        }

        selectedFiles.push({
          id: uuidv4(),
          file: file,
          name: file.name,
          content: content,
        });
      }
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
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
      res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
    }

    // Check and log the raw response
    console.log("Fetch Response:", res);

    if (!res.ok) {
      const errorText = await res.text(); // Get more detailed error info
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

    // Depending on the structure of your data, access the parsedText accordingly
    const parsedText = parsedData?.parsedText || "";

    return parsedText;
  };

  const isPDF = (file: File): boolean => {
    return file.type === "application/pdf";
  };

  const isDuplicateFile = (
    selectedFile: File,
    files: FileProps[]
  ): boolean | undefined => {
    return files.some((file) => selectedFile.name === file.name);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleStackButtonClick = () => {
    if (files.length > 0) {
      setIsDialogOpen(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    setIsDialogOpen(open);
    if (!open && selectedFileId) {
      console.log(selectedFile?.file.type);
      // Find the selected file from the files array and set it in the parent component
      const file = files.find((file) => file.id === selectedFileId);
      setSelectedFile(file || null);
    }
  };

  return (
    <>
      <Flex display={"flex"} direction={"column"} m={"3"} gap={"6"}>
        <Box mb={"4"}>
          <input
            ref={fileInputRef}
            type="file"
            name="file"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Box>

        <IconButton
          onClick={handleUploadButtonClick}
          style={{ backgroundColor: "transparent" }}
          className="appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px]"
        >
          <UploadIcon
            style={{ width: "32px", height: "32px", color: "white" }}
            className="hover:shadow-lg appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] cursor-pointer"
          />
        </IconButton>

        <StackButton
          onClick={handleStackButtonClick}
          fileCount={files.length}
          files={files}
        />
      </Flex>

      <Dialog.Root open={isDialogOpen} onOpenChange={handleDialogClose}>
        <Dialog.Content className="max-w-10xl max-h-7xl mx-auto my-6 p-6 overflow-y-auto rounded-lg bg-white shadow-lg">
          <Dialog.Close>
            <button className="absolute top-3 right-3">
              <Cross2Icon className="hover:text-gray-2-translucent" />
            </button>
          </Dialog.Close>
          <Dialog.Title className="text-center p-5">
            Choose a file to refine
          </Dialog.Title>
          <Grid className="grid-cols-3 gap-6">
            {files.map((item) => (
              <Box
                key={item.id}
                className={`relative w-48 h-80 p-4 cursor-pointer rounded shadow-md border ${
                  selectedFileId === item.id
                    ? "border-blue-500 bg-gray-400"
                    : "bg-gray-200"
                }`}
              >
                <div className="absolute top-1 right-1">
                  <Cross2Icon
                    className="hover:text-gray-600 cursor-pointer"
                    onClick={() => {
                      setFiles((prevFiles) =>
                        prevFiles.filter((f) => f.id !== item.id)
                      );
                    }}
                  />
                </div>
                <div className="text-center truncate">{item.file.name}</div>
                <div className="mt-2 text-sm text-gray-600">
                  {item.content.substring(0, 100) +
                    (item.content.length > 100 ? "..." : "")}
                </div>
              </Box>
            ))}
          </Grid>
          <div className="mt-6">
            <label
              htmlFor="refineInput"
              className="block text-sm font-medium text-gray-700"
            >
              How would you like to refine the note?
            </label>
            <input
              type="text"
              name="refineInput"
              id="refineInput"
              placeholder="Enter refinement instructions..."
              className="mt-2 p-2 w-full border rounded-md"
            />
          </div>
          {files.length > 0 && (
            <label className="mt-4">
              <Flex justify="center" className="p-5">
                <Dialog.Close>
                  <Button>Refine</Button>
                </Dialog.Close>
              </Flex>
            </label>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default RefineButtonGroup;
