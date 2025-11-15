"use client";
import { LucideIcon } from "lucide-react";

export default function StatsCard({
  label,
  value,
  icon: Icon,
  color = "emerald",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: "emerald" | "amber" | "red";
}) {
  const bgGradient =
    color === "emerald"
      ? "from-[#004225]/20 to-[#004225]/5"
      : color === "amber"
      ? "from-amber-500/20 to-amber-400/5"
      : "from-red-500/20 to-red-400/5";

  const textColor =
    color === "emerald"
      ? "text-[#004225]"
      : color === "amber"
      ? "text-amber-600"
      : "text-red-600";

  return (
    <div
      className={`bg-gradient-to-br ${bgGradient} p-6 rounded-xl border border-[#004225]/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
        </div>
        <Icon className={`w-12 h-12 ${textColor} opacity-20`} />
      </div>
    </div>
  );
}
