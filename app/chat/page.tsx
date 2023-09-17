import Chat from "@/components/component/chat/chat";
import ChatLog from "@/components/component/chatlog/chatlog";
export const runtime = "edge";
export default function ChatPage() {
  return (
    <main className="flex flex-col h-screen">
      <h1 className="text-center text-2xl py-4">NoteGenius</h1>
      <div className="flex flex-row flex-grow overflow-hidden">
        <div className="w-[30%] min-w-[100px] max-h-full overflow-y-auto">
          <ChatLog />
        </div>
        <div className="flex-grow max-h-full overflow-y-auto">
          <Chat />
        </div>
      </div>
    </main>
  );
}
