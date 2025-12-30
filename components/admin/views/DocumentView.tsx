"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, Zap, Upload } from "lucide-react";
import UploadDocumentForm from "@/components/UploadDocumentForm";
import ListDocuments from "@/components/DocumentList";
import { listDocuments } from "@/lib/services/documentService";
import DocumentStat from "@/components/DocumentStat";
import { useAuth } from "@/context/AuthContext";
import { AppUser } from "@/lib/auth";
// adjust import path if needed

export default function DocumentsView() {
  const [documents, setDocuments] = useState<any[]>([]);

  const [uploadDoc, setUploadDoc] = useState(false);

  const { user } = useAuth();

  // Fetch documents on mount
  useEffect(() => {
    const fetchDocuments = async (
      ministry?: { ministry_id?: number } | null
    ) => {
      try {
        const res = await listDocuments({
          ministry_id: ministry?.ministry_id,
        }); // Backend fetch
        setDocuments(res);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      }
    };

    if (user?.role === "MinistryUser") {
      fetchDocuments(user?.ministry ?? null);
    } else {
      fetchDocuments();
    }
  }, [user]);
  return (
    <div>
      <div className="mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
          Document Upload Center
        </h2>
        <p className="text-gray-600 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#004225]" />
          Submit and track your communication documents
        </p>
      </div>

      {/* Stats Section */}
      <DocumentStat documents={documents} />

      {/* Upload Form */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-semibold text-[#004225] mb-4">
            Upload Document
          </h2>

          <button
            onClick={() => setUploadDoc(!uploadDoc)}
            className="flex items-center px-4 py-2 bg-[#004225] text-white rounded-lg hover:bg-[#00361d] transition-all"
          >
            <Upload className="w-5 h-5 mr-2" />
            <span>Upload New Document</span>
          </button>
        </div>

        {uploadDoc && <UploadDocumentForm setUploadDoc={setUploadDoc} />}
      </div>

      {/* Documents List */}
      <ListDocuments documents={documents} />
    </div>
  );
}
