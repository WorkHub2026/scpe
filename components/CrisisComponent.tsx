"use client";
import { useAuth } from "@/context/AuthContext";
import { createCrisis } from "@/lib/services/crisis.service";
import { AlertTriangle, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import CrisisList from "./CrisisList";
import FileDropZone from "./FileDropZone";

const CrisisResponseView = () => {
  const { user } = useAuth();

  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [crisisFormData, setCrisisFormData] = useState<{
    title: string;
    file: File | null;
    priority: "LOW" | "MEDIUM" | "HIGH";
  }>({
    title: "",
    file: null,
    priority: "LOW",
  });

  const role = user?.role;

  const handlePostCrisis = async () => {
    if (!crisisFormData.title.trim() || !crisisFormData.file) {
      console.error("Missing title or file");
      return;
    }

    if (!user?.user_id) {
      console.error("User ID is missing");
      return;
    }

    const data = {
      title: crisisFormData.title,
      file: crisisFormData.file,
      priority: crisisFormData.priority,
      created_by: user.user_id,
    };

    await createCrisis(data);

    setCrisisFormData({
      title: "",
      file: null,
      priority: "LOW",
    });

    setShowCrisisModal(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Emergency & Crisis Response
        </h2>
        <p className="text-gray-600 mt-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          Manage crisis communications with priority levels
        </p>
      </div>
      {role === "Admin" && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowCrisisModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#004225] hover:bg-[#003218] text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-[#004225]/30"
          >
            <Plus className="w-5 h-5" />
            Add Crisis Response
          </button>
        </div>
      )}

      {showCrisisModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                Add Crisis Response
              </h3>
              <button
                onClick={() => setShowCrisisModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Crisis title"
                  value={crisisFormData.title}
                  onChange={(e) =>
                    setCrisisFormData({
                      ...crisisFormData,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white"
                />
              </div>

              <FileDropZone
                accept=".pdf,.doc,.docx,.txt"
                onFileSelect={(file) =>
                  setCrisisFormData({ ...crisisFormData, file })
                }
              />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={crisisFormData.priority}
                  onChange={(e) =>
                    setCrisisFormData({
                      ...crisisFormData,
                      priority: e.target.value as "LOW" | "MEDIUM" | "HIGH",
                    })
                  }
                  className="w-full px-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePostCrisis}
                className="flex-1 px-6 py-3 bg-[#004225] hover:bg-[#003218] text-white rounded-lg font-bold transition-all duration-300 shadow-lg shadow-[#004225]/30"
              >
                Add Response
              </button>

              <button
                onClick={() => setShowCrisisModal(false)}
                className="flex-1 px-6 py-3 border border-[#004225]/30 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <CrisisList role={user?.role} />
    </div>
  );
};

export default CrisisResponseView;
