import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function StatsOverview({ documents }: { documents: any[] }) {
  const total = documents.length;
  const underReview = documents.filter(
    (d) => d.status === "under-review"
  ).length;
  const accepted = documents.filter((d) => d.status === "Accepted").length;
  const denied = documents.filter((d) => d.status === "Denied").length;

  const stats = [
    {
      label: "Total Submissions",
      value: total,
      icon: FileText,
      color: "emerald",
      trend: "+12%",
    },
    {
      label: "Under Review",
      value: underReview,
      icon: Clock,
      color: "amber",
      trend: "+3%",
    },
    {
      label: "Accepted",
      value: accepted,
      icon: CheckCircle,
      color: "emerald",
      trend: "+5%",
    },
    {
      label: "Denied",
      value: denied,
      icon: AlertCircle,
      color: "red",
      trend: "-2%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        const colors: any = {
          emerald:
            "from-emerald-500/20 to-emerald-400/5 text-emerald-600" as string,
          amber: "from-amber-500/20 to-amber-400/5 text-amber-600" as string,
          red: "from-red-500/20 to-red-400/5 text-red-600" as string,
        };
        const [bgGradient, textColor] = colors[stat.color].split(" ");
        return (
          <div
            key={idx}
            className={`bg-gradient-to-br ${bgGradient} p-6 rounded-xl border border-emerald-300/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold mt-2 ${textColor}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {stat.trend} this month
                </p>
              </div>
              <Icon
                className={`w-12 h-12 ${textColor} opacity-20 group-hover:opacity-30`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
