"use client";
import LoadingDots from "@/components/loading/LoadingDots";
import { ChatWithMessages } from "@/types/otherTypes";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import {
  Avatar,
  Box,
  Flex,
  IconButton,
  ScrollArea,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { Message, useChat } from "ai/react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef } from "react";
import { AddFileDialog } from "../ai-tutor/add-file/AddFIleDIalog";

type ChatsProps = {
  selectedChatId: string | undefined;
  initialMessages: ChatWithMessages | undefined;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  addOptimisticFiles: (filename: string) => void;
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
  addOptimisticFiles,
}: ChatsProps) {
  const { data: session } = useSession();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleTextAreaChange = (e: any) => {
    adjustTextAreaHeight(e.target);
    handleInputChange(e);
  };

  return (
    <>
      <Flex justify={"center"} align={"center"} direction={"column"}>
        <ScrollArea
          type="always"
          scrollbars="vertical"
          ref={scrollContainerRef}
          className="pb-20 md:scroll-auto"
        >
          <ul className="w-full">
            {displayMessages
              .filter((msg) => msg.role !== "system")
              .map((msg) => (
                <li
                  key={msg.id}
                  className="w-full"
                  style={{
                    backgroundColor:
                      msg.role === "assistant" ? "#FFFFFF09" : "",
                  }}
                >
                  <Flex justify="center" width={"100%"}>
                    <Box className="w-[800px] p-5">
                      <Flex
                        direction="row"
                        justify="start"
                        align="start"
                        className="whitespace-pre-line"
                      >
                        <Avatar
                          radius="medium"
                          variant="solid"
                          fallback={
                            <Text>
                              {msg.role === "user"
                                ? session?.user?.name?.charAt(0) || "U"
                                : "N"}
                            </Text>
                          }
                        />
                        <Text className="pl-6" size={"2"}>
                          {msg.content}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </li>
              ))}
          </ul>
        </ScrollArea>
        <Flex
          justify={"center"}
          align={"center"}
          position={"fixed"}
          bottom={"0"}
          width={"100%"}
        >
          <Box position={"relative"} className="w-1/3">
            <form onSubmit={handleSubmit}>
              <TextArea
                style={{
                  backgroundColor: "#1A1A1A",
                  paddingLeft: "3rem",
                  paddingTop: "1rem",
                }}
                variant="classic"
                mb={"2"}
                placeholder="Type your message here"
                className="shadow-md max-h-1/4-screen overflow-y-auto z-10"
                size={"1"}
                value={input}
                onChange={handleTextAreaChange}
                onInput={handleTextAreaChange}
                onKeyDown={handleKeyDown}
              />

              {!isLoading ? (
                <IconButton
                  radius="medium"
                  variant="solid"
                  type="submit"
                  className="right-2 bottom-4 absolute"
                  disabled={isLoading}
                >
                  <PaperPlaneIcon />
                </IconButton>
              ) : (
                <LoadingDots className="right-2 bottom-4 absolute" />
              )}
            </form>
            <AddFileDialog
              setIsProcessing={setIsProcessing}
              isProcessing={isProcessing}
              addOptimisticFiles={addOptimisticFiles}
            />
          </Box>
        </Flex>
      </Flex>
    </>
  );
}