"use client";
import { useFileContext } from "@/app/contexts/FileSelectionProvider";
import { UIFile } from "@/types/otherTypes";
import { useRef } from "react";
import AddFileButton from "../component/ai-tutor/add-file/AddFileButton";

const FileSelection = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useFileContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const files: UIFile[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        files.push({
          id: file.name,
          name: file.name,
          file,
          content: null,
          type: null,
          s3Path: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          folderId: null,
          processed: null,
          math: false,
          userId: "",
          noteId: null,
        });
      }
      dispatch({ type: "ADD_FILE", payload: files });
    }
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        multiple
        onChange={handleFileChange}
        hidden
      />
      <AddFileButton onClick={() => fileRef.current?.click()} />
    </>
  );
};

export default FileSelection;
