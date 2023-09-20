"use client";
import { useState, useRef } from "react";
import { Button, IconButton, Dialog } from "@radix-ui/themes";
import { UploadIcon } from "@radix-ui/react-icons";
import { Folder } from "@/types/folderTypes";

export default function UploadButton({ folders }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  console.log("Folders in upload button", folders);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const res = await fetch("/api/upload", {
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
        onClick={() => fileInputRef.current?.click()}
        className="hover:bg-gray-700"
        style={{ backgroundColor: "#2C2F33" }}
      >
        <UploadIcon style={{ width: "24px", height: "24px", color: "white" }} />
      </IconButton>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Trigger></Dialog.Trigger>

        <Dialog.Content>
          {/* Your list of folders and other dialog content go here */}
          <p>Select a folder to upload to:</p>
          {/* Example folder list */}
          <ul>
            {folders ? (
              folders.map((folder: any) => (
                <li key={folder.id}>{folder.name}</li>
              ))
            ) : (
              <li>No folders available</li>
            )}
          </ul>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </Dialog.Content>
      </Dialog.Root>

      {message && <p>{message}</p>}
    </main>
  );
}
