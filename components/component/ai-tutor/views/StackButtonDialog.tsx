"use client";
import { useChatSelectionContext } from "@/app/contexts/ChatSelectionProvider";
import { ChatWithMessages, FolderWithFiles, UIFile } from "@/types/otherTypes";
import { Cross2Icon, StackIcon } from "@radix-ui/react-icons";
import { Box, Dialog, Flex, IconButton, Text } from "@radix-ui/themes";
import { useState } from "react";
import { ConvertFileToText } from "../add-file/ConvertFileContentToText";
import ProcessFileForm from "../add-file/ProcessFileForm";
import AddFolder from "../utility-buttons/AddFolder";

type StackButtonDialogProps = {
  state: UIFile[] | undefined;
  isProcessing: boolean;
  addOptimisticFiles: (newFile: UIFile) => void;
  optimisticFiles: UIFile[] | undefined;
  folders: FolderWithFiles[] | undefined;
  dispatch: React.Dispatch<any>;
  selectedFolder: FolderWithFiles | undefined;
  setSelectedFolder: React.Dispatch<
    React.SetStateAction<FolderWithFiles | undefined>
  >;

  chats: ChatWithMessages[] | undefined;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
};

const StackButtonDialog = ({
  state,
  isProcessing,
  addOptimisticFiles,
  optimisticFiles,
  folders,
  dispatch,
  selectedFolder,
  setSelectedFolder,

  chats,
  setIsProcessing,
}: StackButtonDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const { selectChat, selectedChat } = useChatSelectionContext();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} key={state?.length}>
      <Dialog.Trigger>
        <IconButton variant="ghost" className="relative">
          <StackIcon width={"25px"} height={"25px"} />
          <Box className="absolute left-7 bottom-5 bg-indigo-3 rounded-l-3 rounded-r-3 rounded-t-3 rounded-b-3 p-1.5  min-w-4 flex items-center justify-center">
            <Text size="1">{state?.length}</Text>
          </Box>
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content className="relative">
        <Dialog.Title>
          <Box className="flex justify-center align-text-top w-auto">
            File Options
          </Box>
        </Dialog.Title>

        <ProcessFileForm
          addOptimisticFiles={addOptimisticFiles}
          optimisticFiles={optimisticFiles}
          state={state}
          isProcessing={isProcessing}
          folders={folders}
          setOpen={setOpen}
          dispatch={dispatch}
          setSelectedFolder={setSelectedFolder}
          selectedFolder={selectedFolder}
          chats={chats}
          setIsProcessing={setIsProcessing}
        />

        <Dialog.Close>
          <IconButton
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={handleClose}
          >
            <Cross2Icon />
          </IconButton>
        </Dialog.Close>
        <Flex gap={"2"}>
          <AddFolder folders={folders} />
          <ConvertFileToText
            setIsProcessing={setIsProcessing}
            files={optimisticFiles}
            dispatch={dispatch}
            state={state}
            className=""
          />
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default StackButtonDialog;
