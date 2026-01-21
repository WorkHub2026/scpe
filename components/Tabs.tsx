"use client";
export default function Tabs({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}) {
  return (
    <div className="border-b border-emerald-200/50 backdrop-blur-sm">
      <div className="flex gap-8 overflow-x-auto">
        {["submissions", "ministries"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`py-4 px-2 font-semibold transition-all duration-300 border-b-2 relative ${
              selectedTab === tab
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab === "submissions"
              ? "Soo-gudbintii u dambaysay"
              : "Diiwaanka Guud"}
          </button>
        ))}
      </div>
    </div>
  );
}
