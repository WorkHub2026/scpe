"use client";

import { useAuth } from "@/context/AuthContext";
import { createDocument } from "@/lib/services/documentService";
import FileDropZone from "./FileDropZone";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function UploadDocumentForm({
  setUploadDoc,
}: {
  setUploadDoc: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (formData: FormData) => {
    if (!file) {
      toast.error("Please upload a document file");
      return;
    }

    // ✅ attach file manually
    formData.set("file", file);

    startTransition(async () => {
      const res: any = await createDocument(formData);

      if (res?.success) {
        toast.success("Document submitted successfully ✅");
        setUploadDoc(false); // ✅ CLOSE MODAL
        // refetch documents
      } else {
        toast.error(res?.message || "Failed to submit document");
      }
    });
  };

  return (
    <form
      action={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md border space-y-4"
    >
      {/* TITLE */}
      <input
        name="title"
        placeholder="Document title"
        required
        className="w-full px-4 py-3 border rounded-lg"
      />

      {/* FILE */}
      <FileDropZone
        accept=".doc,.docx,.pdf,.txt"
        onFileSelect={(file) => setFile(file)}
      />

      {/* TYPE */}
      <select name="type" className="w-full px-4 py-3 border rounded-lg">
        <option value="Report">Report</option>
        <option value="Script">Content (with review)</option>
      </select>

      {/* SERVER ACTION SAFE VALUES */}
      <input
        type="hidden"
        name="submitted_by"
        value={String(user?.user_id ?? "")}
      />
      <input
        type="hidden"
        name="ministry_id"
        value={String(user?.ministry_id ?? "")}
      />

      {/* ACTIONS */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-[#004225] text-white rounded-lg disabled:opacity-60"
        >
          {isPending ? "Submitting..." : "Submit"}
        </button>

        <button
          type="button"
          onClick={() => setUploadDoc(false)}
          className="w-full h-12 rounded-lg border text-[#004225]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
