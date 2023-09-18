"use client";
import { useState } from "react";
import Link from "next/link";
import { FaFolder } from "react-icons/fa";
import FolderSideBar from "./SideBar";
import { Folder, FolderPageClientProps } from "@/types/folderTypes";

export default function FolderPageClient({
  foldersToDisplay,
}: FolderPageClientProps) {
  const [folders, setFolders] = useState(foldersToDisplay);

  const updateFolders = (newFolders: Folder[]) => {
    setFolders(newFolders);
  };

  return (
    <div className="flex justify-between mt-16">
      {/* Main Content */}
      <div className="w-3/4">
        <div className="flex flex-wrap mt-4">
          {folders ? (
            folders.map((folder: Folder) => (
              <div
                key={folder.id}
                className="p-2 flex flex-col items-center w-full sm:w-1/2 md:w-1/4 lg:w-1/5"
              >
                <div className="flex flex-col items-center">
                  <FaFolder size={64} />
                  <div
                    className="w-20 text-center break-words"
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
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No folders available</div>
          )}
        </div>
      </div>
      {/* Sidebar */}
      <div className="w-1/4">
        <FolderSideBar
          folders={foldersToDisplay}
          updateFolders={updateFolders}
        />
      </div>
    </div>
  );
}
