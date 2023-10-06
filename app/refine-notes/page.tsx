"use client";
import { useRef, useState, useEffect } from "react";
import useHandleRefine from "@/hooks/useHandleRefine";
import { useCompletion } from "ai/react";
import OriginalContentDisplay from "@/components/component/refine-notes/OriginalDisplay";
import RefineContentDisplay from "@/components/component/refine-notes/RefineDisplay";
import Sidebar from "@/components/sideBar/SideBarGlobal";
import RefineButtonGroup from "@/components/component/sidebar/RefineButtonGroup";
import { Flex } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Queue from "queue";

export type FileProps = {
  id: string;
  file: File;
  content: string;
  name: string;
};

const RefinePage: React.FC = () => {
  const { data: session, status } = useSession();
  if (!session) {
    redirect("/api/auth/signin");
  }
  const hiddenTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedFile, setSelectedFile] = useState<FileProps[] | null>(null);
  const [refinedContent, setRefinedContent] = useState<string | null>(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [extraMessage, setExtraMessage] = useState("");
  console.log(extraMessage);

  const {
    complete,
    setInput,
    completion,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: "/api/refine",
    initialInput: extraMessage,

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

  const initiateRefining = async (content: string) => {
    if (
      selectedFile &&
      selectedFile.length > 0 &&
      selectedFile[0].file.type === "application/pdf"
    ) {
      console.log("calling handlePdfExtraction");
    }

    if (selectedFile && selectedFile.length > 0 && hiddenTextareaRef.current) {
      const apiData = {
        prompt: content,
        initialInput: extraMessage,
      };

      complete(content, {
        body: { initialInput: extraMessage },
      });

      const fakeEvent = new Event(
        "submit"
      ) as unknown as React.FormEvent<HTMLFormElement>;
      handleSubmit(fakeEvent);
    }
  };
  // custom hook for handling multiple files at once. (Currently max of 6 files)
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

  const handleError = (err: any) => {};

  return (
    <Flex style={{ height: "100vh", width: "100%" }} display={"flex"}>
      <Sidebar toggleSideBar={toggleSideBar} isSideBarOpen={isSideBarOpen}>
        <RefineButtonGroup
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          setExtraMessage={setExtraMessage}
          extraMessage={extraMessage}
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
          selectedFile={selectedFile}
          setShouldRefine={setShouldRefine}
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
