import { FolderWithFiles } from "@/types/otherTypes";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Box, Flex } from "@radix-ui/themes";

type ActionType = "CREATE" | "UPDATE" | "DELETE" | null;

type FileViewProps = {
  selectedFolder: FolderWithFiles | undefined;
  selectedFileId: string | undefined;

  onSelectFile: (id: string) => void;
};

const FileView = ({
  selectedFolder,
  selectedFileId,
  onSelectFile,
}: FileViewProps) => {
  const allFiles = selectedFolder ? selectedFolder.files : [];

  return (
    <>
      {allFiles.length > 0 ? (
        <Box className="flex flex-col space-y-2">
          {allFiles.map((file) => (
            <Box
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className={`p-2 flex justify-between items-center cursor-pointer rounded 
                  ${
                    file.id === selectedFileId
                      ? "rounded-2 bg-gray-5"
                      : "hover:bg-gray-3 rounded-2"
                  }`}
            >
              <Box className="flex-grow relative mr-4 max-w-[175px]">
                <Box className="whitespace-nowrap overflow-hidden">
                  {file.name || "Untitled file"}
                </Box>
                {file.id === selectedFileId && <Box />}
              </Box>
              <Box className="w-10 flex-shrink-0 flex justify-end">
                {selectedFileId === file.id ? (
                  <Flex direction={"row"} gap={"2"}>
                    <Pencil1Icon
                      onClick={(e) => {
                        e.stopPropagation();
                        // handleFileAction("UPDATE", file.id);
                      }}
                    />
                    <TrashIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        // handleFileAction("DELETE", file.id);
                      }}
                    />
                  </Flex>
                ) : null}
              </Box>
            </Box>
          ))}
        </Box>
      ) : null}
    </>
  );
};

export default FileView;

{
  /* <ul className="w-full pb-12 mb-4 pr-3">
          {selectedFile?.content && (
            <li className="w-full p-4 bg-white shadow rounded-lg my-4">
              <Flex justify={"center"} align={"center"}>
                <Box className="p-4 border border-gray-300 rounded-lg overflow-auto">
                  <Text size={"2"} className="break-words whitespace-pre-wrap">
                    {selectedFile.content}
                  </Text>
                </Box>
              </Flex>
            </li>
          )}
          {displayMessages
            .filter((msg) => msg.role !== "system")
            .map((msg) => (
              <li
                key={msg.id}
                className={`flex justify-center items-center w-full ${
                  msg.role === "assistant" ? "bg-gray-300" : "bg-gray-100"
                } my-4 rounded-lg`}
              >
                <Box className="w-1/3 py-5 px-4">
                  <Flex
                    direction="row"
                    justify="start"
                    align="start"
                    className="whitespace-pre-line"
                    gap="5"
                  >
                    <Avatar
                      radius="small"
                      variant="solid"
                      size={"2"}
                      color={msg.role === "user" ? "teal" : "indigo"}
                      fallback={
                        <Text>
                          {msg.role === "user"
                            ? session?.user?.name?.charAt(0) || "U"
                            : "A"}
                        </Text>
                      }
                    />
                    <Text
                      size={"2"}
                      className={`break-words ${
                        msg.role === "assistant" ? "text-white" : "text-black"
                      }`}
                    >
                      {msg.content}
                    </Text>
                  </Flex>
                </Box>
              </li>
            ))}
        </ul> */
}
