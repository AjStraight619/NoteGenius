"use client";
import { useRef, useState, useEffect } from "react";
import useHandleRefine from "@/hooks/useHandleRefine";
import { useCompletion } from "ai/react";
import OriginalContentDisplay from "@/components/component/refine-notes/OriginalDisplay";
import RefineContentDisplay from "@/components/component/refine-notes/RefineDisplay";
import Sidebar from "@/components/sideBar/SideBarGlobal";
import RefineButtonGroup from "@/components/component/sidebar-buttons/RefineButtonGroup";
import { Flex } from "@radix-ui/themes";
import CaptureAndProcessImageButton from "@/components/component/sidebar-buttons/GetMedia";
import SplitScreenButton from "@/components/component/sidebar-buttons/SplitScreenButton";
import { useExtractEquations } from "@/hooks/useExtractEquations";

export type FileProps = {
  id: string;
  file: File;
  content: string;
  name: string;
};

const RefinePage: React.FC = () => {
  const hiddenTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedFile, setSelectedFile] = useState<FileProps[] | null>(null);
  const [refinedContent, setRefinedContent] = useState<string | null>(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [extraMessage, setExtraMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [isMathChecked, setIsMathChecked] = useState(false);
  const [equations, setEquations] = useState<string[]>([]);
  const [apiRoute, setApiRoute] = useState("api/refine");
  const [startExtraction, setStartExtraction] = useState(false);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (isMathChecked) {
      setApiRoute("api/extract-equations");
    } else {
      setApiRoute("api/refine");
    }
  }, [isMathChecked]);

  useEffect(() => {
    if (selectedFile && selectedFile.length > 0) {
      setDisplayText(selectedFile[0].content);
    }
  }, [selectedFile]);

  const { isLoadingForExtracted, error, extractEquations } =
    useExtractEquations(
      apiRoute,
      selectedFile,
      isMathChecked,
      startExtraction,
      extraMessage,
      setEquations,
      setIsMathChecked
    );

  useEffect(() => {
    if (startExtraction && selectedFile) {
      extractEquations(selectedFile[0].content);
      setStartExtraction(false);
    }
  }, [startExtraction, selectedFile, extractEquations]);

  const { complete, completion, isLoading, handleInputChange, handleSubmit } =
    useCompletion({
      api: apiRoute,
      initialInput: extraMessage,

      onResponse: (res: any) => {
        if (res && res.error) {
          console.error("Error in response:", res.error.message);
          console.log(res);

          const userFriendlyMessage = getFriendlyErrorMessage(
            res.error.message
          );
          setErrorMessage(userFriendlyMessage);
        } else if (res && res.equations) {
          setEquations(res.equations);
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

  const initiateRefining = async (content: string) => {
    if (
      selectedFile &&
      selectedFile.length > 0 &&
      selectedFile[0].file.type === "application/pdf"
    ) {
      console.log("calling handlePdfExtraction");
    }

    if (selectedFile && selectedFile.length > 0 && hiddenTextareaRef.current) {
      complete(content, {
        body: { initialInput: extraMessage },
      });

      const fakeEvent = new Event(
        "submit"
      ) as unknown as React.FormEvent<HTMLFormElement>;
      handleSubmit(fakeEvent);

      // If there are more files left to refine, trigger the next refinement
      if (selectedFile.length > 1) {
        setShouldRefine(true);
      }
    }
  };

  // custom hook for handling multiple files at once. (Currently max of 6 files)
  console.log("These are the selected files: ", selectedFile);
  if (selectedFile) {
    console.log(
      "Here is how many files are in the array: ",
      selectedFile.length
    );
  }
  const { shouldRefine, setShouldRefine } = useHandleRefine(
    selectedFile,
    isLoading,
    initiateRefining // This function initiates refining and is defined in RefinePage.
  );

  const toggleSideBar = () => {
    setIsSideBarOpen((prev) => !prev);
  };

  const getFriendlyErrorMessage = (message: string) => {
    return "You encountered an error please try again. If the issue persists, refresh the page and try again.";
  };

  const toggleSplitScreen = () => {
    setIsSplitScreen((prev) => !prev);
  };

  const handleError = (err: any) => {};

  const parseEquations = (str: string): string[] => {
    // Split the string into lines based on newline characters
    const lines = str.split("\n");

    // Initialize an empty array to hold the equations
    const equations: string[] = [];

    // Process each line
    lines.forEach((line) => {
      const match = line.match(/^\d+:\s*(.+)/);
      if (match) {
        equations.push(match[1]);
      }
    });

    return equations;
  };

  return (
    <Flex style={{ height: "100vh", width: "100%" }} display={"flex"}>
      <Sidebar toggleSideBar={toggleSideBar} isSideBarOpen={isSideBarOpen}>
        <RefineButtonGroup
          setSelectedFile={setSelectedFile}
          setExtraMessage={setExtraMessage}
          extraMessage={extraMessage}
          setIsProcessing={setIsProcessing}
          setIsMathChecked={setIsMathChecked}
          isMathChecked={isMathChecked}
          setStartExtraction={setStartExtraction}
        />
        {/* <CaptureAndProcessImageButton
          setSelectedFile={setSelectedFile}
          setIsProcessing={setIsProcessing}
          isProcessing={isProcessing}
        /> */}

        <SplitScreenButton
          isSplitScreen={isSplitScreen}
          toggleSplitScreen={toggleSplitScreen}
        />
      </Sidebar>
      <Flex
        className={`flex-col${
          isSplitScreen ? "-reverse md:flex-row" : ""
        } overflow-y-auto h-full md:h-[100vh] hide-scrollbar`}
        style={{
          flexGrow: 1,
          marginLeft: isSideBarOpen ? "150px" : "0px",
          transition: "margin-left 0.3s",
        }}
      >
        <OriginalContentDisplay
          selectedFile={selectedFile}
          setShouldRefine={setShouldRefine}
          isProcessing={isProcessing}
          style={{ flex: isSplitScreen ? "1" : "0 0 0%" }}
          isMathChecked={isMathChecked}
          displayText={displayText}
          equations={equations}
        />
        <RefineContentDisplay
          refinedContent={refinedContent}
          isLoading={isLoading}
          style={{ flex: isSplitScreen ? "1" : "0 0 0%" }} // Adjust this as needed
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
