"use client";

import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IconButton, Box, Flex, Dialog, Button } from "@radix-ui/themes";
import { UploadIcon, StackIcon, Cross2Icon } from "@radix-ui/react-icons";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles: FileProps[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const reader = new FileReader();

        reader.onload = (event) => {
          if (isDuplicateFile(file, files)) return;
          selectedFiles.push({
            id: uuidv4(), // Generate a unique ID
            file: file,
            name: file.name,
            content: event.target?.result as string,
          });

          if (selectedFiles.length === e.target.files?.length) {
            setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
          }
        };
        reader.readAsText(file);
      }
    }
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
        <Box position={"relative"}>
          <IconButton
            onClick={handleStackButtonClick}
            style={{ backgroundColor: "transparent" }}
          >
            <StackIcon
              style={{ width: "32px", height: "32px", color: "white" }}
            />
          </IconButton>
          <Box position={"absolute"}>{files.length}</Box>
        </Box>
      </Flex>

      <Dialog.Root open={isDialogOpen} onOpenChange={handleDialogClose}>
        <Dialog.Content style={{ maxWidth: 450, position: "relative" }}>
          <Dialog.Close>
            <button
              style={{ position: "absolute", top: "10px", right: "10px" }}
            >
              <Cross2Icon className="hover:text-gray-2-translucent" />
            </button>
          </Dialog.Close>
          <Dialog.Title>Choose a file to refine</Dialog.Title>
          {files.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedFileId(item.id)}
              style={{
                padding: "5px",
                cursor: "pointer",
                borderRadius: "3px",
                backgroundColor:
                  selectedFileId === item.id ? "gray" : "transparent",
              }}
            >
              {item.file.name}
            </div>
          ))}
          {files.length > 0 && (
            <label>
              <Flex justify="center">
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