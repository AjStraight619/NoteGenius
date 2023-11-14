"use client";
import { useFileContext } from "@/app/contexts/FileSelectionProvider";
import FileSelection from "@/components/process-files/FileSelection";
import ProcessFilesForm from "@/components/process-files/ProcessFilesForm";
import { ChatWithMessages, FolderWithFiles, UIFile } from "@/types/otherTypes";
import { Cross2Icon, StackIcon } from "@radix-ui/react-icons";
import { Box, Dialog, Flex, IconButton, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import AddFolder from "../utility-buttons/AddFolder";

type StackButtonDialogProps = {
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
  isProcessing,
  addOptimisticFiles,
  optimisticFiles,
  folders,

  selectedFolder,
  setSelectedFolder,
  chats,
  setIsProcessing,
}: StackButtonDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log("component Chats re rendered re rendered");
  }, []);

  const { state, dispatch } = useFileContext();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} key={state?.files.length}>
      <Dialog.Trigger>
        <IconButton variant="ghost" className="relative">
          <StackIcon
            width={"25px"}
            height={"25px"}
            className="hover:cursor-pointer"
          />
          <Box className="absolute left-7 bottom-5 bg-indigo-3 rounded-l-3 rounded-r-3 rounded-t-3 rounded-b-3 p-1.5  min-w-4 flex items-center justify-center">
            <Text size="1">{state?.files.length}</Text>
          </Box>
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content className="relative" style={{ minHeight: "250px" }}>
        <Flex
          justify={"center"}
          align={"center"}
          width={"100%"}
          height={"100%"}
          direction={"column"}
        >
          <Dialog.Title>File Options</Dialog.Title>
          {/* <ProcessFileForm
          key={state?.files.length}
          addOptimisticFiles={addOptimisticFiles}
          optimisticFiles={optimisticFiles}
          isProcessing={isProcessing}
          folders={folders}
          setOpen={setOpen}
          setSelectedFolder={setSelectedFolder}
          selectedFolder={selectedFolder}
          chats={chats}
          setIsProcessing={setIsProcessing}
          files={state?.files}
        /> */}

          <ProcessFilesForm
            selectedFolder={selectedFolder}
            chats={chats}
            setOpen={setOpen}
            files={state.files}
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

        <Flex
          gap={"2"}
          width={"min-content"}
          position={"absolute"}
          className="bottom-2 left-4"
        >
          <AddFolder folders={folders} />
          <FileSelection />
          {/* <ConvertFileToText
            setIsProcessing={setIsProcessing}
            files={optimisticFiles}
            dispatch={dispatch}
            state={state}
            className=""
          /> */}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default StackButtonDialog;
