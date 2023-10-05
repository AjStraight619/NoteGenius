import React from "react";
import { IconButton, Box, Dialog, Flex, Grid } from "@radix-ui/themes";
import { StackIcon } from "@radix-ui/react-icons";
import { FileProps } from "./RefineButtonGroup";

type StackButtonProps = {
  onClick: () => void;
  fileCount: number;
  files: FileProps[]; // additional prop for the files
};

const testRa = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const StackButton = ({ onClick, fileCount, files }: StackButtonProps) => {
  return (
    <>
      <Dialog.Root>
        <Box position={"relative"}>
          <IconButton
            onClick={onClick}
            style={{ backgroundColor: "transparent" }}
          >
            <StackIcon
              style={{ width: "32px", height: "32px", color: "white" }}
            />
          </IconButton>
          <Box position={"absolute"}>{fileCount}</Box>
        </Box>

        {/* Your Dialog UI for displaying and selecting from the "files" prop */}
        <Dialog.Content>
          <Grid columns="3" gap="3" width="9">
            {testRa.map((num, idx) => (
              <Box key={idx} height="9">
                {num}
              </Box>
            ))}
          </Grid>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default StackButton;
