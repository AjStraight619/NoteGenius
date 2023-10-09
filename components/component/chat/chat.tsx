"use client";

import { useChat } from "ai/react";

import { useState } from "react";
import { useSession } from "next-auth/react";
import type { User } from "@prisma/client";
import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  ScrollArea,
  TextArea,
} from "@radix-ui/themes";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

import { Chat, ChatMessage } from "@prisma/client";

type Message = {
  id: string;
  content: string;
  role: string;
};

export default function Chat({ chats }: { chats: any }) {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState<string>("");
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);

  const defaultPrompts = [
    {
      id: "MathPrompt",
      content:
        "You are going to act like a math tutor for this conversation...",
      role: "system",
    },
    // TODO: Add more default prompts:
  ];

  const handlePromptChange = (e: any) => {
    setPrompt(e.target.value);
  };

  const handlePromptSubmit = (e: any) => {
    setInitialMessages([
      ...(initialMessages ?? []),
      {
        id: `system-message-${(initialMessages?.length ?? 0) + 1}`,
        content: prompt,
        role: "system",
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Here you can either manually create a new FormEvent object or use any other method to pass the correct type of event to handleSubmit
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "api/chat",
    initialMessages: [
      {
        id: "",
        content: "",
        role: "system",
      },
    ],
  });

  return (
    <main className="flex flex-col h-screen p-4">
      <Heading className="mb-4 self-center">Note Genius</Heading>

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
            placeholder="Type your message here..."
            className="justify-center border-r-4"
            size={"3"}
            value={input}
            onChange={handleInputChange}
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
    </main>
  );
}
