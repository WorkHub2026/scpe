"use client";
import { useAuth } from "@/context/AuthContext";
import { deletePolicy, getAllPolicy } from "@/lib/services/policy.service";
import { Download, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PolicyList = () => {
  const [policies, setPolicies] = useState([]);
  const { user } = useAuth();
  const router = useRouter();
  const fetchPolicy = async () => {
    try {
      const data: any = await getAllPolicy();
      setPolicies(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPolicy();
  }, []);

  const handleCrisis = async (id: number) => {
    try {
      const response: any = await deletePolicy(id);

      if (response.success) {
        await fetchPolicy(); // refresh list after delete
      } else {
        console.log("Delete failed:", response.error);
      }
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };

  const handleDownload = (filePath: string) => {
    const url = `${window.location.origin}${filePath}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = filePath.split("/").pop() || "document";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-4">
      {policies?.length > 0 ? (
        policies?.map((item: any, index: number) => (
          <div
            onClick={() => router.push(`/policy/${item.id}`)}
            key={index}
            className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-emerald-200/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            {/* Top Section */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">
                  From: System Admin •{" "}
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>

              {/* Admin delete button */}
              {user?.role === "Admin" && (
                <button
                  onClick={() => handleCrisis(item.id)}
                  className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Policy Content */}
            <p className="text-gray-700">{item.content}</p>

            {/* Download button – Only for Ministry Users */}
            {user?.role === "MinistryUser" && (
              <button
                onClick={() => handleDownload(item.file_path)}
                className="
              absolute top-4 right-4 
              opacity-0 group-hover:opacity-100 
              transition-opacity duration-300 
              p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 
              text-white shadow-md
            "
                title="Download File"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-600">No Policy uploaded yet.</p>
      )}
    </div>
  );
};

export default PolicyList;
