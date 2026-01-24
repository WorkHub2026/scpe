"use client";

import { useState } from "react";
import DecisionModal from "@/components/DecisionModal";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import {
  changeDocumentStatus,
  createFeedback,
} from "@/lib/services/documentService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SubmissionList({ documents }: { documents: any[] }) {
  type DocumentStatus =
    | "Submitted"
    | "Under_Review"
    | "Accepted"
    | "Denied"
    | "Revised";

  const [showModal, setShowModal] = useState<number | null>(null);
  const [decisionForm, setDecisionForm] = useState<{
    status: DocumentStatus;
    feedback: string;
  }>({
    status: "Submitted",
    feedback: "",
  });

  const router = useRouter();

  const { user } = useAuth();

  const handleDecision = async (id: number) => {
    if (!user?.user_id) {
      console.error("No user id available to submit decision.");
      return;
    }
    await createFeedback(id, user.user_id, decisionForm.feedback);
    await changeDocumentStatus(id, decisionForm.status, user.user_id);
    setShowModal(null);
  };

  function getStatusIcon(status: string) {
    switch (status) {
      case "Accepted":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "Denied":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "Submitted":
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return null;
    }
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      Accepted: "bg-emerald-100 text-emerald-700 border border-emerald-300",
      Denied: "bg-red-100 text-red-700 border border-red-300",
      Submitted: "bg-amber-100 text-amber-700 border border-amber-300",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  }

  return (
    <div className="space-y-4">
      {documents.length === 0 ? (
        <p className="text-gray-600">No documents found.</p>
      ) : (
        documents.map((doc, index) => (
          <div
            onClick={() => router.push(`/review/${doc.document_id}`)}
            key={doc.id ?? `doc-${index}`}
            className="bg-white/70 p-6 rounded-xl border border-emerald-200/50 hover:shadow-lg transition-all duration-300"
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
              <div className="flex gap-4 sm:col-span-3">
                <div className="mt-1 p-2 bg-[#004225]/10 rounded-lg group-hover:bg-[#004225]/20 transition-colors duration-300 flex-shrink-0">
                  {getStatusIcon(doc.status)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300 break-words">
                      {doc.title}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#004225]/20 text-[#004225] uppercase font-bold border border-[#004225]/50 flex-shrink-0">
                      {doc.type}
                    </span>
                  </div>

                  <div className="flex gap-4 flex-wrap text-xs text-gray-500">
                    <span>
                      📅 {new Date(doc.submitted_at).toLocaleString()}
                    </span>
                    {/* <span>👤 {doc.reviewer} </span> */}
                    <p className="text-sm text-gray-600 mb-2">
                      {doc.ministry.name}
                    </p>
                  </div>

                  {doc.feedbacks && doc.feedbacks.length > 0 && (
                    <>
                      {doc.feedbacks.map((f: any, i: any) => (
                        <p
                          key={i}
                          className="text-sm text-gray-600 p-2 bg-[#004225]/10 rounded border border-[#004225]/30 mt-3"
                        >
                          <strong className="text-[#004225]">Feedback:</strong>{" "}
                          {f.feedback_text}
                        </p>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:col-span-1 sm:items-end">
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-bold text-center sm:text-right ${getStatusBadge(
                    doc.status,
                  )}`}
                >
                  {doc.status === "Submitted"
                    ? "Under Review"
                    : doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </span>
                {doc.status === "Submitted" && (
                  <button
                    onClick={() => setShowModal(doc.document_id)}
                    className="text-xs px-3 py-2 bg-[#004225]/20 hover:bg-[#004225]/30 text-[#004225] rounded-lg font-bold transition-colors duration-300 whitespace-nowrap"
                  >
                    Make Decision
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {showModal && (
        <DecisionModal
          onClose={() => setShowModal(null)}
          formData={decisionForm}
          setFormData={setDecisionForm}
          onSubmit={() => handleDecision(showModal)}
        />
      )}
    </div>
  );
}
