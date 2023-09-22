"use client";
import { useState, useRef } from "react";
import {
  Button,
  IconButton,
  Dialog,
  ScrollArea,
  Heading,
  Flex,
} from "@radix-ui/themes";
import { UploadIcon } from "@radix-ui/react-icons";
import { FolderSidebarProps } from "@/types/folderTypes";
import { IndividualFolder } from "@/types/folderTypes";

// Triggering github to recognize I changed the name of this file to start with an uppercase...
// I guess git or github does not recognize changing casing of filenames... lets try again...
// getting internal server error on vercel

export default function UploadButton({ folders }: FolderSidebarProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  console.log("Is Dialog open?: ", isDialogOpen);

  const handleFolderClick = (folderId: string) => {
    setSelectedFolderId(folderId);
  };

  const handleUploadButtonClick = () => {
    if (file) {
      // If a file is already selected, just reopen the dialog
      setIsDialogOpen(true);
    } else {
      // Otherwise, trigger the file input click
      fileInputRef.current?.click();
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    setIsDialogOpen(open);
  };

  const onSubmit = async () => {
    setMessage(null);

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    try {
      setIsLoading(true);

      const data = new FormData();
      data.append("file", file);
      if (selectedFolderId) {
        data.append("folderId", selectedFolderId);
      }

      const res = await fetch("/api/folders", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setMessage("File uploaded successfully!");
    } catch (e: any) {
      console.error(e);
      setMessage(`Error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);

    if (selectedFile) {
      setIsDialogOpen(true);
    }
  };

  return (
    <main>
      <input
        ref={fileInputRef}
        type="file"
        name="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <IconButton
        onClick={handleUploadButtonClick}
        style={{ backgroundColor: "#2C2F33" }}
      >
        <UploadIcon style={{ width: "32px", height: "32px", color: "white" }} />
      </IconButton>

      <Dialog.Root open={isDialogOpen} onOpenChange={handleDialogClose}>
        <Dialog.Content>
          <Flex direction="column" gap="3">
            <Heading size="4" mb="2" trim="start">
              Choose a folder to upload to:
            </Heading>
            <ScrollArea
              type="always"
              scrollbars="vertical"
              style={{ height: 180 }}
            >
              <ul>
                {folders ? (
                  folders.map((folder: IndividualFolder) => (
                    <li
                      key={folder.id}
                      onClick={() => handleFolderClick(folder.id)}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedFolderId === folder.id
                            ? "lightgray"
                            : "transparent",
                      }}
                    >
                      {folder.name}
                    </li>
                  ))
                ) : (
                  <li>No folders available</li>
                )}
              </ul>
            </ScrollArea>
          </Flex>
          <Button onClick={onSubmit} disabled={isLoading} mt="2">
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </Dialog.Content>
      </Dialog.Root>

      {message && <p>{message}</p>}
    </main>
  );
}
