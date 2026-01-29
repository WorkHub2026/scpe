"use client";
import { useParams } from "next/navigation";
import {
  getDocumentById,
  updateDocument,
} from "@/lib/services/documentService";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { useAuth } from "@/context/AuthContext";
import Chat from "@/components/chat/Chat";
const ReviewPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<"Accepted" | "Denied" | "Revised">(
    "Accepted",
  );
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const { user }: any = useAuth();
  const [editedContent, setEditedContent] = useState<string>("");

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      const document: any = await getDocumentById(Number(id));
      setData(document);
      setEditedContent(document.previewContent);
    };
    fetchDocument();
  }, [id]);

  if (!data) {
    return <div>Loading...</div>;
  }

  // Track inline edits
  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    setEditedContent(e.currentTarget.innerHTML);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  console.log("Document:", data);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload: any = {
        title: data.title,
        type: data.type,
        file_path: data.file_path,
        ministry_id: data.ministry_id,
        status: status,
        feedbacks: [...data.feedbacks],
      };
      await updateDocument(Number(id), payload);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error submitting review:", error);
    }
  };

  return (
    <>
      <Navbar user={user} onLogout={() => {}} />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
        <p className="text-sm text-gray-600">
          Ministry: {data.ministry?.name || "N/A"} | Submitted By:{" "}
          {data.submittedBy?.username || "N/A"}
        </p>

        {/* Download button */}

        <div className="flex flex-col space-y-4 w-full">
          <a
            href={data.file_path}
            download
            className="px-4 py-2 bg-[#004225] text-white rounded hover:bg-[#003218]"
          >
            Download File
          </a>

          {/* Preview & editable content */}
          <div className="border border-gray-300 rounded p-4 max-h-[500px] overflow-auto">
            {data.file_path.endsWith(".docx") ? (
              <div
                ref={previewRef}
                className="prose max-w-full border p-2 rounded"
                dangerouslySetInnerHTML={{
                  __html: data.previewContent || "<p>No preview available</p>",
                }}
              />
            ) : (
              <div
                ref={previewRef}
                className="prose max-w-full border p-2 rounded"
                contentEditable
                suppressContentEditableWarning
                onInput={handleContentChange}
                dangerouslySetInnerHTML={{ __html: editedContent }}
                style={{ minHeight: "200px" }}
              />
            )}
          </div>

          {/* Highlighting instructions */}
          <p className="text-sm text-gray-500">
            Highlight missing text with{" "}
            <span className="bg-yellow-200">yellow</span> and incorrect text
            with <span className="bg-red-200">red</span>. Edit directly in the
            document above.
          </p>
        </div>

        {user?.role === "Admin" && (
          <>
            <div className="space-y-2">
              <label className="font-semibold">Decision</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded w-full"
              >
                <option value="Accepted">Accept</option>
                <option value="Denied">Deny</option>
                <option value="Revised">Request Revision</option>
              </select>

              <label className="font-semibold mt-2">Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded h-32 resize-none"
                placeholder="Add feedback..."
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-[#004225] text-white rounded hover:bg-[#003218]"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
            {data.feedbacks?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold">Previous Feedback</h3>
                {data.feedbacks.map((fb: any, index: number) => (
                  <p
                    key={fb.id ?? `doc-${index}`}
                    className="text-sm mt-2 bg-[#004225]/10 p-2 rounded border border-[#004225]/30"
                  >
                    {fb.feedback_text}
                  </p>
                ))}
              </div>
            )}
          </>
        )}

        <Chat documentId={Number(id)} />
      </div>
    </>
  );
};

export default ReviewPage;
