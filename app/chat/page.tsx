import Chat from "@/components/component/chat/chat";

export const runtime = "edge";
export default function ChatPage() {
  return (
    <main className="container max-w-4xl mx-auto outline-3 h-[80vh] flex flex-col justify-between">
      <h1 className="text-center my-4 text-2xl">NoteGenius</h1>
      <Chat />
    </main>
  );
}
