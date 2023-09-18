"use client";
import { useState, useEffect } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

interface ChatLog {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  // Add other fields if necessary
}

export default function ChatLog() {
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [isOpen, setIsOpen] = useState(false); // Manage whether the sidebar is open or closed

  useEffect(() => {
    // Define an async function
    const fetchData = async () => {
      try {
        const response = await fetch("/api/get-chatlogs", {});

        // Check if the request was successful
        if (response.ok) {
          const data = await response.json();
          console.log("response ok");

          setChatLogs(data.chatLogs);
        } else {
          console.error("Failed to fetch chat logs");
        }
      } catch (error) {
        console.error("An error occurred while fetching the data: ", error);
      }
    };

    // Call the async function
    fetchData();
  }, []); // Empty dependency array means this useEffect runs once when the component mounts

  return (
    <div className="relative mt-12">
      <button
        className={`fixed top-16 p-4 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "left-72" : "left-4"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaChevronLeft size={24} /> : <FaChevronRight size={24} />}
      </button>

      <div
        className={`fixed top-16 left-4 w-64 h-[100vh] bg-white p-4 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-40`}
      >
        <h1 className="text-lg font-semibold mb-4">Chat Logs</h1>

        {/* Wrap your list with the ScrollArea */}
        <ScrollArea className="h-full w-full overflow-y-hidden">
          <ul>
            {chatLogs.map((chatLog, index) => (
              <li key={index} className="p-4 border-b border-gray-200">
                <h2 className="text-md font-medium">{chatLog.title}</h2>
                <p className="text-sm text-gray-600">
                  Message: {chatLog.content} <br />
                  Timestamp: {chatLog.createdAt}
                </p>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
}
