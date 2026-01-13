"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import NotificationBell from "../NotificationBell";
export default function Navbar({
  user,
  ministry,
  onLogout,
  onSubmitPasswordRequest, // handler for submitting the request
}: {
  user: {
    user_id: number;
    username: string;
    type: string;
    role: "Admin" | "MinistryUser";
  };
  ministry?: string;
  onLogout: () => void;
  onSubmitPasswordRequest?: (message: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  const [requestMessage, setRequestMessage] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);
  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="bg-[#004225] border-b border-[#003218] sticky top-0 z-50 shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg">
                <Link href="/">
                  <Image
                    src="/somaliland-seal.png"
                    alt="Somaliland Seal"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white leading-tight">
                  Republic of Somaliland
                </h1>
                <p className="text-sm font-semibold text-white/90">
                  Government Communications
                </p>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-6">
              {/* User info + pulse */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/20 rounded-lg border border-white/30">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="text-sm">
                  <p className="font-medium text-white">{user.username}</p>
                  {ministry && (
                    <p className="text-xs text-white/60">{ministry}</p>
                  )}
                </div>
              </div>

              {user.role === "Admin" && (
                <NotificationBell userId={user.user_id} />
              )}

              {/* Profile Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpen((p) => !p)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 border border-white/30 hover:bg-white/30 transition"
                >
                  <User className="w-5 h-5 text-white" />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#01351F] border border-[#003218] shadow-xl rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-[#003218]">
                      <p className="text-white font-medium text-sm">
                        {user.username}
                      </p>
                      {ministry && (
                        <p className="text-xs text-white/60 truncate">
                          {ministry}
                        </p>
                      )}
                    </div>

                    {/* Request Password Change: Only Ministry Users */}

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition border-t border-[#003218]"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
