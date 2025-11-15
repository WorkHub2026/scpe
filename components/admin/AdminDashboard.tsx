"use client";

import { useState } from "react";
import DashboardView from "./views/DashboardView";
import UserManagementView from "./views/UserManagementView";
import MinistryProfilesView from "./views/MinistryProfilesView";
import DigitalAssetManagementView from "./views/DigitalAssetManagementView";
import Navbar from "../shared/Navbar";
import Sidebar from "../shared/Sidebar";

export default function AdminDashboard({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => void;
}) {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "users" | "profiles" | "digital-assets"
  >("dashboard");

  const [selectedTab, setSelectedTab] = useState<"submissions" | "ministries">(
    "submissions"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar
          role="Admin"
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        <main className="flex-1 p-8">
          {currentView === "dashboard" && (
            <DashboardView
              selectedTab={selectedTab}
              setSelectedTab={(tab: string) =>
                setSelectedTab(tab as "submissions" | "ministries")
              }
            />
          )}
          {currentView === "users" && <UserManagementView />}
          {currentView === "profiles" && <MinistryProfilesView />}
          {currentView === "digital-assets" && <DigitalAssetManagementView />}
        </main>
      </div>
    </div>
  );
}
