"use client";
import { addFile } from "@/actions/actions";
import { useChatSelectionContext } from "@/app/contexts/ChatSelectionProvider";
import { SubmitButton } from "@/components/ui/submit-button";
import { ChatWithMessages, FolderWithFiles, UIFile } from "@/types/otherTypes";
import {
  CaretDownIcon,
  DotsHorizontalIcon,
  Link1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";

import {
  Box,
  Button,
  Checkbox,
  DropdownMenu,
  Flex,
  IconButton,
  Popover,
  Separator,
  Text,
  TextFieldInput,
} from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";

type SelectedChat = {
  id: string;
  title: string;
};

type ProcessFileFormProps = {
  state: UIFile[] | undefined;
  isProcessing: boolean;
  addOptimisticFiles: (newFile: UIFile) => void;
  optimisticFiles: UIFile[] | undefined;
  folders: FolderWithFiles[] | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: React.Dispatch<any>;
  selectedFolder: FolderWithFiles | undefined;
  setSelectedFolder: React.Dispatch<
    React.SetStateAction<FolderWithFiles | undefined>
  >;

  chats: ChatWithMessages[] | undefined;

  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
};
type MathFile = {
  isMathChecked: boolean;
} & UIFile;
type FileWithCheckStatus = {
  isMathChecked: boolean;
} & UIFile;

type LinkedFileInfo = {
  chatName: string;
  fileName: string;
};

const ProcessFileForm = ({
  state,
  addOptimisticFiles,
  optimisticFiles,
  folders,
  setOpen,
  dispatch,
  selectedFolder,
  setSelectedFolder,
  chats,
  setIsProcessing,
}: ProcessFileFormProps) => {
  const [filesToDisplay, setFilesToDisplay] = useState<UIFile[] | undefined>(
    undefined
  );

  const [linkedFiles, setLinkedFiles] = useState<LinkedFileInfo[]>([]);

  const { selectedChat } = useChatSelectionContext();
  const [openOptions, setOpenOptions] = useState(false);

  const [selectedChatToLink, setSelectedChatToLink] = useState<SelectedChat>({
    id: selectedChat?.id || "",
    title: selectedChat?.title || "",
  });
  const handleLink = (
    e: React.MouseEvent<HTMLButtonElement>,
    fileId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const linkedChat = chats?.find((chat) => chat.id === selectedChatToLink.id);

    if (linkedChat) {
      const linkInfo = getLinkedInfo(selectedChatToLink.id, fileId);
      setLinkedFiles((current) => [...current, linkInfo]);

      dispatch({
        type: "ADD_LINK",
        payload: [{ chatId: selectedChatToLink.id, fileId: fileId }],
      });
      setOpenOptions(false);
    }
  };

  useEffect(() => {
    console.log("This is the selected chat", selectedChatToLink);
  }, [selectedChat?.id, selectedChatToLink]);

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
    const currentFilesToDisplay = folders?.find(
      (folder) => folder.id === selectedFolder?.id
    )?.files;

    setFilesToDisplay(currentFilesToDisplay);
  }, [selectedFolder, folders, state]);

  const handleCheckBoxClick = (fileId: string) => {
    setFilesWithCheckStatus((prevFilesWithCheckStatus) =>
      prevFilesWithCheckStatus.map((file) =>
        file.id === fileId
          ? { ...file, isMathChecked: !file.isMathChecked }
          : file
      )
    );
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    console.log("in handle delete, deleting file", e.currentTarget.id);
    e.preventDefault();
    dispatch({ type: "REMOVE_FILE", payload: { id: id } });
  };

  const getLinkedInfo = (
    chatId: string | undefined,
    fileId: string | undefined
  ) => {
    const chatName =
      chats?.find((chat) => chat.id === chatId)?.title || "Unknown Chat";
    const fileName =
      state?.find((file) => file.id === fileId)?.name || "Unknown File";

    return {
      chatName,
      fileName,
    };
  };

  return (
    <Flex width={"100%"} direction={"column"} gap={"2"}>
      <form
        ref={fileInputRef}
        action={async (formData) => {
          fileInputRef.current?.reset();
          formData.append("chatId", selectedChatToLink.id || "");
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
              chatId: selectedChatToLink.id || undefined,
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
        <Flex justify={"between"}>
          <Flex gap={"2"}>
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
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Box className="flex justify-start">
                  <Button variant={"soft"}>
                    {selectedChatToLink.title || "Select Chat"}
                    <CaretDownIcon />
                  </Button>
                </Box>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {chats?.map((chat) => (
                  <DropdownMenu.Item
                    key={chat.id}
                    onSelect={() =>
                      setSelectedChatToLink({ id: chat.id, title: chat.title })
                    }
                    className="hover:cursor-pointer"
                  >
                    {"Link to " + chat.title}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Flex>

        <Flex justify={"center"} align={"center"} direction={"column"}>
          <Text size={"1"} color={"gray"}>
            New Files
          </Text>
          <Separator mb={"2"} size={"3"} />
        </Flex>
        <Flex
          direction={"column"}
          align={"center"}
          justify={"center"}
          gap={"2"}
        >
          {filesWithCheckStatus?.map((file) => (
            <Flex
              key={file.id}
              position={"relative"}
              justify={"center"}
              align={"center"}
              gap={"2"}
            >
              <TextFieldInput
                type="text"
                name="name"
                defaultValue={file.name}
              />

              <Popover.Root open={openOptions} onOpenChange={setOpenOptions}>
                <Popover.Trigger>
                  <IconButton radius={"medium"} variant={"ghost"}>
                    <DotsHorizontalIcon />
                  </IconButton>
                </Popover.Trigger>
                <Popover.Content>
                  <Flex
                    direction="column"
                    gap="2"
                    justify="between"
                    align="center"
                  >
                    <Button
                      radius="medium"
                      variant="ghost"
                      onClick={(e) => handleLink(e, file?.id)}
                      size="1"
                    >
                      <Link1Icon />
                      Link
                    </Button>
                    <Button
                      radius="medium"
                      variant="ghost"
                      onClick={(e) => handleDelete(e, file?.id)}
                      size="1"
                    >
                      <TrashIcon />
                      Delete
                    </Button>
                  </Flex>
                  <Popover.Close />
                </Popover.Content>
              </Popover.Root>

              <Box className="flex-row gap-1">
                <Checkbox
                  checked={file.isMathChecked}
                  onClick={() => handleCheckBoxClick(file.id)}
                />
                <Text ml={"1"}>Math</Text>
              </Box>
            </Flex>
          ))}
        </Flex>

        <SubmitButton className="absolute bottom-5 right-3">
          Process Files
        </SubmitButton>
      </form>
    </Flex>
  );
};

export default ProcessFileForm;
