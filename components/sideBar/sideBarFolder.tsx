"use client";
import { useState } from "react";
import { Box, Flex, IconButton } from "@radix-ui/themes";
import { FaCog, FaBars } from "react-icons/fa";

import AddFolder from "../component/sidebar-buttons/AddFolder";
import UploadButton from "../component/sidebar-buttons/UploadButton";
import SearchFolders from "../component/search/SearchFolders";
import SortingButton from "../component/sidebar-buttons/SortingButton";

import { Folder } from "@prisma/client";
type FolderSidebarProps = {
  folders?: Folder[] | null;
  updateFolders?: any;
};

const Sidebar = ({ folders, updateFolders }: FolderSidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state
  return (
    <>
      {/* The fixed position container for the toggle button */}
      <div
        className="fixed top-4 z-50 transition-transform duration-300"
        style={{
          left: isSidebarOpen ? "60px" : "36px", // Adjust these values for the exact position
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <IconButton
          style={{ backgroundColor: "transparent" }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FaBars style={{ width: "32px", height: "32px", color: "white" }} />
        </IconButton>
      </div>

      {/* Sidebar */}
      <Box
        className="fixed left-0 top-0 h-full flex flex-col justify-between transition-all ease-in-out duration-300 overflow-hidden"
        style={{
          width: isSidebarOpen ? "150px" : "0px",
          backgroundColor: "#2C2F33",
          transition: "width 0.3s",
        }}
      >
        <Flex
          direction="column"
          className="p-4"
          gap="9"
          style={{ alignItems: "center" }}
        >
          {isSidebarOpen && (
            <>
              <div className="mb-4 mt-24">
                <SearchFolders
                  folders={folders}
                  updateFolders={updateFolders}
                />
              </div>
              <div className="mb-4">
                <AddFolder folders={folders} />
              </div>
              <div className="mb-4">
                <UploadButton folders={folders} />
              </div>
              <div className="mb-4">
                <SortingButton
                  folders={folders}
                  updateFolders={updateFolders}
                />
              </div>
            </>
          )}
        </Flex>

        {isSidebarOpen && (
          <IconButton
            style={{
              backgroundColor: "#2C2F33",
              alignSelf: "center",
              marginBottom: "20px",
            }}
          >
            <FaCog style={{ width: "32px", height: "32px", color: "white" }} />
          </IconButton>
        )}
      </Box>
    </>
  );
};

export default Sidebar;
