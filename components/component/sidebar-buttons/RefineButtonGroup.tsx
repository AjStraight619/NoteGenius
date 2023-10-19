"use client";

import { CheckIcon, Cross2Icon, UploadIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Flex,
  IconButton,
  ScrollArea,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import StackButton from "./StackButton";

export type FileProps = {
  id: string;
  file: File;
  content: string;
  name: string;
};

type ProcessImageResponse = {
  detectedText: string;
  jpegUrl?: string;
};

const RefineButtonGroup: React.FC<{
  setSelectedFile: React.Dispatch<React.SetStateAction<FileProps[] | null>>;
  extraMessage: string;
  setExtraMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMathChecked: React.Dispatch<React.SetStateAction<boolean>>;
  isMathChecked: boolean;
  setStartExtraction: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  setSelectedFile,
  setExtraMessage,
  extraMessage,
  setIsProcessing,
  setIsMathChecked,
  isMathChecked,
  setStartExtraction,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileProps[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
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
        let jpegFile: File | null = null; // initialize jpegFile as null

        if (isPDF(file)) {
          content = await extractTextFromPdf(file);
        } else if (isImageType(file)) {
          const result = await processImage(file, isHEIC(file));
          content = result.detectedText;
          if (result.jpegUrl) {
            // If jpegUrl is returned, fetch the JPEG blob and create a File object
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
          id: uuidv4(),
          file: jpegFile || file, // Use the converted JPEG file if available
          name: file.name,
          content: content,
        });
      }
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
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
        jpegUrl: data.jpegUrl, // jpegUrl will be undefined if not present in the response
      };
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      throw error; // You might want to handle this error in the component that calls processImage
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

    // Check and log the raw response
    console.log("Fetch Response:", res);

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

  const isPDF = (file: File): boolean => {
    return file.type === "application/pdf";
  };

  const isHEIC = (file: File): boolean => {
    return (
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif")
    );
  };

  const isImageType = (file: File): boolean => {
    return (
      file.type.startsWith("image/") ||
      /\.(jpeg|jpg|gif|png|bmp|tiff|webp|heic)$/i.test(file.name.toLowerCase())
    );
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

  const handleDialogClose = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsDialogOpen(false);
    if (selectedFileIds) {
      // Filter the selected files from the files array
      setIsMathChecked(false);
      setSelectedFile(null);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsDialogOpen(true);
    }
  };

  const handleCheckBoxClick = () => {
    setIsMathChecked((prevState) => !prevState);
  };

  const handleSubmit = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsDialogOpen(false);
    if (selectedFileIds) {
      // Filter the selected files from the files array
      const selectedFiles = files.filter((file) =>
        selectedFileIds.includes(file.id)
      );
      setSelectedFile(selectedFiles || []);
      if (isMathChecked) setStartExtraction(true);
    }
  };

  return (
    <>
      <Flex display={"flex"} direction={"column"} mt={"3"} gap={"8"}>
        <Box mb={"2"}>
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
          className="focus:outline-none focus:ring-black appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px]"
        >
          <UploadIcon
            style={{ width: "32px", height: "32px", color: "white" }}
          />
        </IconButton>

        <StackButton
          onClick={handleStackButtonClick}
          fileCount={files.length}
          files={files}
        />
      </Flex>
      <div className="overflow-hidden">
        <Dialog.Root open={isDialogOpen} onOpenChange={handleOpenChange}>
          <ScrollArea type={"always"} scrollbars="vertical">
            <Dialog.Content
              size={"4"}
              className="relative w-full max-h-7xl my-6 p-6 rounded-lg bg-white shadow-lg overflow-y-hidden"
            >
              <Dialog.Close>
                <button
                  onClick={handleDialogClose}
                  className="absolute top-3 right-3"
                >
                  <Cross2Icon className="hover:text-gray-2-translucent" />
                </button>
              </Dialog.Close>
              <Dialog.Title className="text-center p-5">
                Choose which files you want to refine
              </Dialog.Title>
              <div className="grid grid-cols-2 gap-6">
                {files.map((item) => (
                  <Box
                    key={item.id}
                    onClick={() => {
                      setSelectedFileIds((prevSelectedFileIds) => {
                        if (prevSelectedFileIds.includes(item.id)) {
                          return prevSelectedFileIds.filter(
                            (id) => id !== item.id
                          );
                        } else {
                          return [...prevSelectedFileIds, item.id];
                        }
                      });
                    }}
                    className={`relative w-48 h-80 p-4 cursor-pointer rounded shadow-md border ${
                      selectedFileIds.includes(item.id)
                        ? "border-blue-500 bg-gray-400"
                        : "bg-gray-200"
                    }`}
                  >
                    {selectedFileIds.includes(item.id) && (
                      <div className="absolute top-1 left-1">
                        <CheckIcon color="green" />
                      </div>
                    )}

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
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="refineInput"
                    className="block text-sm font-medium text-gray-700"
                  >
                    How would you like to refine the note?
                  </label>
                  <div className="flex items-center">
                    <Flex gap="2">
                      <Checkbox
                        checked={isMathChecked}
                        onClick={handleCheckBoxClick}
                      />

                      <Text size="3">Math</Text>
                    </Flex>
                  </div>
                </div>
                <div className="mt-2">
                  <TextArea
                    value={extraMessage}
                    onChange={(e) => setExtraMessage(e.target.value)}
                    placeholder="Give a description on how you want to refine your note..."
                  ></TextArea>
                </div>
              </div>
              {files.length > 0 && (
                <label className="mt-4">
                  <Flex justify="center" className="p-5">
                    <Dialog.Close>
                      <Dialog.Close>
                        <Button onClick={handleSubmit}>
                          {isMathChecked ? "Extract Equations" : "Submit"}
                        </Button>
                      </Dialog.Close>
                    </Dialog.Close>
                  </Flex>
                </label>
              )}
            </Dialog.Content>
          </ScrollArea>
        </Dialog.Root>
      </div>
    </>
  );
};

export default RefineButtonGroup;
