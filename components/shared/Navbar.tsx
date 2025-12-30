"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { LogOut, KeyRound, User, CheckCircle, AlertCircle } from "lucide-react";
import { submitPasswordRequest } from "@/lib/services/passwordRequest.service";
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
  const [modalOpen, setModalOpen] = useState(false);
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

  const handleSubmitRequest = async () => {
    if (!requestMessage.trim()) return;
    try {
      setIsSubmitting(true);
      const resp = await submitPasswordRequest(user.user_id, requestMessage);
      if (resp?.status === "PENDING") {
        setToast({
          type: "error",
          message: "You already have a pending request.",
        });
      } else {
        setToast({
          type: "success",
          message: "Your password change request has been sent to the admin.",
        });
      }
      setRequestMessage("");
      setModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <nav className="bg-[#004225] border-b border-[#003218] sticky top-0 z-50 shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/somaliland-seal.png"
                  alt="Somaliland Seal"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
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
                    {user.role === "MinistryUser" && (
                      <button
                        onClick={() => {
                          setOpen(false);
                          setModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-white/90 hover:bg-white/10 transition"
                      >
                        <KeyRound className="w-4 h-4" />
                        Request Password Change
                      </button>
                    )}

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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Request Password Change</h2>
            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Enter message for admin..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white
      ${toast.type === "success" ? "bg-emerald-600" : "bg-red-500"}
    `}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}

          <span>{toast.message}</span>

          <button
            onClick={() => setToast(null)}
            className="ml-3 text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
