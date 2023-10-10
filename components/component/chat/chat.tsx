"use client";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  ScrollArea,
  TextArea,
} from "@radix-ui/themes";
import type { Message } from "ai/react";
import { useChat } from "ai/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Chats() {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState<string>("");
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  console.log(session?.user?.name);

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

  const { messages, setMessages, input, handleInputChange, handleSubmit } =
    useChat({
      api: "api/chat",
      initialMessages: [
        {
          id: "",
          content: "",
          role: "system",
        },
      ],

      onFinish: async () => {
        // Create a new message object for the user's message
        const newUserMessage: Message = {
          id: `user-message-${messages.length + 1}`, // Create a unique id based on the current number of messages
          content: input,
          role: "user",
        };

        // Append the new user message to the existing messages
        const updatedMessages = [...messages, newUserMessage];

        // Update the state with the new array of messages
        setMessages(updatedMessages);

        const res = await fetch("/api/users-chats", {
          method: "PUT",
          body: JSON.stringify({ newMessages: updatedMessages }), // Send the updated messages array to the API
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
    </>
  );
}
