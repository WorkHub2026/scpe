"use client";

import React from "react";
import {
  Home,
  Users,
  FileText,
  Zap,
  Settings,
  ShieldCheck,
  Package,
  Calendar,
  ArrowRight,
  Inbox,
  Mail,
  AlertTriangle,
  FileCode,
} from "lucide-react";

type Role = "Admin" | "MinistryUser";

interface SidebarProps<T extends string = string> {
  role: Role;
  currentView: T;
  setCurrentView: React.Dispatch<React.SetStateAction<T>>;
  sidebarOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export default function Sidebar<T extends string>({
  role,
  currentView,
  setCurrentView,
  sidebarOpen = true,
  onToggle,
  className = "",
}: SidebarProps<T>) {
  const allLinks = [
    // ✅ Admin routes
    { id: "dashboard", label: "Dashboard", icon: Home, roles: ["Admin"] },
    { id: "users", label: "User Management", icon: Users, roles: ["Admin"] },
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      roles: ["MinistryUser"],
    },
    {
      id: "profiles",
      label: "Ministry Profile",
      icon: Package,
      roles: ["Admin"],
    },
    {
      id: "announcements",
      label: "Announcements",
      icon: Mail,
      roles: ["Admin", "MinistryUser"],
    },
    {
      id: "crisis",
      label: "Crisis Response",
      icon: AlertTriangle,
      roles: ["Admin", "MinistryUser"],
    },
    {
      id: "policy",
      label: "Policy",
      icon: FileCode,
      roles: ["Admin", "MinistryUser"],
    },
    {
      id: "digital-assets",
      label: "Somaliland Brand",
      icon: Zap,
      roles: ["Admin", "MinistryUser"],
    },
    // ✅ Ministry routes
  ];

  const links = allLinks.filter((link) => link.roles.includes(role));

  return (
    <aside className="w-24 bg-gradient-to-b from-white/80 to-white/60 backdrop-blur-md border-r border-[#004225]/20 min-h-screen sticky top-16 flex flex-col items-center py-6 relative z-40">
      <div className="space-y-4 flex flex-col items-center w-full">
        <div className="w-1 h-12 bg-gradient-to-b from-[#004225]/30 to-transparent rounded-full" />
        {/* Navigation Icons */}
        <div className="space-y-3 w-full flex flex-col items-center">
          {links.map(({ id, label, icon: Icon }) => (
            <div key={id} className="relative group">
              <button
                onClick={() => setCurrentView(id as any)}
                className={`relative w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center font-semibold ${
                  currentView === id
                    ? "bg-gradient-to-br from-[#004225] to-[#003218] text-white shadow-lg shadow-[#004225]/40 scale-110"
                    : "bg-white/40 text-[#004225] hover:bg-white/70 hover:scale-105"
                }`}
                title={label}
              >
                <Icon className="w-6 h-6" />
                {/* Active Indicator Dot */}
                {currentView === id && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#10b981] rounded-full shadow-lg shadow-[#10b981]/50" />
                )}
              </button>
              <div className="absolute left-24 top-1/2 -translate-y-1/2 hidden group-hover:flex z-50 pointer-events-none">
                <div className="bg-[#004225] text-white text-sm font-bold px-4 py-2 rounded-lg whitespace-nowrap shadow-xl ml-2">
                  {label}
                  <div className="absolute right-full mr-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#004225]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
