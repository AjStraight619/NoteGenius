"use client";
import { useFileContext } from "@/app/contexts/FileSelectionProvider";
import LoadingDots from "@/components/loading/LoadingDots";
import FileSelection from "@/components/process-files/FileSelection";
import { AssistantAvatar, UserAvatar } from "@/components/ui/Avatars";
import useMathResponse, { MathResponseProps } from "@/hooks/useMathResponse";
import {
  ChatWithMessages,
  FolderWithFiles,
  Link,
  UIFile,
} from "@/types/otherTypes";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Box, Flex, IconButton, ScrollArea, Text } from "@radix-ui/themes";
import { Message } from "ai";
import { useChat } from "ai/react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import AddFolder from "../utility-buttons/AddFolder";
import StackButtonDialog from "../views/StackButtonDialog";
import "./styles.css";

export type GPTInitialMessage = {
  answer: string;
  steps: string;
};

type ChatsProps = {
  selectedChatId: string | undefined;
  selectedFolder: FolderWithFiles | undefined;
  setSelectedFolder: React.Dispatch<
    React.SetStateAction<FolderWithFiles | undefined>
  >;
  initialMessages: ChatWithMessages | undefined;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  addOptimisticFiles: (newFile: UIFile) => void;

  folders: FolderWithFiles[] | undefined;
  optimisticFiles: UIFile[] | undefined;

  links: Link[] | undefined;
  chats: ChatWithMessages[] | undefined;
};

const SCROLL_THRESHOLD = 100;

function adjustTextAreaHeight(textArea: any) {
  const maxHeight = window.innerHeight * 0.25;
  textArea.style.height = "auto";
  textArea.style.height = Math.min(textArea.scrollHeight, maxHeight) + "px";

  if (textArea.value.trim() === "") {
    textArea.style.height = "";
  }
}

