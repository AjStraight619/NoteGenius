import { useEffect } from "react";
import { useCompletion } from "ai/react";
import { FileProps } from "@/app/refine-notes/page";

export const useExtractEquations = (
  apiRoute: string,
  selectedFile: FileProps[] | null,
  isMathChecked: boolean,
  startExtraction: boolean,
  extraMessage: string,
  setEquations: React.Dispatch<React.SetStateAction<string[]>>,
  setIsMathChecked: React.Dispatch<React.SetStateAction<boolean>>
) => {
  console.log("in useExtractEquations");
  const { complete, completion, isLoading, error } = useCompletion({
    api: apiRoute,
    initialInput: extraMessage,
  });

  useEffect(() => {
    if (
      isMathChecked &&
      startExtraction &&
      selectedFile &&
      selectedFile.length > 0
    ) {
      const content = selectedFile[0].content;
      console.log(content);
      complete(content);
    }
  }, [isMathChecked, startExtraction, selectedFile, complete]);

  useEffect(() => {
    if (!isLoading && completion) {
      const equationsArray = completion.split("\n");
      setEquations(equationsArray);
      setIsMathChecked(false);
    }
  }, [completion, isLoading, setEquations, setIsMathChecked]);

  return {
    isLoadingForExtracted: isLoading,
    extractEquations: complete,
    error,
  };
};
