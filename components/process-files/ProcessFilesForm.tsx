import { addFile } from "@/actions/actions";
import { useChatSelectionContext } from "@/app/contexts/ChatSelectionProvider";
import { useFileContext } from "@/app/contexts/FileSelectionProvider";
import { ChatWithMessages, FolderWithFiles, UIFile } from "@/types/otherTypes";
import {
  DotsHorizontalIcon,
  Link1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Text,
  TextFieldInput,
} from "@radix-ui/themes";
import { useRef, useState } from "react";
import { SubmitButton } from "../ui/submit-button";

type ProcessFilesFormProps = {
  selectedFolder: FolderWithFiles | undefined;
  chats: ChatWithMessages[] | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  files: UIFile[] | undefined;
};

type SelectedChat = {
  id: string;
  title: string;
};

type FileWithCheckStatus = {
  isMathChecked: boolean;
} & UIFile;

type LinkedFileInfo = {
  chatName: string;
  fileName: string;
};

const ProcessFilesForm = ({
  selectedFolder,
  chats,
  setOpen,
  files,
}: ProcessFilesFormProps) => {
  const { dispatch, state } = useFileContext();
  const { selectedChat } = useChatSelectionContext();
  const fileInputRef = useRef<HTMLFormElement>(null);
  const [selectedChatToLink, setSelectedChatToLink] = useState<SelectedChat>({
    id: selectedChat?.id || "",
    title: selectedChat?.title || "",
  });
  const [linkedFiles, setLinkedFiles] = useState<LinkedFileInfo[]>([]);
  const [popoverOpenStates, setPopoverOpenStates] = useState<
    Record<string, boolean>
  >({});
  const togglePopover = (fileId: string, isOpen: boolean) => {
    setCurrentOpenPopoverId(isOpen ? fileId : null);
  };

  const [currentOpenPopoverId, setCurrentOpenPopoverId] = useState<
    string | null
  >(null);

  const [openOptions, setOpenOptions] = useState(false);

  const initialFilesWithCheckStatus: FileWithCheckStatus[] =
    state?.files.map((file) => ({
      ...file,
      isMathChecked: false,
    })) || [];

  const [filesWithCheckStatus, setFilesWithCheckStatus] = useState<
    FileWithCheckStatus[]
  >(initialFilesWithCheckStatus);

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
      state.files.find((file) => file.id === fileId)?.name || "Unknown File";

    console.log("chatName", chatName);
    console.log("fileName", fileName);

    return {
      chatName,
      fileName,
    };
  };

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
            file: state.files?.find((file) => file.id === fileId),
          },
        ],
      });

      setCurrentOpenPopoverId(null);
    }
  };

  const handleCheckBoxClick = (fileId: string) => {
    setFilesWithCheckStatus((prevFilesWithCheckStatus) =>
      prevFilesWithCheckStatus.map((file) =>
        file.id === fileId
          ? { ...file, isMathChecked: !file.isMathChecked }
          : file
      )
    );
  };

  return (
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

          formData.append(`files[${index}].folderId`, selectedFolder?.id || "");
          formData.append(
            `files[${index}].math`,
            filesWithCheckStatus.find((f) => f.id === file.id)?.isMathChecked
              ? "true"
              : "false"
          );
        });
        await addFile(formData);

        state?.files.forEach((file) =>
          dispatch({ type: "REMOVE_FILE", payload: { id: file.id } })
        );
      }}
    >
      {filesWithCheckStatus.map((file) => (
        <Flex
          key={file.id}
          position={"relative"}
          justify={"center"}
          align={"center"}
          gap={"2"}
        >
          <TextFieldInput type="text" name="name" defaultValue={file.name} />

          <Popover.Root
            open={currentOpenPopoverId === file.id}
            onOpenChange={(isOpen) => togglePopover(file.id, isOpen)}
          >
            <Popover.Trigger asChild>
              <IconButton type="button" radius={"medium"} variant={"ghost"}>
                <DotsHorizontalIcon />
              </IconButton>
            </Popover.Trigger>
            <Popover.Content>
              <Flex direction="column" gap="2" justify="between" align="center">
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

      <SubmitButton className="absolute bottom-2 right-2">
        ProcessFiles
      </SubmitButton>
    </form>
  );
};

export default ProcessFilesForm;
