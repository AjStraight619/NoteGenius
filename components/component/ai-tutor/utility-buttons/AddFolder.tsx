"use client";
import { SubmitButton } from "@/components/ui/submit-button";
import { FolderPlusIcon } from "@heroicons/react/24/solid";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Dialog, Flex, IconButton, TextFieldInput } from "@radix-ui/themes";
import { useState } from "react";

const AddFolder = ({ folders }: any) => {
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <IconButton>
          <FolderPlusIcon />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content className="relative">
        <Flex direction={"column"} align={"center"} justify={"center"}>
          <Dialog.Title mb={"2"}>Add New Folder</Dialog.Title>
          <form
            action={async (formData) => {
              formData.append("title", folderName);
            }}
          >
            <TextFieldInput
              type="text"
              name="title"
              placeholder="New Folder"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </form>
          <SubmitButton>Add Folder</SubmitButton>
        </Flex>

        <Dialog.Close>
          <IconButton
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={handleClose}
          >
            <Cross2Icon />
          </IconButton>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddFolder;
