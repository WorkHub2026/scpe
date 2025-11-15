"use client";

import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface DocumentItem {
  id: number;
  title: string;
  type: string;
  status: string;
  date: string;
  reviewerFeedback?: string;
}

export default function ListDocuments({
  documents,
}: {
  documents: DocumentItem[];
}) {
  const getStatusBadge = (status: string) => {
    const styles = {
      Accepted:
        "bg-emerald-100/80 text-emerald-700 border border-emerald-300/50",
      Denied: "bg-red-100/80 text-red-700 border border-red-300/50",
      "under-review":
        "bg-amber-100/80 text-amber-700 border border-amber-300/50",
      Submitted: "bg-amber-100/80 text-amber-700 border border-amber-300/50",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Submitted":
        return <Clock className="w-5 h-5 text-amber-500" />;
      case "Accepted":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "Denied":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "under-review":
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Documents</h3>
      {documents.length > 0 ? (
        documents.map((doc, index) => (
          <div
            key={doc.id ?? `doc-${index}`}
            className="bg-white/70 p-6 rounded-xl border border-[#004225]/30 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                <p className="text-sm text-gray-500">{doc.date}</p>
                {doc.reviewerFeedback && (
                  <p className="mt-2 text-sm text-gray-700 bg-[#004225]/10 p-2 rounded-lg border border-[#004225]/20">
                    <strong>Feedback:</strong> {doc.reviewerFeedback}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(doc.status)}
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-bold ${getStatusBadge(
                    doc.status
                  )}`}
                >
                  {doc.status}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No documents uploaded yet.</p>
      )}
    </div>
  );
}
