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

  console.log("DocumentView user:", user);
  // Fetch documents on mount
  useEffect(() => {
    const fetchDocuments = async (
      ministry_id: number | undefined = undefined,
    ) => {
      try {
        const res = await listDocuments({
          ministry_id: ministry_id,
        }); // Backend fetch
        setDocuments(res);
        console.log("Fetched documents:", res);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      }
    };

    if (user?.role === "MinistryUser") {
      fetchDocuments(user?.ministry_id ?? null);
    } else {
      fetchDocuments();
    }
  }, [user]);
  return (
    <div>
      <div className="mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
          Xarunta Waraaqaha ee Isgaarsiinta
        </h2>
        <p className="text-gray-600 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#004225]" />
          Gudbi lana soco waraaqaha(documents) isgaarsiinta ee muhiimka ah
        </p>
      </div>

      {/* Stats Section */}
      <DocumentStat documents={documents} />

      {/* Upload Form */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-semibold text-[#004225] mb-4">
            Gudbi Waraaqo Cusub
          </h2>

          <button
            onClick={() => setUploadDoc(!uploadDoc)}
            className="flex items-center px-4 py-2 bg-[#004225] text-white rounded-lg hover:bg-[#00361d] transition-all"
          >
            <Upload className="w-5 h-5 mr-2" />
            <span>Gudbi waraaq</span>
          </button>
        </div>

        {uploadDoc && <UploadDocumentForm setUploadDoc={setUploadDoc} />}
      </div>

      {/* Documents List */}
      <ListDocuments documents={documents} />
    </div>
  );
}
