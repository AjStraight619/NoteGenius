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
