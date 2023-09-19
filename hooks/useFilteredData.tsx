import { useEffect, useRef } from "react";
import { Folder } from "@/types/folderTypes";
import { Note } from "@/types/noteTypes";

export default function useFilteredData(
  initialData: Folder[] | Note[] | null | undefined,
  updateDataInParent: any,
  searchTerm: string
) {
  // Keep a reference to initial data
  const initialDataRef = useRef(initialData);

  useEffect(() => {
    if (!initialDataRef.current) {
      console.log("Initial data is not available");
      return;
    }

    if (searchTerm === "") {
      console.log("No search term");
      updateDataInParent(initialDataRef.current);
      return;
    }

    const filteredData = initialDataRef.current.filter(
      (item: any) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    updateDataInParent(filteredData);
  }, [searchTerm]); // Removed initialData and updateDataInParent from dependencies
}
