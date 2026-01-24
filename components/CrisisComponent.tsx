"use client";
import { useAuth } from "@/context/AuthContext";
import { createCrisis } from "@/lib/services/crisis.service";
import { AlertTriangle, Plus, X } from "lucide-react";
import { useState, useTransition } from "react";
import CrisisList from "./CrisisList";
import FileDropZone from "./FileDropZone";
import { toast } from "sonner";

const CrisisResponseView = () => {
  const { user } = useAuth();
  const role = user?.role;

  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [crisisFormData, setCrisisFormData] = useState({
    title: "",
    file: null as File | null,
    priority: "LOW",
  });

  const handlePostCrisis = () => {
    if (!crisisFormData.file || !crisisFormData.title) return;

    const formData = new FormData();
    formData.append("title", crisisFormData.title);
    formData.append("file", crisisFormData.file);
    formData.append("priority", crisisFormData.priority);
    formData.append("created_by", String(user?.user_id));
    startTransition(async () => {
      const res = await createCrisis(formData);

      if (res.success) {
        setCrisisFormData({ title: "", file: null, priority: "LOW" });
        setShowCrisisModal(false); // ✅ CLOSE MODAL ON SUCCESS
        toast.success("Crisis reported successfully ✅");
      } else {
        alert(res.message || "Upload failed");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          JAWAABTA XAALADAHA ADAG
        </h2>
        <p className="text-gray-600 mt-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          Maaraynta Xaaladaha adag, iyada oo loo kala hormarinayo sida ay u kala
          mudan yihiin
        </p>
      </div>

      {/* Admin Button */}
      {role === "Admin" && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowCrisisModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#004225] text-white rounded-xl font-bold"
          >
            <Plus className="w-5 h-5" />
            Diiwaangeli xaalad adag
          </button>
        </div>
      )}

      {/* Modal */}
      {showCrisisModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Diiwaangeli xaalad adag</h3>
              <button onClick={() => setShowCrisisModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* ✅ SERVER ACTION FORM */}
            <form action={handlePostCrisis} className="space-y-4">
              <input
                name="title"
                placeholder="Crisis title"
                required
                className="w-full px-4 py-3 border rounded-lg"
                value={crisisFormData.title}
                onChange={(e) =>
                  setCrisisFormData({
                    ...crisisFormData,
                    title: e.target.value,
                  })
                }
              />

              <FileDropZone
                accept=".pdf,.doc,.docx,.txt"
                onFileSelect={(file) =>
                  setCrisisFormData({ ...crisisFormData, file })
                }
              />

              {/* Required hidden real file input */}
              <input
                type="file"
                name="file"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />

              <select
                name="priority"
                defaultValue="LOW"
                className="w-full px-4 py-3 border rounded-lg"
                onChange={(e) =>
                  setCrisisFormData({
                    ...crisisFormData,
                    priority: e.target.value,
                  })
                }
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>

              {/* ONLY STRINGS / NUMBERS */}
              <input
                type="hidden"
                name="created_by"
                value={`${user?.user_id ?? ""}`}
              />

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#004225] text-white rounded-lg font-bold"
                >
                  {isPending ? "Uploading..." : "Gudbi"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowCrisisModal(false)}
                  className="flex-1 px-6 py-3 border rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CrisisList role={user?.role} />
    </div>
  );
};

export default CrisisResponseView;
