"use client";
import { addFolder } from "@/actions/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { FolderPlusIcon } from "@heroicons/react/24/solid";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  Box,
  Dialog,
  Flex,
  IconButton,
  TextFieldInput,
} from "@radix-ui/themes";
import { useRef, useState } from "react";

const AddFolder = ({ folders }: any) => {
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleClose = () => {
    setFolderName("");
    setOpen(false);
  };

  const checkIsValidFolderName = () => {
    console.log("in checkIsValidFolderName", folderName);
    if (folders?.find((folder: any) => folder.name === folderName)) {
      setError("Folder name already exists");
      return false;
    }
    if (folderName === "") {
      setError("Folder name cannot be empty");
      return false;
    }
    return true;
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <IconButton variant={"ghost"}>
          <FolderPlusIcon className="w-6 h-6" />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content className="relative py-4">
        <Flex
          direction={"column"}
          align={"center"}
          justify={"center"}
          gap={"2"}
        >
          <Dialog.Title mb={"2"}>Add New Folder</Dialog.Title>
          <form
            action={async (formData) => {
              if (!checkIsValidFolderName()) return;
              formData.append("name", folderName);
              await addFolder(formData);
              setFolderName("");
              setOpen(false);
            }}
          >
            <TextFieldInput
              type="text"
              name="title"
              placeholder="New Folder"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            <Box className="flex justify-center pt-2">
              <SubmitButton>Add Folder</SubmitButton>
            </Box>
          </form>

          {error && <p className="text-red-5">{error}</p>}
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
