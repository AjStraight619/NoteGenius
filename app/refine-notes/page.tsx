"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { useCompletion } from "ai/react";
import OriginalContentDisplay from "@/components/component/refine-notes/OriginalDisplay";
import RefineContentDisplay from "@/components/component/refine-notes/RefineDisplay";
import Sidebar from "@/components/sideBar/SideBarGloabal";
import RefineButtonGroup from "@/components/component/sidebar-buttons/RefineButtonGroup";
import { Flex } from "@radix-ui/themes";

export type FileProps = {
  id: string;
  file: File;
  content: string;
  name: string;
};

const RefinePage: React.FC = () => {
  const hiddenTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedFile, setSelectedFile] = useState<FileProps | null>(null);
  const [refinedContent, setRefinedContent] = useState<string | null>(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [extraMessage, setExtraMessage] = useState("");

  const {
    complete,
    setInput,
    completion,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: "/api/refine",

    onResponse: (res: any) => {
      console.log("API responded with: ", res);

      if (res && res.error) {
        // Here, I'm assuming that if there's an error in the response, it might be in a field named 'error'.
        console.error("Error in response:", res.error.message);

        // Convert API error message to a user-friendly message if needed
        const userFriendlyMessage = getFriendlyErrorMessage(res.error.message);
        setErrorMessage(userFriendlyMessage);
      }
    },
    onError: (err) => {
      // Handle technical errors here
      console.error("Technical error occurred:", err.message);
      setErrorMessage(
        "An unexpected error occurred. Please check your connection and try again."
      );
    },
  });

  useEffect(() => {
    if (!isLoading && completion) {
      const parsedData = JSON.parse(completion);
      setRefinedContent(parsedData);
    }
  }, [completion, isLoading]);

  const handleRefineClick = () => {
    if (selectedFile?.file.type === "application/pdf") {
      console.log("calling handlePdfExtraction");
    }

    console.log(selectedFile?.file.type);
    if (selectedFile && hiddenTextareaRef.current) {
      setInput(selectedFile.content);
      complete(selectedFile.content, {});

      const fakeEvent = new Event(
        "submit"
      ) as unknown as React.FormEvent<HTMLFormElement>;
      handleSubmit(fakeEvent);
    }
  };

  const toggleSideBar = () => {
    setIsSideBarOpen((prev) => !prev);
  };

  const getFriendlyErrorMessage = (message: string) => {
    return "You encountered an error please try again. If the issue persists, refresh the page and try again.";
  };

  const handleError = (err: any) => {};

  return (
    <Flex style={{ height: "100vh", width: "100%" }} display={"flex"}>
      <Sidebar toggleSideBar={toggleSideBar} isSideBarOpen={isSideBarOpen}>
        <RefineButtonGroup
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      </Sidebar>
      <Flex
        className="flex-col-reverse md:flex-row overflow-y-auto h-full md:h-[100vh] hide-scrollbar"
        style={{
          flexGrow: 1,
          marginLeft: isSideBarOpen ? "150px" : "0px",
          transition: "margin-left 0.3s",
        }}
      >
        <OriginalContentDisplay
          setExtraMessage={setExtraMessage}
          extraMessage={extraMessage}
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
          onRefineClick={handleRefineClick}
          isLoading={isLoading}
        />
        <RefineContentDisplay
          refinedContent={refinedContent}
          isLoading={isLoading}
        />
        <textarea
          ref={hiddenTextareaRef}
          style={{ display: "none" }}
          onChange={handleInputChange}
        ></textarea>
      </Flex>
    </Flex>
  );
};

export default RefinePage;
