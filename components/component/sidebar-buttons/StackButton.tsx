import { StackIcon } from "@radix-ui/react-icons";
import { Box, Dialog, Grid, IconButton } from "@radix-ui/themes";
import { FileProps } from "./RefineButtonGroup";

type StackButtonProps = {
  onClick: () => void;
  fileCount: number;
  files: FileProps[];
};

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

        <Dialog.Content>
          <Grid columns="3" gap="3" width="9"></Grid>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default StackButton;
