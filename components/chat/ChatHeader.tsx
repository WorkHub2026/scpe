"use client";

export default function ChatHeader({ documentId }: { documentId: number }) {
  return (
    <div className="px-6 py-4 border-b bg-white flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold text-gray-800">
          Document Review Chat
        </h2>
        <p className="text-sm text-gray-500">Document ID: #{documentId}</p>
      </div>

      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
        Pending Review
      </span>
    </div>
  );
}
