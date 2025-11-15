"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import StatsOverview from "@/components/StatsOverView";
import Tabs from "@/components/Tabs";
import SubmissionList from "@/components/SubmissionList";
import MinistryOverview from "@/components/MinistryOverview";
import { listDocuments } from "@/lib/services/documentService";

export default function DashboardView({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data: any = await listDocuments();
        setDocuments(data);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDocuments();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Document Review Dashboard
        </h2>
        <p className="text-gray-600 mt-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#004225]" />
          Centralized review of all ministry submissions
        </p>
      </div>

      {/* Stats */}
      <StatsOverview documents={documents} />

      {/* Tabs */}
      <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {/* Tab Content */}
      {loading ? (
        <p className="text-gray-600">Loading documents...</p>
      ) : selectedTab === "submissions" ? (
        <SubmissionList documents={documents} />
      ) : (
        <MinistryOverview />
      )}
    </div>
  );
}
