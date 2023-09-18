import { useEffect } from "react";
import { Folder } from "@/types/folderTypes";
import { Note } from "@/types/noteTypes";

export default function useFilteredData(
  initialData: Folder[] | Note[] | null | undefined,
  updateDataInParent: any,
  searchTerm: string
) {
  useEffect(() => {
    if (searchTerm === "") {
      updateDataInParent(initialData);
      return;
    }

    if (!initialData || initialData.length === 0) {
      updateDataInParent(null);
      return;
    }

    const newFilteredData = initialData.filter(
      (item: any) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    updateDataInParent(newFilteredData);
  }, [searchTerm, initialData, updateDataInParent]);
}
