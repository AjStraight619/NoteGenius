"use client";
import { addFile } from "@/actions/actions";
import { UIFile } from "@/types/otherTypes";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  TextFieldInput,
} from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

type ProcessFileFormProps = {
  state: UIFile[] | undefined;
  isProcessing: boolean;
  addOptimisticFiles: (newFile: UIFile) => void;
  optimisticFiles: UIFile[] | undefined;
};
type MathFile = {
  isMathChecked: boolean;
} & UIFile;
type FileWithCheckStatus = {
  isMathChecked: boolean;
} & UIFile;

const ProcessFileForm = ({
  isProcessing,
  state,
  addOptimisticFiles,
  optimisticFiles,
}: ProcessFileFormProps) => {
  const initialFilesWithCheckStatus: FileWithCheckStatus[] =
    state?.map((file) => ({
      ...file,
      isMathChecked: false,
    })) || [];
  const [filesWithCheckStatus, setFilesWithCheckStatus] = useState<
    FileWithCheckStatus[]
  >(initialFilesWithCheckStatus);

  const fileInputRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const checkedFiles = filesWithCheckStatus.filter(
      (file) => file.isMathChecked
    );

    if (checkedFiles.length > 0) {
      console.log("The following files are checked:", checkedFiles);
    }
  }, [filesWithCheckStatus]);

  const handleCheckBoxClick = (fileId: string) => {
    setFilesWithCheckStatus((prevFilesWithCheckStatus) =>
      prevFilesWithCheckStatus.map((file) =>
        file.id === fileId
          ? { ...file, isMathChecked: !file.isMathChecked }
          : file
      )
    );
    console.log("This is the fileId", fileId);
    console.log("This is the filesWithCheckStatus state", filesWithCheckStatus);
  };

  return (
    <>
      <form
        ref={fileInputRef}
        action={async (formData) => {
          fileInputRef.current?.reset();
          state?.map((file) => {
            addOptimisticFiles({
              id: uuid(),
              name: file.name,
              content: "",
              type: null,
              s3Path: null,
              folderId: null,
              userId: "your-user-id-here",
              chatId: null,
              math: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          });
          // TODO: Check if math is checked and if so, call equation extract api before adding the file to the db.
          await addFile(formData);
        }}
      >
        <Flex
          direction={"column"}
          align={"center"}
          justify={"center"}
          gap={"2"}
        >
          {optimisticFiles?.map((file) => (
            <Box key={file.id}>
              <ul>
                <li>{file.name}</li>
              </ul>
            </Box>
          ))}
        </Flex>
        {/* These are the files that are going to be added to the db. The optimistic files represent the files that are already there. Use isProcessing here, once submitted the useOptimistic hook should render the files being processed */}
        <Flex direction={"column"} gap={"2"} mt={"2"}>
          <Heading size={"2"}>
            Files to be processed if math is checked:
          </Heading>

          {filesWithCheckStatus?.map((file) => (
            <Box key={file.id} className="flex row">
              <Flex direction={"row"} align="center" gap={"2"}>
                <TextFieldInput
                  type="text"
                  name={`file-name-${file.id}`}
                  defaultValue={file.name}
                />
                <Checkbox
                  checked={file.isMathChecked}
                  onClick={() => handleCheckBoxClick(file.id)}
                />
                Math
              </Flex>
            </Box>
          ))}
        </Flex>
        <Button mt={"2"} type="submit">
          Process Files
        </Button>
      </form>
    </>
  );
};

export default ProcessFileForm;
