"use client";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FaSearch } from "react-icons/fa";
import { FaFolderPlus } from "react-icons/fa";
import dynamic from "next/dynamic";
import useFilteredData from "@/hooks/useFilteredData";
import { FolderSidebarProps } from "@/types/folderTypes";
import { callApi } from "@/lib/callApi";
import { useRouter } from "next/navigation";
import * as PopoverPrimitive from "@radix-ui/react-popover";

type PopoverProps = any;
const DynamicPopover = dynamic<PopoverProps>(
  async () => {
    const { Popover } = await import("@/components/ui/popover");
    return { default: Popover };
  },
  { ssr: false }
);

// Side bar on FolderPageClient

export default function FolderSidebar({
  folders,
  updateFolders,
}: FolderSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const folderRefs = useRef({});
  const router = useRouter();

  // custom hook for searching for specific folder
  useFilteredData(folders, updateFolders, searchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (folderName: string) => {
    await callApi(folderName, "folder");
    router.refresh();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFolderName(e.target.value);
  };

  return (
    <div className="w-64 border-l border-gray-300 p-4 fixed top-0 right-0 h-screen mt-16">
      {" "}
      {/* Adjusted mt-6 to mt-16 */}
      {/* Search Bar with Icon */}
      <div className="relative">
        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search..."
          className="pl-10"
          onChange={handleSearchChange}
        />
      </div>
      <hr className="my-4" />
      {/* Add Folder and Create Note Buttons */}
      <div>
        <DynamicPopover>
          <PopoverTrigger>Add Folder</PopoverTrigger>
          <PopoverContent>
            <div className="relative">
              <Input
                value={newFolderName}
                onChange={handleChange}
                className="pr-10 w-full"
                placeholder="Name for folder..."
              />
              <PopoverPrimitive.Close>
                <button
                  className="absolute right-0 top-0 bottom-0 px-2 py-1 cursor-pointer"
                  onClick={() => handleSubmit(newFolderName)}
                >
                  <FaFolderPlus className="text-xl -mt-5" />
                </button>
              </PopoverPrimitive.Close>
            </div>
          </PopoverContent>
        </DynamicPopover>
        {/* <button className="w-full p-2 mb-2">Add Folder</button>
        <button className="w-full p-2 mb-2">Create Note</button> */}
      </div>
      <hr className="my-4" />
      {/* Sort By */}
      <div>
        <label>Sort by: </label>
        {/* <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="Name">Name</option>
          <option value="Date">Date</option>
        </select> */}
      </div>
      <hr className="my-4" />
      {/* Bulk Actions */}
      <div>
        <button className="w-full p-2 mb-2">Delete Selected</button>
      </div>
      <hr className="my-4" />
      {/* Labels / Tags */}
      <div>
        <h3>Labels/Tags</h3>
        <ul>
          <li>Work</li>
          <li>Personal</li>
          <li>Others</li>
        </ul>
      </div>
      <hr className="my-4" />
      {/* Custom Filters */}
      <div>
        <h3>Custom Filters</h3>
        <ul>
          <li>Shared with me</li>
          <li>Recently Accessed</li>
        </ul>
      </div>
      <hr className="my-4" />
      {/* Statistics */}
      <div>
        <h3>Statistics</h3>
        <p>Total Folders: 20</p>
        <p>Total Notes: 100</p>
      </div>
      {/* Account Settings, Logout */}
    </div>
  );
}
