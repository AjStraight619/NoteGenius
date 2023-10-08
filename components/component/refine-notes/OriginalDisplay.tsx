"use client";
import {
  Button,
  Box,
  ScrollArea,
  TextArea,
  IconButton,
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
  isProcessing: boolean;
  style?: React.CSSProperties;
};

const OriginalContentDisplay: React.FC<OriginalContentDisplayProps> = ({
  selectedFile,
  setShouldRefine,
  isProcessing,
  style,
}) => {
  const handleRefineButtonClick = () => {
    setShouldRefine(true);
  };

  return (
    <Box
      className={`w-full border-r border-gray-300 flex items-center justify-center ${
        selectedFile && selectedFile.length > 0 ? "" : "flex-col"
      }`}
      style={{ height: "100vh", ...style }}
    >
      {isProcessing && (
        <div className="flex items-center space-x-2 z-10">
          <div className="h-2 w-2 bg-black rounded-full bounce"></div>
          <div className="h-2 w-2 bg-black rounded-full bounce bounce-delay-1"></div>
          <div className="h-2 w-2 bg-black rounded-full bounce bounce-delay-2"></div>
          <span>Processing image for content...</span>
        </div>
      )}

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
            disabled={isProcessing}
          >
            Refine
          </Button>

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
