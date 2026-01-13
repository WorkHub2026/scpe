"use client";

import type React from "react";
import Image from "next/image";
import { useState } from "react";
import { Lock, Mail, LogIn, MessageSquare } from "lucide-react";
import { loginUser } from "@/lib/services/userService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import PasswordRequestModal from "./PasswordRequest/PasswordRequestModal";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [supportModal, setSupportModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const openSupportModal = () => setSupportModal(true);
  const closeSupportModal = () => {
    setSupportModal(false);
    setSupportEmail("");
    setSupportMessage("");
  };

  const handleSupportSubmit = (e: any) => {
    e.preventDefault();

    console.log("Support Request:", {
      email: supportEmail,
      message: supportMessage,
    });

    closeSupportModal();
  };
  const [username, setUsername] = useState(""); // use email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // loginUser already returns { user, token }
      const { user, token } = await loginUser(username, password);

      if (!user) {
        setError("Login failed");
        return;
      }

      // Store user in AuthProvider / localStorage
      login(user);
    } catch (err: any) {
      console.error(err);

      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-[#004225]/30 mx-auto mb-6 overflow-hidden">
            <Image
              src="/somaliland-seal.png"
              alt="Somaliland Government Seal"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#004225] to-[#003218] bg-clip-text text-transparent mb-3">
            Republic of Somaliland
          </h1>
          <p className="text-gray-600 text-lg">
            Government Communication Platform
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-emerald-200/50 shadow-xl shadow-emerald-500/10 space-y-6"
        >
          {/* Username */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">
              Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-3 border border-emerald-200/50 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border border-emerald-200/50 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 
            hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-bold 
            shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            {isLoading ? "Logging in..." : "Sign In"}
          </button>

          {/* Forgot Password */}
          <div className="text-center">
            <button
              onClick={() => setModalOpen(true)}
              type="button"
              className="text-emerald-700 text-sm font-medium hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Contact Support */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={openSupportModal}
              className="flex items-center gap-2 mx-auto text-sm text-gray-700 hover:text-emerald-700 transition"
            >
              <MessageSquare className="w-4 h-4" />
              Contact Support
            </button>
          </div>

          {/* Info Box */}
          <div className="pt-4 border-t border-emerald-200/50">
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              Contact technical team for any issues regarding login or access.
              Phone:0634222245 | Email:drkhaalids@gmail.com
            </p>
          </div>
        </form>
      </div>

      {/* Support Modal */}
      {supportModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg space-y-4 border border-emerald-200">
            <h2 className="text-xl font-bold text-[#004225]">
              Contact Support
            </h2>

            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Message
                </label>
                <textarea
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 h-28"
                  placeholder="Describe your issue..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeSupportModal}
                  className="cursor-pointer px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalOpen && <PasswordRequestModal setModalOpen={setModalOpen} />}
    </div>
  );
}
