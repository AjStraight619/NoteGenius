"use client";

import { Box, TextArea, ScrollArea, IconButton } from "@radix-ui/themes";
import { DownloadIcon } from "@radix-ui/react-icons";

type RefineContentDisplayProps = {
  refinedContent: string | null;
  isLoading: boolean;
};

const RefineContentDisplay: React.FC<RefineContentDisplayProps> = ({
  refinedContent,
  isLoading,
}) => {
  const handleParse = async (
    filename: string,
    content: string,
    convertToPDF: string
  ) => {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("filename", filename);
    formData.append("ConvertToPDF", convertToPDF);

    try {
      const res = await fetch("/api/wolfram-alpha", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.log(res);
      }

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (
    filename: string,
    content: string,
    convertToPDF: string
  ) => {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("filename", filename);
    formData.append("ConvertToPDF", convertToPDF);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("Error fetching from API:", res.statusText);
        // TODO: Consider displaying an error message to the user or taking other appropriate action
        return;
      }

      // If the API call was successful, trigger a file download
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${filename}.pdf`; // Ensure the filename ends with .pdf
      link.click();

      URL.revokeObjectURL(blobUrl); // Clean up the blob URL
    } catch (error) {
      console.error("Error during the download process:", error);
      // TODO: Handle errors - e.g., display an error message to the user
    }
  };

  return (
    <Box
      className="lg:w-1/2 flex items-center justify-center"
      style={{ height: "100vh" }}
    >
      {isLoading && (
        <div className="flex items-center space-x-2 z-10">
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
          style={{ height: "100vh", position: "relative", width: "100%" }}
        >
          <TextArea
            value={refinedContent}
            readOnly
            style={{ width: "100%", height: "100vh" }}
          />
          <IconButton
            onClick={() => handleDownload("Test", refinedContent, "true")}
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
