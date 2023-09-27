"use client";
import { useState } from "react";
import { FaFolder } from "react-icons/fa";
// import { Folder, FolderPageClientProps } from "@/types/folderTypes";
import { Folder } from "@prisma/client";
import Sidebar from "@/components/sideBar/sideBarFolder";
import SplitScreen from "./split-screen/SplitScreen"; // Import the SplitScreen component
import Error from "next/error";

import { Card, Box, Flex, Container, Section } from "@radix-ui/themes";
import MyDropzone from "../upload/upload";

export default function FolderPageClient({
  foldersToDisplay,
}: {
  foldersToDisplay: Folder[] | null;
}) {
  const [folders, setFolders] = useState(foldersToDisplay);
  const [isSplitView, setIsSplitView] = useState(false);

  const updateFolders = (newFolders: Folder[]) => {
    setFolders(newFolders);
  };

  const toggleSplitView = () => {
    setIsSplitView(!isSplitView);
  };

  return (
    <Section size="3" mx={"6"}>
      <Flex className="justify-between flex-wrap">
        {isSplitView ? (
          // Render the SplitScreen component when isSplitView is true
          <SplitScreen folders={folders} updateFolders={updateFolders} />
        ) : (
          // Render the standard grid view when isSplitView is false
          <>
            {/* Main Content */}
            <Box className="md:w-3/4 w-full ml-[150px]">
              <Flex className="flex-wrap gap-8 mt-4">
                {folders ? (
                  folders.map((folder) => (
                    <MyDropzone key={folder.id} folderId={folder.id}>
                      <Card
                        key={folder.id}
                        className="p-4 flex flex-col items-center rounded bg-gray-800 text-white transition-all duration-300 ease-in-out cursor-pointer hover:bg-opacity-70 hover:bg-white hover:shadow-lg hover:scale-105"
                      >
                        <FaFolder size={64} />
                        <Box
                          className="w-20 text-center mt-2"
                          style={{
                            whiteSpace: "normal",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {folder.name}
                        </Box>
                      </Card>
                    </MyDropzone>
                  ))
                ) : (
                  <Box className="col-span-full text-center text-gray-400">
                    No folders available
                  </Box>
                )}
              </Flex>
            </Box>

            {/* Sidebar */}
            <Box
              className="md:w-1/4 w-full bg-gray-900 text-white p-4"
              style={{ zIndex: 0 }}
            >
              <Sidebar folders={folders} updateFolders={updateFolders} />
            </Box>
          </>
        )}
      </Flex>
    </Section>
  );
}
