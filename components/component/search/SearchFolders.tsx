"use client";
import useFilteredData from "@/hooks/useFilteredData";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";
import { useState } from "react";

export default function SearchFolders({ folders, updateFolders }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  useFilteredData(folders, updateFolders, searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <TextField.Root className="w-full">
      <TextField.Slot className="text-white">
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
      <TextField.Input
        radius="medium"
        placeholder="Search..."
        onChange={handleSearchChange}
        className="bg-gray-700 text-white rounded"
      />
    </TextField.Root>
  );
}
