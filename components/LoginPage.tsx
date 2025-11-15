"use client";

import type React from "react";
import Image from "next/image";
import { useState } from "react";
import { Lock, Mail, LogIn } from "lucide-react";
import { loginUser } from "@/lib/services/userService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

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
          {error && (
            <div className="p-4 bg-red-100/80 border border-red-300/50 text-red-700 rounded-lg text-sm font-semibold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">
              Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-3 border border-emerald-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 bg-white/50 backdrop-blur-sm transition-all duration-300"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border border-emerald-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 bg-white/50 backdrop-blur-sm transition-all duration-300"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-emerald-400 disabled:to-emerald-500 text-white rounded-lg font-bold transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          {/* Info Box */}
          <div className="pt-4 border-t border-emerald-200/50">
            <p className="text-xs text-gray-600 text-center leading-relaxed">
              provide your credentials to access the Government Communication
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
