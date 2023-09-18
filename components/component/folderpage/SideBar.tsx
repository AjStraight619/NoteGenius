"use client";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaSearch } from "react-icons/fa";
import FolderPageClient from "./FolderPageClient";

interface FolderSidebarProps {
  folders?: Folder[] | null;
  updateFolders: (newFolders: Folder[]) => void; // Define the prop type for the function
}

type Folder = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  // Note: the relationships like `user`, `notes`, and `refinedNotes` are omitted for simplicity
};

export default function FolderSidebar({
  folders,
  updateFolders,
}: FolderSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFolders, setFilteredFolders] = useState(folders);
  const folderRefs = useRef({});
  console.log(filteredFolders);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredFolders(folders);
      return;
    }

    const newFilteredFolders = folders?.filter((folder) =>
      folder.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFolders(newFilteredFolders);
  }, [searchTerm, folders]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
        <button className="w-full p-2 mb-2">Add Folder</button>
        <button className="w-full p-2 mb-2">Create Note</button>
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
