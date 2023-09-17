"use client";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaFolderPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

const AddFolder = () => {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleAddFolder = async () => {
    console.log(folderName);
    const res = await fetch(`/api/add-folder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: folderName }),
      cache: "no-store",
    });
    if (res.ok) {
      alert("Successfully added folder!");
    }

    setClicked(false);
    router.refresh();
  };

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <div className="relative h-32 w-32">
      <div className="absolute top-0 right-0 h-16 w-16">
        <Popover>
          <PopoverTrigger onClick={handleClick}>
            <FaFolderPlus size={50} style={{ cursor: "pointer" }} />
          </PopoverTrigger>
          <PopoverContent>
            {clicked && (
              <div>
                <input
                  type="text"
                  placeholder="Folder Name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                />
                <button onClick={handleAddFolder}>Add Folder</button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default AddFolder;
