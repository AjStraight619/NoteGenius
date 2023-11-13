"use client";
import { FileAction, FileState } from "@/types/otherTypes";
import React, { createContext, useContext, useReducer } from "react";

// Define the shape of the context data
type FileContextType = {
  state: FileState;
  dispatch: React.Dispatch<FileAction>;
};

// Provide a default value
const defaultContextValue: FileContextType = {
  state: {
    files: [],
    processing: false,
    links: [],
  },
  dispatch: () => {},
};

// Create the context with the default value
const FileContext = createContext<FileContextType>(defaultContextValue);

// Define the props for FileProvider
type FileProviderProps = {
  children: React.ReactNode;
};

function reducer(state: FileState, action: FileAction): FileState {
  switch (action.type) {
    case "ADD_FILE":
      return {
        ...state,
        files: [...state.files, ...action.payload],
      };
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
    case "ADD_LINK":
      return {
        ...state,
        links: [...(state.links || []), ...action.payload],
      };
    case "REMOVE_LINK":
      return {
        ...state,
        links: state?.links?.filter(
          (link) =>
            link.chatId !== action.payload.chatId ||
            link.fileId !== action.payload.fileId
        ),
      };
    case "UPDATE_LINK":
      return {
        ...state,
        links: state?.links?.map((link) =>
          link.chatId === action.payload.oldLink.chatId &&
          link.fileId === action.payload.oldLink.fileId
            ? action.payload.newLink
            : link
        ),
      };
    case "PROCESSING_FILE":
      return {
        ...state,
        processing: action.payload,
      };
    // Other cases as needed...
    default:
      return state;
  }
}

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
  // Define the initial state
  const initialState: FileState = {
    files: [],
    processing: false,
    links: [],
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FileContext.Provider value={{ state, dispatch }}>
      {children}
    </FileContext.Provider>
  );
};

// Custom hook to use the context
export const useFileContext = () => useContext(FileContext);

// New actions for selecting and deselecting a file (commented out for now)
// case "SELECT_FILE":
//   return {
//     ...state,
//     // Add logic for selecting a file
//   };
// case "DESELECT_FILE":
//   return {
//     ...state,
//     // Add logic for deselecting a file
//   };
