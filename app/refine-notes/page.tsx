"use client";
import { useRef, useState, useEffect } from "react";
import { useCompletion } from "ai/react";
import OriginalContentDisplay from "@/components/component/refine-notes/OriginalDisplay";
import RefineContentDisplay from "@/components/component/refine-notes/RefineDisplay";
import Sidebar from "@/components/sideBar/SideBarGloabal";
import RefineButtonGroup from "@/components/component/sidebar-buttons/RefineButtonGroup";
import { Flex, Box } from "@radix-ui/themes";

export type FileProps = {
  id: string;
  file: File;
  content: string;
  name: string;
};

const RefinePage: React.FC = () => {
  const {
    complete,
    setInput,
    completion,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: "/api/refine",
  });

  useEffect(() => {
    if (!isLoading && completion) {
      const parsedData = JSON.parse(completion);
      setRefinedContent(parsedData);
    }
  }, [completion, isLoading]);

  const hiddenTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedFile, setSelectedFile] = useState<FileProps | null>(null);
  const [refinedContent, setRefinedContent] = useState<string | null>(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);

  const handleRefineClick = () => {
    if (selectedFile && hiddenTextareaRef.current) {
      setInput(selectedFile.content);
      complete(selectedFile.content);

      const fakeEvent = new Event(
        "submit"
      ) as unknown as React.FormEvent<HTMLFormElement>;
      handleSubmit(fakeEvent);
    }
  };

  const toggleSideBar = () => {
    setIsSideBarOpen((prev) => !prev);
  };

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
