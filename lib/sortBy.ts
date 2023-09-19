import { SortableItem } from "@/types/otherTypes";
import type { Note, RefinedNote, Tag } from "@prisma/client";
import { Folder } from "@/types/folderTypes";

export const sortByAZ = (items: SortableItem[]): SortableItem[] => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
};

export const sortByZA = (items: SortableItem[]): SortableItem[] => {
  return items.sort((a, b) => b.name.localeCompare(a.name));
};

export const sortByRefined = (items: Note[]): Note[] => {
  return items.sort((a, b) => {
    if (a.isRefined && !b.isRefined) {
      return -1;
    }
    if (!a.isRefined && b.isRefined) {
      return 1;
    }
    return 0;
  });
};

export const sortByNotRefined = (items: Note[]): Note[] => {
  return items.sort((a, b) => {
    if (a.isRefined && !b.isRefined) {
      return 1;
    }
    if (!a.isRefined && b.isRefined) {
      return -1;
    }
    return 0;
  });
};

// export const sortByTags = (folders: Folder[], tags: string[]): Folder[] => {
//   return folders.sort((a, b) => {
//     for (const tag of tags) {
//       const aHasTag = a.tags.includes(tag);
//       const bHasTag = b.tags.includes(tag);

//       if (aHasTag && !bHasTag) return -1;
//       if (!aHasTag && bHasTag) return 1;
//     }

//     return 0;
//   });
// };

export const excludeRefined = (items: Note[]): Note[] => {
  return items.filter((item) => !item.isRefined);
};

export const includeOnlyRefined = (items: Note[]): Note[] => {
  return items.filter((item) => item.isRefined);
};

export const sortbyForFolder = [
  { name: "Sort from A-Z", value: sortByAZ },
  { name: "Sort from Z-A", value: sortByZA },
];
