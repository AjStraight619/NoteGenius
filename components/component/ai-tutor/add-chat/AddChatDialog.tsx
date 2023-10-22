"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
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
        <Button size={"2"} variant={"outline"}>
          <Text size={"1"}>New Chat</Text>
          <PlusIcon />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Flex direction={"column"} align={"center"} justify={"center"}>
          <Dialog.Title mb={"2"}>Create a New Chat</Dialog.Title>
          <AddChatForm
            onClose={handleClose}
            addOptimisticChats={addOptimisticChats}
          />
        </Flex>
      </Dialog.Content>
      <Dialog.Close></Dialog.Close>
    </Dialog.Root>
  );
};

export default AddChatDialog;
