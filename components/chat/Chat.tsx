'use client';
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessage";
import ChatInput from "./ChatInput";

const Chat = ({ documentId }: { documentId: number }) => {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      <ChatHeader documentId={documentId} />
      <ChatMessages documentId={documentId} />
      <ChatInput documentId={documentId} />
    </div>
  );
};

export default Chat;
