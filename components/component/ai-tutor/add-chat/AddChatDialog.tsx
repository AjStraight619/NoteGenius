"use client";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, IconButton, Text } from "@radix-ui/themes";
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
        <Button size={"2"} variant={"outline"} className="hover:cursor-pointer">
          <Text size={"1"}>New Chat</Text>
          <PlusIcon />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="relative">
        <Flex direction={"column"} align={"center"} justify={"center"}>
          <Dialog.Title mb={"2"}>Create a New Chat</Dialog.Title>
          <AddChatForm
            onClose={handleClose}
            addOptimisticChats={addOptimisticChats}
          />
        </Flex>

        <Dialog.Close>
          <IconButton
            variant="ghost"
            className="absolute top-2 right-2 hover:cursor-pointer"
            onClick={handleClose}
          >
            <Cross2Icon />
          </IconButton>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddChatDialog;
