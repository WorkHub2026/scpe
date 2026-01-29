"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, AlertCircle, Search, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { listDocuments } from "@/lib/services/documentService";

export default function ListDocuments({ documents: initialDocuments }: { documents: any[] }) {
  const router = useRouter();
  const [documents, setDocuments] = useState(initialDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (searchDate) {
        const date = new Date(searchDate);
        startDate = new Date(date.setHours(0, 0, 0, 0));
        endDate = new Date(date.setHours(23, 59, 59, 999));
      }

      const results = await listDocuments({
        search: searchQuery || undefined,
        startDate,
        endDate,
      });
      setDocuments(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = async () => {
    setSearchQuery("");
    setSearchDate("");
    try {
      const results = await listDocuments();
      setDocuments(results);
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
  };
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Waraaqahaga(Documents)
        </h3>
        
        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or ministry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white"
            />
          </div>
          <div className="relative flex-1 sm:flex-initial">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full sm:w-48 pl-10 pr-4 py-2 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-[#004225] hover:bg-[#003218] text-white rounded-lg font-bold transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? "..." : "Search"}
            </button>
            {(searchQuery || searchDate) && (
              <button
                onClick={clearSearch}
                className="px-4 py-2 border border-[#004225]/30 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-all duration-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
      
      {documents.length > 0 ? (
        documents.map((doc, index) => (
          <div
            onClick={() => router.push(`/review/${doc.document_id}`)}
            key={doc.id ?? `doc-${index}`}
            className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-emerald-200/50 hover:border-emerald-300/80 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
              <div className="flex gap-4 sm:col-span-3">
                <div className="mt-1 p-2 bg-[#004225]/10 rounded-lg group-hover:bg-[#004225]/20 transition-colors duration-300 flex-shrink-0">
                  {getStatusIcon(doc.status)}
                </div>
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300 break-words">
                      {doc.title}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#004225]/20 text-[#004225] uppercase font-bold border border-[#004225]/50 flex-shrink-0">
                      {doc.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {doc.ministry?.name || "Unknown Ministry"}
                  </p>
                  <div className="flex gap-4 flex-wrap text-xs text-gray-500">
                    <span>
                      📅 {new Date(doc.submitted_at).toLocaleString()}
                    </span>
                    {/* <span>👤 {doc.reviewer} </span> */}
                  </div>

                  {doc.feedbacks && doc.feedbacks.length > 0 && (
                    <>
                      {doc.feedbacks.map((f: any, i: any) => (
                        <p className="text-sm text-gray-600 p-2 bg-[#004225]/10 rounded border border-[#004225]/30 mt-3">
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
                {/* {doc.status === "Submitted" && (
                  <button
                    onClick={() => setShowModal(doc.document_id)}
                    className="text-xs px-3 py-2 bg-[#004225]/20 hover:bg-[#004225]/30 text-[#004225] rounded-lg font-bold transition-colors duration-300 whitespace-nowrap"
                  >
                    Make Decision
                  </button>
                )} */}
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
