"use client";
export default function ChatBubble({ message }: any) {
  const isAdmin = message.sender.role === "Admin";

  return (
    <div className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-4 py-3 rounded-xl text-sm shadow
           
          ${
            isAdmin
              ? "bg-[#004225] text-white rounded-br-none"
              : "bg-white border text-gray-800 rounded-bl-none"
          }`}
      >
        <p>{message.content}</p>
        <span className="block text-[10px] mt-1 opacity-70">
          {new Date(message.createdAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
