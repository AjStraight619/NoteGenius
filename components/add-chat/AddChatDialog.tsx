"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { Button, Dialog } from "@radix-ui/themes";
import { useState } from "react";
import { AddChatForm } from "./AddChatForm";

const AddChatDialog = ({ addOptimisticChats }: any) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant={"outline"}>
          New Chat
          <PlusIcon />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Description>
          Select options for creating a new chat.
        </Dialog.Description>
        <AddChatForm
          onClose={handleClose}
          addOptimisticChats={addOptimisticChats}
        />
      </Dialog.Content>
      <Dialog.Close></Dialog.Close>
    </Dialog.Root>
  );
};

export default AddChatDialog;
