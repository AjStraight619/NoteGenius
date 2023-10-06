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
  selectedFile: FileProps[] | null;
  setShouldRefine: React.Dispatch<React.SetStateAction<boolean>>;
};

const OriginalContentDisplay: React.FC<OriginalContentDisplayProps> = ({
  selectedFile,
  setShouldRefine,
}) => {
  const handleRefineButtonClick = () => {
    setShouldRefine(true);
  };

  return (
    <Box className="lg:w-1/2 w-full border-r border-gray-300">
      {selectedFile && selectedFile.length > 0 && (
        <ScrollArea
          type="always"
          scrollbars="vertical"
          style={{ height: "100vh", position: "relative" }}
        >
          <TextArea
            value={selectedFile[0].content}
            readOnly
            style={{ width: "100%", height: "100vh" }}
          />
          <Button
            onClick={handleRefineButtonClick}
            variant="surface"
            style={{
              position: "absolute",
              bottom: "10px",
              right: "15px",
            }}
          >
            Refine
          </Button>

          {/* <Dialog.Root>
            <Dialog.Trigger>
              <Button
                variant="surface"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "15px",
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
                  <TextArea
                    value={extraMessage}
                    onChange={(e) => setExtraMessage(e.target.value)}
                    placeholder="Give a description on how you want to refine your note..."
                  ></TextArea>
                </label>
              </Flex>

              <label>
                <Flex justify="center">
                  <Dialog.Close>
                    <Button
                      mt={"3"}
                      onClick={handleRefineButtonClick}
                      disabled={isLoading}
                    >
                      Refine Note
                    </Button>
                  </Dialog.Close>
                </Flex>
              </label>
            </Dialog.Content>
          </Dialog.Root> */}

          <IconButton
            variant="surface"
            style={{ backgroundColor: "transparent" }}
            className="absolute top-[10px] right-[15px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px]"
          >
            <Cross2Icon />
          </IconButton>
        </ScrollArea>
      )}
    </Box>
  );
};

export default OriginalContentDisplay;
