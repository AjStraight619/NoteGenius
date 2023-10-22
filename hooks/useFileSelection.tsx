import { UIFile } from "@/types/otherTypes";
import { useEffect, useState } from "react";

export const useFileSelection = (
  files: UIFile[] | undefined,
  initialFile: UIFile | undefined
) => {
  const [selectedFileId, setSelectedFileId] = useState<string | undefined>(
    initialFile?.id
  );
  const [selectedFile, setSelectedFile] = useState<UIFile | undefined>(
    initialFile
  );

  useEffect(() => {
    if (selectedFileId) {
      const newSelectedFile = files?.find((file) => file.id === selectedFileId);
      setSelectedFile(newSelectedFile);
    }
  }, [selectedFileId, files]);

  const selectFile = (fileId: string | undefined) => {
    if (fileId !== selectedFileId) {
      setSelectedFileId(fileId);
    }
  };

  return {
    selectedFile,
    selectFile,
  };
};
