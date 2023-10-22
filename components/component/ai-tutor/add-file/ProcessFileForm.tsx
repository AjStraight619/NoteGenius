"use client";
import { addFile } from "@/actions/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { FolderWithFiles, UIFile } from "@/types/otherTypes";
import { CaretDownIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Checkbox,
  DropdownMenu,
  Flex,
  Separator,
  Text,
  TextFieldInput,
} from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";

type ProcessFileFormProps = {
  state: UIFile[] | undefined;
  isProcessing: boolean;
  addOptimisticFiles: (newFile: UIFile) => void;
  optimisticFiles: UIFile[] | undefined;
  folders: FolderWithFiles[] | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: React.Dispatch<any>;
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
  folders,
  setOpen,
  dispatch,
}: ProcessFileFormProps) => {
  const [selectedFolder, setSelectedFolder] = useState<
    FolderWithFiles | undefined
  >(undefined);

  const [filesToDisplay, setFilesToDisplay] = useState<UIFile[] | undefined>(
    undefined
  );

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

  useEffect(() => {
    const currentFilesToDisplay = folders?.find(
      (folder) => folder.id === selectedFolder?.id
    )?.files;

    setFilesToDisplay(currentFilesToDisplay);
  }, [selectedFolder, folders]);

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
          formData.append("fileCount", (state?.length || 0).toString());
          state?.forEach((file, index) => {
            formData.append(`files[${index}].name`, file.name);
            formData.append(`files[${index}].content`, file.content || "");
            formData.append(`files[${index}].type`, file.type || "");
            formData.append(
              `files[${index}].folderId`,
              selectedFolder?.id || ""
            );
            formData.append(
              `files[${index}].math`,
              filesWithCheckStatus.find((f) => f.id === file.id)?.isMathChecked
                ? "true"
                : "false"
            );

            addOptimisticFiles({
              id: `temp-${index}`,
              name: file.name,
              content: file.content,
              type: file.type || null,
              s3Path: null,
              folderId: selectedFolder?.id || null,
              userId: "",
              chatId: null,
              math:
                filesWithCheckStatus.find((f) => f.id === file.id)
                  ?.isMathChecked || false,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          });
          await addFile(formData);
          setOpen(false);
          state?.forEach((file) =>
            dispatch({ type: "REMOVE_FILE", payload: { id: file.id } })
          );
        }}
      >
        <Flex direction={"row"} justify={"center"} className="w-full">
          <Box className="flex-shrink-0 mr-8">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Box className="flex justify-start">
                  <Button variant={"soft"}>
                    {selectedFolder?.name || "Select Folder"}
                    <CaretDownIcon />
                  </Button>
                </Box>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {folders?.map((folder) => (
                  <DropdownMenu.Item
                    key={folder.id}
                    onSelect={() => setSelectedFolder(folder)}
                    className="hover:cursor-pointer"
                  >
                    {folder.name}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Box>

          {/* Middle Section: New Files */}
          <Box className="flex-grow">
            <Flex
              direction={"column"}
              align={"center"}
              justify={"center"}
              mt={"3"}
            >
              <Box className="self-start">
                <Text size={"1"} color={"gray"}>
                  New Files
                </Text>
                <Separator mb={"2"} size={"3"} />
              </Box>

              {filesWithCheckStatus?.map((file) => (
                <Box key={file.id} className="flex row w-full">
                  <Flex direction={"row"} align="center" gap={"2"}>
                    <TextFieldInput
                      type="text"
                      name="name"
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
          </Box>
        </Flex>

        {/* Existing Files */}
        <Flex
          direction={"column"}
          align={"center"}
          justify={"center"}
          gap={"2"}
        >
          {filesToDisplay?.map((file) => (
            <Box key={file.id}>
              <ul>
                <li>
                  {folders?.length !== 0
                    ? file.name
                    : "No files in this folder"}
                </li>
              </ul>
            </Box>
          ))}
        </Flex>

        {/* Submit Button */}

        <Box className="flex justify-end">
          <SubmitButton>Submit</SubmitButton>
        </Box>
      </form>
    </>
  );
};

export default ProcessFileForm;
