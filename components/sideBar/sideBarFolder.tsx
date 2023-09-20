"use client";

import { useState } from "react";
import { Box, Flex, IconButton, TextField } from "@radix-ui/themes";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { FaCog, FaSortAmountDown } from "react-icons/fa";
import { FolderSidebarProps } from "@/types/folderTypes";
import useFilteredData from "@/hooks/useFilteredData";
import { callApi } from "@/lib/callApi";
import { useRouter } from "next/navigation";

import { sortbyForFolder } from "@/lib/sortBy";
import { Folder } from "@/types/folderTypes";
import AddFolder from "../component/sidebar-buttons/AddFolder";

const Sidebar = ({ folders, updateFolders }: FolderSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  const router = useRouter();

  // custom hook for searching for specific folder only calls when search query changes
  useFilteredData(folders, updateFolders, searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (folderName: string) => {
    await callApi(folderName, "folder");
    router.refresh();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFolderName(e.target.value);
  };

  const handleSort = (method: any) => {
    const sorted = method.value(folders);
    updateFolders(sorted);
  };

  return (
    <Box
      className="fixed left-0 top-0 h-full transition-all ease-in-out duration-300"
      style={{ width: "150px", backgroundColor: "#2C2F33" }}
    >
      <Flex
        direction="column"
        className="p-4"
        gap="8"
        style={{ alignItems: "center" }}
      >
        {/* Search Input */}
        <TextField.Root className="w-full">
          <TextField.Slot className="text-white">
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
          <TextField.Input
            placeholder="Search..."
            onChange={handleSearchChange}
            className="bg-gray-700 text-white rounded"
          />
        </TextField.Root>
        {/* Add folder modal */}
        <AddFolder folders={folders} />
        {/* <Flex className="justify-center items-center">
          <Popover.Root>
            <Popover.Trigger asChild>
              <Flex className="justify-center items-center">
                <IconButton
                  className="hover:bg-gray-700"
                  style={{ backgroundColor: "#2C2F33" }}
                  onClick={openIsFolderModal}
                >
                  <FaFolderPlus
                    style={{
                      width: "24px",
                      height: "24px",
                      color: "white",
                    }}
                  />
                </IconButton>
              </Flex>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                style={{ backgroundColor: "#2C2F33", padding: "16px" }}
              >
                <TextField.Root className="w-full">
                  <TextField.Input placeholder="New Folder Name" />
                </TextField.Root>
                <Button>Submit</Button>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </Flex> */}
        {/* Sorting Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <IconButton
              className="hover:bg-gray-700"
              style={{ backgroundColor: "#2C2F33" }}
            >
              <FaSortAmountDown
                style={{ width: "24px", height: "24px", color: "white" }}
              />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content>
              {sortbyForFolder.map((method, index) => (
                <DropdownMenu.Item
                  onSelect={() => handleSort(method.value)}
                  key={index}
                >
                  {method.name}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <Box className="flex-grow"></Box>
        <IconButton
          className="hover:bg-gray-700"
          style={{ backgroundColor: "#2C2F33" }}
        >
          <FaCog style={{ width: "24px", height: "24px", color: "white" }} />
        </IconButton>
        <Box className="flex-grow"></Box> {/* Spacer */}
        {/* Settings Icon */}
        <IconButton
          className="hover:bg-gray-700"
          style={{ backgroundColor: "#2C2F33" }}
        >
          <FaCog style={{ width: "24px", height: "24px", color: "white" }} />
        </IconButton>
      </Flex>
    </Box>
  );
};

export default Sidebar;
