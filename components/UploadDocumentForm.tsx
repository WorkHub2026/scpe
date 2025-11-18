"use client";
import { useAuth } from "@/context/AuthContext";
import { createDocument } from "@/lib/services/documentService";
import React, { useState, useRef } from "react";
import FileDropZone from "./FileDropZone";

export default function UploadDocumentForm({
  setUploadDoc,
}: {
  setUploadDoc: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  type UploadFormData = {
    title: string;
    type: "Report" | "Script";
    file: File | null;
  };

  const [uploadFormData, setUploadFormData] = useState<UploadFormData>({
    title: "",
    type: "Report",
    file: null,
  });
  const [error, setError] = useState("");

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadFormData.file) {
      setError("Please upload a valid file before submitting.");
      return;
    }

    try {
      await createDocument({
        title: uploadFormData.title,
        type: uploadFormData.type,
        file: uploadFormData.file,
        submitted_by: user?.user_id ?? null,
        ministry_id: user?.ministry?.ministry_id ?? null,
      });

      // Reset
      setUploadFormData({ title: "", type: "Report", file: null });
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to upload document. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md border border-[#004225]/30 space-y-4"
    >
      {/* Document Title */}
      <input
        type="text"
        placeholder="Document title"
        value={uploadFormData.title}
        onChange={(e) =>
          setUploadFormData({ ...uploadFormData, title: e.target.value })
        }
        className="w-full px-4 py-3 border border-[#004225]/30 rounded-lg focus:ring-2 focus:ring-[#004225]/50"
      />

      {/* Drag and Drop Zone */}

      <FileDropZone
        accept=".pdf,.doc,.docx,.txt"
        onFileSelect={(file) => setUploadFormData({ ...uploadFormData, file })}
      />
      {/* Preview */}

      <select
        value={uploadFormData.type}
        onChange={(e) =>
          setUploadFormData({
            ...uploadFormData,
            type: e.target.value as "Report" | "Script",
          })
        }
        className="w-full px-4 py-3 border border-[#004225]/30 rounded-lg focus:ring-2 focus:ring-[#004225]/50"
      >
        <option value="Report">Report</option>
        <option value="Script">Content (with review)</option>
      </select>

      {/* Error Message */}
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      {/* Submit */}
      <div className="flex items-center justify-between space-x-2">
        <button
          type="submit"
          className="w-full py-3 bg-[#004225] text-white rounded-lg font-semibold hover:bg-[#00361d] transition-all"
        >
          Submit
        </button>

        <button
          onClick={(prev) => setUploadDoc(!prev)}
          className="w-full h-12 rounded-lg border border-[#004225] text-[#004225] font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
