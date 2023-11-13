"use client";
import { addFile } from "@/actions/actions";
import { useChatSelectionContext } from "@/app/contexts/ChatSelectionProvider";
import { useFileContext } from "@/app/contexts/FileSelectionProvider";
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
  isProcessing: boolean;
  addOptimisticFiles: (newFile: UIFile) => void;
  optimisticFiles: UIFile[] | undefined;
  folders: FolderWithFiles[] | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFolder: FolderWithFiles | undefined;
  setSelectedFolder: React.Dispatch<
    React.SetStateAction<FolderWithFiles | undefined>
  >;

  chats: ChatWithMessages[] | undefined;
  files: UIFile[] | undefined;

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
  addOptimisticFiles,
  folders,
  setOpen,
  selectedFolder,
  setSelectedFolder,
  chats,
  files,
}: ProcessFileFormProps) => {
  const [filesToDisplay, setFilesToDisplay] = useState<UIFile[] | undefined>(
    undefined
  );

  const [linkedFiles, setLinkedFiles] = useState<LinkedFileInfo[]>([]);

  const [popoverOpenStates, setPopoverOpenStates] = useState<
    Record<string, boolean>
  >({});

  const { selectedChat } = useChatSelectionContext();
  const [openOptions, setOpenOptions] = useState(false);

  const { dispatch, state } = useFileContext();

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
        payload: [
          {
            id: `temp-${linkedFiles.length}`,
            chatId: selectedChatToLink.id,
            fileId: fileId,
            chat: linkedChat,
            file: files?.find((file) => file.id === fileId),
          },
        ],
      });

      setOpenOptions(false);
    }
  };

  const togglePopover = (fileId: string, isOpen: boolean) => {
    setPopoverOpenStates((prev) => ({ ...prev, [fileId]: isOpen }));
  };

  const initialFilesWithCheckStatus: FileWithCheckStatus[] =
    state?.files.map((file) => ({
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

  // Extract files from the current state

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
      state?.files.find((file) => file.id === fileId)?.name || "Unknown File";

    return {
      chatName,
      fileName,
    };
  };

  // Next new server action. Add files to db and revalidate UI

  return (
    <Flex width={"100%"} direction={"column"} gap={"2"}>
      <form
        ref={fileInputRef}
        action={async (formData) => {
          fileInputRef.current?.reset();
          formData.append("chatId", selectedChatToLink.id || "");
          formData.append("fileCount", (state?.files.length || 0).toString());
          state?.files.forEach((file, index) => {
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
            // this is not good
            addOptimisticFiles({
              id: file.id,
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
              processed: null,
              noteId: null,
            });
          });
          await addFile(formData);
          setOpen(false);
          state?.files.forEach((file) =>
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
          {filesWithCheckStatus.map((file) => (
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

              <Popover.Root
                open={popoverOpenStates[file.id] || false}
                onOpenChange={(isOpen) => togglePopover(file.id, isOpen)}
              >
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
                <Checkbox onClick={() => handleCheckBoxClick(file.id)} />
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
