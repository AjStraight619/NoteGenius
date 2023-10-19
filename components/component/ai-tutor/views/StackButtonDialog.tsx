"use client";
import { UIFile } from "@/types/otherTypes";
import { Cross2Icon, StackIcon } from "@radix-ui/react-icons";
import { Box, Dialog, Flex, Heading, IconButton, Text } from "@radix-ui/themes";
import { useState } from "react";
import ProcessFileForm from "../add-file/ProcessFileForm";

type StackButtonDialogProps = {
  state: UIFile[] | undefined;
  isProcessing: boolean;
  addOptimisticFiles: (newFile: UIFile) => void;
  optimisticFiles: UIFile[] | undefined;
};

const StackButtonDialog = ({
  state,
  isProcessing,
  addOptimisticFiles,
  optimisticFiles,
}: StackButtonDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <IconButton variant="ghost" className="relative">
          <StackIcon width={"25px"} height={"25px"} />
          <Box className="absolute left-7 bottom-5 bg-red-5 rounded-l-3 rounded-r-3 p-1 min-w-6 flex items-center justify-center">
            <Text size="1">{state?.length}</Text>
          </Box>
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content className="relative">
        <Flex direction={"column"} align={"center"} justify={"center"}>
          <Heading size={"3"} mb={"3"}>
            Select Files to Work On
          </Heading>
          <ProcessFileForm
            addOptimisticFiles={addOptimisticFiles}
            optimisticFiles={optimisticFiles}
            state={state}
            isProcessing={isProcessing}
          />
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

export default StackButtonDialog;
