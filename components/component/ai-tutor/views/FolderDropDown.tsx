import { FolderWithFiles } from "@/types/otherTypes";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Box, DropdownMenu, IconButton, Tooltip } from "@radix-ui/themes";
import { FaFolder } from "react-icons/fa";

type FolderViewProps = {
  folders: FolderWithFiles[] | undefined;
  setSelectedFolder: React.Dispatch<
    React.SetStateAction<FolderWithFiles | undefined>
  >;
  setView: React.Dispatch<React.SetStateAction<string>>;
};

const FolderDropDown = ({
  folders,
  setSelectedFolder,
  setView,
}: FolderViewProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Box className="flex justify-start">
          <Tooltip content="Folders">
            <IconButton variant="ghost" onClick={() => setView("folders")}>
              <FaFolder className="w-6 h-6" />
              <CaretDownIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {folders?.map((folder) => (
          <DropdownMenu.Item
            key={folder.id}
            onSelect={() => {
              setSelectedFolder(folder);
              setView("files");
            }}
            className="hover:cursor-pointer"
          >
            {folder.name}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default FolderDropDown;
