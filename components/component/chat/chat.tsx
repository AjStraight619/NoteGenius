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
import Sidebar from "@/components/sideBar/sideBarChat";
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Header Container */}
      <Sidebar />
      <Box style={{ borderRadius: "var(--radius-3)" }}>
        <Container size="1">
          <Flex direction="column">
            <Heading>Note Genius</Heading>
          </Flex>
        </Container>
      </Box>

      {/* Text Stream Container */}
      <Box
        className="flex-grow w-full lg:w-[75%]"
        style={{ borderRadius: "var(--radius-3)" }}
      >
        <Container size="3" className="py-7">
          <Flex direction="column">
            <ScrollArea
              type="always"
              scrollbars="vertical"
              style={{ height: "50vh" }}
            >
              <Box p="2" pr="8">
                <ul className="divide-y">
                  {messages
                    .filter((msg) => msg.role !== "system")
                    .map((msg, idx) => (
                      <li key={idx} className="py-4">
                        {msg.role === "user"
                          ? session?.user?.name + ": "
                          : "NoteGenius: "}
                        <span className="whitespace-pre-line">
                          {msg.content}
                        </span>
                      </li>
                    ))}
                </ul>
              </Box>
            </ScrollArea>
          </Flex>
        </Container>
      </Box>

      {/* Message Input Container */}
      <Box
        className="w-full lg:w-[75%] mt-auto"
        style={{ borderRadius: "var(--radius-3)" }}
      >
        <Container size="3" className="py-7">
          <Flex direction="column">
            <form className="relative w-full" onSubmit={(e) => handleSubmit(e)}>
              <TextArea
                placeholder="Type your message here..."
                className="w-full pr-10"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <IconButton
                variant="surface"
                type="submit"
                style={{
                  position: "absolute",
                  right: "10px", // adjust as needed
                  bottom: "10px", // adjust as needed
                }}
              >
                <PaperPlaneIcon />
              </IconButton>
            </form>
          </Flex>
        </Container>
      </Box>
    </main>
  );
}
