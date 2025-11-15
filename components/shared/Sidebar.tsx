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
    { id: "profiles", label: "Ministries", icon: Package, roles: ["Admin"] },
    // ✅ Ministry routes
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      roles: ["MinistryUser"],
    },
    {
      id: "brand",
      label: "Somaliland Brand",
      icon: Package,
      roles: ["MinistryUser"],
    },
    { id: "events", label: "Events", icon: Calendar, roles: ["MinistryUser"] },
  ];

  const links = allLinks.filter((link) => link.roles.includes(role));

  return (
    <aside
      className={`${
        sidebarOpen ? "w-72" : "w-0"
      } bg-white border-r border-[#004225]/30 min-h-screen transition-all duration-300 overflow-hidden ${className}`}
    >
      <div className="p-8 space-y-6">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
          {role === "Admin" ? "Admin Navigation" : "Ministry Navigation"}
        </p>

        <div className="space-y-2">
          {links.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setCurrentView(id as T);
                if (onToggle) onToggle();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                currentView === id
                  ? "bg-[#004225]/10 text-[#004225] border border-[#004225]/30 shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              aria-current={currentView === id ? "page" : undefined}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
              {currentView === id && <ArrowRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
