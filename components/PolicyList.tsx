"use client";
import { useAuth } from "@/context/AuthContext";
import { deletePolicy, getAllPolicy } from "@/lib/services/policy.service";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const PolicyList = () => {
  const [policies, setPolicies] = useState([]);
  const { user } = useAuth();
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
  return (
    <div className="space-y-4">
      {policies?.length > 0 ? (
        policies?.map((item: any, index: number) => (
          <div
            key={item.id ?? `doc-${index}`}
            className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-emerald-200/50 hover:shadow-lg transition-all duration-300"
          >
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
              {user?.role === "Admin" && (
                <button
                  onClick={() => handleCrisis(item.id)}
                  className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-gray-700">{item.content}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No Policy uploaded yet.</p>
      )}
    </div>
  );
};

export default PolicyList;
