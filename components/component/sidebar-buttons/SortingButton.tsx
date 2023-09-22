"use client";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { ArrowRightIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { FaSort } from "react-icons/fa";
import { sortByAz, sortByZa } from "@/lib/sortBy";
import { FolderSidebarProps } from "@/types/folderTypes";

export default function sortingButton({
  folders,
  updateFolders,
}: FolderSidebarProps) {
  const sortFoldersBy = [
    {
      name: "Sort from A-z",
      value: sortByAz,
      icon: (
        <ArrowLeftIcon
          style={{
            width: "24px",
            height: "24px",
            color: "white",
          }}
        />
      ),
    },
    {
      name: "Sort from Z-a",
      value: sortByZa,
      icon: (
        <ArrowRightIcon
          style={{
            width: "24px",
            height: "24px",
            color: "white",
          }}
        />
      ),
    },
  ];

  const handleSort = (foldersToSort: any, sortFunction: any) => {
    const sortedFolders = sortFunction(foldersToSort);
    updateFolders(sortedFolders);
    return sortedFolders;
  };

  return (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton style={{ backgroundColor: "#2C2F33" }}>
            <FaSort
              style={{
                width: "32px",
                height: "32px",
                color: "white",
              }}
            />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {sortFoldersBy?.map((item, index) => (
            <DropdownMenu.Item
              key={index}
              title={item.name}
              onSelect={() => handleSort(folders, item.value)}
            >
              {item.icon}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