export default function Chats({
  selectedChatId,
  selectedFolder,
  setSelectedFolder,
  initialMessages,
  isProcessing,
  setIsProcessing,
  folders,
  addOptimisticFiles,
  optimisticFiles,
  links,
  chats,
}: ChatsProps) {
  const { data: session } = useSession();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [mathEquations, setMathEquations] = useState<MathResponseProps>({
    equations: [],
  });

  useEffect(() => {
    if (isAutoScrollEnabled && scrollContainerRef.current) {
      const { scrollHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTop = scrollHeight;
    }
  }, [isAutoScrollEnabled]);

  const currentLink = useMemo(() => {
    return links?.find((link) => link.fileId === selectedChatId);
  }, [links, selectedChatId]);

  const { dispatch, state } = useFileContext();

  const { mathState, mathDispatch, mathResponse, isLoadingMath } =
    useMathResponse();

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    stop,
    isLoading,
  } = useChat({
    api: "api/chat",
    id: selectedChatId,

    onFinish: async () => {
      const messageData = {
        chatId: selectedChatId,
        newMessages: messagesRef.current,
      };

      try {
        const res = await fetch(`/api/users-chats`, {
          method: "PUT",
          body: JSON.stringify(messageData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Failed to update messages in chat:", await res.json());
        } else {
          console.log("Chat messages updated successfully:", await res.json());
        }
      } catch (error) {
        console.error("An error occurred while updating chat messages:", error);
      }
    },
  });

  const messagesRef = useRef<Message[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
    console.log("Message in the message ref", messagesRef.current[0]);
  }, [messages]);

  useEffect(() => {
    return () => {
      stop();
      setMessages([]);
    };
  }, [selectedChatId, stop, setMessages]);

  console.log("initial messages", initialMessages);

  const displayMessages = useMemo(() => {
    return [...(initialMessages?.chatMessages || []), ...messages];
  }, [initialMessages, messages]);

  useEffect(() => {
    console.log("These are the display messages", displayMessages);
  }, [displayMessages]);

  // const { data, isError } = useData(
  //   `api/users-chats?chatId=${selectedChatId}`,
  //   {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );

  // useEffect(() => {
  //   if (data) {
  //     console.log("data", data);
  //     const { chatMessages } = data.chat;
  //     console.log("chatMessages", chatMessages);

  //   }
  // }, [data, setMessages]);

  useEffect(() => {
    if (isAutoScrollEnabled && scrollContainerRef.current) {
      const { scrollHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTop = scrollHeight;
    }
  }, [isAutoScrollEnabled, displayMessages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isLoading) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleTextAreaChange = (e: any) => {
    adjustTextAreaHeight(e.target);
    handleInputChange(e);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // Check if the user is within the threshold from the bottom
    if (distanceFromBottom <= SCROLL_THRESHOLD) {
      setIsAutoScrollEnabled(true);
    } else {
      setIsAutoScrollEnabled(false);
    }
  };

  return (
    <ScrollArea
      type="always"
      scrollbars="vertical"
      ref={scrollContainerRef}
      className="md:scroll-auto"
      onScroll={handleScroll}
      style={{ height: "100vh" }}
    >
      <div className="flex flex-col">
        {currentLink && (
          <div className="w-full p-4 my-4">
            <Flex justify={"center"} align={"center"}>
              <Box className="p-4 border border-gray-3 rounded-lg overflow-auto bg-gray-5">
                <Text size={"2"} className="break-words whitespace-pre-wrap">
                  {currentLink?.file?.content}
                </Text>
              </Box>
            </Flex>
          </div>
        )}
        <div className="w-full flex justify-center pt-6 pb-20">
          <div className="max-w-[700px] w-full">
            <ul className="space-y-4">
              {displayMessages
                .filter((msg) => msg.role !== "system")
                .map((msg) => (
                  <li key={msg.id} className="flex flex-col items-start py-5">
                    <div className="flex gap-3 whitespace-pre-line">
                      {msg.role === "user" ? (
                        <UserAvatar name={session?.user?.name} />
                      ) : (
                        <AssistantAvatar />
                      )}
                      <Text size={"2"}>{msg.content}</Text>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="absolute bottom-0 w-full pt-8 md:pt-0 border-t md:border-t-0">
          <div className="flex justify-center items-center ml-2">
            <div className="flex gap-2 mr-4">
              <AddFolder folders={folders} />

              <StackButtonDialog
                folders={folders}
                isProcessing={isProcessing}
                addOptimisticFiles={addOptimisticFiles}
                optimisticFiles={optimisticFiles}
                dispatch={dispatch}
                setSelectedFolder={setSelectedFolder || undefined}
                selectedFolder={selectedFolder}
                chats={chats}
                setIsProcessing={setIsProcessing}
              />
            </div>

            <form
              className="items-stretch mx-2 flex flex-row last:mb-2 md:mx-4 md:last:mb-6 lg:max-w-2xl xl:max-w-3xl flex-1 "
              onSubmit={handleSubmit}
            >
              <div className="relative flex h-full flex-1 items-stretch md:flex-col">
                <div className="flex w-full items-center focus:ring-2">
                  <textarea
                    style={{
                      backgroundColor: "#1A1A1A",
                      maxHeight: "200px",
                      height: "65px",
                      overflowY: "hidden",
                      paddingLeft: "2.5rem",
                    }}
                    rows={1}
                    placeholder="Message Note Genius..."
                    className="shadow-md max-h-1/4-screen overflow-y-hidden w-full resize-none m-0 border-0 py-2 pr-10 md:py-4 dark:bg-transparent md:pr-12 bg-[#1A1A1A] text-[#b9b9c2] placeholder-[#8e8ea0] rounded-3 focus:ring-2 focus:ring-indigo-5 focus:outline-none text-base leading-6 "
                    value={input}
                    onChange={handleTextAreaChange}
                    onInput={handleTextAreaChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                  />

                  {!isLoading ? (
                    <IconButton
                      radius="medium"
                      variant="solid"
                      type="submit"
                      className="right-2 bottom-4 absolute text-4 hover:cursor-pointer"
                      disabled={isLoading}
                    >
                      <PaperPlaneIcon />
                    </IconButton>
                  ) : (
                    <LoadingDots className="right-2 bottom-4 absolute" />
                  )}
                  <FileSelection className="left-2 bottom-5 absolute" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
