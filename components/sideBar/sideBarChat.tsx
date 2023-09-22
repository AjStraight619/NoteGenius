"use client";
import { useState } from "react";
import { Box, Flex, IconButton, Button, TextField } from "@radix-ui/themes";
import {
  PaperPlaneIcon,
  ExitIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { FaCog } from "react-icons/fa";
import useFilteredData from "@/hooks/useFilteredData";

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-700 text-white rounded"
          />
        </TextField.Root>
        {/* View Chats Button and Plus Icon */}
        <Flex className="w-full justify-center items-center">
          <Button
            className="hover:bg-gray-700"
            style={{
              width: "75%",
              backgroundColor: "#2C2F33",
              border: "1px solid lightgray",
            }}
          >
            View Chats
          </Button>
          <IconButton
            className="hover:bg-gray-700"
            style={{ backgroundColor: "#2C2F33", marginLeft: "8px" }}
          >
            <PlusIcon
              style={{ width: "24px", height: "24px", fill: "white" }}
            />
          </IconButton>
        </Flex>
        {/* Other Icons */}
        <IconButton
          className="hover:bg-gray-700"
          style={{ backgroundColor: "#2C2F33" }}
        >
          <PaperPlaneIcon
            style={{ width: "24px", height: "24px", fill: "white" }}
          />
        </IconButton>
        <IconButton
          className="hover:bg-gray-700"
          style={{ backgroundColor: "#2C2F33" }}
        >
          <ExitIcon style={{ width: "24px", height: "24px", fill: "white" }} />
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
