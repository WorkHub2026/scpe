"use client";
import { FileCode, Plus, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import PolicyList from "./PolicyList";
import { createPolicy } from "@/lib/services/policy.service";
import { useAuth } from "@/context/AuthContext";
import FileDropZone from "./FileDropZone";

const PolicyView = () => {
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [policyFormData, setPolicyFormData] = useState<{
    title: string;
    file: File | null;
  }>({
    title: "",
    file: null,
  });
  const { user } = useAuth();

  const handlePostPolicy = async () => {
    if (!policyFormData.file) {
      console.log("No file selected");
      return;
    }

    const newPolicy = {
      title: policyFormData.title,
      file: policyFormData.file, // ✅ FIXED
      created_by: user?.user_id!,
    };

    await createPolicy(newPolicy);

    setPolicyFormData({ title: "", file: null });
    setShowPolicyModal(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Policy Management
        </h2>
        <p className="text-gray-600 mt-3 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-[#004225]" />
          Upload and manage organizational policies
        </p>
      </div>

      <div className="flex justify-end">
        {user?.role === "Admin" && (
          <button
            onClick={() => setShowPolicyModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#004225] hover:bg-[#003218] text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-[#004225]/30"
          >
            <Plus className="w-5 h-5" />
            Upload Policy
          </button>
        )}
      </div>

      {showPolicyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                Upload Policy
              </h3>
              <button
                onClick={() => setShowPolicyModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Policy Title
                </label>
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
                  className="w-full px-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white"
                />
              </div>

              <FileDropZone
                accept=".pdf,.doc,.docx,.txt"
                onFileSelect={(file) =>
                  setPolicyFormData({ ...policyFormData, file })
                }
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePostPolicy}
                className="flex-1 px-6 py-3 bg-[#004225] hover:bg-[#003218] text-white rounded-lg font-bold transition-all duration-300 shadow-lg shadow-[#004225]/30"
              >
                Upload Policy
              </button>
              <button
                onClick={() => setShowPolicyModal(false)}
                className="flex-1 px-6 py-3 border border-[#004225]/30 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <PolicyList />
    </div>
  );
};

export default PolicyView;
