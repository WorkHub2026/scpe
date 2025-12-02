"use client";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteCrisis, getAllCrisis } from "@/lib/services/crisis.service";

const CrisisList = ({ role }: { role: string | undefined }) => {
  const [crisisResponses, setCrisisResponses] = useState([]);

  const fetchCrisis = async () => {
    try {
      const data: any = await getAllCrisis();
      setCrisisResponses(data.crisis);
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCrisis();
  }, []);
  const getPriorityBadge = (priority: string) => {
    const styles = {
      HIGH: "bg-red-100/80 text-red-700 border border-red-300/50",
      MEDIUM: "bg-amber-100/80 text-amber-700 border border-amber-300/50",
      LOW: "bg-emerald-100/80 text-emerald-700 border border-emerald-300/50",
    };
    return styles[priority as keyof typeof styles] || "";
  };

  const handleCrisis = async (id: number) => {
    try {
      const response: any = await deleteCrisis(id);

      if (response.success) {
        await fetchCrisis(); // refresh list after delete
      } else {
        console.log("Delete failed:", response.error);
      }
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };
  return (
    <div className="space-y-4">
      {crisisResponses.length > 0 ? (
        crisisResponses?.map((item: any) => (
          <div
            key={item.id}
            className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-emerald-200/50 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${getPriorityBadge(
                      item.priority
                    )}`}
                  >
                    {item.priority} Priority
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  From: System Admin • {""}
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
              {role === "Admin" && (
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
        <p className="text-gray-600">No Crisis Response yet.</p>
      )}
    </div>
  );
};

export default CrisisList;
