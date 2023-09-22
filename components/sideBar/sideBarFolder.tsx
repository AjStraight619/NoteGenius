"use client";

import { useState } from "react";
import { Box, Flex, IconButton, TextField } from "@radix-ui/themes";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { FaCog, FaSortAmountDown } from "react-icons/fa";
import { FolderSidebarProps } from "@/types/folderTypes";

import { callApi } from "@/lib/callApi";
import { useRouter } from "next/navigation";

import AddFolder from "../component/sidebar-buttons/AddFolder";
import UploadButton from "../component/sidebar-buttons/UploadButton";
import SearchFolders from "../component/search/SearchFolders";
import SortingButton from "../component/sidebar-buttons/SortingButton";

const Sidebar = ({ folders, updateFolders }: FolderSidebarProps) => {
  // const [searchQuery, setSearchQuery] = useState("");
  // const [newFolderName, setNewFolderName] = useState("");
  // const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  console.log("Folders in SideBar", folders);

  const router = useRouter();

  // custom hook for searching for specific folder only calls when search query changes
  // useFilteredData(folders, updateFolders, searchQuery);

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchQuery(e.target.value);
  // };

  const handleSubmit = async (folderName: string) => {
    await callApi(folderName, "folder");
    router.refresh();
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setNewFolderName(e.target.value);
  // };

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
        <SearchFolders folders={folders} updateFolders={updateFolders} />
        {/* Add folder modal */}
        <AddFolder folders={folders} />
        <UploadButton folders={folders} />
        <SortingButton folders={folders} updateFolders={updateFolders} />
        {/* <DropdownMenu.Root>
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
        </DropdownMenu.Root> */}
        <DropdownMenu.Root>Hello</DropdownMenu.Root>
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
