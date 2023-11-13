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
import {
  Box,
  Flex,
  IconButton,
  ScrollArea,
  Text,
  TextArea,
} from "@radix-ui/themes";
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
    // If a math problem is specified, use the wolfram alpha response as the initial input
    initialMessages: [
      {
        id: "",
        role: "system",
        content: "", // This is where the initial input for gpt will go, it will include the iniital problem, and the necessary information from the wolfram alpha response, i.e the answer, and the steps to solve the problem
      },
    ],

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
    <Flex>
      <ScrollArea
        type="always"
        scrollbars="vertical"
        ref={scrollContainerRef}
        className="md:scroll-auto"
        onScroll={handleScroll}
        style={{ height: "100vh" }}
      >
        {currentLink && (
          <div className="w-full p-4  my-4">
            <Flex justify={"center"} align={"center"}>
              <Box className="p-4 border border-gray-3 rounded-lg overflow-auto bg-gray-5">
                <Text size={"2"} className="break-words whitespace-pre-wrap">
                  {currentLink?.file?.content}
                </Text>
              </Box>
            </Flex>
          </div>
        )}
        <ul className="w-full pb-12 mb-4 pr-3">
          {displayMessages
            .filter((msg) => msg.role !== "system")
            .map((msg) => (
              <li
                key={msg.id}
                className={`flex justify-center items-center w-full my-4  ${
                  msg.role === "assistant" ? "bg-gray-3" : "bg-gray-1"
                }`}
              >
                <Box className="w-1/2 py-5 px-4">
                  <Flex
                    direction="row"
                    justify="start"
                    align="start"
                    className="whitespace-pre-line"
                    gap="3"
                  >
                    <div
                      className="shadow-5"
                      style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                    >
                      {msg.role === "user" ? (
                        <UserAvatar name={session?.user?.name} />
                      ) : (
                        <AssistantAvatar />
                      )}
                    </div>

                    <Text size={"2"}>{msg.content}</Text>
                  </Flex>
                </Box>
              </li>
            ))}
        </ul>
      </ScrollArea>
      <Flex
        justify={"center"}
        bottom={"0"}
        width={"100%"}
        position={"absolute"}
        gap={"2"}
      >
        <Flex gap={"3"} mt={"2"} pr={"3"}>
          <AddFolder folders={folders} />

          <Box mr={"3"}>
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
          </Box>
        </Flex>

        <Box className="w-1/2 relative">
          <form onSubmit={handleSubmit}>
            <div className="container">
              <TextArea
                style={{
                  backgroundColor: "#1A1A1A",
                  paddingLeft: "2.1rem",
                  paddingTop: "1rem",
                  fontSize: "0.8rem",
                  paddingRight: "2.6rem",
                }}
                variant="classic"
                placeholder=""
                className="shadow-md max-h-1/4-screen overflow-y-auto z-10 "
                size={"1"}
                mb={"2"}
                value={input}
                onChange={handleTextAreaChange}
                onInput={handleTextAreaChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            {!isLoading ? (
              <IconButton
                radius="medium"
                variant="solid"
                type="submit"
                className="right-2 bottom-5 absolute text-4"
                disabled={isLoading}
              >
                <PaperPlaneIcon />
              </IconButton>
            ) : (
              <LoadingDots className="right-2 bottom-4 absolute" />
            )}
          </form>

          <FileSelection className="left-2 bottom-6 absolute" />
        </Box>
      </Flex>
    </Flex>
  );
}
