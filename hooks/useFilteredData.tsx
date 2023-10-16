import { Note } from "@/types/noteTypes";
import { Folder } from "@prisma/client";
import { useEffect, useRef } from "react";

export default function useFilteredData(
  initialData: Folder[] | Note[] | null | undefined,
  updateDataInParent: any,
  searchTerm: string
) {
  // Keep a reference to initial data
  const initialDataRef = useRef(initialData);

  useEffect(() => {
    if (!initialDataRef.current) {
      return;
    }

    if (searchTerm === "") {
      console.log("updateDataInParent is: ", updateDataInParent);
      updateDataInParent(initialDataRef.current);
      return;
    }

    const filteredData = initialDataRef.current.filter(
      (item: any) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    updateDataInParent(filteredData);
  }, [searchTerm, updateDataInParent]); // Removed initialData and updateDataInParent from dependencies
}
