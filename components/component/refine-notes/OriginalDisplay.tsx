"use client";
import {
  Button,
  Box,
  ScrollArea,
  TextArea,
  IconButton,
  Flex,
  Dialog,
} from "@radix-ui/themes";

import { Cross2Icon } from "@radix-ui/react-icons";
export type FileProps = {
  id: string;
  file: File;
  content: string;
  name: string;
};
type OriginalContentDisplayProps = {
  selectedFile: FileProps | null;
  onRefineClick: () => void;
  isLoading: boolean;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileProps | null>>;
};

const OriginalContentDisplay: React.FC<OriginalContentDisplayProps> = ({
  setSelectedFile,
  selectedFile,
  onRefineClick,
  isLoading,
}) => {
  const handleRefineClick = () => {
    // TODO: Handle possible edge cases and errors...
    onRefineClick();
  };

  const handleDialogClose = () => {
    setSelectedFile(null);
  };
  return (
    <Box style={{ width: "50%", borderRight: "1px solid gray" }}>
      {selectedFile && (
        <ScrollArea
          type="always"
          scrollbars="vertical"
          style={{ height: "100vh", position: "relative" }}
        >
          <TextArea
            value={selectedFile.content}
            readOnly
            style={{ width: "100%", height: "100vh" }}
          />

          <Dialog.Root>
            <Dialog.Trigger>
              <Button
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                }}
              >
                Refine
              </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: "600px", position: "relative" }}>
              <Dialog.Close>
                <button
                  onClick={handleDialogClose}
                  style={{ position: "absolute", top: "10px", right: "10px" }}
                >
                  <Cross2Icon className="hover:text-gray-2-translucent" />
                </button>
              </Dialog.Close>
              <Dialog.Title>Refine</Dialog.Title>
              <Dialog.Description>
                Choose how you want to refine your note.
              </Dialog.Description>
              <Flex direction="column" gap="3">
                <label>
                  <TextArea placeholder="Give a description on how you want to refine your note"></TextArea>
                </label>
                <label>Label 2</label>
                <label>Label 3</label>
              </Flex>

              <label>
                <Flex justify="center">
                  <Dialog.Close>
                    <Button onClick={handleRefineClick} disabled={isLoading}>
                      Refine Note
                    </Button>
                  </Dialog.Close>
                </Flex>
              </label>
            </Dialog.Content>
          </Dialog.Root>

          <IconButton
            style={{ backgroundColor: "transparent" }}
            className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px]"
          >
            <Cross2Icon className="hover:text-gray-2-translucent" />
          </IconButton>
        </ScrollArea>
      )}
    </Box>
  );
};

export default OriginalContentDisplay;
