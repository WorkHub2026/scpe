"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, Filter, BarChart3 } from "lucide-react";
import { listDocuments, getDocumentCountsByMinistry } from "@/lib/services/documentService";

interface DocumentFilterViewProps {
  onFilterChange: (documents: any[]) => void;
}

export default function DocumentFilterView({ onFilterChange }: DocumentFilterViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [ministryCounts, setMinistryCounts] = useState<Array<{ ministry: string; count: number }>>([]);
  const [loading, setLoading] = useState(false);

  // Generate month/year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const applyFilters = async () => {
    setLoading(true);
    try {
      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (selectedMonth && selectedYear) {
        startDate = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, 1);
        const lastDay = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
        endDate = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, lastDay);
      } else if (selectedYear) {
        startDate = new Date(parseInt(selectedYear), 0, 1);
        endDate = new Date(parseInt(selectedYear), 11, 31);
      }

      const documents = await listDocuments({
        search: searchQuery || undefined,
        startDate,
        endDate,
      });

      // Get ministry counts for the same period
      const counts = await getDocumentCountsByMinistry({
        startDate,
        endDate,
      });
      setMinistryCounts(counts);

      onFilterChange(documents);
    } catch (error) {
      console.error("Failed to filter documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const documents = await listDocuments();
        const counts = await getDocumentCountsByMinistry({});
        setMinistryCounts(counts);
        onFilterChange(documents);
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedMonth || selectedYear) {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  const handleSearch = () => {
    applyFilters();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMonth("");
    setSelectedYear("");
    applyFilters();
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-[#004225]/30 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-[#004225]" />
          <h3 className="text-xl font-bold text-gray-900">Filter Documents</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by document name or ministry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white"
            />
          </div>

          {/* Month Select */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white"
          >
            <option value="">All Months</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          {/* Year Select */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-[#004225] hover:bg-[#003218] text-white rounded-lg font-bold transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {loading ? "Searching..." : "Search"}
          </button>
          <button
            onClick={clearFilters}
            className="px-6 py-2 border border-[#004225]/30 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Ministry Document Counts */}
      {ministryCounts.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-[#004225]/30 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[#004225]" />
            <h3 className="text-xl font-bold text-gray-900">
              Documents by Ministry
              {selectedMonth && selectedYear && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({months.find((m) => m.value === selectedMonth)?.label} {selectedYear})
                </span>
              )}
              {!selectedMonth && selectedYear && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({selectedYear})
                </span>
              )}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ministryCounts.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#004225]/10 to-[#004225]/5 p-4 rounded-lg border border-[#004225]/20"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">{item.ministry}</span>
                  <span className="text-2xl font-bold text-[#004225]">{item.count}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">documents submitted</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
