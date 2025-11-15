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
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-start">
                <div>{getStatusIcon(doc.status)}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                  <p className="text-sm text-gray-600">{doc.ministry}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(doc.reviewed_at).toLocaleString()}
                  </p>
                  {doc.feedbacks && doc.feedbacks.length > 0 && (
                    <div className="flex items- justify-center space-x-1.5 text-sm mt-2 bg-[#004225]/10 p-2 rounded border border-[#004225]/30 space-y-1">
                      <strong>Feedback:</strong>
                      {doc.feedbacks.map((f: any, i: any) => (
                        <p key={i}>{f.feedback_text}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-bold ${getStatusBadge(
                    doc.status
                  )}`}
                >
                  {doc.status}
                </span>
                {doc.status === "Submitted" && (
                  <button
                    onClick={() => setShowModal(doc.document_id)}
                    className="text-xs px-3 py-2 bg-[#004225]/20 hover:bg-[#004225]/30 text-[#004225] rounded-lg font-bold transition-colors"
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
