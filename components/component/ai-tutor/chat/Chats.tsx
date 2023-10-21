"use client";
import LoadingDots from "@/components/loading/LoadingDots";
import {
  ChatWithMessages,
  FileAction,
  FolderWithFiles,
  UIFile,
} from "@/types/otherTypes";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import {
  Avatar,
  Box,
  Flex,
  Grid,
  IconButton,
  ScrollArea,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { Message, useChat } from "ai/react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConvertFileToText } from "../add-file/ConvertFileContentToText";
import "./styles.css";

type ChatsProps = {
  selectedChatId: string | undefined;
  initialMessages: ChatWithMessages | undefined;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  addOptimisticFiles: (newFile: UIFile) => void;
  state: UIFile[] | undefined;
  dispatch: React.Dispatch<FileAction>;
  folders: FolderWithFiles[] | undefined;
};

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
  initialMessages,
  isProcessing,
  setIsProcessing,
  folders,
  state,
  dispatch,
}: ChatsProps) {
  const { data: session } = useSession();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  useEffect(() => {
    if (isAutoScrollEnabled && scrollContainerRef.current) {
      const { scrollHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTop = scrollHeight;
    }
  }, [isAutoScrollEnabled]);

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
  }, [messages]);

  useEffect(() => {
    console.log("component is re rendering");
  }, [input]);

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
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [displayMessages]);

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
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

    setIsAutoScrollEnabled(isAtBottom);
  };

  return (
    <>
      <Grid style={{ height: "100vh" }}>
        <ScrollArea
          type="always"
          scrollbars="vertical"
          ref={scrollContainerRef}
          className="md:scroll-auto"
          onScroll={handleScroll}
        >
          <ul className="w-full pb-12 mb-4 pr-3">
            {displayMessages
              .filter((msg) => msg.role !== "system")
              .map((msg) => (
                <li
                  key={msg.id}
                  className={`w-full ${
                    msg.role === "assistant" ? "bg-gray-3" : "bg-gray-1"
                  }`}
                >
                  <Flex justify={"center"} align={"center"}>
                    <Box className="w-1/3 py-5">
                      <Flex
                        direction="row"
                        justify="start"
                        align="start"
                        className="whitespace-pre-line"
                        gap="5"
                      >
                        <Avatar
                          radius="small"
                          variant="solid"
                          size={"2"}
                          color={msg.role === "user" ? "teal" : "indigo"}
                          fallback={
                            <Text>
                              {msg.role === "user"
                                ? session?.user?.name?.charAt(0) || "U"
                                : "N"}
                            </Text>
                          }
                        />
                        <Text size={"2"}>{msg.content}</Text>
                      </Flex>
                    </Box>
                  </Flex>
                </li>
              ))}
          </ul>
        </ScrollArea>
        <Flex
          justify={"center"}
          bottom={"0"}
          width={"100%"}
          position={"absolute"}
        >
          <Box className="w-1/3 relative">
            <form onSubmit={handleSubmit}>
              <div className="container">
                <TextArea
                  style={{
                    backgroundColor: "#1A1A1A",
                    paddingLeft: "3rem",
                    paddingTop: "1rem",
                    fontSize: "0.9rem",
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

            <ConvertFileToText
              folders={folders}
              setIsProcessing={setIsProcessing}
              isProcessing={isProcessing}
              files={state}
              dispatch={dispatch}
            />
          </Box>
        </Flex>
      </Grid>
    </>
  );
}
