"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  children: React.ReactNode;
  folderId: string;
};

function MyDropzone({ children, folderId }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Now you can use folderId here to know where these files should go
      console.log(`Files dropped for folder: ${folderId}`);

      acceptedFiles.forEach((file: File) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          // Do whatever you want with the file contents
          const binaryStr = reader.result;
          console.log(binaryStr);
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [folderId]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
}

export default MyDropzone;
