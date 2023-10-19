"use client";
import { addFile } from "@/actions/actions";
import { UIFile } from "@/types/otherTypes";
import { Box, Button, Flex, Heading } from "@radix-ui/themes";
import { useRef, useState } from "react";
import { v4 as uuid } from "uuid";

type ProcessFileFormProps = {
  state: UIFile[] | undefined;
  isProcessing: boolean;
  addOptimisticFiles: (newFile: UIFile) => void;
  optimisticFiles: UIFile[] | undefined;
};

const ProcessFileForm = ({
  isProcessing,
  state,
  addOptimisticFiles,
  optimisticFiles,
}: ProcessFileFormProps) => {
  const files = state?.map((file) => file.name).toString();

  console.log("This is the state of the files added in ProcessFileForm", state);

  const fileInputRef = useRef<HTMLFormElement>(null);
  const [isMathChecked, setIsMathChecked] = useState(false);

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

          {state?.map((file) => (
            <Box key={file.id}>
              <ul>
                <li>
                  <input
                    type="text"
                    name={`file-name-${file.id}`}
                    defaultValue={file.name}
                  />
                </li>
              </ul>
            </Box>
          ))}
        </Flex>
        <Button type="submit">Process Files</Button>
      </form>
    </>
  );
};

export default ProcessFileForm;
