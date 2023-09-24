"use client";

import {
  Box,
  TextArea,
  ScrollArea,
  Button,
  IconButton,
} from "@radix-ui/themes";
import { DownloadIcon } from "@radix-ui/react-icons";

type RefineContentDisplayProps = {
  refinedContent: string | null;
  isLoading: boolean;
};

const RefineContentDisplay: React.FC<RefineContentDisplayProps> = ({
  refinedContent,
  isLoading,
}) => {
  console.log("Refined Content: ", refinedContent);
  return (
    <Box style={{ width: "50%", position: "relative" }}>
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center space-x-2 z-10">
          <div className="h-1 w-1 bg-black rounded-full animate-bounce"></div>
          <div className="h-1 w-1 bg-black rounded-full animate-bounce delay-200"></div>
          <div className="h-1 w-1 bg-black rounded-full animate-bounce delay-400"></div>
          <span>Note Genius is Refining your Note...</span>
        </div>
      )}

      {refinedContent && (
        <ScrollArea
          type="always"
          scrollbars="vertical"
          style={{ height: "100vh", position: "relative" }}
        >
          <TextArea
            value={refinedContent}
            readOnly
            style={{ width: "100%", height: "100vh" }}
          />

          <IconButton
            variant="surface"
            style={{
              position: "absolute",
              bottom: "10px",
              right: "15px",
            }}
          >
            <DownloadIcon />
          </IconButton>
        </ScrollArea>
      )}
    </Box>
  );
};

export default RefineContentDisplay;
