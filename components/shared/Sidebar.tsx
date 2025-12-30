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
  Key,
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
      id: "requests",
      label: "Password Requests",
      icon: Key,
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
    <aside className="w-64 bg-linear-to-b from-white/80 to-white/60 backdrop-blur-md border-r border-[#004225]/20 min-h-screen sticky top-16 flex flex-col items-center py-6 relative z-40">
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col items-center gap-4">
          {links.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              className="relative group flex justify-center px-2 w-full"
            >
              <button
                onClick={() => setCurrentView(id as any)}
                className={`
    relative w-52 px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300
    ${
      currentView === id
        ? "bg-[#004225] text-white shadow-lg shadow-[#004225]/40 scale-[1.03]"
        : "bg-white/60 text-[#004225] hover:bg-white/80 hover:scale-[1.02]"
    }
  `}
              >
                {/* Icon */}
                <Icon className="w-6 h-6 flex-shrink-0" />

                {/* Label – supports long text */}
                <span className="font-medium truncate">{label}</span>

                {/* Active dot */}
                {currentView === id && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#10b981] rounded-full shadow" />
                )}
              </button>

              {/* Tooltip */}
              {/* <div className="absolute left-[210px] top-1/2 -translate-y-1/2 hidden group-hover:flex z-50 pointer-events-none">
                <div className="bg-[#004225] text-white text-sm font-bold px-4 py-2 rounded-lg whitespace-nowrap shadow-xl">
                  {label}
                  <div className="absolute right-full mr-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#004225]"></div>
                </div>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
