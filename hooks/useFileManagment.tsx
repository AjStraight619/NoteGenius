import { FolderWithFiles } from "@/types/otherTypes";
import { useReducer } from "react";

type FolderState = {
  files: FolderWithFiles[];
  processing: boolean;
  error: string | null;
};

const initialState: FolderState = {
  files: [],
  processing: false,
  error: null,
};

type FileActions =
  | { type: "ADD_FILE"; payload: FolderWithFiles }
  | { type: "REMOVE_FILE"; payload: { id: string } }
  | { type: "UPDATE_FILE"; payload: FolderWithFiles };

function fileReducer(state: FolderState, action: FileActions): FolderState {
  switch (action.type) {
    case "ADD_FILE":
      return { ...state, files: [...state.files, action.payload] };
    case "REMOVE_FILE":
      return {
        ...state,
        files: state.files.filter((file) => file.id !== action.payload.id),
      };
    case "UPDATE_FILE":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.id ? action.payload : file
        ),
      };
    default:
      return state;
  }
}

export function useFileManagement() {
  const [state, dispatch] = useReducer(fileReducer, initialState);

  return { state, dispatch };
}
