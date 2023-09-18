"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaFolder } from "react-icons/fa";
import FolderSideBar from "./SideBar";

export default function FolderPageClient({ foldersToDisplay }: any) {
  const [folders, setFolders] = useState(foldersToDisplay);

  const updateFolders = (newFolders: any) => {
    setFolders(newFolders);
  };

  return (
    <div className="flex justify-between mt-16">
      {/* Main Content */}
      <div className="w-3/4">
        <div className="flex flex-wrap gap-4 mt-4 items-start justify-start">
          {folders ? (
            folders.map((folder: any) => (
              <div
                key={folder.id}
                className="p-2 min-w-[50%] md:min-w-0 md:w-auto"
              >
                <Link href={`/folders/notes/${folder.id}`}>
                  <FaFolder size={32} />
                  <div>{folder.name}</div>
                </Link>
              </div>
            ))
          ) : (
            <div>No folders available</div>
          )}
          <div>
            <FolderSideBar folders={folders} updateFolders={updateFolders} />
          </div>
        </div>
      </div>
    </div>
  );
}
