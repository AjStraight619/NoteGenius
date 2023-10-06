import { useState, useEffect } from "react";
import { FileProps } from "@/app/refine-notes/page";

const useHandleRefine = (
  selectedFiles: FileProps[] | null,
  isLoading: boolean,
  handleRefineClick: any
) => {
  const [filesToRefine, setFilesToRefine] = useState<FileProps[] | null>(
    selectedFiles
  );
  const [shouldRefine, setShouldRefine] = useState<boolean>(false);

  useEffect(() => {
    if (
      !shouldRefine ||
      !filesToRefine ||
      isLoading ||
      filesToRefine.length === 0 ||
      filesToRefine.length >= 6
    ) {
      return;
    }

    const currentFile = filesToRefine[0];
    handleRefineClick(currentFile.content);

    setFilesToRefine((prev) => (prev ? prev.slice(1) : null));
    setShouldRefine(false); // Reset after refining
  }, [filesToRefine, isLoading, handleRefineClick, shouldRefine]);

  useEffect(() => {
    if (JSON.stringify(selectedFiles) !== JSON.stringify(filesToRefine)) {
      setFilesToRefine(selectedFiles);
    }
  }, [selectedFiles]);

  return {
    shouldRefine,
    setShouldRefine,
  };
};

export default useHandleRefine;
