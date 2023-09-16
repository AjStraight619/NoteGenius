"use client";

import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type Message = {
  id: string;
  content: string;
  role: string;
};

export default function Chat() {
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
    <div className="flex flex-col h-[90vh] w-full ">
      <div className="flex-1 overflow-y-auto p-4 border rounded w-full no-scrollbar">
        <ul className="divide-y">
          {messages
            .filter((msg) => msg.role !== "system")
            .map((msg, idx) => (
              <li key={idx} className="py-4">
                {msg.role === "user" ? "User: " : "NoteGenius: "}
                <span className="whitespace-pre-line"> {msg.content}</span>
              </li>
            ))}
        </ul>
      </div>
      <form className="p-4 w-full" onSubmit={handleSubmit}>
        <Input
          className="w-full border rounded-xl py-2 px-4"
          placeholder="Say something..."
          value={input}
          onChange={handleInputChange}
        />
        <Button className="mt-4" type="submit">
          Send
        </Button>
      </form>
    </div>
  );
}
