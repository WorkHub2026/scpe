"use client";

import { useEffect, useState } from "react";
import ChatBubble from "./ChatBubble";
import { getChatMessages } from "@/lib/services/chatThread.service";

export default function ChatMessages({ documentId }: any) {
  const [mockMessages, setMockMessages] = useState<any>([]);

  const numericThreadId = Number(documentId);
  console.log("Numeric Thread ID:", numericThreadId);
  if (isNaN(numericThreadId)) {
    console.error("Invalid Document/Thread ID");
    return;
  }
  const fetchMessages = async () => {
    try {
      const resp: any = await getChatMessages(numericThreadId);
      setMockMessages(resp);
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  console.log("Messages:", mockMessages);
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      {mockMessages?.messages?.map((msg: any) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}

      {mockMessages?.messages?.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No messages yet.</p>
      )}
    </div>
  );
}
