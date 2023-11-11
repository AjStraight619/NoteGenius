"use client";
import { useChatSelection } from "@/hooks/useChatSelection";
import { ChatWithMessages } from "@/types/otherTypes"; // Adjust the import path as needed
import React, { ReactNode, createContext, useContext } from "react";

// Define the shape of the context data using type
type ChatSelectionContextType = {
  selectedChat: ChatWithMessages | undefined;
  selectChat: (chatId: string | undefined) => void;
};

// Provide a default value
const defaultContextValue: ChatSelectionContextType = {
  selectedChat: undefined,
  selectChat: () => {},
};

// Create the context with the default value
const ChatSelectionContext =
  createContext<ChatSelectionContextType>(defaultContextValue);

// Define the props for ChatSelectionProvider
type ChatSelectionProviderProps = {
  children: ReactNode;
  chats: ChatWithMessages[] | undefined;
  initialChat: ChatWithMessages | undefined;
};

export const ChatSelectionProvider: React.FC<ChatSelectionProviderProps> = ({
  children,
  chats,
  initialChat,
}) => {
  const { selectedChat, selectChat } = useChatSelection(chats, initialChat);

  return (
    <ChatSelectionContext.Provider value={{ selectedChat, selectChat }}>
      {children}
    </ChatSelectionContext.Provider>
  );
};

export const useChatSelectionContext = () => useContext(ChatSelectionContext);
