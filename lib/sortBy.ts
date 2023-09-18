import { SortableItem } from "@/types/otherTypes";
import type { Folder, Note, RefinedNote } from "@prisma/client";

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

export const excludeRefined = (items: Note[]): Note[] => {
  return items.filter((item) => !item.isRefined);
};

export const includeOnlyRefined = (items: Note[]): Note[] => {
  return items.filter((item) => item.isRefined);
};
