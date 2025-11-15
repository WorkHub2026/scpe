"use client";
import { CheckCircle, AlertCircle, Clock, FileText } from "lucide-react";

export default function DocumentCard({
  doc,
}: {
  doc: {
    id: number;
    title: string;
    type: string;
    status: string;
    date: string;
    reviewerFeedback?: string;
  };
}) {
  const getStatusIcon = () => {
    switch (doc.status) {
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "denied":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "under-review":
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    const styles = {
      accepted:
        "bg-emerald-100/80 text-emerald-700 border border-emerald-300/50",
      denied: "bg-red-100/80 text-red-700 border border-red-300/50",
      "under-review":
        "bg-amber-100/80 text-amber-700 border border-amber-300/50",
    };
    return (
      styles[doc.status as keyof typeof styles] || "bg-gray-100 text-gray-700"
    );
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-[#004225]/30 hover:border-[#004225]/60 hover:shadow-lg transition-all duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
        <div className="flex gap-4 sm:col-span-3">
          <div className="mt-1 p-2 bg-[#004225]/10 rounded-lg">
            {getStatusIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h4 className="font-semibold text-gray-900 break-words">
                {doc.title}
              </h4>
              <span className="text-xs px-2 py-1 rounded-full bg-[#004225]/20 text-[#004225] uppercase font-bold border border-[#004225]/50 flex-shrink-0">
                {doc.type}
              </span>
            </div>
            <p className="text-sm text-gray-600">📅 {doc.date}</p>
            {doc.reviewerFeedback && (
              <p className="text-sm text-gray-600 p-2 bg-[#004225]/10 rounded border border-[#004225]/30 mt-3">
                <strong className="text-[#004225]">Feedback:</strong>{" "}
                {doc.reviewerFeedback}
              </p>
            )}
          </div>
        </div>
        <div className="sm:col-span-1 sm:text-right">
          <span
            className={`px-4 py-2 rounded-lg text-sm font-bold inline-block sm:block ${getStatusBadge()}`}
          >
            {doc.status === "under-review"
              ? "Under Review"
              : doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
