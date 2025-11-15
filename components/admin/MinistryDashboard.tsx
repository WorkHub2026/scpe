"use client";

import { useState } from "react";

import BrandAssetsView from "./views/BrandAssetsView";
import DocumentsView from "./views/DocumentView";
import Navbar from "../shared/Navbar";
import Sidebar from "../shared/Sidebar";

export default function MinistryDashboard({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => void;
}) {
  const [currentView, setCurrentView] = useState<"documents" | "brand">(
    "documents"
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white">
      <Navbar user={user} onLogout={onLogout} ministry={user.ministry} />
      <div className="flex">
        <Sidebar
          role="MinistryUser"
          currentView={currentView}
          setCurrentView={setCurrentView}
          sidebarOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto w-full">
          {currentView === "documents" && <DocumentsView />}
          {currentView === "brand" && <BrandAssetsView />}
        </main>
      </div>
    </div>
  );
}
