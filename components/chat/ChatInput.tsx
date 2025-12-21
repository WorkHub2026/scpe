"use client";

import { useAuth } from "@/context/AuthContext";
import { sendChatMessage } from "@/lib/services/chatThread.service";
import { Send } from "lucide-react";
import { useState } from "react";

interface Chat {
  thread_id: number;
  sender_id: number;
  content: string;
}
export default function ChatInput({ documentId }: any) {
  const [message, setMessage] = useState<string>("");
  const { user } = useAuth();
  const handleSend = async () => {
    if (!message.trim() || !user?.user_id) return;
    const numericThreadId = Number(documentId);
    if (isNaN(numericThreadId)) {
      console.error("Invalid Document/Thread ID");
      return;
    }
    try {
      const data = {
        thread_id: numericThreadId,
        sender_id: user.user_id,
        content: message,
      };

      const result = await sendChatMessage(data);

      if (result.success) {
        setMessage("");
      } else {
        alert(result.message); // Show the error to the user
      }
    } catch (err) {
      console.log("Error sending message:", err);
    }
  };

  return (
    <div className="border-t bg-white px-6 py-4 flex gap-3">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#004225]/50"
      />
      <button
        onClick={handleSend}
        className="px-4 py-3 bg-[#004225] text-white rounded-lg hover:bg-[#003218]"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
