import { Folder } from "./folderTypes";
import { Note } from "./noteTypes";

export function isFolderArray(arr: any[]): arr is Folder[] {
  return arr.every((item) => typeof item === "object" && "folderId" in item);
}

export function isNoteArray(arr: any[]): arr is Note[] {
  return arr.every((item) => typeof item === "object" && "noteId" in item);
}
