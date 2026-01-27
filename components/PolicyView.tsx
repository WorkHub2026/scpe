"use client";

import { FileCode, Plus, X } from "lucide-react";
import React, { useState, useTransition } from "react";
import PolicyList from "./PolicyList";
import { useAuth } from "@/context/AuthContext";
import FileDropZone from "./FileDropZone";
import { createPolicyAction } from "@/lib/services/policy.service";
import { toast } from "sonner";
const PolicyView = () => {
  const { user } = useAuth();
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [policyFormData, setPolicyFormData] = useState({
    title: "",
    file: null as File | null,
  });

  const handlePostPolicy = () => {
    if (!policyFormData.file || !policyFormData.title) return;

    const formData = new FormData();
    formData.append("title", policyFormData.title);
    formData.append("file", policyFormData.file);
    formData.append("created_by", String(user?.user_id));

    startTransition(async () => {
      const res = await createPolicyAction(formData);

      if (res.success) {
        setPolicyFormData({ title: "", file: null });
        toast.success("Document submitted successfully ✅");
        setShowPolicyModal(false); // ✅ CLOSE MODAL ON SUCCESS
      } else {
        alert(res.message || "Upload failed");
      }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-gray-900">
          Siyaasadda Xaaladaha adag
        </h2>
        <p className="text-gray-600 mt-3 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-[#004225]" />
          Lifaaqidda iyo maaraynta siyaasadaha
        </p>
      </div>

      {user?.role === "Admin" && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowPolicyModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#004225] text-white rounded-xl font-bold"
          >
            <Plus className="w-5 h-5" />
            Lifaaqid
          </button>
        </div>
      )}

      {showPolicyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl w-full max-w-xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Upload Policy</h3>
              <button onClick={() => setShowPolicyModal(false)}>
                <X />
              </button>
            </div>

            <input
              type="text"
              placeholder="Policy title"
              value={policyFormData.title}
              onChange={(e) =>
                setPolicyFormData({
                  ...policyFormData,
                  title: e.target.value,
                })
              }
              className="w-full border px-4 py-3 rounded"
            />

            <FileDropZone
              accept=".pdf,.doc,.docx,.txt"
              onFileSelect={(file) =>
                setPolicyFormData({ ...policyFormData, file })
              }
            />

            <button
              onClick={handlePostPolicy}
              disabled={isPending}
              className="w-full bg-[#004225] text-white py-3 rounded font-bold"
            >
              {isPending ? "Uploading..." : "Upload Policy"}
            </button>
          </div>
        </div>
      )}

      <PolicyList />
    </div>
  );
};

export default PolicyView;
