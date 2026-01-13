"use client";
import { CheckCircle, Clock, FileText } from "lucide-react";

const DocumentStat = ({ documents }: { documents: any[] }) => {
  // Dashboard Stats
  const stats = [
    {
      label: "Total Documents",
      value: documents.length.toString(),
      icon: FileText,
    },
    {
      label: "Accepted",
      value: documents.filter((d) => d.status === "Accepted").length.toString(),
      icon: CheckCircle,
    },
    {
      label: "Under Review",
      value: documents
        .filter((d) => d.status === "under-review")
        .length.toString(),
      icon: Clock,
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-gradient-to-br from-[#004225]/20 to-[#004225]/5 p-6 rounded-xl border border-[#004225]/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mt-2 text-[#004225]">
                  {stat.value}
                </p>
              </div>
              <Icon className="w-12 h-12 text-[#004225] opacity-20" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DocumentStat;
