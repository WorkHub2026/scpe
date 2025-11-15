"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, Zap } from "lucide-react";
import UploadDocumentForm from "@/components/UploadDocumentForm";
import ListDocuments from "@/components/DocumentList";
import { listDocuments } from "@/lib/services/documentService";
import DocumentStat from "@/components/DocumentStat";
// adjust import path if needed

export default function DocumentsView() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch documents on mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await listDocuments(); // Backend fetch
        setDocuments(res);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      }
    };
    fetchDocuments();
  }, []);

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
      <UploadDocumentForm />

      {/* Documents List */}
      <ListDocuments documents={documents} />
    </div>
  );
}
