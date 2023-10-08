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
  setSelectedFile: React.Dispatch<React.SetStateAction<FileProps[] | null>>;
  setShouldRefine: React.Dispatch<React.SetStateAction<boolean>>;
  isProcessing: boolean;
  style?: React.CSSProperties;
  isMathChecked: boolean;
  displayText: string;
  equations: string[];
};

const OriginalContentDisplay: React.FC<OriginalContentDisplayProps> = ({
  selectedFile,
  setSelectedFile,
  setShouldRefine,
  isProcessing,
  style,
  isMathChecked,
  displayText,
  equations,
}) => {
  const handleRefineButtonClick = () => {
    setShouldRefine(true);
  };

  const handleOriginalContentClose = () => {
    setShouldRefine(false);
    setSelectedFile(null);
  };

  const formattedText =
    equations.length > 0
      ? equations[0].replace(/^"(.*)"$/, "$1").replace(/\\n/g, "\n\n")
      : displayText;

  return (
    <Box
      className={`w-full border-r border-gray-300 flex items-center justify-center ${
        selectedFile && selectedFile.length > 0 ? "" : "flex-col"
      }`}
      style={{ height: "100vh", ...style }}
    >
      {isProcessing && (
        <div className="processing-container absolute inset-0 flex items-center justify-center z-10">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-black rounded-full bounce"></div>
            <div className="h-2 w-2 bg-black rounded-full bounce bounce-delay-1"></div>
            <div className="h-2 w-2 bg-black rounded-full bounce bounce-delay-2"></div>
            <span>Processing image for content...</span>
          </div>
        </div>
      )}

      {isMathChecked && (
        <div className="processing-container absolute inset-0 flex items-center justify-center z-10">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-black rounded-full bounce"></div>
            <div className="h-2 w-2 bg-black rounded-full bounce bounce-delay-1"></div>
            <div className="h-2 w-2 bg-black rounded-full bounce bounce-delay-2"></div>
            <span>Extracting equations...</span>
          </div>
        </div>
      )}

      {selectedFile && selectedFile.length > 0 && (
        <ScrollArea
          type="always"
          scrollbars="vertical"
          style={{ height: "100vh", position: "relative" }}
        >
          <TextArea
            value={formattedText}
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
            onClick={handleOriginalContentClose}
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
