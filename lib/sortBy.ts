import { SortableItem } from "@/types/otherTypes";
import type { Note, RefinedNote, Tag } from "@prisma/client";
import { Folder } from "@prisma/client";

export const sortByAz = (items: SortableItem[]): SortableItem[] => {
  if (!Array.isArray(items)) {
    throw new Error("Expected an array of items to sort!");
  }
  return items.sort((a, b) => a.name.localeCompare(b.name));
};

export const sortByZa = (items: SortableItem[]): SortableItem[] => {
  if (!Array.isArray(items)) {
    throw new Error("Expected an array of items to sort!");
  }
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

// export const sortByData = (folders: Folder[], data:

export const excludeRefined = (items: Note[]): Note[] => {
  return items.filter((item) => !item.isRefined);
};

export const includeOnlyRefined = (items: Note[]): Note[] => {
  return items.filter((item) => item.isRefined);
};

export const sortByFirstCreated = (items: SortableItem[]): SortableItem[] => {
  return items.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
};

export const sortByLastCreated = (items: SortableItem[]): SortableItem[] => {
  return items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};
