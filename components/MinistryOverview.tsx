"use client";
import { ArrowRight } from "lucide-react";

export default function MinistryOverview() {
  const ministries = [
    { name: "Ministry of Health", icon: "🏥", files: 5, socials: 3 },
    { name: "Ministry of Education", icon: "📚", files: 8, socials: 4 },
    { name: "Ministry of Finance", icon: "💰", files: 3, socials: 2 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {ministries.map((m) => (
        <div
          key={m.name}
          className="bg-white/70 p-6 rounded-xl border border-emerald-200/50 hover:shadow-lg transition-all"
        >
          <div className="text-5xl mb-4">{m.icon}</div>
          <h3 className="font-bold text-gray-900">{m.name}</h3>
          <div className="mt-4 text-sm space-y-2">
            <div className="flex justify-between bg-emerald-50/60 p-2 rounded-lg">
              <span>Files</span> <span>{m.files}</span>
            </div>
            <div className="flex justify-between bg-emerald-50/60 p-2 rounded-lg">
              <span>Social Links</span> <span>{m.socials}</span>
            </div>
          </div>
          <button className="w-full mt-4 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-bold flex items-center justify-center gap-2">
            View Profile <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
