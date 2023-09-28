import { SortableItem } from "@/types/otherTypes";
import type { File as PrismaFile } from "@prisma/client";
import { Folder } from "@prisma/client";

type ExtendedFile = PrismaFile & {
  refinedFile?: any;
};

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

export const sortByRefined = (items: ExtendedFile[]): ExtendedFile[] => {
  return items.sort((a, b) => {
    if (a.refinedFile && !b.refinedFile) {
      return -1;
    }
    if (!a.refinedFile && b.refinedFile) {
      return 1;
    }
    return 0;
  });
};

export const sortByNotRefined = (items: ExtendedFile[]): ExtendedFile[] => {
  return items.sort((a, b) => {
    if (a.refinedFile && !b.refinedFile) {
      return 1;
    }
    if (!a.refinedFile && b.refinedFile) {
      return -1;
    }
    return 0;
  });
};

export const excludeRefined = (items: ExtendedFile[]): ExtendedFile[] => {
  return items.filter((item) => !item.refinedFile);
};

export const includeOnlyRefined = (items: ExtendedFile[]): ExtendedFile[] => {
  return items.filter((item) => item.refinedFile);
};

export const sortByFirstCreated = (items: SortableItem[]): SortableItem[] => {
  return items.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
};

export const sortByLastCreated = (items: SortableItem[]): SortableItem[] => {
  return items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};
