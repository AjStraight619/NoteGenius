"use client";
import { type Chat } from "@prisma/client";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  ScrollArea,
  TextArea,
} from "@radix-ui/themes";
import { useChat } from "ai/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
type ChatsProps = {
  selectedChatId: string | null;
  currentChat: Chat | null;
};

function adjustTextAreaHeight(textArea: any) {
  const maxHeight = window.innerHeight * 0.25;
  textArea.style.height = "auto";
  textArea.style.height = Math.min(textArea.scrollHeight, maxHeight) + "px";

  if (textArea.value.trim() === "") {
    textArea.style.height = "";
  }
}

export default function Chats({ selectedChatId, currentChatMessage }: any) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOnThisPage, setIsOnThisPage] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/users-chats?chatId=${selectedChatId}`, {
        method: "GET",
      });
      const data = await res.json();
      const { id } = data;
      console.log("This is the selected chat id", selectedChatId);
      console.log("This is the id from the data returned", data);
    }
    fetchData();
  }, [selectedChatId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleTextAreaChange = (e: any) => {
    adjustTextAreaHeight(e.target);
    handleInputChange(e); // Call handleInputChange from useChat hook
  };

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "api/chat",

    onFinish: async () => {
      const res = await fetch("/api/users-chats", {
        method: "PUT",
        body: JSON.stringify({ newMessages: messages }), // Send the updated messages array to the API
      });
      const data = await res.json();
      console.log("This is the data: ", data);
    },
  });

  return (
    <>
      <Heading mt={"2"} className="mb-4 self-center">
        Note Genius
      </Heading>

      <Box className="flex-grow  p-4 overflow-hidden rounded-lg">
        <ScrollArea type="always" scrollbars="vertical">
          <Box className="w-full lg:w-3/4 mx-auto p-4">
            <ul className="divide-y">
              {messages
                .filter((msg) => msg.role !== "system")
                .map((msg, idx) => (
                  <li key={idx} className="py-4">
                    {msg.role === "user"
                      ? session?.user?.name + ": "
                      : "NoteGenius: "}
                    <span className="whitespace-pre-line">{msg.content}</span>
                  </li>
                ))}
            </ul>
          </Box>
        </ScrollArea>
      </Box>

      <Flex direction="column" justify={"center"} align={"center"}>
        <form className="relative w-1/2 " onSubmit={(e) => handleSubmit(e)}>
          <TextArea
            mb={"2"}
            placeholder="Type your message here..."
            className="justify-center border-r-4 max-h-1/4-screen overflow-y-auto" // Added max-h-1/4-screen and overflow-y-auto
            size={"3"}
            value={input}
            onChange={handleTextAreaChange}
            onInput={handleTextAreaChange}
            onKeyDown={handleKeyDown}
          />

          <IconButton
            variant="surface"
            type="submit"
            style={{
              position: "absolute",
              right: "15px",
              bottom: "22px",
            }}
          >
            <PaperPlaneIcon />
          </IconButton>
        </form>
      </Flex>
    </>
  );
}
